import React, { useRef, useState } from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import { copyTextToClipboard } from '../../lib/clipboard';

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha512: '' });
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const generateHashes = async (val: string) => {
    const currentRequest = ++requestId.current;
    setText(val);
    setError('');
    if (!val) {
      setHashes({ sha1: '', sha256: '', sha512: '' });
      return;
    }

    try {
      const data = new TextEncoder().encode(val);
      const getHash = async (algo: string) => {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('');
      };
      const [sha1, sha256, sha512] = await Promise.all([
        getHash('SHA-1'), getHash('SHA-256'), getHash('SHA-512')
      ]);
      if (currentRequest === requestId.current) setHashes({ sha1, sha256, sha512 });
    } catch {
      if (currentRequest === requestId.current) {
        setHashes({ sha1: '', sha256: '', sha512: '' });
        setError('Hash generation is unavailable in this browser context. Open PhotoSize over HTTPS and try again.');
      }
    }
  };

  const handleCopy = async (val: string, id: string) => {
    if (await copyTextToClipboard(val)) {
      setCopied(id);
      window.setTimeout(() => setCopied(null), 2000);
    } else {
      window.prompt('Copy hash:', val);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label htmlFor="hash-input" className="text-sm font-bold text-slate-700 ml-1">Input Text</label>
        <textarea
          id="hash-input"
          className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-mono text-sm"
          placeholder="Enter text to hash..."
          value={text}
          onChange={(e) => generateHashes(e.target.value)}
        />
      </div>

      {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
      <div className="space-y-4">
        {[
          { id: 'sha1', label: 'SHA-1', value: hashes.sha1 },
          { id: 'sha256', label: 'SHA-256', value: hashes.sha256 },
          { id: 'sha512', label: 'SHA-512', value: hashes.sha512 },
        ].map(hash => (
          <div key={hash.id} className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{hash.label}</span>
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
              {hash.value || <span className="text-slate-500 italic">Enter text to generate hash...</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
        <ShieldCheck className="text-indigo-600 shrink-0" size={24} />
        <div className="text-sm text-indigo-700 leading-relaxed space-y-2">
          <p><strong>Privacy:</strong> All hashing is performed locally in your browser. Your text is never sent to our servers.</p>
          <p><strong>Algorithm note:</strong> SHA-1 is provided for legacy compatibility and should not be used for security-sensitive applications. Prefer SHA-256 or SHA-512.</p>
        </div>
      </div>
    </div>
  );
}
