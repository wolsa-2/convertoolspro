import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Palette, Settings } from 'lucide-react';

export default function QrGenerator() {
  const [value, setValue] = useState('https://photosize.vercel.app/');
  const [fgColor, setFgColor] = useState('#4F46E5');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(256);
  const [includeMargin, setIncludeMargin] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'photosize-qr.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">QR Content (URL or Text)</label>
          <input
            type="text"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="https://example.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Palette size={14} /> Foreground
            </label>
            <div className="flex gap-2 items-center p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="color"
                className="w-10 h-10 border-none bg-transparent cursor-pointer"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
              <span className="text-xs font-mono uppercase text-slate-500">{fgColor}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Palette size={14} /> Background
            </label>
            <div className="flex gap-2 items-center p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="color"
                className="w-10 h-10 border-none bg-transparent cursor-pointer"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
              <span className="text-xs font-mono uppercase text-slate-500">{bgColor}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Settings size={14} /> Options
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeMargin}
                onChange={(e) => setIncludeMargin(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Include Margin</span>
            </label>
          </div>
        </div>

        <button
          onClick={downloadQR}
          className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
        >
          <Download size={20} />
          Download PNG
        </button>
      </div>

      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-slate-200 p-12 space-y-6">
        <div ref={qrRef} className="p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
          <QRCodeSVG
            value={value || ' '}
            size={size}
            fgColor={fgColor}
            bgColor={bgColor}
            level="H"
            includeMargin={includeMargin}
          />
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-sm font-medium">Scan to preview</p>
          <p className="text-indigo-600 font-bold mt-1 truncate max-w-[200px]">{value || 'No content'}</p>
        </div>
      </div>
    </div>
  );
}
