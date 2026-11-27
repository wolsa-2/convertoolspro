import React, { useState } from 'react';
import { Copy, Check, Trash2, FileJson, Minimize2, Maximize2 } from 'lucide-react';
import { copyTextToClipboard } from '../../lib/clipboard';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const format = (type: 'beautify' | 'minify') => {
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      const result = type === 'beautify' 
        ? JSON.stringify(parsed, null, 2) 
        : JSON.stringify(parsed);
      setInput(result);
      setError('');
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message);
    }
  };

  const handleCopy = async () => {
    if (await copyTextToClipboard(input)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      window.prompt('Copy JSON:', input);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => format('beautify')}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
        >
          <Maximize2 size={18} />
          Beautify
        </button>
        <button
          onClick={() => format('minify')}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-100 hover:bg-slate-700 transition-all"
        >
          <Minimize2 size={18} />
          Minify
        </button>
        <div className="flex-1" />
        <button
          onClick={handleCopy}
          disabled={!input || !!error}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          Copy
        </button>
        <button
          onClick={() => {setInput(''); setError('');}}
          className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="relative">
        <textarea
          className={`w-full h-[500px] p-8 bg-slate-50 border rounded-3xl font-mono text-sm resize-none outline-none transition-all ${
            error ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
          }`}
          placeholder='Paste your JSON here... e.g. {"name": "OmniTool", "version": 1.0}'
          value={input}
          onChange={(e) => {setInput(e.target.value); setError('');}}
        />
        {error && (
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium flex items-center gap-3">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
