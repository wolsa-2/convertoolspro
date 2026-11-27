import React, { useState } from 'react';
import { Copy, Check, Trash2, Type } from 'lucide-react';
import { copyTextToClipboard } from '../../lib/clipboard';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (type: string) => {
    let result = text;
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': 
        result = text.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = text.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        result = text.toLowerCase().replace(/\s+/g, '-');
        break;
    }
    setText(result);
  };

  const handleCopy = async () => {
    if (await copyTextToClipboard(text)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      window.prompt('Copy converted text:', text);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'upper', label: 'UPPERCASE' },
          { id: 'lower', label: 'lowercase' },
          { id: 'title', label: 'Title Case' },
          { id: 'sentence', label: 'Sentence case' },
          { id: 'camel', label: 'camelCase' },
          { id: 'snake', label: 'snake_case' },
          { id: 'kebab', label: 'kebab-case' },
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => convert(btn.id)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          className="w-full h-80 p-8 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-mono text-sm"
          placeholder="Type or paste text to convert..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
          </button>
          <button
            onClick={() => setText('')}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-rose-600 transition-all shadow-sm"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
