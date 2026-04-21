// ============================================
// QURAN VIDEOS DATABASE
// ============================================

export type VideoCategory =
  | 'تفسير القرآن'
  | 'تدبر وتأملات'
  | 'أحكام التلاوة والتجويد'
  | 'علوم القرآن'
  | 'قصص القرآن'
  | 'إعجاز القرآن';

export interface QuranVideo {
  id: string;
  youtubeId: string;
  title: string;
  scholar: string;
  category: VideoCategory;
  description?: string;
}

import { additionalVideos } from './videos-additions';
import { additionalVideosBatch2 } from './videos-batch2';
import { additionalVideosBatch3 } from './videos-batch3';
import { additionalVideosBatch4 } from './videos-batch4';
import { additionalVideosBatch5 } from './videos-batch5';
import { additionalVideosBatch6 } from './videos-batch6';

const coreVideos: QuranVideo[] = [
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

  // ═══════════════════════════════════════════
  // تدبر وتأملات
  // ═══════════════════════════════════════════
  
  // تدبر - الشيخ عبد الرزاق البدر
  { id: 'd12', youtubeId: 'krCbO2Iggz4', title: 'دروس من الحرمين', scholar: 'الشيخ عبد الرزاق البدر', category: 'تدبر وتأملات', description: 'دروس من الحرمين الشريفين في تدبر القرآن' },

  // الشيخ محمد المختار الشنقيطي - تدبر

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

  // الشيخ عبد الله بن عبد الرحمن الجبرين

  // الشيخ سعد الشثري

  // الشيخ عبد الرحمن بن معاضة الشهري

  // الشيخ عبد المحسن العباد

  // الشيخ محمد بن صالح العثيمين - إضافات

  // الشيخ صالح الفوزان - إضافات

  // ═══════════════════════════════════════════
  // إضافات جديدة - الشيخ محمد المختار الشنقيطي
  // ═══════════════════════════════════════════


  // ═══════════════════════════════════════════
  // إضافات جديدة - مقاطع متنوعة للعلماء الموجودين
  // ═══════════════════════════════════════════

  // الشيخ ابن عثيمين - إضافات أخرى

  // الشيخ صالح الفوزان - إضافات أخرى

  // الشيخ عبد الرزاق البدر - إضافات

  // الشيخ محمد العريفي - إضافات قصص

  // الشيخ نبيل العوضي - إضافات
  { id: 'new9', youtubeId: 'xKc6_kZYq9I', title: 'قصة لوط وشعيب وإسماعيل وإسحاق', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصص أنبياء الله من القرآن' },
  { id: 'new10', youtubeId: 'LZzTxnKPo5w', title: 'قصة خليل الله إبراهيم عليه السلام', scholar: 'الشيخ نبيل العوضي', category: 'قصص القرآن', description: 'قصة إبراهيم خليل الرحمن' },

  // الشيخ الشعراوي - إضافات

  // د. محمد راتب النابلسي - إضافات

  // الشيخ بدر المشاري - إضافات

  // الشيخ محمد صالح المنجد - إضافات

  // ═══════════════════════════════════════════
  // إضافات جديدة - مقاطع متنوعة إضافية
  // ═══════════════════════════════════════════

  // الشيخ ابن باز رحمه الله - إضافات

  // د. عبد الرحمن الشهري - إضافات

  // الشيخ صالح آل الشيخ - إضافات

  // الشيخ سعد الشثري - إضافات

  // الشيخ محمد بن عبد الله الدويش

  // الشيخ عبد الرزاق البدر - إضافات أخرى

  // الشيخ الشعراوي - إضافات أخرى

  // د. محمد راتب النابلسي - إضافات أخرى

  // إعجاز القرآن - مقاطع جديدة

  // ═══════════════════════════════════════════
  // إضافات جديدة - تفسير القرآن
  // ═══════════════════════════════════════════

  // الشيخ ابن عثيمين - تفسير جزء عم

  // الشيخ ابن باز - دروس وتفسير

  // الشيخ صالح الفوزان - تفسير إضافي

  // الشيخ عبد الرزاق البدر - إضافات

  // الشيخ عبد الكريم الخضير - إضافات

  // الشيخ محمد المختار الشنقيطي - إضافات

  // د. محمد راتب النابلسي - تفسير القرآن

  // الإمام محمد متولي الشعراوي - خواطر

  // ═══════════════════════════════════════════
  // إضافات جديدة - تدبر وتأملات
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - أحكام التجويد
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - قصص القرآن
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - علوم القرآن
  // ═══════════════════════════════════════════

  // ═══════════════════════════════════════════
  // إضافات جديدة - إعجاز القرآن
  // ═══════════════════════════════════════════

];

// Combine core + additional videos (dedup by youtubeId)
const videosByYoutubeId = new Map<string, QuranVideo>();
for (const v of coreVideos) videosByYoutubeId.set(v.youtubeId, v);
for (const v of additionalVideos) {
  if (!videosByYoutubeId.has(v.youtubeId)) videosByYoutubeId.set(v.youtubeId, v);
}
for (const v of additionalVideosBatch2) {
  if (!videosByYoutubeId.has(v.youtubeId)) videosByYoutubeId.set(v.youtubeId, v);
}
for (const v of additionalVideosBatch3) {
  if (!videosByYoutubeId.has(v.youtubeId)) videosByYoutubeId.set(v.youtubeId, v);
}
for (const v of additionalVideosBatch4) {
  if (!videosByYoutubeId.has(v.youtubeId)) videosByYoutubeId.set(v.youtubeId, v);
}
for (const v of additionalVideosBatch5) {
  if (!videosByYoutubeId.has(v.youtubeId)) videosByYoutubeId.set(v.youtubeId, v);
}
for (const v of additionalVideosBatch6) {
  if (!videosByYoutubeId.has(v.youtubeId)) videosByYoutubeId.set(v.youtubeId, v);
}

export const QURAN_VIDEOS: QuranVideo[] = Array.from(videosByYoutubeId.values());
