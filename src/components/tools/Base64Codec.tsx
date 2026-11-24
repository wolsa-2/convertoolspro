import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Check, Trash2 } from 'lucide-react';

const encodeUtf8Base64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

const decodeUtf8Base64 = (value: string) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
};

export default function Base64Codec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = (val: string, currentMode: 'encode' | 'decode') => {
    setInput(val);
    setError('');
    if (!val) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        setOutput(encodeUtf8Base64(val));
      } else {
        setOutput(decodeUtf8Base64(val));
      }
    } catch (e) {
      setError('Invalid input for ' + currentMode + 'ing');
      setOutput('');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    // Swap input and output
    const temp = output;
    setOutput(input);
    process(temp, newMode);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
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
              className={`w-full h-64 p-6 bg-white border rounded-3xl font-mono text-sm resize-none outline-none ${
                error ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200'
              }`}
              placeholder="Result will appear here..."
              value={error || output}
            />
            {!error && output && (
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
