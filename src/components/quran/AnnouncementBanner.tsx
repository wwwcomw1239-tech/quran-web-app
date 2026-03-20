'use client';

import { useState, useEffect } from 'react';
import { X, Bell, Megaphone, Sparkles } from 'lucide-react';

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'update';
  isActive: boolean;
  createdAt: string;
}

interface AnnouncementBannerProps {
  className?: string;
}

// Sample announcements - developer can edit these
const announcements: Announcement[] = [
  {
    id: 'new_reciters_100',
    message: '🎉 تم إضافة 15 قارئًا جديداً - أصبح لدينا الآن 100 قارئ متاح!',
    type: 'success',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pwa_update',
    message: '✨ تم تحديث الموقع مع تحسينات الأداء والتوافق مع Cloudflare Pages',
    type: 'update',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'quran_announcements_dismissed';

export function AnnouncementBanner({ className = '' }: AnnouncementBannerProps) {
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

  // Auto-rotate announcements every 6 seconds
  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => 
        (prev + 1) % activeAnnouncements.length
      );
    }, 6000);

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
      // Reset index when dismissed
      setCurrentAnnouncementIndex(0);
    }, 300);
  };

  if (!isVisible || activeAnnouncements.length === 0) return null;

  const currentAnnouncement = activeAnnouncements[currentAnnouncementIndex];
  if (!currentAnnouncement) return null;

  const getTypeStyles = () => {
    switch (currentAnnouncement.type) {
      case 'success':
        return 'bg-gradient-to-l from-emerald-500 to-teal-600 border-emerald-400 text-white';
      case 'update':
        return 'bg-gradient-to-l from-blue-500 to-indigo-600 border-blue-400 text-white';
      case 'warning':
        return 'bg-gradient-to-l from-amber-500 to-orange-600 border-amber-400 text-white';
      default:
        return 'bg-gradient-to-l from-slate-600 to-slate-700 border-slate-400 text-white';
    }
  };

  const getIcon = () => {
    switch (currentAnnouncement.type) {
      case 'success':
        return <Megaphone className="w-4 h-4 animate-pulse" />;
      case 'update':
        return <Sparkles className="w-4 h-4" />;
      case 'warning':
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
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
      <div className={`${getTypeStyles()} shadow-md rounded-xl mx-2`}>
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center justify-center gap-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <p className="text-sm font-medium text-center flex-1">
              {currentAnnouncement.message}
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
              aria-label="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
