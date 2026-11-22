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
  const adRef = useRef<HTMLModElement | null>(null);
  const initialized = useRef(false);
  const adsDisabled = import.meta.env.VITE_DISABLE_ADS === 'true';
  const isProduction = import.meta.env.PROD;
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-1527585635151141';
  const validSlot = /^\d+$/.test(slot);

  useEffect(() => {
    if (!isProduction || adsDisabled || !validSlot || initialized.current || !adRef.current) {
      return;
    }

    let cancelled = false;
    const initializeAd = () => {
      if (cancelled || initialized.current) return;
      try {
        const adsWindow = window as AdsWindow;
        adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
        adsWindow.adsbygoogle.push({});
        initialized.current = true;
      } catch (error) {
        console.warn('AdSense could not initialize this ad unit.', error);
      }
    };

    const scriptId = 'convertools-adsense-loader';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
      script.addEventListener('load', initializeAd, { once: true });
      script.addEventListener('error', () => console.warn('AdSense script failed to load.'), { once: true });
      document.head.appendChild(script);
    } else if (script.dataset.loaded === 'true') {
      initializeAd();
    } else {
      script.addEventListener('load', initializeAd, { once: true });
      script.addEventListener('error', () => console.warn('AdSense script failed to load.'), { once: true });
    }

    const markLoaded = () => {
      const current = document.getElementById(scriptId);
      if (current) current.dataset.loaded = 'true';
    };
    script.addEventListener('load', markLoaded, { once: true });

    return () => {
      cancelled = true;
      script?.removeEventListener('load', initializeAd);
      // Script errors do not initialize an ad.
      script?.removeEventListener('load', markLoaded);
    };
  }, [adsDisabled, clientId, isProduction, validSlot]);

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
