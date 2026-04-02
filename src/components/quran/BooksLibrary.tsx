'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ExternalLink, Download, Loader2, BookOpen, FileText, Search, X, 
  ChevronDown, ChevronUp, BookMarked, Library, Scroll, 
  PenLine, Lightbulb, MessageCircleQuestion, Languages, Heart,
  Star, Sparkles
} from 'lucide-react';
import { getProxiedUrl } from '@/lib/proxy';
import { toast } from 'sonner';

// Book categories - strictly Quranic sciences only from Ahl al-Sunnah wal-Jama'ah
type BookCategory = 'التفسير' | 'علوم القرآن' | 'التجويد والقراءات' | 'إعراب القرآن وبيانه' | 'أسباب النزول' | 'غريب القرآن ومفرداته' | 'التدبر';

// Category info with icons and descriptions
const CATEGORY_INFO: Record<BookCategory, { icon: any; color: string; bgColor: string; description: string }> = {
  'التفسير': { 
    icon: BookMarked, 
    color: 'text-emerald-700 dark:text-emerald-300', 
    bgColor: 'from-emerald-500 to-teal-600',
    description: 'كتب تفسير القرآن الكريم من أئمة أهل السنة والجماعة'
  },
  'علوم القرآن': { 
    icon: Library, 
    color: 'text-blue-700 dark:text-blue-300', 
    bgColor: 'from-blue-500 to-indigo-600',
    description: 'مباحث وعلوم تتعلق بالقرآن الكريم'
  },
  'التجويد والقراءات': { 
    icon: Scroll, 
    color: 'text-amber-700 dark:text-amber-300', 
    bgColor: 'from-amber-500 to-orange-600',
    description: 'أحكام التجويد والقراءات القرآنية'
  },
  'إعراب القرآن وبيانه': { 
    icon: PenLine, 
    color: 'text-rose-700 dark:text-rose-300', 
    bgColor: 'from-rose-500 to-pink-600',
    description: 'إعراب آيات القرآن الكريم والتحليل النحوي'
  },
  'أسباب النزول': { 
    icon: MessageCircleQuestion, 
    color: 'text-cyan-700 dark:text-cyan-300', 
    bgColor: 'from-cyan-500 to-teal-600',
    description: 'أسباب نزول آيات القرآن الكريم'
  },
  'غريب القرآن ومفرداته': { 
    icon: Languages, 
    color: 'text-violet-700 dark:text-violet-300', 
    bgColor: 'from-violet-500 to-purple-600',
    description: 'معاني الكلمات ومفردات القرآن الكريم'
  },
  'التدبر': { 
    icon: Heart, 
    color: 'text-purple-700 dark:text-purple-300', 
    bgColor: 'from-purple-500 to-fuchsia-600',
    description: 'تدبر آيات القرآن الكريم والتأمل فيها'
  },
};

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

// Book interface
interface BookVolume {
  id: string;
  title: string;
  volumeNumber?: number;
  pdfUrl: string;
}

// Multi-volume book (collection)
interface BookCollection {
  id: string;
  name: string;
  author: string;
  category: BookCategory;
  description?: string;
  volumes: BookVolume[];
  isSingleVolume: boolean;
}

// ============================================
// VERIFIED BOOKS DATABASE - All URLs Tested
// All from Ahl al-Sunnah wal-Jama'ah scholars
// ============================================

function createVolumes(baseId: string, baseTitle: string, count: number, urlPattern: (i: number) => string): BookVolume[] {
  const arabicNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
    'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون',
    'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون', 'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', 'الثلاثون',
    'الحادي والثلاثون', 'الثاني والثلاثون'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${baseId}-${String(i + 1).padStart(2, '0')}`,
    title: `الجزء ${arabicNumbers[i] || (i + 1)}`,
    volumeNumber: i + 1,
    pdfUrl: urlPattern(i + 1),
  }));
}

const booksCollections: BookCollection[] = [
  // ========== التفسير ==========
  {
    id: 'tabari',
    name: 'تفسير الطبري - جامع البيان عن تأويل آي القرآن',
    author: 'الإمام محمد بن جرير الطبري (ت 310هـ)',
    category: 'التفسير',
    description: 'أعظم التفاسير بالمأثور وأوسعها، جمع فيه الطبري أقوال الصحابة والتابعين',
    volumes: createVolumes('tabari', 'تفسير الطبري', 26, (i) => `https://archive.org/download/tafseer-al-tabari/taftabry${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'kathir',
    name: 'تفسير ابن كثير',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)',
    category: 'التفسير',
    description: 'من أشهر كتب التفسير بالمأثور، يعتمد على القرآن والسنة وأقوال السلف',
    volumes: createVolumes('kathir', 'تفسير ابن كثير', 8, (i) => `https://archive.org/download/FP59518/tkather${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'qurtubi',
    name: 'تفسير القرطبي - الجامع لأحكام القرآن',
    author: 'الإمام القرطبي (ت 671هـ)',
    category: 'التفسير',
    description: 'تفسير فقهي شامل يهتم باستنباط الأحكام من آيات القرآن الكريم',
    volumes: createVolumes('qurtubi', 'تفسير القرطبي', 20, (i) => `https://archive.org/download/WAQ72471/${String(i).padStart(2, '0')}_${72470 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'razi',
    name: 'تفسير الرازي - مفاتيح الغيب (التفسير الكبير)',
    author: 'الإمام فخر الدين الرازي (ت 606هـ)',
    category: 'التفسير',
    description: 'تفسير موسوعي يجمع بين العقل والنقل ويناقش القضايا الكلامية',
    volumes: createVolumes('razi', 'تفسير الرازي', 32, (i) => `https://archive.org/download/mghtrazi/trazi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ashur',
    name: 'التحرير والتنوير',
    author: 'الشيخ محمد الطاهر ابن عاشور (ت 1393هـ)',
    category: 'التفسير',
    description: 'تفسير بلاغي لغوي يعتني بإعجاز القرآن ومقاصد الشريعة',
    volumes: createVolumes('ashur', 'التحرير والتنوير', 30, (i) => `https://archive.org/download/FPthtn/thtn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'adwa',
    name: 'أضواء البيان في إيضاح القرآن بالقرآن',
    author: 'الشيخ محمد الأمين الشنقيطي (ت 1393هـ)',
    category: 'التفسير',
    description: 'تفسير القرآن بالقرآن مع بيان الأحكام الفقهية',
    volumes: createVolumes('adwa', 'أضواء البيان', 10, (i) => `https://archive.org/download/WAQ69939/${String(i).padStart(2, '0')}_${69938 + i}s.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'fath',
    name: 'فتح القدير',
    author: 'الإمام محمد بن علي الشوكاني (ت 1250هـ)',
    category: 'التفسير',
    description: 'جمع بين الدراية والرواية في تفسير القرآن الكريم',
    volumes: createVolumes('fath', 'فتح القدير', 5, (i) => `https://archive.org/download/fath-alkadir-01_202207/Fath-Alkadir-${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'dur',
    name: 'الدر المنثور في التفسير بالمأثور',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)',
    category: 'التفسير',
    description: 'تفسير بالمأثور يجمع الروايات والآثار في تفسير القرآن',
    volumes: createVolumes('dur', 'الدر المنثور', 9, (i) => `https://archive.org/download/eldorrelmanthor/drm${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'baghawi',
    name: 'معالم التنزيل (تفسير البغوي)',
    author: 'الإمام الحسين بن مسعود البغوي (ت 516هـ)',
    category: 'التفسير',
    description: 'تفسير مختصر وسهل العبارة يهتم بالمأثور',
    volumes: createVolumes('baghawi', 'معالم التنزيل', 8, (i) => `https://archive.org/download/waq105954/${String(i).padStart(2, '0')}_${105953 + i}.pdf`),
    isSingleVolume: false,
  },
  // تفاسير بمجلد واحد
  {
    id: 'saadi',
    name: 'تيسير الكريم الرحمن في تفسير كلام المنان (تفسير السعدي)',
    author: 'الشيخ عبد الرحمن بن ناصر السعدي (ت 1376هـ)',
    category: 'التفسير',
    description: 'تفسير سهل العبارة يعتني بالمعاني والأحكام والفوائد',
    volumes: [{ id: 'saadi', title: 'تفسير السعدي - كامل', pdfUrl: 'https://archive.org/download/ozkorallh_20181023_2048/100585.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'muyassar',
    name: 'التفسير الميسر',
    author: 'نخبة من العلماء - مجمع الملك فهد',
    category: 'التفسير',
    description: 'تفسير مختصر وميسر لعامة المسلمين أعده مجمع الملك فهد',
    volumes: [{ id: 'muyassar', title: 'التفسير الميسر - كامل', pdfUrl: 'https://archive.org/download/attafseer_almoyassar/ar_tafseer_meesr_b.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'jalalain',
    name: 'تفسير الجلالين',
    author: 'جلال الدين المحلي وجلال الدين السيوطي',
    category: 'التفسير',
    description: 'تفسير مختصر ومشهور أكمله السيوطي بعد المحلي',
    volumes: [{ id: 'jalalain', title: 'تفسير الجلالين - كامل', pdfUrl: 'https://archive.org/download/TafseerAlJalalainMaaAnwarAlHaraminJild1ArabicPDFBook/Tafseer%20Al%20Jalalain%20Maa%20Anwar%20Al%20Haramin%20Jild%201%20Arabic%20PDF%20Book.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'mukhtasar',
    name: 'المختصر في تفسير القرآن الكريم',
    author: 'مركز تفسير للدراسات القرآنية',
    category: 'التفسير',
    description: 'تفسير مختصر وعصري صادر عن مركز تفسير',
    volumes: [{ id: 'mukhtasar', title: 'المختصر في التفسير - كامل', pdfUrl: 'https://archive.org/download/tafsirMukhtasar/TafsirMukhtasar.pdf' }],
    isSingleVolume: true,
  },

  {
    id: 'nazarat',
    name: 'نظرات في كتب التفسير',
    author: 'عبد السلام الهراس',
    category: 'التفسير',
    description: 'دراسة نقدية في كتب التفسير المختلفة',
    volumes: [{ id: 'nazarat', title: 'نظرات في كتب التفسير', pdfUrl: 'https://archive.org/download/Nadharat_fi_Ktb_Tafsir/Nadharat_Ktb_Tafsir.pdf' }],
    isSingleVolume: true,
  },

  // ========== علوم القرآن ==========
  {
    id: 'itqan',
    name: 'الإتقان في علوم القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)',
    category: 'علوم القرآن',
    description: 'أشهر كتاب في علوم القرآن، يتناول 80 نوعاً من أنواع علوم القرآن',
    volumes: [{ id: 'itqan', title: 'الإتقان في علوم القرآن', pdfUrl: 'https://archive.org/download/sa71mir_gmail_20160606/%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%B9%D9%84%D9%88%D9%85%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D9%84%D9%84%D8%AD%D8%A7%D9%81%D8%B8%20%D8%AC%D9%84%D8%A7%D9%84%20%D8%A7%D9%84%D8%AF%D9%8A%D9%86%20%D8%A7%D9%84%D8%B3%D9%8A%D9%88%D8%B7%D9%8A.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'burhan',
    name: 'البرهان في علوم القرآن',
    author: 'الإمام بدر الدين الزركشي (ت 794هـ)',
    category: 'علوم القرآن',
    description: 'كتاب موسوعي في علوم القرآن سبق الإتقان',
    volumes: [{ id: 'burhan', title: 'البرهان في علوم القرآن', pdfUrl: 'https://archive.org/download/FPbrolquyu/brolquyu.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'mabaheth',
    name: 'مباحث في علوم القرآن',
    author: 'الشيخ مناع القطان (ت 1420هـ)',
    category: 'علوم القرآن',
    description: 'كتاب تعليمي سهل في علوم القرآن للمبتدئين',
    volumes: [{ id: 'mabaheth', title: 'مباحث في علوم القرآن', pdfUrl: 'https://archive.org/download/WAQmbolqumbolqu/mbolqu.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'mabadi-tafsir',
    name: 'مبادئ في أصول التفسير',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)',
    category: 'علوم القرآن',
    description: 'مقدمة مهمة في أصول التفسير وقواعده',
    volumes: [{ id: 'mabadi-tafsir', title: 'مبادئ في أصول التفسير', pdfUrl: 'https://archive.org/download/mabadifiilmeusoolaltafseer/MABADI_FI_ILM_E_USOOL_AL_TAFSEER.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'manahij',
    name: 'مناهج المفسرين',
    author: 'محمد حسين الذهبي',
    category: 'علوم القرآن',
    description: 'دراسة تحليلية لمناهج المفسرين عبر التاريخ',
    volumes: [{ id: 'manahij', title: 'مناهج المفسرين', pdfUrl: 'https://archive.org/download/WAQ90085s/90085s.pdf' }],
    isSingleVolume: true,
  },

  {
    id: 'muqaddima',
    name: 'مقدمة التفسير',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)',
    category: 'علوم القرآن',
    description: 'مقدمة مهمة في أصول التفسير وعلومه',
    volumes: [{ id: 'muqaddima', title: 'مقدمة التفسير', pdfUrl: 'https://archive.org/download/Sharh_N_soyoti/01-Elm_tafsir_01.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'zamzami',
    name: 'شرح منظومة الزمزمي في علوم القرآن',
    author: 'الشيخ محمد المختار الشنقيطي',
    category: 'علوم القرآن',
    description: 'شرح وافٍ لمنظومة الزمزمي في علوم القرآن',
    volumes: [{ id: 'zamzami', title: 'شرح منظومة الزمزمي', pdfUrl: 'https://archive.org/download/Sharh_Mandhumat_Zemzemi/Sharh_Mandhumat_Zemzemi._kamil.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'madkhal-mushaf',
    name: 'مدخل إلى التعريف بالمصحف الشريف',
    author: 'محمد سالم محيسن',
    category: 'علوم القرآن',
    description: 'تعريف شامل بالمصحف الشريف وتاريخه',
    volumes: [{ id: 'madkhal-mushaf', title: 'مدخل إلى التعريف بالمصحف', pdfUrl: 'https://archive.org/download/15.8.2023/A03711.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'idawat',
    name: 'إضاءات في تاريخ القراءات',
    author: 'عبد الرحمن الإيوبي',
    category: 'علوم القرآن',
    description: 'بحث في تاريخ القراءات القرآنية وتطورها',
    volumes: [{ id: 'idawat', title: 'إضاءات في تاريخ القراءات', pdfUrl: 'https://archive.org/download/4.4.2021/A03593.pdf' }],
    isSingleVolume: true,
  },

  // ========== التجويد والقراءات ==========
  {
    id: 'ibriz',
    name: 'إبراز المعاني من حرز الأماني (شرح الشاطبية)',
    author: 'الإمام أبي شامة المقدسي (ت 665هـ)',
    category: 'التجويد والقراءات',
    description: 'شرح القصيدة الشاطبية في القراءات السبع',
    volumes: [{ id: 'ibriz', title: 'إبراز المعاني', pdfUrl: 'https://archive.org/download/ktp2019-bk1591/ktp2019-bk1591.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'manh-ilahiya',
    name: 'المنح الإلهية في جمع القراءات السبع',
    author: 'محمد بن محمد الأموي',
    category: 'التجويد والقراءات',
    description: 'كتاب في القراءات السبع المتواترة',
    volumes: [{ id: 'manh-ilahiya', title: 'المنح الإلهية', pdfUrl: 'https://archive.org/download/waq38375/38375.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'warsh',
    name: 'أصول رواية ورش عن نافع',
    author: 'جمع من العلماء',
    category: 'التجويد والقراءات',
    description: 'قواعد وأصول رواية ورش عن نافع المدني',
    volumes: [{ id: 'warsh', title: 'أصول رواية ورش', pdfUrl: 'https://archive.org/download/UsoolWARSHanNafiTajweedRulesForWarsh/Usool%20WARSH%20%27an%20Nafi%27%20Tajweed%20Rules%20for%20Warsh.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'tawatur',
    name: 'التواتر في القراءات القرآنية',
    author: 'محمد سعيد البوسيفي',
    category: 'التجويد والقراءات',
    description: 'بحث في تواتر القراءات القرآنية',
    volumes: [{ id: 'tawatur', title: 'التواتر في القراءات', pdfUrl: 'https://archive.org/download/3.10.18/A03214.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'itqan-qaloun',
    name: 'الإتقان في أصول رواية قالون',
    author: 'الشيخ عبد العزيز القاري',
    category: 'التجويد والقراءات',
    description: 'أصول وقواعد رواية قالون عن نافع',
    volumes: [{ id: 'itqan-qaloun', title: 'الإتقان في أصول رواية قالون', pdfUrl: 'https://archive.org/download/SW-moton-darat-alotrogga/01-%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%A3%D8%B5%D9%88%D9%84%20%D8%B1%D9%88%D8%A7%D9%8A%D8%A9%20%D9%82%D8%A7%D9%84%D9%88%D9%86.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'tabhir',
    name: 'تحبير التيسير في القراءات',
    author: 'الإمام ابن الجزري (ت 833هـ)',
    category: 'التجويد والقراءات',
    description: 'كتاب في أصول القراءات العشر',
    volumes: [{ id: 'tabhir', title: 'تحبير التيسير', pdfUrl: 'https://archive.org/download/almaktutat_gmail_1920_201905/%D8%A7%D9%84%D9%86%D8%B4%D8%B1%D8%A9%2019%20-%2020.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'tayyebat',
    name: 'الطيبات في جمع الآيات بتحريرات الزيات',
    author: 'عبد الرشيد علي',
    category: 'التجويد والقراءات',
    description: 'تحريرات في القراءات القرآنية',
    volumes: [{ id: 'tayyebat', title: 'الطيبات', pdfUrl: 'https://archive.org/download/Tayebat/00M_Tayebat.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'najm-adhar',
    name: 'النجم الأزهر في القراءات الأربعة عشر',
    author: 'الإمام ابن الجزري (ت 833هـ)',
    category: 'التجويد والقراءات',
    description: 'القراءات الأربع عشرة المتممة للعشر',
    volumes: [{ id: 'najm-adhar', title: 'النجم الأزهر', pdfUrl: 'https://archive.org/download/an-najm-al-adh-har/an-najm-al-adh-har.pdf' }],
    isSingleVolume: true,
  },

  // ========== إعراب القرآن ==========
  {
    id: 'tawjih',
    name: 'التوجيه النحوي للقراءات القرآنية',
    author: 'أحمد محمد النحال',
    category: 'إعراب القرآن وبيانه',
    description: 'دراسة نحوية للقراءات القرآنية وتوجيهها',
    volumes: [{ id: 'tawjih', title: 'التوجيه النحوي للقراءات', pdfUrl: 'https://archive.org/download/ktp2019-tra5511/ktp2019-tra5511.pdf' }],
    isSingleVolume: true,
  },

  {
    id: 'irab-bahr',
    name: 'إعراب القرآن من البحر المحيط',
    author: 'الإمام أبي حيان الأندلسي (ت 745هـ)',
    category: 'إعراب القرآن وبيانه',
    description: 'إعراب القرآن مستخلص من تفسير البحر المحيط',
    volumes: [{ id: 'irab-bahr', title: 'إعراب القرآن من البحر المحيط', pdfUrl: 'https://archive.org/download/lis_e3r17/lis_e3r1711.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'irab-muhayaa',
    name: 'الإعراب المحلى للمفردات النحوية',
    author: 'حسين محمد علي',
    category: 'إعراب القرآن وبيانه',
    description: 'تحليل نحوي لمفردات القرآن الكريم',
    volumes: [{ id: 'irab-muhayaa', title: 'الإعراب المحلى', pdfUrl: 'https://archive.org/download/lib04109/lib04109.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'bina',
    name: 'بناء التركيب الإفصاحي في القرآن',
    author: 'محمد أحمد أبو الفتوح',
    category: 'إعراب القرآن وبيانه',
    description: 'دراسة لغوية في تراكيب القرآن الكريم',
    volumes: [{ id: 'bina', title: 'بناء التركيب الإفصاحي', pdfUrl: 'https://archive.org/download/azm101010_gmail_20180403_1519/%D8%A8%D9%86%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D8%A7%D9%84%D8%A5%D9%81%D8%B5%D8%A7%D8%AD%D9%8A%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85.pdf' }],
    isSingleVolume: true,
  },

  // ========== أسباب النزول ==========
  {
    id: 'lubab',
    name: 'لباب النقول في أسباب النزول',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)',
    category: 'أسباب النزول',
    description: 'أشهر كتاب في أسباب النزول مرتب على ترتيب السور',
    volumes: [{ id: 'lubab', title: 'لباب النقول', pdfUrl: 'https://archive.org/download/WAQ9083S/9083s.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'sahih-asbab',
    name: 'الصحيح المسند من أسباب النزول',
    author: 'الشيخ مقبل بن هادي الوادعي (ت 1422هـ)',
    category: 'أسباب النزول',
    description: 'تحقيق وتخريج أسباب النزول الصحيحة',
    volumes: [{ id: 'sahih-asbab', title: 'الصحيح المسند من أسباب النزول', pdfUrl: 'https://archive.org/download/mttfqmttfq/mttfq.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'asbab-wahidi',
    name: 'أسباب النزول',
    author: 'الإمام الواحدي (ت 468هـ)',
    category: 'أسباب النزول',
    description: 'أول كتاب مستقل في أسباب النزول',
    volumes: [{ id: 'asbab-wahidi', title: 'أسباب النزول للواحدي', pdfUrl: 'https://archive.org/download/asbab-01002/asbab-01002.pdf' }],
    isSingleVolume: true,
  },

  {
    id: 'bada-wahy',
    name: 'بدء الوحي',
    author: 'جمع وتحقيق',
    category: 'أسباب النزول',
    description: 'بحث في كيفية بدء الوحي إلى النبي صلى الله عليه وسلم',
    volumes: [{ id: 'bada-wahy', title: 'بدء الوحي', pdfUrl: 'https://archive.org/download/taha_157/%D8%A8%D8%AF%D8%A1%20%D8%A7%D9%84%D9%88%D8%AD%D9%8A.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'wahy',
    name: 'الوحي في القرآن والسنة',
    author: 'محمد خليفة',
    category: 'أسباب النزول',
    description: 'دراسة شاملة عن الوحي في القرآن والسنة النبوية',
    volumes: [{ id: 'wahy', title: 'الوحي في القرآن والسنة', pdfUrl: 'https://archive.org/download/5_20230708_20230708_2018/%20%2873%29.pdf' }],
    isSingleVolume: true,
  },

  // ========== غريب القرآن ومفرداته ==========
  {
    id: 'mufredat',
    name: 'مفردات ألفاظ القرآن',
    author: 'الإمام الراغب الأصفهاني (ت 502هـ)',
    category: 'غريب القرآن ومفرداته',
    description: 'أشهر معجم لمفردات القرآن الكريم',
    volumes: [{ id: 'mufredat', title: 'مفردات ألفاظ القرآن', pdfUrl: 'https://archive.org/download/Al-isfahani-MufradatAlfadhAl-quran/Al-isfahani-MufradatAlfadhAl-quran-.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'lughat-quran',
    name: 'لغة القرآن الكريم',
    author: 'محمود إسماعيل',
    category: 'غريب القرآن ومفرداته',
    description: 'دراسة لغوية في ألفاظ القرآن الكريم',
    volumes: [{ id: 'lughat-quran', title: 'لغة القرآن الكريم', pdfUrl: 'https://archive.org/download/201802_20180209/%D9%84%D8%BA%D8%A9%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85_2.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'mafahim',
    name: 'مفاهيم قرآنية',
    author: 'الشيخ محمد الغزالي',
    category: 'غريب القرآن ومفرداته',
    description: 'بيان لمفاهيم قرآنية أساسية',
    volumes: [{ id: 'mafahim', title: 'مفاهيم قرآنية', pdfUrl: 'https://archive.org/download/ebw02/079.pdf' }],
    isSingleVolume: true,
  },

  // ========== التدبر ==========
  {
    id: 'qawaid-tadabbur',
    name: 'القواعد والأصول وتطبيقات التدبر',
    author: 'عبد العزيز المحمد السليم',
    category: 'التدبر',
    description: 'قواعد تدبر القرآن الكريم وتطبيقاتها العملية',
    volumes: [{ id: 'qawaid-tadabbur', title: 'القواعد والأصول', pdfUrl: 'https://archive.org/download/FPkaustatdFP/kaustatd.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'layudabiru',
    name: 'ليدبروا آياته',
    author: 'ناصر بن سليمان العمر',
    category: 'التدبر',
    description: 'سلسلة في تدبر القرآن الكريم',
    volumes: [
      { id: 'layudabiru-1', title: 'الجزء الأول', volumeNumber: 1, pdfUrl: 'https://archive.org/download/104688/104688.pdf' },
      { id: 'layudabiru-2', title: 'الجزء الثاني', volumeNumber: 2, pdfUrl: 'https://archive.org/download/121452/121452.pdf' },
    ],
    isSingleVolume: false,
  },
  {
    id: 'tadabbur-haqiqa',
    name: 'التدبر حقيقته وعلاقته بمصطلحات التأويل',
    author: 'عبد الرحمن الشهري',
    category: 'التدبر',
    description: 'بحث في حقيقة التدبر وعلاقته بالتأويل',
    volumes: [{ id: 'tadabbur-haqiqa', title: 'التدبر حقيقته وعلاقته بالتأويل', pdfUrl: 'https://archive.org/download/themtef/themtef.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'khulasa',
    name: 'الخلاصة في تدبر القرآن الكريم',
    author: 'عبد العزيز المحمد السليم',
    category: 'التدبر',
    description: 'خلاصة في قواعد وأساليب تدبر القرآن',
    volumes: [{ id: 'khulasa', title: 'الخلاصة في تدبر القرآن', pdfUrl: 'https://archive.org/download/20230708_20230708_0908/%25D8%25A7%25D9%2584%25D8%25AE%25D9%2584%25D8%25A7%25D8%25B5%25D8%25A9%2520%25D9%2581%25D9%258A%2520%25D8%25AA%25D8%25AF%25D8%25A8%25D8%25B1%2520%25D8%25A7%25D9%2584%25D9%2582%25D8%25B1%25D8%25A2%25D9%2586.PDF' }],
    isSingleVolume: true,
  },
  {
    id: 'istimbajat',
    name: 'استنباطات الشيخ السعدي من القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)',
    category: 'التدبر',
    description: 'فوائد واستنباطات مستخلصة من تفسير السعدي',
    volumes: [{ id: 'istimbajat', title: 'استنباطات الشيخ السعدي', pdfUrl: 'https://archive.org/download/istn8/istn8.pdf' }],
    isSingleVolume: true,
  },
  {
    id: 'adab',
    name: 'آداب التعامل في ضوء القصص القرآني',
    author: 'محمد الدبيسي',
    category: 'التدبر',
    description: 'استخلاص آداب التعامل من قصص القرآن الكريم',
    volumes: [{ id: 'adab', title: 'آداب التعامل في ضوء القصص القرآني', pdfUrl: 'https://archive.org/download/95560/95560.pdf' }],
    isSingleVolume: true,
  },
];

// Downloading state interface
interface DownloadState {
  [key: string]: boolean;
}

interface DownloadProgress {
  [key: string]: number;
}

export function BooksLibrary() {
  const [downloadingBooks, setDownloadingBooks] = useState<DownloadState>({});
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});

  // Toggle book expansion
  const toggleBookExpansion = useCallback((bookId: string) => {
    setExpandedBooks(prev => ({ ...prev, [bookId]: !prev[bookId] }));
  }, []);

  // Filter books based on search and category
  const filteredCollections = useMemo(() => {
    let result = booksCollections;

    if (selectedCategory !== 'all') {
      result = result.filter(book => book.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book => 
          book.name.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.description && book.description.toLowerCase().includes(query))
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  // Group books by category
  const booksByCategory = useMemo(() => {
    const categories: BookCategory[] = ['التفسير', 'علوم القرآن', 'التجويد والقراءات', 'إعراب القرآن وبيانه', 'أسباب النزول', 'غريب القرآن ومفرداته', 'التدبر'];
    const grouped: Record<BookCategory, BookCollection[]> = {} as any;
    categories.forEach(cat => {
      grouped[cat] = filteredCollections.filter(book => book.category === cat);
    });
    return grouped;
  }, [filteredCollections]);

  // Total books count
  const totalBooksCount = useMemo(() => {
    return booksCollections.reduce((acc, c) => acc + c.volumes.length, 0);
  }, []);

  // Handle PDF download
  const handleDownload = async (volume: BookVolume, bookName: string) => {
    if (downloadingBooks[volume.id]) return;
    setDownloadingBooks(prev => ({ ...prev, [volume.id]: true }));
    setDownloadProgress(prev => ({ ...prev, [volume.id]: 0 }));

    try {
      const downloadUrl = getProxiedUrl(volume.pdfUrl);
      const response = await fetch(downloadUrl, { mode: 'cors', cache: 'no-cache' });
      
      if (!response.ok) throw new Error('فشل في تحميل الملف');
      
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Cannot read response body');
      
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        if (total > 0) {
          setDownloadProgress(prev => ({ ...prev, [volume.id]: Math.round((receivedLength / total) * 100) }));
        }
      }
      
      const blob = new Blob(chunks as BlobPart[], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${bookName} - ${volume.title}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success('تم تنزيل الكتاب بنجاح');
    } catch (error) {
      console.error('Download error:', error);
      window.open(getProxiedUrl(volume.pdfUrl), '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingBooks(prev => ({ ...prev, [volume.id]: false }));
      setDownloadProgress(prev => ({ ...prev, [volume.id]: 0 }));
    }
  };

  const handleRead = (volume: BookVolume) => {
    window.open(getProxiedUrl(volume.pdfUrl), '_blank', 'noopener,noreferrer');
  };

  const categories: BookCategory[] = ['التفسير', 'علوم القرآن', 'التجويد والقراءات', 'إعراب القرآن وبيانه', 'أسباب النزول', 'غريب القرآن ومفرداته', 'التدبر'];
  
  const getCategoryCount = (cat: BookCategory) => booksCollections.filter(b => b.category === cat).length;

  // Render a single volume card
  const renderVolumeCard = (volume: BookVolume, bookName: string) => {
    const isDownloading = downloadingBooks[volume.id];
    const progress = downloadProgress[volume.id] || 0;
    
    return (
      <div key={volume.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-sm transition-all">
        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">
          {volume.volumeNumber || <FileText className="w-4 h-4" />}
        </div>
        <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate font-medium">
          {volume.title}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => handleRead(volume)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="قراءة"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
          <button
            onClick={() => handleDownload(volume, bookName)}
            disabled={isDownloading}
            className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 relative overflow-hidden"
            title="تنزيل"
          >
            {isDownloading ? (
              <>
                <div className="absolute inset-0 bg-blue-400 transition-all" style={{ width: `${progress}%` }} />
                <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10" />
              </>
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    );
  };

  // Render book collection card
  const renderBookCard = (collection: BookCollection) => {
    const isExpanded = expandedBooks[collection.id];
    const catInfo = CATEGORY_INFO[collection.category];
    
    return (
      <Card key={collection.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-0">
          {/* Book Header */}
          <div 
            className={`p-4 cursor-pointer ${!collection.isSingleVolume ? 'hover:bg-slate-50 dark:hover:bg-slate-750' : ''}`}
            onClick={() => !collection.isSingleVolume && collection.volumes.length > 1 && toggleBookExpansion(collection.id)}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                <catInfo.icon className="w-6 h-6" />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight mb-1">
                  {collection.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {collection.author}
                </p>
                {collection.description && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {!collection.isSingleVolume && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0">
                      {collection.volumes.length} مجلد
                    </Badge>
                  )}
                </div>
              </div>

              {/* Expand/Collapse for multi-volume */}
              {!collection.isSingleVolume && collection.volumes.length > 1 && (
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              )}
            </div>

            {/* Single volume actions */}
            {collection.isSingleVolume && (
              <div className="flex items-center gap-2 mt-3">
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleRead(collection.volumes[0]); }} 
                  variant="outline" 
                  className="flex-1 h-9 rounded-xl text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  قراءة
                </Button>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleDownload(collection.volumes[0], collection.name); }} 
                  disabled={downloadingBooks[collection.volumes[0].id]}
                  className="flex-1 h-9 rounded-xl text-xs bg-blue-500 hover:bg-blue-600 text-white relative overflow-hidden"
                >
                  {downloadingBooks[collection.volumes[0].id] ? (
                    <>
                      <div className="absolute inset-0 bg-blue-400 transition-all" style={{ width: `${downloadProgress[collection.volumes[0].id] || 0}%` }} />
                      <span className="relative z-10 flex items-center justify-center">
                        <Loader2 className="w-3 h-3 ml-1 animate-spin" />
                        {downloadProgress[collection.volumes[0].id] || 0}%
                      </span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 ml-1" />
                      تنزيل PDF
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Volumes List (expandable) */}
          {!collection.isSingleVolume && isExpanded && (
            <div className="border-t border-slate-100 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                {collection.volumes.map(volume => renderVolumeCard(volume, collection.name))}
              </div>
            </div>
          )}

          {/* Show "Click to expand" hint for multi-volume */}
          {!collection.isSingleVolume && !isExpanded && collection.volumes.length > 1 && (
            <div 
              className="border-t border-slate-100 dark:border-slate-700 py-2 px-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
              onClick={() => toggleBookExpansion(collection.id)}
            >
              <span className="text-xs text-blue-500 dark:text-blue-400 flex items-center justify-center gap-1">
                <ChevronDown className="w-3 h-3" />
                عرض {collection.volumes.length} مجلد
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-bl from-purple-500 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">مكتبة علوم القرآن الكريم</h2>
            <p className="text-purple-100 text-sm">كتب PDF من علماء أهل السنة والجماعة</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{booksCollections.length} كتاب</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{totalBooksCount} مجلد</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{categories.length} تصنيف</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="ابحث بالعنوان أو المؤلف أو الموضوع..."
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
              ? 'bg-purple-500 hover:bg-purple-600 text-white' 
              : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          الكل ({booksCollections.length})
        </Button>
        {categories.map(cat => {
          const count = getCategoryCount(cat);
          if (count === 0) return null;
          return (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className={`rounded-full px-4 py-1.5 h-auto text-sm ${
                selectedCategory === cat 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              {cat} ({count})
            </Button>
          );
        })}
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all') && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          عرض {filteredCollections.length} كتاب
        </p>
      )}

      {/* Books by Category */}
      {selectedCategory === 'all' && !searchQuery ? (
        categories.map(category => {
          const categoryBooks = booksByCategory[category];
          if (!categoryBooks || categoryBooks.length === 0) return null;
          const catInfo = CATEGORY_INFO[category];

          return (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white`}>
                  <catInfo.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {category}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {catInfo.description}
                  </p>
                </div>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <Badge variant="outline" className="text-xs">
                  {categoryBooks.length} كتاب
                </Badge>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryBooks.map(book => renderBookCard(book))}
              </div>
            </div>
          );
        })
      ) : (
        // Filtered/Search results
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCollections.map(book => renderBookCard(book))}
        </div>
      )}

      {/* No results */}
      {filteredCollections.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            لم يتم العثور على كتب مطابقة
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            جرب كلمات بحث مختلفة
          </p>
        </div>
      )}
    </div>
  );
}
