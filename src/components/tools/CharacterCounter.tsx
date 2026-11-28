import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { copyTextToClipboard } from '../../lib/clipboard';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const trimmedText = text.trim();
  const stats = {
    characters: Array.from(text).length,
    charactersNoSpaces: Array.from(text.replace(/\s/g, '')).length,
    words: trimmedText ? trimmedText.split(/\s+/u).length : 0,
    lines: text ? text.split('\n').length : 0,
    sentences: trimmedText ? text.split(/[.!?]+/u).filter(part => part.trim()).length : 0,
  };

  const handleCopy = async () => {
    if (!text) return;
    if (await copyTextToClipboard(text)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      window.prompt('Copy your text:', text);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="text-2xl font-bold text-indigo-600">{value}</div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">
              {label.replace(/([A-Z])/g, ' $1')}
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <textarea
          aria-label="Text to count"
          className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setCopied(false);
          }}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm disabled:opacity-50"
            title="Copy Text"
            aria-label="Copy text"
          >
            {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          </button>
          <button
            type="button"
            onClick={() => { setText(''); setCopied(false); }}
            disabled={!text}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm disabled:opacity-50"
            title="Clear Text"
            aria-label="Clear text"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
