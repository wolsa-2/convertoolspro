import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock3, Search, BookOpen, Sparkles, User } from 'lucide-react';
import { BLOG_POSTS } from '../blogData';

const categories = ['All', ...Array.from(new Set(BLOG_POSTS.map(post => post.category)))];

function readingTime(html: string) {
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<(typeof BLOG_POSTS)[number] | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const term = query.trim().toLowerCase();
    const matchesQuery = !term || [post.title, post.excerpt, post.category, ...post.keywords].join(' ').toLowerCase().includes(term);
    return matchesCategory && matchesQuery;
  }), [activeCategory, query]);

  const featuredPost = filteredPosts[0];

  if (selectedPost) {
    return (
      <main className="photosize-blog mx-auto w-full max-w-5xl space-y-7 px-4 py-8 sm:px-6 md:py-12">
        <button onClick={() => { setSelectedPost(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-700">
          <ArrowLeft size={16} /> Back to articles
        </button>
        <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          {selectedPost.image && <img src={selectedPost.image} alt="" className="aspect-[16/8] w-full object-cover" loading="lazy" />}
          <div className="mx-auto max-w-3xl space-y-7 px-5 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{selectedPost.category}</span>
              <span className="inline-flex items-center gap-1"><Calendar size={14}/>{selectedPost.date}</span>
              <span className="inline-flex items-center gap-1"><Clock3 size={14}/>{readingTime(selectedPost.content)} min read</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#1D1D1F] sm:text-5xl">{selectedPost.title}</h1>
            <p className="text-lg leading-8 text-slate-600">{selectedPost.excerpt}</p>
            <div className="flex items-center gap-2 border-y border-slate-100 py-4 text-sm text-slate-500"><User size={16}/>{selectedPost.author}</div>
            <div className="blog-content prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-700 prose-img:rounded-2xl" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            <div className="border-t border-slate-100 pt-6">
              <button onClick={() => setSelectedPost(null)} className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:gap-3">Explore more articles <ArrowRight size={16}/></button>
            </div>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="photosize-blog mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-6 md:space-y-14 md:py-14">
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-[#F7F9FC] px-6 py-10 sm:px-10 md:px-14 md:py-14">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-700"><BookOpen size={14}/> PhotoSize Journal</div>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#1D1D1F] sm:text-5xl md:text-6xl">Ideas that make<br/><span className="text-blue-700">digital work simpler.</span></h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Practical guides, useful workflows and clear explainers for images, PDFs, privacy and everyday productivity.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 md:pb-2"><Sparkles size={17} className="text-blue-600"/><span>{BLOG_POSTS.length} practical reads</span></div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">The latest</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1D1D1F] sm:text-3xl">Explore the journal</h2></div>
          <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 md:max-w-sm">
            <Search size={18} className="shrink-0 text-slate-400"/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search articles or topics..." className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"/>
          </label>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? 'bg-[#1D1D1F] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'}`}>{category}</button>)}
        </div>
      </section>

      {featuredPost ? (
        <section className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm md:grid-cols-2">
          <div className="min-h-64 overflow-hidden bg-slate-100">
            {featuredPost.image && <img src={featuredPost.image} alt="" className="h-full min-h-64 w-full object-cover transition duration-700 hover:scale-[1.03]" loading="lazy"/>}
          </div>
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-9 md:p-11">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500"><span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{featuredPost.category}</span><span>{featuredPost.date}</span><span>{readingTime(featuredPost.content)} min read</span></div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#1D1D1F] sm:text-3xl">{featuredPost.title}</h2>
            <p className="leading-7 text-slate-600">{featuredPost.excerpt}</p>
            <button onClick={() => setSelectedPost(featuredPost)} className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800">Read featured article <ArrowRight size={16}/></button>
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><p className="font-semibold text-slate-800">No articles found</p><p className="mt-1 text-sm text-slate-500">Try another keyword or category.</p><button onClick={() => {setQuery('');setActiveCategory('All');}} className="mt-4 text-sm font-bold text-blue-700">Clear filters</button></div>
      )}

      {filteredPosts.length > 1 && (
        <section className="space-y-5">
          <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Keep exploring</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1D1D1F]">More to discover</h2></div><span className="text-sm text-slate-500">{filteredPosts.length - 1} articles</span></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.slice(1).map(post => (
              <article key={post.id} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">{post.image && <img src={post.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>}</div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold text-slate-500"><span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{post.category}</span><span>{readingTime(post.content)} min read</span></div>
                  <h3 className="text-lg font-bold leading-snug text-[#1D1D1F]">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  <button onClick={() => {setSelectedPost(post);window.scrollTo({top:0,behavior:'smooth'});}} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-all hover:gap-3">Read article <ArrowRight size={16}/></button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
