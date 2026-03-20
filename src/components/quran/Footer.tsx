'use client';

import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Mail, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface FooterProps {
  showBackToTop: boolean;
  onScrollToTop: () => void;
  onContactDeveloper: () => void;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { showBackToTop, onScrollToTop, onContactDeveloper },
  ref
) {
  const { t, isRTL } = useLanguage();

  return (
    <footer
      ref={ref}
      className="bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 border-t border-slate-200 dark:border-slate-700 py-10 mt-12"
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* App Logo & Title */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">نور</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('appName')}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Noor Al-Quran
              </p>
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm">
            {t('appSubtitle')}
          </p>

          {/* Contact Section */}
          <div className="mb-6">
            <Button
              onClick={onContactDeveloper}
              variant="outline"
              className="rounded-xl px-6 py-2.5 h-auto bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300"
            >
              <Mail className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} text-emerald-500`} />
              <span className="text-sm">{t('contactDeveloperFull')}</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="w-24 h-0.5 bg-gradient-to-l from-emerald-400 to-teal-500 mx-auto mb-4 rounded-full" />

          {/* Source Attribution */}
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {isRTL ? 'جميع التلاوات من موقع' : 'All recitations from'}{' '}
            <a
              href="https://mp3quran.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Mp3Quran
            </a>
          </p>

          {/* Copyright */}
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            © {new Date().getFullYear()} {t('appName')} • {t('rights')}
          </p>

          {/* Made with love */}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 flex items-center justify-center gap-1">
            {isRTL ? 'صنع بـ' : 'Made with'}{' '}
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />{' '}
            {isRTL ? 'للمسلمين حول العالم' : 'for Muslims worldwide'}
          </p>

          {/* Back to Top Button */}
          {showBackToTop && (
            <Button
              onClick={onScrollToTop}
              className={`fixed bottom-24 ${isRTL ? 'left-4' : 'right-4'} h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg transition-all duration-300 hover:scale-110`}
              size="icon"
              aria-label={t('backToTop')}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
});
