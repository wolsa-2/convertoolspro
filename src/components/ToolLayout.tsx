import React from 'react';
import { TOOLS_SEO_CONTENT } from '../content';

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  toolId: string;
}

export default function ToolLayout({ children, title, description, toolId }: ToolLayoutProps) {
  const seoContent = TOOLS_SEO_CONTENT[toolId] || ''; 

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-12">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-[#F8F9FF]">
              <h1 className="text-3xl font-black text-[#1A1A3A]">{title}</h1>
              <p className="text-slate-500 mt-2">{description}</p>
            </div>
            <div className="p-8">
              {children}
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-8">
            <div className="prose prose-indigo prose-lg max-w-none text-slate-600 leading-relaxed space-y-8 seo-content" 
                 dangerouslySetInnerHTML={{ __html: seoContent }} />
          </div>
        </div>

        {/* Sidebar Ad Placeholder Space */}
        <div className="hidden lg:block space-y-6">
          <div className="sticky top-24">
          </div>
        </div>
      </div>
    </div>
  );
}
