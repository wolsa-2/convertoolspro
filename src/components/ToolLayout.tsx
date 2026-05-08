import React from 'react';
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

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-12">
          
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-[#F8F9FF]">
              <h1 className="text-3xl font-black text-[#1A1A3A] text-balance">{title} Online Tool & Generator</h1>
              <p className="text-slate-500 mt-2">{description}</p>
            </div>
            <div className="p-8">
              {children}
            </div>
          </div>

          {/* Persistent Ad after the main tool UI */}
          <AdSenseUnit slot="8344712956" className="max-w-4xl mx-auto" />

          {/* SEO Content Section - The "Publisher Content" */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-8">
             <div className="prose prose-indigo prose-lg max-w-none text-slate-600 leading-relaxed space-y-8 seo-content" 
                  dangerouslySetInnerHTML={{ __html: seoContent }} />
          </div>

          {/* Reusable FAQ Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
            <FAQSection items={faqs} />
          </div>

          {/* Related Tools Section */}
          {relatedTools.length > 0 && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
              <h2 className="text-2xl font-black text-[#1A1A3A] mb-8">Related Tools You Might Find Useful</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => onToolNavigate(tool)}
                    className="p-6 rounded-3xl border border-slate-50 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all text-left space-y-3 group"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      <tool.icon size={24} />
                    </div>
                    <h3 className="font-bold text-[#1A1A3A]">{tool.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{tool.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Ad after content */}
          <AdSenseUnit slot="3122948107" className="mt-8" />
        </div>

        {/* Sidebar for Large Screens */}
        <div className="hidden lg:block space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-[#1A1A3A] mb-4 text-sm uppercase tracking-wider">Sponsored</h3>
              <AdSenseUnit slot="2933847101" format="rectangle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
