'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Play, Search, X, BookOpen, Mic2, Heart,
  Sparkles, ChevronDown, ChevronUp, Video, Filter,
  Star, User, ArrowRight, Maximize2, Minimize2,
  BookMarked, GraduationCap, Lightbulb, MessageCircle,
  Scroll, RefreshCw
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type VideoCategory = 
  | 'تفسير القرآن'
  | 'تدبر وتأملات'
  | 'أحكام التلاوة والتجويد'
  | 'علوم القرآن'
  | 'قصص القرآن'
  | 'إعجاز القرآن';

interface QuranVideo {
  id: string;
  youtubeId: string;
  title: string;
  scholar: string;
  category: VideoCategory;
  description?: string;
}

// ============================================
// CATEGORY CONFIG
// ============================================

const CATEGORY_CONFIG: Record<VideoCategory, { icon: any; color: string; bgColor: string; description: string }> = {
  'تفسير القرآن': {
    icon: BookMarked,
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'from-emerald-500 to-teal-600',
    description: 'دروس تفسير القرآن الكريم من علماء أهل السنة'
  },
  'تدبر وتأملات': {
    icon: Lightbulb,
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'from-purple-500 to-fuchsia-600',
    description: 'تدبرات وتأملات في آيات القرآن الكريم'
  },
  'أحكام التلاوة والتجويد': {
    icon: Mic2,
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'from-amber-500 to-orange-600',
    description: 'دروس في أحكام التجويد وتلاوة القرآن الكريم'
  },
  'علوم القرآن': {
    icon: GraduationCap,
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'from-blue-500 to-indigo-600',
    description: 'دروس في علوم القرآن المختلفة'
  },
  'قصص القرآن': {
    icon: Scroll,
    color: 'text-cyan-700 dark:text-cyan-300',
    bgColor: 'from-cyan-500 to-teal-600',
    description: 'قصص الأنبياء والأمم في القرآن الكريم'
  },
  'إعجاز القرآن': {
    icon: Sparkles,
    color: 'text-rose-700 dark:text-rose-300',
    bgColor: 'from-rose-500 to-pink-600',
    description: 'أوجه الإعجاز في القرآن الكريم'
  },
};

// ============================================
// VIDEOS DATABASE - علماء أهل السنة والجماعة الموثوقين فقط
// ============================================

const QURAN_VIDEOS: QuranVideo[] = [
  // ═══ تفسير القرآن ═══
  { id: 'v1', youtubeId: 'dMnVN04zN-0', title: 'تفسير سورة الفاتحة', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير مفصل لسورة الفاتحة أم الكتاب' },
  { id: 'v2', youtubeId: 'g8M3JHU1L0k', title: 'تفسير سورة البقرة - الجزء الأول', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'شرح وتفسير بداية سورة البقرة' },
  { id: 'v3', youtubeId: '7JhEzqEEjwM', title: 'تفسير آية الكرسي', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير أعظم آية في كتاب الله' },
  { id: 'v4', youtubeId: '_1KY1a9SXgU', title: 'تفسير سورة يس', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة يس - قلب القرآن' },
  { id: 'v5', youtubeId: 'OP7e2aeVvfI', title: 'تفسير سورة الرحمن', scholar: 'الشيخ صالح المغامسي', category: 'تفسير القرآن', description: 'تفسير سورة الرحمن وبيان آلاء الله' },
  { id: 'v6', youtubeId: 'QdG9lB0R3L4', title: 'تفسير سورة الكهف', scholar: 'الشيخ صالح المغامسي', category: 'تفسير القرآن', description: 'تفسير سورة الكهف وقصصها العظيمة' },
  { id: 'v7', youtubeId: 'qSqnGBgfQ0E', title: 'تفسير سورة الملك', scholar: 'الشيخ محمد بن صالح العثيمين', category: 'تفسير القرآن', description: 'تفسير سورة الملك - تبارك المانعة' },
  { id: 'v8', youtubeId: 'Gl6iA7MG-sU', title: 'تفسير جزء عمّ', scholar: 'الشيخ عبد الرحمن السعدي', category: 'تفسير القرآن', description: 'تفسير ميسر لجزء عمّ' },
  { id: 'v9', youtubeId: 'F-nL-Gs7Vc4', title: 'تفسير سورة النور', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة النور وأحكامها' },
  { id: 'v10', youtubeId: 'JiUPYISHj3o', title: 'تفسير سورة لقمان', scholar: 'الشيخ صالح المغامسي', category: 'تفسير القرآن', description: 'تفسير سورة لقمان ووصايا لقمان لابنه' },
  { id: 'v11', youtubeId: 'X5KULMj_YrU', title: 'تفسير المعوذتين', scholar: 'الشيخ نبيل العوضي', category: 'تفسير القرآن', description: 'تفسير سورتي الفلق والناس' },
  { id: 'v12', youtubeId: 'GdCqfJHB6n4', title: 'تفسير سورة مريم', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'تفسير سورة مريم وقصة مريم وعيسى عليهما السلام' },
  { id: 'v13', youtubeId: 'O7G0_aYf7VM', title: 'تفسير سورة الحجرات', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الحجرات - سورة الأخلاق والآداب' },
  { id: 'v14', youtubeId: 'hTiH6nYYpwA', title: 'تفسير خواتيم سورة البقرة', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير آخر آيتين من سورة البقرة' },
  { id: 'v15', youtubeId: 'q5MYaWDbKIU', title: 'تفسير سورة الواقعة', scholar: 'الشيخ صالح المغامسي', category: 'تفسير القرآن', description: 'تفسير سورة الواقعة وأصناف الناس يوم القيامة' },

  // ═══ تدبر وتأملات ═══
  { id: 'v20', youtubeId: 'RfBiIWkLTOA', title: 'تأملات في سورة يوسف', scholar: 'الشيخ صالح المغامسي', category: 'تدبر وتأملات', description: 'تأملات وعبر من قصة يوسف عليه السلام' },
  { id: 'v21', youtubeId: 'KLwVN4Sh-XY', title: 'وقفات مع آيات الصبر في القرآن', scholar: 'الشيخ محمد العريفي', category: 'تدبر وتأملات', description: 'تدبر آيات الصبر في القرآن الكريم' },
  { id: 'v22', youtubeId: 'HfL2Ky2a1AI', title: 'تأملات قرآنية مؤثرة', scholar: 'الشيخ إبراهيم الدويش', category: 'تدبر وتأملات', description: 'تأملات ووقفات مع آيات من القرآن' },
  { id: 'v23', youtubeId: 'vXl1g5PnAQA', title: 'لطائف قرآنية', scholar: 'الشيخ عبد المحسن الأحمد', category: 'تدبر وتأملات', description: 'لطائف ونكت من آيات القرآن الكريم' },
  { id: 'v24', youtubeId: 'x1jZlYcH5oE', title: 'تدبر آيات الرحمة', scholar: 'الشيخ محمد حسان', category: 'تدبر وتأملات', description: 'وقفات مع آيات رحمة الله في القرآن' },
  { id: 'v25', youtubeId: 'CXRfVFU1D1U', title: 'تأملات في سورة الكهف', scholar: 'الشيخ عمر عبد الكافي', category: 'تدبر وتأملات', description: 'تأملات عميقة في قصص سورة الكهف' },
  { id: 'v26', youtubeId: 'RvY9JvFX-ao', title: 'عظمة القرآن الكريم', scholar: 'الشيخ خالد الراشد', category: 'تدبر وتأملات', description: 'بيان عظمة القرآن وأثره في القلوب' },
  { id: 'v27', youtubeId: 'TfVcbMjHu9k', title: 'وقفات مع آيات التوبة', scholar: 'الشيخ نبيل العوضي', category: 'تدبر وتأملات', description: 'تدبر آيات التوبة والاستغفار' },
  { id: 'v28', youtubeId: 'rE0mPv_m3bk', title: 'تأملات في آيات الدعاء', scholar: 'الشيخ صالح المغامسي', category: 'تدبر وتأملات', description: 'تدبر أدعية القرآن الكريم' },
  { id: 'v29', youtubeId: '2S3ql90V62s', title: 'تدبر آيات الجنة والنار', scholar: 'الشيخ محمد حسان', category: 'تدبر وتأملات', description: 'وقفات مع وصف الجنة والنار في القرآن' },
  { id: 'v30', youtubeId: 'yT1_0fKUvTs', title: 'أسرار في ترتيب سور القرآن', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'بيان الحكم والأسرار في ترتيب سور القرآن' },

  // ═══ أحكام التلاوة والتجويد ═══
  { id: 'v40', youtubeId: 'gEH3MHQRK6g', title: 'أحكام النون الساكنة والتنوين', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح مفصل لأحكام النون الساكنة والتنوين' },
  { id: 'v41', youtubeId: '5qLsRkHC3yw', title: 'مخارج الحروف العربية', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح مخارج الحروف وصفاتها' },
  { id: 'v42', youtubeId: '6kL7LKCPhgg', title: 'أحكام المد في التجويد', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح أنواع المد وأحكامه' },
  { id: 'v43', youtubeId: 'a5sB4k4u3Bk', title: 'صفات الحروف', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح صفات الحروف العربية للتجويد' },
  { id: 'v44', youtubeId: 'VcB-sS3PGUQ', title: 'أحكام الراء في القرآن', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'أحكام تفخيم وترقيق الراء' },
  { id: 'v45', youtubeId: 'u0Lsr0e3qSQ', title: 'أحكام اللام الشمسية والقمرية', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'الفرق بين اللام الشمسية والقمرية' },
  { id: 'v46', youtubeId: 'pHjFQ24cN64', title: 'كيفية حفظ القرآن الكريم', scholar: 'الشيخ عبد المحسن القاسم', category: 'أحكام التلاوة والتجويد', description: 'طريقة عملية لحفظ القرآن الكريم' },
  { id: 'v47', youtubeId: 'Wo0H6nE8Ihk', title: 'أحكام الوقف والابتداء', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح أحكام الوقف والابتداء في التلاوة' },
  { id: 'v48', youtubeId: 'VZbxE7ESQHE', title: 'آداب تلاوة القرآن الكريم', scholar: 'الشيخ عبد الرزاق البدر', category: 'أحكام التلاوة والتجويد', description: 'آداب تلاوة القرآن الظاهرة والباطنة' },

  // ═══ علوم القرآن ═══
  { id: 'v50', youtubeId: '4LDSGz7GkN8', title: 'مقدمة في علوم القرآن', scholar: 'الشيخ عبد الكريم الخضير', category: 'علوم القرآن', description: 'مدخل شامل لعلوم القرآن الكريم' },
  { id: 'v51', youtubeId: 'BdDABx7WS6M', title: 'الناسخ والمنسوخ في القرآن', scholar: 'الشيخ صالح الفوزان', category: 'علوم القرآن', description: 'بيان الناسخ والمنسوخ وأحكامه' },
  { id: 'v52', youtubeId: 'w_eBiIy_0hk', title: 'المكي والمدني في القرآن', scholar: 'الشيخ مساعد الطيار', category: 'علوم القرآن', description: 'الفرق بين المكي والمدني وخصائص كل منهما' },
  { id: 'v53', youtubeId: 'Y7mP0hR-aRQ', title: 'جمع القرآن وكتابته', scholar: 'الشيخ عبد الكريم الخضير', category: 'علوم القرآن', description: 'تاريخ جمع القرآن وكتابته في المصاحف' },
  { id: 'v54', youtubeId: 'kGVb0VBLVwY', title: 'أصول التفسير', scholar: 'الشيخ مساعد الطيار', category: 'علوم القرآن', description: 'القواعد والأصول المعتمدة في تفسير القرآن' },
  { id: 'v55', youtubeId: 'bI2AE9J-pYo', title: 'إعجاز القرآن البياني', scholar: 'الشيخ فاضل السامرائي', category: 'علوم القرآن', description: 'بيان الإعجاز البياني واللغوي في القرآن' },
  { id: 'v56', youtubeId: 'G5c9gVWQlbQ', title: 'فضائل سور القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'علوم القرآن', description: 'فضائل السور والآيات الواردة في السنة' },
  { id: 'v57', youtubeId: 'lFRlbM_xIYE', title: 'المحكم والمتشابه في القرآن', scholar: 'الشيخ صالح الفوزان', category: 'علوم القرآن', description: 'بيان المحكم والمتشابه وموقف أهل السنة منه' },

  // ═══ قصص القرآن ═══
  { id: 'v60', youtubeId: 'nUVJ4FG2b-k', title: 'قصة آدم عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة خلق آدم عليه السلام كما وردت في القرآن' },
  { id: 'v61', youtubeId: 'cjl5GQ6OLrU', title: 'قصة نوح عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة نوح عليه السلام والطوفان العظيم' },
  { id: 'v62', youtubeId: 'kxPGj5qg6E8', title: 'قصة إبراهيم عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة خليل الرحمن إبراهيم عليه السلام' },
  { id: 'v63', youtubeId: 'gq-4xgIl3EM', title: 'قصة موسى عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة كليم الله موسى عليه السلام' },
  { id: 'v64', youtubeId: 'MFzBSHgWfHo', title: 'قصة يوسف عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'أحسن القصص - قصة يوسف عليه السلام' },
  { id: 'v65', youtubeId: 'a7z5OHWyRDs', title: 'قصة أصحاب الكهف', scholar: 'الشيخ عمر عبد الكافي', category: 'قصص القرآن', description: 'قصة أصحاب الكهف والعبر المستفادة' },
  { id: 'v66', youtubeId: 'TI6LLasMXKg', title: 'قصة ذي القرنين', scholar: 'الشيخ صالح المغامسي', category: 'قصص القرآن', description: 'قصة ذي القرنين ويأجوج ومأجوج' },
  { id: 'v67', youtubeId: 'aNw8CtlGvJ8', title: 'قصة داود وسليمان عليهما السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة داود وسليمان في القرآن' },
  { id: 'v68', youtubeId: 'x8dlVPv3R7E', title: 'قصة مريم وعيسى عليهما السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة مريم وعيسى عليهما السلام في القرآن' },

  // ═══ إعجاز القرآن ═══
  { id: 'v70', youtubeId: 'W4d7hKhRnN4', title: 'إعجاز القرآن العلمي', scholar: 'الدكتور زغلول النجار', category: 'إعجاز القرآن', description: 'أوجه الإعجاز العلمي في القرآن الكريم' },
  { id: 'v71', youtubeId: '3HN_p7O2zGQ', title: 'الإعجاز البلاغي في القرآن', scholar: 'الشيخ فاضل السامرائي', category: 'إعجاز القرآن', description: 'بيان الإعجاز البلاغي واللغوي' },
  { id: 'v72', youtubeId: 'YuBnPCMKqx8', title: 'الإعجاز العددي في القرآن', scholar: 'الدكتور زغلول النجار', category: 'إعجاز القرآن', description: 'أمثلة على الإعجاز العددي في القرآن' },
  { id: 'v73', youtubeId: 'HXkGDxe9dYA', title: 'لمسات بيانية في القرآن', scholar: 'الشيخ فاضل السامرائي', category: 'إعجاز القرآن', description: 'لمسات بيانية ولطائف بلاغية في آيات القرآن' },
  { id: 'v74', youtubeId: 'L1zb3Q67jug', title: 'لماذا لا يستطيعون الإتيان بمثل القرآن', scholar: 'الشيخ محمد حسان', category: 'إعجاز القرآن', description: 'بيان تحدي القرآن للبشرية' },
  { id: 'v75', youtubeId: 'V7xcJN6JL2w', title: 'الفرق بين الكلمات المتشابهة في القرآن', scholar: 'الشيخ فاضل السامرائي', category: 'إعجاز القرآن', description: 'بيان الفروق الدقيقة بين الألفاظ المتشابهة' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export function QuranVideos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [activeVideo, setActiveVideo] = useState<QuranVideo | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState<string | 'all'>('all');
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Get unique scholars
  const scholars = useMemo(() => {
    const set = new Set(QURAN_VIDEOS.map(v => v.scholar));
    return Array.from(set).sort();
  }, []);

  // Filter videos
  const filteredVideos = useMemo(() => {
    let result = QURAN_VIDEOS;
    if (selectedCategory !== 'all') {
      result = result.filter(v => v.category === selectedCategory);
    }
    if (selectedScholar !== 'all') {
      result = result.filter(v => v.scholar === selectedScholar);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        v => v.title.toLowerCase().includes(query) ||
          v.scholar.toLowerCase().includes(query) ||
          (v.description && v.description.toLowerCase().includes(query))
      );
    }
    return result;
  }, [searchQuery, selectedCategory, selectedScholar]);

  // Group by category
  const videosByCategory = useMemo(() => {
    const categories = Object.keys(CATEGORY_CONFIG) as VideoCategory[];
    const grouped: Record<VideoCategory, QuranVideo[]> = {} as any;
    categories.forEach(cat => {
      grouped[cat] = filteredVideos.filter(v => v.category === cat);
    });
    return grouped;
  }, [filteredVideos]);

  const categories = Object.keys(CATEGORY_CONFIG) as VideoCategory[];
  const getCategoryCount = (cat: VideoCategory) => QURAN_VIDEOS.filter(v => v.category === cat).length;

  // Play video
  const playVideo = useCallback((video: QuranVideo) => {
    setActiveVideo(video);
    setIsFullscreen(false);
    // Scroll to top of video container
    setTimeout(() => {
      videoContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
    setIsFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Get embed URL - youtube-nocookie.com for privacy, playsinline for in-app play
  const getEmbedUrl = (youtubeId: string): string => {
    const params = new URLSearchParams({
      playsinline: '1',
      modestbranding: '1',
      rel: '0',
      autoplay: '1',
      controls: '1',
      fs: '0',
      iv_load_policy: '3',
    });
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
  };

  // ============================================
  // VIDEO PLAYER
  // ============================================

  const renderVideoPlayer = () => {
    if (!activeVideo) return null;

    return (
      <div 
        ref={videoContainerRef}
        className={`${isFullscreen ? 'fixed inset-0 z-[100] bg-black flex flex-col' : 'mb-6'}`}
      >
        {/* Player Header */}
        <div className={`flex items-center justify-between p-3 ${
          isFullscreen 
            ? 'bg-black/90 border-b border-white/10' 
            : 'bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-2xl'
        }`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeVideo}
              className="gap-1.5 text-white hover:bg-white/10 flex-shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">إغلاق</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white text-sm truncate">{activeVideo.title}</h3>
              <p className="text-white/60 text-xs truncate">{activeVideo.scholar}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/10 flex-shrink-0"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Video iframe - embedded inside the site */}
        <div className={`relative bg-black ${
          isFullscreen ? 'flex-1' : 'aspect-video rounded-b-2xl overflow-hidden'
        }`}>
          <iframe
            src={getEmbedUrl(activeVideo.youtubeId)}
            className="w-full h-full border-0"
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; playsinline"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
            allowFullScreen={false}
          />
        </div>

        {/* Video Info (non-fullscreen only) */}
        {!isFullscreen && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mt-3 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{activeVideo.scholar}</p>
                <Badge className={`text-[10px] bg-gradient-to-r ${CATEGORY_CONFIG[activeVideo.category].bgColor} text-white border-0`}>
                  {activeVideo.category}
                </Badge>
              </div>
            </div>
            {activeVideo.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{activeVideo.description}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // VIDEO CARD
  // ============================================

  const renderVideoCard = (video: QuranVideo) => {
    const isActive = activeVideo?.id === video.id;
    const catInfo = CATEGORY_CONFIG[video.category];

    return (
      <Card
        key={video.id}
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${
          isActive ? 'ring-2 ring-emerald-500 shadow-emerald-100 dark:shadow-emerald-900/30' : ''
        }`}
        onClick={() => playVideo(video)}
      >
        <CardContent className="p-0">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 text-emerald-600 mr-[-2px]" fill="currentColor" />
              </div>
            </div>
            {/* Category badge */}
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r ${catInfo.bgColor} text-white text-[10px] font-medium shadow-lg`}>
              {video.category}
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1 leading-tight">
              {video.title}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{video.scholar}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-bl from-rose-500 via-rose-600 to-pink-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">المقاطع القرآنية المرئية</h2>
            <p className="text-rose-100 text-sm">دروس ومقاطع من علماء أهل السنة والجماعة الموثوقين</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>{QURAN_VIDEOS.length} مقطع</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{scholars.length} عالم</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{categories.length} تصنيف</span>
          </div>
        </div>
      </div>

      {/* Active Video Player */}
      {renderVideoPlayer()}

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="ابحث بالعنوان أو اسم العالم..."
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

      {/* Filters Row */}
      <div className="space-y-3">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={`rounded-full px-4 py-1.5 h-auto text-sm ${
              selectedCategory === 'all'
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            الكل ({QURAN_VIDEOS.length})
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
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {cat} ({count})
              </Button>
            );
          })}
        </div>

        {/* Scholar Filter */}
        <div className="flex justify-center">
          <select
            value={selectedScholar}
            onChange={(e) => setSelectedScholar(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm min-w-[200px]"
          >
            <option value="all">جميع العلماء</option>
            {scholars.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all' || selectedScholar !== 'all') && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          عرض {filteredVideos.length} مقطع
        </p>
      )}

      {/* Videos Grid by Category */}
      {selectedCategory === 'all' && !searchQuery && selectedScholar === 'all' ? (
        categories.map(category => {
          const categoryVideos = videosByCategory[category];
          if (!categoryVideos || categoryVideos.length === 0) return null;
          const catInfo = CATEGORY_CONFIG[category];
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
                <Badge variant="outline" className="text-xs">{categoryVideos.length} مقطع</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryVideos.map(video => renderVideoCard(video))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVideos.map(video => renderVideoCard(video))}
        </div>
      )}

      {/* No results */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">لم يتم العثور على مقاطع مطابقة</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">جرب كلمات بحث مختلفة</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
          جميع المقاطع من علماء أهل السنة والجماعة الموثوقين فقط
        </p>
      </div>
    </div>
  );
}
