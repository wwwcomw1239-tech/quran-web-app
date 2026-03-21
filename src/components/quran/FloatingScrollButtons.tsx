'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface FloatingScrollButtonsProps {
  /** Whether audio player is currently visible */
  hasActiveAudio: boolean;
}

export function FloatingScrollButtons({ hasActiveAudio }: FloatingScrollButtonsProps) {
  const { isRTL, t } = useLanguage();
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show scroll up button when scrolled down more than 300px
      setShowScrollUp(scrollY > 300);
      
      // Show scroll down button when not near bottom (more than 200px from bottom)
      setShowScrollDown(documentHeight - scrollY - windowHeight > 200);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  // Don't render if no buttons should be shown
  if (!showScrollUp && !showScrollDown) return null;

  // Dynamic bottom position: above audio player if active, otherwise 24px from bottom
  const bottomPosition = hasActiveAudio ? 'calc(88px + 16px)' : '24px';

  return (
    <div
      className={`fixed z-40 flex flex-col gap-2 ${isRTL ? 'left-3' : 'right-3'}`}
      style={{ bottom: bottomPosition }}
    >
      {/* Scroll to Top */}
      {showScrollUp && (
        <Button
          onClick={scrollToTop}
          className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg transition-all duration-300 hover:scale-105"
          size="icon"
          aria-label={t('backToTop')}
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
      
      {/* Scroll to Bottom */}
      {showScrollDown && (
        <Button
          onClick={scrollToBottom}
          className="h-11 w-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg transition-all duration-300 hover:scale-105"
          size="icon"
          aria-label={isRTL ? 'التمرير للأسفل' : 'Scroll to bottom'}
        >
          <ArrowDown className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
