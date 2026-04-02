'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Play, Search, X, BookOpen,
  Sparkles, Video,
  Star, Maximize2, Minimize2,
  Scroll, Baby, Heart, Tv
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

// ============================================
// TYPES
// ============================================

type KidsCategoryAr =
  | 'قصص الأنبياء'
  | 'قصص القرآن'
  | 'قصص الحيوان في القرآن'
  | 'قصص الصحابة والتابعين'
  | 'أناشيد إسلامية بدون إيقاع'
  | 'تعليم القرآن للأطفال'
  | 'آداب وأخلاق إسلامية';

type KidsCategoryEn =
  | 'Stories of the Prophets'
  | 'Quran Stories'
  | 'Animal Stories from Quran'
  | 'Companions Stories'
  | 'Islamic Nasheeds (No Music)'
  | 'Learn Quran for Kids'
  | 'Islamic Manners & Ethics';

interface KidsVideo {
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
// CATEGORY CONFIG
// ============================================

interface CatConfig { icon: any; bgColor: string; emoji: string; descriptionAr: string; descriptionEn: string }

const KIDS_CATEGORY_CONFIG: Record<KidsCategoryAr, CatConfig & { enKey: KidsCategoryEn }> = {
  'قصص الأنبياء': { icon: BookOpen, bgColor: 'from-emerald-500 to-teal-600', emoji: '🌟', descriptionAr: 'قصص الأنبياء والرسل للأطفال', descriptionEn: 'Stories of the Prophets for Kids', enKey: 'Stories of the Prophets' },
  'قصص القرآن': { icon: Scroll, bgColor: 'from-blue-500 to-indigo-600', emoji: '📖', descriptionAr: 'قصص من القرآن الكريم للأطفال', descriptionEn: 'Stories from the Holy Quran for Kids', enKey: 'Quran Stories' },
  'قصص الحيوان في القرآن': { icon: Heart, bgColor: 'from-amber-500 to-orange-600', emoji: '🐪', descriptionAr: 'قصص الحيوانات المذكورة في القرآن', descriptionEn: 'Animal Stories mentioned in the Quran', enKey: 'Animal Stories from Quran' },
  'قصص الصحابة والتابعين': { icon: Star, bgColor: 'from-purple-500 to-fuchsia-600', emoji: '⭐', descriptionAr: 'قصص الصحابة والتابعين للأطفال', descriptionEn: 'Stories of the Companions for Kids', enKey: 'Companions Stories' },
  'أناشيد إسلامية بدون إيقاع': { icon: Sparkles, bgColor: 'from-rose-500 to-pink-600', emoji: '🎤', descriptionAr: 'أناشيد إسلامية بدون موسيقى', descriptionEn: 'Islamic Nasheeds without Music', enKey: 'Islamic Nasheeds (No Music)' },
  'تعليم القرآن للأطفال': { icon: Tv, bgColor: 'from-cyan-500 to-teal-600', emoji: '📚', descriptionAr: 'تعليم القرآن والتجويد للصغار', descriptionEn: 'Learn Quran & Tajweed for Kids', enKey: 'Learn Quran for Kids' },
  'آداب وأخلاق إسلامية': { icon: Baby, bgColor: 'from-lime-500 to-green-600', emoji: '🌿', descriptionAr: 'تعليم الآداب الإسلامية للأطفال', descriptionEn: 'Teaching Islamic Etiquette to Kids', enKey: 'Islamic Manners & Ethics' },
};

// ============================================
// ARABIC VIDEOS - المقاطع العربية
// بدون موسيقى أو مخالفات شرعية
// ============================================

const ARABIC_VIDEOS: KidsVideo[] = [
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
  { id: 'a12', youtubeId: 'fyHqHof8-xU', titleAr: 'قصة أصحاب الأخدود - الجزء الأول', titleEn: 'People of the Ditch - Part 1', sourceAr: 'قصص الإنسان في القرآن', sourceEn: 'Human Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a13', youtubeId: 'qE48KorARKA', titleAr: 'قصة أصحاب الأخدود - الجزء الثاني', titleEn: 'People of the Ditch - Part 2', sourceAr: 'قصص الإنسان في القرآن', sourceEn: 'Human Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a14', youtubeId: 'hvm2ThLwYko', titleAr: 'قصة ذو القرنين - الجزء الأول', titleEn: 'Story of Dhul-Qarnayn - Part 1', sourceAr: 'قصص الإنسان في القرآن', sourceEn: 'Human Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a15', youtubeId: 'Gt15cpRQ9iI', titleAr: 'قصة أصحاب الجنة - الجزء الثالث', titleEn: 'Owners of the Garden - Part 3', sourceAr: 'قصص الإنسان في القرآن', sourceEn: 'Human Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a16', youtubeId: 'aebLGAcdsKE', titleAr: 'قصة النمرود - الجزء الثاني', titleEn: 'Story of Nimrod - Part 2', sourceAr: 'قصص الإنسان في القرآن', sourceEn: 'Human Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a17', youtubeId: 'InmLzPOjz5E', titleAr: 'قصة السامري - الجزء الثاني', titleEn: 'Story of the Samaritan - Part 2', sourceAr: 'قصص الإنسان في القرآن', sourceEn: 'Human Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a18', youtubeId: 'qGXSkwdVReg', titleAr: 'قصة السامري - الجزء الثالث', titleEn: 'Story of the Samaritan - Part 3', sourceAr: 'قصص الإنسان في القرآن', sourceEn: 'Human Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a19', youtubeId: 'lttUGHte4mY', titleAr: 'قصة حاطب بن أبي بلتعة - الجزء الأول', titleEn: 'Story of Hatib ibn Abi Baltaah - Part 1', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Stories of Quran Verses', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a20', youtubeId: 'FUc3eVoHrWg', titleAr: 'قصة حاطب بن أبي بلتعة - الجزء الثاني', titleEn: 'Story of Hatib ibn Abi Baltaah - Part 2', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Stories of Quran Verses', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a21', youtubeId: 'YcwgwTUkxsM', titleAr: 'قصة أصحاب الفيل للأطفال', titleEn: 'Story of the Elephant for Kids', sourceAr: 'بالعربي نتعلم', sourceEn: 'BeLarabyApps', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a45', youtubeId: 'hdjvyWViGkg', titleAr: 'قصة صاحب الجنتين - الجزء الثاني', titleEn: 'Owner of the Two Gardens - Part 2', sourceAr: 'قصص الإنسان في القرآن', sourceEn: 'Human Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a46', youtubeId: '05hBH2kde_Q', titleAr: 'قصة عياش بن أبي ربيعة - الجزء الأول', titleEn: 'Story of Ayyash ibn Abi Rabiah - Part 1', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Verses Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a47', youtubeId: 'jPI_scJiyZc', titleAr: 'قصة وحشي - الجزء الأول', titleEn: 'Story of Wahshi - Part 1', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Verses Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a48', youtubeId: 'b7U17Oc2lpk', titleAr: 'قصص الآيات في القرآن - الحلقة 15', titleEn: 'Verses Stories from Quran - Episode 15', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Verses Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a49', youtubeId: 'AMXtNsj9E4w', titleAr: 'قصة معاذ بن جبل - الجزء الأول', titleEn: 'Story of Muadh ibn Jabal - Part 1', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Verses Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a50', youtubeId: 'mA8QBKv3YQw', titleAr: 'قصة أم شريك', titleEn: 'Story of Umm Sharik', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Verses Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a51', youtubeId: 'AJjDTfVbOTY', titleAr: 'قصة عثمان بن عفان', titleEn: 'Story of Uthman ibn Affan', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Verses Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a52', youtubeId: '5OYDY63rFVY', titleAr: 'قصة معاذ بن جبل - الجزء الثالث', titleEn: 'Story of Muadh ibn Jabal - Part 3', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Verses Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a53', youtubeId: 'FZkQS4H_ykY', titleAr: 'قصة مرثد بن أبي مرثد - الجزء الثاني', titleEn: 'Story of Marthad ibn Abi Marthad - Part 2', sourceAr: 'قصص الآيات في القرآن', sourceEn: 'Verses Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },
  { id: 'a54', youtubeId: '0wPOErYgLLA', titleAr: 'قصص الإنسان في القرآن - الحلقة 12', titleEn: 'Human Stories from Quran - Episode 12', sourceAr: 'قصص الإنسان في القرآن', sourceEn: 'Human Stories from Quran', categoryAr: 'قصص القرآن', categoryEn: 'Quran Stories' },

  // ═══════════════════════════════════════════
  // قصص الحيوان في القرآن
  // ═══════════════════════════════════════════

  { id: 'a22', youtubeId: 'eHobRabok1s', titleAr: 'غراب ابني آدم - الجزء الأول', titleEn: "Raven of Adam's Sons - Part 1", sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
  { id: 'a23', youtubeId: 'zIQF6uu1TVs', titleAr: 'ناقة صالح - الجزء الثاني', titleEn: "Salih's She-Camel - Part 2", sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
  { id: 'a24', youtubeId: 'ikuY5Gqd4IU', titleAr: 'نملة سليمان - الجزء الأول', titleEn: "Solomon's Ant - Part 1", sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
  { id: 'a25', youtubeId: 'XFpAR75iew0', titleAr: '8 قصص حيوانات في القرآن - تجميع للأطفال', titleEn: '8 Animal Stories from Quran - Compilation', sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
  { id: 'a26', youtubeId: '_6qbeLtAgng', titleAr: 'قصة النملة - كارتون بدون موسيقى', titleEn: 'Story of the Ant - Cartoon No Music', sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
  { id: 'a55', youtubeId: 'WEghztqDd2M', titleAr: 'هدهد سليمان - الجزء الأول', titleEn: "Solomon's Hoopoe - Part 1", sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
  { id: 'a56', youtubeId: 'YAK_-ohIANw', titleAr: 'ذئب يوسف - الجزء الثاني', titleEn: "Yusuf's Wolf - Part 2", sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
  { id: 'a57', youtubeId: '_HZ_DgFMzS0', titleAr: 'الغراب المعلم - قصص الحيوان في القرآن', titleEn: 'The Teaching Raven - Animal Stories from Quran', sourceAr: 'قصص الحيوان في القرآن', sourceEn: 'Animal Stories from Quran', categoryAr: 'قصص الحيوان في القرآن', categoryEn: 'Animal Stories from Quran' },
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
];

// ============================================
// ENGLISH VIDEOS - المقاطع الإنجليزية
// No music, based on Quran and Sunnah
// ============================================

const ENGLISH_VIDEOS: KidsVideo[] = [
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
  { id: 'e46', youtubeId: '5A1tzaBDQBU', titleAr: 'أركان الإسلام الخمسة - نشيد', titleEn: '5 Pillars of Islam - Islamic Nasheed', sourceAr: 'إقرأ كرتون', sourceEn: 'IQRA Cartoon', categoryAr: 'تعليم القرآن للأطفال', categoryEn: 'Learn Quran for Kids' },
];

// ============================================
// COMPONENT
// ============================================

export function KidsVideos() {
  const { isRTL } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<KidsVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KidsCategoryAr | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Choose videos based on language
  const VIDEOS = useMemo(() => isRTL ? ARABIC_VIDEOS : ENGLISH_VIDEOS, [isRTL]);

  // Get unique sources
  const sources = useMemo(() => {
    return [...new Set(VIDEOS.map(v => isRTL ? v.sourceAr : v.sourceEn))].sort();
  }, [VIDEOS, isRTL]);

  const categories = useMemo(() => Object.keys(KIDS_CATEGORY_CONFIG) as KidsCategoryAr[], []);

  const getCategoryCount = useCallback((cat: KidsCategoryAr) => {
    return VIDEOS.filter(v => v.categoryAr === cat).length;
  }, [VIDEOS]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    let result = VIDEOS;
    if (selectedCategory !== 'all') {
      result = result.filter(v => v.categoryAr === selectedCategory);
    }
    if (selectedSource !== 'all') {
      result = result.filter(v => (isRTL ? v.sourceAr : v.sourceEn) === selectedSource);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => {
        const title = isRTL ? v.titleAr : v.titleEn;
        const source = isRTL ? v.sourceAr : v.sourceEn;
        const desc = isRTL ? (v.descriptionAr || '') : (v.descriptionEn || '');
        return title.toLowerCase().includes(q) || title.includes(searchQuery) ||
               source.toLowerCase().includes(q) || source.includes(searchQuery) ||
               desc.toLowerCase().includes(q);
      });
    }
    return result;
  }, [VIDEOS, selectedCategory, selectedSource, searchQuery, isRTL]);

  // Videos by category
  const videosByCategory = useMemo(() => {
    const map: Partial<Record<KidsCategoryAr, KidsVideo[]>> = {};
    for (const cat of categories) {
      const vids = VIDEOS.filter(v => v.categoryAr === cat);
      if (vids.length > 0) map[cat] = vids;
    }
    return map;
  }, [categories, VIDEOS]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;
    if (!isFullscreen) playerRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  // Reset filters on language change
  useEffect(() => {
    setActiveVideo(null);
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSource('all');
  }, [isRTL]);

  // ============================================
  // RENDER VIDEO PLAYER
  // ============================================

  const renderVideoPlayer = () => {
    if (!activeVideo) return null;
    const title = isRTL ? activeVideo.titleAr : activeVideo.titleEn;
    const source = isRTL ? activeVideo.sourceAr : activeVideo.sourceEn;

    return (
      <div ref={playerRef} className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
        <div className={`relative ${isFullscreen ? 'h-screen' : 'aspect-video'}`}>
          <iframe
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className={`p-4 bg-gradient-to-t from-black/90 to-black/50 text-white ${isFullscreen ? 'absolute bottom-0 left-0 right-0' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{title}</h3>
              <p className="text-xs text-white/70 mt-0.5">{source}</p>
            </div>
            <div className={`flex gap-2 ${isRTL ? 'mr-2' : 'ml-2'}`}>
              <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition p-1">
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button onClick={() => setActiveVideo(null)} className="text-white/80 hover:text-white transition p-1">
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
    const title = isRTL ? video.titleAr : video.titleEn;
    const source = isRTL ? video.sourceAr : video.sourceEn;
    const catConfig = KIDS_CATEGORY_CONFIG[video.categoryAr];
    const catLabel = isRTL ? video.categoryAr : video.categoryEn;

    return (
      <Card
        key={video.id}
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden border-0 shadow-md ${isActive ? 'ring-2 ring-orange-400 shadow-orange-200/50' : ''}`}
        onClick={() => setActiveVideo(video)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
            <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt={title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/90 group-hover:bg-orange-500 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg">
                <Play className="w-5 h-5 text-white mr-[-2px]" fill="white" />
              </div>
            </div>
            {isActive && (
              <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'}`}>
                <Badge className="bg-orange-500 text-white text-[10px] px-2 py-0.5 animate-pulse">
                  {isRTL ? 'يعرض الآن' : 'Playing'}
                </Badge>
              </div>
            )}
            <div className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'}`}>
              <Badge className="bg-black/60 text-white text-[10px] px-2 py-0.5">
                {catConfig?.emoji} {catLabel}
              </Badge>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1 leading-tight">{title}</h3>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <Baby className="w-3 h-3 text-orange-500 dark:text-orange-400" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{source}</p>
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
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">🧒</div>
          <div>
            <h2 className="text-xl font-bold">{isRTL ? 'مقاطع الأطفال' : 'Kids Videos'}</h2>
            <p className="text-amber-100 text-sm">{isRTL ? 'قصص ومقاطع تعليمية مناسبة للأطفال' : 'Educational stories & videos for kids'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>{VIDEOS.length} {isRTL ? 'مقطع' : 'videos'}</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{Object.keys(videosByCategory).length} {isRTL ? 'تصنيف' : 'categories'}</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>{isRTL ? 'بدون موسيقى' : 'No Music'}</span>
          </div>
        </div>
      </div>

      {renderVideoPlayer()}

      {/* Search */}
      <div className="relative max-w-lg mx-auto">
        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
        <Input
          type="text"
          placeholder={isRTL ? 'ابحث بالعنوان أو المصدر...' : 'Search by title or source...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700`}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={`rounded-full px-4 py-1.5 h-auto text-sm ${selectedCategory === 'all' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}
          >
            {isRTL ? 'الكل' : 'All'} ({VIDEOS.length})
          </Button>
          {categories.map(cat => {
            const count = getCategoryCount(cat);
            if (count === 0) return null;
            const catInfo = KIDS_CATEGORY_CONFIG[cat];
            const label = isRTL ? cat : catInfo.enKey;
            return (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`rounded-full px-4 py-1.5 h-auto text-sm ${selectedCategory === cat ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}
              >
                {catInfo.emoji} {label} ({count})
              </Button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm min-w-[200px]"
          >
            <option value="all">{isRTL ? 'جميع المصادر' : 'All Sources'}</option>
            {sources.map(s => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all' || selectedSource !== 'all') && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {isRTL ? `عرض ${filteredVideos.length} مقطع` : `Showing ${filteredVideos.length} videos`}
        </p>
      )}

      {/* Videos Grid by Category */}
      {selectedCategory === 'all' && !searchQuery && selectedSource === 'all' ? (
        categories.map(category => {
          const categoryVideos = videosByCategory[category];
          if (!categoryVideos || categoryVideos.length === 0) return null;
          const catInfo = KIDS_CATEGORY_CONFIG[category];
          const CatIcon = catInfo.icon;
          const catLabel = isRTL ? category : catInfo.enKey;
          const catDesc = isRTL ? catInfo.descriptionAr : catInfo.descriptionEn;

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{catInfo.emoji} {catLabel}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{catDesc}</p>
                </div>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <Badge variant="outline" className="text-xs">{categoryVideos.length} {isRTL ? 'مقطع' : 'videos'}</Badge>
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
          <p className="text-slate-500 dark:text-slate-400 font-medium">{isRTL ? 'لم يتم العثور على مقاطع مطابقة' : 'No matching videos found'}</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{isRTL ? 'جرب كلمات بحث مختلفة' : 'Try different search terms'}</p>
        </div>
      )}
    </div>
  );
}
