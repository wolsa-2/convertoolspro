import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { BLOG_POSTS } from '../blogData';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  if (selectedPost) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <button 
          onClick={() => setSelectedPost(null)}
          className="group inline-flex min-h-11 items-center gap-2 rounded-xl px-3 font-semibold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </button>

        <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem]">
          <div className="aspect-video bg-indigo-50 overflow-hidden relative">
            {selectedPost.image ? (
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                width="800"
                height="450"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-indigo-200 font-black text-6xl">ARTICLE</span>
              </div>
            )}
          </div>
          <div className="space-y-8 p-5 sm:p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 sm:gap-6">
              <span className="flex items-center gap-2"><Calendar size={18} /> {selectedPost.date}</span>
              <span className="flex items-center gap-2"><User size={18} /> {selectedPost.author}</span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">{selectedPost.category}</span>
            </div>
            
            <div className="seo-content blog-content prose prose-slate max-w-none space-y-6 leading-relaxed dark:prose-invert" 
                 dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-[#1A1A3A]">Our Blog</h1>
        <p className="text-slate-500">Insights, tutorials, and updates from the Convertools team.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <motion.article 
            key={post.id}
            whileHover={{ y: -5 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
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
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
              </div>
              <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {post.title}
              </h3>
              <p className="mb-6 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
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
