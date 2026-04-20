// ============================================
// QURAN SHORTS DATABASE
// ============================================

export type ShortCategory =
  | 'مواعظ قرآنية'
  | 'تدبرات'
  | 'قصص مؤثرة'
  | 'فوائد قرآنية'
  | 'أسرار القرآن'
  | 'خواطر إيمانية';

export interface QuranShort {
  id: string;
  youtubeId: string;
  title: string;
  scholar: string;
  category: ShortCategory;
  description?: string;
  seriesId?: string;
}

export interface Series {
  id: string;
  title: string;
  scholar: string;
  description: string;
  category: ShortCategory;
  thumbnail?: string;
}

// ============================================
// SERIES (PLAYLISTS)
// ============================================

export const SERIES: Series[] = [
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

import { additionalShorts } from './shorts-additions';
import { additionalShortsBatch2 } from './shorts-batch2';
import { additionalShortsBatch3 } from './shorts-batch3';
import { additionalShortsBatch4 } from './shorts-batch4';
import { QURAN_SHORTS_BATCH5 } from './shorts-batch5';

const coreShorts: QuranShort[] = [

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

  // ═══════════════════════════════════════════
  // مقاطع قصيرة جديدة إضافية
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - فوائد قرآنية
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - تدبرات
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - قصص مؤثرة
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - خواطر إيمانية
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - مواعظ قرآنية
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - أسرار القرآن
  // ═══════════════════════════════════════════

];

// Combine core + additional shorts (dedup by youtubeId)
const shortsByYoutubeId = new Map<string, QuranShort>();
for (const s of coreShorts) shortsByYoutubeId.set(s.youtubeId, s);
for (const s of additionalShorts) {
  if (!shortsByYoutubeId.has(s.youtubeId)) shortsByYoutubeId.set(s.youtubeId, s);
}
for (const s of additionalShortsBatch2) {
  if (!shortsByYoutubeId.has(s.youtubeId)) shortsByYoutubeId.set(s.youtubeId, s);
}
for (const s of additionalShortsBatch3) {
  if (!shortsByYoutubeId.has(s.youtubeId)) shortsByYoutubeId.set(s.youtubeId, s);
}
for (const s of additionalShortsBatch4) {
  if (!shortsByYoutubeId.has(s.youtubeId)) shortsByYoutubeId.set(s.youtubeId, s);
}
for (const s of QURAN_SHORTS_BATCH5) {
  if (!shortsByYoutubeId.has(s.youtubeId)) shortsByYoutubeId.set(s.youtubeId, s);
}

export const QURAN_SHORTS: QuranShort[] = Array.from(shortsByYoutubeId.values());
