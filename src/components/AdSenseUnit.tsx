import React, { useEffect, useRef } from 'react';

interface AdSenseUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  responsive?: boolean;
}

const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ 
  slot, 
  format = 'auto', 
  className = '',
  responsive = true 
}) => {
  const adInited = useRef(false);
  const adsDisabled = (import.meta as any).env.VITE_DISABLE_ADS === 'true';

  useEffect(() => {
    if (adsDisabled) return;
    
    // Only initialize if not already done for this instance
    if (!adInited.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInited.current = true;
      } catch (e) {
        console.error('AdSense initialization error:', e);
      }
    }
  }, [adsDisabled]);

  if (adsDisabled) return null;

  return (
    <div className={`adsense-container overflow-hidden my-8 flex flex-col items-center justify-center min-h-[50px] ${className}`}>
      <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-2">Advertisement</div>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px' }}
        data-ad-client="ca-pub-1527585635151141"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdSenseUnit;
