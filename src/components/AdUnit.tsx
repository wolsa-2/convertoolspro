import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot?: 'tool-top' | 'tool-bottom' | 'home-top' | string;
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ slot, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear existing content to prevent duplicates during React re-renders
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    
    // Always use the small 320x50 Banner (e69bf1cf764c9bc9b3a83d81eb681dad)
    const optionsScript = document.createElement('script');
    optionsScript.innerHTML = `
      window.atOptions = {
        'key' : 'e69bf1cf764c9bc9b3a83d81eb681dad',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;
    containerRef.current.appendChild(optionsScript);

    script.src = 'https://www.highperformanceformat.com/e69bf1cf764c9bc9b3a83d81eb681dad/invoke.js';
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [slot]);

  return (
    <div className={`ad-wrapper flex flex-col items-center justify-center min-h-[55px] min-w-[320px] overflow-hidden ${className}`}>
      <div 
        ref={containerRef} 
        className="flex items-center justify-center w-[320px] h-[50px] mx-auto overflow-hidden"
      />
    </div>
  );
};

export default AdUnit;
