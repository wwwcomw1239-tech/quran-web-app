'use client';

import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Mail } from 'lucide-react';

interface FooterProps {
  showBackToTop: boolean;
  onScrollToTop: () => void;
  onContactDeveloper: () => void;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { showBackToTop, onScrollToTop, onContactDeveloper },
  ref
) {
  return (
    <footer
      ref={ref}
      className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12"
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Title */}
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            القرآن الكريم
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            استمع إلى تلاوات عطرة من كتاب الله
          </p>

          {/* Contact Button */}
          <Button
            onClick={onContactDeveloper}
            variant="outline"
            className="mb-6 rounded-xl"
          >
            <Mail className="w-4 h-4 ml-2" />
            تواصل مع المطور
          </Button>

          {/* Divider */}
          <div className="w-24 h-1 bg-emerald-500 mx-auto mb-4 rounded-full" />

          {/* Copyright */}
          <p className="text-sm text-slate-400 dark:text-slate-500">
            جميع التلاوات من موقع{' '}
            <a
              href="https://mp3quran.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Mp3Quran
            </a>
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>

          {/* Back to Top Button */}
          {showBackToTop && (
            <Button
              onClick={onScrollToTop}
              className="fixed bottom-24 left-4 h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
              size="icon"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
});
