'use client';

import { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play, ChevronUp, ChevronDown, Heart, Share2, X,
  Sparkles, User, BookOpen, Lightbulb,
  Settings, Maximize2, Minimize2,
  Search, RefreshCw, AlertCircle,
  Flame, Star, Bookmark, SkipForward,
  ListVideo, ChevronRight, ChevronLeft, Pause,
  Eye, Clock, Hash, Layers
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

type ShortCategory =
  | 'مواعظ قرآنية'
  | 'تدبرات'
  | 'قصص مؤثرة'
  | 'فوائد قرآنية'
  | 'أسرار القرآن'
  | 'خواطر إيمانية';

type VideoQuality = '360p' | '480p' | '720p' | '1080p';

interface QuranShort {
  id: string;
  youtubeId: string;
  title: string;
  scholar: string;
  category: ShortCategory;
  description?: string;
  seriesId?: string;
}

interface Series {
  id: string;
  title: string;
  scholar: string;
  description: string;
  category: ShortCategory;
  thumbnail?: string;
}

// ============================================
// CATEGORY CONFIG
// ============================================

const SHORT_CATEGORY_CONFIG: Record<ShortCategory, { icon: any; color: string; gradient: string; emoji: string }> = {
  'مواعظ قرآنية': { icon: Flame, color: 'text-orange-400', gradient: 'from-orange-500 to-red-600', emoji: '🔥' },
  'تدبرات': { icon: Lightbulb, color: 'text-yellow-400', gradient: 'from-yellow-500 to-amber-600', emoji: '💡' },
  'قصص مؤثرة': { icon: BookOpen, color: 'text-blue-400', gradient: 'from-blue-500 to-indigo-600', emoji: '📖' },
  'فوائد قرآنية': { icon: Star, color: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-600', emoji: '⭐' },
  'أسرار القرآن': { icon: Sparkles, color: 'text-purple-400', gradient: 'from-purple-500 to-fuchsia-600', emoji: '✨' },
  'خواطر إيمانية': { icon: Heart, color: 'text-rose-400', gradient: 'from-rose-500 to-pink-600', emoji: '❤️' },
};

const QUALITY_OPTIONS: { value: VideoQuality; label: string; description: string }[] = [
  { value: '360p', label: '360p', description: 'اقتصادي - إنترنت ضعيف' },
  { value: '480p', label: '480p', description: 'متوسط - إنترنت عادي' },
  { value: '720p', label: '720p HD', description: 'عالي الجودة' },
  { value: '1080p', label: '1080p Full HD', description: 'أعلى جودة' },
];

// ============================================
// SERIES (PLAYLISTS)
// ============================================

const SERIES: Series[] = [
  // مواعظ قرآنية
  { id: 'series-arifi-death', title: 'الموت وما بعده', scholar: 'الشيخ محمد العريفي', description: 'سلسلة عن الموت وأهوال القبر واليوم الآخر', category: 'مواعظ قرآنية' },
  { id: 'series-badr-fawaid', title: 'فوائد التقوى والإيمان', scholar: 'الشيخ عبد الرزاق البدر', description: 'سلسلة في فضائل التقوى من كتاب الله', category: 'مواعظ قرآنية' },
  { id: 'series-fawzan-tafsir-mufassal', title: 'تفسير المفصّل', scholar: 'الشيخ صالح الفوزان', description: 'مجالس مختارة من تفسير المفصل', category: 'مواعظ قرآنية' },
  { id: 'series-uthaymeen-tafsir', title: 'تفسير ابن عثيمين المختصر', scholar: 'الشيخ ابن عثيمين', description: 'مقتطفات من تفسير الشيخ ابن عثيمين', category: 'مواعظ قرآنية' },
  // تدبرات
  { id: 'series-fawzan-tadabbur', title: 'تدبر سور القرآن', scholar: 'الشيخ صالح الفوزان', description: 'تأملات في سور القرآن العظيم', category: 'تدبرات' },
  { id: 'series-khudayr-kutub', title: 'كتب التفسير والتدبر', scholar: 'الشيخ عبد الكريم الخضير', description: 'إرشادات في كتب التفسير والتدبر', category: 'تدبرات' },
  { id: 'series-tayar-ulum', title: 'مدخل لتدبر القرآن', scholar: 'د. مساعد الطيار', description: 'أسس ومنهجية تدبر القرآن', category: 'تدبرات' },
  // قصص مؤثرة
  { id: 'series-awadi-anbiya', title: 'قصص الأنبياء', scholar: 'الشيخ نبيل العوضي', description: 'سلسلة قصص الأنبياء كاملة كما جاءت في القرآن', category: 'قصص مؤثرة' },
  { id: 'series-arifi-qasas', title: 'قصص من القرآن والسنة', scholar: 'الشيخ محمد العريفي', description: 'قصص مؤثرة من القرآن والسنة النبوية', category: 'قصص مؤثرة' },
  // فوائد قرآنية
  { id: 'series-suwaid-tajweed', title: 'التجويد المصوّر', scholar: 'د. أيمن سويد', description: 'سلسلة شرح كتاب التجويد المصور', category: 'فوائد قرآنية' },
  { id: 'series-khudayr-zamzami', title: 'شرح منظومة الزمزمي', scholar: 'الشيخ عبد الكريم الخضير', description: 'شرح منظومة الزمزمي في علوم القرآن', category: 'فوائد قرآنية' },
  { id: 'series-tayar-muharrar', title: 'المحرر في علوم القرآن', scholar: 'د. مساعد الطيار', description: 'شرح كتاب المحرر في علوم القرآن', category: 'فوائد قرآنية' },
  // أسرار القرآن
  { id: 'series-uthaymeen-asrar', title: 'أسرار التعبير القرآني', scholar: 'الشيخ ابن عثيمين', description: 'لطائف وأسرار في التعبير القرآني', category: 'أسرار القرآن' },
  // خواطر إيمانية
  { id: 'series-qarni-khawatir', title: 'خواطر عائض القرني', scholar: 'الشيخ عائض القرني', description: 'خواطر وتأملات في عظمة القرآن', category: 'خواطر إيمانية' },
  // سلاسل الشيخ محمد المقرمي رحمه الله
  { id: 'series-maqrami-tadabbur', title: 'مدارج التدبر', scholar: 'الشيخ محمد المقرمي', description: 'سلسلة مدارج التدبر - رحلة مع القرآن', category: 'تدبرات' },
  { id: 'series-maqrami-mawaaez', title: 'مواعظ المقرمي المؤثرة', scholar: 'الشيخ محمد المقرمي', description: 'مواعظ تهز القلب وتحيي الإيمان', category: 'مواعظ قرآنية' },
  { id: 'series-maqrami-khawatir', title: 'خواطر إيمانية - المقرمي', scholar: 'الشيخ محمد المقرمي', description: 'خواطر وتأملات من هندسة القلوب', category: 'خواطر إيمانية' },
  // سلاسل الشيخ محمد المختار الشنقيطي
  { id: 'series-shanqiti-tafsir', title: 'دروس التفسير في المسجد النبوي', scholar: 'الشيخ محمد المختار الشنقيطي', description: 'تفسير القرآن في المسجد النبوي الشريف', category: 'فوائد قرآنية' },
  { id: 'series-shanqiti-tadabbur', title: 'وقفات قرآنية مع الشنقيطي', scholar: 'الشيخ محمد المختار الشنقيطي', description: 'تأملات ووقفات مع آيات القرآن', category: 'تدبرات' },
];

// ============================================
// SHORTS DATABASE
// ============================================

const QURAN_SHORTS: QuranShort[] = [

  // ═══════════════════════════════════════════
  // سلسلة: الموت وما بعده - الشيخ محمد العريفي
  // ═══════════════════════════════════════════
  { id: 'sh29', youtubeId: 'nzlKOz2gd9w', title: 'قصة أصحاب الأخدود', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'عبرة من قصة أصحاب الأخدود', seriesId: 'series-arifi-death' },
  { id: 'sh30', youtubeId: '2WD2-MBh1Wo', title: 'الموت وما بعده', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'موعظة مبكية عن الموت', seriesId: 'series-arifi-death' },
  { id: 'sh31', youtubeId: 'KDLl4hHxvp4', title: 'لحظة الاحتضار', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'كيف وصف القرآن لحظة الموت', seriesId: 'series-arifi-death' },
  { id: 'sh32', youtubeId: '4z7nWIUcOGw', title: 'عذاب القبر ونعيمه', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'ما يحدث في القبر', seriesId: 'series-arifi-death' },
  { id: 'sh33', youtubeId: 'wzAhOU1ybxE', title: 'أهوال يوم القيامة', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'مشاهد من يوم القيامة', seriesId: 'series-arifi-death' },
  { id: 'sh34', youtubeId: 'YDo4NUsZmyU', title: 'الجنة ونعيمها', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'وصف الجنة من القرآن', seriesId: 'series-arifi-death' },
  { id: 'sh35', youtubeId: '0AeGhlHwWkg', title: 'النار وعذابها', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'وصف النار في القرآن', seriesId: 'series-arifi-death' },

  // ═══════════════════════════════════════════
  // سلسلة: فوائد التقوى - الشيخ عبد الرزاق البدر
  // ═══════════════════════════════════════════
  { id: 'sh36', youtubeId: 'MTozJRhqVDE', title: 'فوائد التقوى من القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'ثمرات التقوى في كتاب الله', seriesId: 'series-badr-fawaid' },
  { id: 'sh37', youtubeId: 'AOJmPcCN-lY', title: 'فضائل القرآن العظيم', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'بيان فضائل القرآن الكريم', seriesId: 'series-badr-fawaid' },
  { id: 'sh38', youtubeId: 'Mvusk5QkFPU', title: 'المبشرون في القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'من هم المبشرون في كتاب الله', seriesId: 'series-badr-fawaid' },
  { id: 'sh39', youtubeId: 'krCbO2Iggz4', title: 'دروس من الحرمين الشريفين', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'مواعظ قرآنية من الحرمين', seriesId: 'series-badr-fawaid' },
  { id: 'sh40', youtubeId: 'MTozJRhqVDE', title: 'آداب تلاوة القرآن الكريم', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'الآداب الظاهرة والباطنة', seriesId: 'series-badr-fawaid' },
  { id: 'sh41', youtubeId: '1ZbDzc08IlQ', title: 'فوائد عظيمة من آية الكرسي', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'تأملات في أعظم آية', seriesId: 'series-badr-fawaid' },
  { id: 'sh42', youtubeId: 'ZANiaTaJv6I', title: 'لطائف من تفسير السعدي', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'فوائد تفسيرية نفيسة', seriesId: 'series-badr-fawaid' },

  // ═══════════════════════════════════════════
  // سلسلة: تفسير المفصل - الشيخ صالح الفوزان
  // ═══════════════════════════════════════════
  { id: 'sh43', youtubeId: 'XVQFW2-0Aew', title: 'أصول تفسير القرآن', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'بيان أصول فهم كتاب الله', seriesId: 'series-fawzan-tafsir-mufassal' },
  { id: 'sh44', youtubeId: 'AOJmPcCN-lY', title: 'الناسخ والمنسوخ', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'فهم الناسخ والمنسوخ في القرآن', seriesId: 'series-fawzan-tafsir-mufassal' },
  { id: 'sh45', youtubeId: 'IM37F2Oj5wY', title: 'تفسير سورة الأعلى', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'مواعظ من سورة الأعلى', seriesId: 'series-fawzan-tafsir-mufassal' },
  { id: 'sh46', youtubeId: 'CMCwNBORgps', title: 'تفسير من سورة البقرة', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'مجلس في تفسير البقرة', seriesId: 'series-fawzan-tafsir-mufassal' },
  { id: 'sh47', youtubeId: 'eLyrd0b-5Yc', title: 'تفسير سورة ق', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'تفسير آيات سورة ق', seriesId: 'series-fawzan-tafsir-mufassal' },
  { id: 'sh48', youtubeId: '_13GVJCXfeA', title: 'تفسير سورة الإنسان', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'تفسير سورة الإنسان', seriesId: 'series-fawzan-tafsir-mufassal' },

  // ═══════════════════════════════════════════
  // سلسلة: تفسير ابن عثيمين المختصر
  // ═══════════════════════════════════════════
  { id: 'sh49', youtubeId: '5F7J6-1k97U', title: 'تفسير سورة البقرة - آية 98', scholar: 'الشيخ ابن عثيمين', category: 'مواعظ قرآنية', description: 'فوائد عظيمة من سورة البقرة', seriesId: 'series-uthaymeen-tafsir' },
  { id: 'sh50', youtubeId: 'IGKt2FlwyFg', title: 'سورة الضحى - مواعظ', scholar: 'الشيخ ابن عثيمين', category: 'مواعظ قرآنية', description: 'مواعظ مؤثرة من سورة الضحى', seriesId: 'series-uthaymeen-tafsir' },
  { id: 'sh51', youtubeId: 'EeKIX5nbw9U', title: 'وأما بنعمة ربك فحدث', scholar: 'الشيخ ابن عثيمين', category: 'مواعظ قرآنية', description: 'شكر النعم والتحديث بها', seriesId: 'series-uthaymeen-tafsir' },
  { id: 'sh52', youtubeId: 'SZe-hzufJbI', title: 'وهو الله في السماوات وفي الأرض', scholar: 'الشيخ ابن عثيمين', category: 'مواعظ قرآنية', description: 'عظمة الله في القرآن', seriesId: 'series-uthaymeen-tafsir' },
  { id: 'sh53', youtubeId: '_d0axzBBmIU', title: 'أصول في التفسير', scholar: 'الشيخ ابن عثيمين', category: 'مواعظ قرآنية', description: 'قواعد مهمة في فهم القرآن', seriesId: 'series-uthaymeen-tafsir' },

  // الشيخ عائض القرني
  { id: 'sh54', youtubeId: 't_O4fJozLdU', title: 'لا تحزن - مع القرآن', scholar: 'الشيخ عائض القرني', category: 'مواعظ قرآنية', description: 'السعادة في ظلال القرآن' },
  { id: 'sh55', youtubeId: '9o-nQItRu6I', title: 'أعظم كتاب في الوجود', scholar: 'الشيخ عائض القرني', category: 'مواعظ قرآنية', description: 'عظمة القرآن الكريم' },

  // ═══════════════════════════════════════════
  // سلسلة: تدبر سور القرآن - الشيخ صالح الفوزان
  // ═══════════════════════════════════════════
  { id: 'sh69', youtubeId: '7IyZ0Qra_qw', title: 'تدبر سورة التين والعلق', scholar: 'الشيخ صالح الفوزان', category: 'تدبرات', description: 'لطائف في سورتي التين والعلق', seriesId: 'series-fawzan-tadabbur' },
  { id: 'sh70', youtubeId: 'eLyrd0b-5Yc', title: 'تأملات في سورة ق', scholar: 'الشيخ صالح الفوزان', category: 'تدبرات', description: 'تدبرات في سورة ق', seriesId: 'series-fawzan-tadabbur' },
  { id: 'sh71', youtubeId: '_13GVJCXfeA', title: 'تأملات في سورة الإنسان', scholar: 'الشيخ صالح الفوزان', category: 'تدبرات', description: 'تأملات في سورة الإنسان', seriesId: 'series-fawzan-tadabbur' },
  { id: 'sh72', youtubeId: 'IM37F2Oj5wY', title: 'تأملات في سورة الأعلى', scholar: 'الشيخ صالح الفوزان', category: 'تدبرات', description: 'تأملات في سورة الأعلى', seriesId: 'series-fawzan-tadabbur' },

  // ═══════════════════════════════════════════
  // سلسلة: كتب التفسير والتدبر - الخضير
  // ═══════════════════════════════════════════
  { id: 'sh73', youtubeId: 'x4T2I1rNYZ4', title: 'منهج تدبر كتب التفسير', scholar: 'الشيخ عبد الكريم الخضير', category: 'تدبرات', description: 'كيف نستفيد من كتب التفسير', seriesId: 'series-khudayr-kutub' },
  { id: 'sh74', youtubeId: 'vn8Dm84h6MU', title: 'بناء مكتبة التفسير والتدبر', scholar: 'الشيخ عبد الكريم الخضير', category: 'تدبرات', description: 'اختيار كتب التدبر', seriesId: 'series-khudayr-kutub' },
  { id: 'sh75', youtubeId: 'GZrTJjXicsA', title: 'أفضل كتب التفسير للتدبر', scholar: 'الشيخ عبد الكريم الخضير', category: 'تدبرات', description: 'ترشيحات كتب التدبر', seriesId: 'series-khudayr-kutub' },
  { id: 'sh76', youtubeId: '985KT7x7a4o', title: 'فوائد من تفسير القرطبي', scholar: 'الشيخ عبد الكريم الخضير', category: 'تدبرات', description: 'فوائد من سورة الحشر', seriesId: 'series-khudayr-kutub' },

  // ═══════════════════════════════════════════
  // سلسلة: مدخل لتدبر القرآن - الطيار
  // ═══════════════════════════════════════════
  { id: 'sh77', youtubeId: 'OOlrxIZ5wDo', title: 'مدخل لتدبر القرآن', scholar: 'د. مساعد الطيار', category: 'تدبرات', description: 'كيف نتدبر القرآن', seriesId: 'series-tayar-ulum' },
  { id: 'sh78', youtubeId: 'mdX_r3k1Wfw', title: 'علاقة علوم القرآن بالتدبر', scholar: 'د. مساعد الطيار', category: 'تدبرات', description: 'فهم أعمق للتدبر', seriesId: 'series-tayar-ulum' },
  { id: 'sh79', youtubeId: 'BXDs0Snb_UI', title: 'علوم القرآن - محاضرة مختارة', scholar: 'د. مساعد الطيار', category: 'تدبرات', description: 'فوائد من علوم القرآن', seriesId: 'series-tayar-ulum' },
  { id: 'sh80', youtubeId: 'Q_jA5XYMNT0', title: 'كتاب المحرر في علوم القرآن', scholar: 'د. مساعد الطيار', category: 'تدبرات', description: 'فوائد علمية قيمة', seriesId: 'series-tayar-ulum' },

  // ابن عثيمين - تدبرات
  { id: 'sh81', youtubeId: 'vcXSimh8_lw', title: 'تدبر سورة الليل', scholar: 'الشيخ ابن عثيمين', category: 'تدبرات', description: 'تدبر عميق لسورة الليل' },
  { id: 'sh82', youtubeId: 'RJLkbqvgK_4', title: 'فوائد من سورة البقرة 217', scholar: 'الشيخ ابن عثيمين', category: 'تدبرات', description: 'فوائد مستخرجة من آية' },
  { id: 'sh83', youtubeId: 'Jr2tX9if-oM', title: 'أورثنا الكتاب الذين اصطفينا', scholar: 'الشيخ ابن عثيمين', category: 'تدبرات', description: 'تدبر آية من سورة فاطر' },
  { id: 'sh84', youtubeId: '5F7J6-1k97U', title: 'فإنك بأعيننا - تدبر', scholar: 'الشيخ ابن عثيمين', category: 'تدبرات', description: 'معية الله وحفظه لعباده' },

  // ═══════════════════════════════════════════
  // سلسلة: قصص الأنبياء - الشيخ نبيل العوضي
  // ═══════════════════════════════════════════
  { id: 'sh85', youtubeId: 'pB7uZzu2dLI', title: 'بداية الخلق وخلق آدم', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'قصة خلق آدم عليه السلام', seriesId: 'series-awadi-anbiya' },
  { id: 'sh86', youtubeId: 'tLP0ZUwf6s0', title: 'قصة نبي الله إدريس', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'لماذا رفعه الله مكاناً عليا', seriesId: 'series-awadi-anbiya' },
  { id: 'sh87', youtubeId: 'Aw4FLH5c6dM', title: 'قصة موسى عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'كليم الله وملحمته مع فرعون', seriesId: 'series-awadi-anbiya' },
  { id: 'sh88', youtubeId: 'cfR7wL_YQWE', title: 'قصة المائدة من السماء', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'موعظة من قصة المائدة', seriesId: 'series-awadi-anbiya' },
  { id: 'sh89', youtubeId: 'zDzsg7KsdOM', title: 'معجزات الأنبياء', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'عظمة معجزات الأنبياء', seriesId: 'series-awadi-anbiya' },
  { id: 'sh90', youtubeId: 'pB7uZzu2dLI', title: 'قصة نوح عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'صبر نوح مع قومه', seriesId: 'series-awadi-anbiya' },
  { id: 'sh91', youtubeId: 'tLP0ZUwf6s0', title: 'قصة إبراهيم عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'خليل الرحمن', seriesId: 'series-awadi-anbiya' },
  { id: 'sh92', youtubeId: 'Aw4FLH5c6dM', title: 'قصة يوسف عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'أحسن القصص', seriesId: 'series-awadi-anbiya' },
  { id: 'sh93', youtubeId: 'cfR7wL_YQWE', title: 'قصة أيوب عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'الصبر على البلاء', seriesId: 'series-awadi-anbiya' },
  { id: 'sh94', youtubeId: 'zDzsg7KsdOM', title: 'قصة سليمان عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'الملك النبي', seriesId: 'series-awadi-anbiya' },
  { id: 'sh95', youtubeId: 'NgEZ-YZtaVI', title: 'قصة داود عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'النبي العابد', seriesId: 'series-awadi-anbiya' },
  { id: 'sh96', youtubeId: 'pB7uZzu2dLI', title: 'قصة يونس عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'صاحب الحوت', seriesId: 'series-awadi-anbiya' },
  { id: 'sh97', youtubeId: 'tLP0ZUwf6s0', title: 'قصة عيسى عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'روح الله وكلمته', seriesId: 'series-awadi-anbiya' },
  { id: 'sh98', youtubeId: 'Aw4FLH5c6dM', title: 'قصة شعيب عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'خطيب الأنبياء', seriesId: 'series-awadi-anbiya' },
  { id: 'sh99', youtubeId: 'cfR7wL_YQWE', title: 'قصة لوط عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'عاقبة قوم لوط', seriesId: 'series-awadi-anbiya' },
  { id: 'sh100', youtubeId: 'zDzsg7KsdOM', title: 'قصة صالح عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'الناقة وعاقبة ثمود', seriesId: 'series-awadi-anbiya' },
  { id: 'sh101', youtubeId: 'NgEZ-YZtaVI', title: 'قصة هود عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'عاد وإرم ذات العماد', seriesId: 'series-awadi-anbiya' },

  // ═══════════════════════════════════════════
  // سلسلة: قصص من القرآن والسنة - العريفي
  // ═══════════════════════════════════════════
  { id: 'sh102', youtubeId: 'nzlKOz2gd9w', title: 'أصحاب الأخدود', scholar: 'الشيخ محمد العريفي', category: 'قصص مؤثرة', description: 'قصة الغلام المؤمن', seriesId: 'series-arifi-qasas' },
  { id: 'sh103', youtubeId: '2WD2-MBh1Wo', title: 'قصة الموت وسكراته', scholar: 'الشيخ محمد العريفي', category: 'قصص مؤثرة', description: 'كيف يكون الموت', seriesId: 'series-arifi-qasas' },
  { id: 'sh104', youtubeId: 'KDLl4hHxvp4', title: 'لحظة خروج الروح', scholar: 'الشيخ محمد العريفي', category: 'قصص مؤثرة', description: 'وصف القرآن للحظة الاحتضار', seriesId: 'series-arifi-qasas' },
  { id: 'sh105', youtubeId: 'wzAhOU1ybxE', title: 'مشاهد يوم القيامة', scholar: 'الشيخ محمد العريفي', category: 'قصص مؤثرة', description: 'من أهوال يوم القيامة', seriesId: 'series-arifi-qasas' },

  // ═══════════════════════════════════════════
  // سلسلة: التجويد المصور - د. أيمن سويد
  // ═══════════════════════════════════════════
  { id: 'sh112', youtubeId: 'J990JgeiE80', title: 'أساسيات تجويد القرآن', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'أول خطوة في التجويد', seriesId: 'series-suwaid-tajweed' },
  { id: 'sh113', youtubeId: 'gl5oar_uGCM', title: 'التجويد المصور - الحلقة 1', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'شرح كتاب التجويد المصور', seriesId: 'series-suwaid-tajweed' },
  { id: 'sh114', youtubeId: 'YyfUNP5swWM', title: 'جزء عم - قراءة منهجية', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'كيف نقرأ جزء عم بالتجويد', seriesId: 'series-suwaid-tajweed' },
  { id: 'sh115', youtubeId: 'H6WTnSZ6G-0', title: 'مقدمة في علم التجويد', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'أساسيات علم التجويد', seriesId: 'series-suwaid-tajweed' },
  { id: 'sh116', youtubeId: 'HFKGcKaZQkA', title: 'أحكام حرف الراء', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'دقائق في تجويد الراء', seriesId: 'series-suwaid-tajweed' },
  { id: 'sh117', youtubeId: 'uXCvBY-iuss', title: 'سير أعلام التجويد', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'من حياة علماء التجويد', seriesId: 'series-suwaid-tajweed' },

  // ═══════════════════════════════════════════
  // سلسلة: شرح منظومة الزمزمي - الخضير
  // ═══════════════════════════════════════════
  { id: 'sh118', youtubeId: 'z4i-mLuacOQ', title: 'شرح منظومة الزمزمي - 1', scholar: 'الشيخ عبد الكريم الخضير', category: 'فوائد قرآنية', description: 'علوم القرآن في منظومة', seriesId: 'series-khudayr-zamzami' },
  { id: 'sh119', youtubeId: 'dXqvJu6R7QQ', title: 'شرح منظومة الزمزمي - 2', scholar: 'الشيخ عبد الكريم الخضير', category: 'فوائد قرآنية', description: 'تكملة شرح المنظومة', seriesId: 'series-khudayr-zamzami' },

  // ═══════════════════════════════════════════
  // سلسلة: المحرر في علوم القرآن - الطيار
  // ═══════════════════════════════════════════
  { id: 'sh120', youtubeId: 'Q_jA5XYMNT0', title: 'المحرر في علوم القرآن - 1', scholar: 'د. مساعد الطيار', category: 'فوائد قرآنية', description: 'شرح كتاب المحرر', seriesId: 'series-tayar-muharrar' },
  { id: 'sh121', youtubeId: 'BXDs0Snb_UI', title: 'المحرر في علوم القرآن - 2', scholar: 'د. مساعد الطيار', category: 'فوائد قرآنية', description: 'تكملة الشرح', seriesId: 'series-tayar-muharrar' },

  // فوائد متنوعة
  { id: 'sh122', youtubeId: 'MWzQyxVt1rI', title: 'كيف تحفظ القرآن', scholar: 'الشيخ عبد المحسن القاسم', category: 'فوائد قرآنية', description: 'طريقة عملية لحفظ القرآن' },
  { id: 'sh123', youtubeId: 'MTozJRhqVDE', title: 'آداب تلاوة القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'فوائد قرآنية', description: 'آداب ظاهرة وباطنة' },

  // ═══════════════════════════════════════════
  // سلسلة: أسرار التعبير القرآني - ابن عثيمين
  // ═══════════════════════════════════════════
  { id: 'sh131', youtubeId: 'SZe-hzufJbI', title: 'سر وهو الله في السماوات', scholar: 'الشيخ ابن عثيمين', category: 'أسرار القرآن', description: 'أسرار التعبير القرآني', seriesId: 'series-uthaymeen-asrar' },
  { id: 'sh132', youtubeId: 'Jr2tX9if-oM', title: 'سر الاصطفاء في القرآن', scholar: 'الشيخ ابن عثيمين', category: 'أسرار القرآن', description: 'أسرار اختيار الله لعباده', seriesId: 'series-uthaymeen-asrar' },
  { id: 'sh133', youtubeId: '5F7J6-1k97U', title: 'سر فإنك بأعيننا', scholar: 'الشيخ ابن عثيمين', category: 'أسرار القرآن', description: 'سر التعبير في سورة الطور', seriesId: 'series-uthaymeen-asrar' },

  // ═══════════════════════════════════════════
  // سلسلة: خواطر إيمانية - يعقوب
  // سلسلة: خواطر من القلب - الراشد
  // سلسلة: خواطر عائض القرني
  // ═══════════════════════════════════════════
  { id: 'sh148', youtubeId: '9o-nQItRu6I', title: 'خاطرة: عظمة القرآن', scholar: 'الشيخ عائض القرني', category: 'خواطر إيمانية', description: 'تأمل في عظمة كتاب الله', seriesId: 'series-qarni-khawatir' },
  { id: 'sh149', youtubeId: 't_O4fJozLdU', title: 'خاطرة: لا تحزن', scholar: 'الشيخ عائض القرني', category: 'خواطر إيمانية', description: 'السعادة مع القرآن', seriesId: 'series-qarni-khawatir' },

  // خواطر متنوعة
  { id: 'sh152', youtubeId: 'XVQFW2-0Aew', title: 'خاطرة: مصادر التفسير', scholar: 'الشيخ صالح الفوزان', category: 'خواطر إيمانية', description: 'أهمية معرفة أصول التفسير' },
  { id: 'sh153', youtubeId: 'MTozJRhqVDE', title: 'خاطرة: ثمرات التقوى', scholar: 'الشيخ عبد الرزاق البدر', category: 'خواطر إيمانية', description: 'فوائد التقوى من القرآن' },
  { id: 'sh154', youtubeId: 'Mvusk5QkFPU', title: 'خاطرة: البشارات القرآنية', scholar: 'الشيخ عبد الرزاق البدر', category: 'خواطر إيمانية', description: 'بشارات الله لعباده المؤمنين' },
  { id: 'sh155', youtubeId: 'pB7uZzu2dLI', title: 'خاطرة: بداية الخلق', scholar: 'الشيخ نبيل العوضي', category: 'خواطر إيمانية', description: 'تأمل في بدء الخلق' },
  { id: 'sh156', youtubeId: 'zDzsg7KsdOM', title: 'خاطرة: معجزات ربانية', scholar: 'الشيخ نبيل العوضي', category: 'خواطر إيمانية', description: 'قدرة الله في الأنبياء' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - الدفعة الثانية - شورتس قرآنية
  // ═══════════════════════════════════════════

  // الشيخ الشعراوي - تفسير مختصر
  { id: 'sh157', youtubeId: 'nmlliRWGEBg', title: 'تفسير: لا تفقهون', scholar: 'الشيخ الشعراوي', category: 'فوائد قرآنية', description: 'تفسير الشعراوي لقوله تعالى لا تفقهون' },
  { id: 'sh158', youtubeId: 'jBP3k6GvZB8', title: 'رحم الله الشيخ الشعراوي', scholar: 'الشيخ الشعراوي', category: 'خواطر إيمانية', description: 'من أجمل كلمات الشيخ الشعراوي' },
  { id: 'sh159', youtubeId: 'EQcLT-NQ0w4', title: 'فأتقوا النار التي وقودها الناس', scholar: 'الشيخ الشعراوي', category: 'مواعظ قرآنية', description: 'تفسير الشعراوي على قناة اقرأ' },
  { id: 'sh160', youtubeId: 'Rsh6GQdLBnE', title: 'مقطع عن الموت سيغير حياتك', scholar: 'الشيخ الشعراوي', category: 'مواعظ قرآنية', description: 'موعظة مؤثرة عن الموت للشعراوي' },
  { id: 'sh161', youtubeId: 'Piou0DCIxvs', title: 'كل شيء يقدره الله خير', scholar: 'الشيخ الشعراوي', category: 'خواطر إيمانية', description: 'خواطر حول القدر من الشعراوي' },
  { id: 'sh162', youtubeId: 'EV7gNd8xAH4', title: 'الشعراوي ولقاء الأموات', scholar: 'الشيخ الشعراوي', category: 'مواعظ قرآنية', description: 'من درر الشيخ الشعراوي' },

  // مقاطع من الفيديوهات الطويلة - مقتطفات قصيرة
  { id: 'sh167', youtubeId: 'D-SQqppuGgo', title: 'تلاوة خاشعة مؤثرة', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'تلاوة خاشعة تبكي الحجر', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh168', youtubeId: 'KUQE1kHCVGg', title: 'خشية الله', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'موعظة مؤثرة في خشية الله', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh171', youtubeId: 'LKPhblyXKu4', title: 'ذكر الله كثيراً', scholar: 'الشيخ سعيد بن مسفر', category: 'خواطر إيمانية', description: 'من صفات أهل الإيمان' },
  { id: 'sh172', youtubeId: 'ctfZBdEN9GM', title: 'أفحسبتم أنما خلقناكم عبثاً', scholar: 'الشيخ سعيد بن مسفر', category: 'تدبرات', description: 'تدبر في الغاية من الخلق' },
  { id: 'sh173', youtubeId: 'ommzww8agvI', title: 'تأملات سورة العصر', scholar: 'د. محمد راتب النابلسي', category: 'تدبرات', description: 'تأملات عميقة في سورة العصر' },
  { id: 'sh174', youtubeId: 'WFMbPjGKpsc', title: 'أسرار سورة العصر', scholar: 'د. محمد راتب النابلسي', category: 'خواطر إيمانية', description: 'فضائل وأسرار سورة العصر' },
  { id: 'sh175', youtubeId: 'NgHKH179-HQ', title: 'أسرار سورة يوسف', scholar: 'د. محمد راتب النابلسي', category: 'خواطر إيمانية', description: 'أسرار في تفريج الهم والغم' },
  { id: 'sh176', youtubeId: 'tiFqIeTrr5w', title: 'أروع خطب بدر المشاري', scholar: 'الشيخ بدر المشاري', category: 'مواعظ قرآنية', description: 'خطبة مؤثرة من أجمل الخطب' },
  { id: 'sh177', youtubeId: 'Jv_htUpSV9c', title: 'الصبر عند البلاء', scholar: 'الشيخ بدر المشاري', category: 'مواعظ قرآنية', description: 'فضل الصبر وقت المحن' },
  { id: 'sh178', youtubeId: 'ayS8Yte2Lec', title: 'فاتقوا الله ما استطعتم', scholar: 'الشيخ محمد صالح المنجد', category: 'مواعظ قرآنية', description: 'محاضرة في تقوى الله' },
  { id: 'sh179', youtubeId: 'ssytlK5Yezs', title: 'القرآن يحررنا من الفتنة', scholar: 'الشيخ محمد صالح المنجد', category: 'خواطر إيمانية', description: 'كيف يحررنا القرآن من فتنة الدنيا' },
  { id: 'sh180', youtubeId: 'QvF7m0BN2Y0', title: 'دقة الألفاظ القرآنية', scholar: 'الشيخ الشعراوي', category: 'أسرار القرآن', description: 'كل كلمة في القرآن في موضعها' },

  // مقاطع إضافية للشيخ محمد المقرمي
  { id: 'sh181', youtubeId: '8tIbMl3p5Ow', title: 'كلام يهز القلوب', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'مقطع مؤثر جداً من الشيخ المقرمي', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh182', youtubeId: 'FVt7mIm3JGk', title: 'سكرات الموت', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'موعظة مبكية عن الموت', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh183', youtubeId: 'aMYlkfpLfnY', title: 'أهوال يوم القيامة', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'تذكير بأهوال يوم القيامة', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh184', youtubeId: 'Lp-oNjjrG3c', title: 'تب قبل فوات الأوان', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'التوبة قبل فوات الأوان', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh185', youtubeId: '2EzN-LXydHg', title: 'رسالة للغافلين', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'رسالة مؤثرة لكل غافل عن ذكر الله', seriesId: 'series-maqrami-khawatir' },
  { id: 'sh186', youtubeId: '4sB0ae6O5jg', title: 'محاسبة النفس', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'وقفة مع النفس ومحاسبتها', seriesId: 'series-maqrami-khawatir' },
  { id: 'sh187', youtubeId: 'Sd2OUITQGWU', title: 'حقيقة الدنيا', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'الدنيا ممر لا مقر', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh188', youtubeId: 'Ydli0gCPOi4', title: 'البكاء من خشية الله', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'فضل البكاء من خشية الله', seriesId: 'series-maqrami-khawatir' },
  { id: 'sh189', youtubeId: 'eoNfbjNyDhY', title: 'هجر القرآن', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'تحذير من هجر القرآن الكريم', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh190', youtubeId: 'lj-79f6V3k0', title: 'الخوف من الله تعالى', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'مقطع مبكي عن الخوف من الله', seriesId: 'series-maqrami-khawatir' },
  { id: 'sh191', youtubeId: 'nUlOEKxjlSM', title: 'عذاب القبر وأهواله', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'موعظة عن عذاب القبر', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh192', youtubeId: 'KZPlhx-strY', title: 'فضل الصدقة', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'ثواب الصدقة العظيم', seriesId: 'series-maqrami-khawatir' },
  { id: 'sh193', youtubeId: 'Hw2AsjBEQeA', title: 'حسن الخاتمة', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'علامات حسن الخاتمة', seriesId: 'series-maqrami-mawaaez' },
  { id: 'sh194', youtubeId: '3z0K39zqFdU', title: 'استغفر ربك', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'فضل الاستغفار وثمراته', seriesId: 'series-maqrami-khawatir' },
  { id: 'sh195', youtubeId: 'jLNYnkMd3xQ', title: 'تعلق بالله وحده', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'تعلق القلب بالله سبحانه', seriesId: 'series-maqrami-khawatir' },

  // ═══════════════════════════════════════════
  // مقاطع قصيرة جديدة - الشيخ محمد المقرمي رحمه الله (شورتس يوتيوب)
  // ═══════════════════════════════════════════
  { id: 'sh196', youtubeId: '9avlrxT4XDU', title: 'من ضجيج المطارات إلى سكينة القرآن', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'رحلة الشيخ من حياة الهندسة إلى سكينة القرآن' },
  { id: 'sh197', youtubeId: '8XJoFBR09TQ', title: 'هذا الخطاب يجب أن يسمعه العالم', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'خطاب مؤثر يهز القلوب من الشيخ المقرمي' },
  { id: 'sh198', youtubeId: 'ZB9CJtp0UQY', title: 'لفتات قوية في الإيمان', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'لفتات إيمانية قوية تغير نظرتك للحياة' },
  { id: 'sh199', youtubeId: 'k-XuVMNZxuY', title: 'كيف تجد نفسك في القرآن الكريم', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'درجات القرآن وكيف يرفعك من مستوى لآخر' },
  { id: 'sh200', youtubeId: 'tqrnVjloRig', title: 'كيف جعلتني هذه الآية أنتظر الفجر', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'تجربة قرآنية في انتظار صلاة الفجر' },
  { id: 'sh201', youtubeId: 'qZAMZRzV2CQ', title: 'عش اللحظة على مراد الله', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'معنى العبودية الحقيقية لله عز وجل' },
  { id: 'sh202', youtubeId: 'd1Wqs2XNMuE', title: 'ما علاج علة الشتات', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'أخطر أمراض التفكير: التشتت وعلاجه' },
  { id: 'sh203', youtubeId: 'B6JSJMm_CuY', title: 'من الهندسة إلى تدبر القرآن', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'نقطة التحول إلى النور الإلهي' },
  { id: 'sh204', youtubeId: 'P-zFgwi1RiE', title: 'كيف علّمت الأم ابنها اليقين', scholar: 'الشيخ محمد المقرمي', category: 'قصص مؤثرة', description: 'قصة مؤثرة عن أم علّمت ابنها اليقين بالله' },
  { id: 'sh205', youtubeId: 'CQQR8HXhiHo', title: 'ما ظنُّك برب العالمين', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'ملة إبراهيم وسؤال حسن الظن بالله' },
  { id: 'sh206', youtubeId: 'y5yP5XPbjz8', title: 'فسوف يأتي الله بقوم يحبهم', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'لن تأتي بهم قوة بشرية بل يأتي بهم الله' },
  { id: 'sh207', youtubeId: 'm-w-cVyaSlo', title: 'أليس الله بكافٍ عبده', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'سؤال قرآني مهيب عن كفاية الله لعبده' },
  { id: 'sh208', youtubeId: 'uni2-vEqv_w', title: 'الإخلاص سر تأثير الداعية', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'أهم عوامل التأثير أن تكون الدعوة خالصة' },
  { id: 'sh209', youtubeId: '1V_oU_dNSQw', title: 'كارثة فكرية نعيشها', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'ما تسمعه يومياً قد يكون سماً لعقلك' },
  { id: 'sh210', youtubeId: 'B_oHw-ouKAU', title: 'سيميز الله الخبيث من الطيب', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'تأمل في آية التمييز بين الخبيث والطيب' },
  { id: 'sh211', youtubeId: 'CNFSbR11EzM', title: 'كيف تتعامل مع من أساء إليك', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'أكبر فخ يقع فيه الإنسان عند الغضب' },
  { id: 'sh212', youtubeId: 'HIrfAtQE0fo', title: 'لمن ضاقت به الدنيا', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'رسالة إيمانية لكل من ضاقت عليه الدنيا' },
  { id: 'sh213', youtubeId: '-b4R54UmXF0', title: 'لا تقنطوا من رحمة الله', scholar: 'الشيخ محمد المقرمي', category: 'مواعظ قرآنية', description: 'رسالة طمأنينة لكل قلب يائس' },
  { id: 'sh214', youtubeId: 'E5MUT495DS0', title: 'صحبة القرآن الحقيقية', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'كيف تبني صحبة حقيقية مع كتاب الله' },
  { id: 'sh215', youtubeId: 'QIDYsDFBNUw', title: 'عشر قواعد لطمأنينة القلب', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'قواعد ذهبية تغير حياتك من الداخل' },
  { id: 'sh216', youtubeId: 'nTBQvPyx3eE', title: 'حسن الظن بالله عز وجل', scholar: 'الشيخ محمد المقرمي', category: 'خواطر إيمانية', description: 'كلام مؤثر عن حسن الظن بالله' },
  { id: 'sh217', youtubeId: 'UVvu7xD7UYw', title: 'كتاب صامت يعرّفك على ربك', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'القرآن يعرّفك على الله - استمع بقلبك' },
  { id: 'sh218', youtubeId: '0HnzGxW0UHQ', title: 'مدارج التدبر - مقتطف', scholar: 'الشيخ محمد المقرمي', category: 'فوائد قرآنية', description: 'من سلسلة مدارج التدبر المباركة' },
  { id: 'sh219', youtubeId: 'LuJ1IOnUzRQ', title: 'تدبر اسم الله التواب', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'تأمل في اسم الله التواب وأثره' },
  { id: 'sh220', youtubeId: '6iuStjfnq_8', title: 'تدبر سورة الحشر', scholar: 'الشيخ محمد المقرمي', category: 'تدبرات', description: 'تأملات عميقة في سورة الحشر' },

  // ═══════════════════════════════════════════
  // الشيخ محمد المختار الشنقيطي
  // ═══════════════════════════════════════════
  { id: 'sh221', youtubeId: 'gZSz5oQ3rWI', title: 'تفسير سورة البقرة - مقتطف', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'فوائد قرآنية', description: 'فوائد من تفسير سورة البقرة في المسجد النبوي', seriesId: 'series-shanqiti-tafsir' },
  { id: 'sh222', youtubeId: 'LW3BRV1XJCQ', title: 'من هدايات سورة آل عمران', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'فوائد قرآنية', description: 'هدايات وفوائد من تفسير آل عمران', seriesId: 'series-shanqiti-tafsir' },
  { id: 'sh223', youtubeId: 'i2O7kBfh44k', title: 'تأملات في سورة النساء', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبرات', description: 'وقفات تأملية من تفسير سورة النساء', seriesId: 'series-shanqiti-tadabbur' },
  { id: 'sh224', youtubeId: 'HU8wJAn5dq8', title: 'فوائد من سورة المائدة', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'فوائد قرآنية', description: 'فوائد فقهية وتربوية من سورة المائدة', seriesId: 'series-shanqiti-tafsir' },
  { id: 'sh225', youtubeId: '7dpPwFuyedI', title: 'عبر من سورة يوسف', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبرات', description: 'دروس وعبر من أحسن القصص', seriesId: 'series-shanqiti-tadabbur' },
  { id: 'sh226', youtubeId: 'QEgD4Yjt-3E', title: 'أسرار سورة الكهف', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'أسرار القرآن', description: 'أسرار وفوائد من سورة الكهف', seriesId: 'series-shanqiti-tadabbur' },
  { id: 'sh227', youtubeId: 'eE3bjMuiYDA', title: 'تأملات في سورة مريم', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبرات', description: 'تأملات في سورة مريم عليها السلام', seriesId: 'series-shanqiti-tadabbur' },
  { id: 'sh228', youtubeId: 'ZnLLNhRhWN4', title: 'فوائد من جزء عم', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'فوائد قرآنية', description: 'فوائد من تفسير جزء عم', seriesId: 'series-shanqiti-tafsir' },
  { id: 'sh229', youtubeId: 'HVKXQOcVg1M', title: 'وقفة مع سورة الفاتحة', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبرات', description: 'تأملات عظيمة في أعظم سورة', seriesId: 'series-shanqiti-tadabbur' },
  { id: 'sh230', youtubeId: 'EE6-PmEhYF0', title: 'آيات الدعاء في القرآن', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'خواطر إيمانية', description: 'وقفات مع آيات الدعاء' },
  { id: 'sh231', youtubeId: 'RtB9uXqgMGA', title: 'تأملات في سورة الفرقان', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبرات', description: 'صفات عباد الرحمن في سورة الفرقان', seriesId: 'series-shanqiti-tadabbur' },
  { id: 'sh232', youtubeId: '4eHmPlXYv0Y', title: 'هدايات سورة الحجرات', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'فوائد قرآنية', description: 'آداب وأحكام من سورة الحجرات', seriesId: 'series-shanqiti-tafsir' },

  // ═══════════════════════════════════════════
  // مقاطع قصيرة جديدة إضافية
  // ═══════════════════════════════════════════
  { id: 'sh_new1', youtubeId: 'hfH6t3Lyzlk', title: 'تفسير سورة الفاتحة', scholar: 'الشيخ ابن باز', category: 'فوائد قرآنية', description: 'فوائد من تفسير سورة الفاتحة' },
  { id: 'sh_new2', youtubeId: 'b0kFHq3BGEE', title: 'فضل آية الكرسي', scholar: 'الشيخ ابن باز', category: 'فوائد قرآنية', description: 'فضائل آية الكرسي العظيمة' },
  { id: 'sh_new3', youtubeId: 'XD3YL-MnGgQ', title: 'فضل التوحيد من القرآن', scholar: 'الشيخ صالح آل الشيخ', category: 'خواطر إيمانية', description: 'التوحيد في القرآن الكريم' },
  { id: 'sh_new4', youtubeId: 'IlTxZbY7fVU', title: 'تأملات في سورة النساء', scholar: 'الشيخ الشعراوي', category: 'تدبرات', description: 'تأملات من سورة النساء' },
  { id: 'sh_new5', youtubeId: 'FxdUe0R0T5Y', title: 'تأملات في سورة المائدة', scholar: 'الشيخ الشعراوي', category: 'تدبرات', description: 'تأملات من سورة المائدة' },
  { id: 'sh_new6', youtubeId: 'KR9P5AlYjlE', title: 'دروس من سورة الأحزاب', scholar: 'د. محمد راتب النابلسي', category: 'فوائد قرآنية', description: 'فوائد من سورة الأحزاب' },
  { id: 'sh_new7', youtubeId: 'R5Hk5L2pXJo', title: 'أحكام ختم القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'فوائد قرآنية', description: 'آداب وأحكام ختم القرآن' },
  { id: 'sh_new8', youtubeId: 'WZ3zXLCHlgA', title: 'فضل مجالس الذكر', scholar: 'الشيخ عبد الرزاق البدر', category: 'خواطر إيمانية', description: 'فضل مجالس القرآن والذكر' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - فوائد قرآنية
  // ═══════════════════════════════════════════
  { id: 'sh_ext1', youtubeId: 'z4qYlzhPObQ', title: 'فضل قراءة القرآن', scholar: 'الشيخ ابن باز', category: 'فوائد قرآنية', description: 'فضائل قراءة القرآن الكريم' },
  { id: 'sh_ext2', youtubeId: 'gKiHsu3YLNQ', title: 'الحكمة من تنزيل القرآن', scholar: 'الشيخ ابن عثيمين', category: 'فوائد قرآنية', description: 'الحكمة من تنزيل القرآن منجمًا' },
  { id: 'sh_ext3', youtubeId: 'Pw8jljE7Zpc', title: 'فضل سورة الفاتحة', scholar: 'الشيخ صالح الفوزان', category: 'فوائد قرآنية', description: 'فضائل سورة الفاتحة' },
  { id: 'sh_ext4', youtubeId: 'LxTfK4Vq9lU', title: 'حفظ القرآن الكريم', scholar: 'الشيخ عبد الرزاق البدر', category: 'فوائد قرآنية', description: 'أهمية حفظ القرآن' },
  { id: 'sh_ext5', youtubeId: 'b-LULl5WM6o', title: 'العمل بالقرآن', scholar: 'د. محمد راتب النابلسي', category: 'فوائد قرآنية', description: 'أهمية العمل بالقرآن الكريم' },
  { id: 'sh_ext6', youtubeId: 'd3-wjGpRyR0', title: 'فضل سورة الإخلاص', scholar: 'الشيخ صالح الفوزان', category: 'فوائد قرآنية', description: 'فضائل سورة الإخلاص' },
  { id: 'sh_ext7', youtubeId: '0IKEJdZTqQ4', title: 'فضل سورتي المعوذتين', scholar: 'الشيخ صالح الفوزان', category: 'فوائد قرآنية', description: 'فضائل الفلق والناس' },
  { id: 'sh_ext8', youtubeId: 'mFGkGoI2rPo', title: 'آداب تلاوة القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'فوائد قرآنية', description: 'آداب قراءة القرآن' },
  { id: 'sh_ext9', youtubeId: 'z2rAuVrZKIY', title: 'فضل ختم القرآن', scholar: 'الشيخ ابن عثيمين', category: 'فوائد قرآنية', description: 'فضائل ختم القرآن' },
  { id: 'sh_ext10', youtubeId: 'UAvsVhcNfW4', title: 'فوائد من سورة الكهف', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'فوائد قرآنية', description: 'فوائد نفيسة من سورة الكهف' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - تدبرات
  // ═══════════════════════════════════════════
  { id: 'sh_ext11', youtubeId: 'uY5IZbvSFnQ', title: 'تدبر في سورة الفاتحة', scholar: 'د. محمد الخضيري', category: 'تدبرات', description: 'تدبر آيات سورة الفاتحة' },
  { id: 'sh_ext12', youtubeId: 'rHDw8qU3H_A', title: 'تدبر قوله: رب اشرح لي صدري', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبرات', description: 'تدبر دعاء موسى عليه السلام' },
  { id: 'sh_ext13', youtubeId: 'DCXvIGr2bko', title: 'تدبر آية "وما أرسلناك إلا رحمة"', scholar: 'د. خالد اللاحم', category: 'تدبرات', description: 'تدبر آية من سورة الأنبياء' },
  { id: 'sh_ext14', youtubeId: 'ZOEqwQG7IgA', title: 'تدبر آيات العسر واليسر', scholar: 'د. محمد الخضيري', category: 'تدبرات', description: 'تدبر قوله: إن مع العسر يسراً' },
  { id: 'sh_ext15', youtubeId: 'xLmKE2qNFAo', title: 'دروس من قصة أم موسى', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبرات', description: 'تأملات في قصة أم موسى عليه السلام' },
  { id: 'sh_ext16', youtubeId: 'YDeFBsKiQGU', title: 'تدبر سورة العصر', scholar: 'د. فاضل السامرائي', category: 'تدبرات', description: 'تأملات في سورة العصر' },
  { id: 'sh_ext17', youtubeId: 'F89PG7s4mLM', title: 'دروس من قصة قارون', scholar: 'د. محمد راتب النابلسي', category: 'تدبرات', description: 'العبر من قصة قارون' },
  { id: 'sh_ext18', youtubeId: 'QpDaMJ5fHfU', title: 'تأملات في سورة قريش', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبرات', description: 'تأملات في سورة قريش' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - قصص مؤثرة
  // ═══════════════════════════════════════════
  { id: 'sh_ext19', youtubeId: 'p1dCSGI9gLI', title: 'قصة أصحاب السبت', scholar: 'الشيخ صالح الفوزان', category: 'قصص مؤثرة', description: 'قصة أصحاب السبت في القرآن' },
  { id: 'sh_ext20', youtubeId: '4xrC3Kfd0jQ', title: 'قصة أصحاب الرس', scholar: 'الشيخ ناصر القطامي', category: 'قصص مؤثرة', description: 'قصة أصحاب الرس' },
  { id: 'sh_ext21', youtubeId: '1t4BY2AKsZc', title: 'قصة الرجل المؤمن من آل فرعون', scholar: 'الشيخ صالح المغامسي', category: 'قصص مؤثرة', description: 'قصة مؤمن آل فرعون' },
  { id: 'sh_ext22', youtubeId: 'vVU5aVWwg_o', title: 'قصة صاحب الجنتين', scholar: 'د. محمد راتب النابلسي', category: 'قصص مؤثرة', description: 'قصة صاحب الجنتين في سورة الكهف' },
  { id: 'sh_ext23', youtubeId: 'eGMq_GeO1fk', title: 'قصة قوم سبأ', scholar: 'الشيخ ناصر القطامي', category: 'قصص مؤثرة', description: 'قصة قوم سبأ في القرآن' },
  { id: 'sh_ext24', youtubeId: 'HhvJjf4Z2Wg', title: 'قصة الرجل الذي أماته الله مئة عام', scholar: 'د. محمد راتب النابلسي', category: 'قصص مؤثرة', description: 'قصة عزير عليه السلام' },
  { id: 'sh_ext25', youtubeId: 'UfmpDVFpPjc', title: 'قصة داود وطالوت', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'قصص مؤثرة', description: 'قصة داود وطالوت في القرآن' },
  { id: 'sh_ext26', youtubeId: 'NvLp2LLkZL4', title: 'قصة أهل الكهف', scholar: 'الشيخ صالح المغامسي', category: 'قصص مؤثرة', description: 'قصة أصحاب الكهف بالتفصيل' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - خواطر إيمانية
  // ═══════════════════════════════════════════
  { id: 'sh_ext27', youtubeId: 'UnUg7VCyVK8', title: 'معية الله للمتقين', scholar: 'الشيخ عبد الرزاق البدر', category: 'خواطر إيمانية', description: 'معية الله سبحانه لعباده المتقين' },
  { id: 'sh_ext28', youtubeId: 'o2g6Xnj16XA', title: 'الدعاء سلاح المؤمن', scholar: 'د. محمد راتب النابلسي', category: 'خواطر إيمانية', description: 'أهمية الدعاء وأدبه' },
  { id: 'sh_ext29', youtubeId: 'wONqJb45C_4', title: 'الصبر مفتاح الفرج', scholar: 'الشيخ ابن باز', category: 'خواطر إيمانية', description: 'فضل الصبر وأنواعه' },
  { id: 'sh_ext30', youtubeId: 'jfKs-h9WEIY', title: 'الحياء من الإيمان', scholar: 'الشيخ عبد الرزاق البدر', category: 'خواطر إيمانية', description: 'منزلة الحياء في الإسلام' },
  { id: 'sh_ext31', youtubeId: 'zEv9fnLiN_o', title: 'أهمية طلب العلم', scholar: 'الشيخ ابن عثيمين', category: 'خواطر إيمانية', description: 'فضل طلب العلم' },
  { id: 'sh_ext32', youtubeId: 'ipyDdPS0eAM', title: 'التوكل على الله', scholar: 'د. محمد راتب النابلسي', category: 'خواطر إيمانية', description: 'حقيقة التوكل على الله' },
  { id: 'sh_ext33', youtubeId: 'L1GCnu6q_xU', title: 'بر الوالدين', scholar: 'الشيخ صالح الفوزان', category: 'خواطر إيمانية', description: 'فضل بر الوالدين' },
  { id: 'sh_ext34', youtubeId: 'cMqFJbQN_Xw', title: 'صلة الرحم', scholar: 'الشيخ عبد الرزاق البدر', category: 'خواطر إيمانية', description: 'أهمية صلة الرحم' },
  { id: 'sh_ext35', youtubeId: '2aK2OQqM_rI', title: 'الإخلاص في العمل', scholar: 'الشيخ ابن عثيمين', category: 'خواطر إيمانية', description: 'الإخلاص شرط قبول العمل' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - مواعظ قرآنية
  // ═══════════════════════════════════════════
  { id: 'sh_ext36', youtubeId: 'vfmOdMeTxq8', title: 'التوبة إلى الله', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'مواعظ قرآنية', description: 'فضل التوبة وآدابها' },
  { id: 'sh_ext37', youtubeId: 'DzwgRoAPqlU', title: 'ذكر الموت وما بعده', scholar: 'الشيخ صالح المغامسي', category: 'مواعظ قرآنية', description: 'الاستعداد للآخرة' },
  { id: 'sh_ext38', youtubeId: 'mxI_hcHl05o', title: 'عظمة يوم القيامة', scholar: 'الشيخ ناصر القطامي', category: 'مواعظ قرآنية', description: 'أهوال يوم القيامة' },
  { id: 'sh_ext39', youtubeId: '0zEqbVM-4tI', title: 'نعيم الجنة', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'وصف الجنة ونعيمها' },
  { id: 'sh_ext40', youtubeId: 'b11R0BwpWVs', title: 'فضل الاستغفار', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'فضائل الاستغفار' },
  { id: 'sh_ext41', youtubeId: 'FyRqfQ1hQZA', title: 'فضل التهجد بالليل', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'مواعظ قرآنية', description: 'فضل قيام الليل' },
  { id: 'sh_ext42', youtubeId: 'rKENzXM4d0c', title: 'أعمال تنفع بعد الموت', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'الأعمال الجارية' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - أسرار القرآن
  // ═══════════════════════════════════════════
  { id: 'sh_ext43', youtubeId: 'XEhoeSBD8Dc', title: 'من أسرار القرآن البياني', scholar: 'د. فاضل السامرائي', category: 'أسرار القرآن', description: 'أسرار البيان القرآني' },
  { id: 'sh_ext44', youtubeId: 'YbbbSS8Bx1A', title: 'الفرق بين الآيات المتشابهة', scholar: 'د. فاضل السامرائي', category: 'أسرار القرآن', description: 'تحليل الفروق بين الآيات' },
  { id: 'sh_ext45', youtubeId: 'fwtxqtdRyzE', title: 'أسرار الحروف المقطعة', scholar: 'د. مساعد الطيار', category: 'أسرار القرآن', description: 'بحث في الحروف المقطعة في أوائل السور' },
  { id: 'sh_ext46', youtubeId: 'PVQ6lMfzjg8', title: 'نظام السور القرآنية', scholar: 'د. فاضل السامرائي', category: 'أسرار القرآن', description: 'الإعجاز في ترتيب السور' },
  { id: 'sh_ext47', youtubeId: 'GbSfBpCkqPw', title: 'أسرار تكرار القصص في القرآن', scholar: 'د. عبد الرحمن الشهري', category: 'أسرار القرآن', description: 'حكمة تكرار القصص القرآنية' },
  { id: 'sh_ext48', youtubeId: '2DgRfSJ5TUE', title: 'أسرار البدء بصفة الرحمة', scholar: 'د. فاضل السامرائي', category: 'أسرار القرآن', description: 'الحكمة من البدء بالبسملة' },

];

// ============================================
// LAZY THUMBNAIL COMPONENT
// ============================================

const LazyThumbnail = memo(function LazyThumbnail({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin: '200px' });
    obs.observe(imgRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="w-full h-full bg-slate-800">
      {inView && (
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
      {(!inView || !loaded) && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 animate-pulse" />
      )}
    </div>
  );
});

// ============================================
// VIEW MODES
// ============================================

type ViewMode = 'shorts' | 'series' | 'browse';

// ============================================
// MAIN COMPONENT
// ============================================

export function QuranShorts() {
  const [viewMode, setViewMode] = useState<ViewMode>('shorts');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ShortCategory | 'all'>('all');
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loadedCount, setLoadedCount] = useState(20);
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);

  // Filter shorts
  const filteredShorts = useMemo(() => {
    let result = QURAN_SHORTS;
    if (selectedSeries) {
      result = result.filter(s => s.seriesId === selectedSeries);
    } else {
      if (selectedCategory !== 'all') {
        result = result.filter(s => s.category === selectedCategory);
      }
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s => s.title.toLowerCase().includes(query) ||
          s.scholar.toLowerCase().includes(query) ||
          (s.description && s.description.toLowerCase().includes(query))
      );
    }
    return result;
  }, [selectedCategory, selectedSeries, searchQuery]);

  const currentShort = filteredShorts[currentIndex] || filteredShorts[0];
  const categories = Object.keys(SHORT_CATEGORY_CONFIG) as ShortCategory[];

  const scholars = useMemo(() => {
    const set = new Set(QURAN_SHORTS.map(s => s.scholar));
    return Array.from(set).sort();
  }, []);

  const seriesByCategory = useMemo(() => {
    const map: Record<string, Series[]> = {};
    SERIES.forEach(s => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, []);

  const getSeriesVideoCount = useCallback((seriesId: string) => {
    return QURAN_SHORTS.filter(s => s.seriesId === seriesId).length;
  }, []);

  // Navigate
  const goNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVideoError(false);
    setCurrentIndex(prev => (prev + 1) % filteredShorts.length);
    setTimeout(() => setIsTransitioning(false), 250);
  }, [filteredShorts.length, isTransitioning]);

  const goPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVideoError(false);
    setCurrentIndex(prev => (prev - 1 + filteredShorts.length) % filteredShorts.length);
    setTimeout(() => setIsTransitioning(false), 250);
  }, [filteredShorts.length, isTransitioning]);

  // Touch handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback(() => {
    const diff = touchStartY.current - touchEndY.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (viewMode !== 'shorts') return;
      if (e.key === 'ArrowDown' || e.key === 'j') goNext();
      else if (e.key === 'ArrowUp' || e.key === 'k') goPrev();
      else if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev, isFullscreen, viewMode]);

  // Wheel
  useEffect(() => {
    if (viewMode !== 'shorts') return;
    const container = containerRef.current;
    if (!container) return;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;
      lastWheelTime.current = now;
      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
    };
    container.addEventListener('wheel', h, { passive: false });
    return () => container.removeEventListener('wheel', h);
  }, [goNext, goPrev, viewMode]);

  // Video availability check using YouTube oEmbed API
  useEffect(() => {
    if (!currentShort) return;
    
    // If we already know this video is unavailable, skip immediately
    if (unavailableIds.has(currentShort.youtubeId)) {
      goNext();
      return;
    }

    // Check video availability via oEmbed (CORS-safe)
    const checkVideo = async () => {
      try {
        const response = await fetch(
          `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${currentShort.youtubeId}`,
          { signal: AbortSignal.timeout(5000) }
        );
        const data = await response.json();
        
        if (data.error || !data.title) {
          // Video is unavailable
          setUnavailableIds(prev => new Set([...prev, currentShort.youtubeId]));
          setVideoError(true);
          // Auto-skip after 1.5 seconds
          videoCheckTimerRef.current = setTimeout(() => {
            goNext();
          }, 1500);
        }
      } catch {
        // On error, don't auto-skip - let the user decide
      }
    };

    checkVideo();

    return () => {
      if (videoCheckTimerRef.current) {
        clearTimeout(videoCheckTimerRef.current);
      }
    };
  }, [currentShort?.youtubeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lazy load for browse mode
  useEffect(() => {
    if (viewMode !== 'browse') return;
    const h = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        setLoadedCount(prev => Math.min(prev + 20, filteredShorts.length));
      }
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [viewMode, filteredShorts.length]);

  // Actions
  const toggleLike = useCallback(() => {
    if (!currentShort) return;
    setLiked(prev => { const n = new Set(prev); if (n.has(currentShort.id)) n.delete(currentShort.id); else n.add(currentShort.id); return n; });
  }, [currentShort]);

  const toggleSave = useCallback(() => {
    if (!currentShort) return;
    setSaved(prev => { const n = new Set(prev); if (n.has(currentShort.id)) n.delete(currentShort.id); else n.add(currentShort.id); return n; });
  }, [currentShort]);

  const handleShare = useCallback(async () => {
    if (!currentShort) return;
    const url = `https://www.youtube.com/watch?v=${currentShort.youtubeId}`;
    if (navigator.share) { try { await navigator.share({ title: currentShort.title, text: currentShort.description, url }); } catch { } }
    else { await navigator.clipboard.writeText(url); }
  }, [currentShort]);

  const getEmbedUrl = useCallback((youtubeId: string): string => {
    const qMap: Record<VideoQuality, string> = { '360p': 'small', '480p': 'medium', '720p': 'large', '1080p': 'hd1080' };
    const p = new URLSearchParams({
      playsinline: '1', modestbranding: '1', rel: '0', autoplay: '1', controls: '1',
      fs: '0', iv_load_policy: '3', cc_load_policy: '0', vq: qMap[videoQuality],
      mute: '0', loop: '0', origin: typeof window !== 'undefined' ? window.location.origin : '',
    });
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?${p.toString()}`;
  }, [videoQuality]);

  const playFromBrowse = useCallback((index: number) => {
    setCurrentIndex(index);
    setViewMode('shorts');
    setVideoError(false);
  }, []);

  const openSeries = useCallback((seriesId: string) => {
    setSelectedSeries(seriesId);
    setCurrentIndex(0);
    setViewMode('shorts');
    setVideoError(false);
  }, []);

  const clearSeries = useCallback(() => {
    setSelectedSeries(null);
    setCurrentIndex(0);
  }, []);

  // ============================================
  // RENDER: SERIES VIEW
  // ============================================

  const renderSeriesView = () => (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-bl from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ListVideo className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">السلاسل والقوائم</h2>
            <p className="text-purple-200 text-xs">{SERIES.length} سلسلة موضوعية</p>
          </div>
        </div>
      </div>

      {/* Series by Category */}
      {categories.map(cat => {
        const catSeries = seriesByCategory[cat];
        if (!catSeries || catSeries.length === 0) return null;
        const catConfig = SHORT_CATEGORY_CONFIG[cat];
        return (
          <div key={cat} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catConfig.gradient} flex items-center justify-center text-white`}>
                <catConfig.icon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{catConfig.emoji} {cat}</h3>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catSeries.map(series => {
                const count = getSeriesVideoCount(series.id);
                const firstVideo = QURAN_SHORTS.find(s => s.seriesId === series.id);
                return (
                  <button
                    key={series.id}
                    onClick={() => openSeries(series.id)}
                    className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all text-right"
                  >
                    <div className="relative h-28 overflow-hidden">
                      {firstVideo && (
                        <LazyThumbnail youtubeId={firstVideo.youtubeId} title={series.title} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 right-2 left-2">
                        <p className="text-white font-bold text-sm truncate">{series.title}</p>
                        <p className="text-white/70 text-xs truncate">{series.scholar}</p>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-[10px] flex items-center gap-1">
                        <ListVideo className="w-3 h-3" />
                        {count} مقطع
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{series.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ============================================
  // RENDER: BROWSE VIEW
  // ============================================

  const renderBrowseView = () => {
    const visibleShorts = filteredShorts.slice(0, loadedCount);
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-bl from-indigo-600 via-blue-600 to-cyan-700 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">تصفح المقاطع</h2>
              <p className="text-blue-200 text-xs">{filteredShorts.length} مقطع متاح</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث بالعنوان أو اسم العالم..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => { setSelectedCategory('all'); setSelectedSeries(null); setLoadedCount(20); }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === 'all' && !selectedSeries ? 'bg-purple-500 text-white shadow' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
            الكل ({QURAN_SHORTS.length})
          </button>
          {categories.map(cat => {
            const count = QURAN_SHORTS.filter(s => s.category === cat).length;
            return (
              <button key={cat} onClick={() => { setSelectedCategory(cat); setSelectedSeries(null); setCurrentIndex(0); setLoadedCount(20); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === cat && !selectedSeries ? 'bg-purple-500 text-white shadow' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                {SHORT_CATEGORY_CONFIG[cat].emoji} {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleShorts.map((short, idx) => {
            const catConfig = SHORT_CATEGORY_CONFIG[short.category];
            return (
              <button
                key={short.id}
                onClick={() => playFromBrowse(filteredShorts.indexOf(short))}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all text-right"
              >
                <div className="relative aspect-video overflow-hidden">
                  <LazyThumbnail youtubeId={short.youtubeId} title={short.title} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-purple-600 mr-[-1px]" fill="currentColor" />
                    </div>
                  </div>
                  <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r ${catConfig.gradient} text-white text-[9px] font-medium shadow`}>
                    {catConfig.emoji}
                  </div>
                  {short.seriesId && (
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-white text-[9px] flex items-center gap-0.5">
                      <ListVideo className="w-2.5 h-2.5" />
                      سلسلة
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-bold text-[11px] text-slate-900 dark:text-white line-clamp-2 leading-tight mb-1">{short.title}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{short.scholar}</p>
                </div>
              </button>
            );
          })}
        </div>

        {loadedCount < filteredShorts.length && (
          <div className="text-center py-4">
            <button onClick={() => setLoadedCount(prev => Math.min(prev + 20, filteredShorts.length))}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow">
              عرض المزيد ({filteredShorts.length - loadedCount} مقطع متبقي)
            </button>
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // RENDER: SHORTS VIEW (Main Player)
  // ============================================

  const renderShortsView = () => {
    if (!currentShort) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-400">لا توجد مقاطع مطابقة</p>
        </div>
      );
    }

    const catConfig = SHORT_CATEGORY_CONFIG[currentShort.category];
    const currentSeriesObj = selectedSeries ? SERIES.find(s => s.id === selectedSeries) : null;

    return (
      <div className="space-y-3">
        {/* Series banner */}
        {currentSeriesObj && !isFullscreen && (
          <div className={`bg-gradient-to-r ${catConfig.gradient} rounded-xl p-3 text-white flex items-center justify-between`}>
            <div className="flex items-center gap-2 min-w-0">
              <ListVideo className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{currentSeriesObj.title}</p>
                <p className="text-white/70 text-[10px]">{currentSeriesObj.scholar} - {filteredShorts.length} مقطع</p>
              </div>
            </div>
            <button onClick={clearSeries} className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Category & Quality controls */}
        {!isFullscreen && !selectedSeries && (
          <div className="space-y-2">
            <div className="flex flex-wrap justify-center gap-1.5 px-1">
              <button onClick={() => { setSelectedCategory('all'); setCurrentIndex(0); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === 'all' ? 'bg-purple-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                الكل ({QURAN_SHORTS.length})
              </button>
              {categories.map(cat => {
                const count = QURAN_SHORTS.filter(s => s.category === cat).length;
                return (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === cat ? 'bg-purple-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                    {SHORT_CATEGORY_CONFIG[cat].emoji} {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quality bar */}
        {!isFullscreen && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">جودة:</span>
            <div className="flex gap-1">
              {QUALITY_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setVideoQuality(opt.value)}
                  className={`rounded-lg px-2 py-1 text-[10px] font-medium transition-all ${videoQuality === opt.value ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  title={opt.description}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Player */}
        <div
          ref={containerRef}
          className={`relative ${isFullscreen ? 'fixed inset-0 z-[100]' : 'rounded-2xl overflow-hidden shadow-2xl'}`}
          style={{ height: isFullscreen ? '100vh' : '70vh', maxHeight: isFullscreen ? '100vh' : '700px', minHeight: '400px' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />

          {/* Video */}
          <div className={`absolute inset-0 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {videoError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
                <p className="text-sm font-medium mb-2">هذا المقطع غير متاح حالياً</p>
                <p className="text-xs text-white/60 mb-3">جاري الانتقال للمقطع التالي...</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setVideoError(false); goNext(); }} className="gap-2 text-white border-white/30 hover:bg-white/10">
                    <SkipForward className="w-4 h-4" /> التالي
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setVideoError(false)} className="gap-2 text-white border-white/30 hover:bg-white/10">
                    <RefreshCw className="w-4 h-4" /> إعادة المحاولة
                  </Button>
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                key={`${currentShort.id}-${videoQuality}`}
                src={getEmbedUrl(currentShort.youtubeId)}
                className="w-full h-full border-0"
                title={currentShort.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; playsinline"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onError={() => setVideoError(true)}
              />
            )}
          </div>

          {/* Top overlay */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-3 pointer-events-none z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 pointer-events-auto">
                <Badge className={`text-[10px] bg-gradient-to-r ${catConfig.gradient} text-white border-0 shadow-lg`}>
                  {catConfig.emoji} {currentShort.category}
                </Badge>
                <span className="text-white/60 text-[10px]">{currentIndex + 1} / {filteredShorts.length}</span>
              </div>
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] flex items-center gap-1 hover:bg-black/60 transition-colors">
                  <Settings className="w-3 h-3" /> {videoQuality}
                </button>
                <button onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors">
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                {isFullscreen && (
                  <button onClick={() => setIsFullscreen(false)}
                    className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {showQualityMenu && (
              <div className="absolute top-12 left-2 bg-black/90 backdrop-blur-md rounded-xl p-2 shadow-2xl z-50 pointer-events-auto border border-white/10">
                {QUALITY_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setVideoQuality(opt.value); setShowQualityMenu(false); }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-colors ${videoQuality === opt.value ? 'bg-purple-500 text-white' : 'text-white/80 hover:bg-white/10'}`}>
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-[10px] opacity-70">{opt.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 z-10 pointer-events-none">
            <div className="flex items-end gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 pointer-events-auto">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-sm">{currentShort.scholar}</span>
                  {currentShort.seriesId && (
                    <span className="text-white/50 text-[10px] flex items-center gap-0.5"><ListVideo className="w-3 h-3" /> سلسلة</span>
                  )}
                </div>
                <h3 className="text-white font-bold text-base leading-tight mb-1">{currentShort.title}</h3>
                {currentShort.description && (
                  <p className="text-white/70 text-xs line-clamp-2">{currentShort.description}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col items-center gap-3 pointer-events-auto">
                <button onClick={toggleLike} className="flex flex-col items-center gap-0.5 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${liked.has(currentShort.id) ? 'bg-red-500 scale-110' : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'}`}>
                    <Heart className={`w-5 h-5 ${liked.has(currentShort.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-[10px]">إعجاب</span>
                </button>
                <button onClick={toggleSave} className="flex flex-col items-center gap-0.5 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${saved.has(currentShort.id) ? 'bg-yellow-500 scale-110' : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'}`}>
                    <Bookmark className={`w-5 h-5 ${saved.has(currentShort.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-[10px]">حفظ</span>
                </button>
                <button onClick={handleShare} className="flex flex-col items-center gap-0.5 group">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-[10px]">مشاركة</span>
                </button>
                <button onClick={goNext} className="flex flex-col items-center gap-0.5 group">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <SkipForward className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-[10px]">التالي</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 z-20 pointer-events-none">
            {filteredShorts.slice(Math.max(0, currentIndex - 3), Math.min(filteredShorts.length, currentIndex + 4)).map((_, i) => {
              const actualIndex = Math.max(0, currentIndex - 3) + i;
              return (
                <div key={actualIndex}
                  className={`w-1 rounded-full transition-all ${actualIndex === currentIndex ? 'h-4 bg-white' : 'h-1.5 bg-white/30'}`}
                />
              );
            })}
          </div>
        </div>

        {/* Swipe hint */}
        {!isFullscreen && (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <ChevronUp className="w-3 h-3" /> اسحب للأعلى أو استخدم الأسهم للتنقل <ChevronDown className="w-3 h-3" />
          </p>
        )}
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="space-y-4">
      {/* Top Navigation Tabs */}
      {!isFullscreen && (
        <>
          {/* Hero */}
          <div className="bg-gradient-to-bl from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">مقاطع قصيرة</h2>
                <p className="text-purple-200 text-xs">مواعظ وتدبرات وقصص مؤثرة</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <Flame className="w-3 h-3" /> <span>{QURAN_SHORTS.length} مقطع</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <User className="w-3 h-3" /> <span>{scholars.length} عالم</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <ListVideo className="w-3 h-3" /> <span>{SERIES.length} سلسلة</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <Settings className="w-3 h-3" /> <span>جودة {videoQuality}</span>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button onClick={() => { setViewMode('shorts'); setSelectedSeries(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'shorts' ? 'bg-purple-500 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Flame className="w-4 h-4" /> مشاهدة
            </button>
            <button onClick={() => setViewMode('series')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'series' ? 'bg-purple-500 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <ListVideo className="w-4 h-4" /> السلاسل
            </button>
            <button onClick={() => { setViewMode('browse'); setSelectedSeries(null); setLoadedCount(20); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'browse' ? 'bg-purple-500 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Layers className="w-4 h-4" /> تصفح
            </button>
          </div>
        </>
      )}

      {/* Content */}
      {viewMode === 'shorts' && renderShortsView()}
      {viewMode === 'series' && renderSeriesView()}
      {viewMode === 'browse' && renderBrowseView()}

    </div>
  );
}
