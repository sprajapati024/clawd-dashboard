'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'desktop' | 'mobile' | 'auto';

interface ViewToggleProps {
  onViewChange?: (mode: ViewMode) => void;
}

export function ViewToggle({ onViewChange }: ViewToggleProps) {
  const [mode, setMode] = useState<ViewMode>('auto');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mode === 'auto') {
        setIsMobile(mobile);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mode]);

  const handleModeChange = (newMode: ViewMode) => {
    setMode(newMode);
    if (newMode !== 'auto') {
      setIsMobile(newMode === 'mobile');
    } else {
      setIsMobile(window.innerWidth < 768);
    }
    onViewChange?.(newMode);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-surface border border-border rounded-full p-1.5 shadow-2xl flex items-center gap-1">
        <button
          onClick={() => handleModeChange('desktop')}
          className={cn(
            'p-2.5 rounded-full transition-all',
            (mode === 'desktop' || (mode === 'auto' && !isMobile))
              ? 'bg-primary text-black'
              : 'text-muted hover:text-white'
          )}
          title="Desktop View"
        >
          <Monitor className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleModeChange('auto')}
          className={cn(
            'p-2.5 rounded-full transition-all',
            mode === 'auto'
              ? 'bg-primary text-black'
              : 'text-muted hover:text-white'
          )}
          title="Auto (Responsive)"
        >
          <Columns className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleModeChange('mobile')}
          className={cn(
            'p-2.5 rounded-full transition-all',
            (mode === 'mobile' || (mode === 'auto' && isMobile))
              ? 'bg-primary text-black'
              : 'text-muted hover:text-white'
          )}
          title="Mobile View"
        >
          <Smartphone className="w-5 h-5" />
        </button>
      </div>
      
      <div className="absolute -top-8 right-0 text-xs text-muted">
        {mode === 'auto' ? (isMobile ? 'Mobile' : 'Desktop') : mode.charAt(0).toUpperCase() + mode.slice(1)}
      </div>
    </div>
  );
}
