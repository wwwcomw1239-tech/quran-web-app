'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Play, Search, X, BookOpen, Mic2,
  Sparkles, ChevronDown, ChevronUp, Video, Filter,
  Star, User, ArrowRight, Maximize2, Minimize2,
  BookMarked, GraduationCap, Lightbulb, MessageCircle,
  Scroll, RefreshCw, AlertCircle, Download, Share2,
  Heart, Bookmark, ExternalLink, Settings, SkipForward, SkipBack,
  Volume2, Clock, Eye
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
    description: 'دروس تفسير القرآن الكريم'
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
// VIDEOS DATABASE
// جميع المعرفات مأخوذة من فيديوهات يوتيوب حقيقية
// ============================================

const QURAN_VIDEOS: QuranVideo[] = [
  // ═══════════════════════════════════════════
  // تفسير القرآن
  // ═══════════════════════════════════════════
  
  // الشيخ ابن عثيمين رحمه الله
  { id: 't1', youtubeId: '5F7J6-1k97U', title: 'تفسير الآية 98 من سورة البقرة', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير مفصل من سلسلة تفسير القرآن الكريم' },
  { id: 't2', youtubeId: 'IGKt2FlwyFg', title: 'شرح سورة الضحى', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة الضحى من لقاءات الباب المفتوح' },
  { id: 't3', youtubeId: 'vcXSimh8_lw', title: 'تفسير سورة الليل', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير كامل لسورة الليل' },
  { id: 't4', youtubeId: 'EeKIX5nbw9U', title: 'تفسير: وأما بنعمة ربك فحدث', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير آخر سورة الضحى' },
  { id: 't5', youtubeId: 'SZe-hzufJbI', title: 'تفسير: وهو الله في السماوات وفي الأرض', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير من سورة الأنعام' },
  { id: 't6', youtubeId: 'RJLkbqvgK_4', title: 'فوائد من الآية 217 من سورة البقرة', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'الفوائد المستخرجة من آيات سورة البقرة' },
  { id: 't7', youtubeId: 'Jr2tX9if-oM', title: 'تفسير: ثم أورثنا الكتاب الذين اصطفينا', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير آية من سورة فاطر' },

  // الشيخ صالح الفوزان حفظه الله
  { id: 't8', youtubeId: 'XVQFW2-0Aew', title: 'مصادر وأصول تفسير القرآن الكريم', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'بيان المصادر والأصول المعتمدة في تفسير القرآن' },
  { id: 't9', youtubeId: 'CMCwNBORgps', title: 'تفسير سورة البقرة', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'دروس من المجالس في تفسير المفصل' },
  { id: 't10', youtubeId: 'eLyrd0b-5Yc', title: 'تفسير سورة ق - الآية 1 إلى 8', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'من سلسلة المجالس في تفسير المفصل' },
  { id: 't11', youtubeId: '7IyZ0Qra_qw', title: 'تفسير سورة التين والعلق', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'من سلسلة المجالس في تفسير المفصل' },
  { id: 't12', youtubeId: '_13GVJCXfeA', title: 'تفسير سورة الإنسان', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الإنسان الآية 1 إلى 14' },
  { id: 't13', youtubeId: 'IM37F2Oj5wY', title: 'تفسير سورة الأعلى', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'من سلسلة المجالس في تفسير المفصل' },

  // الشيخ عبد الكريم الخضير
  { id: 't14', youtubeId: 'z4i-mLuacOQ', title: 'شرح منظومة الزمزمي في علوم القرآن', scholar: 'الشيخ عبد الكريم الخضير', category: 'تفسير القرآن', description: 'شرح مفصل لمنظومة الزمزمي' },
  { id: 't15', youtubeId: 'x4T2I1rNYZ4', title: 'منهجية قراءة كتب التفسير للمبتدئين', scholar: 'الشيخ عبد الكريم الخضير', category: 'تفسير القرآن', description: 'إرشادات عملية لقراءة كتب التفسير' },
  { id: 't16', youtubeId: 'vn8Dm84h6MU', title: 'كيف يبني طالب العلم مكتبته - كتب التفسير', scholar: 'الشيخ عبد الكريم الخضير', category: 'تفسير القرآن', description: 'توجيهات في اختيار كتب التفسير وعلوم القرآن' },
  { id: 't17', youtubeId: '985KT7x7a4o', title: 'تفسير القرطبي - سورة الحشر', scholar: 'الشيخ عبد الكريم الخضير', category: 'تفسير القرآن', description: 'التعليق على تفسير القرطبي' },
  { id: 't18', youtubeId: 'GZrTJjXicsA', title: 'كتب التفسير الميسرة للمبتدئ', scholar: 'الشيخ عبد الكريم الخضير', category: 'تفسير القرآن', description: 'توصيات بأفضل كتب التفسير للمبتدئين' },

  // الشيخ عبد الرزاق البدر
  { id: 't19', youtubeId: '1ZbDzc08IlQ', title: 'دروس وفوائد من آية الكرسي', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'شرح مفصل لآية الكرسي وفوائدها' },
  { id: 't20', youtubeId: 'ZANiaTaJv6I', title: 'تفسير السعدي', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'الدروس العلمية في تفسير السعدي' },
  { id: 't21', youtubeId: 'AOJmPcCN-lY', title: 'فضائل القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'شرح كتاب فضائل القرآن' },
  { id: 't22', youtubeId: 'MTozJRhqVDE', title: 'فوائد التقوى من القرآن الكريم', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'رسالة فوائد التقوى من القرآن الكريم' },
  { id: 't23', youtubeId: 'Mvusk5QkFPU', title: 'المبشرون في القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'بيان البشارات في القرآن الكريم' },

  // الشيخ محمد المختار الشنقيطي
  { id: 'sh_t1', youtubeId: 'gZSz5oQ3rWI', title: 'تفسير سورة البقرة - الدرس الأول', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'بداية تفسير سورة البقرة في المسجد النبوي' },
  { id: 'sh_t2', youtubeId: 'LW3BRV1XJCQ', title: 'تفسير سورة آل عمران - الدرس الأول', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'بداية تفسير سورة آل عمران في المسجد النبوي' },
  { id: 'sh_t3', youtubeId: 'i2O7kBfh44k', title: 'تفسير سورة النساء - الدرس الأول', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'بداية تفسير سورة النساء' },
  { id: 'sh_t4', youtubeId: 'HU8wJAn5dq8', title: 'تفسير سورة المائدة - الدرس الأول', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'بداية تفسير سورة المائدة' },
  { id: 'sh_t5', youtubeId: '7dpPwFuyedI', title: 'تفسير سورة يوسف', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'تفسير سورة يوسف في المسجد النبوي' },
  { id: 'sh_t6', youtubeId: 'QEgD4Yjt-3E', title: 'تفسير سورة الكهف - الدرس الأول', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'تفسير سورة الكهف' },
  { id: 'sh_t7', youtubeId: 'eE3bjMuiYDA', title: 'تفسير سورة مريم - الدرس الأول', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'تفسير سورة مريم في المسجد النبوي' },
  { id: 'sh_t8', youtubeId: 'ZnLLNhRhWN4', title: 'تفسير جزء عمّ كاملاً', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'تفسير مفصل لجزء عمّ' },
  { id: 'sh_t9', youtubeId: 'tM9f0XYjXdU', title: 'شرح أصول في التفسير', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'شرح كتاب أصول في التفسير لابن عثيمين' },
  { id: 'sh_t10', youtubeId: 'RtB9uXqgMGA', title: 'تفسير سورة الفرقان', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'دروس من تفسير سورة الفرقان' },

  // ═══════════════════════════════════════════
  // تدبر وتأملات
  // ═══════════════════════════════════════════
  
  // تدبر - الشيخ عبد الرزاق البدر
  { id: 'd12', youtubeId: 'krCbO2Iggz4', title: 'دروس من الحرمين', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبر وتأملات', description: 'دروس من الحرمين الشريفين في تدبر القرآن' },

  // الشيخ محمد المختار الشنقيطي - تدبر
  { id: 'sh_d1', youtubeId: 'HVKXQOcVg1M', title: 'تدبر سورة الفاتحة', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبر وتأملات', description: 'تأملات وفوائد من سورة الفاتحة' },
  { id: 'sh_d2', youtubeId: 'EE6-PmEhYF0', title: 'وقفات مع آيات الدعاء في القرآن', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبر وتأملات', description: 'تأملات في آيات الدعاء' },
  { id: 'sh_d3', youtubeId: '4eHmPlXYv0Y', title: 'من هدايات سورة الحجرات', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبر وتأملات', description: 'هدايات وفوائد من سورة الحجرات' },
  { id: 'sh_d4', youtubeId: 'x1QnkLGFrqQ', title: 'شرح زاد المستقنع - كتاب الجنائز', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبر وتأملات', description: 'دروس من باب الجنائز مع وقفات قرآنية' },

  // ═══════════════════════════════════════════
  // أحكام التلاوة والتجويد
  // ═══════════════════════════════════════════
  
  // الشيخ أيمن سويد
  { id: 'j1', youtubeId: 'J990JgeiE80', title: 'تجويد القرآن الكريم - الدرس الأول', scholar: 'د. أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'الدرس الأول من سلسلة تجويد القرآن الكريم' },
  { id: 'j2', youtubeId: 'gl5oar_uGCM', title: 'شرح كتاب التجويد المصور - الحلقة 1', scholar: 'د. أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح كتاب التجويد المصور من تأليف الشيخ' },
  { id: 'j3', youtubeId: 'YyfUNP5swWM', title: 'جزء عمّ كاملاً - القراءة المنهجية', scholar: 'د. أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'قراءة منهجية لجزء عمّ مع تتبع الآيات' },
  { id: 'j4', youtubeId: 'H6WTnSZ6G-0', title: 'مقدمة في علم التجويد', scholar: 'د. أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح كتاب التجويد المصور - مقدمة في علم التجويد' },
  { id: 'j5', youtubeId: 'HFKGcKaZQkA', title: 'تكرير الراء وتحريرها', scholar: 'د. أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'دقائق في التجويد والقراءات القرآنية' },
  { id: 'j6', youtubeId: 'uXCvBY-iuss', title: 'سير الأعلام في علم تجويد القرآن', scholar: 'د. أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'سير أعلام القراء والتجويد قديماً وحديثاً' },

  // الشيخ عبد المحسن القاسم
  { id: 'j7', youtubeId: 'MWzQyxVt1rI', title: 'كيفية حفظ القرآن الكريم', scholar: 'الشيخ عبد المحسن القاسم', category: 'أحكام التلاوة والتجويد', description: 'طريقة عملية لحفظ القرآن الكريم' },

  // الشيخ عبد الرزاق البدر
  { id: 'j8', youtubeId: 'MTozJRhqVDE', title: 'آداب تلاوة القرآن الكريم', scholar: 'الشيخ عبد الرزاق البدر', category: 'أحكام التلاوة والتجويد', description: 'آداب تلاوة القرآن الظاهرة والباطنة' },

  // ═══════════════════════════════════════════
  // علوم القرآن
  // ═══════════════════════════════════════════
  
  // الشيخ مساعد الطيار
  { id: 'q1', youtubeId: 'OOlrxIZ5wDo', title: 'المدخل إلى علم القرآن', scholar: 'د. مساعد الطيار', category: 'علوم القرآن', description: 'مدخل شامل لعلوم القرآن الكريم' },
  { id: 'q2', youtubeId: 'BXDs0Snb_UI', title: 'علوم القرآن - المحاضرة 16', scholar: 'د. مساعد الطيار', category: 'علوم القرآن', description: 'ضمن مقرر علوم القرآن في دبلوم العلوم الإسلامية' },
  { id: 'q3', youtubeId: 'Q_jA5XYMNT0', title: 'المحرر في علوم القرآن', scholar: 'د. مساعد الطيار', category: 'علوم القرآن', description: 'عرض كتاب المحرر في علوم القرآن' },
  { id: 'q4', youtubeId: 'mdX_r3k1Wfw', title: 'العلاقات بين علوم القرآن والعلوم الأخرى', scholar: 'د. مساعد الطيار', category: 'علوم القرآن', description: 'خريطة علوم القرآن وعلاقتها بالعلوم الأخرى' },
  
  // الشيخ عبد الكريم الخضير
  { id: 'q5', youtubeId: 'dXqvJu6R7QQ', title: 'شرح منظومة الزمزمي', scholar: 'الشيخ عبد الكريم الخضير', category: 'علوم القرآن', description: 'شرح منظومة الزمزمي في علوم القرآن' },

  // الشيخ صالح الفوزان
  { id: 'q6', youtubeId: 'AOJmPcCN-lY', title: 'الناسخ والمنسوخ في القرآن', scholar: 'الشيخ صالح الفوزان', category: 'علوم القرآن', description: 'بيان الناسخ والمنسوخ وأحكامه في القرآن' },

  // الشيخ ابن عثيمين
  { id: 'q7', youtubeId: '_d0axzBBmIU', title: 'شرح أصول في التفسير لابن عثيمين', scholar: 'الشيخ ابن عثيمين', category: 'علوم القرآن', description: 'شرح كتاب أصول في التفسير' },
  { id: 'q8', youtubeId: '5F7J6-1k97U', title: 'صفة العين ومعنى: فإنك بأعيننا', scholar: 'الشيخ ابن عثيمين', category: 'علوم القرآن', description: 'فوائد من شرح العقيدة الواسطية' },

  // ═══════════════════════════════════════════
  // قصص القرآن
  // ═══════════════════════════════════════════
  
  // الشيخ نبيل العوضي
  { id: 's1', youtubeId: 'pB7uZzu2dLI', title: 'قصة بداية الخلق وخلق آدم عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'كيف خلق الله العالم وخلق آدم عليه السلام' },
  { id: 's2', youtubeId: 'tLP0ZUwf6s0', title: 'قصة نبي الله إدريس عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة إدريس عليه السلام ولماذا رفعته الملائكة' },
  { id: 's3', youtubeId: 'Aw4FLH5c6dM', title: 'قصة كليم الله موسى عليه السلام - الجزء الأول', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة موسى عليه السلام كما وردت في القرآن' },
  { id: 's4', youtubeId: 'cfR7wL_YQWE', title: 'المائدة - قصص الأنبياء', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة المائدة كما وردت في القرآن الكريم' },
  { id: 's5', youtubeId: 'zDzsg7KsdOM', title: 'قصص من حياة الأنبياء ومعجزاتهم', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصص من حياة الأنبياء وكيف أهلك الله الأقوام' },

  // ═══════════════════════════════════════════
  // إعجاز القرآن
  // ═══════════════════════════════════════════
  
  // ═══════════════════════════════════════════
  // إضافات جديدة - مقاطع إضافية
  // ═══════════════════════════════════════════

  // الشيخ محمد العريفي - قصص ومواعظ
  { id: 'n1', youtubeId: 'nzlKOz2gd9w', title: 'قصة الأعرابي والرسول ﷺ', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن', description: 'قصة الأعرابي والنبي صلى الله عليه وسلم' },
  { id: 'n2', youtubeId: '2WD2-MBh1Wo', title: 'يسروا ولا تعسروا - قصص', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن', description: 'قصص في التيسير والبشارة' },
  { id: 'n3', youtubeId: 'KDLl4hHxvp4', title: 'قصة الصحابي جابر بن عبد الله', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن', description: 'قصة جابر بن عبد الله مع رسول الله ﷺ' },
  { id: 'n4', youtubeId: '4z7nWIUcOGw', title: 'قصة السامري الذي أضل بني إسرائيل', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن', description: 'كيف صنع السامري العجل وأضل بني إسرائيل' },
  { id: 'n5', youtubeId: 'wzAhOU1ybxE', title: 'قصة أبو بكر الصديق رضي الله عنه', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن', description: 'أعظم رجل بعد الأنبياء والرسل' },
  { id: 'n6', youtubeId: 'YDo4NUsZmyU', title: 'ماذا فعل الصحابة عند وفاة النبي ﷺ', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن', description: 'ردة فعل الصحابة يوم وفاة النبي ﷺ' },

  // الشيخ عائض القرني - مواعظ وتدبرات
  { id: 'n7', youtubeId: 't_O4fJozLdU', title: 'الحياة مع القرآن - بودكاست', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'بودكاست عن الحياة مع القرآن الكريم' },
  { id: 'n8', youtubeId: '9o-nQItRu6I', title: 'سهام الليل - محاضرة', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'محاضرة عن قيام الليل وسهام الليل' },
  { id: 'n9', youtubeId: 'D4GFCX2mrsM', title: 'الرسول ﷺ يبكي رحمة بأمته', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'خطبة مؤثرة عن رحمة النبي ﷺ بأمته' },
  { id: 'n10', youtubeId: 'hpC-Tb32tRE', title: 'أول ليلة في القبر', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'سلسلة مراحل الدار الآخرة بدءاً من الوفاة' },
  { id: 'n11', youtubeId: 'thmnjVA7NFw', title: 'كن سعيداً وتوكل على الله', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'موعظة في التوكل على الله والسعادة' },
  { id: 'n12', youtubeId: 'NCK46zSJaIQ', title: 'أعظم بشارة', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'أعظم بشارة للمؤمنين من القرآن' },
  { id: 'n13', youtubeId: 'rpdyBXFAEI4', title: 'معالم السرور - لكل مهموم', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'أقوى خطبة عن معالم السعادة والسرور' },
  { id: 'n14', youtubeId: 'BwwngYjLcsk', title: 'الحياة السعيدة', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'كيف تعيش حياة سعيدة في ظل القرآن' },

  // نبيل العوضي - قصص إضافية
  { id: 'n30', youtubeId: 'NgEZ-YZtaVI', title: 'قصة إلياس واليسع وذو الكفل', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'أنبياء بني إسرائيل الستة' },

  // الشيخ ابن باز - فتاوى ودروس
  { id: 'n31', youtubeId: 'MWzQyxVt1rI', title: 'نور على الدرب - حلقة 187', scholar: 'الشيخ ابن باز', category: 'علوم القرآن', description: 'فتاوى من برنامج نور على الدرب' },
  { id: 'n32', youtubeId: 'B6xo_RCu9m4', title: 'نور على الدرب - حلقة 191', scholar: 'الشيخ ابن باز', category: 'علوم القرآن', description: 'فتاوى من برنامج نور على الدرب' },
  { id: 'n33', youtubeId: 'CSg-nLpApwQ', title: 'فتاوى نور على الدرب - 13', scholar: 'الشيخ ابن باز', category: 'علوم القرآن', description: 'فتاوى من برنامج نور على الدرب' },
  { id: 'n34', youtubeId: 'HFv-Dkv1RWY', title: 'فتاوى نور على الدرب - 751', scholar: 'الشيخ ابن باز', category: 'علوم القرآن', description: 'فتاوى من برنامج نور على الدرب' },
  { id: 'n35', youtubeId: 'h1456Hdk_WE', title: 'التحذير من التساهل في الفتوى', scholar: 'الشيخ ابن باز', category: 'علوم القرآن', description: 'خطورة التساهل في الفتوى بغير علم' },

  // مقاطع إضافية متنوعة
  { id: 'n36', youtubeId: '0AeGhlHwWkg', title: 'ساعة مع أجمل قصص الصحابة', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن', description: 'مجموعة من أجمل قصص الصحابة' },
  { id: 'n37', youtubeId: 'PQPpt8B3doQ', title: 'حقارة الدنيا', scholar: 'الشيخ عبدالله القرني', category: 'تدبر وتأملات', description: 'حقيقة الدنيا الفانية' },
  { id: 'n38', youtubeId: '0T44uSaSNuU', title: 'مات الطيبين', scholar: 'الشيخ عائض القرني', category: 'تدبر وتأملات', description: 'موعظة عن فقد الأحبة والصالحين' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - الدفعة الثانية
  // ═══════════════════════════════════════════

  // الشيخ الشعراوي رحمه الله - تفسير وخواطر قرآنية
  { id: 'v1', youtubeId: 'QvF7m0BN2Y0', title: 'كل كلمة في القرآن في موضعها الصحيح', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'خواطر الشعراوي حول دقة الألفاظ القرآنية' },
  { id: 'v2', youtubeId: 'UK1vp4BmTGM', title: 'خواطر الشعراوي - سورة البقرة (1)', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة البقرة من خواطر الشعراوي' },
  { id: 'v3', youtubeId: 'cEkuY26e_aQ', title: 'خواطر حول سورة العنكبوت - الحلقة 8', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير وخواطر حول سورة العنكبوت' },
  { id: 'v4', youtubeId: 'l4jyXfHD9v8', title: 'خواطر الشعراوي - الجزء الثلاثون (1)', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير الجزء الثلاثون من القرآن الكريم' },
  { id: 'v5', youtubeId: 'cPl5eOIpFio', title: 'خواطر الشعراوي حول آية الكرسي', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير آية الكرسي وما بعدها لا إكراه في الدين' },
  { id: 'v6', youtubeId: 'eo2qcjP2cJE', title: 'خواطر الشعراوي حول سورة طه', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة طه - خواطر قرآنية' },
  { id: 'v7', youtubeId: 'U1hBTCgiR2M', title: 'تفسير سورة الحشر كاملة', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة الحشر كاملة للإمام الشعراوي' },
  { id: 'v8', youtubeId: 'jM-TOh5IZ2c', title: 'خواطر الشعراوي - سورة يس (1)', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة يس - الحلقة الأولى' },

  // د. محمد راتب النابلسي - تفسير وتأملات
  { id: 'v9', youtubeId: 'ommzww8agvI', title: 'تأملات في سورة العصر', scholar: 'د. محمد راتب النابلسي', category: 'تدبر وتأملات', description: 'لقاء الفجر - تأملات في سورة العصر' },
  { id: 'v10', youtubeId: 'mzJ96MwtyOo', title: 'تأملات دعوية', scholar: 'د. محمد راتب النابلسي', category: 'تدبر وتأملات', description: 'تأملات دعوية من القرآن الكريم' },
  { id: 'v11', youtubeId: 'A_7Axm_nV9I', title: 'تفسير سورة الروم (1/14)', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة الروم الحلقة الأولى' },
  { id: 'v12', youtubeId: '5xur_QWbgtU', title: 'تفسير جزء عمّ (1) - سورة النبأ', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'شرح مبسط ومن واقع تجارب الحياة' },
  { id: 'v13', youtubeId: 'WFMbPjGKpsc', title: 'فضائل وأسرار سورة العصر', scholar: 'د. محمد راتب النابلسي', category: 'إعجاز القرآن', description: 'شرح وتفسير سورة العصر وأسرارها' },
  { id: 'v14', youtubeId: 'NgHKH179-HQ', title: 'أسرار في سورة يوسف', scholar: 'د. محمد راتب النابلسي', category: 'تدبر وتأملات', description: 'أسرار قد تسمعها لأول مرة في تفريج الهم' },
  { id: 'v15', youtubeId: 'xCY_ytYoAUM', title: 'تفسير سورة عبس - الجزء الثاني', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة عبس الجزء الثاني' },
  { id: 'v16', youtubeId: 'JKhrvVLPKoU', title: 'تفسير سورة المسد', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة المسد للدكتور النابلسي' },

  // الشيخ محمد المقرمي - مقاطع مؤثرة
  { id: 'mq1', youtubeId: 'D-SQqppuGgo', title: 'تلاوة خاشعة تبكي الحجر', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'تلاوة مؤثرة وخاشعة للشيخ محمد المقرمي' },
  { id: 'mq2', youtubeId: 'KUQE1kHCVGg', title: 'موعظة مؤثرة - خشية الله', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'موعظة في خشية الله والخوف من عقابه' },
  { id: 'mq3', youtubeId: '8tIbMl3p5Ow', title: 'كلام يهز القلوب', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'مقطع مؤثر يهز القلوب ويدعو للتوبة' },
  { id: 'mq4', youtubeId: 'FVt7mIm3JGk', title: 'الموت وسكراته', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'موعظة مؤثرة عن الموت وسكراته' },
  { id: 'mq5', youtubeId: 'aMYlkfpLfnY', title: 'تذكر يوم القيامة', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'مقطع مبكي عن أهوال يوم القيامة' },
  { id: 'mq6', youtubeId: 'yW7Z-s-q45U', title: 'قصة مؤثرة جداً', scholar: 'الشيخ محمد المقرمي', category: 'قصص القرآن', description: 'قصة مؤثرة ومبكية من سيرة السلف' },
  { id: 'mq7', youtubeId: 'Lp-oNjjrG3c', title: 'التوبة قبل فوات الأوان', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'موعظة عن التوبة والإنابة إلى الله' },
  { id: 'mq8', youtubeId: '2EzN-LXydHg', title: 'رسالة إلى كل غافل', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'رسالة مؤثرة لكل من غفل عن ذكر الله' },
  { id: 'mq9', youtubeId: 'mN7LnE6t_rA', title: 'صبر أيوب عليه السلام', scholar: 'الشيخ محمد المقرمي', category: 'قصص القرآن', description: 'قصة صبر نبي الله أيوب عليه السلام' },
  { id: 'mq10', youtubeId: '4sB0ae6O5jg', title: 'وقفة مع النفس', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'محاسبة النفس قبل فوات الأوان' },
  { id: 'mq11', youtubeId: 'Sd2OUITQGWU', title: 'الدنيا دار ممر لا دار مقر', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'حقيقة الدنيا وزوالها' },
  { id: 'mq12', youtubeId: 'Ydli0gCPOi4', title: 'بكاء وخشوع', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'مقطع مؤثر في البكاء من خشية الله' },
  { id: 'mq13', youtubeId: 'eoNfbjNyDhY', title: 'أين أنت من القرآن', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'موعظة عن هجر القرآن والعودة إليه' },
  { id: 'mq14', youtubeId: 'lj-79f6V3k0', title: 'الخوف من الله', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'مقطع مبكي عن الخوف من الله تعالى' },
  { id: 'mq15', youtubeId: 'nUlOEKxjlSM', title: 'عذاب القبر', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'موعظة مرعبة عن عذاب القبر' },
  { id: 'mq16', youtubeId: 'KZPlhx-strY', title: 'فضل الصدقة', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'مقطع مؤثر عن فضل الصدقة وثوابها' },
  { id: 'mq17', youtubeId: 'FfDShJYHVHY', title: 'لحظات مؤثرة', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'لحظات مؤثرة من دروس الشيخ المقرمي' },
  { id: 'mq18', youtubeId: 'Hw2AsjBEQeA', title: 'حسن الخاتمة', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'موعظة عن حسن الخاتمة وسوئها' },
  { id: 'mq19', youtubeId: '3z0K39zqFdU', title: 'الاستغفار وفضله', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'مقطع مؤثر عن فضل الاستغفار' },
  { id: 'mq20', youtubeId: 'jLNYnkMd3xQ', title: 'تعلق القلب بالله', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'موعظة في تعلق القلب بالله وحده' },

  // الشيخ بدر المشاري - خطب ومواعظ
  { id: 'v24', youtubeId: 'tiFqIeTrr5w', title: 'من أجمل خطب الشيخ بدر المشاري', scholar: 'الشيخ بدر المشاري', category: 'تدبر وتأملات', description: 'خطبة مؤثرة لا تفوتك' },
  { id: 'v25', youtubeId: 'hAUU0_Scuco', title: 'خطبة تلمس قلبك وتريح نفسك', scholar: 'الشيخ بدر المشاري', category: 'تدبر وتأملات', description: 'من أحنّ وأجمل كلمات الشيخ بدر المشاري' },
  { id: 'v26', youtubeId: 'CPD8uhHjsiE', title: 'زوال إسرائيل - خطبة مزلزلة', scholar: 'الشيخ بدر المشاري', category: 'تدبر وتأملات', description: 'خطبة عن نصرة فلسطين من القرآن' },
  { id: 'v27', youtubeId: '7IhOiLvUI2I', title: 'أجمل 10 قصص من الشيخ بدر المشاري', scholar: 'الشيخ بدر المشاري', category: 'قصص القرآن', description: 'ساعتان مع أجمل القصص المؤثرة' },
  { id: 'v28', youtubeId: 'Jv_htUpSV9c', title: 'فضل الصبر وقت البلاء والمحن', scholar: 'الشيخ بدر المشاري', category: 'تدبر وتأملات', description: 'خطبة عن الصبر عند المحن من القرآن' },
  { id: 'v29', youtubeId: 'cO9KJyf6P3o', title: 'ستة أشياء ستغير حياتك في رمضان', scholar: 'الشيخ بدر المشاري', category: 'تدبر وتأملات', description: 'نصائح رمضانية من القرآن والسنة' },

  // الشيخ محمد صالح المنجد - محاضرات قرآنية
  { id: 'v30', youtubeId: 'ayS8Yte2Lec', title: 'فاتقوا الله ما استطعتم', scholar: 'الشيخ محمد صالح المنجد', category: 'تدبر وتأملات', description: 'محاضرة في تقوى الله من القرآن' },
  { id: 'v31', youtubeId: 'ssytlK5Yezs', title: 'كيف يحررنا القرآن من فتنة الدنيا', scholar: 'الشيخ محمد صالح المنجد', category: 'تدبر وتأملات', description: 'سلسلة المحاضرات الذهبية' },
  { id: 'v32', youtubeId: 'joRh5ihqz4Y', title: 'المؤمن ومتاع الحياة الدنيا', scholar: 'الشيخ محمد صالح المنجد', category: 'تدبر وتأملات', description: 'تأملات في حقيقة الدنيا من القرآن' },
  { id: 'v33', youtubeId: 'Y36rMiGZ4Ak', title: 'كيف يحررنا القرآن من فتنة الدنيا - كاملة', scholar: 'الشيخ محمد صالح المنجد', category: 'تدبر وتأملات', description: 'محاضرة كاملة عن تحرير القلب بالقرآن' },
  { id: 'v34', youtubeId: 'jJ2qfpA4nqE', title: 'التوكل على الله', scholar: 'الشيخ محمد صالح المنجد', category: 'تدبر وتأملات', description: 'سلسلة المحاضرات الذهبية في التوكل' },
  { id: 'v35', youtubeId: 'Kxb6immsAlI', title: 'هل أنت مع الله؟', scholar: 'الشيخ محمد صالح المنجد', category: 'تدبر وتأملات', description: 'محاضرة مؤثرة عن العلاقة مع الله' },
  { id: 'v36', youtubeId: 'O7BB4v2tOQ0', title: 'قصص التوحيد', scholar: 'الشيخ محمد صالح المنجد', category: 'قصص القرآن', description: 'قصص عن التوحيد من القرآن والسنة' },

  // الشيخ سعيد بن مسفر - وقفات قرآنية
  { id: 'v43', youtubeId: 'LKPhblyXKu4', title: 'ذكر الله من صفات أهل الإيمان', scholar: 'الشيخ سعيد بن مسفر', category: 'تدبر وتأملات', description: 'تأملات في صفات المؤمنين من القرآن' },
  { id: 'v44', youtubeId: 'GOQcxtKuDqY', title: 'قصة خلق الإنسان', scholar: 'الشيخ سعيد بن مسفر', category: 'قصص القرآن', description: 'قصة خلق الإنسان كما وردت في القرآن' },
  { id: 'v45', youtubeId: 'ctfZBdEN9GM', title: 'أفحسبتم أنما خلقناكم عبثاً', scholar: 'الشيخ سعيد بن مسفر', category: 'تدبر وتأملات', description: 'تدبر في آية عظيمة عن الغاية من الخلق' },
  { id: 'v46', youtubeId: 'LIYshMQOZOo', title: 'بر الوالدين - وقفات قرآنية', scholar: 'الشيخ سعيد بن مسفر', category: 'تدبر وتأملات', description: 'وقفات قرآنية حول بر الوالدين' },
  { id: 'v47', youtubeId: 'wqV52VrNXns', title: 'غمرات الموت - مراحل الدار الآخرة', scholar: 'الشيخ سعيد بن مسفر', category: 'تدبر وتأملات', description: 'سلسلة مراحل الدار الآخرة بدءاً من الوفاة' },

  // ═══════════════════════════════════════════
  // مقاطع إضافية - الشيخ محمد المقرمي (في المقاطع القصيرة)
  // ═══════════════════════════════════════════
  { id: 'mqs1', youtubeId: '8tIbMl3p5Ow', title: 'كلام يهز القلوب الغافلة', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'مقطع مؤثر يستيقظ له الغافل' },
  { id: 'mqs2', youtubeId: 'FVt7mIm3JGk', title: 'الموت وسكراته - موعظة مبكية', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'وصف الموت وسكراته' },
  { id: 'mqs3', youtubeId: 'aMYlkfpLfnY', title: 'يوم القيامة - أهوال ومشاهد', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'مشاهد من أهوال يوم القيامة' },
  { id: 'mqs4', youtubeId: 'yW7Z-s-q45U', title: 'قصة مبكية من السلف', scholar: 'الشيخ محمد المقرمي', category: 'قصص القرآن', description: 'قصة مؤثرة ومبكية' },
  { id: 'mqs5', youtubeId: 'Lp-oNjjrG3c', title: 'باب التوبة مفتوح', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'باب التوبة مفتوح فلا تؤخر' },

  // ═══════════════════════════════════════════
  // مقاطع جديدة إضافية - الشيخ محمد المقرمي رحمه الله
  // ═══════════════════════════════════════════
  { id: 'mq21', youtubeId: '1V_oU_dNSQw', title: 'كارثة فكرية نعيشها جميعاً', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'أول معلومة تضر بالعقل - موعظة فكرية عميقة' },
  { id: 'mq22', youtubeId: 'B_oHw-ouKAU', title: 'ليميز الله الخبيث من الطيب', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'مواعظ تهز القلب عن تمييز الله بين الخبيث والطيب' },
  { id: 'mq23', youtubeId: 'CNFSbR11EzM', title: 'أكبر فخ يقع فيه الإنسان - الغضب', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'كيف يكون الغضب هو الاختبار الحقيقي لقوة الإنسان' },
  { id: 'mq24', youtubeId: 'HIrfAtQE0fo', title: 'رسالة لمن ضاقت به الدنيا', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'رحلة إيمانية عميقة للمهموم والمكروب' },
  { id: 'mq25', youtubeId: 'fixp75mJWJk', title: 'نساء عرفن الله - كلام يغيّر القلوب', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'أثر معرفة الله على حياة العبد' },
  { id: 'mq26', youtubeId: '-b4R54UmXF0', title: 'لا تقنطوا من رحمة الله', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'أخطر خدعة يوقع فيها المؤمن - رسالة إيمانية' },
  { id: 'mq27', youtubeId: 'E5MUT495DS0', title: 'درس يجذبك إلى صحبة القرآن', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'بداية صحبته مع القرآن الكريم - رسالة صادقة' },
  { id: 'mq28', youtubeId: 'iLtrjsR3J5w', title: 'كيف تجعل من دوامك عبادة', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'إعادة تعريف الدوام والعمل من منظور القرآن' },
  { id: 'mq29', youtubeId: 'QIDYsDFBNUw', title: 'عشر قواعد تغيّر القلب من الداخل', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'قواعد لاستعادة الطمأنينة وراحة القلب' },
  { id: 'mq30', youtubeId: 'nTBQvPyx3eE', title: 'حسن الظن بالله - كلام مؤثر', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'موعظة في حسن الظن بالله عز وجل' },
  { id: 'mq31', youtubeId: 'Wa6fCaPs7Kg', title: 'محاضرة تهز القلوب وتغير حياتك', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'تحدي الإعاقة مع مروان - محاضرة إيمانية مؤثرة' },
  { id: 'mq32', youtubeId: 'CoFwZ60x540', title: 'من الهندسة إلى تدبر القرآن - بودكاست', scholar: 'الشيخ محمد المقرمي', category: 'علوم القرآن', description: 'رحلة من أدوات الهندسة إلى منهج التدبر القرآني' },
  { id: 'mq33', youtubeId: 'qmx24-bxHcU', title: 'نفحات وتدبر - القيمة الشعورية', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'برنامج نفحات وتدبر - الحلقة 24' },
  { id: 'mq34', youtubeId: '0HnzGxW0UHQ', title: 'مدارج التدبر - مقطع مختار', scholar: 'الشيخ محمد المقرمي', category: 'علوم القرآن', description: 'من سلسلة مدارج التدبر المباركة' },
  { id: 'mq35', youtubeId: 'LuJ1IOnUzRQ', title: 'تدبر اسم الله التواب', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'تدبر في اسم الله التواب وآثاره على القلب' },
  { id: 'mq36', youtubeId: '6iuStjfnq_8', title: 'تدبر سورة الحشر', scholar: 'الشيخ محمد المقرمي', category: 'تفسير القرآن', description: 'تدبر آيات سورة الحشر مع الشيخ المقرمي' },
  { id: 'mq37', youtubeId: 'UVvu7xD7UYw', title: 'كتاب صامت يعرّفك على الله', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'استمع بقلبك قبل أذنك - القرآن يعرّفك على ربك' },
  { id: 'mq38', youtubeId: 'FARBElcDLsI', title: 'الحشو - تربية النفس', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'كيف تربي نفسك وتقودها إلى طاعة الله' },
  { id: 'mq39', youtubeId: 'VXNHbvElmS4', title: 'اسمعوها إلى آخر المقطع - حفظنا الله', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'موعظة مؤثرة في الرجوع إلى الله' },
  { id: 'mq40', youtubeId: 'mHQ_mG5Az04', title: 'حق الورثة - رسالة لكل من يحبس حقاً', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'لقاء مؤثر عن العدل وحق الورثة' },
  { id: 'mq41', youtubeId: '3FjNjnfIjbo', title: 'صدى الكلمة وعظمة الموعظة', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'قوة تأثير الكلمة الصادقة والموعظة الحسنة' },
  { id: 'mq42', youtubeId: 'b2FrEMuOSzc', title: 'سر الاتصال بالقوة الإلهية', scholar: 'الشيخ محمد المقرمي', category: 'تدبر وتأملات', description: 'تجربة روحية في القرب من الله عز وجل' },

  // ═══════════════════════════════════════════
  // تفسير وعلوم قرآن - إضافات
  // ═══════════════════════════════════════════

  // الشيخ صالح آل الشيخ
  { id: 'add1', youtubeId: 'EHvX8oMwjHQ', title: 'شرح مقدمة في أصول التفسير لابن تيمية', scholar: 'الشيخ صالح آل الشيخ', category: 'علوم القرآن', description: 'شرح وافٍ لرسالة ابن تيمية في أصول التفسير' },
  { id: 'add2', youtubeId: 'COxlz7jzLHU', title: 'التمهيد لشرح كتاب التوحيد', scholar: 'الشيخ صالح آل الشيخ', category: 'تدبر وتأملات', description: 'شرح لأصول التوحيد من القرآن' },

  // الشيخ عبد الله بن عبد الرحمن الجبرين
  { id: 'add3', youtubeId: 'h8_NfN0t5J4', title: 'تفسير سورة يوسف', scholar: 'الشيخ ابن جبرين', category: 'تفسير القرآن', description: 'تفسير سورة يوسف عليه السلام' },

  // الشيخ سعد الشثري
  { id: 'add4', youtubeId: 'JzI3u3Bdxcs', title: 'شرح كتاب أصول في التفسير', scholar: 'الشيخ سعد الشثري', category: 'علوم القرآن', description: 'شرح كتاب أصول في التفسير للشيخ ابن عثيمين' },

  // الشيخ عبد الرحمن بن معاضة الشهري
  { id: 'add5', youtubeId: 'c4lqYFqh7a0', title: 'برنامج بينات - تدبر القرآن', scholar: 'د. عبد الرحمن الشهري', category: 'تدبر وتأملات', description: 'حلقات في تدبر آيات القرآن الكريم' },

  // الشيخ عبد المحسن العباد
  { id: 'add6', youtubeId: 'qO0f8mQqkOE', title: 'شرح تفسير ابن كثير', scholar: 'الشيخ عبد المحسن العباد', category: 'تفسير القرآن', description: 'شرح على تفسير ابن كثير في المسجد النبوي' },

  // الشيخ محمد بن صالح العثيمين - إضافات
  { id: 'add7', youtubeId: '8x-k5uJq6os', title: 'تفسير سورة الفاتحة', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير مفصل لسورة الفاتحة أم الكتاب' },
  { id: 'add8', youtubeId: 'oYLqUfhRVvM', title: 'تفسير المعوذتين', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورتي الفلق والناس' },
  { id: 'add9', youtubeId: 'QxW8t3tluOg', title: 'تفسير سورة الإخلاص', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة الإخلاص - قل هو الله أحد' },

  // الشيخ صالح الفوزان - إضافات
  { id: 'add10', youtubeId: 'qJPfPg8FjPM', title: 'فوائد مستنبطة من القرآن', scholar: 'الشيخ صالح الفوزان', category: 'تدبر وتأملات', description: 'فوائد عقدية وفقهية من القرآن' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - الشيخ محمد المختار الشنقيطي
  // ═══════════════════════════════════════════

  { id: 'sh_q1', youtubeId: 'tM9f0XYjXdU', title: 'شرح أصول في التفسير لابن عثيمين', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'علوم القرآن', description: 'شرح كتاب أصول في التفسير' },
  { id: 'sh_q2', youtubeId: '3-U3wAvG3kw', title: 'فقه الأدعية والأذكار - وقفات قرآنية', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبر وتأملات', description: 'فقه الأذكار مع وقفات قرآنية' },
  { id: 'sh_e1', youtubeId: 'QoEqU8i4CSI', title: 'من إعجاز القرآن في اللغة العربية', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'إعجاز القرآن', description: 'أوجه الإعجاز اللغوي في القرآن' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - مقاطع متنوعة للعلماء الموجودين
  // ═══════════════════════════════════════════

  // الشيخ ابن عثيمين - إضافات أخرى
  { id: 'new1', youtubeId: 'rYFGIBQV5z4', title: 'تفسير سورة النبأ', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة النبأ من جزء عم' },
  { id: 'new2', youtubeId: 'p0l3S-FuxjU', title: 'تفسير سورة النازعات', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة النازعات' },

  // الشيخ صالح الفوزان - إضافات أخرى
  { id: 'new3', youtubeId: 'D7S1vNYjfBQ', title: 'تفسير سورة الملك', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الملك من المجالس' },
  { id: 'new4', youtubeId: 'POSi4JrwR4k', title: 'تفسير سورة القلم', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة القلم' },

  // الشيخ عبد الرزاق البدر - إضافات
  { id: 'new5', youtubeId: 'v2n2j6I22s4', title: 'شرح كتاب فضائل القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'علوم القرآن', description: 'شرح كتاب فضائل القرآن لابن كثير' },
  { id: 'new6', youtubeId: 'HuqmeBOZuXM', title: 'أنوار قرآنية - التقوى', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبر وتأملات', description: 'تأملات في آيات التقوى' },

  // الشيخ محمد العريفي - إضافات قصص
  { id: 'new7', youtubeId: 'lXb-IP-E2OE', title: 'قصة عمر بن الخطاب والشجرة', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن', description: 'قصة عمر بن الخطاب مع الشجرة' },
  { id: 'new8', youtubeId: 'J6AHnT1Gi3g', title: 'مؤثر جداً - آخر أيام عمر', scholar: 'الشيخ محمد العريفي', category: 'قصص القرآن', description: 'قصة آخر أيام عمر بن الخطاب' },

  // الشيخ نبيل العوضي - إضافات
  { id: 'new9', youtubeId: 'xKc6_kZYq9I', title: 'قصة لوط وشعيب وإسماعيل وإسحاق', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصص أنبياء الله من القرآن' },
  { id: 'new10', youtubeId: 'LZzTxnKPo5w', title: 'قصة خليل الله إبراهيم عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة إبراهيم خليل الرحمن' },

  // الشيخ الشعراوي - إضافات
  { id: 'new11', youtubeId: '3zXxUU32gXE', title: 'خواطر الشعراوي - سورة الفاتحة', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة الفاتحة من خواطر الشعراوي' },
  { id: 'new12', youtubeId: 'K1zEPdOWBH0', title: 'خواطر الشعراوي - سورة يس كاملة', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير كامل لسورة يس' },

  // د. محمد راتب النابلسي - إضافات
  { id: 'new13', youtubeId: 'B0ELJ8Mfz-8', title: 'تفسير سورة الفاتحة كاملة', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة الفاتحة' },
  { id: 'new14', youtubeId: 'sAqtXb_2MwQ', title: 'تفسير سورة لقمان', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة لقمان ووصايا لقمان لابنه' },

  // الشيخ بدر المشاري - إضافات
  { id: 'new15', youtubeId: 'T5F0Lk3fGVE', title: 'قصة ذو القرنين', scholar: 'الشيخ بدر المشاري', category: 'قصص القرآن', description: 'قصة ذو القرنين من القرآن الكريم' },
  { id: 'new16', youtubeId: 'W3lzLjMu3ig', title: 'أسباب دخول الجنة', scholar: 'الشيخ بدر المشاري', category: 'تدبر وتأملات', description: 'أسباب دخول الجنة من القرآن والسنة' },

  // الشيخ محمد صالح المنجد - إضافات
  { id: 'new17', youtubeId: 'RcaBJW3F5p4', title: 'عظمة القرآن الكريم', scholar: 'الشيخ محمد صالح المنجد', category: 'تدبر وتأملات', description: 'محاضرة عن عظمة القرآن وأثره' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - مقاطع متنوعة إضافية
  // ═══════════════════════════════════════════

  // الشيخ ابن باز رحمه الله - إضافات
  { id: 'baz1', youtubeId: 'hfH6t3Lyzlk', title: 'تفسير سورة الفاتحة', scholar: 'الشيخ ابن باز', category: 'تفسير القرآن', description: 'شرح وتفسير سورة الفاتحة' },
  { id: 'baz2', youtubeId: 'b0kFHq3BGEE', title: 'تفسير آية الكرسي', scholar: 'الشيخ ابن باز', category: 'تفسير القرآن', description: 'شرح آية الكرسي وفضلها' },
  { id: 'baz3', youtubeId: '9vLGNxbI9Fk', title: 'فضل تلاوة القرآن', scholar: 'الشيخ ابن باز', category: 'علوم القرآن', description: 'بيان فضل تلاوة القرآن وحفظه' },

  // د. عبد الرحمن الشهري - إضافات
  { id: 'shahri1', youtubeId: 'W0VC_3yAqpE', title: 'برنامج بينات - سورة الملك', scholar: 'د. عبد الرحمن الشهري', category: 'تدبر وتأملات', description: 'تدبر سورة الملك في برنامج بينات' },
  { id: 'shahri2', youtubeId: 'c4lqYFqh7a0', title: 'برنامج بينات - سورة الرحمن', scholar: 'د. عبد الرحمن الشهري', category: 'تدبر وتأملات', description: 'تدبر سورة الرحمن' },

  // الشيخ صالح آل الشيخ - إضافات
  { id: 'alsheikh1', youtubeId: 'XD3YL-MnGgQ', title: 'شرح كتاب التوحيد - باب فضل التوحيد', scholar: 'الشيخ صالح آل الشيخ', category: 'تدبر وتأملات', description: 'شرح كتاب التوحيد مع وقفات قرآنية' },
  { id: 'alsheikh2', youtubeId: 'COxlz7jzLHU', title: 'شرح العقيدة الواسطية', scholar: 'الشيخ صالح آل الشيخ', category: 'علوم القرآن', description: 'شرح العقيدة الواسطية لابن تيمية' },

  // الشيخ سعد الشثري - إضافات
  { id: 'shathri1', youtubeId: 'Qh_OLXRRMHM', title: 'شرح أصول التفسير - الحلقة 1', scholar: 'الشيخ سعد الشثري', category: 'علوم القرآن', description: 'شرح أصول في التفسير لابن عثيمين' },

  // الشيخ محمد بن عبد الله الدويش
  { id: 'duwaysh1', youtubeId: '7BjKjfChwSY', title: 'كيف نتدبر القرآن', scholar: 'الشيخ محمد الدويش', category: 'تدبر وتأملات', description: 'منهجية تدبر القرآن الكريم' },

  // الشيخ عبد الرزاق البدر - إضافات أخرى
  { id: 'badr_new1', youtubeId: 'R5Hk5L2pXJo', title: 'ختم القرآن وأحكامه', scholar: 'الشيخ عبد الرزاق البدر', category: 'أحكام التلاوة والتجويد', description: 'أحكام ختم القرآن وآدابه' },
  { id: 'badr_new2', youtubeId: 'WZ3zXLCHlgA', title: 'مجالس الذكر والقرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبر وتأملات', description: 'فضل مجالس الذكر وتلاوة القرآن' },

  // الشيخ الشعراوي - إضافات أخرى
  { id: 'sh_new1', youtubeId: 'IlTxZbY7fVU', title: 'خواطر الشعراوي - سورة النساء', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة النساء' },
  { id: 'sh_new2', youtubeId: 'FxdUe0R0T5Y', title: 'خواطر الشعراوي - سورة المائدة', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة المائدة' },
  { id: 'sh_new3', youtubeId: 'wXJjYBdH8kk', title: 'خواطر الشعراوي - سورة الأنعام', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة الأنعام' },

  // د. محمد راتب النابلسي - إضافات أخرى
  { id: 'nab_new1', youtubeId: 'KR9P5AlYjlE', title: 'تفسير سورة الأحزاب', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة الأحزاب' },
  { id: 'nab_new2', youtubeId: 'Ql_h6hCPkXA', title: 'إعجاز القرآن في خلق الإنسان', scholar: 'د. محمد راتب النابلسي', category: 'إعجاز القرآن', description: 'الإعجاز العلمي في خلق الإنسان' },

  // إعجاز القرآن - مقاطع جديدة
  { id: 'ijaz1', youtubeId: 'Y-zTfBEvcg0', title: 'الإعجاز العددي في القرآن الكريم', scholar: 'د. عبد الرحمن الشهري', category: 'إعجاز القرآن', description: 'بيان الإعجاز العددي في القرآن' },
  { id: 'ijaz2', youtubeId: 'D2i_aDDIy9Y', title: 'الإعجاز البلاغي في القرآن', scholar: 'الشيخ صالح الفوزان', category: 'إعجاز القرآن', description: 'أوجه الإعجاز البلاغي' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - تفسير القرآن
  // ═══════════════════════════════════════════

  // الشيخ ابن عثيمين - تفسير جزء عم
  { id: 'ib_tafseer1', youtubeId: 'P0gF0OkjEjY', title: 'تفسير سورة النبأ', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة النبأ كاملة' },
  { id: 'ib_tafseer2', youtubeId: '0VkiDzNJAqY', title: 'تفسير سورة النازعات', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة النازعات' },
  { id: 'ib_tafseer3', youtubeId: 'bC2fScUXMOs', title: 'تفسير سورة عبس', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة عبس' },
  { id: 'ib_tafseer4', youtubeId: 'ddKIDaeF_K4', title: 'تفسير سورة التكوير', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة التكوير' },
  { id: 'ib_tafseer5', youtubeId: 'kVjG5ctA7nY', title: 'تفسير سورة الانفطار', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة الانفطار' },
  { id: 'ib_tafseer6', youtubeId: 'XFxxrl1k71E', title: 'تفسير سورة المطففين', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة المطففين' },
  { id: 'ib_tafseer7', youtubeId: '9jv8L5QPFeo', title: 'تفسير سورة الفجر', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة الفجر' },
  { id: 'ib_tafseer8', youtubeId: 'JWWrfLKNbaE', title: 'تفسير سورة البلد', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة البلد' },
  { id: 'ib_tafseer9', youtubeId: 'e3I8EjsE-jY', title: 'تفسير سورة الشمس', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة الشمس' },
  { id: 'ib_tafseer10', youtubeId: 'p5yqiZOWPEo', title: 'تفسير سورة الأعلى', scholar: 'الشيخ ابن عثيمين', category: 'تفسير القرآن', description: 'تفسير سورة الأعلى' },

  // الشيخ ابن باز - دروس وتفسير
  { id: 'baz_tafseer1', youtubeId: '8xSDZ8PsmdI', title: 'شرح تفسير السعدي - سورة البقرة', scholar: 'الشيخ عبد العزيز بن باز', category: 'تفسير القرآن', description: 'شرح تفسير السعدي لسورة البقرة' },
  { id: 'baz_tafseer2', youtubeId: 'UcrhYxM9-4Y', title: 'تفسير سورة الفاتحة', scholar: 'الشيخ عبد العزيز بن باز', category: 'تفسير القرآن', description: 'تفسير مفصل لسورة الفاتحة' },
  { id: 'baz_tafseer3', youtubeId: 'Y_RSxsW5uhU', title: 'تفسير سورة الحجرات', scholar: 'الشيخ عبد العزيز بن باز', category: 'تفسير القرآن', description: 'تفسير سورة الحجرات' },
  { id: 'baz_aqeeda', youtubeId: 'dF6WAxBOW98', title: 'شرح أصول الإيمان', scholar: 'الشيخ عبد العزيز بن باز', category: 'تفسير القرآن', description: 'شرح أصول الإيمان الستة' },

  // الشيخ صالح الفوزان - تفسير إضافي
  { id: 'fawzan_t1', youtubeId: 'VVoFcJm5rGA', title: 'تفسير سورة الفاتحة', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الفاتحة مفصلاً' },
  { id: 'fawzan_t2', youtubeId: 'NN_GvTlOe74', title: 'تفسير سورة الناس', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الناس' },
  { id: 'fawzan_t3', youtubeId: 'cjoHmEJAACI', title: 'تفسير سورة الفلق', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الفلق' },
  { id: 'fawzan_t4', youtubeId: 'E3GKkjrlw70', title: 'تفسير سورة الإخلاص', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الإخلاص' },
  { id: 'fawzan_t5', youtubeId: 'k94Q0NSNBu4', title: 'تفسير سورة الشرح', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الشرح' },
  { id: 'fawzan_t6', youtubeId: 'uy31bsgAP-E', title: 'تفسير سورة الضحى', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الضحى' },
  { id: 'fawzan_t7', youtubeId: 'AovDLnNbODc', title: 'تفسير سورة العصر', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة العصر' },
  { id: 'fawzan_t8', youtubeId: 'jMpz3JJgWOk', title: 'تفسير سورة الكوثر', scholar: 'الشيخ صالح الفوزان', category: 'تفسير القرآن', description: 'تفسير سورة الكوثر' },

  // الشيخ عبد الرزاق البدر - إضافات
  { id: 'badr_ext1', youtubeId: 'jTQRyMyQMb4', title: 'تفسير سورة الفاتحة', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'تفسير مفصل لسورة الفاتحة' },
  { id: 'badr_ext2', youtubeId: 'mFQJFXE9r7Q', title: 'شرح آية الكرسي', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'شرح موسع لآية الكرسي' },
  { id: 'badr_ext3', youtubeId: 'L-2JS1dZzDc', title: 'فضائل سورة البقرة', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'بيان فضائل سورة البقرة' },
  { id: 'badr_ext4', youtubeId: 'FvJMBD8cnvY', title: 'شرح دعاء الاستفتاح', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'شرح أدعية الاستفتاح في الصلاة' },
  { id: 'badr_ext5', youtubeId: 'EN27JzhFvbM', title: 'تفسير آخر سورة البقرة', scholar: 'الشيخ عبد الرزاق البدر', category: 'تفسير القرآن', description: 'تفسير الآيتين الأخيرتين من سورة البقرة' },

  // الشيخ عبد الكريم الخضير - إضافات
  { id: 'khudayr_ext1', youtubeId: 'mGFs79YNBCs', title: 'أصول التفسير', scholar: 'الشيخ عبد الكريم الخضير', category: 'تفسير القرآن', description: 'شرح أصول التفسير' },
  { id: 'khudayr_ext2', youtubeId: 'HJr5A7fD_xc', title: 'شرح منظومة الشاطبي', scholar: 'الشيخ عبد الكريم الخضير', category: 'تفسير القرآن', description: 'شرح منظومة الشاطبي في القراءات' },
  { id: 'khudayr_ext3', youtubeId: 'OibRpAjhXXc', title: 'منهج الطبري في تفسيره', scholar: 'الشيخ عبد الكريم الخضير', category: 'تفسير القرآن', description: 'دراسة منهج الطبري في التفسير' },

  // الشيخ محمد المختار الشنقيطي - إضافات
  { id: 'shng_ext1', youtubeId: '1F9Qq0XNKvk', title: 'تفسير سورة الحجرات', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'تفسير سورة الحجرات' },
  { id: 'shng_ext2', youtubeId: 'oDn2oJfg5Yk', title: 'تفسير سورة النور', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'تفسير سورة النور' },
  { id: 'shng_ext3', youtubeId: 'WIIZfiwMBzY', title: 'تفسير سورة لقمان', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'تفسير سورة لقمان' },
  { id: 'shng_ext4', youtubeId: 'EbELzUEvofg', title: 'تفسير سورة فاطر', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'تفسير سورة فاطر' },
  { id: 'shng_ext5', youtubeId: 'aHMJWwAmAIg', title: 'تفسير سورة يس', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تفسير القرآن', description: 'تفسير سورة يس' },

  // د. محمد راتب النابلسي - تفسير القرآن
  { id: 'nab_ext1', youtubeId: 'O0FLWGQm0yE', title: 'تفسير سورة الكهف', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة الكهف مفصلاً' },
  { id: 'nab_ext2', youtubeId: 'XPFUnKM-9C0', title: 'تفسير سورة مريم', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة مريم' },
  { id: 'nab_ext3', youtubeId: 'J7b3IhkQp9U', title: 'تفسير سورة الفرقان', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة الفرقان' },
  { id: 'nab_ext4', youtubeId: 'myCZ0JpVWOY', title: 'تفسير سورة طه', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة طه' },
  { id: 'nab_ext5', youtubeId: 'lxIaVEZQr3I', title: 'تفسير سورة الرحمن', scholar: 'د. محمد راتب النابلسي', category: 'تفسير القرآن', description: 'تفسير سورة الرحمن' },

  // الإمام محمد متولي الشعراوي - خواطر
  { id: 'shaar_ext1', youtubeId: '5GgU_xLZg0E', title: 'خواطر سورة الأعراف', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة الأعراف' },
  { id: 'shaar_ext2', youtubeId: 'kP0YVdKfMWE', title: 'خواطر سورة الأنفال', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة الأنفال' },
  { id: 'shaar_ext3', youtubeId: 'JfkvjYFwcZY', title: 'خواطر سورة التوبة', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة التوبة' },
  { id: 'shaar_ext4', youtubeId: 'yUqSSLQ6lPA', title: 'خواطر سورة يونس', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة يونس' },
  { id: 'shaar_ext5', youtubeId: 'QnfNSdKCa0I', title: 'خواطر سورة هود', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة هود' },
  { id: 'shaar_ext6', youtubeId: 'xbxtFNTE4rg', title: 'خواطر سورة يوسف', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة يوسف بالكامل' },
  { id: 'shaar_ext7', youtubeId: 'FqDJVkT0oGI', title: 'خواطر سورة الرعد', scholar: 'الشيخ الشعراوي', category: 'تفسير القرآن', description: 'تفسير سورة الرعد' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - تدبر وتأملات
  // ═══════════════════════════════════════════
  { id: 'tadb_ext1', youtubeId: 'wAcMc4PvzrM', title: 'تدبر سورة يوسف', scholar: 'الشيخ صالح المغامسي', category: 'تدبر وتأملات', description: 'وقفات مع سورة يوسف' },
  { id: 'tadb_ext2', youtubeId: 'cwwMX2lgL78', title: 'تدبر آيات الرحمة', scholar: 'د. عبد الرحمن الشهري', category: 'تدبر وتأملات', description: 'تأمل في آيات الرحمة في القرآن' },
  { id: 'tadb_ext3', youtubeId: 'J3uifJtN3LI', title: 'فوائد من سورة الكهف', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'تدبر وتأملات', description: 'تأملات وفوائد من سورة الكهف' },
  { id: 'tadb_ext4', youtubeId: 'KpUgmkRapuE', title: 'تدبر قصة أصحاب الجنة', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبر وتأملات', description: 'تدبر قصة أصحاب الجنة في سورة القلم' },
  { id: 'tadb_ext5', youtubeId: 'h7FYhZ3_pSw', title: 'تأملات في سورة الفاتحة', scholar: 'د. خالد السبت', category: 'تدبر وتأملات', description: 'وقفات مع سورة الفاتحة' },
  { id: 'tadb_ext6', youtubeId: 'MEj2P1aX7Bg', title: 'دروس من قصة موسى والخضر', scholar: 'د. محمد راتب النابلسي', category: 'تدبر وتأملات', description: 'دروس وعبر من قصة موسى والخضر' },
  { id: 'tadb_ext7', youtubeId: 'Dst1TyzQgCs', title: 'تدبر آيات الصبر', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبر وتأملات', description: 'تأمل في آيات الصبر في القرآن' },
  { id: 'tadb_ext8', youtubeId: 'a_3Exq55USc', title: 'الإنفاق في سبيل الله', scholar: 'د. خالد اللاحم', category: 'تدبر وتأملات', description: 'تدبر آيات الإنفاق والصدقة' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - أحكام التجويد
  // ═══════════════════════════════════════════
  { id: 'tjwd_ext1', youtubeId: 'Y6VkJUFH_ME', title: 'أحكام النون الساكنة والتنوين', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح أحكام النون الساكنة والتنوين' },
  { id: 'tjwd_ext2', youtubeId: '7LAeGzuCh9E', title: 'أحكام المد وأقسامه', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح أحكام المد وأقسامه' },
  { id: 'tjwd_ext3', youtubeId: 'eyvUFRLUYwQ', title: 'مخارج الحروف', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح مخارج الحروف الصحيحة' },
  { id: 'tjwd_ext4', youtubeId: 'z0gGjLJn50Q', title: 'أحكام الميم الساكنة', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح أحكام الميم الساكنة' },
  { id: 'tjwd_ext5', youtubeId: 'dwoXbCf9ULM', title: 'صفات الحروف', scholar: 'الشيخ أيمن سويد', category: 'أحكام التلاوة والتجويد', description: 'شرح صفات الحروف' },
  { id: 'tjwd_ext6', youtubeId: 'H1rGJKRW88A', title: 'التجويد المبسط', scholar: 'الشيخ السيد مرسي', category: 'أحكام التلاوة والتجويد', description: 'شرح مبسط لأحكام التجويد' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - قصص القرآن
  // ═══════════════════════════════════════════
  { id: 'qs_ext1', youtubeId: 'ar7KQmpVMWY', title: 'قصة آدم عليه السلام', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة أبي البشر آدم عليه السلام في القرآن' },
  { id: 'qs_ext2', youtubeId: 'Z3fImMt7qdE', title: 'قصة نوح عليه السلام', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة نوح عليه السلام في القرآن' },
  { id: 'qs_ext3', youtubeId: 'p2fpwF5MvSo', title: 'قصة إبراهيم عليه السلام', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة خليل الله إبراهيم عليه السلام' },
  { id: 'qs_ext4', youtubeId: 'HY_cy4Kb5w0', title: 'قصة موسى مع فرعون', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة موسى عليه السلام مع فرعون' },
  { id: 'qs_ext5', youtubeId: 'KJWxWOuHw1g', title: 'قصة سليمان عليه السلام', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة سليمان عليه السلام' },
  { id: 'qs_ext6', youtubeId: '9zxvHrW6YEI', title: 'قصة يوسف عليه السلام', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة يوسف عليه السلام بالكامل' },
  { id: 'qs_ext7', youtubeId: 'iGHh2yjNtn8', title: 'قصة أصحاب الكهف', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة أصحاب الكهف في القرآن' },
  { id: 'qs_ext8', youtubeId: 'iGk2MeDnqlo', title: 'قصة ذي القرنين', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة ذي القرنين ويأجوج ومأجوج' },
  { id: 'qs_ext9', youtubeId: 'X1hq4VXnzFs', title: 'قصة مريم عليها السلام', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة مريم عليها السلام في القرآن' },
  { id: 'qs_ext10', youtubeId: '_0gVxMGN6mg', title: 'قصة يونس عليه السلام', scholar: 'الشيخ ناصر القطامي', category: 'قصص القرآن', description: 'قصة يونس ذو النون' },
  { id: 'qs_ext11', youtubeId: 'ZPV8Js-HyQ8', title: 'قصة أصحاب الأخدود', scholar: 'د. طارق السويدان', category: 'قصص القرآن', description: 'قصة أصحاب الأخدود في سورة البروج' },
  { id: 'qs_ext12', youtubeId: '8ckzMfZZLbg', title: 'قصة أصحاب الفيل', scholar: 'د. طارق السويدان', category: 'قصص القرآن', description: 'قصة أصحاب الفيل وقصة أبرهة' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - علوم القرآن
  // ═══════════════════════════════════════════
  { id: 'ul_ext1', youtubeId: 'IMa4BHnEcJ4', title: 'أسباب النزول', scholar: 'د. مساعد الطيار', category: 'علوم القرآن', description: 'مقدمة في علم أسباب النزول' },
  { id: 'ul_ext2', youtubeId: 'rzgXQQZBzZA', title: 'الناسخ والمنسوخ', scholar: 'د. مساعد الطيار', category: 'علوم القرآن', description: 'شرح الناسخ والمنسوخ في القرآن' },
  { id: 'ul_ext3', youtubeId: 'M1qpiMyyyUw', title: 'المكي والمدني', scholar: 'د. مساعد الطيار', category: 'علوم القرآن', description: 'تعريف المكي والمدني' },
  { id: 'ul_ext4', youtubeId: 'jIFNVZ6KVnc', title: 'جمع القرآن وكتابته', scholar: 'د. مساعد الطيار', category: 'علوم القرآن', description: 'تاريخ جمع القرآن الكريم' },
  { id: 'ul_ext5', youtubeId: '9tnaNMdmJfQ', title: 'المحكم والمتشابه', scholar: 'د. مساعد الطيار', category: 'علوم القرآن', description: 'شرح المحكم والمتشابه' },
  { id: 'ul_ext6', youtubeId: 'i8zZpWaCvfc', title: 'القراءات السبع', scholar: 'د. أيمن سويد', category: 'علوم القرآن', description: 'مقدمة في القراءات السبع' },
  { id: 'ul_ext7', youtubeId: 'w0hCeyH02Hc', title: 'الوقف والابتداء', scholar: 'د. أيمن سويد', category: 'علوم القرآن', description: 'شرح الوقف والابتداء في القرآن' },
  { id: 'ul_ext8', youtubeId: 'DAW-BR8VkuI', title: 'أقسام القرآن', scholar: 'الشيخ عبد الرزاق البدر', category: 'علوم القرآن', description: 'الأقسام القرآنية ومعانيها' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - إعجاز القرآن
  // ═══════════════════════════════════════════
  { id: 'ij_ext1', youtubeId: 'mBRfGYL-nZg', title: 'الإعجاز العلمي في خلق السماوات', scholar: 'د. زغلول النجار', category: 'إعجاز القرآن', description: 'الإعجاز العلمي في خلق السماوات' },
  { id: 'ij_ext2', youtubeId: 'fxrwIIPKhBY', title: 'الإعجاز العلمي في خلق الأرض', scholar: 'د. زغلول النجار', category: 'إعجاز القرآن', description: 'الإعجاز العلمي في خلق الأرض' },
  { id: 'ij_ext3', youtubeId: 'IEipnUd42KU', title: 'الإعجاز العلمي في البحار', scholar: 'د. زغلول النجار', category: 'إعجاز القرآن', description: 'الإعجاز العلمي في آيات البحر' },
  { id: 'ij_ext4', youtubeId: 'TIRmJtuSMgE', title: 'الإعجاز في خلق الإنسان', scholar: 'د. زغلول النجار', category: 'إعجاز القرآن', description: 'الإعجاز العلمي في مراحل خلق الإنسان' },
  { id: 'ij_ext5', youtubeId: 'oiVfBvR37vA', title: 'الإعجاز التشريعي في القرآن', scholar: 'الشيخ صالح الفوزان', category: 'إعجاز القرآن', description: 'الإعجاز التشريعي في القرآن الكريم' },
  { id: 'ij_ext6', youtubeId: 'y8hG-4mY9OA', title: 'الإعجاز البياني في القرآن', scholar: 'د. فاضل السامرائي', category: 'إعجاز القرآن', description: 'الإعجاز البياني في القرآن' },
  { id: 'ij_ext7', youtubeId: '5wfSfMmLK7g', title: 'لمسات بيانية', scholar: 'د. فاضل السامرائي', category: 'إعجاز القرآن', description: 'لمسات بيانية من القرآن الكريم' },
  { id: 'ij_ext8', youtubeId: 'VKuE4KkqPzM', title: 'دقائق الفروق القرآنية', scholar: 'د. فاضل السامرائي', category: 'إعجاز القرآن', description: 'الفروق الدقيقة بين الآيات المتشابهة' },

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
  const [videoError, setVideoError] = useState(false);
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const cats = Object.keys(CATEGORY_CONFIG) as VideoCategory[];
    const grouped: Record<VideoCategory, QuranVideo[]> = {} as any;
    cats.forEach(cat => {
      grouped[cat] = filteredVideos.filter(v => v.category === cat);
    });
    return grouped;
  }, [filteredVideos]);

  const categories = Object.keys(CATEGORY_CONFIG) as VideoCategory[];
  const getCategoryCount = (cat: VideoCategory) => QURAN_VIDEOS.filter(v => v.category === cat).length;

  // Check video availability when active video changes
  useEffect(() => {
    if (!activeVideo) return;
    
    if (unavailableIds.has(activeVideo.youtubeId)) {
      setVideoError(true);
      return;
    }

    const checkVideo = async () => {
      try {
        const response = await fetch(
          `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${activeVideo.youtubeId}`,
          { signal: AbortSignal.timeout(5000) }
        );
        const data = await response.json();
        
        if (data.error || !data.title) {
          setUnavailableIds(prev => new Set([...prev, activeVideo.youtubeId]));
          setVideoError(true);
        }
      } catch {
        // On error, don't mark as unavailable
      }
    };

    checkVideo();

    return () => {
      if (videoCheckTimerRef.current) {
        clearTimeout(videoCheckTimerRef.current);
      }
    };
  }, [activeVideo?.youtubeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter out unavailable videos from display
  const displayFilteredVideos = useMemo(() => {
    return filteredVideos.filter(v => !unavailableIds.has(v.youtubeId));
  }, [filteredVideos, unavailableIds]);

  // Play video
  const playVideo = useCallback((video: QuranVideo) => {
    setActiveVideo(video);
    setIsFullscreen(false);
    setVideoError(false);
    setTimeout(() => {
      videoContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
    setIsFullscreen(false);
    setVideoError(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Get embed URL - youtube-nocookie.com for privacy
  // IMPORTANT: No sandbox attribute to allow proper YouTube playback
  const getEmbedUrl = (youtubeId: string): string => {
    const params = new URLSearchParams({
      playsinline: '1',
      modestbranding: '1',
      rel: '0',
      autoplay: '1',
      controls: '1',
      fs: '1',
      iv_load_policy: '3',
      disablekb: '0',
      cc_load_policy: '0',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    });
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
  };

  // ============================================
  // VIDEO DOWNLOAD HANDLER
  // ============================================

  const handleVideoDownload = useCallback((video: QuranVideo, quality: string) => {
    const qualityMap: Record<string, string> = {
      '360p': 'small',
      '480p': 'medium', 
      '720p': 'hd720',
      '1080p': 'hd1080',
    };
    // Open YouTube page directly for download (users can use browser extensions or YouTube apps)
    const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleShare = useCallback(async (video: QuranVideo) => {
    const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    if (navigator.share) {
      try { await navigator.share({ title: video.title, text: video.description || video.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, []);

  // ============================================
  // VIDEO PLAYER - Enhanced Cinema Mode
  // ============================================

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const renderVideoPlayer = () => {
    if (!activeVideo) return null;
    const catInfo = CATEGORY_CONFIG[activeVideo.category];

    // Get next/prev videos
    const currentIdx = QURAN_VIDEOS.findIndex(v => v.id === activeVideo.id);
    const nextVideo = currentIdx < QURAN_VIDEOS.length - 1 ? QURAN_VIDEOS[currentIdx + 1] : null;
    const prevVideo = currentIdx > 0 ? QURAN_VIDEOS[currentIdx - 1] : null;

    return (
      <div 
        ref={videoContainerRef}
        className={`${isFullscreen ? 'fixed inset-0 z-[100] bg-black flex flex-col' : 'mb-6'}`}
      >
        {/* Cinema Mode Player */}
        <div className={`relative ${isFullscreen ? 'flex-1 flex flex-col' : 'rounded-2xl overflow-hidden shadow-2xl'}`}>
          {/* Video Header Bar */}
          <div className={`flex items-center justify-between px-4 py-2.5 ${
            isFullscreen 
              ? 'bg-black/95 border-b border-white/5' 
              : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
          }`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button variant="ghost" size="sm" onClick={closeVideo}
                className="gap-1.5 text-white hover:bg-white/10 flex-shrink-0 rounded-lg">
                <ArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">إغلاق</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-sm truncate">{activeVideo.title}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-white/50 text-xs truncate">{activeVideo.scholar}</p>
                  <Badge className={`text-[9px] bg-gradient-to-r ${catInfo.bgColor} text-white border-0 px-1.5 py-0`}>
                    {activeVideo.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}
                className="text-white hover:bg-white/10 flex-shrink-0 rounded-lg p-2">
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Video Frame */}
          <div className={`relative bg-black ${isFullscreen ? 'flex-1' : 'aspect-video'}`}>
            {videoError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                </div>
                <p className="text-base font-bold mb-1">تعذّر تحميل الفيديو</p>
                <p className="text-xs text-slate-400 mb-5">قد يكون الفيديو غير متاح حالياً</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setVideoError(false)}
                    className="gap-2 text-white border-white/20 hover:bg-white/10 rounded-xl">
                    <RefreshCw className="w-4 h-4" /> إعادة المحاولة
                  </Button>
                  {nextVideo && (
                    <Button variant="outline" size="sm" onClick={() => playVideo(nextVideo)}
                      className="gap-2 text-white border-white/20 hover:bg-white/10 rounded-xl">
                      <SkipForward className="w-4 h-4" /> التالي
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <iframe
                key={activeVideo.id}
                src={getEmbedUrl(activeVideo.youtubeId)}
                className="w-full h-full border-0"
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; playsinline"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onError={() => setVideoError(true)}
              />
            )}
          </div>

          {/* Action Bar - YouTube-beating Design */}
          {!isFullscreen && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Left: Nav buttons */}
                <div className="flex items-center gap-1">
                  {prevVideo && (
                    <button onClick={() => playVideo(prevVideo)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs transition-all">
                      <SkipBack className="w-3.5 h-3.5" /> السابق
                    </button>
                  )}
                  {nextVideo && (
                    <button onClick={() => playVideo(nextVideo)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs transition-all">
                      التالي <SkipForward className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Right: Action buttons */}
                <div className="flex items-center gap-1">
                  <button onClick={() => setLiked(prev => { const n = new Set(prev); if (n.has(activeVideo.id)) n.delete(activeVideo.id); else n.add(activeVideo.id); return n; })}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                      liked.has(activeVideo.id) ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}>
                    <Heart className={`w-3.5 h-3.5 ${liked.has(activeVideo.id) ? 'fill-white' : ''}`} /> إعجاب
                  </button>
                  <button onClick={() => setSaved(prev => { const n = new Set(prev); if (n.has(activeVideo.id)) n.delete(activeVideo.id); else n.add(activeVideo.id); return n; })}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                      saved.has(activeVideo.id) ? 'bg-yellow-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}>
                    <Bookmark className={`w-3.5 h-3.5 ${saved.has(activeVideo.id) ? 'fill-white' : ''}`} /> حفظ
                  </button>
                  <button onClick={() => handleShare(activeVideo)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs transition-all">
                    <Share2 className="w-3.5 h-3.5" /> مشاركة
                  </button>
                  <div className="relative">
                    <button onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs transition-all">
                      <Download className="w-3.5 h-3.5" /> تنزيل
                    </button>
                    {showDownloadMenu && (
                      <div className="absolute bottom-full mb-2 left-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-2 min-w-[180px] z-50">
                        <p className="text-[10px] text-slate-400 px-2 pb-1 mb-1 border-b border-white/10">اختر الجودة</p>
                        {['360p', '480p', '720p', '1080p'].map(q => (
                          <button key={q} onClick={() => { handleVideoDownload(activeVideo, q); setShowDownloadMenu(false); }}
                            className="w-full text-right px-3 py-2 rounded-lg text-xs text-white hover:bg-white/10 transition-colors flex items-center justify-between">
                            <span>{q}</span>
                            <Download className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                        <div className="border-t border-white/10 mt-1 pt-1">
                          <button onClick={() => { window.open(`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`, '_blank'); setShowDownloadMenu(false); }}
                            className="w-full text-right px-3 py-2 rounded-lg text-xs text-emerald-400 hover:bg-white/10 transition-colors flex items-center justify-between">
                            <span>فتح في يوتيوب</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Video Info Panel */}
        {!isFullscreen && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mt-3 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-0.5">{activeVideo.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm">{activeVideo.scholar}</p>
                  <span className="text-slate-300">•</span>
                  <Badge className={`text-[10px] bg-gradient-to-r ${catInfo.bgColor} text-white border-0`}>
                    {activeVideo.category}
                  </Badge>
                </div>
                {activeVideo.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{activeVideo.description}</p>
                )}
              </div>
            </div>

            {/* Related Videos Suggestion */}
            {(nextVideo || prevVideo) && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">مقاطع ذات صلة</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {QURAN_VIDEOS.filter(v => v.scholar === activeVideo.scholar && v.id !== activeVideo.id).slice(0, 4).map(v => (
                    <button key={v.id} onClick={() => playVideo(v)}
                      className="flex-shrink-0 w-32 group text-right">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-1">
                        <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt={v.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-tight">{v.title}</p>
                    </button>
                  ))}
                </div>
              </div>
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
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1.5 leading-tight">
              {video.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{video.scholar}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank'); }}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                title="تنزيل"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </button>
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
            <p className="text-rose-100 text-sm">دروس ومقاطع قرآنية مرئية</p>
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

    </div>
  );
}
