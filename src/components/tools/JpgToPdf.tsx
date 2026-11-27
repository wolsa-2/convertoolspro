import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Trash2, FileImage, Download, MoveUp, MoveDown, Plus } from 'lucide-react';

const MAX_JPG_FILE_BYTES = 25 * 1024 * 1024;
const MAX_JPG_TOTAL_BYTES = 100 * 1024 * 1024;

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: string;
}

export default function JpgToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const totalImageBytesRef = useRef(0);
  const conversionLockRef = useRef(false);

  useEffect(() => () => {
    previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    previewUrlsRef.current.clear();
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const selectedFiles = Array.from(files);
    const validFiles = selectedFiles.filter(file =>
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg' ||
      /\.jpe?g$/i.test(file.name)
    );
    if (validFiles.length !== selectedFiles.length) {
      alert('Only JPG/JPEG images are supported. Unsupported files were skipped.');
    }
    const sizeValidFiles = validFiles.filter(file => file.size <= MAX_JPG_FILE_BYTES);
    if (sizeValidFiles.length !== validFiles.length) {
      alert('Images larger than 25 MB were skipped.');
    }
    const acceptedFiles: File[] = [];
    let acceptedBytes = totalImageBytesRef.current;
    for (const file of sizeValidFiles) {
      if (acceptedBytes + file.size > MAX_JPG_TOTAL_BYTES) continue;
      acceptedFiles.push(file);
      acceptedBytes += file.size;
    }
    if (acceptedFiles.length !== sizeValidFiles.length) {
      alert('The total JPG image size cannot exceed 100 MB. Some images were skipped.');
    }
    if (acceptedFiles.length === 0) return;

    try {
      const loadedImages = acceptedFiles.map(file => {
        const preview = URL.createObjectURL(file);
        previewUrlsRef.current.add(preview);
        return {
          id: `${file.name}-${file.lastModified}-${crypto.randomUUID?.() || Date.now().toString(36)}`,
          file,
          preview,
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
        };
      });
      totalImageBytesRef.current += acceptedFiles.reduce((total, file) => total + file.size, 0);
      setImages(prev => [...prev, ...loadedImages]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'One or more images could not be read.');
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isConverting) return;
    handleFiles(e.dataTransfer.files);
  }, [isConverting]);

  const removeImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (image) {
      URL.revokeObjectURL(image.preview);
      previewUrlsRef.current.delete(image.preview);
      totalImageBytesRef.current = Math.max(0, totalImageBytesRef.current - image.file.size);
    }
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newImages.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      setImages(newImages);
    }
  };

  const convertToPdf = async () => {
    if (images.length === 0 || conversionLockRef.current) return;
    conversionLockRef.current = true;
    setIsConverting(true);

    try {
      // Load the PDF engine only when the user starts conversion.
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const tempImg = new Image();
        await new Promise<void>((resolve, reject) => {
          const releaseTempImage = () => {
            tempImg.onload = null;
            tempImg.onerror = null;
            tempImg.removeAttribute('src');
          };

          tempImg.onload = () => {
            try {
              const imgProps = pdf.getImageProperties(tempImg);
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              const scale = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
              const drawWidth = imgProps.width * scale;
              const drawHeight = imgProps.height * scale;
              const x = (pageWidth - drawWidth) / 2;
              const y = (pageHeight - drawHeight) / 2;

              if (i > 0) pdf.addPage();
              pdf.addImage(tempImg, 'JPEG', x, y, drawWidth, drawHeight);
              // Release decoded image resources on both success and failure.
              releaseTempImage();
              resolve();
            } catch (error) {
              releaseTempImage();
              reject(error);
            }
          };
          tempImg.onerror = () => {
            releaseTempImage();
            reject(new Error(`Could not decode ${img.name}. Please choose a valid JPG image.`));
          };
          try {
            tempImg.src = img.preview;
          } catch (error) {
            releaseTempImage();
            reject(error);
          }
        });
      }

      pdf.save('converted-images.pdf');
    } catch (error) {
      console.error('PDF conversion failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to convert images to PDF. Please try again.');
    } finally {
      conversionLockRef.current = false;
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed transition-all ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
        }`}
      >
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
          <Upload size={32} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Upload JPG Images</h2>
        <p className="text-slate-500 mt-1 mb-6 text-sm text-center">
          Drag and drop multiple JPG files here, or click to select.
        </p>
        <label className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all cursor-pointer flex items-center gap-2">
          <Plus size={18} />
          Select Files
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/jpg"
            multiple
            disabled={isConverting}
            onChange={(e) => { handleFiles(e.target.files); e.currentTarget.value = ''; }}
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <FileImage size={20} className="text-indigo-600" />
              Selected Images ({images.length})
            </h4>
            <button
              onClick={convertToPdf}
              disabled={isConverting}
              className={`px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-500 transition-all flex items-center gap-2 ${
                isConverting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Download size={18} />
              {isConverting ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 mb-4 relative">
                  <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => moveImage(index, 'up')}
                      disabled={isConverting || index === 0}
                      className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <MoveUp size={18} />
                    </button>
                    <button
                      onClick={() => moveImage(index, 'down')}
                      disabled={isConverting || index === images.length - 1}
                      className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <MoveDown size={18} />
                    </button>
                    <button
                      onClick={() => removeImage(img.id)}
                      disabled={isConverting}
                      className="p-2 bg-rose-500/80 hover:bg-rose-500 rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded-md">
                    #{index + 1}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate" title={img.name}>{img.name}</p>
                  <p className="text-xs text-slate-400">{img.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
