import React from 'react';
import { TOOLS, Tool } from '../../constants';

interface PdfToolsOverviewProps {
  onToolSelect: (tool: Tool) => void;
}

const PDF_TOOL_GROUPS = [
  { title: 'Convert to PDF', ids: ['jpg-to-pdf'] },
  { title: 'View PDF details', ids: ['pdf-metadata'] },
  { title: 'Organize PDF', ids: ['rotate-pdf', 'merge-pdf', 'watermark-pdf'] },
];

export default function PdfToolsOverview({ onToolSelect }: PdfToolsOverviewProps) {
  return (
    <div className="space-y-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PDF_TOOL_GROUPS.map(group => (
          <section key={group.title} className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">{group.title}</h3>
            <div className="space-y-2">
              {group.ids.map(id => {
                const tool = TOOLS.find(item => item.id === id);
                if (!tool) return null;
                const Icon = tool.icon;
                return (
                  <button key={tool.id} onClick={() => onToolSelect(tool)} className="w-full flex items-center gap-3 p-4 rounded-2xl text-left border border-slate-100 dark:border-slate-800 hover:border-indigo-300 hover:bg-white dark:hover:bg-slate-800 transition-all">
                    <span className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-indigo-600"><Icon size={20} /></span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white">
        <h2 className="text-2xl font-black mb-3">PDF tools that do what they say</h2>
        <p className="text-indigo-100 font-medium">Only currently implemented PDF features are listed here. Password protection, unlocking, splitting, and compression are not advertised until their behavior can be implemented and verified correctly.</p>
      </div>
    </div>
  );
}
