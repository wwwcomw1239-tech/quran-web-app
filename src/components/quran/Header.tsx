'use client';

import { surahs, totalVerses, makkiCount, madaniCount } from '@/data/surahs';
import { BookOpen, ArrowDown, Globe, Moon, Sun, Volume2, Play } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onScrollToBottom: () => void;
}

export function Header({ onScrollToBottom }: HeaderProps) {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-l from-emerald-600 via-emerald-700 to-teal-700">
        {/* Decorative Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="white" />
              <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="none" stroke="white" strokeWidth="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
          </svg>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Top Bar with Language & Theme Switchers */}
          <div className="w-full flex justify-between items-center mb-4">
            {/* Theme Toggle - Left Side */}
            {mounted && (
              <Button
                onClick={toggleTheme}
                variant="ghost"
                className="bg-white/10 hover:bg-white/20 text-white rounded-full px-3 py-2 text-sm font-medium backdrop-blur transition-all duration-300"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Shorts Link - Center */}
            <Link
              href="/shorts"
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full px-4 py-2 text-sm font-medium backdrop-blur transition-all duration-300 shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Shorts</span>
            </Link>

            {/* Language Switcher - Right Side */}
            <Button
              onClick={toggleLanguage}
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2 text-sm font-medium backdrop-blur transition-all duration-300 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'ar' ? 'En' : 'عربي'}</span>
            </Button>
          </div>

          {/* App Logo & Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur flex items-center justify-center shadow-xl border border-white/20">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl -z-10" />
            </div>
            <div className="text-right">
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {t('appTitle')}
              </h1>
              <p className="text-emerald-100 text-sm md:text-base">{t('appSubtitle')}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 w-full max-w-2xl">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/10 hover:bg-white/20 transition-all duration-300">
              <div className="text-2xl font-bold text-white">
                {surahs.length}
              </div>
              <div className="text-xs text-emerald-100">{t('surahs')}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/10 hover:bg-white/20 transition-all duration-300">
              <div className="text-2xl font-bold text-white">
                {isRTL ? totalVerses.toLocaleString('ar-EG') : totalVerses.toLocaleString('en-US')}
              </div>
              <div className="text-xs text-emerald-100">{t('verses')}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/10 hover:bg-white/20 transition-all duration-300">
              <div className="text-2xl font-bold text-white">{makkiCount}</div>
              <div className="text-xs text-emerald-100">{t('makki')}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/10 hover:bg-white/20 transition-all duration-300">
              <div className="text-2xl font-bold text-white">{madaniCount}</div>
              <div className="text-xs text-emerald-100">{t('madani')}</div>
            </div>
          </div>

          {/* Audio Badge */}
          <div className="flex items-center gap-2 mt-4 text-white/80 text-sm">
            <Volume2 className="w-4 h-4" />
            <span>
              {isRTL 
                ? '100 قارئ • تشغيل مباشر • تحميل مجاني' 
                : '100 Reciters • Live Streaming • Free Download'}
            </span>
          </div>

          {/* Scroll to Bottom Button */}
          <button
            onClick={onScrollToBottom}
            className="mt-6 w-12 h-12 mx-auto rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10"
            aria-label={t('scrollToBottom')}
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
