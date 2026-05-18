import React from 'react';
import { 
  FileText, 
  FileDown, 
  FileUp, 
  FileEdit, 
  Scissors, 
  Layers, 
  RotateCw, 
  Unlock, 
  Lock, 
  Plus, 
  Trash2, 
  Search, 
  BookOpen, 
  Highlighter, 
  MessageSquare, 
  PenTool,
  Archive,
  RefreshCw,
  ImageIcon,
  Type
} from 'lucide-react';
import { TOOLS, Tool } from '../../constants';
import { motion } from 'motion/react';

interface PdfToolsOverviewProps {
  onToolSelect: (tool: Tool) => void;
}

const CATEGORIZED_PDF_TOOLS = [
  {
    title: 'Convert from PDF',
    tools: ['pdf-to-word', 'pdf-to-excel', 'pdf-to-ppt', 'pdf-to-jpg', 'pdf-to-text']
  },
  {
    title: 'Convert to PDF',
    tools: ['word-to-pdf', 'excel-to-pdf', 'ppt-to-pdf', 'jpg-to-pdf']
  },
  {
    title: 'View & Edit PDF',
    tools: ['edit-pdf', 'pdf-metadata']
  },
  {
    title: 'Organize PDF',
    tools: ['rotate-pdf']
  },
  {
    title: 'Split & Merge PDF',
    tools: ['split-pdf', 'merge-pdf']
  },
  {
    title: 'Create PDF',
    tools: ['compress-pdf', 'unlock-pdf', 'protect-pdf']
  }
];

export default function PdfToolsOverview({ onToolSelect }: PdfToolsOverviewProps) {
  return (
    <div className="space-y-16 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
        {CATEGORIZED_PDF_TOOLS.map((category) => (
          <div key={category.title} className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              {category.title}
            </h3>
            <div className="space-y-1">
              {category.tools.map((toolId) => {
                const tool = TOOLS.find(t => t.id === toolId);
                if (!tool) return null;
                return (
                  <button
                    key={toolId}
                    onClick={() => onToolSelect(tool)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group text-left border border-transparent hover:border-slate-50 dark:hover:border-slate-700"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <tool.icon size={20} />
                    </div>
                    <span className="font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hero-like section for PDF tools */}
      <div className="bg-indigo-600 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-black">Professional PDF Management</h2>
            <p className="text-indigo-100 font-medium">
              Every tool you need to edit, convert, and manage your PDF files in one place. 100% secure, local-first processing ensures your documents stay private.
            </p>
          </div>
          <button 
            onClick={() => onToolSelect(TOOLS.find(t => t.id === 'merge-pdf')!)}
            className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl whitespace-nowrap"
          >
            Get Started with Merge PDF
          </button>
        </div>
      </div>
    </div>
  );
}
