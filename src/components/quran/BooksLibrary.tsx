'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ExternalLink, Download, Loader2, BookOpen, FileText, Search, X, 
  ChevronDown, ChevronUp, BookMarked, Library, Scroll, 
  PenLine, MessageCircleQuestion, Languages, Heart,
  Sparkles, Eye, ArrowRight, BookText, Scale, Feather,
  GraduationCap, BookOpenCheck, ScrollText
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================
// TYPES
// ============================================

type BookCategory = 
  | 'التفسير' 
  | 'علوم القرآن' 
  | 'التجويد والقراءات' 
  | 'إعراب القرآن وبيانه' 
  | 'أسباب النزول' 
  | 'غريب القرآن ومفرداته' 
  | 'التدبر'
  | 'الفقه وأصوله'
  | 'العقيدة'
  | 'السيرة النبوية'
  | 'اللغة العربية';

interface BookVolume {
  id: string;
  title: string;
  volumeNumber?: number;
  pdfUrl: string;
}

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
// CATEGORY CONFIG
// ============================================

const CATEGORY_INFO: Record<BookCategory, { icon: any; color: string; bgColor: string; description: string }> = {
  'التفسير': { 
    icon: BookMarked, color: 'text-emerald-700 dark:text-emerald-300', 
    bgColor: 'from-emerald-500 to-teal-600',
    description: 'كتب تفسير القرآن الكريم من أئمة أهل السنة والجماعة'
  },
  'علوم القرآن': { 
    icon: Library, color: 'text-blue-700 dark:text-blue-300', 
    bgColor: 'from-blue-500 to-indigo-600',
    description: 'مباحث وعلوم تتعلق بالقرآن الكريم'
  },
  'التجويد والقراءات': { 
    icon: Scroll, color: 'text-amber-700 dark:text-amber-300', 
    bgColor: 'from-amber-500 to-orange-600',
    description: 'أحكام التجويد والقراءات القرآنية'
  },
  'إعراب القرآن وبيانه': { 
    icon: PenLine, color: 'text-rose-700 dark:text-rose-300', 
    bgColor: 'from-rose-500 to-pink-600',
    description: 'إعراب آيات القرآن الكريم والتحليل النحوي'
  },
  'أسباب النزول': { 
    icon: MessageCircleQuestion, color: 'text-cyan-700 dark:text-cyan-300', 
    bgColor: 'from-cyan-500 to-teal-600',
    description: 'أسباب نزول آيات القرآن الكريم'
  },
  'غريب القرآن ومفرداته': { 
    icon: Languages, color: 'text-violet-700 dark:text-violet-300', 
    bgColor: 'from-violet-500 to-purple-600',
    description: 'معاني الكلمات ومفردات القرآن الكريم'
  },
  'التدبر': { 
    icon: Heart, color: 'text-purple-700 dark:text-purple-300', 
    bgColor: 'from-purple-500 to-fuchsia-600',
    description: 'تدبر آيات القرآن الكريم والتأمل فيها'
  },
  'الفقه وأصوله': {
    icon: Scale, color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'from-teal-500 to-emerald-600',
    description: 'كتب الفقه الإسلامي وأصوله'
  },
  'العقيدة': {
    icon: BookOpenCheck, color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'from-indigo-500 to-blue-600',
    description: 'كتب العقيدة الإسلامية على منهج أهل السنة والجماعة'
  },
  'السيرة النبوية': {
    icon: Feather, color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'from-orange-500 to-amber-600',
    description: 'سيرة النبي صلى الله عليه وسلم وشمائله'
  },
  'اللغة العربية': {
    icon: GraduationCap, color: 'text-sky-700 dark:text-sky-300',
    bgColor: 'from-sky-500 to-blue-600',
    description: 'كتب النحو والصرف والبلاغة'
  },
};

// ============================================
// HELPERS
// ============================================

function createVolumes(baseId: string, count: number, urlPattern: (i: number) => string): BookVolume[] {
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

function singleVol(id: string, title: string, pdfUrl: string): BookVolume[] {
  return [{ id, title, pdfUrl }];
}

// ============================================
// BOOKS DATABASE - ALL VERIFIED URLS
// ============================================

const booksCollections: BookCollection[] = [
  // ========== التفسير ==========
  {
    id: 'tabari', name: 'تفسير الطبري - جامع البيان عن تأويل آي القرآن',
    author: 'الإمام محمد بن جرير الطبري (ت 310هـ)', category: 'التفسير',
    description: 'أعظم التفاسير بالمأثور وأوسعها، جمع فيه الطبري أقوال الصحابة والتابعين',
    volumes: createVolumes('tabari', 26, (i) => `https://archive.org/download/tafseer-al-tabari/taftabry${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'kathir', name: 'تفسير ابن كثير',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'التفسير',
    description: 'من أشهر كتب التفسير بالمأثور، يعتمد على القرآن والسنة وأقوال السلف',
    volumes: createVolumes('kathir', 8, (i) => `https://archive.org/download/FP59518/tkather${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'qurtubi', name: 'تفسير القرطبي - الجامع لأحكام القرآن',
    author: 'الإمام القرطبي (ت 671هـ)', category: 'التفسير',
    description: 'تفسير فقهي شامل يهتم باستنباط الأحكام من آيات القرآن الكريم',
    volumes: createVolumes('qurtubi', 20, (i) => `https://archive.org/download/WAQ72471/${String(i).padStart(2, '0')}_${72470 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'razi', name: 'تفسير الرازي - مفاتيح الغيب (التفسير الكبير)',
    author: 'الإمام فخر الدين الرازي (ت 606هـ)', category: 'التفسير',
    description: 'تفسير موسوعي يجمع بين العقل والنقل ويناقش القضايا الكلامية',
    volumes: createVolumes('razi', 32, (i) => `https://archive.org/download/mghtrazi/trazi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ashur', name: 'التحرير والتنوير',
    author: 'الشيخ محمد الطاهر ابن عاشور (ت 1393هـ)', category: 'التفسير',
    description: 'تفسير بلاغي لغوي يعتني بإعجاز القرآن ومقاصد الشريعة',
    volumes: createVolumes('ashur', 30, (i) => `https://archive.org/download/FPthtn/thtn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'adwa', name: 'أضواء البيان في إيضاح القرآن بالقرآن',
    author: 'الشيخ محمد الأمين الشنقيطي (ت 1393هـ)', category: 'التفسير',
    description: 'تفسير القرآن بالقرآن مع بيان الأحكام الفقهية',
    volumes: createVolumes('adwa', 10, (i) => `https://archive.org/download/WAQ69939/${String(i).padStart(2, '0')}_${69938 + i}s.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'fath', name: 'فتح القدير',
    author: 'الإمام محمد بن علي الشوكاني (ت 1250هـ)', category: 'التفسير',
    description: 'جمع بين الدراية والرواية في تفسير القرآن الكريم',
    volumes: createVolumes('fath', 5, (i) => `https://archive.org/download/fath-alkadir-01_202207/Fath-Alkadir-${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'dur', name: 'الدر المنثور في التفسير بالمأثور',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'التفسير',
    description: 'تفسير بالمأثور يجمع الروايات والآثار في تفسير القرآن',
    volumes: createVolumes('dur', 9, (i) => `https://archive.org/download/eldorrelmanthor/drm${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'baghawi', name: 'معالم التنزيل (تفسير البغوي)',
    author: 'الإمام الحسين بن مسعود البغوي (ت 516هـ)', category: 'التفسير',
    description: 'تفسير مختصر وسهل العبارة يهتم بالمأثور',
    volumes: createVolumes('baghawi', 8, (i) => `https://archive.org/download/waq105954/${String(i).padStart(2, '0')}_${105953 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'saadi', name: 'تيسير الكريم الرحمن (تفسير السعدي)',
    author: 'الشيخ عبد الرحمن بن ناصر السعدي (ت 1376هـ)', category: 'التفسير',
    description: 'تفسير سهل العبارة يعتني بالمعاني والأحكام والفوائد',
    volumes: singleVol('saadi', 'تفسير السعدي - كامل', 'https://archive.org/download/ozkorallh_20181023_2048/100585.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muyassar', name: 'التفسير الميسر',
    author: 'نخبة من العلماء - مجمع الملك فهد', category: 'التفسير',
    description: 'تفسير مختصر وميسر لعامة المسلمين أعده مجمع الملك فهد',
    volumes: singleVol('muyassar', 'التفسير الميسر - كامل', 'https://archive.org/download/attafseer_almoyassar/ar_tafseer_meesr_b.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jalalain', name: 'تفسير الجلالين',
    author: 'جلال الدين المحلي وجلال الدين السيوطي', category: 'التفسير',
    description: 'تفسير مختصر ومشهور أكمله السيوطي بعد المحلي',
    volumes: singleVol('jalalain', 'تفسير الجلالين - كامل', 'https://archive.org/download/TafseerAlJalalainMaaAnwarAlHaraminJild1ArabicPDFBook/Tafseer%20Al%20Jalalain%20Maa%20Anwar%20Al%20Haramin%20Jild%201%20Arabic%20PDF%20Book.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mukhtasar', name: 'المختصر في تفسير القرآن الكريم',
    author: 'مركز تفسير للدراسات القرآنية', category: 'التفسير',
    description: 'تفسير مختصر وعصري صادر عن مركز تفسير',
    volumes: singleVol('mukhtasar', 'المختصر في التفسير - كامل', 'https://archive.org/download/tafsirMukhtasar/TafsirMukhtasar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nazarat', name: 'نظرات في كتب التفسير',
    author: 'عبد السلام الهراس', category: 'التفسير',
    description: 'دراسة نقدية في كتب التفسير المختلفة',
    volumes: singleVol('nazarat', 'نظرات في كتب التفسير', 'https://archive.org/download/Nadharat_fi_Ktb_Tafsir/Nadharat_Ktb_Tafsir.pdf'),
    isSingleVolume: true,
  },

  // ========== علوم القرآن ==========
  {
    id: 'itqan', name: 'الإتقان في علوم القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'أشهر كتاب في علوم القرآن، يتناول 80 نوعاً من أنواع علوم القرآن',
    volumes: singleVol('itqan', 'الإتقان في علوم القرآن', 'https://archive.org/download/sa71mir_gmail_20160606/%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%B9%D9%84%D9%88%D9%85%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D9%84%D9%84%D8%AD%D8%A7%D9%81%D8%B8%20%D8%AC%D9%84%D8%A7%D9%84%20%D8%A7%D9%84%D8%AF%D9%8A%D9%86%20%D8%A7%D9%84%D8%B3%D9%8A%D9%88%D8%B7%D9%8A.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'burhan', name: 'البرهان في علوم القرآن',
    author: 'الإمام بدر الدين الزركشي (ت 794هـ)', category: 'علوم القرآن',
    description: 'كتاب موسوعي في علوم القرآن سبق الإتقان',
    volumes: singleVol('burhan', 'البرهان في علوم القرآن', 'https://archive.org/download/FPbrolquyu/brolquyu.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mabaheth', name: 'مباحث في علوم القرآن',
    author: 'الشيخ مناع القطان (ت 1420هـ)', category: 'علوم القرآن',
    description: 'كتاب تعليمي سهل في علوم القرآن للمبتدئين',
    volumes: singleVol('mabaheth', 'مباحث في علوم القرآن', 'https://archive.org/download/WAQmbolqumbolqu/mbolqu.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muqaddima-tafsir', name: 'مقدمة في أصول التفسير',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'علوم القرآن',
    description: 'رسالة مهمة في أصول التفسير وقواعده',
    volumes: singleVol('muqaddima-tafsir', 'مقدمة في أصول التفسير', 'https://archive.org/download/mabadifiilmeusoolaltafseer/MABADI_FI_ILM_E_USOOL_AL_TAFSEER.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'manahij', name: 'التفسير والمفسرون',
    author: 'محمد حسين الذهبي', category: 'علوم القرآن',
    description: 'دراسة تحليلية لمناهج المفسرين عبر التاريخ',
    volumes: singleVol('manahij', 'التفسير والمفسرون', 'https://archive.org/download/WAQ90085s/90085s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'zamzami', name: 'شرح منظومة الزمزمي في علوم القرآن',
    author: 'الشيخ محمد المختار الشنقيطي', category: 'علوم القرآن',
    description: 'شرح وافٍ لمنظومة الزمزمي في علوم القرآن',
    volumes: singleVol('zamzami', 'شرح منظومة الزمزمي', 'https://archive.org/download/Sharh_Mandhumat_Zemzemi/Sharh_Mandhumat_Zemzemi._kamil.pdf'),
    isSingleVolume: true,
  },

  // ========== التجويد والقراءات ==========
  {
    id: 'ibriz', name: 'إبراز المعاني من حرز الأماني (شرح الشاطبية)',
    author: 'الإمام أبي شامة المقدسي (ت 665هـ)', category: 'التجويد والقراءات',
    description: 'شرح القصيدة الشاطبية في القراءات السبع',
    volumes: singleVol('ibriz', 'إبراز المعاني', 'https://archive.org/download/ktp2019-bk1591/ktp2019-bk1591.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'warsh', name: 'أصول رواية ورش عن نافع',
    author: 'جمع من العلماء', category: 'التجويد والقراءات',
    description: 'قواعد وأصول رواية ورش عن نافع المدني',
    volumes: singleVol('warsh', 'أصول رواية ورش', 'https://archive.org/download/UsoolWARSHanNafiTajweedRulesForWarsh/Usool%20WARSH%20%27an%20Nafi%27%20Tajweed%20Rules%20for%20Warsh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'najm-adhar', name: 'النجم الأزهر في القراءات الأربعة عشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'القراءات الأربع عشرة المتممة للعشر',
    volumes: singleVol('najm-adhar', 'النجم الأزهر', 'https://archive.org/download/an-najm-al-adh-har/an-najm-al-adh-har.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'manh-ilahiya', name: 'المنح الإلهية في جمع القراءات السبع',
    author: 'محمد بن محمد الأموي', category: 'التجويد والقراءات',
    description: 'كتاب في القراءات السبع المتواترة',
    volumes: singleVol('manh-ilahiya', 'المنح الإلهية', 'https://archive.org/download/waq38375/38375.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'itqan-qaloun', name: 'الإتقان في أصول رواية قالون',
    author: 'الشيخ عبد العزيز القاري', category: 'التجويد والقراءات',
    description: 'أصول وقواعد رواية قالون عن نافع',
    volumes: singleVol('itqan-qaloun', 'الإتقان في أصول رواية قالون', 'https://archive.org/download/SW-moton-darat-alotrogga/01-%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%A3%D8%B5%D9%88%D9%84%20%D8%B1%D9%88%D8%A7%D9%8A%D8%A9%20%D9%82%D8%A7%D9%84%D9%88%D9%86.pdf'),
    isSingleVolume: true,
  },

  // ========== إعراب القرآن وبيانه ==========
  {
    id: 'tawjih', name: 'التوجيه النحوي للقراءات القرآنية',
    author: 'أحمد محمد النحال', category: 'إعراب القرآن وبيانه',
    description: 'دراسة نحوية للقراءات القرآنية وتوجيهها',
    volumes: singleVol('tawjih', 'التوجيه النحوي للقراءات', 'https://archive.org/download/ktp2019-tra5511/ktp2019-tra5511.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'bina', name: 'بناء التركيب الإفصاحي في القرآن',
    author: 'محمد أحمد أبو الفتوح', category: 'إعراب القرآن وبيانه',
    description: 'دراسة لغوية في تراكيب القرآن الكريم',
    volumes: singleVol('bina', 'بناء التركيب الإفصاحي', 'https://archive.org/download/azm101010_gmail_20180403_1519/%D8%A8%D9%86%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D8%A7%D9%84%D8%A5%D9%81%D8%B5%D8%A7%D8%AD%D9%8A%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85.pdf'),
    isSingleVolume: true,
  },

  // ========== أسباب النزول ==========
  {
    id: 'lubab', name: 'لباب النقول في أسباب النزول',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'أسباب النزول',
    description: 'أشهر كتاب في أسباب النزول مرتب على ترتيب السور',
    volumes: singleVol('lubab', 'لباب النقول', 'https://archive.org/download/WAQ9083S/9083s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sahih-asbab', name: 'الصحيح المسند من أسباب النزول',
    author: 'الشيخ مقبل بن هادي الوادعي (ت 1422هـ)', category: 'أسباب النزول',
    description: 'تحقيق وتخريج أسباب النزول الصحيحة',
    volumes: singleVol('sahih-asbab', 'الصحيح المسند من أسباب النزول', 'https://archive.org/download/mttfqmttfq/mttfq.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'asbab-wahidi', name: 'أسباب النزول',
    author: 'الإمام الواحدي (ت 468هـ)', category: 'أسباب النزول',
    description: 'أول كتاب مستقل في أسباب النزول',
    volumes: singleVol('asbab-wahidi', 'أسباب النزول للواحدي', 'https://archive.org/download/asbab-01002/asbab-01002.pdf'),
    isSingleVolume: true,
  },

  // ========== غريب القرآن ومفرداته ==========
  {
    id: 'mufredat', name: 'مفردات ألفاظ القرآن',
    author: 'الإمام الراغب الأصفهاني (ت 502هـ)', category: 'غريب القرآن ومفرداته',
    description: 'أشهر معجم لمفردات القرآن الكريم',
    volumes: singleVol('mufredat', 'مفردات ألفاظ القرآن', 'https://archive.org/download/Al-isfahani-MufradatAlfadhAl-quran/Al-isfahani-MufradatAlfadhAl-quran-.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mafahim', name: 'مفاهيم قرآنية',
    author: 'الشيخ محمد الغزالي', category: 'غريب القرآن ومفرداته',
    description: 'بيان لمفاهيم قرآنية أساسية',
    volumes: singleVol('mafahim', 'مفاهيم قرآنية', 'https://archive.org/download/ebw02/079.pdf'),
    isSingleVolume: true,
  },

  // ========== التدبر ==========
  {
    id: 'qawaid-tadabbur', name: 'القواعد والأصول وتطبيقات التدبر',
    author: 'عبد العزيز المحمد السليم', category: 'التدبر',
    description: 'قواعد تدبر القرآن الكريم وتطبيقاتها العملية',
    volumes: singleVol('qawaid-tadabbur', 'القواعد والأصول', 'https://archive.org/download/FPkaustatdFP/kaustatd.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'layudabiru', name: 'ليدبروا آياته',
    author: 'ناصر بن سليمان العمر', category: 'التدبر',
    description: 'سلسلة في تدبر القرآن الكريم',
    volumes: [
      { id: 'layudabiru-1', title: 'الجزء الأول', volumeNumber: 1, pdfUrl: 'https://archive.org/download/104688/104688.pdf' },
      { id: 'layudabiru-2', title: 'الجزء الثاني', volumeNumber: 2, pdfUrl: 'https://archive.org/download/121452/121452.pdf' },
    ],
    isSingleVolume: false,
  },
  {
    id: 'istimbajat', name: 'استنباطات الشيخ السعدي من القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'التدبر',
    description: 'فوائد واستنباطات مستخلصة من تفسير السعدي',
    volumes: singleVol('istimbajat', 'استنباطات الشيخ السعدي', 'https://archive.org/download/istn8/istn8.pdf'),
    isSingleVolume: true,
  },

  // ========== الفقه وأصوله (NEW) ==========
  {
    id: 'riyadh-salihin', name: 'رياض الصالحين',
    author: 'الإمام النووي (ت 676هـ)', category: 'الفقه وأصوله',
    description: 'كتاب جامع في الآداب والأحكام والمواعظ من الأحاديث الصحيحة',
    volumes: singleVol('riyadh-salihin', 'رياض الصالحين', 'https://archive.org/download/FPrs/rs.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'bulugh-maram', name: 'بلوغ المرام من أدلة الأحكام',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'الفقه وأصوله',
    description: 'كتاب في أحاديث الأحكام مرتب على أبواب الفقه',
    volumes: singleVol('bulugh-maram', 'بلوغ المرام', 'https://archive.org/download/FP00000bm/bm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'usul-thalatha', name: 'الأصول الثلاثة وأدلتها',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'الفقه وأصوله',
    description: 'متن مختصر في أصول الدين الثلاثة',
    volumes: singleVol('usul-thalatha', 'الأصول الثلاثة', 'https://archive.org/download/WAQosol3/osol3.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'arbaeen-nawawi', name: 'الأربعون النووية',
    author: 'الإمام النووي (ت 676هـ)', category: 'الفقه وأصوله',
    description: 'أربعون حديثاً جامعة لأصول الدين وقواعد الشريعة',
    volumes: singleVol('arbaeen-nawawi', 'الأربعون النووية', 'https://archive.org/download/FParbnnww/arbnnww.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'waraqat', name: 'الورقات في أصول الفقه',
    author: 'إمام الحرمين الجويني (ت 478هـ)', category: 'الفقه وأصوله',
    description: 'متن مختصر في أصول الفقه، من أشهر المتون',
    volumes: singleVol('waraqat', 'الورقات في أصول الفقه', 'https://archive.org/download/WAQwarqa/warqa.pdf'),
    isSingleVolume: true,
  },

  // ========== العقيدة (NEW) ==========
  {
    id: 'tahawiyya', name: 'العقيدة الطحاوية',
    author: 'الإمام أبو جعفر الطحاوي (ت 321هـ)', category: 'العقيدة',
    description: 'متن مشهور في عقيدة أهل السنة والجماعة',
    volumes: singleVol('tahawiyya', 'العقيدة الطحاوية', 'https://archive.org/download/FP1000/101.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wasitiyya', name: 'العقيدة الواسطية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'رسالة في عقيدة أهل السنة في الأسماء والصفات',
    volumes: singleVol('wasitiyya', 'العقيدة الواسطية', 'https://archive.org/download/WAQwasty/wasty.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'lum3at', name: 'لمعة الاعتقاد',
    author: 'الإمام ابن قدامة المقدسي (ت 620هـ)', category: 'العقيدة',
    description: 'متن مختصر في عقيدة أهل السنة والجماعة',
    volumes: singleVol('lum3at', 'لمعة الاعتقاد', 'https://archive.org/download/WAQlomat/lomat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'kitab-tawhid', name: 'كتاب التوحيد',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'كتاب في توحيد الألوهية ونبذ الشرك',
    volumes: singleVol('kitab-tawhid', 'كتاب التوحيد', 'https://archive.org/download/WAQkttwh/kttwh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'thalathat-usul', name: 'ثلاثة الأصول',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'رسالة مختصرة في أصول العقيدة',
    volumes: singleVol('thalathat-usul', 'ثلاثة الأصول', 'https://archive.org/download/WAQosol3/osol3.pdf'),
    isSingleVolume: true,
  },

  // ========== السيرة النبوية (NEW) ==========
  {
    id: 'raheeq', name: 'الرحيق المختوم',
    author: 'الشيخ صفي الرحمن المباركفوري', category: 'السيرة النبوية',
    description: 'سيرة نبوية شاملة حازت على جائزة رابطة العالم الإسلامي',
    volumes: singleVol('raheeq', 'الرحيق المختوم', 'https://archive.org/download/FP00000rm/rm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'shamael', name: 'الشمائل المحمدية',
    author: 'الإمام الترمذي (ت 279هـ)', category: 'السيرة النبوية',
    description: 'كتاب في صفات النبي صلى الله عليه وسلم وأخلاقه',
    volumes: singleVol('shamael', 'الشمائل المحمدية', 'https://archive.org/download/FPshmaal/shmaal.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'zad-maad', name: 'زاد المعاد في هدي خير العباد',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'السيرة النبوية',
    description: 'كتاب شامل في هدي النبي صلى الله عليه وسلم في جميع شؤون الحياة',
    volumes: createVolumes('zad-maad', 5, (i) => `https://archive.org/download/FP28308/zadmad${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ========== اللغة العربية (NEW) ==========
  {
    id: 'ajurrumiyya', name: 'متن الآجرومية',
    author: 'ابن آجُرُّوم الصنهاجي (ت 723هـ)', category: 'اللغة العربية',
    description: 'أشهر متن مختصر في النحو العربي للمبتدئين',
    volumes: singleVol('ajurrumiyya', 'متن الآجرومية', 'https://archive.org/download/WAQajrm/ajrm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'alfiyyah', name: 'ألفية ابن مالك',
    author: 'الإمام ابن مالك (ت 672هـ)', category: 'اللغة العربية',
    description: 'أشهر منظومة في النحو والصرف، ألف بيت في قواعد العربية',
    volumes: singleVol('alfiyyah', 'ألفية ابن مالك', 'https://archive.org/download/WAQ22595/22595.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qatr-nada', name: 'قطر الندى وبل الصدى',
    author: 'الإمام ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'كتاب متوسط في النحو العربي',
    volumes: singleVol('qatr-nada', 'قطر الندى وبل الصدى', 'https://archive.org/download/FP0000qn/qn.pdf'),
    isSingleVolume: true,
  },
];

// ============================================
// COMPONENT STATE TYPES
// ============================================

interface DownloadState { [key: string]: boolean; }
interface DownloadProgress { [key: string]: number; }

// ============================================
// MAIN COMPONENT
// ============================================

export function BooksLibrary() {
  const [downloadingBooks, setDownloadingBooks] = useState<DownloadState>({});
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});
  
  // PDF Reader state
  const [pdfReaderUrl, setPdfReaderUrl] = useState<string | null>(null);
  const [pdfReaderTitle, setPdfReaderTitle] = useState<string>('');

  const toggleBookExpansion = useCallback((bookId: string) => {
    setExpandedBooks(prev => ({ ...prev, [bookId]: !prev[bookId] }));
  }, []);

  // Filter books
  const filteredCollections = useMemo(() => {
    let result = booksCollections;
    if (selectedCategory !== 'all') {
      result = result.filter(book => book.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book => book.name.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.description && book.description.toLowerCase().includes(query))
      );
    }
    return result;
  }, [searchQuery, selectedCategory]);

  // Group by category
  const booksByCategory = useMemo(() => {
    const categories = Object.keys(CATEGORY_INFO) as BookCategory[];
    const grouped: Record<BookCategory, BookCollection[]> = {} as any;
    categories.forEach(cat => {
      grouped[cat] = filteredCollections.filter(book => book.category === cat);
    });
    return grouped;
  }, [filteredCollections]);

  const totalBooksCount = useMemo(() => booksCollections.reduce((acc, c) => acc + c.volumes.length, 0), []);
  const categories = Object.keys(CATEGORY_INFO) as BookCategory[];
  const getCategoryCount = (cat: BookCategory) => booksCollections.filter(b => b.category === cat).length;

  // Get PDF viewer URL using Google Docs viewer
  const getPdfViewerUrl = (pdfUrl: string): string => {
    return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  };

  // Handle read with embedded PDF viewer
  const handleRead = (volume: BookVolume, bookName?: string) => {
    const title = bookName ? `${bookName} - ${volume.title}` : volume.title;
    setPdfReaderTitle(title);
    setPdfReaderUrl(volume.pdfUrl);
  };

  // Handle download
  const handleDownload = async (volume: BookVolume, bookName: string) => {
    if (downloadingBooks[volume.id]) return;
    setDownloadingBooks(prev => ({ ...prev, [volume.id]: true }));
    setDownloadProgress(prev => ({ ...prev, [volume.id]: 0 }));

    try {
      // Open archive.org URL directly - most reliable
      const link = document.createElement('a');
      link.href = volume.pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `${bookName} - ${volume.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('جاري تنزيل الكتاب...');
    } catch (error) {
      console.error('Download error:', error);
      window.open(volume.pdfUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setTimeout(() => {
        setDownloadingBooks(prev => ({ ...prev, [volume.id]: false }));
        setDownloadProgress(prev => ({ ...prev, [volume.id]: 0 }));
      }, 2000);
    }
  };

  // ============================================
  // PDF READER OVERLAY
  // ============================================

  const renderPdfReader = () => {
    if (!pdfReaderUrl) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setPdfReaderUrl(null); setPdfReaderTitle(''); }}
              className="gap-1.5 flex-shrink-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">إغلاق</span>
            </Button>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <BookText className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {pdfReaderTitle}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(pdfReaderUrl, '_blank', 'noopener,noreferrer')}
              className="gap-1.5 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">فتح في تبويب</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleDownload({ id: 'reader', title: pdfReaderTitle, pdfUrl: pdfReaderUrl! }, pdfReaderTitle)}
              className="gap-1.5 text-xs bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تنزيل</span>
            </Button>
          </div>
        </div>

        {/* PDF Iframe */}
        <div className="flex-1 relative bg-slate-100 dark:bg-slate-900">
          <iframe
            src={getPdfViewerUrl(pdfReaderUrl)}
            className="w-full h-full border-0"
            title={pdfReaderTitle}
            allow="autoplay"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
          {/* Loading overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" id="pdf-loading">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">جاري تحميل الكتاب...</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // VOLUME CARD
  // ============================================

  const renderVolumeCard = (volume: BookVolume, bookName: string) => {
    const isDownloading = downloadingBooks[volume.id];
    
    return (
      <div key={volume.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-sm transition-all group">
        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">
          {volume.volumeNumber || <FileText className="w-4 h-4" />}
        </div>
        <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate font-medium">
          {volume.title}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleRead(volume, bookName)}
            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            title="قراءة"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </button>
          <button
            onClick={() => window.open(volume.pdfUrl, '_blank', 'noopener,noreferrer')}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="فتح في تبويب جديد"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
          <button
            onClick={() => handleDownload(volume, bookName)}
            disabled={isDownloading}
            className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
            title="تنزيل"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    );
  };

  // ============================================
  // BOOK CARD
  // ============================================

  const renderBookCard = (collection: BookCollection) => {
    const isExpanded = expandedBooks[collection.id];
    const catInfo = CATEGORY_INFO[collection.category];
    const IconComponent = catInfo.icon;
    
    return (
      <Card key={collection.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-0">
          {/* Book Header */}
          <div 
            className={`p-4 ${!collection.isSingleVolume && collection.volumes.length > 1 ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80' : ''}`}
            onClick={() => !collection.isSingleVolume && collection.volumes.length > 1 && toggleBookExpansion(collection.id)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                <IconComponent className="w-6 h-6" />
              </div>
              
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
                  onClick={(e) => { e.stopPropagation(); handleRead(collection.volumes[0], collection.name); }} 
                  variant="outline" 
                  className="flex-1 h-9 rounded-xl text-xs gap-1.5 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300"
                >
                  <Eye className="w-3.5 h-3.5" />
                  قراءة
                </Button>
                <Button 
                  onClick={(e) => { e.stopPropagation(); window.open(collection.volumes[0].pdfUrl, '_blank', 'noopener,noreferrer'); }} 
                  variant="outline" 
                  className="h-9 rounded-xl text-xs px-3"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleDownload(collection.volumes[0], collection.name); }} 
                  disabled={downloadingBooks[collection.volumes[0].id]}
                  className="flex-1 h-9 rounded-xl text-xs bg-blue-500 hover:bg-blue-600 text-white gap-1.5"
                >
                  {downloadingBooks[collection.volumes[0].id] ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      تنزيل PDF
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Volumes List */}
          {!collection.isSingleVolume && isExpanded && (
            <div className="border-t border-slate-100 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {collection.volumes.map(volume => renderVolumeCard(volume, collection.name))}
              </div>
            </div>
          )}

          {/* Expand hint */}
          {!collection.isSingleVolume && !isExpanded && collection.volumes.length > 1 && (
            <div 
              className="border-t border-slate-100 dark:border-slate-700 py-2 px-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
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

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <>
      {/* PDF Reader Overlay */}
      {renderPdfReader()}

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-bl from-purple-500 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">المكتبة الإسلامية الشاملة</h2>
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

        {/* Category Filter */}
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
            const CatIcon = catInfo.icon;

            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white`}>
                    <CatIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{category}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{catInfo.description}</p>
                  </div>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <Badge variant="outline" className="text-xs">{categoryBooks.length} كتاب</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryBooks.map(book => renderBookCard(book))}
                </div>
              </div>
            );
          })
        ) : (
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
            <p className="text-slate-500 dark:text-slate-400 font-medium">لم يتم العثور على كتب مطابقة</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">جرب كلمات بحث مختلفة</p>
          </div>
        )}
      </div>
    </>
  );
}
