import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Palette, Settings } from 'lucide-react';

const QR_SIZE = 256;

export default function QrGenerator() {
  const [value, setValue] = useState('https://photosize.vercel.app/');
  const [fgColor, setFgColor] = useState('#4F46E5');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [downloadError, setDownloadError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!value.trim() || isDownloading) return;

    setDownloadError('');
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) {
      setDownloadError('QR code is not ready. Please try again.');
      return;
    }

    setIsDownloading(true);
    let svgUrl = '';

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      svgUrl = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        if (svgUrl) URL.revokeObjectURL(svgUrl);

        try {
          const canvas = document.createElement('canvas');
          canvas.width = QR_SIZE;
          canvas.height = QR_SIZE;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            setDownloadError('Your browser could not prepare the PNG image.');
            setIsDownloading(false);
            return;
          }

          ctx.drawImage(img, 0, 0, QR_SIZE, QR_SIZE);
          canvas.toBlob(blob => {
            if (!blob) {
              setDownloadError('PNG export failed. Please try again.');
              setIsDownloading(false);
              return;
            }

            const pngUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'photosize-qr.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();

            // Keep the object URL alive long enough for mobile browsers to start the download.
            window.setTimeout(() => URL.revokeObjectURL(pngUrl), 10000);
            setIsDownloading(false);
          }, 'image/png');
        } catch {
          setDownloadError('PNG export failed. Please try again.');
          setIsDownloading(false);
        }
      };

      img.onerror = () => {
        if (svgUrl) URL.revokeObjectURL(svgUrl);
        setDownloadError('QR image could not be rendered for download.');
        setIsDownloading(false);
      };

      img.src = svgUrl;
    } catch {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
      setDownloadError('QR export could not start. Please try again.');
      setIsDownloading(false);
    }
  };

  const hasContent = value.trim().length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <label htmlFor="qr-content" className="text-sm font-bold text-slate-700">QR Content (URL or Text)</label>
          <input
            id="qr-content"
            type="text"
            aria-label="QR code URL or text"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="https://example.com"
            value={value}
            onChange={(e) => { setValue(e.target.value); setDownloadError(''); }}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="qr-foreground" className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Palette size={14} aria-hidden="true" /> Foreground
            </label>
            <div className="flex gap-2 items-center p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                id="qr-foreground"
                type="color"
                aria-label="QR code foreground color"
                className="w-10 h-10 border-none bg-transparent cursor-pointer"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
              <span className="text-xs font-mono uppercase text-slate-500">{fgColor}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="qr-background" className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Palette size={14} aria-hidden="true" /> Background
            </label>
            <div className="flex gap-2 items-center p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                id="qr-background"
                type="color"
                aria-label="QR code background color"
                className="w-10 h-10 border-none bg-transparent cursor-pointer"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
              <span className="text-xs font-mono uppercase text-slate-500">{bgColor}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Settings size={14} aria-hidden="true" /> Options
          </p>
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

        <button
          type="button"
          onClick={downloadQR}
          disabled={!hasContent || isDownloading}
          className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} aria-hidden="true" />
          {isDownloading ? 'Preparing PNG...' : 'Download PNG'}
        </button>
        {downloadError && <p role="alert" className="text-sm text-rose-600">{downloadError}</p>}
      </div>

      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-6">
        <div ref={qrRef} className="min-h-[304px] min-w-[304px] flex items-center justify-center p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
          {hasContent ? (
            <QRCodeSVG
              value={value}
              size={QR_SIZE}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              includeMargin={includeMargin}
            />
          ) : (
            <p className="text-sm text-slate-400 text-center">Enter text or a URL to generate your QR code.</p>
          )}
        </div>
        <div className="text-center max-w-full">
          <p className="text-slate-400 text-sm font-medium">Scan to preview</p>
          <p className="text-indigo-600 font-bold mt-1 truncate max-w-[200px] mx-auto">{hasContent ? value : 'No content'}</p>
        </div>
      </div>
    </div>
  );
}
