// ============================================
// ADDITIONAL ISLAMIC BOOKS - BATCH 5
// كتب إضافية - الدفعة الخامسة - مكتبة موسعة
// تركيز خاص على كتب القرآن وعلومه
// من كتب السلف وعلماء أهل السنة والجماعة
// ============================================

import type { BookCollection, BookVolume } from './books';

function createVolumes(baseId: string, count: number, urlPattern: (i: number) => string): BookVolume[] {
  const arabicNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
    'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون',
    'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون', 'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', 'الثلاثون'];

  return Array.from({ length: count }, (_, i) => ({
    id: `${baseId}-${String(i + 1).padStart(2, '0')}`,
    title: `الجزء ${arabicNumbers[i] || (i + 1)}`,
    volumeNumber: i + 1,
    pdfUrl: urlPattern(i + 1),
  }));
}

function singleVol(id: string, title: string, pdfUrl: string): BookVolume[] {
  return [{ id, title, pdfUrl }];
}

export const additionalBooksBatch5: BookCollection[] = [
  // ══════════════════════════════════════════════════════════════
  // ██ قسم التفسير - كتب جديدة ومتنوعة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b5-tafsir-manar', name: 'تفسير المنار',
    author: 'الشيخ محمد رشيد رضا', category: 'التفسير',
    description: 'تفسير معاصر يهتم بهداية القرآن وإصلاح المسلمين',
    volumes: createVolumes('b5-tafsir-manar', 12, (i) => `https://archive.org/download/waq0099/${String(i).padStart(2, '0')}_0099.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-maraghi', name: 'تفسير المراغي',
    author: 'الشيخ أحمد مصطفى المراغي', category: 'التفسير',
    description: 'تفسير معاصر سهل العبارة ييسر فهم القرآن',
    volumes: createVolumes('b5-tafsir-maraghi', 10, (i) => `https://archive.org/download/WAQ0101/01_0101_${i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-zilal', name: 'في ظلال القرآن',
    author: 'سيد قطب', category: 'التفسير',
    description: 'تفسير أدبي يبرز البعد الحركي والبياني للقرآن',
    volumes: createVolumes('b5-zilal', 6, (i) => `https://archive.org/download/waq53521/${String(i).padStart(2, '0')}_53520.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-wasit', name: 'التفسير الوسيط للقرآن الكريم',
    author: 'د. محمد سيد طنطاوي', category: 'التفسير',
    description: 'تفسير معاصر شامل يراعي حاجة القارئ العصري',
    volumes: createVolumes('b5-wasit', 15, (i) => `https://archive.org/download/FPwsttntawy/wsttntawy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-shaarawi', name: 'تفسير الشعراوي - خواطر حول القرآن',
    author: 'الشيخ محمد متولي الشعراوي', category: 'التفسير',
    description: 'خواطر تفسيرية ميسرة بأسلوب بليغ',
    volumes: createVolumes('b5-tafsir-shaarawi', 20, (i) => `https://archive.org/download/waq00185/${String(i).padStart(2, '0')}_00185.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-mujahid', name: 'تفسير مجاهد',
    author: 'الإمام مجاهد بن جبر (ت 104هـ)', category: 'التفسير',
    description: 'من أقدم كتب التفسير وأصل من أصوله',
    volumes: singleVol('b5-tafsir-mujahid', 'تفسير مجاهد', 'https://archive.org/download/FPtafseermujahid/tafseermujahid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tafsir-sufian', name: 'تفسير سفيان الثوري',
    author: 'الإمام سفيان بن سعيد الثوري (ت 161هـ)', category: 'التفسير',
    description: 'من أقدم التفاسير بالمأثور عن السلف',
    volumes: singleVol('b5-tafsir-sufian', 'تفسير سفيان الثوري', 'https://archive.org/download/FPtafsersfiansawry/tafsersfiansawry.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tafsir-abdurazzaq', name: 'تفسير عبد الرزاق الصنعاني',
    author: 'الإمام عبد الرزاق الصنعاني (ت 211هـ)', category: 'التفسير',
    description: 'من أقدم التفاسير المسندة بالمأثور',
    volumes: createVolumes('b5-tafsir-abdurazzaq', 3, (i) => `https://archive.org/download/FP5113/tsnani${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-nisapuri', name: 'غرائب القرآن ورغائب الفرقان (تفسير النيسابوري)',
    author: 'الإمام نظام الدين النيسابوري (ت 728هـ)', category: 'التفسير',
    description: 'تفسير يجمع بين اللغة والبلاغة والقراءات',
    volumes: createVolumes('b5-tafsir-nisapuri', 6, (i) => `https://archive.org/download/FP8525_nisaboury/${String(i).padStart(2, '0')}_nisaboury.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-khazin', name: 'لباب التأويل في معاني التنزيل (تفسير الخازن)',
    author: 'الإمام علاء الدين الخازن (ت 741هـ)', category: 'التفسير',
    description: 'تفسير مختصر جامع على منهج أهل السنة',
    volumes: createVolumes('b5-tafsir-khazin', 4, (i) => `https://archive.org/download/WAQ36601/${String(i).padStart(2, '0')}_36600.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-ibn-juzai', name: 'التسهيل لعلوم التنزيل (تفسير ابن جزي)',
    author: 'الإمام محمد بن أحمد ابن جزي الكلبي (ت 741هـ)', category: 'التفسير',
    description: 'تفسير مختصر ميسر يهتم بعلوم القرآن',
    volumes: createVolumes('b5-tafsir-ibn-juzai', 2, (i) => `https://archive.org/download/WAQ106071/${String(i).padStart(2, '0')}_106070.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-abi-saud', name: 'إرشاد العقل السليم إلى مزايا الكتاب الكريم (تفسير أبي السعود)',
    author: 'الإمام أبو السعود العمادي (ت 982هـ)', category: 'التفسير',
    description: 'تفسير بلاغي جامع يجمع بين المنقول والمعقول',
    volumes: createVolumes('b5-tafsir-abi-saud', 9, (i) => `https://archive.org/download/FP29581/abisaod${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-ibn-arafa', name: 'تفسير ابن عرفة',
    author: 'الإمام محمد ابن عرفة الورغمي (ت 803هـ)', category: 'التفسير',
    description: 'تفسير مالكي يهتم بالقضايا اللغوية والفقهية',
    volumes: createVolumes('b5-tafsir-ibn-arafa', 4, (i) => `https://archive.org/download/FPtfsrabnearfah/tfsrabnearfah${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-thaalibi', name: 'الجواهر الحسان في تفسير القرآن (تفسير الثعالبي)',
    author: 'الإمام عبد الرحمن الثعالبي (ت 875هـ)', category: 'التفسير',
    description: 'تفسير مالكي مختصر جامع',
    volumes: createVolumes('b5-tafsir-thaalibi', 5, (i) => `https://archive.org/download/FP9393/thaalby${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-ibn-atiyyah', name: 'المحرر الوجيز في تفسير الكتاب العزيز',
    author: 'الإمام ابن عطية الأندلسي (ت 541هـ)', category: 'التفسير',
    description: 'تفسير أندلسي جامع بين المأثور والرأي',
    volumes: createVolumes('b5-tafsir-ibn-atiyyah', 5, (i) => `https://archive.org/download/FP9389/alwjezibneaty${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-ibn-al-jawzi', name: 'زاد المسير في علم التفسير',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'التفسير',
    description: 'تفسير مختصر يهتم بأقوال السلف والقراءات',
    volumes: createVolumes('b5-tafsir-ibn-al-jawzi', 9, (i) => `https://archive.org/download/FP9397/zadelmser${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-ruh-bayan', name: 'روح البيان في تفسير القرآن',
    author: 'الإمام إسماعيل حقي البروسوي (ت 1127هـ)', category: 'التفسير',
    description: 'تفسير إشاري يجمع بين المعاني الظاهرة والباطنة',
    volumes: createVolumes('b5-ruh-bayan', 10, (i) => `https://archive.org/download/FProhbayan/rohbayan${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-ibn-uthaymeen-fatiha', name: 'تفسير الفاتحة والبقرة لابن عثيمين',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'التفسير',
    description: 'التفسير المفصل لسورة الفاتحة والبقرة',
    volumes: createVolumes('b5-tafsir-ibn-uthaymeen-fatiha', 3, (i) => `https://archive.org/download/tafseer-othimen/tafseer-othimen-vol${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-tafsir-amthal', name: 'الأمثلة القرآنية',
    author: 'د. عبد الله بن حامد الحامد', category: 'التفسير',
    description: 'دراسة في الأمثال القرآنية وفقهها',
    volumes: singleVol('b5-tafsir-amthal', 'الأمثلة القرآنية', 'https://archive.org/download/FPalamthalalquranya/alamthalalquranya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tafsir-aqsam', name: 'التبيان في أقسام القرآن',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'التفسير',
    description: 'دراسة تفصيلية في أقسام القرآن وأسرارها',
    volumes: singleVol('b5-tafsir-aqsam', 'التبيان في أقسام القرآن', 'https://archive.org/download/FPtabyanfiaqsamalquran/tabyanfiaqsamalquran.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ علوم القرآن - مجموعة موسعة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b5-itqan-suyuti', name: 'الإتقان في علوم القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'موسوعة جامعة في علوم القرآن الكريم',
    volumes: createVolumes('b5-itqan-suyuti', 2, (i) => `https://archive.org/download/FP42175/eltqan${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-burhan-zarkashi', name: 'البرهان في علوم القرآن',
    author: 'الإمام بدر الدين الزركشي (ت 794هـ)', category: 'علوم القرآن',
    description: 'من أجمع وأنفس الكتب في علوم القرآن',
    volumes: createVolumes('b5-burhan-zarkashi', 4, (i) => `https://archive.org/download/FP29579/brhan${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-manahil-zarqani', name: 'مناهل العرفان في علوم القرآن',
    author: 'الشيخ محمد عبد العظيم الزرقاني', category: 'علوم القرآن',
    description: 'من أحسن الكتب المعاصرة في علوم القرآن',
    volumes: createVolumes('b5-manahil-zarqani', 2, (i) => `https://archive.org/download/FPmnahelalirfan/mnahelalirfan${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-manahel-uthaymeen', name: 'أصول في التفسير',
    author: 'الشيخ محمد بن صالح العثيمين', category: 'علوم القرآن',
    description: 'مختصر نافع في مبادئ علوم القرآن والتفسير',
    volumes: singleVol('b5-manahel-uthaymeen', 'أصول في التفسير', 'https://archive.org/download/FPosolfetafser/osolfetafser.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-mabahith-qattan', name: 'مباحث في علوم القرآن',
    author: 'الشيخ مناع القطان', category: 'علوم القرآن',
    description: 'كتاب دراسي شامل لعلوم القرآن الكريم',
    volumes: singleVol('b5-mabahith-qattan', 'مباحث في علوم القرآن', 'https://archive.org/download/FPmbahthfieoloomalquran/mbahthfieoloomalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-mabahith-sabuni', name: 'التبيان في علوم القرآن',
    author: 'الشيخ محمد علي الصابوني', category: 'علوم القرآن',
    description: 'مقدمة ميسرة في علوم القرآن',
    volumes: singleVol('b5-mabahith-sabuni', 'التبيان في علوم القرآن', 'https://archive.org/download/FPaltbyanfielomalquran/altbyanfielomalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-nuzul-quran', name: 'نزول القرآن وبلاغه',
    author: 'الشيخ عبد الفتاح القاضي', category: 'علوم القرآن',
    description: 'دراسة في كيفية نزول القرآن وطبيعة البلاغ النبوي',
    volumes: singleVol('b5-nuzul-quran', 'نزول القرآن', 'https://archive.org/download/FPnzolalquran/nzolalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-madkhal-darjat', name: 'مدخل لدراسة القرآن الكريم',
    author: 'د. محمد بن محمد أبو شهبة', category: 'علوم القرآن',
    description: 'مدخل شامل لدراسة القرآن والتعرف على علومه',
    volumes: singleVol('b5-madkhal-darjat', 'مدخل لدراسة القرآن الكريم', 'https://archive.org/download/FPmadkhalqurankarim/madkhalqurankarim.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-isra-elyat', name: 'الإسرائيليات في التفسير والحديث',
    author: 'د. محمد حسين الذهبي', category: 'علوم القرآن',
    description: 'دراسة نقدية للروايات الإسرائيلية في كتب التفسير',
    volumes: singleVol('b5-isra-elyat', 'الإسرائيليات في التفسير والحديث', 'https://archive.org/download/FPalsraylyatfitfsryrwahdyth/alsraylyatfitfsryrwahdyth.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tafsir-mufasireen', name: 'التفسير والمفسرون',
    author: 'د. محمد حسين الذهبي', category: 'علوم القرآن',
    description: 'دراسة موسوعية لتاريخ التفسير وأعلامه',
    volumes: createVolumes('b5-tafsir-mufasireen', 3, (i) => `https://archive.org/download/FPaltafsirwalmufasirun/a:3}_altafsirwalmufasirun.pdf`.replace(':3}', String(i).padStart(2, '0'))),
    isSingleVolume: false,
  },
  {
    id: 'b5-madkhal-zarakshi', name: 'مدخل إلى علوم القرآن',
    author: 'الشيخ محمد عبد العظيم الزرقاني', category: 'علوم القرآن',
    description: 'مدخل شامل ودقيق لعلوم القرآن',
    volumes: singleVol('b5-madkhal-zarakshi', 'مدخل إلى علوم القرآن', 'https://archive.org/download/FPmadkhalilmalquran/madkhalilmalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-qawaid-tafsir', name: 'قواعد التفسير جمعاً ودراسة',
    author: 'د. خالد بن عثمان السبت', category: 'علوم القرآن',
    description: 'دراسة موسوعية في قواعد التفسير وأصوله',
    volumes: createVolumes('b5-qawaid-tafsir', 2, (i) => `https://archive.org/download/FPqwaeedaltafser/qwaeedaltafser${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-usul-tafsir-sabt', name: 'أصول التفسير وقواعده',
    author: 'الشيخ خالد عبد الرحمن العك', category: 'علوم القرآن',
    description: 'كتاب جامع في أصول التفسير',
    volumes: singleVol('b5-usul-tafsir-sabt', 'أصول التفسير وقواعده', 'https://archive.org/download/FPosoltafserwqwaydh/osoltafserwqwaydh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-madkhal-tafsir', name: 'مقدمة في أصول التفسير',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'علوم القرآن',
    description: 'مقدمة نفيسة في أصول التفسير ومنهج السلف',
    volumes: singleVol('b5-madkhal-tafsir', 'مقدمة في أصول التفسير', 'https://archive.org/download/FPmqdmhfiosoltafser/mqdmhfiosoltafser.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-muqadmat-tafsir', name: 'شرح مقدمة في أصول التفسير',
    author: 'الشيخ محمد بن صالح العثيمين', category: 'علوم القرآن',
    description: 'شرح تفصيلي لمقدمة ابن تيمية',
    volumes: singleVol('b5-muqadmat-tafsir', 'شرح مقدمة في أصول التفسير', 'https://archive.org/download/FPsharhmqdmhtafser/sharhmqdmhtafser.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-intisar-quran', name: 'الانتصار للقرآن',
    author: 'الإمام أبو بكر الباقلاني (ت 403هـ)', category: 'علوم القرآن',
    description: 'دفاع عن القرآن ورد شبهات الطاعنين فيه',
    volumes: createVolumes('b5-intisar-quran', 2, (i) => `https://archive.org/download/FPintisarquran/intisarquran${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-ijaz-bayani', name: 'الإعجاز البياني للقرآن',
    author: 'د. عائشة بنت الشاطئ', category: 'علوم القرآن',
    description: 'دراسة في الإعجاز البياني للقرآن الكريم',
    volumes: singleVol('b5-ijaz-bayani', 'الإعجاز البياني للقرآن', 'https://archive.org/download/FPalijazalbyaniquran/alijazalbyaniquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-ijaz-fawasil', name: 'إعجاز الفواصل القرآنية',
    author: 'د. صلاح الخالدي', category: 'علوم القرآن',
    description: 'دراسة في إعجاز فواصل القرآن',
    volumes: singleVol('b5-ijaz-fawasil', 'إعجاز الفواصل القرآنية', 'https://archive.org/download/FPijazfawasilqurania/ijazfawasilqurania.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-mujaz-tartib', name: 'معجز ترتيب سور القرآن',
    author: 'د. محمد شملول', category: 'علوم القرآن',
    description: 'دراسة في إعجاز ترتيب سور القرآن الكريم',
    volumes: singleVol('b5-mujaz-tartib', 'إعجاز ترتيب سور القرآن', 'https://archive.org/download/FPijaztartibsuwar/ijaztartibsuwar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-nasikh-suyuti', name: 'الناسخ والمنسوخ للسيوطي',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'دراسة في آيات الناسخ والمنسوخ في القرآن',
    volumes: singleVol('b5-nasikh-suyuti', 'الناسخ والمنسوخ', 'https://archive.org/download/FPnaskhmnskhalsyoty/naskhmnskhalsyoty.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-nasikh-zuhri', name: 'الناسخ والمنسوخ في القرآن',
    author: 'الإمام ابن شهاب الزهري (ت 124هـ)', category: 'علوم القرآن',
    description: 'من أقدم الكتب في الناسخ والمنسوخ',
    volumes: singleVol('b5-nasikh-zuhri', 'الناسخ والمنسوخ للزهري', 'https://archive.org/download/FPnaskhmnskhalzhry/naskhmnskhalzhry.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-muhkam-suyuti', name: 'المحكم والمتشابه في القرآن',
    author: 'الإمام السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'دراسة في المحكم والمتشابه من آيات القرآن',
    volumes: singleVol('b5-muhkam-suyuti', 'المحكم والمتشابه', 'https://archive.org/download/FPmuhkammutashabih/muhkammutashabih.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-mutawatir-quran', name: 'المتواتر والآحاد في القراءات القرآنية',
    author: 'د. محمد حسن حسن جبل', category: 'علوم القرآن',
    description: 'دراسة في أسانيد القراءات القرآنية',
    volumes: singleVol('b5-mutawatir-quran', 'المتواتر والآحاد في القراءات', 'https://archive.org/download/FPmutawatirahad/mutawatirahad.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-ahruf-sab3a', name: 'الأحرف السبعة للقرآن',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'علوم القرآن',
    description: 'دراسة في الأحرف السبعة التي نزل بها القرآن',
    volumes: singleVol('b5-ahruf-sab3a', 'الأحرف السبعة للقرآن', 'https://archive.org/download/FPahrofsabaa/ahrofsabaa.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-fadail-quran-ibn-kathir', name: 'فضائل القرآن لابن كثير',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'علوم القرآن',
    description: 'جمع الأحاديث والآثار في فضائل القرآن الكريم',
    volumes: singleVol('b5-fadail-quran-ibn-kathir', 'فضائل القرآن لابن كثير', 'https://archive.org/download/FPfadailquranibnkathir/fadailquranibnkathir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-fadail-quran-nasai', name: 'فضائل القرآن للنسائي',
    author: 'الإمام النسائي (ت 303هـ)', category: 'علوم القرآن',
    description: 'جمع للأحاديث في فضل القرآن وقراءته',
    volumes: singleVol('b5-fadail-quran-nasai', 'فضائل القرآن للنسائي', 'https://archive.org/download/FPfadailquran-nasai/fadailquran-nasai.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-fadail-quran-qasim', name: 'فضائل القرآن لأبي عبيد',
    author: 'الإمام أبو عبيد القاسم بن سلام (ت 224هـ)', category: 'علوم القرآن',
    description: 'من أقدم الكتب في فضائل القرآن',
    volumes: singleVol('b5-fadail-quran-qasim', 'فضائل القرآن لأبي عبيد', 'https://archive.org/download/FPfadailquranabiubaid/fadailquranabiubaid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-ahkam-qurtubi', name: 'التذكار في أفضل الأذكار',
    author: 'الإمام القرطبي (ت 671هـ)', category: 'علوم القرآن',
    description: 'في آداب قراءة القرآن وحملته',
    volumes: singleVol('b5-ahkam-qurtubi', 'التذكار في أفضل الأذكار', 'https://archive.org/download/FPaltazkarqurtubi/altazkarqurtubi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tibyan-hamlat', name: 'التبيان في آداب حملة القرآن',
    author: 'الإمام النووي (ت 676هـ)', category: 'علوم القرآن',
    description: 'آداب حامل القرآن ومعلمه وتاليه',
    volumes: singleVol('b5-tibyan-hamlat', 'التبيان في آداب حملة القرآن', 'https://archive.org/download/FPtibyanhamlat/tibyanhamlat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-haqiqa-tadabur', name: 'حقيقة التدبر الأمثل لكتاب الله',
    author: 'د. محمد خالد منصور', category: 'علوم القرآن',
    description: 'منهج عملي لتدبر القرآن الكريم',
    volumes: singleVol('b5-haqiqa-tadabur', 'حقيقة التدبر الأمثل', 'https://archive.org/download/FPhaqiqatadabur/haqiqatadabur.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-mafatih-tadabur', name: 'مفاتح تدبر القرآن',
    author: 'د. خالد السبت', category: 'علوم القرآن',
    description: 'مفاتيح عملية لتدبر القرآن والانتفاع به',
    volumes: singleVol('b5-mafatih-tadabur', 'مفاتح تدبر القرآن', 'https://archive.org/download/FPmafatihtadabur/mafatihtadabur.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ التجويد والقراءات - مجموعة موسعة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b5-nashr-fikir', name: 'النشر في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أعظم كتاب جامع في القراءات العشر',
    volumes: createVolumes('b5-nashr-fikir', 2, (i) => `https://archive.org/download/FP75861/nshr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-taiseer-dani', name: 'التيسير في القراءات السبع',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'من أمهات كتب القراءات السبع',
    volumes: singleVol('b5-taiseer-dani', 'التيسير في القراءات السبع', 'https://archive.org/download/FPtaiserqiraatsaba/taiserqiraatsaba.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-shatibiya', name: 'حرز الأماني ووجه التهاني (الشاطبية)',
    author: 'الإمام القاسم بن فيره الشاطبي (ت 590هـ)', category: 'التجويد والقراءات',
    description: 'منظومة الشاطبية في القراءات السبع',
    volumes: singleVol('b5-shatibiya', 'الشاطبية', 'https://archive.org/download/FPshatibya/shatibya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-jazariya', name: 'المقدمة الجزرية في التجويد',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أشهر منظومة في علم التجويد',
    volumes: singleVol('b5-jazariya', 'المقدمة الجزرية', 'https://archive.org/download/FPmqdmhjazariya/mqdmhjazariya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tuhfat-atfal', name: 'تحفة الأطفال والغلمان في تجويد القرآن',
    author: 'الشيخ سليمان الجمزوري', category: 'التجويد والقراءات',
    description: 'منظومة مختصرة في أحكام التجويد للمبتدئين',
    volumes: singleVol('b5-tuhfat-atfal', 'تحفة الأطفال', 'https://archive.org/download/FPtuhfatatfal/tuhfatatfal.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-hidayat-mustafid', name: 'هداية المستفيد في أحكام التجويد',
    author: 'الشيخ محمد المحمود', category: 'التجويد والقراءات',
    description: 'من أحسن الكتب في أحكام التجويد',
    volumes: singleVol('b5-hidayat-mustafid', 'هداية المستفيد', 'https://archive.org/download/FPhidayatmustafid/hidayatmustafid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-ghayat-murid', name: 'غاية المريد في علم التجويد',
    author: 'الشيخ عطية قابل نصر', category: 'التجويد والقراءات',
    description: 'كتاب شامل في أحكام التجويد',
    volumes: singleVol('b5-ghayat-murid', 'غاية المريد في علم التجويد', 'https://archive.org/download/FPghayatmuridtajweed/ghayatmuridtajweed.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-qawl-mufid', name: 'القول المفيد في علم التجويد',
    author: 'الشيخ محمد محمود', category: 'التجويد والقراءات',
    description: 'شرح ميسر لأحكام التجويد',
    volumes: singleVol('b5-qawl-mufid', 'القول المفيد في علم التجويد', 'https://archive.org/download/FPqawlmufidtajweed/qawlmufidtajweed.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-mufid-mujid', name: 'المفيد في علم التجويد',
    author: 'الشيخ محمد سالم محيسن', category: 'التجويد والقراءات',
    description: 'شرح عملي مفصل لأحكام التجويد',
    volumes: singleVol('b5-mufid-mujid', 'المفيد في علم التجويد', 'https://archive.org/download/FPalmufidmujid/almufidmujid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-fathrabani', name: 'الفتح الرباني شرح حرز الأماني',
    author: 'الشيخ علي الضباع', category: 'التجويد والقراءات',
    description: 'شرح مهم لمنظومة الشاطبية',
    volumes: singleVol('b5-fathrabani', 'الفتح الرباني شرح الشاطبية', 'https://archive.org/download/FPfathrabani/fathrabani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-ibraz-maani', name: 'إبراز المعاني من حرز الأماني',
    author: 'الإمام أبو شامة المقدسي (ت 665هـ)', category: 'التجويد والقراءات',
    description: 'من أجود شروح الشاطبية',
    volumes: singleVol('b5-ibraz-maani', 'إبراز المعاني', 'https://archive.org/download/FPibrazmaani/ibrazmaani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-sabaa-qiraat', name: 'السبعة في القراءات',
    author: 'الإمام ابن مجاهد (ت 324هـ)', category: 'التجويد والقراءات',
    description: 'أول كتاب جمع القراءات السبع',
    volumes: singleVol('b5-sabaa-qiraat', 'السبعة في القراءات', 'https://archive.org/download/FPsabaaqiraat/sabaaqiraat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-muhtasib', name: 'المحتسب في تبيين وجوه شواذ القراءات',
    author: 'الإمام ابن جني (ت 392هـ)', category: 'التجويد والقراءات',
    description: 'دراسة في القراءات الشاذة وتوجيهها',
    volumes: createVolumes('b5-muhtasib', 2, (i) => `https://archive.org/download/FPmuhtasib/muhtasib${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-qiraat-ashr', name: 'الوافي في شرح الشاطبية',
    author: 'الشيخ عبد الفتاح القاضي', category: 'التجويد والقراءات',
    description: 'شرح واضح لمنظومة الشاطبية',
    volumes: singleVol('b5-qiraat-ashr', 'الوافي في شرح الشاطبية', 'https://archive.org/download/FPwafi-shatibya/wafi-shatibya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-budoor-zahira', name: 'البدور الزاهرة في القراءات العشر',
    author: 'الشيخ عبد الفتاح القاضي', category: 'التجويد والقراءات',
    description: 'جمع القراءات العشر بأسلوب ميسر',
    volumes: singleVol('b5-budoor-zahira', 'البدور الزاهرة', 'https://archive.org/download/FPbudoorzahira/budoorzahira.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-dirasat-qiraat', name: 'دراسات في علم القراءات',
    author: 'د. أحمد محمد مفلح', category: 'التجويد والقراءات',
    description: 'دراسة معاصرة في علم القراءات',
    volumes: singleVol('b5-dirasat-qiraat', 'دراسات في علم القراءات', 'https://archive.org/download/FPdirasatqiraat/dirasatqiraat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tajweed-mussawar', name: 'التجويد المصور',
    author: 'د. أيمن رشدي سويد', category: 'التجويد والقراءات',
    description: 'كتاب مصور حديث لتعليم التجويد',
    volumes: createVolumes('b5-tajweed-mussawar', 2, (i) => `https://archive.org/download/FPtajweedmussawar/tajweedmussawar${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ أسباب النزول - مجموعة موسعة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b5-asbab-wahidi', name: 'أسباب النزول للواحدي',
    author: 'الإمام أبو الحسن علي بن أحمد الواحدي (ت 468هـ)', category: 'أسباب النزول',
    description: 'أشهر كتب أسباب النزول',
    volumes: singleVol('b5-asbab-wahidi', 'أسباب النزول للواحدي', 'https://archive.org/download/FPasbabnuzulwahidi/asbabnuzulwahidi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-lubab-suyuti', name: 'لباب النقول في أسباب النزول',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'أسباب النزول',
    description: 'من أجمع كتب أسباب النزول',
    volumes: singleVol('b5-lubab-suyuti', 'لباب النقول في أسباب النزول', 'https://archive.org/download/FPlubabnoqol/lubabnoqol.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-sahih-masnad-asbab', name: 'الصحيح المسند من أسباب النزول',
    author: 'الشيخ مقبل بن هادي الوادعي', category: 'أسباب النزول',
    description: 'جمع للأحاديث الصحيحة في أسباب النزول',
    volumes: singleVol('b5-sahih-masnad-asbab', 'الصحيح المسند من أسباب النزول', 'https://archive.org/download/FPsahihmasnadasbab/sahihmasnadasbab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-mukhtasar-asbab', name: 'المختصر في أسباب نزول القرآن',
    author: 'د. خالد الجريسي', category: 'أسباب النزول',
    description: 'مختصر مفيد في أسباب النزول',
    volumes: singleVol('b5-mukhtasar-asbab', 'المختصر في أسباب نزول القرآن', 'https://archive.org/download/FPmukhtasarasbab/mukhtasarasbab.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ غريب القرآن ومفرداته - مجموعة موسعة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b5-mufradat-ragheb', name: 'المفردات في غريب القرآن',
    author: 'الإمام الراغب الأصفهاني (ت 502هـ)', category: 'غريب القرآن ومفرداته',
    description: 'أعظم كتاب في مفردات القرآن الكريم',
    volumes: singleVol('b5-mufradat-ragheb', 'المفردات في غريب القرآن', 'https://archive.org/download/FPmufradatragheb/mufradatragheb.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-gharib-ibn-qutaiba', name: 'تفسير غريب القرآن لابن قتيبة',
    author: 'الإمام ابن قتيبة الدينوري (ت 276هـ)', category: 'غريب القرآن ومفرداته',
    description: 'من أقدم كتب غريب القرآن',
    volumes: singleVol('b5-gharib-ibn-qutaiba', 'تفسير غريب القرآن', 'https://archive.org/download/FPgharibibnqutaiba/gharibibnqutaiba.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-gharib-sijistani', name: 'غريب القرآن للسجستاني',
    author: 'الإمام السجستاني', category: 'غريب القرآن ومفرداته',
    description: 'كتاب مختصر في غريب ألفاظ القرآن',
    volumes: singleVol('b5-gharib-sijistani', 'غريب القرآن للسجستاني', 'https://archive.org/download/FPgharibsijistani/gharibsijistani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-umdat-hufaz', name: 'عمدة الحفاظ في تفسير أشرف الألفاظ',
    author: 'الإمام السمين الحلبي (ت 756هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم لغوي شامل لألفاظ القرآن',
    volumes: createVolumes('b5-umdat-hufaz', 4, (i) => `https://archive.org/download/FPumdathufaz/umdathufaz${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-basair-firuzabadi', name: 'بصائر ذوي التمييز في لطائف الكتاب العزيز',
    author: 'الإمام مجد الدين الفيروزآبادي (ت 817هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم لغوي قرآني شامل',
    volumes: createVolumes('b5-basair-firuzabadi', 6, (i) => `https://archive.org/download/FPbasairfiruzabadi/basairfiruzabadi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-wujuh-nazair-damghani', name: 'الوجوه والنظائر في القرآن',
    author: 'الإمام الدامغاني (ت 478هـ)', category: 'غريب القرآن ومفرداته',
    description: 'دراسة في الوجوه والنظائر من ألفاظ القرآن',
    volumes: singleVol('b5-wujuh-nazair-damghani', 'الوجوه والنظائر', 'https://archive.org/download/FPwujuhnazairdamghani/wujuhnazairdamghani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-wujuh-nazair-muqatil', name: 'الأشباه والنظائر في القرآن لمقاتل',
    author: 'مقاتل بن سليمان (ت 150هـ)', category: 'غريب القرآن ومفرداته',
    description: 'من أقدم كتب الوجوه والنظائر',
    volumes: singleVol('b5-wujuh-nazair-muqatil', 'الأشباه والنظائر لمقاتل', 'https://archive.org/download/FPwujuhnazairmuqatil/wujuhnazairmuqatil.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إعراب القرآن وبيانه - مجموعة موسعة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b5-irab-nahhas', name: 'إعراب القرآن للنحاس',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب إعراب القرآن',
    volumes: createVolumes('b5-irab-nahhas', 5, (i) => `https://archive.org/download/FPirabnahhas/irabnahhas${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-irab-derwish', name: 'إعراب القرآن الكريم وبيانه',
    author: 'الشيخ محيي الدين درويش', category: 'إعراب القرآن وبيانه',
    description: 'من أشهر كتب إعراب القرآن المعاصرة',
    volumes: createVolumes('b5-irab-derwish', 10, (i) => `https://archive.org/download/FPirabderwish/irabderwish${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-duar-masun', name: 'الدر المصون في علوم الكتاب المكنون',
    author: 'الإمام السمين الحلبي (ت 756هـ)', category: 'إعراب القرآن وبيانه',
    description: 'موسوعة في إعراب القرآن والمعاني اللغوية',
    volumes: createVolumes('b5-duar-masun', 11, (i) => `https://archive.org/download/FPduarmasun/duarmasun${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-majaz-quran', name: 'مجاز القرآن',
    author: 'الإمام أبو عبيدة معمر بن المثنى (ت 210هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب معاني القرآن',
    volumes: createVolumes('b5-majaz-quran', 2, (i) => `https://archive.org/download/FPmajazquran/majazquran${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-maani-quran-farra', name: 'معاني القرآن للفراء',
    author: 'الإمام أبو زكريا يحيى الفراء (ت 207هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أهم كتب معاني القرآن عند النحاة',
    volumes: createVolumes('b5-maani-quran-farra', 3, (i) => `https://archive.org/download/FPmaaniquranfarra/maaniquranfarra${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b5-maani-quran-akhfash', name: 'معاني القرآن للأخفش',
    author: 'الإمام الأخفش الأوسط (ت 215هـ)', category: 'إعراب القرآن وبيانه',
    description: 'دراسة نحوية لمعاني القرآن',
    volumes: singleVol('b5-maani-quran-akhfash', 'معاني القرآن للأخفش', 'https://archive.org/download/FPmaaniakhfash/maaniakhfash.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-maani-irab-zajjaj', name: 'معاني القرآن وإعرابه للزجاج',
    author: 'الإمام أبو إسحاق الزجاج (ت 311هـ)', category: 'إعراب القرآن وبيانه',
    description: 'جمع بين معاني القرآن وإعرابه',
    volumes: createVolumes('b5-maani-irab-zajjaj', 5, (i) => `https://archive.org/download/FPmaanizajjaj/maanizajjaj${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب السلف في التدبر والرقائق ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b5-tafsir-qayyim', name: 'التفسير القيم لابن القيم',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'التفسير',
    description: 'جمع لتفسير ابن القيم من كتبه المتنوعة',
    volumes: singleVol('b5-tafsir-qayyim', 'التفسير القيم', 'https://archive.org/download/FPtafsirqayyim/tafsirqayyim.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-fawaid-musabbara', name: 'الفوائد المسبرة من تفسير ابن كثير',
    author: 'د. وليد بن إدريس المنيسي', category: 'التدبر',
    description: 'انتقاء الفوائد من تفسير ابن كثير',
    volumes: singleVol('b5-fawaid-musabbara', 'الفوائد المسبرة', 'https://archive.org/download/FPfawaidmusabbara/fawaidmusabbara.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-maani-akhira', name: 'معاني القرآن في الحديث عن الآخرة',
    author: 'د. ناصر العمر', category: 'التدبر',
    description: 'جمع آيات القرآن في الحديث عن الآخرة والتدبر فيها',
    volumes: singleVol('b5-maani-akhira', 'معاني القرآن في الحديث عن الآخرة', 'https://archive.org/download/FPmaaniakhira/maaniakhira.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tadabbur-naseer', name: 'تدبر القرآن',
    author: 'الشيخ سلمان بن عمر السنيدي', category: 'التدبر',
    description: 'منهج عملي لتدبر القرآن الكريم',
    volumes: singleVol('b5-tadabbur-naseer', 'تدبر القرآن', 'https://archive.org/download/FPtadabbursunaidi/tadabbursunaidi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tadabbur-ayat', name: 'آيات للمتدبرين',
    author: 'د. ناصر العمر', category: 'التدبر',
    description: 'اختيار من آيات القرآن للتدبر والتأمل',
    volumes: singleVol('b5-tadabbur-ayat', 'آيات للمتدبرين', 'https://archive.org/download/FPayatlimutadabbirin/ayatlimutadabbirin.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-mutasim-bayan', name: 'المعتصم بحبل البيان من تدبر القرآن',
    author: 'الشيخ محمد الدومي', category: 'التدبر',
    description: 'في تدبر القرآن ومعرفة معانيه',
    volumes: singleVol('b5-mutasim-bayan', 'المعتصم بحبل البيان', 'https://archive.org/download/FPmutasimbayan/mutasimbayan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-khwatir-quran', name: 'خواطر قرآنية',
    author: 'الشيخ عمرو خالد', category: 'التدبر',
    description: 'خواطر وتأملات في القرآن الكريم',
    volumes: singleVol('b5-khwatir-quran', 'خواطر قرآنية', 'https://archive.org/download/FPkhwatirquran/khwatirquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-wuquf-quran', name: 'وقفات تربوية مع القرآن',
    author: 'د. أحمد بن محمد الخليل', category: 'التدبر',
    description: 'وقفات تربوية في آيات القرآن',
    volumes: singleVol('b5-wuquf-quran', 'وقفات تربوية مع القرآن', 'https://archive.org/download/FPwuqufquran/wuqufquran.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب في حفظ القرآن ومراجعته ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b5-tariqat-hifz', name: 'كيف تحفظ القرآن',
    author: 'د. راغب السرجاني', category: 'علوم القرآن',
    description: 'طرق عملية لحفظ القرآن الكريم',
    volumes: singleVol('b5-tariqat-hifz', 'كيف تحفظ القرآن', 'https://archive.org/download/FPkayfatuhfaz/kayfatuhfaz.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-hifzquran-amthal', name: 'حفظ القرآن الكريم - طرق وأساليب',
    author: 'د. يحيى الغوثاني', category: 'علوم القرآن',
    description: 'الطرق المثلى في حفظ القرآن',
    volumes: singleVol('b5-hifzquran-amthal', 'حفظ القرآن الكريم', 'https://archive.org/download/FPhifzquran/hifzquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-dalil-hafiz', name: 'دليل الحافظ لكتاب الله',
    author: 'الشيخ أحمد بن عبد السلام', category: 'علوم القرآن',
    description: 'دليل عملي لحافظ القرآن في المراجعة',
    volumes: singleVol('b5-dalil-hafiz', 'دليل الحافظ', 'https://archive.org/download/FPdalilhafiz/dalilhafiz.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-murajaat-quran', name: 'مراجعات القرآن الكريم',
    author: 'د. يحيى الغوثاني', category: 'علوم القرآن',
    description: 'طرق المراجعة ومنع النسيان',
    volumes: singleVol('b5-murajaat-quran', 'مراجعات القرآن الكريم', 'https://archive.org/download/FPmurajaatquran/murajaatquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b5-tariqa-hifz-yumiya', name: 'الطريقة اليومية لحفظ القرآن',
    author: 'الشيخ يحيى الحجوري', category: 'علوم القرآن',
    description: 'برنامج يومي لحفظ القرآن',
    volumes: singleVol('b5-tariqa-hifz-yumiya', 'الطريقة اليومية لحفظ القرآن', 'https://archive.org/download/FPtariqayumiya/tariqayumiya.pdf'),
    isSingleVolume: true,
  },
];
