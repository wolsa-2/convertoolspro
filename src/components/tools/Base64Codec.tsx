import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';

function encodeUtf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function decodeUtf8(value: string): string {
  const binary = atob(value.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export default function Base64Codec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = (value: string, currentMode: 'encode' | 'decode') => {
    setInput(value);
    setError('');
    setCopied(false);
    if (!value) {
      setOutput('');
      return;
    }
    try {
      setOutput(currentMode === 'encode' ? encodeUtf8(value) : decodeUtf8(value));
    } catch {
      setError(currentMode === 'encode' ? 'Could not encode this text.' : 'Invalid Base64 or invalid UTF-8 text.');
      setOutput('');
    }
  };

  const toggleMode = () => {
    setMode(previous => previous === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput(input);
    setError('');
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Clipboard access failed. Select and copy the result manually.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <button onClick={toggleMode} className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-500 transition-all">
          <span className="capitalize">{mode}</span><ArrowRightLeft size={20} /><span className="capitalize">{mode === 'encode' ? 'decode' : 'encode'}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Input Text</label>
          <textarea className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm" placeholder={`Enter text to ${mode}...`} value={input} onChange={e => process(e.target.value, mode)} />
        </div>
        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-slate-700 ml-1">Result</label>
          <div className="relative">
            <textarea readOnly className={`w-full h-64 p-6 border rounded-3xl font-mono text-sm resize-none outline-none ${error ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white'}`} placeholder="Result will appear here..." value={error || output} />
            {!error && output && <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 shadow-sm" aria-label="Copy result">{copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}</button>}
          </div>
          <p className="text-xs text-slate-500">UTF-8 supported. Processing happens in your browser; Base64 is encoding, not encryption.</p>
        </div>
      </div>
    </div>
  );
}
