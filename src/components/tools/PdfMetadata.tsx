import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Info, Trash2, Calendar, User, Tag, Lock } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMetadata() {
  const [metadata, setMetadata] = useState<any>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file.');
      return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2) + ' MB');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
      
      setMetadata({
        title: pdfDoc.getTitle() || 'N/A',
        author: pdfDoc.getAuthor() || 'N/A',
        subject: pdfDoc.getSubject() || 'N/A',
        creator: pdfDoc.getCreator() || 'N/A',
        producer: pdfDoc.getProducer() || 'N/A',
        creationDate: pdfDoc.getCreationDate()?.toLocaleString() || 'N/A',
        modificationDate: pdfDoc.getModificationDate()?.toLocaleString() || 'N/A',
        pageCount: pdfDoc.getPageCount(),
        isEncrypted: pdfDoc.isEncrypted
      });
    } catch (err) {
      console.error(err);
      alert('Error reading PDF metadata. The file might be protected or corrupted.');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (loadingRef.current) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  return (
    <div className="space-y-8">
      {!metadata ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed transition-all ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
            <FileText size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Analyze PDF</h2>
          <p className="text-slate-500 mt-2 mb-8 max-w-xs text-center">
            Upload a PDF to view its hidden metadata, page count, and more.
          </p>
          <label className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-500 transition-all cursor-pointer">
            {loading ? 'Analyzing...' : 'Select PDF'}
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.currentTarget.value = ''; }}
              disabled={loading}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{fileName}</h4>
                <p className="text-sm text-indigo-600 font-medium">{fileSize} • {metadata.pageCount} Pages</p>
              </div>
            </div>
            <button
              onClick={() => { setMetadata(null); setFileName(''); setFileSize(''); }}
              className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Title', value: metadata.title, icon: Tag },
              { label: 'Author', value: metadata.author, icon: User },
              { label: 'Subject', value: metadata.subject, icon: Info },
              { label: 'Creator', value: metadata.creator, icon: SettingsIcon },
              { label: 'Producer', value: metadata.producer, icon: FileText },
              { label: 'Creation Date', value: metadata.creationDate, icon: Calendar },
              { label: 'Modification Date', value: metadata.modificationDate, icon: Calendar },
              { label: 'Encryption', value: metadata.isEncrypted ? 'Encrypted' : 'None', icon: Lock },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-4">
                <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                  {item.icon ? <item.icon size={20} /> : <Info size={20} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-slate-900 font-medium break-all">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to avoid missing icon
const SettingsIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
