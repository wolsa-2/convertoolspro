import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, FileText, Trash2, Download, Zap, ShieldCheck } from 'lucide-react';
import type { PDFDocument as PDFDocumentType } from 'pdf-lib';

interface SimplePdfToolProps {
  toolId: string;
}

interface SplitResult {
  name: string;
  pageIndex: number;
}

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

export default function SimplePdfTool({ toolId }: SimplePdfToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [watermarkText, setWatermarkText] = useState('PhotoSize');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('');
  const [splitResults, setSplitResults] = useState<SplitResult[]>([]);
  const splitPdfRef = useRef<PDFDocumentType | null>(null);
  const splitDownloadLockRef = useRef(false);
  const processLockRef = useRef(false);
  const [splitDownloading, setSplitDownloading] = useState(false);

  useEffect(() => () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFiles = (Array.from(e.dataTransfer.files) as File[]).filter(isPdfFile);
    if (uploadedFiles.length > 0) {
      if (toolId === 'merge-pdf') {
        setFiles(prev => [...prev, ...uploadedFiles]);
      } else {
        setFiles([uploadedFiles[0]]);
      }
    }
  }, [toolId]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setProcessed(false);
    setDownloadUrl(null);
    setSplitResults([]);
    splitPdfRef.current = null;
  };

  const handleProcess = async () => {
    if (files.length === 0 || processLockRef.current) return;
    processLockRef.current = true;
    setLoading(true);
    setDownloadUrl(null);
    setSplitResults([]);
    splitPdfRef.current = null;

    try {
      if (toolId === 'merge-pdf') {
        if (files.length < 2) {
          throw new Error('Select at least two PDF files to merge.');
        }
        const { PDFDocument } = await import('pdf-lib');
        const mergedPdf = await PDFDocument.create();

        // Keep each source document and its input buffer scoped to one iteration.
        // This lets the browser garbage-collect source data before the next file
        // is parsed, instead of retaining loop-local references across the merge.
        const appendSourcePdf = async (file: File) => {
          const bytes = await file.arrayBuffer();
          const sourcePdf = await PDFDocument.load(bytes);

          // Copy one page at a time to avoid holding a second full set of
          // copied page objects for a large source PDF.
          for (let pageIndex = 0; pageIndex < sourcePdf.getPageCount(); pageIndex++) {
            const [page] = await mergedPdf.copyPages(sourcePdf, [pageIndex]);
            mergedPdf.addPage(page);
          }
        };

        for (const file of files) {
          await appendSourcePdf(file);
        }

        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setDownloadName('merged_photosize.pdf');
        setProcessed(true);
      } else if (toolId === 'rotate-pdf' && files.length > 0) {
        if (files.length > 1) throw new Error('Rotate one PDF at a time.');
        const { PDFDocument, degrees } = await import('pdf-lib');
        const bytes = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = pdf.getPages();
        pages.forEach(page => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + 90) % 360));
        });
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setDownloadName('rotated_photosize.pdf');
        setProcessed(true);
      } else if (toolId === 'protect-pdf' && files.length > 0) {
        throw new Error('PDF password protection is not supported by the current browser-only engine. Your original file has not been changed.');
      } else if (toolId === 'split-pdf' && files.length > 0) {
        if (files.length > 1) throw new Error('Split one PDF at a time.');
        const { PDFDocument } = await import('pdf-lib');
        const bytes = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pageCount = pdf.getPageCount();
        if (pageCount < 2) {
          throw new Error('This PDF has only one page, so there are no separate pages to split.');
        }
        if (pageCount > 100) {
          throw new Error('For mobile browser stability, split is currently limited to PDFs with 100 pages or fewer.');
        }

        // Keep the parsed source PDF once and generate each page only when requested.
        // This avoids retaining up to 100 separate PDF blobs in browser memory.
        splitPdfRef.current = pdf;
        const results = Array.from({ length: pageCount }, (_, pageIndex) => ({
          name: `split_page_${pageIndex + 1}.pdf`,
          pageIndex,
        }));
        setSplitResults(results);
        setProcessed(true);
      } else if (toolId === 'compress-pdf' && files.length > 0) {
        throw new Error('True PDF compression is not available in the current browser-only engine. Re-saving a PDF is not reliable compression, so no misleading output was created.');
      } else if (toolId === 'unlock-pdf' && files.length > 0) {
        throw new Error('PDF unlocking is not supported by the current browser-only engine. Only process documents you own or are authorized to modify.');
      } else if (toolId === 'watermark-pdf' && files.length > 0) {
        if (files.length > 1) throw new Error('Add a watermark to one PDF at a time.');
        const { PDFDocument } = await import('pdf-lib');
        const label = watermarkText.trim();
        if (!label) throw new Error('Enter watermark text before processing.');
        const bytes = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = pdf.getPages();
        pages.forEach(page => {
          const { width, height } = page.getSize();
          page.drawText(label, {
            x: 40,
            y: Math.min(40, Math.max(10, height - 40)),
            size: 24,
            opacity: 0.2,
            maxWidth: Math.max(80, width - 80)
          });
        });
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setDownloadName('watermarked_photosize.pdf');
        setProcessed(true);
      } else {
        throw new Error('This PDF operation is not available yet. Your original file has not been changed.');
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Error processing PDF. Please try again.');
    } finally {
      processLockRef.current = false;
      setLoading(false);
    }
  };

  const handleSplitDownload = async (result: SplitResult) => {
    if (splitDownloadLockRef.current) return;
    if (!splitPdfRef.current) {
      alert('The source PDF is no longer available. Please upload it again.');
      return;
    }

    splitDownloadLockRef.current = true;
    setSplitDownloading(true);
    let objectUrl: string | null = null;
    try {
      const { PDFDocument } = await import('pdf-lib');
      const sourcePdf = splitPdfRef.current;
      const splitPdf = await PDFDocument.create();
      const [page] = await splitPdf.copyPages(sourcePdf, [result.pageIndex]);
      splitPdf.addPage(page);
      const pdfBytes = await splitPdf.save();
      objectUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = result.name;
      anchor.click();
      const urlToRevoke = objectUrl;
      objectUrl = null;
      window.setTimeout(() => URL.revokeObjectURL(urlToRevoke), 1000);
    } catch (err) {
      console.error(err);
      alert('Could not create this page. Please try again.');
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      splitDownloadLockRef.current = false;
      setSplitDownloading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = downloadName;
      a.click();
    } else {
      alert('File not ready yet.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {files.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed transition-all ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
            <Upload size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Upload PDF Files</h2>
          <p className="text-slate-500 mt-2 mb-8 max-w-sm text-center font-medium">
            Drag and drop your PDF documents here or click to select files from your device.
          </p>
          <label className="px-10 py-4 bg-[#1A1A3A] text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all cursor-pointer">
            Select PDF Files
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              multiple={toolId === 'merge-pdf'}
              onChange={(e) => {
                const uploadedFiles = (Array.from(e.target.files || []) as File[]).filter(isPdfFile);
                if (uploadedFiles.length > 0) {
                  if (toolId === 'merge-pdf') setFiles(prev => [...prev, ...uploadedFiles]);
                  else setFiles([uploadedFiles[0]]);
                }
                e.target.value = '';
              }}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm group">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-800 truncate">{file.name}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  disabled={loading || splitDownloading}
                  aria-label={`Remove ${file.name}`}
                  className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {!processed && toolId === 'merge-pdf' && (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:bg-white transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all mb-2">
                  <Upload size={20} />
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Add More</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  multiple
                  disabled={loading}
                  onChange={(e) => {
                    const uploadedFiles = (Array.from(e.target.files || []) as File[]).filter(isPdfFile);
                    if (uploadedFiles.length > 0) setFiles(prev => [...prev, ...uploadedFiles]);
                    e.target.value = '';
                  }}
                />
              </label>
            )}
          </div>

          {toolId === 'watermark-pdf' && !processed && (
            <div className="bg-white p-6 rounded-[2rem] border border-indigo-100 shadow-sm space-y-3">
              <label className="block text-sm font-black text-slate-700 uppercase tracking-wider" htmlFor="pdf-watermark-text">Watermark text</label>
              <input
                id="pdf-watermark-text"
                type="text"
                maxLength={80}
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text"
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
          )}

          {!processed ? (
            <div className="flex justify-center pt-8">
              <button
                onClick={handleProcess}
                disabled={loading}
                className={`flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-200 transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:-translate-y-1'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap size={20} fill="currentColor" />
                    Process Now
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 py-12 bg-emerald-50 rounded-[3rem] border border-emerald-100">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
                <ShieldCheck size={40} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-emerald-900">Successfully Processed!</h2>
                <p className="text-emerald-700 font-medium">{toolId === 'split-pdf' ? `${splitResults.length} separate PDF pages are ready to download.` : 'Your PDF is ready for download.'}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {toolId === 'split-pdf' ? splitResults.map((result) => (
                  <button
                    key={result.name}
                    onClick={() => handleSplitDownload(result)}
                    disabled={splitDownloading}
                    className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-wait"
                  >
                    <Download size={18} />
                    {result.name}
                  </button>
                )) : (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl"
                  >
                    <Download size={20} />
                    Download Result
                  </button>
                )}
                <button
                  onClick={() => {
                    setFiles([]);
                    setProcessed(false);
                    setDownloadUrl(null);
                    setSplitResults([]);
                    splitPdfRef.current = null;
                    setWatermarkText('PhotoSize');
                  }}
                  disabled={splitDownloading}
                  className="px-10 py-4 bg-white text-emerald-700 border border-emerald-200 rounded-2xl font-black hover:bg-emerald-50 transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
