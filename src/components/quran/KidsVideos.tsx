'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Play, Search, X, BookOpen,
  Sparkles, ChevronDown, ChevronUp, Video, Filter,
  Star, User, Maximize2, Minimize2,
  Scroll, RefreshCw, AlertCircle, Baby, Heart, Tv
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type KidsCategory =
  | 'قصص الأنبياء'
  | 'قصص القرآن'
  | 'قصص الحيوان في القرآن'
  | 'قصص الصحابة'
  | 'أناشيد إسلامية بدون إيقاع'
  | 'تعليم القرآن للأطفال'
  | 'آداب إسلامية';

interface KidsVideo {
  id: string;
  youtubeId: string;
  title: string;
  source: string;
  category: KidsCategory;
  description?: string;
}

// ============================================
// CATEGORY CONFIG
// ============================================

const KIDS_CATEGORY_CONFIG: Record<KidsCategory, { icon: any; color: string; bgColor: string; description: string; emoji: string }> = {
  'قصص الأنبياء': {
    icon: BookOpen,
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'from-emerald-500 to-teal-600',
    description: 'قصص الأنبياء والرسل للأطفال',
    emoji: '🌟',
  },
  'قصص القرآن': {
    icon: Scroll,
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'from-blue-500 to-indigo-600',
    description: 'قصص من القرآن الكريم للأطفال',
    emoji: '📖',
  },
  'قصص الحيوان في القرآن': {
    icon: Heart,
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'from-amber-500 to-orange-600',
    description: 'قصص الحيوانات المذكورة في القرآن',
    emoji: '🐪',
  },
  'قصص الصحابة': {
    icon: Star,
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'from-purple-500 to-fuchsia-600',
    description: 'قصص الصحابة والتابعين للأطفال',
    emoji: '⭐',
  },
  'أناشيد إسلامية بدون إيقاع': {
    icon: Sparkles,
    color: 'text-rose-700 dark:text-rose-300',
    bgColor: 'from-rose-500 to-pink-600',
    description: 'أناشيد إسلامية بدون موسيقى',
    emoji: '🎤',
  },
  'تعليم القرآن للأطفال': {
    icon: Tv,
    color: 'text-cyan-700 dark:text-cyan-300',
    bgColor: 'from-cyan-500 to-teal-600',
    description: 'تعليم القرآن والتجويد للصغار',
    emoji: '📚',
  },
  'آداب إسلامية': {
    icon: Baby,
    color: 'text-lime-700 dark:text-lime-300',
    bgColor: 'from-lime-500 to-green-600',
    description: 'تعليم الآداب الإسلامية للأطفال',
    emoji: '🌿',
  },
};

// ============================================
// KIDS VIDEOS DATABASE
// جميع المقاطع بدون موسيقى أو مخالفات شرعية
// ============================================

const KIDS_VIDEOS: KidsVideo[] = [
  // ═══════════════════════════════════════════
  // قصص الأنبياء
  // ═══════════════════════════════════════════

  // نبيل العوضي - قصص الأنبياء (سلسلة كاملة)
  { id: 'k1', youtubeId: 'pB7uZzu2dLI', title: 'قصة بداية الخلق وخلق آدم عليه السلام', source: 'الشيخ نبيل العوضي', category: 'قصص الأنبياء', description: 'كيف خلق الله العالم وخلق آدم عليه السلام' },
  { id: 'k2', youtubeId: 'tLP0ZUwf6s0', title: 'قصة نبي الله إدريس عليه السلام', source: 'الشيخ نبيل العوضي', category: 'قصص الأنبياء', description: 'قصة إدريس عليه السلام ولماذا رفعته الملائكة' },
  { id: 'k3', youtubeId: 'Aw4FLH5c6dM', title: 'قصة كليم الله موسى عليه السلام - الجزء الأول', source: 'الشيخ نبيل العوضي', category: 'قصص الأنبياء', description: 'قصة موسى عليه السلام كما وردت في القرآن' },
  { id: 'k4', youtubeId: 'cfR7wL_YQWE', title: 'قصة المائدة - قصص الأنبياء', source: 'الشيخ نبيل العوضي', category: 'قصص الأنبياء', description: 'قصة المائدة كما وردت في القرآن الكريم' },
  { id: 'k5', youtubeId: 'zDzsg7KsdOM', title: 'قصص من حياة الأنبياء ومعجزاتهم', source: 'الشيخ نبيل العوضي', category: 'قصص الأنبياء', description: 'قصص من حياة الأنبياء وكيف أهلك الله الأقوام' },
  { id: 'k6', youtubeId: 'NgEZ-YZtaVI', title: 'قصة إلياس واليسع وذو الكفل', source: 'الشيخ نبيل العوضي', category: 'قصص الأنبياء', description: 'أنبياء بني إسرائيل' },

  // IQRA Cartoon - قصص الأنبياء (رسوم متحركة للأطفال - بدون موسيقى)
  { id: 'k7', youtubeId: 'fzOBRSvmSC8', title: 'قصة آدم عليه السلام - كرتون للأطفال', source: 'IQRA Cartoon', category: 'قصص الأنبياء', description: 'قصة آدم عليه السلام بالرسوم المتحركة' },
  { id: 'k8', youtubeId: 'l7s8R9ugb98', title: 'قصة عيسى عليه السلام - كرتون للأطفال', source: 'IQRA Cartoon', category: 'قصص الأنبياء', description: 'قصة عيسى عليه السلام بالرسوم المتحركة' },
  { id: 'k9', youtubeId: '2c48V4fSqco', title: 'قصة يونس عليه السلام - كرتون للأطفال', source: 'IQRA Cartoon', category: 'قصص الأنبياء', description: 'قصة يونس عليه السلام في بطن الحوت' },
  { id: 'k10', youtubeId: 'ZPQzoLb9BAw', title: 'قصة إبراهيم عليه السلام - العبد الشاكر', source: 'IQRA Cartoon', category: 'قصص الأنبياء', description: 'قصة إبراهيم عليه السلام في الشكر والامتنان' },
  { id: 'k11', youtubeId: 'qh652UtMDQw', title: 'قصة إبراهيم عليه السلام - بئر زمزم', source: 'IQRA Cartoon', category: 'قصص الأنبياء', description: 'قصة هاجر وإسماعيل وبئر زمزم' },
  { id: 'k12', youtubeId: 'FWTQnAoEBkA', title: 'قصة النبي محمد ﷺ للأطفال', source: 'Zillnoorain Kids', category: 'قصص الأنبياء', description: 'سيرة النبي محمد ﷺ بأسلوب مبسط للأطفال' },
  { id: 'k13', youtubeId: 'O4ZTLQKsTpA', title: 'قصص الأنبياء من القرآن - تجميع', source: 'IQRA Cartoon', category: 'قصص الأنبياء', description: 'تجميع قصص الأنبياء من القرآن الكريم' },

  // نبيل العوضي - الموسم الثاني
  { id: 'k14', youtubeId: '2lyl2XOMhqs', title: 'قصة يوشع وداوود وسليمان وزكريا ويحيى', source: 'الشيخ نبيل العوضي', category: 'قصص الأنبياء', description: 'سلسلة قصص الأنبياء - عدة أنبياء' },

  // هل تعلم - قصص الأنبياء بدون موسيقى
  { id: 'k15', youtubeId: 'iGuP9-9ZN-4', title: 'قصة يونس عليه السلام - للأطفال بدون موسيقى', source: 'قصص الأنبياء للأطفال', category: 'قصص الأنبياء', description: 'قصة يونس عليه السلام بأسلوب مبسط للأطفال' },
  { id: 'k16', youtubeId: 'UwR0egTQwsQ', title: 'قصة إدريس عليه السلام - للأطفال بدون موسيقى', source: 'أولادنا الإسلامية', category: 'قصص الأنبياء', description: 'قصة إدريس عليه السلام للأطفال' },
  { id: 'k17', youtubeId: 'zAXRZpDyr8Q', title: 'قصة نوح عليه السلام - للأطفال', source: 'قصص الأنبياء للأطفال', category: 'قصص الأنبياء', description: 'قصة نبي الله نوح عليه السلام والطوفان' },

  // ═══════════════════════════════════════════
  // قصص القرآن
  // ═══════════════════════════════════════════

  // قصص الإنسان في القرآن - Cedars Art (بدون موسيقى)
  { id: 'k18', youtubeId: 'fyHqHof8-xU', title: 'قصة أصحاب الأخدود - الجزء الأول', source: 'قصص الإنسان في القرآن', category: 'قصص القرآن', description: 'قصة أصحاب الأخدود كما وردت في القرآن' },
  { id: 'k19', youtubeId: 'qE48KorARKA', title: 'قصة أصحاب الأخدود - الجزء الثاني', source: 'قصص الإنسان في القرآن', category: 'قصص القرآن', description: 'تكملة قصة أصحاب الأخدود' },
  { id: 'k20', youtubeId: 'hvm2ThLwYko', title: 'قصة ذو القرنين - الجزء الأول', source: 'قصص الإنسان في القرآن', category: 'قصص القرآن', description: 'قصة ذو القرنين ويأجوج ومأجوج' },
  { id: 'k21', youtubeId: 'Gt15cpRQ9iI', title: 'قصة أصحاب الجنة - الجزء الثالث', source: 'قصص الإنسان في القرآن', category: 'قصص القرآن', description: 'قصة أصحاب الجنة من سورة القلم' },
  { id: 'k22', youtubeId: 'aebLGAcdsKE', title: 'قصة النمرود - الجزء الثاني', source: 'قصص الإنسان في القرآن', category: 'قصص القرآن', description: 'قصة النمرود الذي حاج إبراهيم في ربه' },
  { id: 'k23', youtubeId: 'InmLzPOjz5E', title: 'قصة السامري - الجزء الثاني', source: 'قصص الإنسان في القرآن', category: 'قصص القرآن', description: 'قصة السامري الذي أضل بني إسرائيل' },
  { id: 'k24', youtubeId: 'qGXSkwdVReg', title: 'قصة السامري - الجزء الثالث', source: 'قصص الإنسان في القرآن', category: 'قصص القرآن', description: 'تتمة قصة السامري وعاقبته' },

  // قصص الآيات في القرآن
  { id: 'k25', youtubeId: 'lttUGHte4mY', title: 'قصة حاطب بن أبي بلتعة - الجزء الأول', source: 'قصص الآيات في القرآن', category: 'قصص القرآن', description: 'من سلسلة قصص الآيات في القرآن' },
  { id: 'k26', youtubeId: 'FUc3eVoHrWg', title: 'قصة حاطب بن أبي بلتعة - الجزء الثاني', source: 'قصص الآيات في القرآن', category: 'قصص القرآن', description: 'تكملة قصة حاطب بن أبي بلتعة' },

  // قصص من القرآن - أصحاب الكهف وقارون
  { id: 'k27', youtubeId: '7ygd_iChqZY', title: 'قصة أصحاب الكهف - كرتون للأطفال', source: 'IQRA Cartoon', category: 'قصص القرآن', description: 'قصة أصحاب الكهف كما وردت في القرآن' },
  { id: 'k28', youtubeId: '6nSqLgasgYA', title: 'قصة قارون - كرتون للأطفال', source: 'IQRA Cartoon', category: 'قصص القرآن', description: 'قصة قارون الذي بغى على قومه' },
  { id: 'k29', youtubeId: 'YcwgwTUkxsM', title: 'قصة أصحاب الفيل للأطفال', source: 'BeLarabyApps', category: 'قصص القرآن', description: 'قصة أصحاب الفيل بالرسوم المتحركة' },

  // ═══════════════════════════════════════════
  // قصص الحيوان في القرآن
  // ═══════════════════════════════════════════

  // Cedars Art - قصص الحيوان في القرآن
  { id: 'k30', youtubeId: 'eHobRabok1s', title: 'غراب ابني آدم - الجزء الأول', source: 'قصص الحيوان في القرآن', category: 'قصص الحيوان في القرآن', description: 'قصة غراب قابيل وهابيل' },
  { id: 'k31', youtubeId: 'zIQF6uu1TVs', title: 'ناقة صالح - الجزء الثاني', source: 'قصص الحيوان في القرآن', category: 'قصص الحيوان في القرآن', description: 'قصة ناقة نبي الله صالح' },
  { id: 'k32', youtubeId: 'ikuY5Gqd4IU', title: 'نملة سليمان - الجزء الأول', source: 'قصص الحيوان في القرآن', category: 'قصص الحيوان في القرآن', description: 'قصة نملة سليمان عليه السلام' },
  { id: 'k33', youtubeId: 'XFpAR75iew0', title: '8 قصص حيوانات في القرآن - تجميع للأطفال', source: 'قصص الحيوان في القرآن', category: 'قصص الحيوان في القرآن', description: '8 قصص تعليمية للأطفال بطريقة ممتعة بدون موسيقى' },
  { id: 'k34', youtubeId: '_6qbeLtAgng', title: 'قصة النملة - كارتون للأطفال بدون موسيقى', source: 'قصص الحيوان في القرآن', category: 'قصص الحيوان في القرآن', description: 'قصة النملة في القرآن الكريم' },

  // ═══════════════════════════════════════════
  // قصص الصحابة
  // ═══════════════════════════════════════════

  { id: 'k35', youtubeId: '_X0BHl4u-sw', title: 'قصص التابعين - تجميع حلقات بدون موسيقى', source: 'كرتون إسلامي', category: 'قصص الصحابة', description: 'كرتون إسلامي بدون موسيقى - سيرة الصالحين' },
  { id: 'k36', youtubeId: 'wzAhOU1ybxE', title: 'قصة أبو بكر الصديق رضي الله عنه', source: 'الشيخ محمد العريفي', category: 'قصص الصحابة', description: 'أعظم رجل بعد الأنبياء والرسل' },
  { id: 'k37', youtubeId: 'KDLl4hHxvp4', title: 'قصة الصحابي جابر بن عبد الله', source: 'الشيخ محمد العريفي', category: 'قصص الصحابة', description: 'قصة جابر بن عبد الله مع رسول الله ﷺ' },
  { id: 'k38', youtubeId: '0AeGhlHwWkg', title: 'ساعة مع أجمل قصص الصحابة', source: 'الشيخ محمد العريفي', category: 'قصص الصحابة', description: 'مجموعة من أجمل قصص الصحابة' },
  { id: 'k39', youtubeId: 'nzlKOz2gd9w', title: 'قصة الأعرابي والرسول ﷺ', source: 'الشيخ محمد العريفي', category: 'قصص الصحابة', description: 'قصة الأعرابي والنبي صلى الله عليه وسلم' },
  { id: 'k40', youtubeId: 'YDo4NUsZmyU', title: 'ماذا فعل الصحابة عند وفاة النبي ﷺ', source: 'الشيخ محمد العريفي', category: 'قصص الصحابة', description: 'ردة فعل الصحابة يوم وفاة النبي ﷺ' },
  { id: 'k41', youtubeId: '8pREszfrqfY', title: 'الرجل الذي جذب رداء النبي ﷺ', source: 'IQRA Cartoon', category: 'قصص الصحابة', description: 'قصة الأعرابي الذي جذب رداء النبي ﷺ - كرتون' },
  { id: 'k42', youtubeId: 'pcNfYlPP0WE', title: 'قوة التمرة - من أحاديث النبي ﷺ', source: 'IQRA Cartoon', category: 'قصص الصحابة', description: 'قصة من أحاديث النبي ﷺ - كرتون للأطفال' },

  // ═══════════════════════════════════════════
  // أناشيد إسلامية بدون إيقاع
  // ═══════════════════════════════════════════

  { id: 'k43', youtubeId: 'ScqtKErTYIQ', title: 'الأنبياء هم الأمناء - بدون إيقاع', source: 'قناة ريحانة للأطفال', category: 'أناشيد إسلامية بدون إيقاع', description: 'نشيد عن الأنبياء بدون إيقاع للأطفال' },
  { id: 'k44', youtubeId: 'XUX9JnprJzk', title: 'الحيوانات في القرآن - بدون إيقاع', source: 'قناة ريحانة للأطفال', category: 'أناشيد إسلامية بدون إيقاع', description: 'نشيد عن الحيوانات المذكورة في القرآن' },
  { id: 'k45', youtubeId: '88j5OmKnWZw', title: 'قصص إسلامية للأطفال - 30 دقيقة بدون موسيقى', source: 'Islamic Stories for Kids', category: 'أناشيد إسلامية بدون إيقاع', description: 'تجميع 30 دقيقة من القصص الإسلامية للأطفال' },

  // ═══════════════════════════════════════════
  // تعليم القرآن للأطفال
  // ═══════════════════════════════════════════

  { id: 'k46', youtubeId: 'J990JgeiE80', title: 'تجويد القرآن الكريم - الدرس الأول', source: 'د. أيمن سويد', category: 'تعليم القرآن للأطفال', description: 'الدرس الأول من سلسلة تجويد القرآن الكريم' },
  { id: 'k47', youtubeId: 'YyfUNP5swWM', title: 'جزء عمّ كاملاً - القراءة المنهجية', source: 'د. أيمن سويد', category: 'تعليم القرآن للأطفال', description: 'قراءة منهجية لجزء عمّ مع تتبع الآيات' },
  { id: 'k48', youtubeId: 'H6WTnSZ6G-0', title: 'مقدمة في علم التجويد', source: 'د. أيمن سويد', category: 'تعليم القرآن للأطفال', description: 'مقدمة مبسطة في علم التجويد' },
  { id: 'k49', youtubeId: 'ItrS5xc0ZVE', title: 'سورة التكوير - تفسير للأطفال', source: 'IQRA Cartoon', category: 'تعليم القرآن للأطفال', description: 'تفسير سورة التكوير بأسلوب مبسط للأطفال' },
  { id: 'k50', youtubeId: 'MWzQyxVt1rI', title: 'كيفية حفظ القرآن الكريم', source: 'الشيخ عبد المحسن القاسم', category: 'تعليم القرآن للأطفال', description: 'طريقة عملية لحفظ القرآن الكريم' },

  // ═══════════════════════════════════════════
  // آداب إسلامية
  // ═══════════════════════════════════════════

  { id: 'k51', youtubeId: 'HzqlxhtcvoQ', title: 'سأحلم بالنبي ﷺ الليلة - قصة للأطفال', source: 'Islamic Stories for Kids', category: 'آداب إسلامية', description: 'قصة إسلامية جميلة عن حب النبي ﷺ' },
  { id: 'k52', youtubeId: 'P_vmdgyO35o', title: 'أحكام القرآن - كرتون إسلامي بدون موسيقى', source: 'كرتون إسلامي', category: 'آداب إسلامية', description: 'تعليم أحكام القرآن للأطفال بالرسوم المتحركة' },
];

// ============================================
// COMPONENT
// ============================================

export function KidsVideos() {
  const [activeVideo, setActiveVideo] = useState<KidsVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KidsCategory | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Get unique sources
  const sources = useMemo(() => {
    return [...new Set(KIDS_VIDEOS.map(v => v.source))].sort();
  }, []);

  // Get categories
  const categories = useMemo(() => {
    return Object.keys(KIDS_CATEGORY_CONFIG) as KidsCategory[];
  }, []);

  // Get category count
  const getCategoryCount = useCallback((cat: KidsCategory) => {
    return KIDS_VIDEOS.filter(v => v.category === cat).length;
  }, []);

  // Filter videos
  const filteredVideos = useMemo(() => {
    let result = KIDS_VIDEOS;

    if (selectedCategory !== 'all') {
      result = result.filter(v => v.category === selectedCategory);
    }

    if (selectedSource !== 'all') {
      result = result.filter(v => v.source === selectedSource);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.title.includes(searchQuery) ||
        v.title.toLowerCase().includes(query) ||
        v.source.includes(searchQuery) ||
        v.source.toLowerCase().includes(query) ||
        (v.description && v.description.includes(searchQuery))
      );
    }

    return result;
  }, [selectedCategory, selectedSource, searchQuery]);

  // Videos by category
  const videosByCategory = useMemo(() => {
    const map: Partial<Record<KidsCategory, KidsVideo[]>> = {};
    for (const cat of categories) {
      const vids = KIDS_VIDEOS.filter(v => v.category === cat);
      if (vids.length > 0) map[cat] = vids;
    }
    return map;
  }, [categories]);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;
    if (!isFullscreen) {
      playerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // ============================================
  // RENDER VIDEO PLAYER
  // ============================================

  const renderVideoPlayer = () => {
    if (!activeVideo) return null;

    return (
      <div
        ref={playerRef}
        className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
        }`}
      >
        <div className={`relative ${isFullscreen ? 'h-screen' : 'aspect-video'}`}>
          <iframe
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
            title={activeVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className={`p-4 bg-gradient-to-t from-black/90 to-black/50 text-white ${isFullscreen ? 'absolute bottom-0 left-0 right-0' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{activeVideo.title}</h3>
              <p className="text-xs text-white/70 mt-0.5">{activeVideo.source}</p>
            </div>
            <div className="flex gap-2 mr-2">
              <button
                onClick={toggleFullscreen}
                className="text-white/80 hover:text-white transition p-1"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-white/80 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER VIDEO CARD
  // ============================================

  const renderVideoCard = (video: KidsVideo) => {
    const isActive = activeVideo?.id === video.id;

    return (
      <Card
        key={video.id}
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden border-0 shadow-md ${
          isActive ? 'ring-2 ring-orange-400 shadow-orange-200/50' : ''
        }`}
        onClick={() => setActiveVideo(video)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
            <img
              src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/90 group-hover:bg-orange-500 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg">
                <Play className="w-5 h-5 text-white mr-[-2px]" fill="white" />
              </div>
            </div>
            {isActive && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-orange-500 text-white text-[10px] px-2 py-0.5 animate-pulse">
                  يعرض الآن
                </Badge>
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-black/60 text-white text-[10px] px-2 py-0.5">
                {KIDS_CATEGORY_CONFIG[video.category]?.emoji} {video.category}
              </Badge>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1 leading-tight">
              {video.title}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <Baby className="w-3 h-3 text-orange-500 dark:text-orange-400" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{video.source}</p>
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
      <div className="bg-gradient-to-bl from-orange-400 via-amber-500 to-yellow-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
            🧒
          </div>
          <div>
            <h2 className="text-xl font-bold">مقاطع الأطفال</h2>
            <p className="text-amber-100 text-sm">قصص ومقاطع تعليمية مناسبة للأطفال</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>{KIDS_VIDEOS.length} مقطع</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{categories.length} تصنيف</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>بدون موسيقى</span>
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
          placeholder="ابحث بالعنوان أو المصدر..."
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
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            الكل ({KIDS_VIDEOS.length})
          </Button>
          {categories.map(cat => {
            const count = getCategoryCount(cat);
            if (count === 0) return null;
            const catInfo = KIDS_CATEGORY_CONFIG[cat];
            return (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`rounded-full px-4 py-1.5 h-auto text-sm ${
                  selectedCategory === cat
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {catInfo.emoji} {cat} ({count})
              </Button>
            );
          })}
        </div>

        {/* Source Filter */}
        <div className="flex justify-center">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm min-w-[200px]"
          >
            <option value="all">جميع المصادر</option>
            {sources.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all' || selectedSource !== 'all') && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          عرض {filteredVideos.length} مقطع
        </p>
      )}

      {/* Videos Grid by Category */}
      {selectedCategory === 'all' && !searchQuery && selectedSource === 'all' ? (
        categories.map(category => {
          const categoryVideos = videosByCategory[category];
          if (!categoryVideos || categoryVideos.length === 0) return null;
          const catInfo = KIDS_CATEGORY_CONFIG[category];
          const CatIcon = catInfo.icon;

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{catInfo.emoji} {category}</h3>
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
    </div>
  );
}
