import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
}

type AdsWindow = Window & {
  adsbygoogle?: Array<Record<string, never>>;
};

/**
 * Responsive Google AdSense unit.
 * A real numeric slot ID is required before production ads are rendered.
 */
export const AdUnit: React.FC<AdUnitProps> = ({
  slot,
  format = 'auto',
  className = '',
  style,
}) => {
  const adRef = useRef<HTMLElement | null>(null);
  const initialized = useRef(false);
  const adsDisabled = import.meta.env.VITE_DISABLE_ADS === 'true';
  const isProduction = import.meta.env.PROD;
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-1527585635151141';
  const validSlot = /^\\d+$/.test(slot);

  useEffect(() => {
    if (!isProduction || adsDisabled || !validSlot || initialized.current || !adRef.current) {
      return;
    }

    try {
      const adsWindow = window as AdsWindow;
      adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
      adsWindow.adsbygoogle.push({});
      initialized.current = true;
    } catch (error) {
      // Ad blockers, consent settings, or network restrictions can prevent ad initialization.
      console.warn('AdSense could not initialize this ad unit.', error);
    }
  }, [adsDisabled, isProduction, validSlot]);

  if (adsDisabled) return null;

  if (isProduction && !validSlot) {
    // Do not send a placeholder label or an invalid slot to Google in production.
    return null;
  }

  return (
    <div
      className={`ad-container my-8 w-full min-h-[100px] overflow-hidden flex items-center justify-center ${className}`}
      style={style}
      aria-label="Advertisement"
    >
      {isProduction ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', ...style }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex min-h-[100px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span>Advertisement preview</span>
          <span className="font-normal normal-case tracking-normal">
            Configure a numeric AdSense slot ID before production.
          </span>
        </div>
      )}
    </div>
  );
};
