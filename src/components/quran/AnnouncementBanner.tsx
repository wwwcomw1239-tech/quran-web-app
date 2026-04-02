'use client';

import { useState, useEffect } from 'react';
import { X, Bell, Megaphone, Sparkles, Volume2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export interface Announcement {
  id: string;
  messageAr: string;
  messageEn: string;
  type: 'info' | 'success' | 'warning' | 'update';
  isActive: boolean;
  createdAt: string;
}

interface AnnouncementBannerProps {
  className?: string;
}

// Developer announcements - can be edited
const announcements: Announcement[] = [
  {
    id: 'new_books_videos',
    messageAr: '📚 تم إضافة مئات الكتب الجديدة وعشرات المقاطع المرئية وقسم مقاطع الأطفال',
    messageEn: '📚 Hundreds of new books and dozens of video clips from Sunni scholars added',
    type: 'update',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'quran_reciters',
    messageAr: '🎧 100 قارئ متاح للاستماع والتحميل مجاناً',
    messageEn: '🎧 100 reciters available for free listening and download',
    type: 'success',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'noor_quran_announcements_dismissed';

export function AnnouncementBanner({ className = '' }: AnnouncementBannerProps) {
  const { language, isRTL } = useLanguage();
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load dismissed announcements from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setDismissedIds(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load dismissed announcements:', error);
      }
    }
  }, []);

  // Get active announcements that haven't been dismissed
  const activeAnnouncements = announcements.filter(
    (a) => a.isActive && !dismissedIds.includes(a.id)
  );

  // Show banner with animation if there are active announcements
  useEffect(() => {
    if (activeAnnouncements.length > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeAnnouncements.length]);

  // Auto-rotate announcements every 8 seconds
  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => 
        (prev + 1) % activeAnnouncements.length
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  const handleDismiss = () => {
    const currentAnnouncement = activeAnnouncements[currentAnnouncementIndex];
    if (currentAnnouncement) {
      const newDismissedIds = [...dismissedIds, currentAnnouncement.id];
      setDismissedIds(newDismissedIds);
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newDismissedIds));
        } catch (error) {
          console.error('Failed to save dismissed announcements:', error);
        }
      }
    }
    
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setCurrentAnnouncementIndex(0);
    }, 300);
  };

  if (!isVisible || activeAnnouncements.length === 0) return null;

  const currentAnnouncement = activeAnnouncements[currentAnnouncementIndex];
  if (!currentAnnouncement) return null;

  const message = isRTL ? currentAnnouncement.messageAr : currentAnnouncement.messageEn;

  const getTypeStyles = () => {
    switch (currentAnnouncement.type) {
      case 'success':
        return 'bg-gradient-to-l from-emerald-500 to-teal-600 border-emerald-400/50 text-white';
      case 'update':
        return 'bg-gradient-to-l from-blue-500 to-indigo-600 border-blue-400/50 text-white';
      case 'warning':
        return 'bg-gradient-to-l from-amber-500 to-orange-600 border-amber-400/50 text-white';
      default:
        return 'bg-gradient-to-l from-slate-600 to-slate-700 border-slate-400/50 text-white';
    }
  };

  const getIcon = () => {
    switch (currentAnnouncement.type) {
      case 'success':
        return <Volume2 className="w-4 h-4 animate-pulse" />;
      case 'update':
        return <Sparkles className="w-4 h-4" />;
      case 'warning':
        return <Bell className="w-4 h-4" />;
      default:
        return <Megaphone className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className={`
        ${className} relative z-50
        transition-all duration-300 ease-in-out
        ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
    >
      <div className={`${getTypeStyles()} shadow-md rounded-xl mx-2 border backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center justify-center gap-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <p className="text-sm font-medium text-center flex-1">
              {message}
            </p>
            
            {/* Pagination dots for multiple announcements */}
            {activeAnnouncements.length > 1 && (
              <div className="flex gap-1.5 items-center">
                {activeAnnouncements.map((_, index) => (
                  <span
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentAnnouncementIndex 
                        ? 'bg-white' 
                        : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
            
            <button
              onClick={handleDismiss}
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label={isRTL ? 'إغلاق' : 'Close'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
