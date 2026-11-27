import React, { useState } from 'react';
import { Hash, Copy, Check, ShieldCheck } from 'lucide-react';

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha512: '' });
  const [copied, setCopied] = useState<string | null>(null);

  const generateHashes = async (val: string) => {
    setText(val);
    if (!val) {
      setHashes({ sha1: '', sha256: '', sha512: '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(val);

    const getHash = async (algo: string) => {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const s1 = await getHash('SHA-1');
    const s256 = await getHash('SHA-256');
    const s512 = await getHash('SHA-512');

    setHashes({
      sha1: s1,
      sha256: s256,
      sha512: s512
    });
  };

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Input Text</label>
        <textarea
          className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-mono text-sm"
          placeholder="Enter text to hash..."
          value={text}
          onChange={(e) => generateHashes(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {[
          { id: 'sha1', label: 'SHA-1', value: hashes.sha1 },
          { id: 'sha256', label: 'SHA-256', value: hashes.sha256 },
          { id: 'sha512', label: 'SHA-512', value: hashes.sha512 },
        ].map(hash => (
          <div key={hash.id} className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{hash.label}</span>
              {hashes.sha1 && (
                <button
                  onClick={() => handleCopy(hash.value, hash.id)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                >
                  {copied === hash.id ? <Check size={12} /> : <Copy size={12} />}
                  {copied === hash.id ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl font-mono text-xs break-all text-slate-600 min-h-[52px] flex items-center">
              {hash.value || <span className="text-slate-300 italic">Enter text to generate hash...</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
        <ShieldCheck className="text-indigo-600 shrink-0" size={24} />
        <p className="text-sm text-indigo-700 leading-relaxed">
          <strong>Security Note:</strong> All hashing is performed locally in your browser. Your text is never sent to our servers.
        </p>
      </div>
    </div>
  );
}
