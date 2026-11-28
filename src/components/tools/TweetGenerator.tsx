import React, { useEffect, useState, useRef } from 'react';
import { Download, Share2, Heart, MessageCircle, Repeat2, Check, User, Calendar } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function TweetGenerator() {
  const [name, setName] = useState('PhotoSize User');
  const [handle, setHandle] = useState('photosize_app');
  const [content, setContent] = useState('PhotoSize makes everyday image and file tasks easier! 🚀 #productivity #tools');
  const [date, setDate] = useState('12:20 PM · Mar 2, 2026');
  const [stats, setStats] = useState({ replies: '1.2K', retweets: '4.5K', likes: '12.8K' });
  const [avatar, setAvatar] = useState('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22200%22 height=%22200%22 rx=%22100%22 fill=%22%23e2e8f0%22/%3E%3Ccircle cx=%22100%22 cy=%2275%22 r=%2238%22 fill=%22%2394a3b8%22/%3E%3Cpath d=%22M25 190c5-45 35-68 75-68s70 23 75 68%22 fill=%22%2394a3b8%22/%3E%3C/svg%3E');
  const [downloadError, setDownloadError] = useState('');
  const tweetRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<FileReader | null>(null);

  useEffect(() => () => {
    readerRef.current?.abort();
  }, []);

  const handleDownload = async () => {
    if (!tweetRef.current) return;
    setDownloadError('');
    try {
      const dataUrl = await toPng(tweetRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'photosize-tweet-meme.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Tweet image export failed:', error);
      setDownloadError('Could not export the preview. Try a smaller avatar image or a different browser.');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setDownloadError('');
    if (!file.type.startsWith('image/')) {
      setDownloadError('Please choose a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setDownloadError('Avatar image must be 5 MB or smaller.');
      return;
    }

    readerRef.current?.abort();
    const reader = new FileReader();
    readerRef.current = reader;
    reader.onload = () => {
      if (readerRef.current === reader && typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.onerror = () => {
      if (readerRef.current === reader) {
        setDownloadError('The selected avatar could not be read.');
        readerRef.current = null;
      }
    };
    reader.onabort = () => {
      if (readerRef.current === reader) readerRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="tweet-display-name" className="text-sm font-bold text-slate-700">Display Name</label>
            <input
              id="tweet-display-name"
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="tweet-handle" className="text-sm font-bold text-slate-700">Handle (@)</label>
            <input
              id="tweet-handle"
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="tweet-content" className="text-sm font-bold text-slate-700">Tweet Content</label>
          <textarea
            id="tweet-content"
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700" htmlFor="tweet-date">Date &amp; Time</label>
          <input
            id="tweet-date"
            type="text"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            maxLength={60}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="tweet-replies" className="text-sm font-bold text-slate-700">Replies</label>
            <input
              id="tweet-replies"
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={stats.replies}
              onChange={(e) => setStats({ ...stats, replies: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="tweet-retweets" className="text-sm font-bold text-slate-700">Retweets</label>
            <input
              id="tweet-retweets"
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={stats.retweets}
              onChange={(e) => setStats({ ...stats, retweets: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="tweet-likes" className="text-sm font-bold text-slate-700">Likes</label>
            <input
              id="tweet-likes"
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={stats.likes}
              onChange={(e) => setStats({ ...stats, likes: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Avatar Image</label>
          <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
            <User size={18} className="text-slate-600" />
            <span className="text-sm text-slate-500">Choose custom avatar...</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>

        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
        >
          <Download size={20} />
          Download Meme
        </button>
      </div>

      {downloadError && <p role="alert" className="text-sm text-rose-600">{downloadError}</p>}
      <div className="flex flex-col items-center justify-center bg-slate-100 rounded-3xl p-8">
        <div 
          ref={tweetRef}
          className="w-full max-w-[500px] bg-white p-6 rounded-2xl shadow-xl border border-slate-200 font-sans"
        >
          <div className="flex items-center gap-3 mb-4">
            <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-bold text-slate-900 truncate">{name}</p>
                <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                  <Check size={10} strokeWidth={4} />
                </div>
              </div>
              <p className="text-slate-500 text-sm truncate">@{handle}</p>
            </div>
            <Share2 size={20} className="text-slate-400" />
          </div>

          <div className="text-lg text-slate-900 leading-relaxed mb-4 whitespace-pre-wrap">
            {content}
          </div>

          <div className="text-slate-500 text-sm mb-4 border-b border-slate-100 pb-4">
            {date}
          </div>

          <div className="flex justify-between text-slate-500">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 group-hover:bg-indigo-50 group-hover:text-indigo-500 rounded-full transition-all">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm font-medium">{stats.replies}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 group-hover:bg-emerald-50 group-hover:text-emerald-500 rounded-full transition-all">
                <Repeat2 size={18} />
              </div>
              <span className="text-sm font-medium">{stats.retweets}</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 group-hover:bg-rose-50 group-hover:text-rose-500 rounded-full transition-all">
                <Heart size={18} />
              </div>
              <span className="text-sm font-medium">{stats.likes}</span>
            </div>
          </div>
        </div>
        <p className="text-slate-600 text-sm font-medium mt-6">Preview (Meme format)</p>
      </div>
    </div>
  );
}
