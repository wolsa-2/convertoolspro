import React from 'react';
import { TOOLS, Tool } from '../../constants';

interface PdfToolsOverviewProps {
  onToolSelect: (tool: Tool) => void;
}

const CATEGORIZED_PDF_TOOLS = [
  {
    title: 'Convert to PDF',
    tools: ['jpg-to-pdf']
  },
  {
    title: 'View & Edit PDF',
    tools: ['pdf-metadata', 'watermark-pdf']
  },
  {
    title: 'Organize PDF',
    tools: ['rotate-pdf']
  },
  {
    title: 'Split & Merge PDF',
    tools: ['split-pdf', 'merge-pdf']
  }
];

export default function PdfToolsOverview({ onToolSelect }: PdfToolsOverviewProps) {
  const mergeTool = TOOLS.find((tool) => tool.id === 'merge-pdf');

  return (
    <div className="space-y-16 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
        {CATEGORIZED_PDF_TOOLS.map((category) => {
          const availableTools = category.tools
            .map((toolId) => TOOLS.find((tool) => tool.id === toolId))
            .filter((tool): tool is Tool => Boolean(tool));

          if (availableTools.length === 0) return null;

          return (
            <div key={category.title} className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full" aria-hidden="true"></div>
                {category.title}
              </h3>
              <div className="space-y-1">
                {availableTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => onToolSelect(tool)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group text-left border border-transparent hover:border-slate-50 dark:hover:border-slate-700"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all" aria-hidden="true">
                      <tool.icon size={20} />
                    </div>
                    <span className="font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-600 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" aria-hidden="true"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-black">Professional PDF Management</h2>
            <p className="text-indigo-100 font-medium">
              Manage, organize, and enhance PDF files with browser-based tools. Your documents stay on your device while you work.
            </p>
          </div>
          {mergeTool && (
            <button
              type="button"
              onClick={() => onToolSelect(mergeTool)}
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl whitespace-nowrap"
            >
              Get Started with Merge PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
