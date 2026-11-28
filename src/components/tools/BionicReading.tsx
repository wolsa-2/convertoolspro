import React, { useState } from 'react';
import { Zap, Copy, Check, Trash2 } from 'lucide-react';

const getBionicParts = (word: string) => {
  const characters = Array.from(word);
  const splitAt = Math.max(1, Math.ceil(characters.length / 2));
  return [characters.slice(0, splitAt).join(''), characters.slice(splitAt).join('')];
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character] || character));

export default function BionicReading() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  const handleCopy = async () => {
    if (!text.trim()) return;
    setCopyError('');

    const html = text.split('\n').map(line => {
      const content = line.split(/(\s+)/).map(part => {
        if (!part || /^\s+$/.test(part)) return escapeHtml(part);
        const [bold, regular] = getBionicParts(part);
        return `<strong>${escapeHtml(bold)}</strong>${escapeHtml(regular)}`;
      }).join('');
      return `<p>${content || '<br>'}</p>`;
    }).join('');

    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' })
        })]);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        window.prompt('Copy the text (plain text only in this browser):', text);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        window.prompt('Copy the text (plain text only):', text);
      } catch {
        setCopyError('Clipboard access is unavailable in this browser.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="bionic-original-text" className="text-sm font-bold text-slate-700 ml-1">Original Text</label>
          <textarea
            id="bionic-original-text"
            className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm leading-relaxed"
            placeholder="Paste text to convert to Bionic Reading format..."
            value={text}
            onChange={(e) => { setText(e.target.value); setCopied(false); setCopyError(''); }}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-slate-700 ml-1">Bionic Preview</p>
          <div className="w-full h-80 p-8 bg-white border border-slate-200 rounded-3xl overflow-y-auto text-sm leading-relaxed text-slate-700">
            {text ? (
              <div className="prose prose-slate max-w-none">
                {text.split('\n').map((line, i) => (
                  <p key={i} className="mb-4">
                    {line.split(/(\s+)/).map((part, j) => {
                      if (!part) return null;
                      if (/^\s+$/.test(part)) return <React.Fragment key={j}>{part}</React.Fragment>;
                      const [bold, regular] = getBionicParts(part);
                      return (
                        <React.Fragment key={j}>
                          <strong className="font-black text-slate-900">{bold}</strong>
                          <span className="text-slate-500">{regular}</span>
                        </React.Fragment>
                      );
                    })}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 italic">
                <Zap size={32} className="mb-2 opacity-20" aria-hidden="true" />
                Preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {copyError && <p role="alert" className="text-sm text-rose-600">{copyError}</p>}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => { setText(''); setCopied(false); setCopyError(''); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:text-rose-600 hover:border-rose-200 transition-all"
        >
          <Trash2 size={18} aria-hidden="true" />
          Clear
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!text.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          Copy Bionic Text
        </button>
      </div>
    </div>
  );
}
