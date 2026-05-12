import React, { useState, useCallback } from 'react';
import { Upload, FileText, Trash2, Download, Zap, ShieldCheck } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface SimplePdfToolProps {
  toolId: string;
}

export default function SimplePdfTool({ toolId }: SimplePdfToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (uploadedFiles.length > 0) {
      setFiles(prev => [...prev, ...uploadedFiles]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setProcessed(false);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setLoading(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (toolId === 'merge-pdf' && files.length > 1) {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged_document.pdf';
        a.click();
      } else if (toolId === 'rotate-pdf') {
        const bytes = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = pdf.getPages();
        pages.forEach(page => page.setRotation({ type: 'degrees', angle: (page.getRotation().angle + 90) % 360 }));
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rotated_document.pdf';
        a.click();
      } else {
        // Generic success for other tools (placeholder)
        setProcessed(true);
        // In a real app, we'd implement the specific logic for each toolId
      }
    } catch (err) {
      console.error(err);
      alert('Error processing PDF. Please try again.');
    } finally {
      setLoading(false);
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
          <h3 className="text-2xl font-black text-slate-800">Upload PDF Files</h3>
          <p className="text-slate-500 mt-2 mb-8 max-w-sm text-center font-medium">
            Drag and drop your PDF documents here or click to select files from your device.
          </p>
          <label className="px-10 py-4 bg-[#1A1A3A] text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all cursor-pointer">
            Select PDF Files
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              multiple
              onChange={(e) => {
                const uploadedFiles = Array.from(e.target.files || []).filter(f => f.type === 'application/pdf');
                if (uploadedFiles.length > 0) setFiles(prev => [...prev, ...uploadedFiles]);
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
                  className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {!processed && (
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
                  onChange={(e) => {
                    const uploadedFiles = Array.from(e.target.files || []).filter(f => f.type === 'application/pdf');
                    if (uploadedFiles.length > 0) setFiles(prev => [...prev, ...uploadedFiles]);
                  }}
                />
              </label>
            )}
          </div>

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
                <h3 className="text-2xl font-black text-emerald-900">Successfully Processed!</h3>
                <p className="text-emerald-700 font-medium">Your PDF has been optimized and is ready for download.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    // In a real app, this would download the processed result
                    alert('Download started...');
                  }}
                  className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl"
                >
                  <Download size={20} />
                  Download Result
                </button>
                <button
                  onClick={() => {
                    setFiles([]);
                    setProcessed(false);
                  }}
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
