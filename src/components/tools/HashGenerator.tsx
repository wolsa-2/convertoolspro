import React, { useState } from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';

type HashValues = { sha1: string; sha256: string; sha512: string };

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState<HashValues>({ sha1: '', sha256: '', sha512: '' });
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const generateHashes = async (value: string) => {
    setText(value);
    setCopied(null);
    setError('');
    if (!value) {
      setHashes({ sha1: '', sha256: '', sha512: '' });
      return;
    }
    try {
      const data = new TextEncoder().encode(value);
      const getHash = async (algorithm: string) => {
        const buffer = await crypto.subtle.digest(algorithm, data);
        return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');
      };
      const [sha1, sha256, sha512] = await Promise.all([
        getHash('SHA-1'), getHash('SHA-256'), getHash('SHA-512')
      ]);
      setHashes({ sha1, sha256, sha512 });
    } catch {
      setError('Hash generation is unavailable in this browser. Use a secure HTTPS connection and try again.');
      setHashes({ sha1: '', sha256: '', sha512: '' });
    }
  };

  const handleCopy = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setError('Clipboard access failed. Select and copy the hash manually.');
    }
  };

  const items = [
    { id: 'sha1', label: 'SHA-1', value: hashes.sha1 },
    { id: 'sha256', label: 'SHA-256', value: hashes.sha256 },
    { id: 'sha512', label: 'SHA-512', value: hashes.sha512 },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Input Text</label>
        <textarea className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm" placeholder="Enter text to hash..." value={text} onChange={e => void generateHashes(e.target.value)} />
        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
      </div>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
              {item.value && <button onClick={() => void handleCopy(item.value, item.id)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">{copied === item.id ? <Check size={12} /> : <Copy size={12} />}{copied === item.id ? 'Copied' : 'Copy'}</button>}
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl font-mono text-xs break-all text-slate-600 min-h-[52px] flex items-center">{item.value || <span className="text-slate-300 italic">Enter text to generate hash...</span>}</div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
        <ShieldCheck className="text-indigo-600 shrink-0" size={24} />
        <p className="text-sm text-indigo-700 leading-relaxed"><strong>Privacy & security:</strong> Hashing runs locally in your browser. SHA-1 is legacy and not recommended for security-sensitive uses; prefer SHA-256 or SHA-512. Hashes are not encryption.</p>
      </div>
    </div>
  );
}
