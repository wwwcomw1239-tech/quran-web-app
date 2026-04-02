'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play, Pause, ChevronUp, ChevronDown, Heart, Share2, X,
  Sparkles, User, MessageCircle, BookOpen, Lightbulb,
  Volume2, VolumeX, Settings, Maximize2, Minimize2,
  Search, Filter, ArrowRight, RefreshCw, AlertCircle,
  Flame, Star, Bookmark, SkipForward
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
}

// ============================================
// CATEGORY CONFIG
// ============================================

const SHORT_CATEGORY_CONFIG: Record<ShortCategory, { icon: any; color: string; gradient: string; emoji: string }> = {
  'مواعظ قرآنية': {
    icon: Flame,
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-red-600',
    emoji: '🔥'
  },
  'تدبرات': {
    icon: Lightbulb,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-amber-600',
    emoji: '💡'
  },
  'قصص مؤثرة': {
    icon: BookOpen,
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-indigo-600',
    emoji: '📖'
  },
  'فوائد قرآنية': {
    icon: Star,
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-600',
    emoji: '⭐'
  },
  'أسرار القرآن': {
    icon: Sparkles,
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-fuchsia-600',
    emoji: '✨'
  },
  'خواطر إيمانية': {
    icon: Heart,
    color: 'text-rose-400',
    gradient: 'from-rose-500 to-pink-600',
    emoji: '❤️'
  },
};

// ============================================
// QUALITY OPTIONS
// ============================================

const QUALITY_OPTIONS: { value: VideoQuality; label: string; description: string }[] = [
  { value: '360p', label: '360p', description: 'اقتصادي - إنترنت ضعيف' },
  { value: '480p', label: '480p', description: 'متوسط - إنترنت عادي' },
  { value: '720p', label: '720p HD', description: 'عالي الجودة' },
  { value: '1080p', label: '1080p Full HD', description: 'أعلى جودة' },
];

// ============================================
// SHORTS DATABASE - مواعظ وتدبرات وقصص مؤثرة
// علماء أهل السنة والجماعة فقط - بدون المغامسي
// ============================================

const QURAN_SHORTS: QuranShort[] = [
  // ═══════════════════════════════════════════
  // مواعظ قرآنية
  // ═══════════════════════════════════════════

  // الشيخ محمد حسان
  { id: 'sh1', youtubeId: 'D3XfAuliSxg', title: 'موعظة مؤثرة عن أهل القرآن', scholar: 'الشيخ محمد حسان', category: 'مواعظ قرآنية', description: 'من هم أهل القرآن وما صفاتهم' },
  { id: 'sh2', youtubeId: 'tdSXH1s5ZSk', title: 'الخطوة الأولى لدخول الجنة', scholar: 'الشيخ محمد حسان', category: 'مواعظ قرآنية', description: 'موعظة مبكية عن أول خطوة نحو الجنة' },
  { id: 'sh3', youtubeId: 'R9Wrojgf2N8', title: 'تدبر روائع القرآن بقلبك', scholar: 'الشيخ محمد حسان', category: 'مواعظ قرآنية', description: 'كيف نتدبر القرآن بالقلب' },
  { id: 'sh4', youtubeId: 'PKJQsWkT-cs', title: 'التزكية والنداء الرباني', scholar: 'الشيخ محمد حسان', category: 'مواعظ قرآنية', description: 'تزكية النفس من خلال كتاب الله' },
  { id: 'sh5', youtubeId: 'gsX4A44lSco', title: 'على منهج رسول الله ﷺ', scholar: 'الشيخ محمد حسان', category: 'مواعظ قرآنية', description: 'اتباع سنة النبي في فهم القرآن' },
  { id: 'sh6', youtubeId: '9Mkc0EWRYx8', title: 'سارعوا إلى مغفرة من ربكم', scholar: 'الشيخ محمد حسان', category: 'مواعظ قرآنية', description: 'موعظة في المسارعة للخيرات' },
  { id: 'sh7', youtubeId: 'Bbbj4wwrDKI', title: 'وما أرسلنا من رسول إلا ليطاع', scholar: 'الشيخ محمد حسان', category: 'مواعظ قرآنية', description: 'طاعة الرسول ﷺ فريضة' },

  // الشيخ خالد الراشد
  { id: 'sh8', youtubeId: 'Q0f8VXJm0e0', title: 'يا من ضيعت عمرك', scholar: 'الشيخ خالد الراشد', category: 'مواعظ قرآنية', description: 'موعظة مبكية في استغلال العمر' },
  { id: 'sh9', youtubeId: 'nKzETVAOjp4', title: 'رسالة إلى كل غافل', scholar: 'الشيخ خالد الراشد', category: 'مواعظ قرآنية', description: 'تذكير للغافلين عن كتاب الله' },
  { id: 'sh10', youtubeId: 'ZWd7VAFPM-k', title: 'وقفة مع النفس', scholar: 'الشيخ خالد الراشد', category: 'مواعظ قرآنية', description: 'محاسبة النفس على ضوء القرآن' },
  { id: 'sh11', youtubeId: 'eUH4bBqL1dE', title: 'أين أنت من القرآن', scholar: 'الشيخ خالد الراشد', category: 'مواعظ قرآنية', description: 'موعظة عن هجر القرآن الكريم' },
  { id: 'sh12', youtubeId: 'Py0nXCHvBIA', title: 'يا عبد الله تب إلى الله', scholar: 'الشيخ خالد الراشد', category: 'مواعظ قرآنية', description: 'دعوة للتوبة من خلال آيات القرآن' },

  // الشيخ محمد حسين يعقوب
  { id: 'sh13', youtubeId: 'y7dWi0yFjYk', title: 'كيف تحب الله', scholar: 'الشيخ محمد حسين يعقوب', category: 'مواعظ قرآنية', description: 'طريق حب الله من خلال كتابه' },
  { id: 'sh14', youtubeId: 'bRF5X2Cvvj8', title: 'صفات عباد الرحمن', scholar: 'الشيخ محمد حسين يعقوب', category: 'مواعظ قرآنية', description: 'تدبر آيات صفات عباد الرحمن' },
  { id: 'sh15', youtubeId: 'GmF1D_Z99sE', title: 'الخشوع في الصلاة بالقرآن', scholar: 'الشيخ محمد حسين يعقوب', category: 'مواعظ قرآنية', description: 'كيف نخشع بالقرآن في صلاتنا' },
  { id: 'sh16', youtubeId: 'rBgpJEu_I1U', title: 'إياك أن تغتر بعبادتك', scholar: 'الشيخ محمد حسين يعقوب', category: 'مواعظ قرآنية', description: 'موعظة في الإخلاص وترك العُجب' },

  // الشيخ نبيل العوضي
  { id: 'sh17', youtubeId: 'pB7uZzu2dLI', title: 'بداية الخلق وعظمة الله', scholar: 'الشيخ نبيل العوضي', category: 'مواعظ قرآنية', description: 'قصة الخلق وعظمة الخالق' },
  { id: 'sh18', youtubeId: 'zDzsg7KsdOM', title: 'معجزات الأنبياء', scholar: 'الشيخ نبيل العوضي', category: 'مواعظ قرآنية', description: 'عظمة معجزات الأنبياء في القرآن' },
  { id: 'sh19', youtubeId: 'cfR7wL_YQWE', title: 'قصة المائدة من السماء', scholar: 'الشيخ نبيل العوضي', category: 'مواعظ قرآنية', description: 'موعظة من قصة المائدة' },

  // الشيخ عبد الرزاق البدر
  { id: 'sh20', youtubeId: 'MTozJRhqVDE', title: 'فوائد التقوى من القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'ثمرات التقوى في كتاب الله' },
  { id: 'sh21', youtubeId: 'AOJmPcCN-lY', title: 'فضائل القرآن العظيم', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'بيان فضائل القرآن الكريم' },
  { id: 'sh22', youtubeId: 'Mvusk5QkFPU', title: 'المبشرون في القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'من هم المبشرون في كتاب الله' },
  { id: 'sh23', youtubeId: 'krCbO2Iggz4', title: 'دروس من الحرمين الشريفين', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', description: 'مواعظ قرآنية من الحرمين' },

  // الشيخ صالح الفوزان
  { id: 'sh24', youtubeId: 'XVQFW2-0Aew', title: 'أصول تفسير القرآن', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'بيان أصول فهم كتاب الله' },
  { id: 'sh25', youtubeId: 'BdDABx7WS6M', title: 'الناسخ والمنسوخ', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'فهم الناسخ والمنسوخ في القرآن' },
  { id: 'sh26', youtubeId: 'IM37F2Oj5wY', title: 'تفسير سورة الأعلى', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', description: 'مواعظ من سورة الأعلى' },

  // الشيخ ابن عثيمين
  { id: 'sh27', youtubeId: '5F7J6-1k97U', title: 'تفسير سورة البقرة - آية 98', scholar: 'الشيخ ابن عثيمين', category: 'مواعظ قرآنية', description: 'فوائد عظيمة من سورة البقرة' },
  { id: 'sh28', youtubeId: 'IGKt2FlwyFg', title: 'سورة الضحى - مواعظ', scholar: 'الشيخ ابن عثيمين', category: 'مواعظ قرآنية', description: 'مواعظ مؤثرة من سورة الضحى' },
  { id: 'sh29', youtubeId: 'EeKIX5nbw9U', title: 'وأما بنعمة ربك فحدث', scholar: 'الشيخ ابن عثيمين', category: 'مواعظ قرآنية', description: 'شكر النعم والتحديث بها' },
  { id: 'sh30', youtubeId: 'SZe-hzufJbI', title: 'وهو الله في السماوات وفي الأرض', scholar: 'الشيخ ابن عثيمين', category: 'مواعظ قرآنية', description: 'عظمة الله في القرآن' },

  // الشيخ محمد العريفي
  { id: 'sh31', youtubeId: 'dUaGkiXOoYQ', title: 'قصة أصحاب الأخدود', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'عبرة من قصة أصحاب الأخدود' },
  { id: 'sh32', youtubeId: 'VVH9z_D40x8', title: 'الموت وما بعده', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'موعظة مبكية عن الموت' },
  { id: 'sh33', youtubeId: '2jhYrfBnT3c', title: 'لحظة الاحتضار', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', description: 'كيف وصف القرآن لحظة الموت' },

  // الشيخ عائض القرني
  { id: 'sh34', youtubeId: 'cW7V4Jz7aKo', title: 'لا تحزن - مع القرآن', scholar: 'الشيخ عائض القرني', category: 'مواعظ قرآنية', description: 'السعادة في ظلال القرآن' },
  { id: 'sh35', youtubeId: 'KGFnFaLvU_4', title: 'أعظم كتاب في الوجود', scholar: 'الشيخ عائض القرني', category: 'مواعظ قرآنية', description: 'عظمة القرآن الكريم' },

  // ═══════════════════════════════════════════
  // تدبرات
  // ═══════════════════════════════════════════

  // د. فاضل السامرائي
  { id: 'sh36', youtubeId: 'onVD3DgrdJ0', title: 'الفرق بين لا ولن في القرآن', scholar: 'د. فاضل السامرائي', category: 'تدبرات', description: 'لمسة بيانية عبقرية' },
  { id: 'sh37', youtubeId: 'tRQDHN8y5hg', title: 'أسرار البيان القرآني', scholar: 'د. فاضل السامرائي', category: 'تدبرات', description: 'لمسات بيانية في القرآن' },
  { id: 'sh38', youtubeId: 'w6B-f6o7CR8', title: 'أسئلة بيانية في القرآن', scholar: 'د. فاضل السامرائي', category: 'تدبرات', description: 'تدبرات في الأسلوب القرآني' },
  { id: 'sh39', youtubeId: 'Z1zX7-wXuMU', title: 'لمسات بيانية متنوعة', scholar: 'د. فاضل السامرائي', category: 'تدبرات', description: 'أسئلة وأجوبة بيانية' },
  { id: 'sh40', youtubeId: 'lnldk80-Aqs', title: 'عبقرية رسم رحمت في القرآن', scholar: 'د. فاضل السامرائي', category: 'تدبرات', description: 'إعجاز الرسم القرآني' },
  { id: 'sh41', youtubeId: '-qqrJB615tQ', title: 'لمسات بيانية في سورة يس', scholar: 'د. فاضل السامرائي', category: 'تدبرات', description: 'تدبرات في سورة يس' },
  { id: 'sh42', youtubeId: 'uKPZnM2Y_pA', title: 'لمسات بيانية - الإعجاز', scholar: 'د. فاضل السامرائي', category: 'تدبرات', description: 'إعجاز بياني في القرآن' },

  // الشيخ ابن عثيمين - تدبرات
  { id: 'sh43', youtubeId: 'vcXSimh8_lw', title: 'تدبر سورة الليل', scholar: 'الشيخ ابن عثيمين', category: 'تدبرات', description: 'تدبر عميق لسورة الليل' },
  { id: 'sh44', youtubeId: 'RJLkbqvgK_4', title: 'فوائد من سورة البقرة 217', scholar: 'الشيخ ابن عثيمين', category: 'تدبرات', description: 'فوائد مستخرجة من آية' },
  { id: 'sh45', youtubeId: 'Jr2tX9if-oM', title: 'أورثنا الكتاب الذين اصطفينا', scholar: 'الشيخ ابن عثيمين', category: 'تدبرات', description: 'تدبر آية من سورة فاطر' },
  { id: 'sh46', youtubeId: '7Yh-7R5RkZ8', title: 'فإنك بأعيننا - تدبر', scholar: 'الشيخ ابن عثيمين', category: 'تدبرات', description: 'معية الله وحفظه لعباده' },

  // الشيخ عبد الرزاق البدر - تدبرات
  { id: 'sh47', youtubeId: '1ZbDzc08IlQ', title: 'تدبر آية الكرسي', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبرات', description: 'دروس وفوائد عميقة' },
  { id: 'sh48', youtubeId: 'ZANiaTaJv6I', title: 'تدبرات في تفسير السعدي', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبرات', description: 'لطائف تفسيرية' },

  // د. مساعد الطيار - تدبرات
  { id: 'sh49', youtubeId: 'OOlrxIZ5wDo', title: 'مدخل لتدبر القرآن', scholar: 'د. مساعد الطيار', category: 'تدبرات', description: 'كيف نتدبر القرآن' },
  { id: 'sh50', youtubeId: 'mdX_r3k1Wfw', title: 'علاقة علوم القرآن بالتدبر', scholar: 'د. مساعد الطيار', category: 'تدبرات', description: 'فهم أعمق للتدبر' },

  // الشيخ عبد الكريم الخضير - تدبرات
  { id: 'sh51', youtubeId: 'x4T2I1rNYZ4', title: 'منهج تدبر كتب التفسير', scholar: 'الشيخ عبد الكريم الخضير', category: 'تدبرات', description: 'كيف نستفيد من كتب التفسير' },
  { id: 'sh52', youtubeId: 'vn8Dm84h6MU', title: 'بناء مكتبة التفسير والتدبر', scholar: 'الشيخ عبد الكريم الخضير', category: 'تدبرات', description: 'اختيار كتب التدبر' },
  { id: 'sh53', youtubeId: 'GZrTJjXicsA', title: 'أفضل كتب التفسير للتدبر', scholar: 'الشيخ عبد الكريم الخضير', category: 'تدبرات', description: 'ترشيحات كتب التدبر' },

  // الشيخ صالح الفوزان - تدبرات
  { id: 'sh54', youtubeId: 'CMCwNBORgps', title: 'تدبر سورة البقرة', scholar: 'الشيخ صالح الفوزان', category: 'تدبرات', description: 'تأملات في أطول سورة' },
  { id: 'sh55', youtubeId: 'eLyrd0b-5Yc', title: 'تدبر سورة ق', scholar: 'الشيخ صالح الفوزان', category: 'تدبرات', description: 'تدبرات في سورة ق' },
  { id: 'sh56', youtubeId: '7IyZ0Qra_qw', title: 'تدبر سورة التين والعلق', scholar: 'الشيخ صالح الفوزان', category: 'تدبرات', description: 'لطائف في سورتي التين والعلق' },
  { id: 'sh57', youtubeId: '_13GVJCXfeA', title: 'تدبر سورة الإنسان', scholar: 'الشيخ صالح الفوزان', category: 'تدبرات', description: 'تأملات في سورة الإنسان' },

  // ═══════════════════════════════════════════
  // قصص مؤثرة
  // ═══════════════════════════════════════════

  // الشيخ نبيل العوضي - قصص
  { id: 'sh58', youtubeId: 'tLP0ZUwf6s0', title: 'قصة نبي الله إدريس', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'لماذا رفعه الله مكاناً عليا' },
  { id: 'sh59', youtubeId: 'Aw4FLH5c6dM', title: 'قصة موسى عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', description: 'كليم الله وملحمته مع فرعون' },

  // الشيخ محمد العريفي - قصص
  { id: 'sh60', youtubeId: 'dUaGkiXOoYQ', title: 'أصحاب الأخدود', scholar: 'الشيخ محمد العريفي', category: 'قصص مؤثرة', description: 'قصة الغلام المؤمن' },
  { id: 'sh61', youtubeId: 'VVH9z_D40x8', title: 'قصة الموت وسكراته', scholar: 'الشيخ محمد العريفي', category: 'قصص مؤثرة', description: 'كيف يكون الموت' },
  { id: 'sh62', youtubeId: '2jhYrfBnT3c', title: 'لحظة خروج الروح', scholar: 'الشيخ محمد العريفي', category: 'قصص مؤثرة', description: 'وصف القرآن للحظة الاحتضار' },

  // الشيخ محمد حسان - قصص
  { id: 'sh63', youtubeId: 'D3XfAuliSxg', title: 'أهل القرآن وقصصهم', scholar: 'الشيخ محمد حسان', category: 'قصص مؤثرة', description: 'قصص مؤثرة لأهل القرآن' },

  // الشيخ خالد الراشد - قصص
  { id: 'sh64', youtubeId: 'Q0f8VXJm0e0', title: 'قصص من حياة التائبين', scholar: 'الشيخ خالد الراشد', category: 'قصص مؤثرة', description: 'قصص مبكية للتائبين' },
  { id: 'sh65', youtubeId: 'Py0nXCHvBIA', title: 'قصة توبة شاب', scholar: 'الشيخ خالد الراشد', category: 'قصص مؤثرة', description: 'قصة مؤثرة عن التوبة' },

  // الشيخ عائض القرني - قصص
  { id: 'sh66', youtubeId: 'cW7V4Jz7aKo', title: 'قصص من لا تحزن', scholar: 'الشيخ عائض القرني', category: 'قصص مؤثرة', description: 'قصص ملهمة' },

  // ═══════════════════════════════════════════
  // فوائد قرآنية
  // ═══════════════════════════════════════════

  // الشيخ ابن عثيمين - فوائد
  { id: 'sh67', youtubeId: '_d0axzBBmIU', title: 'أصول في التفسير', scholar: 'الشيخ ابن عثيمين', category: 'فوائد قرآنية', description: 'قواعد مهمة في فهم القرآن' },

  // الشيخ عبد المحسن القاسم - فوائد
  { id: 'sh68', youtubeId: 'pHjFQ24cN64', title: 'كيف تحفظ القرآن', scholar: 'الشيخ عبد المحسن القاسم', category: 'فوائد قرآنية', description: 'طريقة عملية لحفظ القرآن' },

  // الشيخ عبد الرزاق البدر - فوائد
  { id: 'sh69', youtubeId: 'VZbxE7ESQHE', title: 'آداب تلاوة القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'فوائد قرآنية', description: 'آداب ظاهرة وباطنة' },

  // د. أيمن سويد - فوائد
  { id: 'sh70', youtubeId: 'J990JgeiE80', title: 'أساسيات تجويد القرآن', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'أول خطوة في التجويد' },
  { id: 'sh71', youtubeId: 'gl5oar_uGCM', title: 'التجويد المصور', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'فوائد من كتاب التجويد المصور' },
  { id: 'sh72', youtubeId: 'YyfUNP5swWM', title: 'جزء عم - قراءة منهجية', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'كيف نقرأ جزء عم بالتجويد' },
  { id: 'sh73', youtubeId: 'H6WTnSZ6G-0', title: 'مقدمة في علم التجويد', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'أساسيات علم التجويد' },
  { id: 'sh74', youtubeId: 'HFKGcKaZQkA', title: 'أحكام حرف الراء', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', description: 'دقائق في تجويد الراء' },

  // د. مساعد الطيار - فوائد
  { id: 'sh75', youtubeId: 'BXDs0Snb_UI', title: 'علوم القرآن - محاضرة 16', scholar: 'د. مساعد الطيار', category: 'فوائد قرآنية', description: 'فوائد من دبلوم علوم القرآن' },
  { id: 'sh76', youtubeId: 'Q_jA5XYMNT0', title: 'كتاب المحرر في علوم القرآن', scholar: 'د. مساعد الطيار', category: 'فوائد قرآنية', description: 'فوائد علمية قيمة' },

  // الشيخ عبد الكريم الخضير - فوائد
  { id: 'sh77', youtubeId: 'z4i-mLuacOQ', title: 'شرح منظومة الزمزمي', scholar: 'الشيخ عبد الكريم الخضير', category: 'فوائد قرآنية', description: 'علوم القرآن في منظومة' },
  { id: 'sh78', youtubeId: 'dXqvJu6R7QQ', title: 'شرح منظومة الزمزمي 2', scholar: 'الشيخ عبد الكريم الخضير', category: 'فوائد قرآنية', description: 'تكملة شرح المنظومة' },
  { id: 'sh79', youtubeId: '985KT7x7a4o', title: 'فوائد من تفسير القرطبي', scholar: 'الشيخ عبد الكريم الخضير', category: 'فوائد قرآنية', description: 'فوائد من سورة الحشر' },

  // ═══════════════════════════════════════════
  // أسرار القرآن
  // ═══════════════════════════════════════════

  // د. فاضل السامرائي - أسرار
  { id: 'sh80', youtubeId: 'onVD3DgrdJ0', title: 'سر استعمال لا ولن', scholar: 'د. فاضل السامرائي', category: 'أسرار القرآن', description: 'أسرار الاختيار اللغوي في القرآن' },
  { id: 'sh81', youtubeId: 'lnldk80-Aqs', title: 'سر رسم رحمت بالتاء', scholar: 'د. فاضل السامرائي', category: 'أسرار القرآن', description: 'سر في الرسم العثماني' },
  { id: 'sh82', youtubeId: '-qqrJB615tQ', title: 'أسرار سورة يس', scholar: 'د. فاضل السامرائي', category: 'أسرار القرآن', description: 'أسرار بيانية في يس' },

  // الشيخ ابن عثيمين - أسرار
  { id: 'sh83', youtubeId: 'SZe-hzufJbI', title: 'سر وهو الله في السماوات', scholar: 'الشيخ ابن عثيمين', category: 'أسرار القرآن', description: 'أسرار التعبير القرآني' },
  { id: 'sh84', youtubeId: 'Jr2tX9if-oM', title: 'سر الاصطفاء في القرآن', scholar: 'الشيخ ابن عثيمين', category: 'أسرار القرآن', description: 'أسرار اختيار الله لعباده' },

  // د. أيمن سويد - أسرار
  { id: 'sh85', youtubeId: 'uXCvBY-iuss', title: 'سير أعلام التجويد', scholar: 'د. أيمن سويد', category: 'أسرار القرآن', description: 'أسرار من حياة علماء التجويد' },

  // ═══════════════════════════════════════════
  // خواطر إيمانية
  // ═══════════════════════════════════════════

  // الشيخ محمد حسين يعقوب - خواطر
  { id: 'sh86', youtubeId: 'y7dWi0yFjYk', title: 'خاطرة: حب الله', scholar: 'الشيخ محمد حسين يعقوب', category: 'خواطر إيمانية', description: 'كيف يكون الحب لله حقيقياً' },
  { id: 'sh87', youtubeId: 'bRF5X2Cvvj8', title: 'خاطرة: عباد الرحمن', scholar: 'الشيخ محمد حسين يعقوب', category: 'خواطر إيمانية', description: 'تأملات في صفاتهم' },
  { id: 'sh88', youtubeId: 'GmF1D_Z99sE', title: 'خاطرة: الخشوع', scholar: 'الشيخ محمد حسين يعقوب', category: 'خواطر إيمانية', description: 'خاطرة في الخشوع لله' },
  { id: 'sh89', youtubeId: 'rBgpJEu_I1U', title: 'خاطرة: الإخلاص', scholar: 'الشيخ محمد حسين يعقوب', category: 'خواطر إيمانية', description: 'إخلاص العمل لله' },

  // الشيخ خالد الراشد - خواطر
  { id: 'sh90', youtubeId: 'nKzETVAOjp4', title: 'خاطرة: رسالة لكل غافل', scholar: 'الشيخ خالد الراشد', category: 'خواطر إيمانية', description: 'يقظة من الغفلة' },
  { id: 'sh91', youtubeId: 'ZWd7VAFPM-k', title: 'خاطرة: محاسبة النفس', scholar: 'الشيخ خالد الراشد', category: 'خواطر إيمانية', description: 'وقفة صادقة مع النفس' },
  { id: 'sh92', youtubeId: 'eUH4bBqL1dE', title: 'خاطرة: هجر القرآن', scholar: 'الشيخ خالد الراشد', category: 'خواطر إيمانية', description: 'أنواع هجر القرآن' },

  // الشيخ عائض القرني - خواطر
  { id: 'sh93', youtubeId: 'KGFnFaLvU_4', title: 'خاطرة: عظمة القرآن', scholar: 'الشيخ عائض القرني', category: 'خواطر إيمانية', description: 'تأمل في عظمة كتاب الله' },

  // الشيخ نبيل العوضي - خواطر
  { id: 'sh94', youtubeId: 'pB7uZzu2dLI', title: 'خاطرة: بداية الخلق', scholar: 'الشيخ نبيل العوضي', category: 'خواطر إيمانية', description: 'تأمل في بدء الخلق' },
  { id: 'sh95', youtubeId: 'zDzsg7KsdOM', title: 'خاطرة: معجزات ربانية', scholar: 'الشيخ نبيل العوضي', category: 'خواطر إيمانية', description: 'قدرة الله في الأنبياء' },

  // الشيخ محمد حسان - خواطر
  { id: 'sh96', youtubeId: 'R9Wrojgf2N8', title: 'خاطرة: القلب والقرآن', scholar: 'الشيخ محمد حسان', category: 'خواطر إيمانية', description: 'علاقة القلب بالقرآن' },
  { id: 'sh97', youtubeId: 'gsX4A44lSco', title: 'خاطرة: المنهج النبوي', scholar: 'الشيخ محمد حسان', category: 'خواطر إيمانية', description: 'منهج النبي مع القرآن' },

  // الشيخ صالح الفوزان - خواطر
  { id: 'sh98', youtubeId: 'XVQFW2-0Aew', title: 'خاطرة: مصادر التفسير', scholar: 'الشيخ صالح الفوزان', category: 'خواطر إيمانية', description: 'أهمية معرفة أصول التفسير' },

  // الشيخ عبد الرزاق البدر - خواطر
  { id: 'sh99', youtubeId: 'MTozJRhqVDE', title: 'خاطرة: ثمرات التقوى', scholar: 'الشيخ عبد الرزاق البدر', category: 'خواطر إيمانية', description: 'فوائد التقوى من القرآن' },
  { id: 'sh100', youtubeId: 'Mvusk5QkFPU', title: 'خاطرة: البشارات القرآنية', scholar: 'الشيخ عبد الرزاق البدر', category: 'خواطر إيمانية', description: 'بشارات الله لعباده المؤمنين' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export function QuranShorts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ShortCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  // Filter shorts
  const filteredShorts = useMemo(() => {
    let result = QURAN_SHORTS;
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
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
  }, [selectedCategory, searchQuery]);

  const currentShort = filteredShorts[currentIndex] || filteredShorts[0];
  const categories = Object.keys(SHORT_CATEGORY_CONFIG) as ShortCategory[];
  const scholars = useMemo(() => {
    const set = new Set(QURAN_SHORTS.map(s => s.scholar));
    return Array.from(set).sort();
  }, []);

  // Navigate
  const goNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVideoError(false);
    setCurrentIndex(prev => (prev + 1) % filteredShorts.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [filteredShorts.length, isTransitioning]);

  const goPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVideoError(false);
    setCurrentIndex(prev => (prev - 1 + filteredShorts.length) % filteredShorts.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [filteredShorts.length, isTransitioning]);

  // Touch handling for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartY.current - touchEndY.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext(); // Swipe up
      else goPrev(); // Swipe down
    }
  }, [goNext, goPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') goNext();
      else if (e.key === 'ArrowUp' || e.key === 'k') goPrev();
      else if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
        if (showSearch) setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, isFullscreen, showSearch]);

  // Wheel handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime < 500) return;
      lastWheelTime = now;
      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrev]);

  // Toggle like
  const toggleLike = useCallback(() => {
    if (!currentShort) return;
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(currentShort.id)) next.delete(currentShort.id);
      else next.add(currentShort.id);
      return next;
    });
  }, [currentShort]);

  // Toggle save
  const toggleSave = useCallback(() => {
    if (!currentShort) return;
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(currentShort.id)) next.delete(currentShort.id);
      else next.add(currentShort.id);
      return next;
    });
  }, [currentShort]);

  // Share
  const handleShare = useCallback(async () => {
    if (!currentShort) return;
    const url = `https://www.youtube.com/watch?v=${currentShort.youtubeId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: currentShort.title, text: currentShort.description, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, [currentShort]);

  // Get embed URL with quality parameter
  const getEmbedUrl = useCallback((youtubeId: string): string => {
    const qualityMap: Record<VideoQuality, string> = {
      '360p': 'small',
      '480p': 'medium',
      '720p': 'large',
      '1080p': 'hd1080',
    };
    const params = new URLSearchParams({
      playsinline: '1',
      modestbranding: '1',
      rel: '0',
      autoplay: '1',
      controls: '1',
      fs: '0',
      iv_load_policy: '3',
      cc_load_policy: '0',
      vq: qualityMap[videoQuality],
      mute: isMuted ? '1' : '0',
      loop: '0',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    });
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
  }, [videoQuality, isMuted]);

  if (!currentShort) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">لا توجد مقاطع مطابقة</p>
      </div>
    );
  }

  const catConfig = SHORT_CATEGORY_CONFIG[currentShort.category];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-4">
      {/* Header / Filter bar */}
      {!isFullscreen && (
        <div className="space-y-3">
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
                <Flame className="w-3 h-3" />
                <span>{QURAN_SHORTS.length} مقطع</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <User className="w-3 h-3" />
                <span>{scholars.length} عالم</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <Settings className="w-3 h-3" />
                <span>جودة {videoQuality}</span>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-1.5 px-1">
            <button
              onClick={() => { setSelectedCategory('all'); setCurrentIndex(0); }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              الكل ({QURAN_SHORTS.length})
            </button>
            {categories.map(cat => {
              const count = QURAN_SHORTS.filter(s => s.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {SHORT_CATEGORY_CONFIG[cat].emoji} {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Quality Selector */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">جودة العرض:</span>
            <div className="flex gap-1">
              {QUALITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setVideoQuality(opt.value)}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all ${
                    videoQuality === opt.value
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={opt.description}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Shorts Viewer */}
      <div
        ref={containerRef}
        className={`relative ${isFullscreen ? 'fixed inset-0 z-[100]' : 'rounded-2xl overflow-hidden'}`}
        style={{ 
          height: isFullscreen ? '100vh' : '70vh',
          maxHeight: isFullscreen ? '100vh' : '700px',
          minHeight: '400px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />

        {/* Video Player */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {videoError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
              <p className="text-sm font-medium mb-2">تعذّر تحميل المقطع</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVideoError(false)}
                className="gap-2 text-white border-white/30 hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <iframe
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

        {/* Top Overlay - Info */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-3 pointer-events-none z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 pointer-events-auto">
              <Badge className={`text-[10px] bg-gradient-to-r ${catConfig.gradient} text-white border-0 shadow-lg`}>
                {catConfig.emoji} {currentShort.category}
              </Badge>
              <span className="text-white/60 text-[10px]">
                {currentIndex + 1} / {filteredShorts.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* Quality indicator */}
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] flex items-center gap-1 hover:bg-black/60 transition-colors"
              >
                <Settings className="w-3 h-3" />
                {videoQuality}
              </button>
              {/* Fullscreen toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quality dropdown */}
          {showQualityMenu && (
            <div className="absolute top-12 left-2 bg-black/90 backdrop-blur-md rounded-xl p-2 shadow-2xl z-50 pointer-events-auto border border-white/10">
              {QUALITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setVideoQuality(opt.value); setShowQualityMenu(false); }}
                  className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-colors ${
                    videoQuality === opt.value
                      ? 'bg-purple-500 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-[10px] opacity-70">{opt.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Overlay - Title & Scholar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 z-10 pointer-events-none">
          <div className="flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 pointer-events-auto">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-sm">{currentShort.scholar}</span>
              </div>
              <h3 className="text-white font-bold text-base leading-tight mb-1">
                {currentShort.title}
              </h3>
              {currentShort.description && (
                <p className="text-white/70 text-xs line-clamp-2">{currentShort.description}</p>
              )}
            </div>

            {/* Action buttons - right side */}
            <div className="flex flex-col items-center gap-3 pointer-events-auto">
              {/* Like */}
              <button
                onClick={toggleLike}
                className="flex flex-col items-center gap-0.5 group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  liked.has(currentShort.id)
                    ? 'bg-red-500 scale-110'
                    : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'
                }`}>
                  <Heart className={`w-5 h-5 ${liked.has(currentShort.id) ? 'text-white fill-white' : 'text-white'}`} />
                </div>
                <span className="text-white text-[10px]">إعجاب</span>
              </button>

              {/* Save */}
              <button
                onClick={toggleSave}
                className="flex flex-col items-center gap-0.5 group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  saved.has(currentShort.id)
                    ? 'bg-yellow-500 scale-110'
                    : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'
                }`}>
                  <Bookmark className={`w-5 h-5 ${saved.has(currentShort.id) ? 'text-white fill-white' : 'text-white'}`} />
                </div>
                <span className="text-white text-[10px]">حفظ</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-0.5 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-[10px]">مشاركة</span>
              </button>

              {/* Skip */}
              <button
                onClick={goNext}
                className="flex flex-col items-center gap-0.5 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                  <SkipForward className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-[10px]">التالي</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation arrows - sides */}
        <div className="absolute left-1/2 -translate-x-1/2 top-3 flex flex-col gap-1 z-20 pointer-events-auto opacity-30 hover:opacity-100 transition-opacity">
          <button
            onClick={goPrev}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
            disabled={currentIndex === 0}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 z-20 pointer-events-none">
          {filteredShorts.slice(Math.max(0, currentIndex - 3), Math.min(filteredShorts.length, currentIndex + 4)).map((_, i) => {
            const actualIndex = Math.max(0, currentIndex - 3) + i;
            return (
              <div
                key={actualIndex}
                className={`w-1 rounded-full transition-all ${
                  actualIndex === currentIndex
                    ? 'h-4 bg-white'
                    : 'h-1.5 bg-white/30'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Swipe hint */}
      {!isFullscreen && (
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <ChevronUp className="w-3 h-3" />
          اسحب للأعلى أو استخدم الأسهم للتنقل
          <ChevronDown className="w-3 h-3" />
        </p>
      )}

      {/* Disclaimer */}
      {!isFullscreen && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-300 text-center">
            جميع المقاطع من علماء أهل السنة والجماعة الموثوقين فقط
          </p>
        </div>
      )}
    </div>
  );
}
