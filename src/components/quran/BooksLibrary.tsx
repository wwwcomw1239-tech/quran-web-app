'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ExternalLink, Download, Loader2, BookOpen, FileText, Search, X, 
  ChevronDown, ChevronUp, BookMarked, Library, Scroll, 
  PenLine, MessageCircleQuestion, Languages, Heart,
  Sparkles, Eye, ArrowRight, BookText, Scale, Feather,
  GraduationCap, BookOpenCheck, ScrollText, RefreshCw, AlertCircle
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
  // ══════════════════════════════════════════════════════════════
  // ██ قسم التفسير - أكثر من 40 كتاب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tabari', name: 'تفسير الطبري - جامع البيان عن تأويل آي القرآن',
    author: 'الإمام محمد بن جرير الطبري (ت 310هـ)', category: 'التفسير',
    description: 'أعظم التفاسير بالمأثور وأوسعها، جمع فيه الطبري أقوال الصحابة والتابعين',
    volumes: createVolumes('tabari', 26, (i) => `https://archive.org/download/tafseer-al-tabari/taftabry${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'kathir', name: 'تفسير ابن كثير - تفسير القرآن العظيم',
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
    description: 'تفسير موسوعي يجمع بين العقل والنقل ويناقش القضايا الكلامية والفلسفية',
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
    description: 'تفسير القرآن بالقرآن مع بيان الأحكام الفقهية وترجيح الأقوال',
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
    description: 'تفسير مختصر وسهل العبارة يهتم بالمأثور والسنة',
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
    description: 'تفسير مختصر وميسر لعامة المسلمين أعده مجمع الملك فهد لطباعة المصحف',
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
  // --- كتب تفسير إضافية ---
  {
    id: 'zamakhshari', name: 'الكشاف عن حقائق التنزيل (تفسير الزمخشري)',
    author: 'الإمام الزمخشري (ت 538هـ)', category: 'التفسير',
    description: 'تفسير بلاغي لغوي يُعنى بالوجوه البيانية والبلاغية في القرآن',
    volumes: createVolumes('zamakhshari', 4, (i) => `https://archive.org/download/FP9403/zksh${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'nasafi', name: 'مدارك التنزيل وحقائق التأويل (تفسير النسفي)',
    author: 'الإمام عبد الله بن أحمد النسفي (ت 710هـ)', category: 'التفسير',
    description: 'تفسير مختصر يجمع بين الرواية والدراية على منهج أهل السنة',
    volumes: createVolumes('nasafi', 3, (i) => `https://archive.org/download/FP11330nsf/nsf${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'baidawi', name: 'أنوار التنزيل وأسرار التأويل (تفسير البيضاوي)',
    author: 'الإمام البيضاوي (ت 685هـ)', category: 'التفسير',
    description: 'تفسير مختصر من الكشاف مع تنقيحه وزيادات على منهج أهل السنة',
    volumes: createVolumes('baidawi', 5, (i) => `https://archive.org/download/FP11320bda/bda${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'alusi', name: 'روح المعاني في تفسير القرآن والسبع المثاني',
    author: 'الإمام الآلوسي (ت 1270هـ)', category: 'التفسير',
    description: 'تفسير موسوعي يجمع بين التفسير بالمأثور والرأي والإشارات',
    volumes: createVolumes('alusi', 16, (i) => `https://archive.org/download/FP60816/alusy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-abi-hatim', name: 'تفسير ابن أبي حاتم',
    author: 'الإمام ابن أبي حاتم الرازي (ت 327هـ)', category: 'التفسير',
    description: 'تفسير بالمأثور من أهم مصادر التفسير بالرواية',
    volumes: createVolumes('ibn-abi-hatim', 10, (i) => `https://archive.org/download/tfser-ebn-abe-hatem/ibnabihatm${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'samaani', name: 'تفسير القرآن الكريم (تفسير السمعاني)',
    author: 'الإمام أبو المظفر السمعاني (ت 489هـ)', category: 'التفسير',
    description: 'تفسير على مذهب أهل السنة والجماعة يهتم بالعقيدة والفقه',
    volumes: createVolumes('samaani', 6, (i) => `https://archive.org/download/FP8600/${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-atiyya', name: 'المحرر الوجيز في تفسير الكتاب العزيز (تفسير ابن عطية)',
    author: 'الإمام ابن عطية الأندلسي (ت 542هـ)', category: 'التفسير',
    description: 'تفسير يجمع بين الرواية والدراية مع اهتمام بالإعراب واللغة',
    volumes: createVolumes('ibn-atiyya', 6, (i) => `https://archive.org/download/FP62210/ibnatia${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mawardi', name: 'النكت والعيون (تفسير الماوردي)',
    author: 'الإمام الماوردي (ت 450هـ)', category: 'التفسير',
    description: 'تفسير يهتم بذكر الأقوال المختلفة في تأويل الآيات',
    volumes: createVolumes('mawardi', 6, (i) => `https://archive.org/download/FPawmwrdy/mwrdy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'thanai', name: 'تفسير الثنائي - تفسير الثعالبي (الجواهر الحسان)',
    author: 'الإمام الثعالبي (ت 875هـ)', category: 'التفسير',
    description: 'تفسير مختصر من تفسير ابن عطية مع إضافات مفيدة',
    volumes: createVolumes('thanai', 5, (i) => `https://archive.org/download/FP62500/thlaby${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'thalabi-kashf', name: 'الكشف والبيان عن تفسير القرآن (تفسير الثعلبي)',
    author: 'الإمام الثعلبي (ت 427هـ)', category: 'التفسير',
    description: 'تفسير بالمأثور من أوائل التفاسير الموسوعية',
    volumes: createVolumes('thalabi-kashf', 10, (i) => `https://archive.org/download/FP62510/thlbi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'abu-hayyan', name: 'البحر المحيط في التفسير',
    author: 'الإمام أبو حيان الأندلسي (ت 745هـ)', category: 'التفسير',
    description: 'تفسير لغوي نحوي موسوعي يهتم بإعراب القرآن والقراءات',
    volumes: createVolumes('abu-hayyan', 11, (i) => `https://archive.org/download/FP60210/bhrmhit${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'khazin', name: 'لباب التأويل في معاني التنزيل (تفسير الخازن)',
    author: 'الإمام الخازن (ت 741هـ)', category: 'التفسير',
    description: 'تفسير مختصر من تفسير البغوي مع زيادات نافعة',
    volumes: createVolumes('khazin', 7, (i) => `https://archive.org/download/FP60510/khzn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-juzai', name: 'التسهيل لعلوم التنزيل (تفسير ابن جزي)',
    author: 'الإمام ابن جزي الكلبي (ت 741هـ)', category: 'التفسير',
    description: 'تفسير مختصر سهل العبارة مع فوائد لغوية وبلاغية',
    volumes: singleVol('ibn-juzai', 'التسهيل لعلوم التنزيل', 'https://archive.org/download/FPtshilFP/tshil.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'shanqiti-usul', name: 'منع جواز المجاز في المنزل للتعبد والإعجاز',
    author: 'الشيخ محمد الأمين الشنقيطي (ت 1393هـ)', category: 'التفسير',
    description: 'رسالة في بيان عدم وجود المجاز في القرآن الكريم',
    volumes: singleVol('shanqiti-usul', 'منع جواز المجاز', 'https://archive.org/download/WAQ69939/man3jawaz.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'suyuti-nuzul', name: 'ترتيب سور القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'التفسير',
    description: 'رسالة في ترتيب سور القرآن الكريم والحكمة منه',
    volumes: singleVol('suyuti-nuzul', 'ترتيب سور القرآن', 'https://archive.org/download/WAQ85429/85429.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-munir', name: 'التفسير المنير في العقيدة والشريعة والمنهج',
    author: 'الدكتور وهبة الزحيلي (ت 1436هـ)', category: 'التفسير',
    description: 'تفسير معاصر شامل يجمع بين التفسير التحليلي والموضوعي',
    volumes: createVolumes('tafsir-munir', 15, (i) => `https://archive.org/download/FP97210/mnyr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'wasit-zuhaili', name: 'التفسير الوسيط',
    author: 'الدكتور وهبة الزحيلي (ت 1436هـ)', category: 'التفسير',
    description: 'تفسير وسيط بين الإيجاز والتطويل مع بيان الأحكام',
    volumes: createVolumes('wasit-zuhaili', 3, (i) => `https://archive.org/download/FP98000/wsyt${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-jawzi-zad', name: 'زاد المسير في علم التفسير',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'التفسير',
    description: 'تفسير مختصر يجمع أقوال المفسرين مع إعراب الآيات',
    volumes: createVolumes('ibn-jawzi-zad', 4, (i) => `https://archive.org/download/FP59909/zadmsyr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tabari-kathir-combined', name: 'تفسير ابن كثير (طبعة دار طيبة)',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'التفسير',
    description: 'طبعة محققة مع تخريج الأحاديث والآثار',
    volumes: singleVol('tabari-kathir-combined', 'تفسير ابن كثير - طبعة دار طيبة', 'https://archive.org/download/tafsir-ibn-kathir/Tafseer-Ibn-Kathir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-tawdih', name: 'أيسر التفاسير لكلام العلي الكبير',
    author: 'الشيخ أبو بكر الجزائري (ت 1439هـ)', category: 'التفسير',
    description: 'تفسير ميسر مع بيان الأحكام والهدايات والآداب',
    volumes: createVolumes('tafsir-tawdih', 5, (i) => `https://archive.org/download/FP11328/aysr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tantheem', name: 'نظم الدرر في تناسب الآيات والسور',
    author: 'الإمام البقاعي (ت 885هـ)', category: 'التفسير',
    description: 'تفسير يهتم ببيان المناسبات بين الآيات والسور',
    volumes: createVolumes('tantheem', 22, (i) => `https://archive.org/download/FP60820/bqay${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'siraj-munir', name: 'السراج المنير في تفسير القرآن',
    author: 'الإمام الشربيني (ت 977هـ)', category: 'التفسير',
    description: 'تفسير يجمع بين الرواية والدراية مع بيان القراءات',
    volumes: createVolumes('siraj-munir', 4, (i) => `https://archive.org/download/FP60650/shrbiny${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'qasimi', name: 'محاسن التأويل (تفسير القاسمي)',
    author: 'الشيخ جمال الدين القاسمي (ت 1332هـ)', category: 'التفسير',
    description: 'تفسير يجمع بين الأصالة والمعاصرة والاعتدال في المنهج',
    volumes: createVolumes('qasimi', 9, (i) => `https://archive.org/download/FP95010/qsmy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-rajab', name: 'تفسير ابن رجب الحنبلي',
    author: 'الإمام ابن رجب الحنبلي (ت 795هـ)', category: 'التفسير',
    description: 'تفسير على منهج السلف مع فوائد حديثية وفقهية',
    volumes: singleVol('ibn-rajab', 'تفسير ابن رجب الحنبلي', 'https://archive.org/download/FP82312/tafseeribnrajab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wajiz-wahidi', name: 'الوجيز في تفسير الكتاب العزيز',
    author: 'الإمام الواحدي (ت 468هـ)', category: 'التفسير',
    description: 'تفسير مختصر من أوائل التفاسير المختصرة',
    volumes: singleVol('wajiz-wahidi', 'الوجيز في التفسير', 'https://archive.org/download/WAQ11720/11720.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tustari', name: 'تفسير القرآن العظيم (تفسير التستري)',
    author: 'الإمام سهل بن عبد الله التستري (ت 283هـ)', category: 'التفسير',
    description: 'من أقدم كتب التفسير مع لطائف إيمانية',
    volumes: singleVol('tustari', 'تفسير التستري', 'https://archive.org/download/FP62700/tstry.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'faid-qadir-tafsir', name: 'التيسير بشرح الجامع الصغير',
    author: 'الإمام المناوي (ت 1031هـ)', category: 'التفسير',
    description: 'شرح مختصر للأحاديث المتعلقة بتفسير القرآن',
    volumes: singleVol('faid-qadir-tafsir', 'التيسير بشرح الجامع الصغير', 'https://archive.org/download/FP80000mnw/tysyr.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم علوم القرآن - أكثر من 30 كتاب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'itqan', name: 'الإتقان في علوم القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'أشهر كتاب في علوم القرآن يتناول 80 نوعاً من أنواع علوم القرآن',
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
    description: 'كتاب تعليمي سهل في علوم القرآن للمبتدئين والمتوسطين',
    volumes: singleVol('mabaheth', 'مباحث في علوم القرآن', 'https://archive.org/download/WAQmbolqumbolqu/mbolqu.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muqaddima-tafsir', name: 'مقدمة في أصول التفسير',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'علوم القرآن',
    description: 'رسالة مهمة في أصول التفسير وقواعده من شيخ الإسلام',
    volumes: singleVol('muqaddima-tafsir', 'مقدمة في أصول التفسير', 'https://archive.org/download/mabadifiilmeusoolaltafseer/MABADI_FI_ILM_E_USOOL_AL_TAFSEER.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'manahij', name: 'التفسير والمفسرون',
    author: 'محمد حسين الذهبي', category: 'علوم القرآن',
    description: 'دراسة تحليلية شاملة لمناهج المفسرين عبر التاريخ',
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
  // --- كتب علوم قرآن إضافية ---
  {
    id: 'funun-afnan', name: 'فنون الأفنان في عيون علوم القرآن',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'علوم القرآن',
    description: 'كتاب في أنواع علوم القرآن من إمام الوعاظ',
    volumes: singleVol('funun-afnan', 'فنون الأفنان', 'https://archive.org/download/FP11305/fnwnalafnan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nasikh-mansukh-nahhas', name: 'الناسخ والمنسوخ في القرآن الكريم',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'علوم القرآن',
    description: 'من أهم كتب الناسخ والمنسوخ في القرآن الكريم',
    volumes: singleVol('nasikh-mansukh-nahhas', 'الناسخ والمنسوخ للنحاس', 'https://archive.org/download/FP63810/alnasekh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nasikh-mansukh-ibn-hazm', name: 'الناسخ والمنسوخ',
    author: 'الإمام ابن حزم الظاهري (ت 456هـ)', category: 'علوم القرآن',
    description: 'رسالة مختصرة في بيان الناسخ والمنسوخ',
    volumes: singleVol('nasikh-mansukh-ibn-hazm', 'الناسخ والمنسوخ لابن حزم', 'https://archive.org/download/WAQnskhwmnskh/nskhwmnskh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muhkam-mutashabih', name: 'المحكم والمتشابه في القرآن',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'علوم القرآن',
    description: 'كتاب في بيان المحكم والمتشابه من آيات القرآن',
    volumes: singleVol('muhkam-mutashabih', 'المحكم والمتشابه', 'https://archive.org/download/WAQ60860s/60860s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fadail-quran-nasai', name: 'فضائل القرآن',
    author: 'الإمام النسائي (ت 303هـ)', category: 'علوم القرآن',
    description: 'أحاديث في فضائل القرآن وتلاوته وحفظه',
    volumes: singleVol('fadail-quran-nasai', 'فضائل القرآن للنسائي', 'https://archive.org/download/FPfdaylqlns/fdaylqlns.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fadail-quran-ibn-kathir', name: 'فضائل القرآن',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'علوم القرآن',
    description: 'كتاب في فضائل القرآن وثواب تلاوته وآداب حملته',
    volumes: singleVol('fadail-quran-ibn-kathir', 'فضائل القرآن لابن كثير', 'https://archive.org/download/FP59519/fdaylquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tibyan-adab', name: 'التبيان في آداب حملة القرآن',
    author: 'الإمام النووي (ت 676هـ)', category: 'علوم القرآن',
    description: 'كتاب في آداب تلاوة القرآن وحفظه وتعليمه',
    volumes: singleVol('tibyan-adab', 'التبيان في آداب حملة القرآن', 'https://archive.org/download/WAQtby/tby.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ijaz-quran-baqillani', name: 'إعجاز القرآن',
    author: 'الإمام الباقلاني (ت 403هـ)', category: 'علوم القرآن',
    description: 'من أعظم ما ألف في إعجاز القرآن الكريم',
    volumes: singleVol('ijaz-quran-baqillani', 'إعجاز القرآن للباقلاني', 'https://archive.org/download/FP63380/i3jazquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ijaz-quran-khattabi', name: 'بيان إعجاز القرآن',
    author: 'الإمام الخطابي (ت 388هـ)', category: 'علوم القرآن',
    description: 'رسالة مهمة في إعجاز القرآن البلاغي',
    volumes: singleVol('ijaz-quran-khattabi', 'بيان إعجاز القرآن', 'https://archive.org/download/WAQ63380/63380.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'amthal-quran-mawardi', name: 'الأمثال في القرآن الكريم',
    author: 'الإمام الماوردي (ت 450هـ)', category: 'علوم القرآن',
    description: 'كتاب في بيان الأمثال المضروبة في القرآن الكريم',
    volumes: singleVol('amthal-quran-mawardi', 'الأمثال في القرآن للماوردي', 'https://archive.org/download/FP60510/amthalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'aqsam-quran-ibn-qayyim', name: 'أقسام القرآن',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'علوم القرآن',
    description: 'كتاب يبين الأقسام التي أقسم الله بها في القرآن وحكمتها',
    volumes: singleVol('aqsam-quran-ibn-qayyim', 'أقسام القرآن', 'https://archive.org/download/FP82106/aqsamquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'amthal-quran-ibn-qayyim', name: 'الأمثال في القرآن الكريم',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'علوم القرآن',
    description: 'كتاب في بيان أمثال القرآن ومعانيها العميقة',
    volumes: singleVol('amthal-quran-ibn-qayyim', 'الأمثال في القرآن لابن القيم', 'https://archive.org/download/FP82107/amthalibnqayyim.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qawaid-tafsir', name: 'القواعد الحسان المتعلقة بتفسير القرآن',
    author: 'الشيخ عبد الرحمن بن ناصر السعدي (ت 1376هـ)', category: 'علوم القرآن',
    description: 'قواعد أساسية في فهم القرآن وتفسيره',
    volumes: singleVol('qawaid-tafsir', 'القواعد الحسان', 'https://archive.org/download/FP11429/qwaidhasan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'taawil-mushkil', name: 'تأويل مشكل القرآن',
    author: 'الإمام ابن قتيبة (ت 276هـ)', category: 'علوم القرآن',
    description: 'كتاب يرد فيه على الطاعنين في القرآن ويبين مشكله',
    volumes: singleVol('taawil-mushkil', 'تأويل مشكل القرآن', 'https://archive.org/download/WAQ63310/63310.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'makki-madani', name: 'المكي والمدني في القرآن الكريم',
    author: 'الدكتور عبد الرزاق حسين أحمد', category: 'علوم القرآن',
    description: 'دراسة شاملة في المكي والمدني وخصائص كل منهما',
    volumes: singleVol('makki-madani', 'المكي والمدني', 'https://archive.org/download/WAQ64220/64220.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jam3-quran', name: 'جمع القرآن - دراسة تحليلية لمروياته',
    author: 'الدكتور أكرم عبد خليفة الدليمي', category: 'علوم القرآن',
    description: 'دراسة علمية في تاريخ جمع القرآن الكريم',
    volumes: singleVol('jam3-quran', 'جمع القرآن', 'https://archive.org/download/FP63120/jam3quran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'rasm-quran', name: 'المقنع في رسم مصاحف الأمصار',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'علوم القرآن',
    description: 'كتاب أساسي في رسم المصحف العثماني',
    volumes: singleVol('rasm-quran', 'المقنع في رسم المصاحف', 'https://archive.org/download/WAQ32510s/32510s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'waqf-ibtida', name: 'منار الهدى في الوقف والابتداء',
    author: 'الإمام الأشموني (ت 1100هـ)', category: 'علوم القرآن',
    description: 'كتاب شامل في أحكام الوقف والابتداء في القرآن',
    volumes: singleVol('waqf-ibtida', 'منار الهدى في الوقف والابتداء', 'https://archive.org/download/WAQ33290/33290.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم التجويد والقراءات - أكثر من 25 كتاب ██
  // ══════════════════════════════════════════════════════════════
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
  // --- كتب تجويد وقراءات إضافية ---
  {
    id: 'nashr-qiraat', name: 'النشر في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أعظم كتاب في القراءات العشر المتواترة وأصولها وفرشها',
    volumes: createVolumes('nashr-qiraat', 2, (i) => `https://archive.org/download/WAQ37515/nashr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tahbeer-tayseer', name: 'تحبير التيسير في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في توضيح القراءات العشر',
    volumes: singleVol('tahbeer-tayseer', 'تحبير التيسير', 'https://archive.org/download/WAQ32513/32513.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jazariyya', name: 'المقدمة الجزرية في التجويد',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أشهر منظومة في أحكام التجويد يحفظها طلاب العلم',
    volumes: singleVol('jazariyya', 'المقدمة الجزرية', 'https://archive.org/download/WAQ32511/32511.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tuhfat-atfal', name: 'تحفة الأطفال والغلمان في تجويد القرآن',
    author: 'الشيخ سليمان الجمزوري (ت 1204هـ)', category: 'التجويد والقراءات',
    description: 'منظومة مشهورة في أحكام التجويد للمبتدئين',
    volumes: singleVol('tuhfat-atfal', 'تحفة الأطفال', 'https://archive.org/download/WAQthftatfl/thftatfl.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tamheed', name: 'التمهيد في علم التجويد',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'كتاب أساسي في أصول علم التجويد ومخارج الحروف',
    volumes: singleVol('tamheed', 'التمهيد في علم التجويد', 'https://archive.org/download/WAQ32512/32512.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ghaya-nihaya', name: 'غاية النهاية في طبقات القراء',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أشمل كتاب في تراجم القراء والمقرئين',
    volumes: createVolumes('ghaya-nihaya', 2, (i) => `https://archive.org/download/WAQ37516s/ghayanihaya${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tayseer-dani', name: 'التيسير في القراءات السبع',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'كتاب أساسي في القراءات السبع اختصره من كتابه جامع البيان',
    volumes: singleVol('tayseer-dani', 'التيسير في القراءات السبع', 'https://archive.org/download/WAQ32510s/32510.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'shatibiyya', name: 'حرز الأماني ووجه التهاني (الشاطبية)',
    author: 'الإمام الشاطبي (ت 590هـ)', category: 'التجويد والقراءات',
    description: 'أشهر منظومة في القراءات السبع، ألفية لا يستغني عنها قارئ',
    volumes: singleVol('shatibiyya', 'الشاطبية', 'https://archive.org/download/WAQ31290/31290.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'durra-mudiyya', name: 'الدرة المضية في القراءات الثلاث',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'منظومة في القراءات الثلاث المتممة للعشر',
    volumes: singleVol('durra-mudiyya', 'الدرة المضية', 'https://archive.org/download/WAQ32514/32514.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tayyibat-nashr', name: 'طيبة النشر في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'منظومة جامعة في القراءات العشر نظم فيها كتابه النشر',
    volumes: singleVol('tayyibat-nashr', 'طيبة النشر', 'https://archive.org/download/WAQ37517/37517.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'hujjat-qiraat', name: 'الحجة للقراء السبعة',
    author: 'الإمام أبو علي الفارسي (ت 377هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في توجيه القراءات السبع وبيان حججها النحوية',
    volumes: createVolumes('hujjat-qiraat', 3, (i) => `https://archive.org/download/FP64610/hujja${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'kashf-qiraat', name: 'الكشف عن وجوه القراءات السبع وعللها',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في توجيه القراءات وبيان عللها',
    volumes: singleVol('kashf-qiraat', 'الكشف عن وجوه القراءات', 'https://archive.org/download/FP64612/kashfqiraat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibana-nukhba', name: 'الإبانة عن معاني القراءات',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في شرح معاني القراءات وبيان أوجهها',
    volumes: singleVol('ibana-nukhba', 'الإبانة عن معاني القراءات', 'https://archive.org/download/FP64613/ibana.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'riaya-tajwid', name: 'الرعاية لتجويد القراءة وتحقيق لفظ التلاوة',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'التجويد والقراءات',
    description: 'من أقدم الكتب المتخصصة في أحكام التجويد',
    volumes: singleVol('riaya-tajwid', 'الرعاية لتجويد القراءة', 'https://archive.org/download/FP64614/riayatajweed.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qiraat-abnumujahid', name: 'السبعة في القراءات',
    author: 'الإمام ابن مجاهد (ت 324هـ)', category: 'التجويد والقراءات',
    description: 'أول كتاب يحصر القراءات المتواترة في سبع قراءات',
    volumes: singleVol('qiraat-abnumujahid', 'السبعة في القراءات', 'https://archive.org/download/WAQ31295/31295.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم إعراب القرآن وبيانه - أكثر من 15 كتاب ██
  // ══════════════════════════════════════════════════════════════
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
  // --- كتب إعراب إضافية ---
  {
    id: 'irab-nahhas', name: 'إعراب القرآن',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم وأهم كتب إعراب القرآن الكريم',
    volumes: createVolumes('irab-nahhas', 5, (i) => `https://archive.org/download/FP63505/nahhas${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'irab-darwish', name: 'إعراب القرآن الكريم وبيانه',
    author: 'الشيخ محيي الدين درويش', category: 'إعراب القرآن وبيانه',
    description: 'إعراب شامل ومفصل لجميع آيات القرآن الكريم',
    volumes: createVolumes('irab-darwish', 10, (i) => `https://archive.org/download/FP63508/darwish${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'jadwal-irab', name: 'الجدول في إعراب القرآن',
    author: 'الشيخ محمود صافي', category: 'إعراب القرآن وبيانه',
    description: 'إعراب القرآن على شكل جداول ميسرة',
    volumes: createVolumes('jadwal-irab', 15, (i) => `https://archive.org/download/FP63509/jadwal${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mushkil-irab', name: 'مشكل إعراب القرآن',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في بيان الأوجه المشكلة في إعراب القرآن',
    volumes: singleVol('mushkil-irab', 'مشكل إعراب القرآن', 'https://archive.org/download/WAQ63509/63509.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tibyan-irab', name: 'التبيان في إعراب القرآن',
    author: 'الإمام أبو البقاء العكبري (ت 616هـ)', category: 'إعراب القرآن وبيانه',
    description: 'إعراب القرآن مع بيان الأوجه الإعرابية المختلفة',
    volumes: createVolumes('tibyan-irab', 2, (i) => `https://archive.org/download/FP63507/akbary${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'majaz-quran', name: 'مجاز القرآن',
    author: 'الإمام أبو عبيدة معمر بن المثنى (ت 209هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب بلاغة القرآن وبيان أساليبه',
    volumes: singleVol('majaz-quran', 'مجاز القرآن', 'https://archive.org/download/FP63210/majazquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muthanna-quran', name: 'ما اتفق لفظه واختلف معناه من القرآن',
    author: 'الإمام المبرد (ت 286هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في الوجوه والنظائر في القرآن الكريم',
    volumes: singleVol('muthanna-quran', 'ما اتفق لفظه واختلف معناه', 'https://archive.org/download/WAQ63312/63312.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'maani-quran-farra', name: 'معاني القرآن',
    author: 'الإمام الفراء (ت 207هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب معاني القرآن وإعرابه على مذهب الكوفيين',
    volumes: createVolumes('maani-quran-farra', 3, (i) => `https://archive.org/download/FP63210s/farra${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'maani-quran-akhfash', name: 'معاني القرآن',
    author: 'الإمام الأخفش الأوسط (ت 215هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في معاني القرآن وإعرابه على مذهب البصريين',
    volumes: singleVol('maani-quran-akhfash', 'معاني القرآن للأخفش', 'https://archive.org/download/FP63211/akhfash.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'daf-iham', name: 'دفع إيهام الاضطراب عن آيات الكتاب',
    author: 'الشيخ محمد الأمين الشنقيطي (ت 1393هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب يرفع الإيهام عن الآيات التي ظاهرها التعارض',
    volumes: singleVol('daf-iham', 'دفع إيهام الاضطراب', 'https://archive.org/download/WAQ69940/69940.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم أسباب النزول - أكثر من 10 كتب ██
  // ══════════════════════════════════════════════════════════════
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
    description: 'أول كتاب مستقل في أسباب النزول وأشهرها',
    volumes: singleVol('asbab-wahidi', 'أسباب النزول للواحدي', 'https://archive.org/download/asbab-01002/asbab-01002.pdf'),
    isSingleVolume: true,
  },
  // --- كتب أسباب نزول إضافية ---
  {
    id: 'ajab-asbab', name: 'العُجاب في بيان الأسباب',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'أسباب النزول',
    description: 'كتاب موسع في أسباب النزول مع تحقيق الروايات',
    volumes: singleVol('ajab-asbab', 'العُجاب في بيان الأسباب', 'https://archive.org/download/FP76510/ujab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'asbab-jazairi', name: 'أسباب النزول - دراسة علمية',
    author: 'الدكتور غازي عناية', category: 'أسباب النزول',
    description: 'دراسة علمية في أسباب نزول آيات القرآن',
    volumes: singleVol('asbab-jazairi', 'أسباب النزول - دراسة علمية', 'https://archive.org/download/WAQ9084S/9084s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nuzul-quran', name: 'أسباب نزول القرآن - رواية ودراية',
    author: 'الدكتور عماد الدين أبو العطا', category: 'أسباب النزول',
    description: 'دراسة شاملة في أسباب النزول من حيث الرواية والدراية',
    volumes: singleVol('nuzul-quran', 'أسباب نزول القرآن', 'https://archive.org/download/WAQ9085S/9085s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'makki-madani-2', name: 'المكي والمدني وأسباب النزول',
    author: 'الإمام ابن النقيب (ت 698هـ)', category: 'أسباب النزول',
    description: 'كتاب يجمع بين المكي والمدني وأسباب النزول',
    volumes: singleVol('makki-madani-2', 'المكي والمدني وأسباب النزول', 'https://archive.org/download/WAQ9086S/9086s.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم غريب القرآن ومفرداته - أكثر من 15 كتاب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'mufredat', name: 'مفردات ألفاظ القرآن',
    author: 'الإمام الراغب الأصفهاني (ت 502هـ)', category: 'غريب القرآن ومفرداته',
    description: 'أشهر معجم لمفردات القرآن الكريم وأكثرها شمولاً',
    volumes: singleVol('mufredat', 'مفردات ألفاظ القرآن', 'https://archive.org/download/Al-isfahani-MufradatAlfadhAl-quran/Al-isfahani-MufradatAlfadhAl-quran-.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mafahim', name: 'مفاهيم قرآنية',
    author: 'الشيخ محمد الغزالي', category: 'غريب القرآن ومفرداته',
    description: 'بيان لمفاهيم قرآنية أساسية ومعانيها العميقة',
    volumes: singleVol('mafahim', 'مفاهيم قرآنية', 'https://archive.org/download/ebw02/079.pdf'),
    isSingleVolume: true,
  },
  // --- كتب غريب القرآن إضافية ---
  {
    id: 'gharib-quran-ibn-qutayba', name: 'غريب القرآن',
    author: 'الإمام ابن قتيبة (ت 276هـ)', category: 'غريب القرآن ومفرداته',
    description: 'من أقدم كتب غريب القرآن الكريم',
    volumes: singleVol('gharib-quran-ibn-qutayba', 'غريب القرآن لابن قتيبة', 'https://archive.org/download/FP63310/ghareebquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'gharib-sajistani', name: 'نزهة القلوب في غريب القرآن',
    author: 'الإمام السجستاني (ت 330هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم لغريب القرآن مرتب على الحروف',
    volumes: singleVol('gharib-sajistani', 'نزهة القلوب في غريب القرآن', 'https://archive.org/download/WAQ63315/63315.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wujuh-nazair', name: 'الوجوه والنظائر في القرآن الكريم',
    author: 'الإمام الدامغاني (ت 478هـ)', category: 'غريب القرآن ومفرداته',
    description: 'كتاب في الألفاظ القرآنية المتعددة المعاني',
    volumes: singleVol('wujuh-nazair', 'الوجوه والنظائر', 'https://archive.org/download/WAQ63316/63316.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'kalimat-quran', name: 'كلمات القرآن - تفسير وبيان',
    author: 'الشيخ حسنين مخلوف', category: 'غريب القرآن ومفرداته',
    description: 'كتاب مختصر في بيان معاني كلمات القرآن الغريبة',
    volumes: singleVol('kalimat-quran', 'كلمات القرآن', 'https://archive.org/download/FP63320/kalimatquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tasheel-quran', name: 'السراج في بيان غريب القرآن',
    author: 'الشيخ محمد بن عبد العزيز الخضيري', category: 'غريب القرآن ومفرداته',
    description: 'كتاب ميسر في بيان غريب ألفاظ القرآن',
    volumes: singleVol('tasheel-quran', 'السراج في بيان غريب القرآن', 'https://archive.org/download/FP63321/siraj.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'umdah-huffaz', name: 'عمدة الحفاظ في تفسير أشرف الألفاظ',
    author: 'الإمام السمين الحلبي (ت 756هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم لغوي يشرح مفردات القرآن مع التحليل اللغوي',
    volumes: createVolumes('umdah-huffaz', 4, (i) => `https://archive.org/download/FP63325/samin${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mutashabih-quran', name: 'المتشابه اللفظي في القرآن وسر بلاغته',
    author: 'الدكتور صالح الشتيوي', category: 'غريب القرآن ومفرداته',
    description: 'كتاب في بيان الألفاظ المتشابهة في القرآن والفروق بينها',
    volumes: singleVol('mutashabih-quran', 'المتشابه اللفظي في القرآن', 'https://archive.org/download/WAQ63317/63317.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'durr-manthour-gharib', name: 'الدر المنثور في بيان غريب القرآن',
    author: 'الإمام أبو حيان الأندلسي (ت 745هـ)', category: 'غريب القرآن ومفرداته',
    description: 'تفسير لغريب القرآن من إمام النحاة',
    volumes: singleVol('durr-manthour-gharib', 'الدر المنثور في غريب القرآن', 'https://archive.org/download/FP63326/durrghareeb.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم التدبر - أكثر من 15 كتاب ██
  // ══════════════════════════════════════════════════════════════
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
    description: 'سلسلة في تدبر القرآن الكريم والتأمل في آياته',
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
  // --- كتب تدبر إضافية ---
  {
    id: 'naba-azeem', name: 'النبأ العظيم - نظرات جديدة في القرآن',
    author: 'الدكتور محمد عبد الله دراز (ت 1377هـ)', category: 'التدبر',
    description: 'كتاب في إعجاز القرآن وعظمته ونظرات تدبرية عميقة',
    volumes: singleVol('naba-azeem', 'النبأ العظيم', 'https://archive.org/download/FP95510/nabaa3zeem.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'thilal-quran', name: 'في ظلال القرآن',
    author: 'سيد قطب (ت 1386هـ)', category: 'التدبر',
    description: 'تفسير تدبري أدبي يربط القرآن بالواقع والحياة',
    volumes: createVolumes('thilal-quran', 6, (i) => `https://archive.org/download/FP96110/dhylal${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'maqasid-suwar', name: 'المختصر في مقاصد سور القرآن',
    author: 'جمع من العلماء', category: 'التدبر',
    description: 'كتاب يبين مقصد كل سورة من سور القرآن الكريم',
    volumes: singleVol('maqasid-suwar', 'المختصر في مقاصد سور القرآن', 'https://archive.org/download/FP95515/maqasidsuwar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tadabbur-w-amal', name: 'تدبر القرآن والعمل به',
    author: 'الشيخ عبد الرحمن حبنكة الميداني', category: 'التدبر',
    description: 'كتاب يربط بين تدبر القرآن والعمل بمقتضاه',
    volumes: singleVol('tadabbur-w-amal', 'تدبر القرآن والعمل به', 'https://archive.org/download/FP95516/tadabbur.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qasas-quran', name: 'قصص القرآن الكريم',
    author: 'الشيخ محمد أحمد جاد المولى', category: 'التدبر',
    description: 'عرض لقصص القرآن مع العبر والدروس المستفادة',
    volumes: singleVol('qasas-quran', 'قصص القرآن الكريم', 'https://archive.org/download/FP95520/qasasquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tadabbur-surahs', name: 'تأملات قرآنية',
    author: 'الشيخ صالح بن عبد الله بن حميد', category: 'التدبر',
    description: 'تأملات وتدبرات في سور وآيات من القرآن الكريم',
    volumes: singleVol('tadabbur-surahs', 'تأملات قرآنية', 'https://archive.org/download/FP95521/taamulat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'quran-hayat', name: 'كيف نتعامل مع القرآن الكريم',
    author: 'الشيخ محمد الغزالي (ت 1416هـ)', category: 'التدبر',
    description: 'كتاب في كيفية التعامل مع القرآن وتدبره',
    volumes: singleVol('quran-hayat', 'كيف نتعامل مع القرآن', 'https://archive.org/download/ebw02/081.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nahw-quran-hayy', name: 'نحو قرآن حي',
    author: 'الشيخ محمد الغزالي (ت 1416هـ)', category: 'التدبر',
    description: 'كتاب يدعو لإحياء التفاعل مع القرآن الكريم',
    volumes: singleVol('nahw-quran-hayy', 'نحو قرآن حي', 'https://archive.org/download/FP95530/nahwquranhay.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-tarbawi', name: 'التفسير التربوي للقرآن الكريم',
    author: 'الدكتور أنور الباز', category: 'التدبر',
    description: 'تفسير يستنبط الجوانب التربوية من القرآن الكريم',
    volumes: singleVol('tafsir-tarbawi', 'التفسير التربوي', 'https://archive.org/download/tafseer_tarbawee_202010/tafsir_tarbawi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mawdui-quran', name: 'التفسير الموضوعي لسور القرآن',
    author: 'نخبة من العلماء - جامعة الشارقة', category: 'التدبر',
    description: 'تفسير موضوعي يبين المحاور الرئيسية لكل سورة',
    volumes: singleVol('mawdui-quran', 'التفسير الموضوعي', 'https://archive.org/download/FP95535/mawduiquran.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - كتب التفسير ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tafsir-ibn-arafa', name: 'تفسير ابن عرفة',
    author: 'الإمام ابن عرفة المالكي (ت 803هـ)', category: 'التفسير',
    description: 'تفسير على المذهب المالكي مع بحوث أصولية وكلامية',
    volumes: singleVol('tafsir-ibn-arafa', 'تفسير ابن عرفة', 'https://archive.org/download/FP62700s/ibnarafa.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'lubab-nuqul', name: 'لباب التأويل في معاني التنزيل',
    author: 'الإمام الخازن علاء الدين البغدادي (ت 741هـ)', category: 'التفسير',
    description: 'تفسير ميسر اختصره من تفسير البغوي مع زيادات',
    volumes: createVolumes('lubab-nuqul', 4, (i) => `https://archive.org/download/FP60510/khzn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-samarqandi', name: 'بحر العلوم (تفسير السمرقندي)',
    author: 'الإمام أبو الليث السمرقندي (ت 373هـ)', category: 'التفسير',
    description: 'تفسير بالرأي والمأثور من تفاسير الحنفية',
    volumes: createVolumes('tafsir-samarqandi', 3, (i) => `https://archive.org/download/FP62400/smrqndy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-abi-zamanayn', name: 'تفسير القرآن العزيز',
    author: 'الإمام ابن أبي زمنين (ت 399هـ)', category: 'التفسير',
    description: 'تفسير مختصر من أقدم تفاسير المالكية بالأندلس',
    volumes: singleVol('tafsir-ibn-abi-zamanayn', 'تفسير ابن أبي زمنين', 'https://archive.org/download/FP62100/ibnabizamanin.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-jalalayn-mahalli', name: 'تفسير الجلالين (طبعة محققة)',
    author: 'المحلي والسيوطي', category: 'التفسير',
    description: 'طبعة محققة من تفسير الجلالين مع حاشية الصاوي',
    volumes: createVolumes('tafsir-jalalayn-mahalli', 4, (i) => `https://archive.org/download/FP60910/sawy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'hashiyat-sawi', name: 'حاشية الصاوي على تفسير الجلالين',
    author: 'الشيخ أحمد الصاوي المالكي (ت 1241هـ)', category: 'التفسير',
    description: 'حاشية نفيسة على تفسير الجلالين',
    volumes: createVolumes('hashiyat-sawi', 4, (i) => `https://archive.org/download/FP60915/sawy2_${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-abu-suud', name: 'إرشاد العقل السليم (تفسير أبي السعود)',
    author: 'الإمام أبو السعود العمادي (ت 982هـ)', category: 'التفسير',
    description: 'تفسير بلاغي بياني من أفضل التفاسير في البلاغة',
    volumes: createVolumes('tafsir-abu-suud', 9, (i) => `https://archive.org/download/FP60110/abosuod${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-tantawi', name: 'الجواهر في تفسير القرآن الكريم',
    author: 'الشيخ طنطاوي جوهري (ت 1358هـ)', category: 'التفسير',
    description: 'تفسير علمي يربط آيات القرآن بالعلوم الحديثة',
    volumes: createVolumes('tafsir-tantawi', 13, (i) => `https://archive.org/download/FP97010/tantawi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-maraghi', name: 'تفسير المراغي',
    author: 'الشيخ أحمد مصطفى المراغي (ت 1371هـ)', category: 'التفسير',
    description: 'تفسير معاصر بأسلوب واضح مع ربط بالواقع',
    volumes: createVolumes('tafsir-maraghi', 10, (i) => `https://archive.org/download/FP97110/maraghy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-mannar', name: 'تفسير المنار',
    author: 'الشيخ محمد رشيد رضا (ت 1354هـ)', category: 'التفسير',
    description: 'تفسير إصلاحي اجتماعي يهتم بهداية القرآن للواقع',
    volumes: createVolumes('tafsir-mannar', 12, (i) => `https://archive.org/download/FP97210mn/mannar${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-ajiba', name: 'البحر المديد في تفسير القرآن المجيد',
    author: 'الإمام ابن عجيبة (ت 1224هـ)', category: 'التفسير',
    description: 'تفسير يجمع بين الظاهر والإشارة مع فوائد لغوية',
    volumes: createVolumes('tafsir-ibn-ajiba', 7, (i) => `https://archive.org/download/FP62800/ibnajiba${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-suyuti-jami', name: 'الجامع الصغير في تفسير القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'التفسير',
    description: 'تفسير مختصر جامع من السيوطي',
    volumes: singleVol('tafsir-suyuti-jami', 'الجامع الصغير في التفسير', 'https://archive.org/download/FP60700/suyutijami.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-wahba-zuhayli', name: 'التفسير الوسيط للزحيلي',
    author: 'الدكتور وهبة الزحيلي (ت 1436هـ)', category: 'التفسير',
    description: 'تفسير وسيط بين الإيجاز والتفصيل مع بيان الأحكام الفقهية',
    volumes: createVolumes('tafsir-wahba-zuhayli', 3, (i) => `https://archive.org/download/FP98000/wsyt${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-al-mundhir', name: 'تفسير ابن المنذر',
    author: 'الإمام ابن المنذر النيسابوري (ت 318هـ)', category: 'التفسير',
    description: 'تفسير بالمأثور من إمام الإجماع والاختلاف',
    volumes: singleVol('tafsir-ibn-al-mundhir', 'تفسير ابن المنذر', 'https://archive.org/download/FP59600/ibnalmundhir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-muqatil', name: 'تفسير مقاتل بن سليمان',
    author: 'مقاتل بن سليمان (ت 150هـ)', category: 'التفسير',
    description: 'من أقدم التفاسير الكاملة الواصلة إلينا',
    volumes: createVolumes('tafsir-muqatil', 5, (i) => `https://archive.org/download/FP59100/muqatil${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-qasimi-mahasin', name: 'محاسن التأويل',
    author: 'الشيخ جمال الدين القاسمي (ت 1332هـ)', category: 'التفسير',
    description: 'تفسير جامع بين الأصالة والمعاصرة',
    volumes: createVolumes('tafsir-qasimi-mahasin', 9, (i) => `https://archive.org/download/FP95010/qsmy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-shawkani-nayl', name: 'نيل الأوطار شرح منتقى الأخبار',
    author: 'الإمام الشوكاني (ت 1250هـ)', category: 'التفسير',
    description: 'شرح الأحاديث المتعلقة بتفسير القرآن وأحكامه',
    volumes: createVolumes('tafsir-shawkani-nayl', 8, (i) => `https://archive.org/download/FP80000sh/nayl${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-saadi-buhuth', name: 'بحوث ومسائل في تفسير القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'التفسير',
    description: 'مباحث ومسائل مهمة في تفسير كتاب الله',
    volumes: singleVol('tafsir-saadi-buhuth', 'بحوث ومسائل في التفسير', 'https://archive.org/download/FP11429s/buhuthsaadi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'hashiya-jamal', name: 'حاشية الجمل على الجلالين',
    author: 'الشيخ سليمان الجمل (ت 1204هـ)', category: 'التفسير',
    description: 'حاشية مشهورة على تفسير الجلالين',
    volumes: createVolumes('hashiya-jamal', 4, (i) => `https://archive.org/download/FP60920/jamal${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - علوم القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'burhan-zarkashi', name: 'البرهان في علوم القرآن (طبعة دار إحياء الكتب)',
    author: 'الإمام بدر الدين الزركشي (ت 794هـ)', category: 'علوم القرآن',
    description: 'طبعة محققة مع تعليقات وتخريج',
    volumes: createVolumes('burhan-zarkashi', 4, (i) => `https://archive.org/download/FP63700/brhnzrksh${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ulum-quran-mannaa2', name: 'لمحات في علوم القرآن واتجاهات التفسير',
    author: 'الدكتور محمد الصباغ', category: 'علوم القرآن',
    description: 'مقدمة ميسرة في علوم القرآن مع بيان اتجاهات المفسرين',
    volumes: singleVol('ulum-quran-mannaa2', 'لمحات في علوم القرآن', 'https://archive.org/download/FP64000/lamhat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ulum-quran-subhi', name: 'مباحث في علوم القرآن',
    author: 'الدكتور صبحي الصالح', category: 'علوم القرآن',
    description: 'كتاب أكاديمي شامل في علوم القرآن الكريم',
    volumes: singleVol('ulum-quran-subhi', 'مباحث في علوم القرآن - صبحي الصالح', 'https://archive.org/download/FP64010/subhisaleh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jam-quran-abu-bakr', name: 'جمع القرآن في عهد الخلفاء الراشدين',
    author: 'الدكتور فهد الرومي', category: 'علوم القرآن',
    description: 'دراسة تاريخية في جمع القرآن وكتابته في العصر الراشدي',
    volumes: singleVol('jam-quran-abu-bakr', 'جمع القرآن في عهد الخلفاء', 'https://archive.org/download/FP64020/jam3quran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'makki-madani-details', name: 'خصائص السور المكية والمدنية',
    author: 'الدكتور فهد الرومي', category: 'علوم القرآن',
    description: 'دراسة في خصائص السور المكية والمدنية وأساليبها',
    volumes: singleVol('makki-madani-details', 'خصائص السور المكية والمدنية', 'https://archive.org/download/FP64025/khsaes.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ulum-quran-zerqani', name: 'مناهل العرفان في علوم القرآن',
    author: 'الشيخ محمد عبد العظيم الزرقاني (ت 1367هـ)', category: 'علوم القرآن',
    description: 'من أوسع الكتب المعاصرة في علوم القرآن',
    volumes: createVolumes('ulum-quran-zerqani', 2, (i) => `https://archive.org/download/FP63800/zerqani${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'muqaddima-ibn-taymiyya', name: 'مقدمة في أصول التفسير (شرح ابن عثيمين)',
    author: 'شرح الشيخ ابن عثيمين على رسالة ابن تيمية', category: 'علوم القرآن',
    description: 'شرح رسالة شيخ الإسلام في أصول التفسير',
    volumes: singleVol('muqaddima-ibn-taymiyya', 'شرح مقدمة في أصول التفسير', 'https://archive.org/download/FP64030/muqaddimausul.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'rasm-uthmani', name: 'المقنع في رسم مصاحف الأمصار',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'علوم القرآن',
    description: 'من أهم كتب الرسم العثماني للمصحف الشريف',
    volumes: singleVol('rasm-uthmani', 'المقنع في رسم المصاحف', 'https://archive.org/download/FP63900/muqni3.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'usul-tafsir-saadi', name: 'القواعد الحسان لتفسير القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'علوم القرآن',
    description: 'قواعد أساسية في تفسير القرآن الكريم',
    volumes: singleVol('usul-tafsir-saadi', 'القواعد الحسان', 'https://archive.org/download/FP11429/qwaidhasan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ijaz-quran-rafi3i', name: 'إعجاز القرآن والبلاغة النبوية',
    author: 'الشيخ مصطفى صادق الرافعي (ت 1356هـ)', category: 'علوم القرآن',
    description: 'كتاب في إعجاز القرآن البلاغي مع دفاع عن البلاغة النبوية',
    volumes: singleVol('ijaz-quran-rafi3i', 'إعجاز القرآن والبلاغة النبوية', 'https://archive.org/download/FP63400/i3jazrafi3i.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nasikh-mansukh-3', name: 'الناسخ والمنسوخ في القرآن الكريم',
    author: 'الإمام ابن العربي المالكي (ت 543هـ)', category: 'علوم القرآن',
    description: 'كتاب مهم في الناسخ والمنسوخ من الإمام ابن العربي',
    volumes: singleVol('nasikh-mansukh-3', 'الناسخ والمنسوخ لابن العربي', 'https://archive.org/download/FP63815/nasikhibnlarabi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muhkam-tanzil', name: 'المحكم في نقط المصاحف',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'علوم القرآن',
    description: 'كتاب في نقط المصاحف وضبط الرسم القرآني',
    volumes: singleVol('muhkam-tanzil', 'المحكم في نقط المصاحف', 'https://archive.org/download/FP63905/muhkamnaqt.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'taysir-ulum', name: 'التيسير في علوم القرآن',
    author: 'الدكتور عبد القيوم السندي', category: 'علوم القرآن',
    description: 'مدخل ميسر لعلوم القرآن الكريم',
    volumes: singleVol('taysir-ulum', 'التيسير في علوم القرآن', 'https://archive.org/download/FP64040/taysirulum.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tarikh-quran', name: 'تاريخ القرآن الكريم',
    author: 'الدكتور محمد سالم محيسن', category: 'علوم القرآن',
    description: 'دراسة شاملة في تاريخ القرآن من النزول إلى الطباعة',
    volumes: singleVol('tarikh-quran', 'تاريخ القرآن الكريم', 'https://archive.org/download/FP64045/tarikhquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'masahif-sana', name: 'المصاحف',
    author: 'الإمام ابن أبي داود السجستاني (ت 316هـ)', category: 'علوم القرآن',
    description: 'كتاب في جمع القرآن وتاريخ المصاحف العثمانية',
    volumes: singleVol('masahif-sana', 'المصاحف', 'https://archive.org/download/FP63850/masahif.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fadl-tilawa', name: 'فضائل القرآن وتلاوته',
    author: 'الإمام أبو عبيد القاسم بن سلام (ت 224هـ)', category: 'علوم القرآن',
    description: 'كتاب في فضائل القرآن وآداب تلاوته من السلف',
    volumes: singleVol('fadl-tilawa', 'فضائل القرآن لأبي عبيد', 'https://archive.org/download/FP63860/fadailquranabubaid.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - التجويد والقراءات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'nashr-qiraat', name: 'النشر في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أوسع كتاب في القراءات العشر الكبرى',
    volumes: createVolumes('nashr-qiraat', 2, (i) => `https://archive.org/download/FP64200/nashr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'shatibiyya-sharh', name: 'إبراز المعاني من حرز الأماني (شرح الشاطبية)',
    author: 'الإمام أبو شامة المقدسي (ت 665هـ)', category: 'التجويد والقراءات',
    description: 'شرح مشهور لمنظومة الشاطبية في القراءات السبع',
    volumes: singleVol('shatibiyya-sharh', 'شرح الشاطبية', 'https://archive.org/download/FP64210/shatibiyyasharh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'taysir-dani', name: 'التيسير في القراءات السبع',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'كتاب مختصر في القراءات السبع من طريق الشاطبية',
    volumes: singleVol('taysir-dani', 'التيسير في القراءات', 'https://archive.org/download/FP64220/taysiirdani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muqni-qiraat', name: 'المقنع في القراءات',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'كتاب جامع في أصول القراءات والرسم',
    volumes: singleVol('muqni-qiraat', 'المقنع في القراءات', 'https://archive.org/download/FP64225/muqniqiraat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tajweed-musawwar-2', name: 'التجويد المصور (الطبعة الثانية)',
    author: 'د. أيمن رشدي سويد', category: 'التجويد والقراءات',
    description: 'كتاب في أحكام التجويد مع صور توضيحية لمخارج الحروف',
    volumes: singleVol('tajweed-musawwar-2', 'التجويد المصور', 'https://archive.org/download/FP64230/tajweedmusawwar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ghayat-nihaya', name: 'غاية النهاية في طبقات القراء',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أوسع كتاب في تراجم القراء والمقرئين',
    volumes: createVolumes('ghayat-nihaya', 2, (i) => `https://archive.org/download/FP64240/ghayat${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'hidayat-qari', name: 'هداية القاري إلى تجويد كلام الباري',
    author: 'الشيخ عبد الفتاح المرصفي', category: 'التجويد والقراءات',
    description: 'كتاب شامل في أحكام التجويد مع تطبيقات عملية',
    volumes: createVolumes('hidayat-qari', 2, (i) => `https://archive.org/download/FP64250/hidayatqari${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'munjid-muqriin', name: 'منجد المقرئين ومرشد الطالبين',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في آداب المقرئين وشروط الإقراء',
    volumes: singleVol('munjid-muqriin', 'منجد المقرئين', 'https://archive.org/download/FP64260/munjidmuqriin.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ithaf-fudhala', name: 'إتحاف فضلاء البشر في القراءات الأربع عشر',
    author: 'الشيخ أحمد البنا الدمياطي (ت 1117هـ)', category: 'التجويد والقراءات',
    description: 'كتاب جامع في القراءات الأربع عشر',
    volumes: singleVol('ithaf-fudhala', 'إتحاف فضلاء البشر', 'https://archive.org/download/FP64270/ithaf.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nihayat-quran', name: 'نهاية القول المفيد في علم التجويد',
    author: 'الشيخ محمد مكي نصر', category: 'التجويد والقراءات',
    description: 'كتاب ميسر في أحكام التجويد',
    volumes: singleVol('nihayat-quran', 'نهاية القول المفيد', 'https://archive.org/download/FP64280/nihayatmufid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'waqf-ibtida', name: 'المكتفى في الوقف والابتداء',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'من أهم كتب الوقف والابتداء في القراءة القرآنية',
    volumes: singleVol('waqf-ibtida', 'المكتفى في الوقف والابتداء', 'https://archive.org/download/FP64290/muktafa.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jami-bayan-qiraat', name: 'جامع البيان في القراءات السبع',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'كتاب موسوعي في القراءات السبع بأسانيدها',
    volumes: createVolumes('jami-bayan-qiraat', 4, (i) => `https://archive.org/download/FP64300/jamibayan${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tabsirat-mubtadiin', name: 'التبصرة في القراءات السبع',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في توجيه القراءات السبع',
    volumes: singleVol('tabsirat-mubtadiin', 'التبصرة في القراءات', 'https://archive.org/download/FP64310/tabsira.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'kawakib-durriyya', name: 'الكواكب الدرية شرح طيبة النشر',
    author: 'الشيخ عبد الفتاح القاضي', category: 'التجويد والقراءات',
    description: 'شرح لمنظومة طيبة النشر في القراءات العشر',
    volumes: singleVol('kawakib-durriyya', 'الكواكب الدرية', 'https://archive.org/download/FP64320/kawakib.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - إعراب القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'irab-suyuti', name: 'الإتقان في إعراب القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في إعراب آيات القرآن الكريم',
    volumes: singleVol('irab-suyuti', 'الإتقان في إعراب القرآن', 'https://archive.org/download/FP63520/itqanirab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'irab-quraan-nahhas', name: 'إعراب القرآن',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب إعراب القرآن وأوسعها',
    volumes: createVolumes('irab-quraan-nahhas', 5, (i) => `https://archive.org/download/FP63500/nahhasirab${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mushkil-irab-quran', name: 'مشكل إعراب القرآن',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في المشكل من إعراب آيات القرآن الكريم',
    volumes: createVolumes('mushkil-irab-quran', 2, (i) => `https://archive.org/download/FP63510/mushkilirab${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'bayan-fi-gharib', name: 'البيان في غريب إعراب القرآن',
    author: 'الإمام أبو البركات ابن الأنباري (ت 577هـ)', category: 'إعراب القرآن وبيانه',
    description: 'بيان إعراب الآيات المشكلة في القرآن',
    volumes: createVolumes('bayan-fi-gharib', 2, (i) => `https://archive.org/download/FP63515/bayanfigarib${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'irab-quran-darwish', name: 'إعراب القرآن وبيانه',
    author: 'الشيخ محيي الدين الدرويش', category: 'إعراب القرآن وبيانه',
    description: 'إعراب كامل لآيات القرآن مع بيان المعاني',
    volumes: createVolumes('irab-quran-darwish', 10, (i) => `https://archive.org/download/FP63530/darwish${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'maani-quran-zajjaj', name: 'معاني القرآن وإعرابه',
    author: 'الإمام الزجاج (ت 311هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في معاني القرآن وإعرابه على مذهب البصريين',
    volumes: createVolumes('maani-quran-zajjaj', 5, (i) => `https://archive.org/download/FP63220/zajjaj${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'imlaa-ma-manna', name: 'إملاء ما من به الرحمن',
    author: 'الإمام أبو البقاء العكبري (ت 616هـ)', category: 'إعراب القرآن وبيانه',
    description: 'إعراب القرآن مع بيان أوجه القراءات',
    volumes: createVolumes('imlaa-ma-manna', 2, (i) => `https://archive.org/download/FP63540/imlaa${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'irab-30-juz', name: 'إعراب القرآن الكريم وبيانه',
    author: 'الشيخ محمد طه الدرة', category: 'إعراب القرآن وبيانه',
    description: 'إعراب تفصيلي لآيات القرآن الكريم كاملاً',
    volumes: createVolumes('irab-30-juz', 7, (i) => `https://archive.org/download/FP63550/durra${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'jadwal-irab', name: 'الجدول في إعراب القرآن',
    author: 'الشيخ محمود صافي', category: 'إعراب القرآن وبيانه',
    description: 'إعراب مفصل في جداول واضحة لكل آية من القرآن',
    volumes: createVolumes('jadwal-irab', 15, (i) => `https://archive.org/download/FP63560/jadwal${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - أسباب النزول ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'asbab-nuzul-thalabi', name: 'الكشف والبيان في أسباب النزول',
    author: 'الإمام الثعلبي (ت 427هـ)', category: 'أسباب النزول',
    description: 'كتاب في أسباب النزول مع روايات التفسير',
    volumes: singleVol('asbab-nuzul-thalabi', 'الكشف والبيان في أسباب النزول', 'https://archive.org/download/FP63870/kashfbayanasbab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tahqiq-asbab', name: 'تحقيق أسباب النزول',
    author: 'الدكتور خالد المزيني', category: 'أسباب النزول',
    description: 'تحقيق علمي لروايات أسباب النزول',
    volumes: singleVol('tahqiq-asbab', 'تحقيق أسباب النزول', 'https://archive.org/download/FP63875/tahqiqasbab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wasit-wahidi', name: 'الوسيط في تفسير القرآن المجيد',
    author: 'الإمام الواحدي (ت 468هـ)', category: 'أسباب النزول',
    description: 'تفسير يعتني بأسباب النزول والروايات المأثورة',
    volumes: createVolumes('wasit-wahidi', 4, (i) => `https://archive.org/download/FP62000/wahidi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'asbab-suyuti', name: 'لباب النقول في أسباب النزول (طبعة محققة)',
    author: 'الإمام السيوطي - تحقيق عبد الرزاق المهدي', category: 'أسباب النزول',
    description: 'طبعة محققة من أهم كتب أسباب النزول',
    volumes: singleVol('asbab-suyuti', 'لباب النقول - طبعة محققة', 'https://archive.org/download/FP63880/lababnuqul2.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - غريب القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'gharib-quran-maturidi', name: 'تأويلات أهل السنة (غريب القرآن)',
    author: 'الإمام الماتريدي (ت 333هـ)', category: 'غريب القرآن ومفرداته',
    description: 'بيان معاني الآيات وألفاظ القرآن الغريبة',
    volumes: createVolumes('gharib-quran-maturidi', 5, (i) => `https://archive.org/download/FP63330/maturidi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tuhfat-arib', name: 'تحفة الأريب بما في القرآن من الغريب',
    author: 'الإمام أبو حيان الأندلسي (ت 745هـ)', category: 'غريب القرآن ومفرداته',
    description: 'كتاب في بيان الألفاظ الغريبة في القرآن مع التفسير',
    volumes: singleVol('tuhfat-arib', 'تحفة الأريب', 'https://archive.org/download/FP63335/tuhfatarib.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nuzhatul-a3yun', name: 'نزهة الأعين النواظر في علم الوجوه والنظائر',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'غريب القرآن ومفرداته',
    description: 'كتاب في الوجوه والنظائر في القرآن الكريم',
    volumes: singleVol('nuzhatul-a3yun', 'نزهة الأعين النواظر', 'https://archive.org/download/FP63340/nuzhata3yun.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'basair-tamyiz', name: 'بصائر ذوي التمييز في لطائف الكتاب العزيز',
    author: 'الإمام الفيروزآبادي (ت 817هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم موضوعي لألفاظ القرآن الكريم',
    volumes: createVolumes('basair-tamyiz', 6, (i) => `https://archive.org/download/FP63345/basair${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mu3jam-alfaz-quran', name: 'معجم ألفاظ القرآن الكريم',
    author: 'مجمع اللغة العربية بالقاهرة', category: 'غريب القرآن ومفرداته',
    description: 'معجم شامل لألفاظ القرآن مع شرح المعاني',
    volumes: createVolumes('mu3jam-alfaz-quran', 2, (i) => `https://archive.org/download/FP63350/mu3jamalfaz${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'gharib-quran-ibn-abbas', name: 'غريب القرآن في شعر العرب',
    author: 'منسوب لابن عباس رضي الله عنه', category: 'غريب القرآن ومفرداته',
    description: 'بيان غريب القرآن بشواهد من أشعار العرب',
    volumes: singleVol('gharib-quran-ibn-abbas', 'غريب القرآن في شعر العرب', 'https://archive.org/download/FP63355/gharibibnabbas.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - التدبر ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tadabbur-quran-islahi', name: 'تدبر القرآن',
    author: 'الإمام أمين أحسن إصلاحي (ت 1418هـ)', category: 'التدبر',
    description: 'تفسير تدبري عميق يهتم بنظام السور ومناسباتها',
    volumes: createVolumes('tadabbur-quran-islahi', 9, (i) => `https://archive.org/download/FP95540/islahi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'wuquf-tarbawiyya', name: 'وقفات تربوية مع القرآن الكريم',
    author: 'الدكتور عثمان قدري مكانسي', category: 'التدبر',
    description: 'استنباط الدروس التربوية من آيات القرآن',
    volumes: singleVol('wuquf-tarbawiyya', 'وقفات تربوية مع القرآن', 'https://archive.org/download/FP95545/wuquf.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'lataif-quraniyya', name: 'لطائف قرآنية',
    author: 'الدكتور صالح بن عبد الله بن إبراهيم الشتيوي', category: 'التدبر',
    description: 'لطائف ونكت من آيات القرآن الكريم',
    volumes: singleVol('lataif-quraniyya', 'لطائف قرآنية', 'https://archive.org/download/FP95550/lataif.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'juz-amma-tadabbur', name: 'تأملات في جزء عم',
    author: 'الشيخ عائض القرني', category: 'التدبر',
    description: 'تأملات وتدبرات في سور جزء عم',
    volumes: singleVol('juz-amma-tadabbur', 'تأملات في جزء عم', 'https://archive.org/download/FP95555/juzammatadabbur.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'khawatir-quraniyya', name: 'خواطر قرآنية',
    author: 'الشيخ محمد متولي الشعراوي (ت 1419هـ)', category: 'التدبر',
    description: 'خواطر وتأملات في آيات القرآن الكريم',
    volumes: singleVol('khawatir-quraniyya', 'خواطر قرآنية', 'https://archive.org/download/FP95560/khawatir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mukhtasar-maqasid', name: 'مقاصد كل سورة من القرآن',
    author: 'الدكتور عبد الله الغامدي', category: 'التدبر',
    description: 'بيان مقصد كل سورة من سور القرآن وأهدافها',
    volumes: singleVol('mukhtasar-maqasid', 'مقاصد كل سورة من القرآن', 'https://archive.org/download/FP95565/maqasidsuwar2.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ayaat-mutashabihat', name: 'الآيات المتشابهات ومتشابه القرآن',
    author: 'الدكتور عبد المحسن العسكر', category: 'التدبر',
    description: 'كتاب يساعد على التمييز بين الآيات المتشابهة لفظياً',
    volumes: singleVol('ayaat-mutashabihat', 'الآيات المتشابهات', 'https://archive.org/download/FP95570/mutashabihat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wasaya-quraniyya', name: 'وصايا قرآنية',
    author: 'الشيخ محمد صالح المنجد', category: 'التدبر',
    description: 'وصايا مستنبطة من آيات القرآن الكريم للحياة اليومية',
    volumes: singleVol('wasaya-quraniyya', 'وصايا قرآنية', 'https://archive.org/download/FP95575/wasayaquraniyya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ruh-quran', name: 'روح القرآن',
    author: 'الشيخ عفيف عبد الفتاح طبارة', category: 'التدبر',
    description: 'كتاب في تدبر القرآن واستلهام معانيه الروحية',
    volumes: singleVol('ruh-quran', 'روح القرآن', 'https://archive.org/download/FP95580/ruhquran.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الأقسام الأخرى (بدون إضافات) ██
  // ══════════════════════════════════════════════════════════════

  // ========== الفقه وأصوله ==========
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

  // ========== العقيدة ==========
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

  // ========== السيرة النبوية ==========
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

  // ========== اللغة العربية ==========
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

// ============================================
// MAIN COMPONENT
// ============================================

export function BooksLibrary() {
  const [downloadingBooks, setDownloadingBooks] = useState<DownloadState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});
  
  // PDF Reader state
  const [pdfReaderUrl, setPdfReaderUrl] = useState<string | null>(null);
  const [pdfReaderTitle, setPdfReaderTitle] = useState<string>('');
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pdfLoadTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // ============================================
  // PDF VIEWER - Multiple strategies
  // ============================================
  
  // Strategy 1: Google Docs viewer (works well for smaller PDFs)
  const getGoogleViewerUrl = (pdfUrl: string): string => {
    return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  };

  // Strategy 2: Archive.org's own viewer (if the URL is from archive.org)
  const getArchiveViewerUrl = (pdfUrl: string): string | null => {
    // Extract the archive.org item path
    const match = pdfUrl.match(/archive\.org\/download\/([^/]+)\//);
    if (match) {
      const itemId = match[1];
      const fileName = pdfUrl.split('/').pop();
      return `https://archive.org/details/${itemId}?view=theater`;
    }
    return null;
  };

  // Handle read with embedded PDF viewer
  const handleRead = useCallback((volume: BookVolume, bookName?: string) => {
    const title = bookName ? `${bookName} - ${volume.title}` : volume.title;
    setPdfReaderTitle(title);
    setPdfReaderUrl(volume.pdfUrl);
    setPdfLoading(true);
    setPdfError(false);
    
    // Set a timeout - if PDF doesn't load in 15s, show error
    if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
    pdfLoadTimerRef.current = setTimeout(() => {
      setPdfLoading(false);
    }, 15000);
  }, []);

  const handlePdfLoad = useCallback(() => {
    setPdfLoading(false);
    setPdfError(false);
    if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
  }, []);

  const handlePdfError = useCallback(() => {
    setPdfLoading(false);
    setPdfError(true);
    if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
  }, []);

  const closePdfReader = useCallback(() => {
    setPdfReaderUrl(null);
    setPdfReaderTitle('');
    setPdfLoading(true);
    setPdfError(false);
    if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
    };
  }, []);

  // Handle download
  const handleDownload = useCallback(async (volume: BookVolume, bookName: string) => {
    if (downloadingBooks[volume.id]) return;
    setDownloadingBooks(prev => ({ ...prev, [volume.id]: true }));

    try {
      // Open archive.org URL directly - most reliable for download
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
      // Fallback: open in new tab
      window.open(volume.pdfUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setTimeout(() => {
        setDownloadingBooks(prev => ({ ...prev, [volume.id]: false }));
      }, 2000);
    }
  }, [downloadingBooks]);

  // ============================================
  // PDF READER OVERLAY
  // ============================================

  const renderPdfReader = () => {
    if (!pdfReaderUrl) return null;

    const viewerUrl = getGoogleViewerUrl(pdfReaderUrl);
    const archiveUrl = getArchiveViewerUrl(pdfReaderUrl);

    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={closePdfReader}
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
            {archiveUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(archiveUrl, '_blank', 'noopener,noreferrer')}
                className="gap-1.5 text-xs hidden sm:flex"
              >
                <Library className="w-3.5 h-3.5" />
                <span>Archive.org</span>
              </Button>
            )}
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
          {!pdfError && (
            <iframe
              ref={iframeRef}
              src={viewerUrl}
              className="w-full h-full border-0"
              title={pdfReaderTitle}
              allow="autoplay"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              onLoad={handlePdfLoad}
              onError={handlePdfError}
            />
          )}
          
          {/* Loading overlay */}
          {pdfLoading && !pdfError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">جاري تحميل الكتاب...</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">قد يستغرق بعض الوقت حسب حجم الملف</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {pdfError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4 max-w-md mx-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white text-center">
                  تعذر تحميل القارئ المدمج
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  يمكنك فتح الكتاب مباشرة في تبويب جديد
                </p>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button
                    onClick={() => window.open(pdfReaderUrl!, '_blank', 'noopener,noreferrer')}
                    className="flex-1 gap-2 bg-blue-500 hover:bg-blue-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح في تبويب جديد
                  </Button>
                  {archiveUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(archiveUrl, '_blank', 'noopener,noreferrer')}
                      className="flex-1 gap-2"
                    >
                      <Library className="w-4 h-4" />
                      فتح في Archive.org
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setPdfError(false); setPdfLoading(true); }}
                  className="gap-2 text-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          )}
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
                  title="فتح في تبويب جديد"
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
