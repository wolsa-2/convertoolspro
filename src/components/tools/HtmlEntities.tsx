import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';
import he from 'he';
import { copyTextToClipboard } from '../../lib/clipboard';

export default function HtmlEntities() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const process = (val: string, currentMode: 'encode' | 'decode') => {
    setInput(val);
    if (!val) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        setOutput(he.encode(val));
      } else {
        setOutput(he.decode(val));
      }
    } catch (e) {
      setOutput('Error processing HTML entities');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    const source = output === 'Error processing HTML entities' ? input : output;
    setMode(newMode);
    process(source, newMode);
  };

  const handleCopy = async () => {
    if (await copyTextToClipboard(output)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      window.prompt('Copy result:', output);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <button
          onClick={toggleMode}
          className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-all"
        >
          <span className="capitalize">{mode}</span>
          <ArrowRightLeft size={20} />
          <span className="capitalize">{mode === 'encode' ? 'decode' : 'encode'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Input Text</label>
          <textarea
            className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-mono text-sm"
            placeholder={`Enter text to ${mode}...`}
            value={input}
            onChange={(e) => process(e.target.value, mode)}
          />
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-slate-700 ml-1">Result</label>
          <div className="relative">
            <textarea
              readOnly
              className="w-full h-64 p-6 bg-white border border-slate-200 rounded-3xl font-mono text-sm resize-none outline-none"
              placeholder="Result will appear here..."
              value={output}
            />
            {output && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
                >
                  {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
