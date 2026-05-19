import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { BLOG_POSTS } from '../blogData';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </button>

        <article className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="aspect-video bg-indigo-50 overflow-hidden relative">
            {selectedPost.image ? (
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                width="800"
                height="450"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-indigo-200 font-black text-6xl">ARTICLE</span>
              </div>
            )}
          </div>
          <div className="p-10 md:p-16 space-y-8">
            <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-2"><Calendar size={18} /> {selectedPost.date}</span>
              <span className="flex items-center gap-2"><User size={18} /> {selectedPost.author}</span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">{selectedPost.category}</span>
            </div>
            
            <div className="prose prose-indigo prose-lg max-w-none text-slate-600 leading-relaxed space-y-6 blog-content" 
                 dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-[#1A1A3A]">Our Blog</h1>
        <p className="text-slate-500">Insights, tutorials, and updates from the Allinone.tools team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <motion.article 
            key={post.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="aspect-video bg-indigo-50 overflow-hidden relative">
              {post.image ? (
                <img 
                  src={post.image} 
                  alt={post.title} 
                  width="400"
                  height="225"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-indigo-200 font-black text-4xl">BLOG</span>
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A3A] mb-2 hover:text-indigo-600 cursor-pointer transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">
                {post.excerpt}
              </p>
              <button 
                onClick={() => setSelectedPost(post)}
                className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-3 transition-all"
              >
                Read More <ArrowRight size={16} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
