import React from 'react';
import { ArrowRight, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import { TOOLS_SEO_CONTENT, TOOLS_FAQ } from '../content';
import { TOOLS, Tool } from '../constants';
import AdSenseUnit from './AdSenseUnit';
import FAQSection from './FAQSection';

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  toolId: string;
  onToolNavigate: (tool: Tool) => void;
}

export default function ToolLayout({ children, title, description, toolId, onToolNavigate }: ToolLayoutProps) {
  const seoContent = TOOLS_SEO_CONTENT[toolId] || '';
  const faqs = TOOLS_FAQ[toolId] || [];
  const currentTool = TOOLS.find(t => t.id === toolId);
  const relatedTools = TOOLS.filter(t => t.category === currentTool?.category && t.id !== toolId).slice(0, 3);

  const shareTool = async () => {
    const shareData = { title, text: description, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        window.alert('Link copied to clipboard.');
        return;
      }
      window.prompt('Copy this link:', window.location.href);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      window.prompt('Copy this link:', window.location.href);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>Tools</span><ArrowRight size={14} aria-hidden="true" />
        <span>{currentTool?.category || 'Utility'}</span><ArrowRight size={14} aria-hidden="true" />
        <span className="font-semibold text-slate-800 dark:text-slate-100">{title}</span>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="min-w-0 space-y-8 lg:col-span-9">
          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem]">
            <div className="border-b border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-5 py-7 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 sm:px-8 sm:py-9">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                    {currentTool?.icon ? React.createElement(currentTool.icon, { size: 24, 'aria-hidden': true }) : <Sparkles size={24} />}
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-slate-800 dark:text-indigo-300">
                      <ShieldCheck size={13} /> Browser-based utility
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
                  </div>
                </div>
                <button type="button" onClick={shareTool} aria-label={`Share ${title}`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                  <Share2 size={17} /> <span>Share tool</span>
                </button>
              </div>
            </div>
            <div className="p-5 sm:p-8">{children}</div>
          </section>

          <AdSenseUnit slot="8344712956" className="mx-auto max-w-4xl" />

          {seoContent && (
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] sm:p-9">
              <div className="seo-content prose prose-slate max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: seoContent }} />
            </section>
          )}

          {faqs.length > 0 && (
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] sm:p-9">
              <FAQSection items={faqs} />
            </section>
          )}

          {relatedTools.length > 0 && (
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] sm:p-9">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">Keep exploring</p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">Related tools</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {relatedTools.map(tool => (
                  <button key={tool.id} type="button" onClick={() => onToolNavigate(tool)} className="group flex min-w-0 items-start gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-indigo-300">
                      <tool.icon size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-900 dark:text-white">{tool.name}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{tool.description}</span>
                    </span>
                    <ArrowRight size={16} className="ml-auto mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </section>
          )}

          <AdSenseUnit slot="3122948107" className="mt-8" />
        </div>

        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><ShieldCheck size={17} className="text-emerald-600" /> Privacy-minded tools</div>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Check each tool's behavior before using sensitive files. Processing methods can vary by tool.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sponsored</p>
              <AdSenseUnit slot="2933847101" format="rectangle" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
