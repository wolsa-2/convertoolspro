import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Copy, Check, Trash2, FileImage, FileCode } from 'lucide-react';

export default function ImageToBase64() {
  const [base64, setBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const readerRef = useRef<FileReader | null>(null);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => () => {
    readerRef.current?.abort();
    readerRef.current = null;
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('Please choose an image smaller than 20 MB for reliable browser processing.');
      return;
    }

    readerRef.current?.abort();
    const reader = new FileReader();
    readerRef.current = reader;
    setBase64('');
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(2) + ' KB');

    reader.onload = (e) => {
      if (readerRef.current !== reader) return;
      const result = e.target?.result;
      if (typeof result === 'string') {
        setBase64(result);
      } else {
        setBase64('');
        setPreviewUrl('');
        setFileName('');
        setFileSize('');
        alert('The selected image could not be converted. Please try another file.');
      }
      readerRef.current = null;
    };
    reader.onerror = () => {
      if (readerRef.current !== reader) return;
      readerRef.current = null;
      setBase64('');
      setPreviewUrl('');
      setFileName('');
      setFileSize('');
      alert('The selected image could not be read. Please try another file.');
    };
    reader.onabort = () => {
      if (readerRef.current === reader) readerRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleCopy = async () => {
    if (!base64) return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(base64);
      else { window.prompt('Copy Base64 data:', base64); }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy Base64 data:', base64);
    }
  };

  return (
    <div className="space-y-8">
      {!base64 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed transition-all ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
            <Upload size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Upload Image</h2>
          <p className="text-slate-500 mt-2 mb-8 max-w-xs text-center">
            Drag and drop your image here, or click to select a file.
          </p>
          <label className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-500 transition-all cursor-pointer">
            Select Image
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.currentTarget.value = ''; }}
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <FileImage size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{fileName}</h4>
                  <p className="text-sm text-slate-500">{fileSize}</p>
                </div>
                <button
                  onClick={() => { readerRef.current?.abort(); readerRef.current = null; setBase64(''); setPreviewUrl(''); setFileName(''); setFileSize(''); }}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <FileCode size={14} /> Base64 Data
              </label>
              <button
                onClick={handleCopy}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy Data'}
              </button>
            </div>
            <textarea
              readOnly
              className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-3xl font-mono text-xs resize-none outline-none break-all"
              value={base64}
            />
            <p className="text-xs text-slate-400 italic">
              * This string can be used directly in HTML as &lt;img src="{base64.substring(0, 20)}..." /&gt;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
