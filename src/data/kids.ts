// ============================================
// KIDS VIDEOS DATABASE
// Videos without music or Islamic violations
// ============================================

export type KidsCategoryAr =
  | 'قصص الأنبياء'
  | 'قصص القرآن'
  | 'قصص الحيوان في القرآن'
  | 'قصص الصحابة والتابعين'
  | 'أناشيد إسلامية بدون إيقاع'
  | 'تعليم القرآن للأطفال'
  | 'آداب وأخلاق إسلامية';

export type KidsCategoryEn =
  | 'Stories of the Prophets'
  | 'Quran Stories'
  | 'Animal Stories from Quran'
  | 'Companions Stories'
  | 'Islamic Nasheeds (No Music)'
  | 'Learn Quran for Kids'
  | 'Islamic Manners & Ethics';

export interface KidsVideo {
  id: string;
  youtubeId: string;
  titleAr: string;
  titleEn: string;
  sourceAr: string;
  sourceEn: string;
  categoryAr: KidsCategoryAr;
  categoryEn: KidsCategoryEn;
  descriptionAr?: string;
  descriptionEn?: string;
}

// ============================================
// ARABIC VIDEOS
// ============================================

import { additionalArabicKids, additionalEnglishKids } from './kids-additions';
import { additionalArabicKidsBatch2, additionalEnglishKidsBatch2 } from './kids-batch2';
import { additionalArabicKidsBatch3, additionalEnglishKidsBatch3 } from './kids-batch3';
import { additionalKidsBatch4 } from './kids-batch4';

const coreArabic: KidsVideo[] = [
  // ═══════════════════════════════════════════
  // قصص الأنبياء
  // ═══════════════════════════════════════════

  // نبيل العوضي - قصص الأنبياء
  { id: 'a1', youtubeId: 'pB7uZzu2dLI', titleAr: 'قصة بداية الخلق وخلق آدم عليه السلام', titleEn: 'Story of Creation & Adam (AS)', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets', descriptionAr: 'كيف خلق الله العالم وخلق آدم عليه السلام', descriptionEn: 'How Allah created the world and Adam (AS)' },
  { id: 'a2', youtubeId: 'tLP0ZUwf6s0', titleAr: 'قصة نبي الله إدريس عليه السلام', titleEn: 'Story of Prophet Idris (AS)', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets', descriptionAr: 'قصة إدريس عليه السلام ولماذا رفعته الملائكة', descriptionEn: 'Story of Idris (AS) and why the angels raised him' },
  { id: 'a3', youtubeId: 'Aw4FLH5c6dM', titleAr: 'قصة كليم الله موسى عليه السلام - الجزء الأول', titleEn: 'Story of Prophet Musa (AS) - Part 1', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a4', youtubeId: 'cfR7wL_YQWE', titleAr: 'قصة المائدة - قصص الأنبياء', titleEn: 'Story of the Table Spread', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a5', youtubeId: 'zDzsg7KsdOM', titleAr: 'قصص من حياة الأنبياء ومعجزاتهم', titleEn: 'Stories from the Lives of the Prophets', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a6', youtubeId: 'NgEZ-YZtaVI', titleAr: 'قصة إلياس واليسع وذو الكفل', titleEn: 'Story of Ilyas, Al-Yasa & Dhul-Kifl', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a7', youtubeId: '2lyl2XOMhqs', titleAr: 'قصة يوشع وداوود وسليمان وزكريا ويحيى', titleEn: 'Stories of Yusha, Dawud, Sulaiman, Zakariya & Yahya', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a8', youtubeId: 'iGuP9-9ZN-4', titleAr: 'قصة يونس عليه السلام - للأطفال بدون موسيقى', titleEn: 'Story of Prophet Yunus (AS) for Kids', sourceAr: 'قصص الأنبياء للأطفال', sourceEn: 'Prophet Stories for Kids', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a9', youtubeId: 'UwR0egTQwsQ', titleAr: 'قصة إدريس عليه السلام - للأطفال بدون موسيقى', titleEn: 'Story of Prophet Idris (AS) for Kids', sourceAr: 'أولادنا الإسلامية', sourceEn: 'Our Islamic Kids', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a10', youtubeId: 'zAXRZpDyr8Q', titleAr: 'قصة نوح عليه السلام - للأطفال', titleEn: 'Story of Prophet Nuh (AS) for Kids', sourceAr: 'قصص الأنبياء للأطفال', sourceEn: 'Prophet Stories for Kids', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a11', youtubeId: '4z7nWIUcOGw', titleAr: 'قصة السامري الذي أضل بني إسرائيل', titleEn: 'Story of the Samaritan who Misled Bani Israel', sourceAr: 'الشيخ محمد العريفي', sourceEn: 'Sheikh Muhammad Al-Arifi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a40', youtubeId: 'xKc6_kZYq9I', titleAr: 'قصة لوط وشعيب وإسماعيل وإسحاق', titleEn: 'Story of Lut, Shuaib, Ismail & Ishaq', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a41', youtubeId: 'LZzTxnKPo5w', titleAr: 'قصة خليل الله إبراهيم عليه السلام', titleEn: 'Story of Prophet Ibrahim (AS) - The Friend of Allah', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a42', youtubeId: '8HOQIKt3uUQ', titleAr: 'قصة أول رسول يبعثه الله لأهل الأرض', titleEn: 'Story of the First Messenger Sent to Earth', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a43', youtubeId: 'tOLP5uF3hCI', titleAr: 'قصص الأنبياء كاملة بطريقة ممتعة', titleEn: 'Complete Prophet Stories - Entertaining Way', sourceAr: 'الشيخ نبيل العوضي', sourceEn: 'Sheikh Nabil Al-Awadi', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'a44', youtubeId: 'aUW8E6_nM1Y', titleAr: 'قصص الحيوان في القرآن الحلقة الأولى - بدون موسيقى', titleEn: 'Animal Stories in Quran Ep 1 - No Music', sourceAr: 'كرتون إسلامي', sourceEn: 'Islamic Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },

  // ═══════════════════════════════════════════
  // قصص القرآن
  // ═══════════════════════════════════════════

  // قصص الإنسان في القرآن - Cedars Art
  { id: 'a21', youtubeId: 'YcwgwTUkxsM', titleAr: 'قصة أصحاب الفيل للأطفال', titleEn: 'Story of the Elephant for Kids', sourceAr: 'بالعربي نتعلم', sourceEn: 'BeLarabyApps', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },

  // ═══════════════════════════════════════════
  // قصص الحيوان في القرآن
  // ═══════════════════════════════════════════

  { id: 'a26', youtubeId: '_6qbeLtAgng', titleAr: 'قصة النملة - كارتون بدون موسيقى', titleEn: 'Story of the Ant - Cartoon No Music', sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
  { id: 'a58', youtubeId: 'bWxrlC6GwqE', titleAr: 'قصص الحيوان في القرآن - تتر البداية بدون موسيقى', titleEn: 'Animal Stories from Quran - Opening No Music', sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },

  // ═══════════════════════════════════════════
  // قصص الصحابة والتابعين
  // ═══════════════════════════════════════════

  { id: 'a27', youtubeId: '_X0BHl4u-sw', titleAr: 'قصص التابعين - تجميع حلقات بدون موسيقى', titleEn: "Stories of the Tabi'in - Compilation No Music", sourceAr: 'كرتون إسلامي', sourceEn: 'Islamic Cartoon', categoryAr: 'قصص الصحابة والتابعين', categoryEn: 'Companions Stories' },
  { id: 'a28', youtubeId: 'wzAhOU1ybxE', titleAr: 'قصة أبو بكر الصديق رضي الله عنه', titleEn: 'Story of Abu Bakr As-Siddiq (RA)', sourceAr: 'الشيخ محمد العريفي', sourceEn: 'Sheikh Muhammad Al-Arifi', categoryAr: 'قصص الصحابة والتابعين', categoryEn: 'Companions Stories' },
  { id: 'a29', youtubeId: 'KDLl4hHxvp4', titleAr: 'قصة الصحابي جابر بن عبد الله', titleEn: 'Story of Companion Jabir ibn Abdullah', sourceAr: 'الشيخ محمد العريفي', sourceEn: 'Sheikh Muhammad Al-Arifi', categoryAr: 'قصص الصحابة والتابعين', categoryEn: 'Companions Stories' },
  { id: 'a30', youtubeId: '0AeGhlHwWkg', titleAr: 'ساعة مع أجمل قصص الصحابة', titleEn: 'Best Stories of the Companions', sourceAr: 'الشيخ محمد العريفي', sourceEn: 'Sheikh Muhammad Al-Arifi', categoryAr: 'قصص الصحابة والتابعين', categoryEn: 'Companions Stories' },
  { id: 'a31', youtubeId: 'nzlKOz2gd9w', titleAr: 'قصة الأعرابي والرسول ﷺ', titleEn: 'Story of the Bedouin & the Prophet ﷺ', sourceAr: 'الشيخ محمد العريفي', sourceEn: 'Sheikh Muhammad Al-Arifi', categoryAr: 'قصص الصحابة والتابعين', categoryEn: 'Companions Stories' },
  { id: 'a32', youtubeId: 'YDo4NUsZmyU', titleAr: 'ماذا فعل الصحابة عند وفاة النبي ﷺ', titleEn: 'What the Companions Did When the Prophet ﷺ Passed Away', sourceAr: 'الشيخ محمد العريفي', sourceEn: 'Sheikh Muhammad Al-Arifi', categoryAr: 'قصص الصحابة والتابعين', categoryEn: 'Companions Stories' },

  // ═══════════════════════════════════════════
  // أناشيد إسلامية بدون إيقاع
  // ═══════════════════════════════════════════

  { id: 'a33', youtubeId: 'ScqtKErTYIQ', titleAr: 'الأنبياء هم الأمناء - بدون إيقاع', titleEn: 'The Prophets Are the Trustees - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
  { id: 'a34', youtubeId: 'XUX9JnprJzk', titleAr: 'الحيوانات في القرآن - بدون إيقاع', titleEn: 'Animals in the Quran - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
  { id: 'a59', youtubeId: 'PXDcv5o5Ut0', titleAr: 'أجمل الأناشيد من قناة ريحانة - بدون إيقاع', titleEn: 'Best Nasheeds from Rayhana - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
  { id: 'a60', youtubeId: '8K9eCyDEflE', titleAr: 'أجمل أناشيد ريحانة - المجموعة الثانية - بدون إيقاع', titleEn: 'Best Rayhana Nasheeds - Collection 2 - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
  { id: 'a61', youtubeId: 'Es-bDlEkcKY', titleAr: 'مجموعة أناشيد قناة ريحانة - بدون إيقاع', titleEn: 'Rayhana Nasheeds Collection - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
  { id: 'a62', youtubeId: 'Ei83qn_lQ00', titleAr: 'أنشودة أصحاب الكهف - بدون موسيقى', titleEn: 'Nasheed of the People of the Cave - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
  { id: 'a63', youtubeId: 'mCnQXrRPkmg', titleAr: 'أنشودة المعوذتين - بدون موسيقى', titleEn: 'Nasheed of Al-Muawwidhatayn - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
  { id: 'a64', youtubeId: 'G2VJcaySWPk', titleAr: 'أجمل الأناشيد القرآنية التربوية - بدون إيقاع', titleEn: 'Best Educational Quran Nasheeds - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
  { id: 'a65', youtubeId: 'pA8oZw9L2Cc', titleAr: 'علمني الله - بدون موسيقى', titleEn: 'Allah Taught Me - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },

  // ═══════════════════════════════════════════
  // تعليم القرآن للأطفال
  // ═══════════════════════════════════════════

  { id: 'a35', youtubeId: 'J990JgeiE80', titleAr: 'تجويد القرآن الكريم - الدرس الأول', titleEn: 'Quran Tajweed - Lesson 1', sourceAr: 'د. أيمن سويد', sourceEn: 'Dr. Ayman Suwaid', categoryAr: 'تعليم القرآن للأطفال', categoryEn: 'Learn Quran for Kids' },
  { id: 'a36', youtubeId: 'YyfUNP5swWM', titleAr: 'جزء عمّ كاملاً - القراءة المنهجية', titleEn: "Juz Amma Complete - Methodical Reading", sourceAr: 'د. أيمن سويد', sourceEn: 'Dr. Ayman Suwaid', categoryAr: 'تعليم القرآن للأطفال', categoryEn: 'Learn Quran for Kids' },
  { id: 'a37', youtubeId: 'H6WTnSZ6G-0', titleAr: 'مقدمة في علم التجويد', titleEn: 'Introduction to Tajweed', sourceAr: 'د. أيمن سويد', sourceEn: 'Dr. Ayman Suwaid', categoryAr: 'تعليم القرآن للأطفال', categoryEn: 'Learn Quran for Kids' },
  { id: 'a38', youtubeId: 'MWzQyxVt1rI', titleAr: 'كيفية حفظ القرآن الكريم', titleEn: 'How to Memorize the Quran', sourceAr: 'الشيخ عبد المحسن القاسم', sourceEn: 'Sheikh AbdulMuhsin Al-Qasim', categoryAr: 'تعليم القرآن للأطفال', categoryEn: 'Learn Quran for Kids' },

  // ═══════════════════════════════════════════
  // آداب وأخلاق إسلامية
  // ═══════════════════════════════════════════

  { id: 'a39', youtubeId: 'P_vmdgyO35o', titleAr: 'أحكام القرآن - كرتون إسلامي بدون موسيقى', titleEn: 'Quran Rulings - Islamic Cartoon No Music', sourceAr: 'كرتون إسلامي', sourceEn: 'Islamic Cartoon', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'a66', youtubeId: '88j5OmKnWZw', titleAr: 'قصص إسلامية للأطفال - 30 دقيقة بدون موسيقى', titleEn: 'Islamic Stories for Kids - 30 min No Music', sourceAr: 'قصص إسلامية', sourceEn: 'Islamic Stories', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },

  // ═══════════════════════════════════════════
  // إضافات بديلة - مقاطع بدون موسيقى
  // ═══════════════════════════════════════════

  // قصص قرآنية بدون موسيقى
  { id: 'a67', youtubeId: '_X0BHl4u-sw', titleAr: 'قصص التابعين - تجميع حلقات بدون موسيقى', titleEn: "Stories of the Tabi'in - No Music", sourceAr: 'كرتون إسلامي', sourceEn: 'Islamic Cartoon', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a68', youtubeId: 'P_vmdgyO35o', titleAr: 'أحكام القرآن - كرتون بدون موسيقى', titleEn: 'Quran Rulings Cartoon - No Music', sourceAr: 'كرتون إسلامي', sourceEn: 'Islamic Cartoon', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a69', youtubeId: 'YcwgwTUkxsM', titleAr: 'قصة أصحاب الفيل للأطفال', titleEn: 'Story of the Elephant for Kids', sourceAr: 'بالعربي نتعلم', sourceEn: 'BeLarabyApps', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },

  // قصص الحيوان - بدون موسيقى
  { id: 'a70', youtubeId: '_6qbeLtAgng', titleAr: 'قصة النملة - كارتون بدون موسيقى', titleEn: 'Story of the Ant - No Music', sourceAr: 'كرتون بدون موسيقى', sourceEn: 'No Music Cartoon', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
  { id: 'a71', youtubeId: 'aUW8E6_nM1Y', titleAr: 'قصص الحيوان في القرآن - بدون موسيقى', titleEn: 'Animal Stories in Quran - No Music', sourceAr: 'كرتون إسلامي', sourceEn: 'Islamic Cartoon', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },

  // تعليم قرآن إضافي
  { id: 'a72', youtubeId: 'gl5oar_uGCM', titleAr: 'شرح التجويد المصور - الحلقة الأولى', titleEn: 'Tajweed Illustrated - Episode 1', sourceAr: 'د. أيمن سويد', sourceEn: 'Dr. Ayman Suwaid', categoryAr: 'تعليم القرآن للأطفال', categoryEn: 'Learn Quran for Kids' },
  { id: 'a73', youtubeId: 'HFKGcKaZQkA', titleAr: 'أحكام حرف الراء - تجويد', titleEn: 'Rules of Letter Ra - Tajweed', sourceAr: 'د. أيمن سويد', sourceEn: 'Dr. Ayman Suwaid', categoryAr: 'تعليم القرآن للأطفال', categoryEn: 'Learn Quran for Kids' },

  // أناشيد بدون إيقاع إضافية
  { id: 'a74', youtubeId: 'G2VJcaySWPk', titleAr: 'أناشيد قرآنية تربوية - بدون إيقاع', titleEn: 'Educational Quran Nasheeds - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
  { id: 'a75', youtubeId: 'pA8oZw9L2Cc', titleAr: 'علمني الله - بدون موسيقى', titleEn: 'Allah Taught Me - No Music', sourceAr: 'قناة ريحانة للأطفال', sourceEn: 'Rayhana Kids TV', categoryAr: 'أناشيد إسلامية بدون إيقاع', categoryEn: 'Islamic Nasheeds (No Music)' },
];

// ============================================
// ENGLISH VIDEOS
// ============================================

const coreEnglish: KidsVideo[] = [
  // ═══════════════════════════════════════════
  // Stories of the Prophets
  // ═══════════════════════════════════════════

  // IQRA Cartoon - Prophet Stories
  { id: 'e1', youtubeId: 'fzOBRSvmSC8', titleAr: 'قصة آدم عليه السلام', titleEn: 'Prophet Adam (AS) - Episode 1', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets', descriptionEn: 'Animated prophet story based on Quran and Hadith' },
  { id: 'e2', youtubeId: 'l7s8R9ugb98', titleAr: 'قصة عيسى عليه السلام', titleEn: 'Prophet Isa / Jesus (AS) - Episode 31', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e3', youtubeId: '2c48V4fSqco', titleAr: 'قصة يونس عليه السلام', titleEn: 'Prophet Yunus / Jonah (AS) - Episode 14', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e4', youtubeId: 'ZPQzoLb9BAw', titleAr: 'قصة إبراهيم عليه السلام - العبد الشاكر', titleEn: 'The Grateful Servant - Prophet Ibrahim (AS)', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e5', youtubeId: 'qh652UtMDQw', titleAr: 'قصة إبراهيم - بئر زمزم', titleEn: 'Prophet Ibrahim - Well of Zamzam', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e6', youtubeId: 'O4ZTLQKsTpA', titleAr: 'قصص الأنبياء - تجميع', titleEn: 'Prophet Stories Compilation from the Quran', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e7', youtubeId: 'FWTQnAoEBkA', titleAr: 'قصة النبي محمد ﷺ', titleEn: 'Story of Prophet Muhammad (PBUH)', sourceAr: 'Zillnoorain Kids', sourceEn: 'Zillnoorain Kids', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e8', youtubeId: 'WEEORXFj-lo', titleAr: 'قصة النبي محمد ﷺ - الجزء الأول', titleEn: 'Prophet Muhammad (SAW) - Part 1', sourceAr: 'قصص الأنبياء', sourceEn: 'Prophet Stories', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e9', youtubeId: '8pREszfrqfY', titleAr: 'الرجل الذي جذب رداء النبي ﷺ', titleEn: "He Pulled Muhammad's ﷺ Cloak", sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e10', youtubeId: 'pcNfYlPP0WE', titleAr: 'قوة التمرة - من أحاديث النبي', titleEn: 'Power of a Date - Hadith Stories', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },

  // IQRA Cartoon - More Prophet Episodes
  { id: 'e11', youtubeId: 'wR7cN4Aj3eQ', titleAr: 'قصة إدريس عليه السلام', titleEn: 'Prophet Idris (AS) - Episode 02', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e12', youtubeId: 'CgYVH9IYF3c', titleAr: 'قصة نوح عليه السلام', titleEn: 'Prophet Noah (AS) - Episode 03', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e13a', youtubeId: 'o4tcfC9LArs', titleAr: 'قصة هود عليه السلام', titleEn: 'Prophet Hud (AS) - Episode 04', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e14a', youtubeId: '_RUNc_lZBVA', titleAr: 'قصة صالح عليه السلام', titleEn: 'Prophet Salih (AS) - Episode 05', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e15a', youtubeId: 'W45DrRGECQE', titleAr: 'قصة إبراهيم عليه السلام', titleEn: 'Prophet Ibrahim (AS) - Episode 06', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e16a', youtubeId: 'n6dsA7PBECo', titleAr: 'قصة لوط عليه السلام', titleEn: 'Prophet Lut (AS) - Episode 07', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e17a', youtubeId: 'W-zgP_0d6J0', titleAr: 'قصة شعيب عليه السلام', titleEn: 'Prophet Shuaib (AS) - Episode 09', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e18a', youtubeId: 'lCW3vBTh4hE', titleAr: 'قصة إسحاق عليه السلام', titleEn: 'Prophet Ishaq (AS) - Episode 10', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e19a', youtubeId: 'gzszSxjeRzA', titleAr: 'قصة يعقوب عليه السلام', titleEn: 'Prophet Yaqub (AS) - Episode 11', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e20a', youtubeId: '2EDI8RCNWjo', titleAr: 'قصة يوسف عليه السلام', titleEn: 'Prophet Yusuf (AS) - Episode 12', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e21', youtubeId: 'Y2Z-Eo0MTgk', titleAr: 'قصة سليمان عليه السلام', titleEn: 'Prophet Sulaiman (AS) - Episode 20', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e22', youtubeId: 'yGrDEioXc-k', titleAr: 'قصة دانيال عليه السلام', titleEn: 'Prophet Daniel (AS) - Episode 26', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },

  // FreeQuranEducation
  { id: 'e23', youtubeId: 'KuIYlz8G3aY', titleAr: 'أبناء الأنبياء - نعمان علي خان', titleEn: 'The Children of the Prophets - Nouman Ali Khan', sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e24', youtubeId: 'm0uSnARGAV8', titleAr: 'إبراهيم الشاب عليه السلام', titleEn: 'Young Ibrahim (AS) - Nouman Ali Khan', sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },

  // Zillnoorain & Others
  { id: 'e25', youtubeId: 'WEEORXFj-lo', titleAr: 'قصة النبي محمد ﷺ - الجزء الأول', titleEn: 'Prophet Muhammad (SAW) - Part 1', sourceAr: 'قصص الأنبياء', sourceEn: 'Prophet Stories', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e26', youtubeId: 'pcNfYlPP0WE', titleAr: 'قوة التمرة - من أحاديث النبي', titleEn: 'Power of a Date - Hadith Stories', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },

  // IQRA Cartoon - Prophet Muhammad Series
  { id: 'e27', youtubeId: 'BJBjWZRQD98', titleAr: 'غزوة أحد - قصة النبي محمد', titleEn: 'Battle of Uhud - Prophet Muhammad Stories', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },
  { id: 'e28', youtubeId: '4bE9_XQg3z8', titleAr: 'صعود الإسلام - الحلقة 1', titleEn: 'Rise of Islam - Episode 1', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الأنبياء', categoryEn: 'Stories of the Prophets' },

  // ═══════════════════════════════════════════
  // Quran Stories
  // ═══════════════════════════════════════════

  { id: 'e29', youtubeId: '7ygd_iChqZY', titleAr: 'قصة أصحاب الكهف', titleEn: 'People of the Cave - Islamic Cartoon', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'e30', youtubeId: '6nSqLgasgYA', titleAr: 'قصة قارون', titleEn: 'Qarun - Stories from Quran', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'e31', youtubeId: 'ItrS5xc0ZVE', titleAr: 'سورة التكوير - تفسير للأطفال', titleEn: 'Surah At-Taqwir - Kids Quran Tafsir', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'e32', youtubeId: 'QxiXh2u22ok', titleAr: 'بيت العنكبوت - معجزات القرآن', titleEn: "Spider's Web - Miracles of Quran", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },

  // ═══════════════════════════════════════════
  // Companions Stories (English)
  // ═══════════════════════════════════════════

  { id: 'e33', youtubeId: '2zJ_JcNHX4Q', titleAr: 'قصة خباب بن الأرت - النار تذيب جلده', titleEn: 'Fires of Coal Melting His Skin - Khabbab (RA)', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'قصص الصحابة والتابعين', categoryEn: 'Companions Stories' },

  // ═══════════════════════════════════════════
  // Islamic Manners & Ethics
  // ═══════════════════════════════════════════

  { id: 'e34', youtubeId: 'HzqlxhtcvoQ', titleAr: 'سأحلم بالنبي ﷺ الليلة', titleEn: "Tonight I'm Going to Dream About the Prophet ﷺ", sourceAr: 'قصص إسلامية للأطفال', sourceEn: 'Islamic Stories for Kids', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'e35', youtubeId: 'lGind6Cn0Tw', titleAr: 'أنا أفضل مسلم - الموسم الأول', titleEn: "I'm The Best Muslim - Season 1", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'e36', youtubeId: 'dn2nVAaVhpA', titleAr: 'أنا أفضل مسلم - إثبات النوايا', titleEn: "I'm Best Muslim - Proving Your Intentions", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'e37', youtubeId: 'Fg71fyN43dA', titleAr: 'أنا أفضل مسلم - الحلقة 3 - صيام سريع', titleEn: "I'm The Best Muslim - S1 Ep03 - Fast and Furious Muslim", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'e38', youtubeId: 'baF37RTHhD0', titleAr: 'أنا أفضل مسلم - الحلقة 6 - السلام العالمي', titleEn: "I'm The Best Muslim - S1 Ep06 - World Peace", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'e39', youtubeId: '0hXu2p_dgeU', titleAr: 'أنا أفضل مسلم - الموسم 3 - كيف تقول آمين', titleEn: "I'm Best Muslim - S3 Ep02 - How to Say Aameen", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'e40', youtubeId: 'B8O6Rs9Jz4Q', titleAr: 'أنا أفضل مسلم - الموسم 3 - تجنب الكلمات السيئة', titleEn: "I'm Best Muslim - S3 Ep03 - How to Avoid Curse Words", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'e41', youtubeId: 'kT-O0EFx5Hs', titleAr: 'أنا أفضل مسلم - كيف تصبح متديناً', titleEn: "I'm Best Muslim - S3 Ep06 - How to Become Religious", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'e42', youtubeId: '-R-tAsS0JIE', titleAr: 'أنا أفضل مسلم - جميع الحلقات', titleEn: "I'm The Best Muslim - All Episodes So Far", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },
  { id: 'e43', youtubeId: 'Zevj0ad2OVY', titleAr: 'أنا أفضل مسلم - لكل نفس ضائعة', titleEn: "I'm Best Muslim: For Every Lost Soul, Humanity Lost", sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'آداب وأخلاق إسلامية', categoryEn: 'Islamic Manners & Ethics' },

  // ═══════════════════════════════════════════
  // Learn Quran for Kids (English)
  // ═══════════════════════════════════════════

  { id: 'e44', youtubeId: 'Wu86iLXHmrc', titleAr: 'تعلم التجويد - الطريقة السهلة', titleEn: 'Learn Tajweed - the Easy Way', sourceAr: 'فري قرآن إيديوكيشن', sourceEn: 'FreeQuranEducation', categoryAr: 'تعليم القرآن للأطفال', categoryEn: 'Learn Quran for Kids' },
  { id: 'e45', youtubeId: 'eym3nxelg0c', titleAr: 'دعاء الأطفال للاستغفار', titleEn: 'Kids Dua for Forgiveness - Quranic Dua Series', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'تعليم القرآن للأطفال', categoryEn: 'Learn Quran for Kids' },
];

// Aggregate core + additional videos (dedup by youtubeId)
function dedupKidsVideos(...lists: KidsVideo[][]): KidsVideo[] {
  const m = new Map<string, KidsVideo>();
  for (const l of lists) for (const v of l) if (!m.has(v.youtubeId)) m.set(v.youtubeId, v);
  return Array.from(m.values());
}

export const ARABIC_VIDEOS: KidsVideo[] = dedupKidsVideos(coreArabic, additionalArabicKids, additionalArabicKidsBatch2, additionalArabicKidsBatch3, additionalKidsBatch4);
export const ENGLISH_VIDEOS: KidsVideo[] = dedupKidsVideos(coreEnglish, additionalEnglishKids, additionalEnglishKidsBatch2, additionalEnglishKidsBatch3);
