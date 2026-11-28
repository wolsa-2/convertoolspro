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
    <div className="relative w-full overflow-hidden py-4 bg-white/50 backdrop-blur-sm border-y border-slate-100 group/marquee">
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
            className="inline-flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all cursor-pointer group text-left"
          >
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <tool.icon size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#1A1A3A] group-hover:text-indigo-600 transition-colors">
                {tool.name}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {tool.category}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Gradient Overlays for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F8F9FF] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F8F9FF] to-transparent z-10 pointer-events-none" />
    </div>
  );
};
