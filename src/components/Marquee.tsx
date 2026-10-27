import React from 'react';
import { Tool } from '../constants';

interface MarqueeProps {
  items: Tool[];
  onItemClick: (tool: Tool) => void;
  direction?: 'left' | 'right';
  speed?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({ 
  items, 
  onItemClick, 
  direction = 'left', 
  speed = 40 
}) => {
  // Duplicate items to ensure smooth loop
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="group/marquee relative w-full overflow-hidden border-y border-slate-200/70 bg-white/60 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div 
        className={`flex gap-6 whitespace-nowrap ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'} group-hover/marquee:[animation-play-state:paused]`}
        style={{ 
          animationDuration: `${speed}s`,
          width: 'max-content'
        }}
      >
        {duplicatedItems.map((tool, index) => (
          <button
            type="button"
            key={`${tool.id}-${index}`}
            onClick={() => onItemClick(tool)}
            className="inline-flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-800 group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-indigo-300">
              <tool.icon size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                {tool.name}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {tool.category}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Gradient Overlays for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F7F8FC] to-transparent dark:from-slate-950 z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F7F8FC] to-transparent dark:from-slate-950 z-10 pointer-events-none" />
    </div>
  );
};
