import React from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AdUnit component for Google AdSense placeholders.
 * In production, this would render areals ins tag.
 * For now, it serves as a stylized placeholder to show ad placement.
 */
export const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto', className = '', style }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <div 
      className={`ad-container my-8 w-full overflow-hidden rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 min-h-[100px] text-slate-300 text-[10px] font-black uppercase tracking-widest ${className}`}
      style={style}
    >
      {isProd ? (
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%', ...style }}
          data-ad-client="ca-pub-1527585635151141"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <span>AdSense Placement</span>
          <span className="opacity-50 text-[8px]">Slot: {slot}</span>
        </div>
      )}
    </div>
  );
};
