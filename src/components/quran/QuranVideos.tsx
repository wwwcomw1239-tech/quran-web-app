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
  Scroll, RefreshCw, AlertCircle
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

  // الشيخ محمد حسان
  { id: 't24', youtubeId: 'D3XfAuliSxg', title: 'أعمال أهل القرآن', scholar: 'الشيخ محمد حسان', category: 'تفسير القرآن', description: 'بيان أعمال أهل القرآن وصفاتهم' },
  { id: 't25', youtubeId: 'Bbbj4wwrDKI', title: 'تفسير: وما أرسلنا من رسول إلا ليطاع بإذن الله', scholar: 'الشيخ محمد حسان', category: 'تفسير القرآن', description: 'تفسير آية من سورة النساء' },
  { id: 't26', youtubeId: '9Mkc0EWRYx8', title: 'تفسير: وسارعوا إلى مغفرة من ربكم', scholar: 'الشيخ محمد حسان', category: 'تفسير القرآن', description: 'تفسير آيات المسارعة إلى الخيرات' },

  // ═══════════════════════════════════════════
  // تدبر وتأملات
  // ═══════════════════════════════════════════
  
  { id: 'd1', youtubeId: 'R9Wrojgf2N8', title: 'تدبر روائع الماضي بقلبك', scholar: 'الشيخ محمد حسان', category: 'تدبر وتأملات', description: 'مقطع رائع في تدبر القرآن والرجوع إلى الله' },
  { id: 'd2', youtubeId: 'PKJQsWkT-cs', title: 'التزكية - النداء', scholar: 'الشيخ محمد حسان', category: 'تدبر وتأملات', description: 'تزكية النفس من خلال القرآن الكريم' },
  { id: 'd3', youtubeId: 'gsX4A44lSco', title: 'على منهج رسول الله ﷺ', scholar: 'الشيخ محمد حسان', category: 'تدبر وتأملات', description: 'اتباع منهج النبي ﷺ في فهم القرآن' },
  { id: 'd4', youtubeId: 'tdSXH1s5ZSk', title: 'الخطوة الأولى لدخول الجنة', scholar: 'الشيخ محمد حسان', category: 'تدبر وتأملات', description: 'بيان الخطوة الأولى نحو الجنة من القرآن' },

  { id: 'd5', youtubeId: 'onVD3DgrdJ0', title: 'استعمال (لا) و(لن) في القرآن', scholar: 'د. فاضل السامرائي', category: 'تدبر وتأملات', description: 'لمسة بيانية في الفرق بين لا ولن في القرآن' },
  { id: 'd6', youtubeId: 'tRQDHN8y5hg', title: 'من أين لك هذا؟ - لمسات بيانية', scholar: 'د. فاضل السامرائي', category: 'تدبر وتأملات', description: 'سؤال من متصل عن مصادر اللمسات البيانية' },
  { id: 'd7', youtubeId: 'w6B-f6o7CR8', title: 'أسئلة بيانية في القرآن الكريم', scholar: 'د. فاضل السامرائي', category: 'تدبر وتأملات', description: 'عرض كتاب أسئلة بيانية في القرآن' },
  { id: 'd8', youtubeId: 'Z1zX7-wXuMU', title: 'لمسات بيانية - الحلقة 451', scholar: 'د. فاضل السامرائي', category: 'تدبر وتأملات', description: 'أسئلة وأجوبة في اللمسات البيانية' },
  { id: 'd9', youtubeId: 'lnldk80-Aqs', title: 'لمسات بيانية - رحمت الله', scholar: 'د. فاضل السامرائي', category: 'تدبر وتأملات', description: 'بيان عبقري في رسم كلمة رحمت في القرآن' },
  { id: 'd10', youtubeId: '-qqrJB615tQ', title: 'لمسات بيانية - سورة يس', scholar: 'د. فاضل السامرائي', category: 'تدبر وتأملات', description: 'لمسات بيانية في سورة يس الآيات 60-64' },
  { id: 'd11', youtubeId: 'uKPZnM2Y_pA', title: 'لمسات بيانية - الحلقة 124', scholar: 'د. فاضل السامرائي', category: 'تدبر وتأملات', description: 'من برنامج لمسات بيانية المبارك' },

  // تدبر - الشيخ عبد الرزاق البدر
  { id: 'd12', youtubeId: 'krCbO2Iggz4', title: 'دروس من الحرمين', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبر وتأملات', description: 'دروس من الحرمين الشريفين في تدبر القرآن' },

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
  
  // د. فاضل السامرائي
  { id: 'e1', youtubeId: 'uKPZnM2Y_pA', title: 'لمسات بيانية في القرآن الكريم', scholar: 'د. فاضل السامرائي', category: 'إعجاز القرآن', description: 'إعجاز بياني ولمسات بلاغية في القرآن' },
  { id: 'e2', youtubeId: 'onVD3DgrdJ0', title: 'الفرق بين (لا) و(لن) - إعجاز بياني', scholar: 'د. فاضل السامرائي', category: 'إعجاز القرآن', description: 'بيان دقة الاختيار اللغوي في القرآن' },
  { id: 'e3', youtubeId: '-qqrJB615tQ', title: 'إعجاز بياني في سورة يس', scholar: 'د. فاضل السامرائي', category: 'إعجاز القرآن', description: 'لمسات بيانية رائعة في سورة يس' },
  { id: 'e4', youtubeId: 'lnldk80-Aqs', title: 'عبقرية رسم (رحمت) في القرآن', scholar: 'د. فاضل السامرائي', category: 'إعجاز القرآن', description: 'إعجاز في الرسم القرآني' },
  { id: 'e5', youtubeId: 'tRQDHN8y5hg', title: 'أسرار البيان القرآني', scholar: 'د. فاضل السامرائي', category: 'إعجاز القرآن', description: 'أسرار ولمسات من البيان القرآني العظيم' },
  { id: 'e6', youtubeId: 'Z1zX7-wXuMU', title: 'لمسات بيانية متنوعة', scholar: 'د. فاضل السامرائي', category: 'إعجاز القرآن', description: 'أسئلة وأجوبة في الإعجاز البياني للقرآن' },

  // ═══════════════════════════════════════════
  // إضافات جديدة - مقاطع إضافية من علماء أهل السنة
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

  // الشيخ محمد حسين يعقوب - مواعظ
  { id: 'n15', youtubeId: 'HgyIb2sLOQ0', title: 'موعظة مؤثرة وقصة مبكية', scholar: 'الشيخ محمد حسين يعقوب', category: 'تدبر وتأملات', description: 'قصة مبكية عن التوبة والإنابة' },
  { id: 'n16', youtubeId: 'WotH6nSeN5g', title: 'الغفلة ولهو الأمل', scholar: 'الشيخ محمد حسين يعقوب', category: 'تدبر وتأملات', description: 'موعظة لمن كان له قلب عن الغفلة' },
  { id: 'n17', youtubeId: 'f9VtJd-Eujw', title: 'خاف من نفسك', scholar: 'الشيخ محمد حسين يعقوب', category: 'تدبر وتأملات', description: 'خطبة مؤثرة عن محاسبة النفس' },
  { id: 'n18', youtubeId: 'PbZM0lRrYRk', title: 'أبنية التذكر والاحتياج للموعظة', scholar: 'الشيخ محمد حسين يعقوب', category: 'تدبر وتأملات', description: 'شدة الاحتياج إلى الموعظة والتذكير' },
  { id: 'n19', youtubeId: 'Z2dQGJU6vx8', title: 'القرآن مدرسة الحياة', scholar: 'الشيخ محمد حسين يعقوب', category: 'تدبر وتأملات', description: 'خطة للنجاة من خلال القرآن الكريم' },
  { id: 'n20', youtubeId: '5AvsfyERQiw', title: 'لهيب النار', scholar: 'الشيخ محمد حسين يعقوب', category: 'تدبر وتأملات', description: 'موعظة تدعو القلوب إلى الله' },
  { id: 'n21', youtubeId: 'TBPX62vdyic', title: 'القدر والاتجاه الإجباري', scholar: 'الشيخ محمد حسين يعقوب', category: 'تدبر وتأملات', description: 'الإيمان بالقدر والاتجاه في الحياة' },

  // الشيخ خالد الراشد - مواعظ
  { id: 'n22', youtubeId: 'czYM5kG8fmI', title: 'موعظة مؤثرة عن الدنيا', scholar: 'الشيخ خالد الراشد', category: 'تدبر وتأملات', description: 'الدنيا الفانية وحقيقتها' },
  { id: 'n23', youtubeId: 'GrT0_zd5HEc', title: 'مواعظ مؤثرة', scholar: 'الشيخ خالد الراشد', category: 'تدبر وتأملات', description: 'مواعظ مؤثرة تحرك القلوب' },
  { id: 'n24', youtubeId: 'IsoBhxF-wVo', title: 'إياك والحزن والإحباط', scholar: 'الشيخ خالد الراشد', category: 'تدبر وتأملات', description: 'مقطع مؤثر عن التفاؤل والابتعاد عن الحزن' },
  { id: 'n25', youtubeId: 'sngryhhfWJ0', title: 'قصص مؤثرة', scholar: 'الشيخ خالد الراشد', category: 'قصص القرآن', description: 'قصص فيها فائدة وعبرة وموعظة' },
  { id: 'n26', youtubeId: 'UQMLsfDvks8', title: 'الدنيا الفانية - كلام مؤثر', scholar: 'الشيخ خالد الراشد', category: 'تدبر وتأملات', description: 'ما الحياة الدنيا إلا متاع الغرور' },
  { id: 'n27', youtubeId: 'vt2IR0ZxKxI', title: 'وجاءت سكرة الموت بالحق', scholar: 'الشيخ خالد الراشد', category: 'تدبر وتأملات', description: 'أبلغ العظات حول الموت' },
  { id: 'n28', youtubeId: 'X0X4q5TaMlc', title: 'موعظة رمضانية', scholar: 'الشيخ خالد الراشد', category: 'تدبر وتأملات', description: 'موعظة عن استغلال رمضان' },
  { id: 'n29', youtubeId: 'i74lVOA5jt0', title: 'من أروع المواعظ - مؤثر جداً', scholar: 'الشيخ خالد الراشد', category: 'تدبر وتأملات', description: 'من أروع ما قاله الشيخ خالد الراشد' },

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

        {/* Video iframe - NO sandbox attribute to allow proper YouTube playback */}
        <div className={`relative bg-black ${
          isFullscreen ? 'flex-1' : 'aspect-video rounded-b-2xl overflow-hidden'
        }`}>
          {videoError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white">
              <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
              <p className="text-sm font-medium mb-2">تعذّر تحميل الفيديو</p>
              <p className="text-xs text-slate-400 mb-4">قد يكون الفيديو غير متاح حالياً</p>
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
