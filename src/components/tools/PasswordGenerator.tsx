import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { copyTextToClipboard } from '../../lib/clipboard';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~\`|}{[]:;?><,./-=',
    };

    const enabledSets = Object.entries(options)
      .filter(([key, enabled]) => enabled)
      .map(([key]) => charset[key as keyof typeof charset]);

    if (enabledSets.length === 0 || length < enabledSets.length) {
      setPassword('');
      return;
    }

    const randomInt = (maxExclusive: number) => {
      const range = 0x100000000;
      const limit = range - (range % maxExclusive);
      const values = new Uint32Array(1);
      let value = limit;
      while (value >= limit) {
        crypto.getRandomValues(values);
        value = values[0];
      }
      return value % maxExclusive;
    };

    const pool = enabledSets.join('');
    const characters = enabledSets.map(set => set[randomInt(set.length)]);
    while (characters.length < length) {
      characters.push(pool[randomInt(pool.length)]);
    }

    // Shuffle so the guaranteed category characters are not predictable by position.
    for (let i = characters.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    setPassword(characters.join(''));
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const handleCopy = async () => {
    if (!password) return;
    if (await copyTextToClipboard(password)) {
      setCopied(true);
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      window.prompt('Copy generated password:', password);
    }
  };

  const getStrength = () => {
    let score = 0;
    if (length > 12) score++;
    if (length > 20) score++;
    if (options.uppercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    
    if (score <= 2) return { label: 'Weak', color: 'text-rose-500', icon: ShieldAlert, bg: 'bg-rose-50' };
    if (score <= 4) return { label: 'Good', color: 'text-amber-500', icon: Shield, bg: 'bg-amber-50' };
    return { label: 'Strong', color: 'text-emerald-500', icon: ShieldCheck, bg: 'bg-emerald-50' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-8">
      <div className="relative group">
        <div className="w-full p-6 bg-slate-900 text-white rounded-2xl font-mono text-2xl break-all flex items-center justify-between min-h-[100px]">
          <span className="flex-1 mr-4">{password}</span>
          <div className="flex gap-2">
            <button
              onClick={generatePassword}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              title="Regenerate"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleCopy}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-900/20"
              title="Copy"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Password Length: {length}</label>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setOptions(prev => ({ ...prev, [key]: !value }))}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  value 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <span className="text-sm font-bold capitalize">{key}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  value ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                }`}>
                  {value && <Check size={12} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-3xl ${strength.bg} flex flex-col items-center justify-center text-center space-y-4 border border-transparent transition-all`}>
          <strength.icon size={48} className={strength.color} />
          <div>
            <h4 className={`text-xl font-bold ${strength.color}`}>Security Level: {strength.label}</h4>
            <p className="text-slate-500 text-sm mt-1">
              {strength.label === 'Strong' 
                ? 'This password is very secure and hard to crack.' 
                : strength.label === 'Good' 
                ? 'Good password, but could be stronger.' 
                : 'Warning: This password is easy to guess.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
