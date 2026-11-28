import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { copyTextToClipboard } from '../../lib/clipboard';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (type: string) => {
    let result = text;
    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.toLowerCase().replace(/\S+/g, (word: string) => {
          const characters: string[] = Array.from(word as string);
          return characters.length ? characters[0].toUpperCase() + characters.slice(1).join('') : word;
        });
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (character: string) => character.toUpperCase());
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_match, character: string) => character.toUpperCase());
        break;
      case 'snake':
        result = text.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        result = text.toLowerCase().replace(/\s+/g, '-');
        break;
      default:
        return;
    }
    setText(result);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!text) return;
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
            type="button"
            onClick={() => convert(btn.id)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          id="case-converter-input"
          aria-label="Text to convert"
          className="w-full h-80 p-8 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-mono text-sm"
          placeholder="Type or paste text to convert..."
          value={text}
          onChange={(e) => { setText(e.target.value); setCopied(false); }}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            aria-label="Copy converted text"
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <Check size={20} className="text-emerald-500" aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => { setText(''); setCopied(false); }}
            aria-label="Clear text"
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-rose-600 transition-all shadow-sm"
          >
            <Trash2 size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
