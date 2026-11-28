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
  const [generationError, setGenerationError] = useState('');

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+`|}{[]:;?><,./-=',
    };

    const enabledSets = Object.entries(options)
      .filter(([, enabled]) => enabled)
      .map(([key]) => charset[key as keyof typeof charset]);

    if (enabledSets.length === 0) {
      setPassword('');
      setGenerationError('Select at least one character type.');
      return;
    }

    if (length < enabledSets.length) {
      setPassword('');
      setGenerationError('Increase the password length to match the selected character types.');
      return;
    }

    try {
      if (!globalThis.crypto?.getRandomValues) {
        throw new Error('Secure random generation is unavailable in this browser.');
      }

      const randomInt = (maxExclusive: number) => {
        const range = 0x100000000;
        const limit = range - (range % maxExclusive);
        const values = new Uint32Array(1);
        let value = limit;
        while (value >= limit) {
          globalThis.crypto.getRandomValues(values);
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
      setGenerationError('');
    } catch {
      setPassword('');
      setGenerationError('Secure password generation failed. Please use an up-to-date browser and try again.');
    }
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
    const poolSize = Object.entries(options).reduce((total, [key, enabled]) => {
      if (!enabled) return total;
      const sizes = { uppercase: 26, lowercase: 26, numbers: 10, symbols: 29 };
      return total + sizes[key as keyof typeof sizes];
    }, 0);
    const estimatedEntropy = password && poolSize > 1
      ? password.length * Math.log2(poolSize)
      : 0;

    if (!password) return { label: 'Unavailable', color: 'text-slate-500', icon: ShieldAlert, bg: 'bg-slate-100' };
    if (estimatedEntropy < 60) return { label: 'Weak', color: 'text-rose-500', icon: ShieldAlert, bg: 'bg-rose-50' };
    if (estimatedEntropy < 80) return { label: 'Good', color: 'text-amber-500', icon: Shield, bg: 'bg-amber-50' };
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
              aria-label="Generate a new password"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleCopy}
              disabled={!password}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-indigo-900/20"
              title="Copy"
              aria-label="Copy password"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
        {generationError && <p role="alert" className="mt-3 text-sm text-rose-600">{generationError}</p>}
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
              aria-label="Password length"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(options).map(([key, value]) => (
              <button
                key={key}
                type="button"
                aria-pressed={value}
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
            <h4 className={`text-xl font-bold ${strength.color}`}>Estimated strength: {strength.label}</h4>
            <p className="text-slate-500 text-sm mt-1">
              {strength.label === 'Strong'
                ? 'High estimated entropy based on password length and selected character types.'
                : strength.label === 'Good'
                ? 'Moderate estimated entropy. A longer password can improve it.'
                : strength.label === 'Weak'
                ? 'Low estimated entropy. Increase the length or add more character types.'
                : 'Generate a password to estimate its strength.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
