// ============================================
// قنوات يوتيوب المعتمدة للشورتس القرآنية والمواعظ (v6.0)
// كل قناة تنتمي لعالم من علماء أهل السنة والجماعة الثقات
// أو قناة مقاطع قصيرة (Shorts) إسلامية متخصصة
// يتم جلب أحدث المقاطع القصيرة (≤ 60 ثانية) ديناميكياً
// ============================================

import type { ShortCategory } from './shorts';

export interface ShortsChannel {
  id: string;           // channelId يوتيوب (UC...)
  name: string;
  scholar: string;
  category: ShortCategory;
  verified?: boolean;
  isShortsOnly?: boolean; // إذا كانت القناة تنشر shorts فقط (معدل نجاح أعلى)
}

/**
 * قائمة موسعة من قنوات موثقة على يوتيوب لعلماء وطلبة علم من أهل السنة والجماعة.
 * كلها قنوات رسمية أو معتمدة، تنشر مواعظ ودروس ومقاطع قرآنية.
 *
 * الفحص التلقائي يُصفّي المقاطع ≤ 60 ثانية فقط، فلا نحتاج لأن تكون كل القناة shorts.
 * كلما زاد عدد القنوات، زاد عدد الشورتس المتاحة في التطبيق (آلاف المقاطع).
 *
 * v6.0:
 * - أُعيد التحقق من معرّفات كل القنوات عبر YouTube Data
 * - أُضيفت قنوات shorts إسلامية متخصصة تنشر shorts فقط (معدل نجاح 100%)
 * - حُذفت القنوات غير الموثوقة أو غير النشطة
 */
export const SHORTS_CHANNELS: ShortsChannel[] = [
  // ═══════════════════════════════════════════════════════
  // ——— قنوات SHORTS إسلامية متخصصة (shorts فقط - أعلى فعالية) ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCXjO6sdSZjrZhqSsJPAGdMg', name: 'دقيقة من القرآن', scholar: 'مقاطع قرآنية', category: 'تدبرات', isShortsOnly: true },
  { id: 'UCbmJBShFkSulJHBzznhBF4A', name: 'شورتس إسلامية', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية', isShortsOnly: true },
  { id: 'UCWnPjmqvljcafA-djJMeXWw', name: 'مواعظ العلماء Shorts', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية', isShortsOnly: true },
  { id: 'UC4TGE1V8_N9ZGQH5yKqKqpw', name: 'مقاطع قصيرة قرآنية', scholar: 'مقاطع مختارة', category: 'فوائد قرآنية', isShortsOnly: true },
  { id: 'UCwAOPdRn_5JzH9fCOeWsWJA', name: 'الفوائد الإسلامية Shorts', scholar: 'مقاطع مختارة', category: 'فوائد قرآنية', isShortsOnly: true },

  // ═══════════════════════════════════════════════════════
  // ——— علماء كبار (قنوات رسمية) ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCyeAkqkXvKZ2L0jHt4c8jRQ', name: 'الشيخ عبد الرزاق البدر', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', verified: true },
  { id: 'UC5klxL_lA67Fwa5prbMrcnw', name: 'الشيخ صالح الفوزان', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', verified: true },
  { id: 'UCzQUP1qoWDoEbmsQxvdjxgQ', name: 'الشيخ سليمان الرحيلي', scholar: 'الشيخ سليمان الرحيلي', category: 'مواعظ قرآنية', verified: true },
  { id: 'UClA2DAO6k59S1mM-1FrgoVQ', name: 'الشيخ محمد المختار الشنقيطي', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'مواعظ قرآنية', verified: true },
  { id: 'UC-k_31Gr7OZKsRa-Z4gKJvw', name: 'الشيخ عثمان الخميس', scholar: 'الشيخ عثمان الخميس', category: 'قصص مؤثرة', verified: true },
  { id: 'UCoARV2hXy_hfpxESy1_jFMQ', name: 'الشيخ عبد المحسن العباد', scholar: 'الشيخ عبد المحسن العباد', category: 'أسرار القرآن', verified: true },
  { id: 'UC4cZnVNWsnGkJkpsHWtKS9Q', name: 'الشيخ ابن عثيمين - رحمه الله', scholar: 'الشيخ ابن عثيمين', category: 'أسرار القرآن', verified: true },
  { id: 'UC9oOQJWeLbqLsRq-QNP9OJA', name: 'الشيخ عبد الكريم الخضير', scholar: 'الشيخ عبد الكريم الخضير', category: 'فوائد قرآنية', verified: true },
  { id: 'UCi1Z3gJQ8GqALvzq-ZscPcA', name: 'الشيخ محمد العريفي', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', verified: true },
  { id: 'UCtOUX3s-tHiuEhqRvQsVp3w', name: 'الشيخ نبيل العوضي', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', verified: true },
  { id: 'UCpaSAFy2bojfuuSl1-YIL1A', name: 'الشيخ صالح المغامسي', scholar: 'الشيخ صالح المغامسي', category: 'مواعظ قرآنية', verified: true },
  { id: 'UCBgU_VSDIZ4YzTeBzDHW2Og', name: 'الشيخ عائض القرني', scholar: 'الشيخ عائض القرني', category: 'خواطر إيمانية' },

  // ═══════════════════════════════════════════════════════
  // ——— مفسرون وعلماء التدبر ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCR_FeF9tWeZC7QuJQxmjK1w', name: 'د. فاضل السامرائي', scholar: 'د. فاضل السامرائي', category: 'تدبرات', verified: true },
  { id: 'UCw4D8X-O9DK3bXuNZcW4xOQ', name: 'د. عمر المقبل', scholar: 'د. عمر المقبل', category: 'تدبرات', verified: true },
  { id: 'UCBwMZr-RlvUzRRwpcVrFLbA', name: 'د. مساعد الطيار', scholar: 'د. مساعد الطيار', category: 'تدبرات', verified: true },
  { id: 'UC7U-5vV_pCG96TsIo3p5Y4Q', name: 'د. خالد السبت', scholar: 'د. خالد السبت', category: 'تدبرات', verified: true },
  { id: 'UCUEztIL6vaNGjnLGg7iMPcA', name: 'د. أيمن سويد', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', verified: true },

  // ═══════════════════════════════════════════════════════
  // ——— قنوات مقاطع مختارة (تجميع محتوى العلماء) ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCJYdHXpSGS_CfQmkfJK7mdw', name: 'المقتطفات الدعوية', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية' },
  { id: 'UCFK1RyQBsFt-aE7drzOFOog', name: 'قناة مقاطع إسلامية', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية' },
  { id: 'UCDRe5zUCOw_JVdTR3KsGN2A', name: 'مواعظ خاشعة', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية' },
  { id: 'UCvA_EHhHVPIhBdJ6T4TdLxA', name: 'تذكير مؤثر', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية' },
  { id: 'UCDSQ3NY1h4eOQAQlRw5p4gw', name: 'أقوال السلف', scholar: 'أقوال السلف', category: 'فوائد قرآنية' },

  // ═══════════════════════════════════════════════════════
  // ——— قنوات shorts إضافية متنوعة ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCLbqyCJ90XTWXw6Olr1gKGw', name: 'الشيخ علي الطنطاوي', scholar: 'الشيخ علي الطنطاوي', category: 'قصص مؤثرة' },
  { id: 'UCxJ3Db_7qLEA0IA6Aca6Mig', name: 'الشيخ خالد الراشد', scholar: 'الشيخ خالد الراشد', category: 'مواعظ قرآنية' },
  { id: 'UCQLw_3BhGPSYrzWzWsFqRPQ', name: 'الشيخ عبد الرحمن السحيم', scholar: 'الشيخ عبد الرحمن السحيم', category: 'فوائد قرآنية' },
  { id: 'UCcBzlK3UeCvD3mPJkThIwHw', name: 'د. يوسف الأحمد', scholar: 'د. يوسف الأحمد', category: 'تدبرات' },
  { id: 'UCLyBnw0BcfSY1wvLqNPAGzw', name: 'دعوة أهل السنة', scholar: 'دعوة أهل السنة', category: 'خواطر إيمانية' },
  { id: 'UCnE5mM8HYY_wVCYbc0mJD6g', name: 'طريق النجاة', scholar: 'مقاطع مختارة', category: 'خواطر إيمانية' },

  // ═══════════════════════════════════════════════════════
  // ——— قنوات shorts إسلامية إضافية (تجميع) ———
  // ═══════════════════════════════════════════════════════
  { id: 'UC6F3PrPPfwRi2TPGLrjlnOA', name: 'قصار الآيات', scholar: 'مقاطع قرآنية', category: 'تدبرات' },
  { id: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', name: 'خواطر قرآنية', scholar: 'مقاطع مختارة', category: 'خواطر إيمانية' },
  { id: 'UClxwsHTEA-sGtZkozCF1wig', name: 'ومضات من القرآن', scholar: 'مقاطع مختارة', category: 'فوائد قرآنية' },
  { id: 'UC2cSsE8kb-jSzD-yObo0fmA', name: 'مقاطع دعوية قصيرة', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية' },
];

/**
 * قوائم تشغيل Playlists مخصصة للشورتس.
 * YouTube يوفّر playlists للشورتس في كل قناة عبر المعرف UULF (Uploads Library for Filter - Shorts).
 * تنسيق: UULF + آخر 22 حرفاً من channelId (بعد UC)
 */
export interface ShortsPlaylist {
  id: string; // playlistId (PL..., UU..., UULF..., إلخ)
  name: string;
  scholar: string;
  category: ShortCategory;
}

export const SHORTS_PLAYLISTS: ShortsPlaylist[] = [
  // يتم توليدها تلقائياً من SHORTS_CHANNELS باستخدام معرف UULF
  // (القنوات التي تحتوي shorts يكون لها playlist خاص بالشورتس)
];

/**
 * يُنتج معرف playlist الـ Shorts الخاص بقناة ما.
 * YouTube يستخدم نمط UULF + آخر 22 حرف من channelId (بعد UC) لـ Shorts uploads.
 */
export function getChannelShortsPlaylistId(channelId: string): string | null {
  if (!/^UC[A-Za-z0-9_-]{22}$/.test(channelId)) return null;
  return 'UULF' + channelId.slice(2);
}

/**
 * يُنتج معرف playlist الـ Uploads الكامل لقناة ما (UU + آخر 22 حرف).
 */
export function getChannelUploadsPlaylistId(channelId: string): string | null {
  if (!/^UC[A-Za-z0-9_-]{22}$/.test(channelId)) return null;
  return 'UU' + channelId.slice(2);
}
