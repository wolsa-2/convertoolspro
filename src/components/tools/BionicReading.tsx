import React, { useState } from 'react';
import { Zap, Copy, Check, Trash2 } from 'lucide-react';

export default function BionicReading() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  const handleCopy = async () => {
    if (!text.trim()) return;
    setCopyError('');
    const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character] || character));
    const html = text.split('\n').map(line => `<p>${line.split(/(\s+)/).map(word => {
      if (/^\s+$/.test(word)) return word;
      const splitAt = Math.max(1, Math.ceil(word.length / 2));
      return `<strong>${escapeHtml(word.slice(0, splitAt))}</strong>${escapeHtml(word.slice(splitAt))}`;
    }).join('')}</p>`).join('');
    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' })
        })]);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        window.prompt('Copy the Bionic Reading text:', text);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      try { window.prompt('Copy the Bionic Reading text:', text); }
      catch { setCopyError('Clipboard access is unavailable in this browser.'); }
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Original Text</label>
          <textarea
            className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm leading-relaxed"
            placeholder="Paste text to convert to Bionic Reading format..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Bionic Preview</label>
          <div className="w-full h-80 p-8 bg-white border border-slate-200 rounded-3xl overflow-y-auto text-sm leading-relaxed text-slate-700">
            {text ? (
              <div className="prose prose-slate max-w-none">
                {text.split('\n').map((line, i) => (
                  <p key={i} className="mb-4">
                    {line.split(' ').map((word, j) => {
                      if (!word) return null;
                      const mid = word.length <= 3 ? 1 : Math.ceil(word.length / 2);
                      return (
                        <span key={j} className="mr-1">
                          <strong className="font-black text-slate-900">{word.slice(0, mid)}</strong>
                          <span className="text-slate-500">{word.slice(mid)}</span>
                        </span>
                      );
                    })}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 italic">
                <Zap size={32} className="mb-2 opacity-20" />
                Preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {copyError && <p role="alert" className="text-sm text-rose-600">{copyError}</p>}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => { setText(''); setCopied(false); setCopyError(''); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:text-rose-600 hover:border-rose-200 transition-all"
        >
          <Trash2 size={18} />
          Clear
        </button>
        <button
          onClick={handleCopy}
          disabled={!text.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          Copy Bionic Text
        </button>
      </div>
    </div>
  );
}
