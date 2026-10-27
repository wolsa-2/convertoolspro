import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

function secureRandomInt(maxExclusive: number): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive < 1) {
    throw new Error('Invalid random range.');
  }
  if (typeof crypto === 'undefined' || typeof crypto.getRandomValues !== 'function') {
    throw new Error('Secure random generation is unavailable in this browser.');
  }

  // Rejection sampling avoids the modulo bias of value % maxExclusive.
  const range = 0x100000000;
  const limit = Math.floor(range / maxExclusive) * maxExclusive;
  const values = new Uint32Array(1);
  let value: number;

  do {
    crypto.getRandomValues(values);
    value = values[0];
  } while (value >= limit);

  return value % maxExclusive;
}

function secureShuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

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
  const [copyError, setCopyError] = useState('');

  const generatePassword = () => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    const selectedCharsets: string[] = [];
    if (options.uppercase) selectedCharsets.push(charset.uppercase);
    if (options.lowercase) selectedCharsets.push(charset.lowercase);
    if (options.numbers) selectedCharsets.push(charset.numbers);
    if (options.symbols) selectedCharsets.push(charset.symbols);

    if (selectedCharsets.length === 0) {
      setPassword('');
      setGenerationError('');
      setCopyError('');
      return;
    }

    if (length < selectedCharsets.length) {
      setPassword('');
      setGenerationError('Choose a longer password or fewer character types.');
      return;
    }

    try {
      const allCharacters = selectedCharsets.join('');
      const result: string[] = [];

      // Guarantee at least one character from every selected character class.
      for (const characters of selectedCharsets) {
        result.push(characters[secureRandomInt(characters.length)]);
      }

      while (result.length < length) {
        result.push(allCharacters[secureRandomInt(allCharacters.length)]);
      }

      setPassword(secureShuffle(result).join(''));
      setGenerationError('');
      setCopyError('');
      setCopied(false);
    } catch (error) {
      setPassword('');
      setCopied(false);
      setGenerationError(
        error instanceof Error
          ? error.message
          : 'Password generation failed. Please try again.'
      );
    }
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const handleCopy = async () => {
    if (!password) return;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard access is unavailable in this browser.');
      }
      await navigator.clipboard.writeText(password);
      setCopyError('');
      setCopied(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B']
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyError('Could not copy password. Check clipboard permissions and try again.');
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
              aria-label="Regenerate password"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleCopy}
              disabled={!password}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-indigo-900/20"
              title="Copy"
              aria-label="Copy password"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
        {generationError && <p role="alert" className="mt-2 text-sm text-rose-600">{generationError}</p>}
        {copyError && <p role="alert" className="mt-2 text-sm text-rose-600">{copyError}</p>}
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
