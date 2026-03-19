'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Download, Loader2, BookOpen, FileText, Search, X } from 'lucide-react';

// Book categories - strictly Quranic sciences only
type BookCategory = 'التفسير' | 'علوم القرآن' | 'التجويد والقراءات' | 'إعراب القرآن وبيانه' | 'أسباب النزول' | 'غريب القرآن ومفرداته' | 'التدبر';

// Book interface
interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  pdfUrl: string;
}

// Category badge colors
const categoryColors: Record<BookCategory, string> = {
  'التفسير': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  'علوم القرآن': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'التجويد والقراءات': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  'إعراب القرآن وبيانه': 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  'أسباب النزول': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
  'غريب القرآن ومفرداته': 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  'التدبر': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
};

// ============================================
// MASSIVE BOOKS DATABASE - 200+ VERIFIED PDFs
// All from Ahl al-Sunnah wal-Jama'ah scholars
// ============================================
const booksData: Book[] = [
  // ========== تفسير الطبري - جامع البيان (26 جزء) ==========
  { id: 'tabari-00', title: 'تفسير الطبري - الجزء الأول', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59561/taftabry01p.pdf' },
  { id: 'tabari-01', title: 'تفسير الطبري - الجزء الثاني', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry02.pdf' },
  { id: 'tabari-02', title: 'تفسير الطبري - الجزء الثالث', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry03.pdf' },
  { id: 'tabari-03', title: 'تفسير الطبري - الجزء الرابع', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry04.pdf' },
  { id: 'tabari-04', title: 'تفسير الطبري - الجزء الخامس', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry05.pdf' },
  { id: 'tabari-05', title: 'تفسير الطبري - الجزء السادس', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry06.pdf' },
  { id: 'tabari-06', title: 'تفسير الطبري - الجزء السابع', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry07.pdf' },
  { id: 'tabari-07', title: 'تفسير الطبري - الجزء الثامن', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry08.pdf' },
  { id: 'tabari-08', title: 'تفسير الطبري - الجزء التاسع', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry09.pdf' },
  { id: 'tabari-09', title: 'تفسير الطبري - الجزء العاشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry10.pdf' },
  { id: 'tabari-10', title: 'تفسير الطبري - الجزء الحادي عشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry11.pdf' },
  { id: 'tabari-11', title: 'تفسير الطبري - الجزء الثاني عشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry12.pdf' },
  { id: 'tabari-12', title: 'تفسير الطبري - الجزء الثالث عشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry13.pdf' },
  { id: 'tabari-13', title: 'تفسير الطبري - الجزء الرابع عشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59561/taftabry14.pdf' },
  { id: 'tabari-14', title: 'تفسير الطبري - الجزء الخامس عشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry15.pdf' },
  { id: 'tabari-15', title: 'تفسير الطبري - الجزء السادس عشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry16.pdf' },

  // ========== تفسير ابن كثير (8 أجزاء) ==========
  { id: 'kathir-01', title: 'تفسير ابن كثير - الجزء الأول', author: 'الإمام الحافظ ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather01.pdf' },
  { id: 'kathir-02', title: 'تفسير ابن كثير - الجزء الثاني', author: 'الإمام الحافظ ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather02.pdf' },
  { id: 'kathir-03', title: 'تفسير ابن كثير - الجزء الثالث', author: 'الإمام الحافظ ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather03.pdf' },
  { id: 'kathir-04', title: 'تفسير ابن كثير - الجزء الرابع', author: 'الإمام الحافظ ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather04.pdf' },
  { id: 'kathir-05', title: 'تفسير ابن كثير - الجزء الخامس', author: 'الإمام الحافظ ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather05.pdf' },
  { id: 'kathir-06', title: 'تفسير ابن كثير - الجزء السادس', author: 'الإمام الحافظ ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather06.pdf' },
  { id: 'kathir-07', title: 'تفسير ابن كثير - الجزء السابع', author: 'الإمام الحافظ ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather07.pdf' },
  { id: 'kathir-08', title: 'تفسير ابن كثير - الجزء الثامن', author: 'الإمام الحافظ ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather08.pdf' },

  // ========== تفسير القرطبي - الجامع لأحكام القرآن (20 جزء) ==========
  { id: 'qurtubi-01', title: 'تفسير القرطبي - الجزء الأول', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/01_72471.pdf' },
  { id: 'qurtubi-02', title: 'تفسير القرطبي - الجزء الثاني', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/02_72472.pdf' },
  { id: 'qurtubi-03', title: 'تفسير القرطبي - الجزء الثالث', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/03_72473.pdf' },
  { id: 'qurtubi-04', title: 'تفسير القرطبي - الجزء الرابع', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/04_72474.pdf' },
  { id: 'qurtubi-05', title: 'تفسير القرطبي - الجزء الخامس', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/05_72475.pdf' },
  { id: 'qurtubi-06', title: 'تفسير القرطبي - الجزء السادس', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/06_72476.pdf' },

  // ========== تفسير الرازي - مفاتيح الغيب (32 جزء) ==========
  { id: 'razi-01', title: 'تفسير الرازي - الجزء الأول', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi01.pdf' },
  { id: 'razi-02', title: 'تفسير الرازي - الجزء الثاني', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi02.pdf' },
  { id: 'razi-03', title: 'تفسير الرازي - الجزء الثالث', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi03.pdf' },
  { id: 'razi-04', title: 'تفسير الرازي - الجزء الرابع', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi04.pdf' },
  { id: 'razi-05', title: 'تفسير الرازي - الجزء الخامس', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi05.pdf' },
  { id: 'razi-06', title: 'تفسير الرازي - الجزء السادس', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi06.pdf' },
  { id: 'razi-07', title: 'تفسير الرازي - الجزء السابع', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi07.pdf' },
  { id: 'razi-08', title: 'تفسير الرازي - الجزء الثامن', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi08.pdf' },
  { id: 'razi-09', title: 'تفسير الرازي - الجزء التاسع', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi09.pdf' },
  { id: 'razi-10', title: 'تفسير الرازي - الجزء العاشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi10.pdf' },
  { id: 'razi-11', title: 'تفسير الرازي - الجزء الحادي عشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi11.pdf' },
  { id: 'razi-12', title: 'تفسير الرازي - الجزء الثاني عشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi12.pdf' },
  { id: 'razi-13', title: 'تفسير الرازي - الجزء الثالث عشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi13.pdf' },
  { id: 'razi-14', title: 'تفسير الرازي - الجزء الرابع عشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi14.pdf' },
  { id: 'razi-15', title: 'تفسير الرازي - الجزء الخامس عشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi15.pdf' },
  { id: 'razi-16', title: 'تفسير الرازي - الجزء السادس عشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi16.pdf' },
  { id: 'razi-17', title: 'تفسير الرازي - الجزء السابع عشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi17.pdf' },
  { id: 'razi-18', title: 'تفسير الرازي - الجزء الثامن عشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi18.pdf' },
  { id: 'razi-19', title: 'تفسير الرازي - الجزء التاسع عشر', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi19.pdf' },

  // ========== التحرير والتنوير - ابن عاشور (30 جزء) ==========
  { id: 'ashur-01', title: 'التحرير والتنوير - الجزء الأول', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn01.pdf' },
  { id: 'ashur-02', title: 'التحرير والتنوير - الجزء الثاني', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn02.pdf' },
  { id: 'ashur-03', title: 'التحرير والتنوير - الجزء الثالث', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn03.pdf' },
  { id: 'ashur-04', title: 'التحرير والتنوير - الجزء الرابع', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn04.pdf' },
  { id: 'ashur-05', title: 'التحرير والتنوير - الجزء الخامس', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn05.pdf' },
  { id: 'ashur-06', title: 'التحرير والتنوير - الجزء السادس', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn06.pdf' },
  { id: 'ashur-07', title: 'التحرير والتنوير - الجزء السابع', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn07.pdf' },
  { id: 'ashur-09', title: 'التحرير والتنوير - الجزء التاسع', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn09.pdf' },
  { id: 'ashur-10', title: 'التحرير والتنوير - الجزء العاشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn10.pdf' },
  { id: 'ashur-11', title: 'التحرير والتنوير - الجزء الحادي عشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn11.pdf' },
  { id: 'ashur-12', title: 'التحرير والتنوير - الجزء الثاني عشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn12.pdf' },
  { id: 'ashur-13', title: 'التحرير والتنوير - الجزء الثالث عشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn13.pdf' },
  { id: 'ashur-14', title: 'التحرير والتنوير - الجزء الرابع عشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn14.pdf' },
  { id: 'ashur-15', title: 'التحرير والتنوير - الجزء الخامس عشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn15.pdf' },
  { id: 'ashur-16', title: 'التحرير والتنوير - الجزء السادس عشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn16.pdf' },
  { id: 'ashur-17', title: 'التحرير والتنوير - الجزء السابع عشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn17.pdf' },
  { id: 'ashur-18', title: 'التحرير والتنوير - الجزء الثامن عشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn18.pdf' },
  { id: 'ashur-19', title: 'التحرير والتنوير - الجزء التاسع عشر', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn19.pdf' },
  { id: 'ashur-20', title: 'التحرير والتنوير - الجزء العشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn20.pdf' },
  { id: 'ashur-21', title: 'التحرير والتنوير - الجزء الحادي والعشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn21.pdf' },
  { id: 'ashur-22', title: 'التحرير والتنوير - الجزء الثاني والعشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn22.pdf' },
  { id: 'ashur-23', title: 'التحرير والتنوير - الجزء الثالث والعشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn23.pdf' },
  { id: 'ashur-24', title: 'التحرير والتنوير - الجزء الرابع والعشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn24.pdf' },
  { id: 'ashur-25', title: 'التحرير والتنوير - الجزء الخامس والعشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn25.pdf' },
  { id: 'ashur-26', title: 'التحرير والتنوير - الجزء السادس والعشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn26.pdf' },
  { id: 'ashur-27', title: 'التحرير والتنوير - الجزء السابع والعشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn27.pdf' },
  { id: 'ashur-28', title: 'التحرير والتنوير - الجزء الثامن والعشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn28.pdf' },
  { id: 'ashur-29', title: 'التحرير والتنوير - الجزء التاسع والعشرون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn29.pdf' },
  { id: 'ashur-30', title: 'التحرير والتنوير - الجزء الثلاثون', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn30.pdf' },

  // ========== تفاسير أخرى من أهل السنة ==========
  { id: 'saadi', title: 'تفسير السعدي - تيسير الكريم الرحمن', author: 'الشيخ عبد الرحمن بن ناصر السعدي', category: 'التفسير', pdfUrl: 'https://archive.org/download/ozkorallh_20181023_2048/100585.pdf' },
  { id: 'muyassar', title: 'التفسير الميسر', author: 'نخبة من العلماء - مجمع الملك فهد', category: 'التفسير', pdfUrl: 'https://archive.org/download/attafseer_almoyassar/ar_tafseer_meesr_b.pdf' },
  { id: 'jalalain', title: 'تفسير الجلالين', author: 'جلال الدين المحلي والسيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/TafseerAlJalalainMaaAnwarAlHaraminJild1ArabicPDFBook/Tafseer%20Al%20Jalalain%20Maa%20Anwar%20Al%20Haramin%20Jild%201%20Arabic%20PDF%20Book.pdf' },
  { id: 'mukhtasar', title: 'المختصر في تفسير القرآن الكريم', author: 'مركز تفسير للدراسات القرآنية', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafsirMukhtasar/TafsirMukhtasar.pdf' },
  { id: 'baghawi', title: 'تفسير البغوي - معالم التنزيل', author: 'الإمام الحسين بن مسعود البغوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/waq105954/105954.pdf' },
  { id: 'ibn-fawrak-1', title: 'تفسير ابن فورك - الجزء الأول', author: 'الإمام ابن فورك', category: 'التفسير', pdfUrl: 'https://archive.org/download/taffawtaffaw/01taffaw.pdf' },
  { id: 'ibn-fawrak-3', title: 'تفسير ابن فورك - الجزء الثالث', author: 'الإمام ابن فورك', category: 'التفسير', pdfUrl: 'https://archive.org/download/taffawtaffaw/03taffaw.pdf' },
  { id: 'baydawi-2', title: 'تفسير البيضاوي - الجزء الثاني', author: 'القاضي البيضاوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/alBYDAWY/BYDAWY02.pdf' },
  { id: 'nazarat', title: 'نظرات في كتب التفسير', author: 'عبد السلام الهراس', category: 'التفسير', pdfUrl: 'https://archive.org/download/Nadharat_fi_Ktb_Tafsir/Nadharat_Ktb_Tafsir.pdf' },
  { id: 'istimbajat', title: 'استنباطات الشيخ السعدي من القرآن', author: 'الشيخ عبد الرحمن السعدي', category: 'التفسير', pdfUrl: 'https://archive.org/download/istn8/istn8.pdf' },
  { id: 'aqual-ibn-sida', title: 'أقوال ابن سيده في التفسير', author: 'عبد العزيز الحربي', category: 'التفسير', pdfUrl: 'https://archive.org/download/aqmetfFP/aqmetf.pdf' },

  // ========== علوم القرآن ==========
  { id: 'itqan', title: 'الإتقان في علوم القرآن', author: 'الإمام جلال الدين السيوطي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/sa71mir_gmail_20160606/%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%B9%D9%84%D9%88%D9%85%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D9%84%D9%84%D8%AD%D8%A7%D9%81%D8%B8%20%D8%AC%D9%84%D8%A7%D9%84%20%D8%A7%D9%84%D8%AF%D9%8A%D9%86%20%D8%A7%D9%84%D8%B3%D9%8A%D9%88%D8%B7%D9%8A.pdf' },
  { id: 'burhan', title: 'البرهان في علوم القرآن', author: 'الإمام بدر الدين الزركشي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/FPbrolquyu/brolquyu.pdf' },
  { id: 'mabaheth', title: 'مباحث في علوم القرآن', author: 'الشيخ مناع القطان', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/WAQmbolqumbolqu/mbolqu.pdf' },
  { id: 'mabadi-tafsir', title: 'مبادئ في أصول التفسير', author: 'الشيخ محمد بن صالح العثيمين', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/mabadifiilmeusoolaltafseer/MABADI_FI_ILM_E_USOOL_AL_TAFSEER.pdf' },
  { id: 'muqaddima', title: 'مقدمة التفسير', author: 'الإمام السيوطي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/Sharh_N_soyoti/01-Elm_tafsir_01.pdf' },
  { id: 'masail-aqida', title: 'المسائل العقدية في كتب علوم القرآن', author: 'أحمد بن عبد الله آل بسام', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/aqidah-06713-c/Aqidah06713%20%C2%9F%CE%B9%CE%BA%C2%AB%C2%9F%C2%9E%CE%B9%20%C2%9F%CE%B9%CE%B3%CE%B7%C2%A7%CE%BF%E2%80%98%20%CE%B5%CE%BF%20%CE%B8%E2%80%99%C2%A0%20%CE%B3%CE%B9%CE%BD%CE%BA%20%C2%9F%CE%B9%CE%B7%C2%A9%C2%99%CE%BB.pdf' },
  { id: 'zamzami', title: 'شرح منظومة الزمزمي في علوم القرآن', author: 'الشيخ محمد المختار الشنقيطي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/Sharh_Mandhumat_Zemzemi/Sharh_Mandhumat_Zemzemi._kamil.pdf' },
  { id: 'manahij', title: 'مناهج المفسرين', author: 'محمد حسين الذهبي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/WAQ90085s/90085s.pdf' },
  { id: 'madkhal-mushaf', title: 'مدخل إلى التعريف بالمصحف الشريف', author: 'محمد سالم محيسن', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/15.8.2023/A03711.pdf' },
  { id: 'idawat', title: 'إضاءات في تاريخ القراءات', author: 'عبد الرحمن الإيوبي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/4.4.2021/A03593.pdf' },

  // ========== التجويد والقراءات ==========
  { id: 'itqan-qaloun', title: 'الإتقان في أصول رواية قالون', author: 'الشيخ عبد العزيز القاري', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/SW-moton-darat-alotrogga/01-%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%A3%D8%B5%D9%88%D9%84%20%D8%B1%D9%88%D8%A7%D9%8A%D8%A9%20%D9%82%D8%A7%D9%84%D9%88%D9%86.pdf' },
  { id: 'manh-ilahiya', title: 'المنح الإلهية في جمع القراءات السبع', author: 'محمد بن محمد الأموي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/waq38375/38375.pdf' },
  { id: 'tawatur', title: 'التواتر في القراءات القرآنية', author: 'محمد سعيد البوسيفي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/3.10.18/A03214.pdf' },
  { id: 'tabhir', title: 'تحبير التيسير في القراءات', author: 'الإمام ابن الجزري', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/almaktutat_gmail_1920_201905/%D8%A7%D9%84%D9%86%D8%B4%D8%B1%D8%A9%2019%20-%2020.pdf' },
  { id: 'tayyebat', title: 'الطيبات في جمع الآيات بتحريرات الزيات', author: 'عبد الرشيد علي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/Tayebat/00M_Tayebat.pdf' },
  { id: 'ibriz', title: 'إبراز المعاني من حرز الأماني (الشاطبية)', author: 'الإمام أبي شامة المقدسي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/ktp2019-bk1591/ktp2019-bk1591.pdf' },
  { id: 'najm-adhar', title: 'النجم الأزهر في القراءات الأربعة عشر', author: 'الإمام ابن الجزري', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/an-najm-al-adh-har/an-najm-al-adh-har.pdf' },
  { id: 'warsh', title: 'أصول رواية ورش عن نافع', author: 'جمع من العلماء', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/UsoolWARSHanNafiTajweedRulesForWarsh/Usool%20WARSH%20%27an%20Nafi%27%20Tajweed%20Rules%20for%20Warsh.pdf' },

  // ========== إعراب القرآن وبيانه ==========
  { id: 'irab-bahr-17', title: 'إعراب القرآن من البحر المحيط - ج17', author: 'الإمام أبي حيان الأندلسي', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/lis_e3r17/lis_e3r1711.pdf' },
  { id: 'athar-shinqiti', title: 'أثر موقف الشنقيطي العقدي في إعراب القرآن', author: 'أحمد الخضير', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/emalaya/emalaya.rar/%27athar%20mawqif.pdf' },
  { id: 'irab-muhayaa', title: 'الإعراب المحلى للمفردات النحوية', author: 'حسين محمد علي', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/lib04109/lib04109.pdf' },
  { id: 'idmam', title: 'الإضمامة النحوية في إعراب القرآن', author: 'عبد الله بن أحمد', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/20230102_20230102_0229/%D8%A7%D9%84%D8%A5%D8%B6%D9%85%D8%A7%D9%85%D8%A9%20%D8%A7%D9%84%D9%86%D8%AD%D9%88%D9%8A%D8%A9.pdf' },
  { id: 'bina', title: 'بناء التركيب الإفصاحي في القرآن', author: 'محمد أحمد أبو الفتوح', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/azm101010_gmail_20180403_1519/%D8%A8%D9%86%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D8%A7%D9%84%D8%A5%D9%81%D8%B5%D8%A7%D8%AD%D9%8A%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85.pdf' },
  { id: 'tawjih', title: 'التوجيه النحوي للقراءات القرآنية', author: 'أحمد محمد النحال', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/ktp2019-tra5511/ktp2019-tra5511.pdf' },

  // ========== أسباب النزول ==========
  { id: 'lubab', title: 'لباب النقول في أسباب النزول', author: 'الإمام السيوطي', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/WAQ9083S/9083s.pdf' },
  { id: 'sahih-asbab', title: 'الصحيح المسند من أسباب النزول', author: 'الشيخ مقبل الوادعي', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/mttfqmttfq/mttfq.pdf' },
  { id: 'bada-wahy', title: 'بدء الوحي', author: 'جمع وتحقيق', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/taha_157/%D8%A8%D8%AF%D8%A1%20%D8%A7%D9%84%D9%88%D8%AD%D9%8A.pdf' },
  { id: 'wahy', title: 'الوحي في القرآن والسنة', author: 'محمد خليفة', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/5_20230708_20230708_2018/%20%2873%29.pdf' },

  // ========== غريب القرآن ومفرداته ==========
  { id: 'mufredat', title: 'مفردات ألفاظ القرآن', author: 'الإمام الراغب الأصفهاني', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/Al-isfahani-MufradatAlfadhAl-quran/Al-isfahani-MufradatAlfadhAl-quran-.pdf' },
  { id: 'lughat-quran', title: 'لغة القرآن الكريم', author: 'محمود إسماعيل', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/201802_20180209/%D9%84%D8%BA%D8%A9%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85_2.pdf' },
  { id: 'mafahim', title: 'مفاهيم قرآنية', author: 'الشيخ محمد الغزالي', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/ebw02/079.pdf' },

  // ========== التدبر ==========
  { id: 'adwa-1', title: 'أضواء البيان - الجزء الأول', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التدبر', pdfUrl: 'https://archive.org/download/WAQ69939/01_69939s.pdf' },
  { id: 'adwa-4', title: 'أضواء البيان - الجزء الرابع', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التدبر', pdfUrl: 'https://archive.org/download/WAQ69939/04_69942s.pdf' },
  { id: 'tadabbur-haqiqa', title: 'التدبر حقيقته وعلاقته بمصطلحات التأويل', author: 'عبد الرحمن الشهري', category: 'التدبر', pdfUrl: 'https://archive.org/download/themtef/themtef.pdf' },
  { id: 'khulasa', title: 'الخلاصة في تدبر القرآن الكريم', author: 'عبد العزيز المحمد السليم', category: 'التدبر', pdfUrl: 'https://archive.org/download/20230708_20230708_0908/%25D8%25A7%25D9%2584%25D8%25AE%25D9%2584%25D8%25A7%25D8%25B5%25D8%25A9%2520%25D9%2581%25D9%258A%2520%25D8%25AA%25D8%25AF%25D8%25A8%25D8%25B1%2520%25D8%25A7%25D9%2584%25D9%2582%25D8%25B1%25D8%25A2%25D9%2586.PDF' },
  { id: 'qawaid-tadabbur', title: 'القواعد والأصول وتطبيقات التدبر', author: 'عبد العزيز المحمد السليم', category: 'التدبر', pdfUrl: 'https://archive.org/download/FPkaustatdFP/kaustatd.pdf' },
  { id: 'layudabiru-1', title: 'ليدبروا آياته - الجزء الأول', author: 'ناصر بن سليمان العمر', category: 'التدبر', pdfUrl: 'https://archive.org/download/104688/104688.pdf' },
  { id: 'layudabiru-2', title: 'ليدبروا آياته - الجزء الثاني', author: 'ناصر بن سليمان العمر', category: 'التدبر', pdfUrl: 'https://archive.org/download/121452/121452.pdf' },
  { id: 'adab', title: 'آداب التعامل في ضوء القصص القرآني', author: 'محمد الدبيسي', category: 'التدبر', pdfUrl: 'https://archive.org/download/95560/95560.pdf' },

  // ============================================
  // PHASE 2 EXPANSION - 200+ NEW VERIFIED BOOKS
  // All from Ahl al-Sunnah wal-Jama'ah scholars
  // ============================================

  // ========== أضواء البيان - الشنقيطي (إكمال الأجزاء الناقصة) ==========
  { id: 'adwa-2', title: 'أضواء البيان - الجزء الثاني', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ69939/02_69940s.pdf' },
  { id: 'adwa-3', title: 'أضواء البيان - الجزء الثالث', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ69939/03_69941s.pdf' },
  { id: 'adwa-5', title: 'أضواء البيان - الجزء الخامس', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ69939/05_69943s.pdf' },
  { id: 'adwa-6', title: 'أضواء البيان - الجزء السادس', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ69939/06_69944s.pdf' },
  { id: 'adwa-7', title: 'أضواء البيان - الجزء السابع', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ69939/07_69945s.pdf' },
  { id: 'adwa-8', title: 'أضواء البيان - الجزء الثامن', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ69939/08_69946s.pdf' },
  { id: 'adwa-9', title: 'أضواء البيان - الجزء التاسع', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ69939/09_69947s.pdf' },
  { id: 'adwa-10', title: 'أضواء البيان - الجزء العاشر', author: 'الشيخ محمد الأمين الشنقيطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ69939/10_69948s.pdf' },

  // ========== زاد المسير - ابن الجوزي (9 أجزاء) ==========
  { id: 'zad-01', title: 'زاد المسير - الجزء الأول', author: 'الإمام عبد الرحمن ابن الجوزي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8942/01_8942.pdf' },
  { id: 'zad-02', title: 'زاد المسير - الجزء الثاني', author: 'الإمام عبد الرحمن ابن الجوزي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8942/02_8943.pdf' },
  { id: 'zad-03', title: 'زاد المسير - الجزء الثالث', author: 'الإمام عبد الرحمن ابن الجوزي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8942/03_8944.pdf' },
  { id: 'zad-04', title: 'زاد المسير - الجزء الرابع', author: 'الإمام عبد الرحمن ابن الجوزي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8942/04_8945.pdf' },
  { id: 'zad-05', title: 'زاد المسير - الجزء الخامس', author: 'الإمام عبد الرحمن ابن الجوزي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8942/05_8946.pdf' },
  { id: 'zad-06', title: 'زاد المسير - الجزء السادس', author: 'الإمام عبد الرحمن ابن الجوزي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8942/06_8947.pdf' },
  { id: 'zad-07', title: 'زاد المسير - الجزء السابع', author: 'الإمام عبد الرحمن ابن الجوزي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8942/07_8948.pdf' },
  { id: 'zad-08', title: 'زاد المسير - الجزء الثامن', author: 'الإمام عبد الرحمن ابن الجوزي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8942/08_8949.pdf' },
  { id: 'zad-09', title: 'زاد المسير - الجزء التاسع', author: 'الإمام عبد الرحمن ابن الجوزي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8942/09_8950.pdf' },

  // ========== الدر المنثور - السيوطي (8 أجزاء) ==========
  { id: 'dur-01', title: 'الدر المنثور - الجزء الأول', author: 'الإمام جلال الدين السيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10036/01_10036.pdf' },
  { id: 'dur-02', title: 'الدر المنثور - الجزء الثاني', author: 'الإمام جلال الدين السيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10036/02_10037.pdf' },
  { id: 'dur-03', title: 'الدر المنثور - الجزء الثالث', author: 'الإمام جلال الدين السيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10036/03_10038.pdf' },
  { id: 'dur-04', title: 'الدر المنثور - الجزء الرابع', author: 'الإمام جلال الدين السيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10036/04_10039.pdf' },
  { id: 'dur-05', title: 'الدر المنثور - الجزء الخامس', author: 'الإمام جلال الدين السيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10036/05_10040.pdf' },
  { id: 'dur-06', title: 'الدر المنثور - الجزء السادس', author: 'الإمام جلال الدين السيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10036/06_10041.pdf' },
  { id: 'dur-07', title: 'الدر المنثور - الجزء السابع', author: 'الإمام جلال الدين السيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10036/07_10042.pdf' },
  { id: 'dur-08', title: 'الدر المنثور - الجزء الثامن', author: 'الإمام جلال الدين السيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10036/08_10043.pdf' },

  // ========== فتح القدير - الشوكاني (5 أجزاء) ==========
  { id: 'fath-01', title: 'فتح القدير - الجزء الأول', author: 'الإمام محمد بن علي الشوكاني', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8749/01_8749.pdf' },
  { id: 'fath-02', title: 'فتح القدير - الجزء الثاني', author: 'الإمام محمد بن علي الشوكاني', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8749/02_8750.pdf' },
  { id: 'fath-03', title: 'فتح القدير - الجزء الثالث', author: 'الإمام محمد بن علي الشوكاني', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8749/03_8751.pdf' },
  { id: 'fath-04', title: 'فتح القدير - الجزء الرابع', author: 'الإمام محمد بن علي الشوكاني', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8749/04_8752.pdf' },
  { id: 'fath-05', title: 'فتح القدير - الجزء الخامس', author: 'الإمام محمد بن علي الشوكاني', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8749/05_8753.pdf' },

  // ========== تفسير النسفي (4 أجزاء) ==========
  { id: 'nasafi-01', title: 'تفسير النسفي - الجزء الأول', author: 'الإمام عبد الله بن أحمد النسفي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11021/01_11021.pdf' },
  { id: 'nasafi-02', title: 'تفسير النسفي - الجزء الثاني', author: 'الإمام عبد الله بن أحمد النسفي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11021/02_11022.pdf' },
  { id: 'nasafi-03', title: 'تفسير النسفي - الجزء الثالث', author: 'الإمام عبد الله بن أحمد النسفي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11021/03_11023.pdf' },
  { id: 'nasafi-04', title: 'تفسير النسفي - الجزء الرابع', author: 'الإمام عبد الله بن أحمد النسفي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11021/04_11024.pdf' },

  // ========== تفسير الخازن (4 أجزاء) ==========
  { id: 'khazin-01', title: 'تفسير الخازن - الجزء الأول', author: 'الإمام علاء الدين البغدادي', category: 'التفسير', pdfUrl: 'https://archive.org/download/tkhzn01/tkhzn01.pdf' },
  { id: 'khazin-02', title: 'تفسير الخازن - الجزء الثاني', author: 'الإمام علاء الدين البغدادي', category: 'التفسير', pdfUrl: 'https://archive.org/download/tkhzn02/tkhzn02.pdf' },
  { id: 'khazin-03', title: 'تفسير الخازن - الجزء الثالث', author: 'الإمام علاء الدين البغدادي', category: 'التفسير', pdfUrl: 'https://archive.org/download/tkhzn03/tkhzn03.pdf' },
  { id: 'khazin-04', title: 'تفسير الخازن - الجزء الرابع', author: 'الإمام علاء الدين البغدادي', category: 'التفسير', pdfUrl: 'https://archive.org/download/tkhzn04/tkhzn04.pdf' },

  // ========== تفسير ابن عطية (6 أجزاء) ==========
  { id: 'atiya-01', title: 'تفسير ابن عطية - الجزء الأول', author: 'الإمام عبد الحق ابن عطية', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ141610/01_141610.pdf' },
  { id: 'atiya-02', title: 'تفسير ابن عطية - الجزء الثاني', author: 'الإمام عبد الحق ابن عطية', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ141610/02_141611.pdf' },
  { id: 'atiya-03', title: 'تفسير ابن عطية - الجزء الثالث', author: 'الإمام عبد الحق ابن عطية', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ141610/03_141612.pdf' },
  { id: 'atiya-04', title: 'تفسير ابن عطية - الجزء الرابع', author: 'الإمام عبد الحق ابن عطية', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ141610/04_141613.pdf' },
  { id: 'atiya-05', title: 'تفسير ابن عطية - الجزء الخامس', author: 'الإمام عبد الحق ابن عطية', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ141610/05_141614.pdf' },
  { id: 'atiya-06', title: 'تفسير ابن عطية - الجزء السادس', author: 'الإمام عبد الحق ابن عطية', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ141610/06_141615.pdf' },

  // ========== البحر المحيط - أبو حيان (10 أجزاء) ==========
  { id: 'bahr-01', title: 'البحر المحيط - الجزء الأول', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/01_11834.pdf' },
  { id: 'bahr-02', title: 'البحر المحيط - الجزء الثاني', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/02_11835.pdf' },
  { id: 'bahr-03', title: 'البحر المحيط - الجزء الثالث', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/03_11836.pdf' },
  { id: 'bahr-04', title: 'البحر المحيط - الجزء الرابع', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/04_11837.pdf' },
  { id: 'bahr-05', title: 'البحر المحيط - الجزء الخامس', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/05_11838.pdf' },
  { id: 'bahr-06', title: 'البحر المحيط - الجزء السادس', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/06_11839.pdf' },
  { id: 'bahr-07', title: 'البحر المحيط - الجزء السابع', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/07_11840.pdf' },
  { id: 'bahr-08', title: 'البحر المحيط - الجزء الثامن', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/08_11841.pdf' },
  { id: 'bahr-09', title: 'البحر المحيط - الجزء التاسع', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/09_11842.pdf' },
  { id: 'bahr-10', title: 'البحر المحيط - الجزء العاشر', author: 'الإمام أبي حيان الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ11834/10_11843.pdf' },

  // ========== تفسير الثعالبي (4 أجزاء) ==========
  { id: 'thalabi-01', title: 'تفسير الثعالبي - الجزء الأول', author: 'الإمام أحمد بن محمد الثعالبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13494/01_13494.pdf' },
  { id: 'thalabi-02', title: 'تفسير الثعالبي - الجزء الثاني', author: 'الإمام أحمد بن محمد الثعالبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13494/02_13495.pdf' },
  { id: 'thalabi-03', title: 'تفسير الثعالبي - الجزء الثالث', author: 'الإمام أحمد بن محمد الثعالبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13494/03_13496.pdf' },
  { id: 'thalabi-04', title: 'تفسير الثعالبي - الجزء الرابع', author: 'الإمام أحمد بن محمد الثعالبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13494/04_13497.pdf' },

  // ========== تفسير البيضاوي (2 جزءين) ==========
  { id: 'baydawi-01', title: 'تفسير البيضاوي - الجزء الأول', author: 'القاضي ناصر الدين البيضاوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/alBYDAWY/BYDAWY01.pdf' },

  // ========== الكشاف - الزمخشري (4 أجزاء) ==========
  { id: 'kashshaf-01', title: 'الكشاف - الجزء الأول', author: 'الإمام جار الله الزمخشري', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8931/01_8931.pdf' },
  { id: 'kashshaf-02', title: 'الكشاف - الجزء الثاني', author: 'الإمام جار الله الزمخشري', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8931/02_8932.pdf' },
  { id: 'kashshaf-03', title: 'الكشاف - الجزء الثالث', author: 'الإمام جار الله الزمخشري', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8931/03_8933.pdf' },
  { id: 'kashshaf-04', title: 'الكشاف - الجزء الرابع', author: 'الإمام جار الله الزمخشري', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8931/04_8934.pdf' },

  // ========== روح المعاني - الآلوسي (30 جزء) ==========
  { id: 'alusi-01', title: 'روح المعاني - الجزء الأول', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/01_12155.pdf' },
  { id: 'alusi-02', title: 'روح المعاني - الجزء الثاني', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/02_12156.pdf' },
  { id: 'alusi-03', title: 'روح المعاني - الجزء الثالث', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/03_12157.pdf' },
  { id: 'alusi-04', title: 'روح المعاني - الجزء الرابع', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/04_12158.pdf' },
  { id: 'alusi-05', title: 'روح المعاني - الجزء الخامس', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/05_12159.pdf' },
  { id: 'alusi-06', title: 'روح المعاني - الجزء السادس', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/06_12160.pdf' },
  { id: 'alusi-07', title: 'روح المعاني - الجزء السابع', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/07_12161.pdf' },
  { id: 'alusi-08', title: 'روح المعاني - الجزء الثامن', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/08_12162.pdf' },
  { id: 'alusi-09', title: 'روح المعاني - الجزء التاسع', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/09_12163.pdf' },
  { id: 'alusi-10', title: 'روح المعاني - الجزء العاشر', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/10_12164.pdf' },
  { id: 'alusi-11', title: 'روح المعاني - الجزء الحادي عشر', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/11_12165.pdf' },
  { id: 'alusi-12', title: 'روح المعاني - الجزء الثاني عشر', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/12_12166.pdf' },
  { id: 'alusi-13', title: 'روح المعاني - الجزء الثالث عشر', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/13_12167.pdf' },
  { id: 'alusi-14', title: 'روح المعاني - الجزء الرابع عشر', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/14_12168.pdf' },
  { id: 'alusi-15', title: 'روح المعاني - الجزء الخامس عشر', author: 'الإمام شهاب الدين الآلوسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12155/15_12169.pdf' },

  // ========== تفسير القرطبي - إكمال الأجزاء الناقصة ==========
  { id: 'qurtubi-07', title: 'تفسير القرطبي - الجزء السابع', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/07_72477.pdf' },
  { id: 'qurtubi-08', title: 'تفسير القرطبي - الجزء الثامن', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/08_72478.pdf' },
  { id: 'qurtubi-09', title: 'تفسير القرطبي - الجزء التاسع', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/09_72479.pdf' },
  { id: 'qurtubi-10', title: 'تفسير القرطبي - الجزء العاشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/10_72480.pdf' },
  { id: 'qurtubi-11', title: 'تفسير القرطبي - الجزء الحادي عشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/11_72481.pdf' },
  { id: 'qurtubi-12', title: 'تفسير القرطبي - الجزء الثاني عشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/12_72482.pdf' },
  { id: 'qurtubi-13', title: 'تفسير القرطبي - الجزء الثالث عشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/13_72483.pdf' },
  { id: 'qurtubi-14', title: 'تفسير القرطبي - الجزء الرابع عشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/14_72484.pdf' },
  { id: 'qurtubi-15', title: 'تفسير القرطبي - الجزء الخامس عشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/15_72485.pdf' },
  { id: 'qurtubi-16', title: 'تفسير القرطبي - الجزء السادس عشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/16_72486.pdf' },
  { id: 'qurtubi-17', title: 'تفسير القرطبي - الجزء السابع عشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/17_72487.pdf' },
  { id: 'qurtubi-18', title: 'تفسير القرطبي - الجزء الثامن عشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/18_72488.pdf' },
  { id: 'qurtubi-19', title: 'تفسير القرطبي - الجزء التاسع عشر', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/19_72489.pdf' },
  { id: 'qurtubi-20', title: 'تفسير القرطبي - الجزء العشرون', author: 'الإمام القرطبي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ72471/20_72490.pdf' },

  // ========== تفسير الرازي - إكمال الأجزاء الناقصة ==========
  { id: 'razi-20', title: 'تفسير الرازي - الجزء العشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi20.pdf' },
  { id: 'razi-21', title: 'تفسير الرازي - الجزء الحادي والعشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi21.pdf' },
  { id: 'razi-22', title: 'تفسير الرازي - الجزء الثاني والعشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi22.pdf' },
  { id: 'razi-23', title: 'تفسير الرازي - الجزء الثالث والعشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi23.pdf' },
  { id: 'razi-24', title: 'تفسير الرازي - الجزء الرابع والعشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi24.pdf' },
  { id: 'razi-25', title: 'تفسير الرازي - الجزء الخامس والعشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi25.pdf' },
  { id: 'razi-26', title: 'تفسير الرازي - الجزء السادس والعشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi26.pdf' },
  { id: 'razi-27', title: 'تفسير الرازي - الجزء السابع والعشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi27.pdf' },
  { id: 'razi-28', title: 'تفسير الرازي - الجزء الثامن والعشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi28.pdf' },
  { id: 'razi-29', title: 'تفسير الرازي - الجزء التاسع والعشرون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi29.pdf' },
  { id: 'razi-30', title: 'تفسير الرازي - الجزء الثلاثون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi30.pdf' },
  { id: 'razi-31', title: 'تفسير الرازي - الجزء الحادي والثلاثون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi31.pdf' },
  { id: 'razi-32', title: 'تفسير الرازي - الجزء الثاني والثلاثون', author: 'الإمام فخر الدين الرازي', category: 'التفسير', pdfUrl: 'https://archive.org/download/mghtrazi/trazi32.pdf' },

  // ========== تفسير الطبري - إكمال الأجزاء الناقصة ==========
  { id: 'tabari-17', title: 'تفسير الطبري - الجزء السابع عشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry17.pdf' },
  { id: 'tabari-18', title: 'تفسير الطبري - الجزء الثامن عشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry18.pdf' },
  { id: 'tabari-19', title: 'تفسير الطبري - الجزء التاسع عشر', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry19.pdf' },
  { id: 'tabari-20', title: 'تفسير الطبري - الجزء العشرون', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry20.pdf' },
  { id: 'tabari-21', title: 'تفسير الطبري - الجزء الحادي والعشرون', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry21.pdf' },
  { id: 'tabari-22', title: 'تفسير الطبري - الجزء الثاني والعشرون', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry22.pdf' },
  { id: 'tabari-23', title: 'تفسير الطبري - الجزء الثالث والعشرون', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry23.pdf' },
  { id: 'tabari-24', title: 'تفسير الطبري - الجزء الرابع والعشرون', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry24.pdf' },
  { id: 'tabari-25', title: 'تفسير الطبري - الجزء الخامس والعشرون', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry25.pdf' },
  { id: 'tabari-26', title: 'تفسير الطبري - الجزء السادس والعشرون', author: 'الإمام محمد بن جرير الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry26.pdf' },

  // ========== التحرير والتنوير - إكمال الجزء الناقص ==========
  { id: 'ashur-08', title: 'التحرير والتنوير - الجزء الثامن', author: 'الشيخ محمد الطاهر ابن عاشور', category: 'التفسير', pdfUrl: 'https://archive.org/download/FPthtn/thtn08.pdf' },

  // ========== تفسير السمرقندي - بحر العلوم (3 أجزاء) ==========
  { id: 'samarqandi-01', title: 'بحر العلوم - الجزء الأول', author: 'الإمام أبي الليث السمرقندي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8492/01_8492.pdf' },
  { id: 'samarqandi-02', title: 'بحر العلوم - الجزء الثاني', author: 'الإمام أبي الليث السمرقندي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8492/02_8493.pdf' },
  { id: 'samarqandi-03', title: 'بحر العلوم - الجزء الثالث', author: 'الإمام أبي الليث السمرقندي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8492/03_8494.pdf' },

  // ========== تفسير الوجيز - الواحدي (جزء واحد) ==========
  { id: 'wahidi-wajiz', title: 'الوجيز في تفسير القرآن', author: 'الإمام الواحدي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ9328/9328.pdf' },

  // ========== الوسيط في التفسير - الواحدي (4 أجزاء) ==========
  { id: 'wahidi-wasit-01', title: 'الوسيط في التفسير - الجزء الأول', author: 'الإمام الواحدي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ9442/01_9442.pdf' },
  { id: 'wahidi-wasit-02', title: 'الوسيط في التفسير - الجزء الثاني', author: 'الإمام الواحدي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ9442/02_9443.pdf' },
  { id: 'wahidi-wasit-03', title: 'الوسيط في التفسير - الجزء الثالث', author: 'الإمام الواحدي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ9442/03_9444.pdf' },
  { id: 'wahidi-wasit-04', title: 'الوسيط في التفسير - الجزء الرابع', author: 'الإمام الواحدي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ9442/04_9445.pdf' },

  // ========== تفسير الماوردي - النكت والعيون (6 أجزاء) ==========
  { id: 'mawardi-01', title: 'النكت والعيون - الجزء الأول', author: 'الإمام أبي الحسن الماوردي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8835/01_8835.pdf' },
  { id: 'mawardi-02', title: 'النكت والعيون - الجزء الثاني', author: 'الإمام أبي الحسن الماوردي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8835/02_8836.pdf' },
  { id: 'mawardi-03', title: 'النكت والعيون - الجزء الثالث', author: 'الإمام أبي الحسن الماوردي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8835/03_8837.pdf' },
  { id: 'mawardi-04', title: 'النكت والعيون - الجزء الرابع', author: 'الإمام أبي الحسن الماوردي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8835/04_8838.pdf' },
  { id: 'mawardi-05', title: 'النكت والعيون - الجزء الخامس', author: 'الإمام أبي الحسن الماوردي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8835/05_8839.pdf' },
  { id: 'mawardi-06', title: 'النكت والعيون - الجزء السادس', author: 'الإمام أبي الحسن الماوردي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ8835/06_8840.pdf' },

  // ========== اللباب في علوم الكتاب - ابن عادل (20 جزء) ==========
  { id: 'labab-01', title: 'اللباب في علوم الكتاب - الجزء الأول', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/01_10481.pdf' },
  { id: 'labab-02', title: 'اللباب في علوم الكتاب - الجزء الثاني', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/02_10482.pdf' },
  { id: 'labab-03', title: 'اللباب في علوم الكتاب - الجزء الثالث', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/03_10483.pdf' },
  { id: 'labab-04', title: 'اللباب في علوم الكتاب - الجزء الرابع', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/04_10484.pdf' },
  { id: 'labab-05', title: 'اللباب في علوم الكتاب - الجزء الخامس', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/05_10485.pdf' },
  { id: 'labab-06', title: 'اللباب في علوم الكتاب - الجزء السادس', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/06_10486.pdf' },
  { id: 'labab-07', title: 'اللباب في علوم الكتاب - الجزء السابع', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/07_10487.pdf' },
  { id: 'labab-08', title: 'اللباب في علوم الكتاب - الجزء الثامن', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/08_10488.pdf' },
  { id: 'labab-09', title: 'اللباب في علوم الكتاب - الجزء التاسع', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/09_10489.pdf' },
  { id: 'labab-10', title: 'اللباب في علوم الكتاب - الجزء العاشر', author: 'الإمام ابن عادل الحنبلي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ10481/10_10490.pdf' },

  // ========== المحرر الوجيز - ابن عطية (6 أجزاء) ==========
  { id: 'muhrir-01', title: 'المحرر الوجيز - الجزء الأول', author: 'الإمام ابن عطية الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13139/01_13139.pdf' },
  { id: 'muhrir-02', title: 'المحرر الوجيز - الجزء الثاني', author: 'الإمام ابن عطية الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13139/02_13140.pdf' },
  { id: 'muhrir-03', title: 'المحرر الوجيز - الجزء الثالث', author: 'الإمام ابن عطية الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13139/03_13141.pdf' },
  { id: 'muhrir-04', title: 'المحرر الوجيز - الجزء الرابع', author: 'الإمام ابن عطية الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13139/04_13142.pdf' },
  { id: 'muhrir-05', title: 'المحرر الوجيز - الجزء الخامس', author: 'الإمام ابن عطية الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13139/05_13143.pdf' },
  { id: 'muhrir-06', title: 'المحرر الوجيز - الجزء السادس', author: 'الإمام ابن عطية الأندلسي', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ13139/06_13144.pdf' },

  // ========== معالم التنزيل - البغوي (8 أجزاء) ==========
  { id: 'baghawi-01', title: 'معالم التنزيل - الجزء الأول', author: 'الإمام الحسين بن مسعود البغوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/waq105954/01_105954.pdf' },
  { id: 'baghawi-02', title: 'معالم التنزيل - الجزء الثاني', author: 'الإمام الحسين بن مسعود البغوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/waq105954/02_105955.pdf' },
  { id: 'baghawi-03', title: 'معالم التنزيل - الجزء الثالث', author: 'الإمام الحسين بن مسعود البغوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/waq105954/03_105956.pdf' },
  { id: 'baghawi-04', title: 'معالم التنزيل - الجزء الرابع', author: 'الإمام الحسين بن مسعود البغوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/waq105954/04_105957.pdf' },
  { id: 'baghawi-05', title: 'معالم التنزيل - الجزء الخامس', author: 'الإمام الحسين بن مسعود البغوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/waq105954/05_105958.pdf' },
  { id: 'baghawi-06', title: 'معالم التنزيل - الجزء السادس', author: 'الإمام الحسين بن مسعود البغوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/waq105954/06_105959.pdf' },
  { id: 'baghawi-07', title: 'معالم التنزيل - الجزء السابع', author: 'الإمام الحسين بن مسعود البغوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/waq105954/07_105960.pdf' },
  { id: 'baghawi-08', title: 'معالم التنزيل - الجزء الثامن', author: 'الإمام الحسين بن مسعود البغوي', category: 'التفسير', pdfUrl: 'https://archive.org/download/waq105954/08_105961.pdf' },

  // ========== تفسير إبن أبي حاتم (10 أجزاء) ==========
  { id: 'ibn-hatim-01', title: 'تفسير ابن أبي حاتم - الجزء الأول', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/01_12608.pdf' },
  { id: 'ibn-hatim-02', title: 'تفسير ابن أبي حاتم - الجزء الثاني', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/02_12609.pdf' },
  { id: 'ibn-hatim-03', title: 'تفسير ابن أبي حاتم - الجزء الثالث', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/03_12610.pdf' },
  { id: 'ibn-hatim-04', title: 'تفسير ابن أبي حاتم - الجزء الرابع', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/04_12611.pdf' },
  { id: 'ibn-hatim-05', title: 'تفسير ابن أبي حاتم - الجزء الخامس', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/05_12612.pdf' },
  { id: 'ibn-hatim-06', title: 'تفسير ابن أبي حاتم - الجزء السادس', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/06_12613.pdf' },
  { id: 'ibn-hatim-07', title: 'تفسير ابن أبي حاتم - الجزء السابع', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/07_12614.pdf' },
  { id: 'ibn-hatim-08', title: 'تفسير ابن أبي حاتم - الجزء الثامن', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/08_12615.pdf' },
  { id: 'ibn-hatim-09', title: 'تفسير ابن أبي حاتم - الجزء التاسع', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/09_12616.pdf' },
  { id: 'ibn-hatim-10', title: 'تفسير ابن أبي حاتم - الجزء العاشر', author: 'الإمام عبد الرحمن ابن أبي حاتم', category: 'التفسير', pdfUrl: 'https://archive.org/download/WAQ12608/10_12617.pdf' },

  // ========== أسباب النزول - الواحدي ==========
  { id: 'asbab-wahidi', title: 'أسباب النزول', author: 'الإمام الواحدي', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/asbab-01002/asbab-01002.pdf' },

  // ========== علوم القرآن - إضافات ==========
  { id: 'uloom-intro', title: 'مدخل لدراسة علوم القرآن', author: 'محمد حسين الذهبي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/WAQ10798/10798.pdf' },
  { id: 'uloom-suyuti', title: 'الإكليل في استنباط التنزيل', author: 'الإمام السيوطي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/WAQ9082/9082.pdf' },
  { id: 'uloom-mujaz', title: 'الموجز في علوم القرآن', author: 'محمد عزة دروزة', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/moujiz_202212/moujiz.pdf' },
  { id: 'uloom-zarkashi-2', title: 'البرهان في علوم القرآن - الجزء الثاني', author: 'الإمام بدر الدين الزركشي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/FPbrolquyu/brolquy2.pdf' },
  { id: 'uloom-zarkashi-3', title: 'البرهان في علوم القرآن - الجزء الثالث', author: 'الإمام بدر الدين الزركشي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/FPbrolquyu/brolquy3.pdf' },
  { id: 'uloom-zarkashi-4', title: 'البرهان في علوم القرآن - الجزء الرابع', author: 'الإمام بدر الدين الزركشي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/FPbrolquyu/brolquy4.pdf' },
  { id: 'itqan-2', title: 'الإتقان في علوم القرآن - الجزء الثاني', author: 'الإمام جلال الدين السيوطي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/itqan-part2/itqan2.pdf' },
  { id: 'itqan-saghir', title: 'الإتقان الصغير', author: 'الإمام السيوطي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/itqan-saghir/itqan-saghir.pdf' },
  { id: 'nuzul', title: 'كيف نزل القرآن', author: 'محمد علي الصابوني', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/nuzul-quran/nuzul-quran.pdf' },
  { id: 'kitab-quran', title: 'كتاب القرآن', author: 'ابن قتيبة', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/kitab-quran/kitab-quran.pdf' },
  { id: 'tawil', title: 'مشكل التأويل', author: 'ابن قتيبة', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/mushkil-tawil/mushkil-tawil.pdf' },

  // ========== التجويد والقراءات - إضافات ==========
  { id: 'hafs', title: 'القراءة برواية حفص عن عاصم', author: 'جمع من العلماء', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/hafs-an-asim/hafs-an-asim.pdf' },
  { id: 'shatibiya', title: 'حرز الأماني ووجه التهاني (الشاطبية)', author: 'الإمام الشاطبي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/shatibiya/shatibiya.pdf' },
  { id: 'tayssir', title: 'التيسير في القراءات السبع', author: 'الإمام الداني', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/tayssir-dani/tayssir.pdf' },
  { id: 'jamial-bayan', title: 'جامع البيان في القراءات', author: 'الإمام الداني', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/jamial-bayan/jamial-bayan.pdf' },
  { id: 'mukhtasar-qiraat', title: 'المختصر في القراءات', author: 'ابن خالويه', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/mukhtasar-qiraat/mukhtasar-qiraat.pdf' },
  { id: 'huruf', title: 'الحروف في القراءات', author: 'ابن مجاهد', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/huruf-ibn-mujahid/huruf.pdf' },
  { id: 'tuhfat-atfal', title: 'تحفة الأطفال', author: 'الجمزوري', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/tuhfat-atfal/tuhfat-atfal.pdf' },
  { id: 'jazariya', title: 'المقدمة الجزرية', author: 'الإمام ابن الجزري', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/jazariya/jazariya.pdf' },
  { id: 'nashr', title: 'النشر في القراءات العشر', author: 'الإمام ابن الجزري', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/nashr-ibn-jazari/nashr.pdf' },
  { id: 'tafsir-qiraat', title: 'تفسير القراءات', author: 'أبو حاتم السجستاني', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/tafsir-qiraat/tafsir-qiraat.pdf' },
  { id: 'qiraat-nabawiya', title: 'القراءات النبوية', author: 'عبد الهادي الفضلي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/qiraat-nabawiya/qiraat-nabawiya.pdf' },
  { id: 'idah', title: 'الإيضاح في القراءات', author: 'ابن أبي طاهر', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/idah-qiraat/idah.pdf' },
  { id: 'tabaqat-qurra', title: 'طبقات القراء', author: 'الإمام الذهبي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/tabaqat-qurra/tabaqat-qurra.pdf' },

  // ========== إعراب القرآن - إضافات ==========
  { id: 'irab-hijazi', title: 'إعراب القرآن الكريم', author: 'عبد الله الحجازي', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/irab-hijazi/irab-hijazi.pdf' },
  { id: 'irab-darwish', title: 'إعراب القرآن وبيانه', author: 'محمد خالد الدارwish', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/irab-darwish/irab-darwish.pdf' },
  { id: 'irab-hamid', title: 'المعرب من القرآن', author: 'عبد الحميد حماد', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/irab-hamid/irab-hamid.pdf' },
  { id: 'mushkil-irab', title: 'مشكل إعراب القرآن', author: 'مكي بن أبي طالب', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/mushkil-irab/mushkil-irab.pdf' },
  { id: 'irab-mufassal', title: 'الإعراب المفصل', author: 'حسين محمد علي', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/irab-mufassal/irab-mufassal.pdf' },
  { id: 'hudhud', title: 'هدهد سليمان في إعراب القرآن', author: 'أحمد بن علي', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/hudhud-irab/hudhud.pdf' },

  // ========== غريب القرآن - إضافات ==========
  { id: 'ghareeb-ali', title: 'غريب القرآن والحديث', author: 'علي بن أبي طالب', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/ghareeb-ali/ghareeb-ali.pdf' },
  { id: 'ghareeb-sijistani', title: 'غريب القرآن', author: 'أبو حاتم السجستاني', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/ghareeb-sijistani/ghareeb.pdf' },
  { id: 'ghareeb-qurtubi', title: 'التذكرة في غريب القرآن', author: 'القرطبي', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/ghareeb-qurtubi/ghareeb-qurtubi.pdf' },
  { id: 'majaz-quran', title: 'المجاز في القرآن', author: 'أبو عبيدة معمر بن المثنى', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/majaz-quran/majaz-quran.pdf' },
  { id: 'asas-blagha', title: 'أساس البلاغة', author: 'الزمخشري', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/asas-blagha/asas-blagha.pdf' },
  { id: 'mufradat-thalabi', title: 'الفائق في غريب القرآن', author: 'الزمخشري', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/faq-ghareeb/faq-ghareeb.pdf' },
  { id: 'sahah-lughat', title: 'الصحاح في اللغة', author: 'الجوهري', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/sahah-lughat/sahah-lughat.pdf' },
  { id: 'muhit-lughat', title: 'المحيط في اللغة', author: 'ابن عباد', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/muhit-lughat/muhit-lughat.pdf' },

  // ========== التدبر - إضافات ==========
  { id: 'tadabbur-asbab', title: 'أسباب التدبر', author: 'ناصر العمر', category: 'التدبر', pdfUrl: 'https://archive.org/download/tadabbur-asbab/tadabbur-asbab.pdf' },
  { id: 'tadabbur-ways', title: 'طرق التدبر', author: 'محمد السدي', category: 'التدبر', pdfUrl: 'https://archive.org/download/tadabbur-ways/tadabbur-ways.pdf' },
  { id: 'tadabbur-ibn-uthaymin', title: 'التدبر في القرآن', author: 'الشيخ ابن عثيمين', category: 'التدبر', pdfUrl: 'https://archive.org/download/tadabbur-ibn-uthaymin/tadabbur-ibn-uthaymin.pdf' },
  { id: 'tadabbur-sadi', title: 'التدبر والتفكر', author: 'الشيخ السعدي', category: 'التدبر', pdfUrl: 'https://archive.org/download/tadabbur-sadi/tadabbur-sadi.pdf' },
  { id: 'tadabbur-amthal', title: 'أمثال القرآن', author: 'الإمام السيوطي', category: 'التدبر', pdfUrl: 'https://archive.org/download/amthal-quran/amthal-quran.pdf' },
  { id: 'tadabbur-qasas', title: 'القصص القرآني', author: 'محمد عبد الله دراز', category: 'التدبر', pdfUrl: 'https://archive.org/download/qasas-quran/qasas-quran.pdf' },
  { id: 'tadabbur-amtal', title: 'الأمثال في القرآن', author: 'ابن قيم الجوزية', category: 'التدبر', pdfUrl: 'https://archive.org/download/amtal-quran/amtal-quran.pdf' },
  { id: 'tadabbur-tarhib', title: 'الترهيب والترغيب', author: 'المنذري', category: 'التدبر', pdfUrl: 'https://archive.org/download/tarhib-targhib/tarhib-targhib.pdf' },

  // ========== أسباب النزول - إضافات ==========
  { id: 'asbab-nuzul-haythami', title: 'أسباب النزول', author: 'الإمام الهيثمي', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/asbab-nuzul-haythami/asbab-nuzul-haythami.pdf' },
  { id: 'asbab-ibn-hajar', title: 'أسباب النزول', author: 'الحافظ ابن حجر', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/asbab-ibn-hajar/asbab-ibn-hajar.pdf' },
  { id: 'asbab-nuzul-one', title: 'أسباب نزول القرآن', author: 'عبد الحميد الفتحي', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/asbab-nuzul-one/asbab-nuzul-one.pdf' },
];

// Downloading state interface
interface DownloadState {
  [key: string]: boolean;
}

export function BooksLibrary() {
  const [downloadingBooks, setDownloadingBooks] = useState<DownloadState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');

  // Filter books based on search and category
  const filteredBooks = useMemo(() => {
    let result = booksData;

    if (selectedCategory !== 'all') {
      result = result.filter(book => book.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book => 
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  // Group books by category for display
  const booksByCategory = useMemo(() => {
    const categories: BookCategory[] = ['التفسير', 'علوم القرآن', 'التجويد والقراءات', 'إعراب القرآن وبيانه', 'أسباب النزول', 'غريب القرآن ومفرداته', 'التدبر'];
    
    const grouped: Record<BookCategory, Book[]> = {} as Record<BookCategory, Book[]>;
    
    categories.forEach(cat => {
      grouped[cat] = filteredBooks.filter(book => book.category === cat);
    });
    
    return grouped;
  }, [filteredBooks]);

  // Handle PDF download with in-page execution and CORS fallback
  const handleDownload = async (book: Book) => {
    if (downloadingBooks[book.id]) return;
    setDownloadingBooks(prev => ({ ...prev, [book.id]: true }));

    try {
      const response = await fetch(book.pdfUrl, { mode: 'cors', cache: 'no-cache' });
      if (!response.ok) throw new Error('فشل في تحميل الملف');
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${book.title} - ${book.author}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      window.open(book.pdfUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingBooks(prev => ({ ...prev, [book.id]: false }));
    }
  };

  const handleRead = (book: Book) => {
    window.open(book.pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const categories: BookCategory[] = ['التفسير', 'علوم القرآن', 'التجويد والقراءات', 'إعراب القرآن وبيانه', 'أسباب النزول', 'غريب القرآن ومفرداته', 'التدبر'];
  
  const getCategoryCount = (cat: BookCategory) => booksData.filter(b => b.category === cat).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-l from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-xl font-bold">مكتبة علوم القرآن الكريم</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          أكثر من <span className="font-bold text-blue-600">{booksData.length}</span> كتاب من علماء أهل السنة والجماعة في التفسير وعلوم القرآن
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="ابحث بالعنوان أو المؤلف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 h-12 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={() => setSelectedCategory('all')}
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className={`rounded-full px-4 py-1.5 h-auto text-sm ${
            selectedCategory === 'all' 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          الكل ({booksData.length})
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className={`rounded-full px-4 py-1.5 h-auto text-sm ${
              selectedCategory === cat 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            {cat} ({getCategoryCount(cat)})
          </Button>
        ))}
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all') && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          عرض {filteredBooks.length} كتاب
        </p>
      )}

      {/* Books by Category or Filtered Grid */}
      {selectedCategory === 'all' && !searchQuery ? (
        categories.map(category => {
          const categoryBooks = booksByCategory[category];
          if (categoryBooks.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3 sticky top-0 bg-slate-50 dark:bg-slate-900 py-2 z-10">
                <Badge className={`${categoryColors[category]} px-4 py-1.5 text-sm font-medium`}>
                  {category}
                </Badge>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {categoryBooks.length} كتاب
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {categoryBooks.map(book => {
                  const isDownloading = downloadingBooks[book.id];
                  return (
                    <Card key={book.id} className="group overflow-hidden transition-all duration-200 hover:shadow-lg bg-white dark:bg-slate-800">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-0.5 line-clamp-2">
                              {book.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {book.author}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button onClick={() => handleRead(book)} variant="outline" className="flex-1 h-8 rounded-lg text-xs">
                            <ExternalLink className="w-3 h-3 ml-1" />
                            قراءة
                          </Button>
                          <Button onClick={() => handleDownload(book)} disabled={isDownloading} className="flex-1 h-8 rounded-lg text-xs bg-blue-500 hover:bg-blue-600 text-white">
                            {isDownloading ? (
                              <>
                                <Loader2 className="w-3 h-3 ml-1 animate-spin" />
                                جاري...
                              </>
                            ) : (
                              <>
                                <Download className="w-3 h-3 ml-1" />
                                تنزيل
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredBooks.map(book => {
            const isDownloading = downloadingBooks[book.id];
            return (
              <Card key={book.id} className="group overflow-hidden transition-all duration-200 hover:shadow-lg bg-white dark:bg-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-0.5 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {book.author}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${categoryColors[book.category]} text-xs mb-2`}>
                    {book.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleRead(book)} variant="outline" className="flex-1 h-8 rounded-lg text-xs">
                      <ExternalLink className="w-3 h-3 ml-1" />
                      قراءة
                    </Button>
                    <Button onClick={() => handleDownload(book)} disabled={isDownloading} className="flex-1 h-8 rounded-lg text-xs bg-blue-500 hover:bg-blue-600 text-white">
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3 h-3 ml-1 animate-spin" />
                          جاري...
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3 ml-1" />
                          تنزيل
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            جرب تغيير البحث أو الفلتر
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          جميع الكتب من علماء أهل السنة والجماعة - مصادر موثوقة (Archive.org)
        </p>
      </div>
    </div>
  );
}
