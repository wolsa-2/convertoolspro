import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = {
    characters: Array.from(text).length,
    charactersNoSpaces: Array.from(text.replace(/\s/g, '')).length,
    words: text.trim() ? text.trim().split(/\s+/u).length : 0,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    sentences: text.trim() ? (text.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) || []).filter(s => s.trim()).length : 0,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      alert('Clipboard access failed. Select and copy the text manually.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="text-2xl font-bold text-indigo-600">{value}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{label.replace(/([A-Z])/g, ' $1')}</div>
          </div>
        ))}
      </div>
      <div className="relative">
        <textarea className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm" placeholder="Paste or type your text here..." value={text} onChange={e => setText(e.target.value)} />
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleCopy} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 shadow-sm" title="Copy Text" aria-label="Copy text">{copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}</button>
          <button onClick={() => { setText(''); setCopied(false); }} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-rose-600 shadow-sm" title="Clear Text" aria-label="Clear text"><Trash2 size={18} /></button>
        </div>
      </div>
      <p className="text-xs text-slate-500">Character count treats Unicode code points (including Hindi characters) as characters; some combined emoji may count as more than one.</p>
    </div>
  );
}
