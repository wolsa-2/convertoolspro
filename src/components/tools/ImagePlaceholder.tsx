import React, { useEffect, useState } from 'react';
import { Download, Copy, Check, Palette, Type, Maximize } from 'lucide-react';
import { copyTextToClipboard } from '../../lib/clipboard';

export default function ImagePlaceholder() {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('#4F46E5');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const placeholderUrl = `https://placehold.co/${width}x${height}/${bgColor.replace('#', '')}/${textColor.replace('#', '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

  useEffect(() => {
    setPreviewUrl('');
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1 || width > 4096 || height > 4096) {
      setPreviewUrl('');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) {
      setPreviewUrl('');
      return;
    }
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    if (text.trim()) {
      context.fillStyle = textColor;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = `600 ${Math.max(12, Math.min(48, Math.floor(Math.min(width, height) / 8)))}px Arial, sans-serif`;
      context.fillText(text, width / 2, height / 2, width * 0.9);
    }
    let objectUrl = '';
    let cancelled = false;
    canvas.toBlob((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
    }, 'image/png');

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [width, height, text, bgColor, textColor]);

  const handleCopy = async () => {
    if (!previewUrl) return;
    if (await copyTextToClipboard(placeholderUrl)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      window.prompt('Copy placeholder URL:', placeholderUrl);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    if (!previewUrl) return;
    link.href = previewUrl;
    link.download = `placeholder-${width}x${height}.png`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Maximize size={14} /> Width (px)
            </label>
            <input
              type="number"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={width}
              min={1}
              max={4096}
              onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Maximize size={14} /> Height (px)
            </label>
            <input
              type="number"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={height}
              min={1}
              max={4096}
              onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Type size={14} /> Custom Text (Optional)
          </label>
          <input
            type="text"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="e.g. Hero Image"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
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
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Palette size={14} /> Text Color
            </label>
            <div className="flex gap-2 items-center p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="color"
                className="w-10 h-10 border-none bg-transparent cursor-pointer"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
              <span className="text-xs font-mono uppercase text-slate-500">{textColor}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-3 p-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
            Copy URL
          </button>
          <button
            onClick={handleDownload}
            disabled={!previewUrl}
            className="flex-1 flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
          >
            <Download size={20} />
            Download
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-slate-200 p-8 space-y-6 min-h-[400px]">
        <div className="max-w-full overflow-hidden rounded-xl shadow-2xl border border-slate-200">
          <img
            src={previewUrl}
            alt="Locally generated placeholder preview"
            className="max-w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="text-slate-600 text-sm font-medium">Live local preview · {width} × {height} px</p>
      </div>
    </div>
  );
}
