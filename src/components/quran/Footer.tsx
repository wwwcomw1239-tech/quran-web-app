'use client';

import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface FooterProps {
  onContactDeveloper: () => void;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { onContactDeveloper },
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

          {/* Developer Credits - Prominent */}
          <div className="mb-5">
            <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
              {t('developedBy')}
            </p>
          </div>

          {/* Contact Section with explicit label */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('contactDeveloperFull')}
            </p>
            <Button
              onClick={onContactDeveloper}
              variant="outline"
              className="rounded-xl px-6 py-2.5 h-auto bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300"
            >
              <Mail className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} text-emerald-500`} />
              <span className="text-sm font-medium">almubarmaj8@gmail.com</span>
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
        </div>
      </div>
    </footer>
  );
});
