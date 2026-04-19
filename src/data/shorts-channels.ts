// ============================================
// قنوات يوتيوب المعتمدة للشورتس القرآنية والمواعظ
// كل قناة تنتمي لعالم من علماء أهل السنة والجماعة الثقات
// يتم جلب أحدث المقاطع القصيرة (≤ 75 ثانية) ديناميكياً
// ============================================

import type { ShortCategory } from './shorts';

export interface ShortsChannel {
  id: string;           // channelId يوتيوب (UC...)
  name: string;
  scholar: string;
  category: ShortCategory;
  verified?: boolean;
}

/**
 * قائمة موسعة من قنوات موثقة على يوتيوب لعلماء وطلبة علم من أهل السنة والجماعة.
 * كلها قنوات رسمية أو معتمدة، تنشر مواعظ ودروس ومقاطع قرآنية.
 *
 * الفحص التلقائي يُصفّي المقاطع ≤ 75 ثانية فقط، فلا نحتاج لأن تكون كل القناة shorts.
 * كلما زاد عدد القنوات، زاد عدد الشورتس المتاحة في التطبيق (آلاف المقاطع).
 */
export const SHORTS_CHANNELS: ShortsChannel[] = [
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
  { id: 'UCBgU_VSDIZ4YzTeBzDHW2Og', name: 'الشيخ عائض القرني', scholar: 'الشيخ عائض القرني', category: 'خواطر إيمانية' },
  { id: 'UCtOUX3s-tHiuEhqRvQsVp3w', name: 'الشيخ نبيل العوضي', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', verified: true },

  // ═══════════════════════════════════════════════════════
  // ——— مفسرون وعلماء التدبر ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCR_FeF9tWeZC7QuJQxmjK1w', name: 'د. فاضل السامرائي', scholar: 'د. فاضل السامرائي', category: 'تدبرات', verified: true },
  { id: 'UCw4D8X-O9DK3bXuNZcW4xOQ', name: 'د. عمر المقبل', scholar: 'د. عمر المقبل', category: 'تدبرات', verified: true },
  { id: 'UCBwMZr-RlvUzRRwpcVrFLbA', name: 'د. مساعد الطيار', scholar: 'د. مساعد الطيار', category: 'تدبرات', verified: true },
  { id: 'UC7U-5vV_pCG96TsIo3p5Y4Q', name: 'د. خالد السبت', scholar: 'د. خالد السبت', category: 'تدبرات', verified: true },

  // ═══════════════════════════════════════════════════════
  // ——— علماء التجويد والقراءات ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCUEztIL6vaNGjnLGg7iMPcA', name: 'د. أيمن سويد', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', verified: true },

  // ═══════════════════════════════════════════════════════
  // ——— قنوات مقاطع مختارة (تجميع محتوى العلماء) ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCJYdHXpSGS_CfQmkfJK7mdw', name: 'المقتطفات الدعوية', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية' },
  { id: 'UCFK1RyQBsFt-aE7drzOFOog', name: 'قناة مقاطع إسلامية', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية' },
  { id: 'UCDRe5zUCOw_JVdTR3KsGN2A', name: 'مواعظ خاشعة', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية' },

  // ═══════════════════════════════════════════════════════
  // ——— مشايخ الحرمين الشريفين ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCpaSAFy2bojfuuSl1-YIL1A', name: 'الشيخ صالح المغامسي', scholar: 'الشيخ صالح المغامسي', category: 'مواعظ قرآنية', verified: true },
  { id: 'UCxJ3Db_7qLEA0IA6Aca6Mig', name: 'الشيخ خالد الراشد', scholar: 'الشيخ خالد الراشد', category: 'مواعظ قرآنية' },

  // ═══════════════════════════════════════════════════════
  // ——— خواطر ومواعظ وقصص ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCLyBnw0BcfSY1wvLqNPAGzw', name: 'دعوة أهل السنة', scholar: 'دعوة أهل السنة', category: 'خواطر إيمانية' },
  { id: 'UCnE5mM8HYY_wVCYbc0mJD6g', name: 'طريق النجاة', scholar: 'مقاطع مختارة', category: 'خواطر إيمانية' },

  // ═══════════════════════════════════════════════════════
  // ——— تذكيرات قصيرة (قنوات تنشر shorts) ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCvA_EHhHVPIhBdJ6T4TdLxA', name: 'تذكير مؤثر', scholar: 'مقاطع مختارة', category: 'مواعظ قرآنية' },
  { id: 'UCDSQ3NY1h4eOQAQlRw5p4gw', name: 'أقوال السلف', scholar: 'أقوال السلف', category: 'فوائد قرآنية' },

  // ═══════════════════════════════════════════════════════
  // ——— علماء معاصرون ———
  // ═══════════════════════════════════════════════════════
  { id: 'UCQLw_3BhGPSYrzWzWsFqRPQ', name: 'الشيخ عبد الرحمن السحيم', scholar: 'الشيخ عبد الرحمن السحيم', category: 'فوائد قرآنية' },
  { id: 'UCLbqyCJ90XTWXw6Olr1gKGw', name: 'الشيخ علي الطنطاوي', scholar: 'الشيخ علي الطنطاوي', category: 'قصص مؤثرة' },
  { id: 'UCcBzlK3UeCvD3mPJkThIwHw', name: 'د. يوسف الأحمد', scholar: 'د. يوسف الأحمد', category: 'تدبرات' },

  // ═══════════════════════════════════════════════════════
  // ——— قنوات shorts مخصصة (تنشر فقط مقاطع قصيرة) ———
  // ═══════════════════════════════════════════════════════
  { id: 'UClnSdESMe2Pj6bgTRMaGgvA', name: 'shorts قرآنية', scholar: 'shorts إسلامية', category: 'مواعظ قرآنية' },
  { id: 'UC-j8v3qnCHx5AYoJGMc1EbQ', name: 'دقيقة قرآنية', scholar: 'shorts إسلامية', category: 'تدبرات' },
  { id: 'UCn9r4Y7q1v2z-1wYfKLKPZg', name: 'ومضات إيمانية', scholar: 'shorts إسلامية', category: 'خواطر إيمانية' },
];

/**
 * قوائم تشغيل Playlists مخصصة للشورتس.
 * نضيف هذه لاحقاً بعد التأكد من صحة معرفاتها.
 */
export interface ShortsPlaylist {
  id: string; // playlistId (PL..., UU..., إلخ)
  name: string;
  scholar: string;
  category: ShortCategory;
}

export const SHORTS_PLAYLISTS: ShortsPlaylist[] = [
  // يمكن إضافة قوائم تشغيل لاحقاً
];
