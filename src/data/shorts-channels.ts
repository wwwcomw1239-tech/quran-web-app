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
 * قائمة قنوات موثقة من علماء أهل السنة والجماعة.
 * جميعها قنوات رسمية أو رسمية مُعتمدة تنشر مقاطع قرآنية قصيرة.
 *
 * ملاحظة: بعض القنوات قد لا تنشر shorts بشكل منتظم، ولكن الفحص
 * التلقائي يُصفّي المقاطع ≤ 75 ثانية.
 */
export const SHORTS_CHANNELS: ShortsChannel[] = [
  // ——— قنوات المواعظ القرآنية ———
  { id: 'UCyeAkqkXvKZ2L0jHt4c8jRQ', name: 'الشيخ عبد الرزاق البدر', scholar: 'الشيخ عبد الرزاق البدر', category: 'مواعظ قرآنية', verified: true },
  { id: 'UC5klxL_lA67Fwa5prbMrcnw', name: 'الشيخ صالح الفوزان', scholar: 'الشيخ صالح الفوزان', category: 'مواعظ قرآنية', verified: true },
  { id: 'UCzQUP1qoWDoEbmsQxvdjxgQ', name: 'الشيخ سليمان الرحيلي', scholar: 'الشيخ سليمان الرحيلي', category: 'مواعظ قرآنية', verified: true },
  { id: 'UClA2DAO6k59S1mM-1FrgoVQ', name: 'الشيخ محمد المختار الشنقيطي', scholar: 'الشيخ محمد المختار الشنقيطي', category: 'مواعظ قرآنية', verified: true },
  { id: 'UC-k_31Gr7OZKsRa-Z4gKJvw', name: 'الشيخ عثمان الخميس', scholar: 'الشيخ عثمان الخميس', category: 'قصص مؤثرة', verified: true },

  // ——— قنوات التدبر ———
  { id: 'UCR_FeF9tWeZC7QuJQxmjK1w', name: 'د. فاضل السامرائي', scholar: 'د. فاضل السامرائي', category: 'تدبرات', verified: true },
  { id: 'UCw4D8X-O9DK3bXuNZcW4xOQ', name: 'د. عمر المقبل', scholar: 'د. عمر المقبل', category: 'تدبرات', verified: true },
  { id: 'UCBwMZr-RlvUzRRwpcVrFLbA', name: 'د. مساعد الطيار', scholar: 'د. مساعد الطيار', category: 'تدبرات', verified: true },
  { id: 'UC7U-5vV_pCG96TsIo3p5Y4Q', name: 'د. خالد السبت', scholar: 'د. خالد السبت', category: 'تدبرات', verified: true },

  // ——— قنوات الفوائد والتجويد ———
  { id: 'UCUEztIL6vaNGjnLGg7iMPcA', name: 'د. أيمن سويد', scholar: 'د. أيمن سويد', category: 'فوائد قرآنية', verified: true },
  { id: 'UC9oOQJWeLbqLsRq-QNP9OJA', name: 'الشيخ عبد الكريم الخضير', scholar: 'الشيخ عبد الكريم الخضير', category: 'فوائد قرآنية', verified: true },

  // ——— قنوات التفسير / أسرار القرآن ———
  { id: 'UC4cZnVNWsnGkJkpsHWtKS9Q', name: 'الشيخ ابن عثيمين - رحمه الله', scholar: 'الشيخ ابن عثيمين', category: 'أسرار القرآن', verified: true },
  { id: 'UCoARV2hXy_hfpxESy1_jFMQ', name: 'الشيخ عبد المحسن العباد', scholar: 'الشيخ عبد المحسن العباد', category: 'أسرار القرآن', verified: true },

  // ——— قنوات خواطر إيمانية ———
  { id: 'UCBgU_VSDIZ4YzTeBzDHW2Og', name: 'الشيخ عائض القرني', scholar: 'الشيخ عائض القرني', category: 'خواطر إيمانية' },
  { id: 'UCi1Z3gJQ8GqALvzq-ZscPcA', name: 'الشيخ محمد العريفي', scholar: 'الشيخ محمد العريفي', category: 'مواعظ قرآنية', verified: true },

  // ——— قصص الأنبياء والصحابة ———
  { id: 'UCtOUX3s-tHiuEhqRvQsVp3w', name: 'الشيخ نبيل العوضي', scholar: 'الشيخ نبيل العوضي', category: 'قصص مؤثرة', verified: true },
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
