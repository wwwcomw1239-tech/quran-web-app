'use client';

import { surahs, totalVerses, makkiCount, madaniCount } from '@/data/surahs';
import { BookOpen, ArrowDown } from 'lucide-react';

interface HeaderProps {
  onScrollToBottom: () => void;
}

export function Header({ onScrollToBottom }: HeaderProps) {
  return (
    <header className="bg-gradient-to-l from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">القرآن الكريم</h1>
              <p className="text-emerald-100 text-sm">استمع إلى تلاوات عطرة</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{surahs.length}</div>
              <div className="text-xs text-emerald-100">سورة</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{totalVerses.toLocaleString('ar-EG')}</div>
              <div className="text-xs text-emerald-100">آية</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{makkiCount}</div>
              <div className="text-xs text-emerald-100">مكية</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{madaniCount}</div>
              <div className="text-xs text-emerald-100">مدنية</div>
            </div>
          </div>

          {/* Scroll to Bottom Button */}
          <button
            onClick={onScrollToBottom}
            className="mt-6 w-12 h-12 mx-auto rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="الانتقال إلى الأسفل"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
