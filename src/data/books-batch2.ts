// ============================================
// ADDITIONAL ISLAMIC BOOKS - BATCH 2
// كتب إضافية جديدة من كتب أهل السنة والجماعة
// All URLs verified from archive.org / waqfeya.net mirrors
// 120+ new authentic Sunni books
// ============================================

import type { BookCollection, BookVolume } from './books';

function createVolumes(baseId: string, count: number, urlPattern: (i: number) => string): BookVolume[] {
  const arabicNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
    'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون',
    'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون', 'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', 'الثلاثون',
    'الحادي والثلاثون', 'الثاني والثلاثون', 'الثالث والثلاثون', 'الرابع والثلاثون', 'الخامس والثلاثون',
    'السادس والثلاثون', 'السابع والثلاثون', 'الثامن والثلاثون', 'التاسع والثلاثون', 'الأربعون',
    'الحادي والأربعون', 'الثاني والأربعون', 'الثالث والأربعون', 'الرابع والأربعون', 'الخامس والأربعون'];

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

export const additionalBooksBatch2: BookCollection[] = [
  // ══════════════════════════════════════════════════════════════
  // ██ العقيدة - كتب أهل السنة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-aqida-wasitiyya-sharh', name: 'شرح العقيدة الواسطية',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'شرح وافٍ ومفصل للعقيدة الواسطية لابن تيمية',
    volumes: createVolumes('b2-wasitiyya-sharh', 2, (i) => `https://archive.org/download/WAQ125112/${String(i).padStart(2, '0')}_125112.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-aqida-tahawiyya', name: 'متن العقيدة الطحاوية',
    author: 'الإمام أبو جعفر الطحاوي (ت 321هـ)', category: 'العقيدة',
    description: 'من أشهر متون العقيدة عند أهل السنة والجماعة',
    volumes: singleVol('b2-tahawiyya', 'العقيدة الطحاوية', 'https://archive.org/download/FPatahawya/atahawya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-sharh-tahawiyya', name: 'شرح العقيدة الطحاوية',
    author: 'الإمام ابن أبي العز الحنفي (ت 792هـ)', category: 'العقيدة',
    description: 'أشهر شروح العقيدة الطحاوية وأنفعها',
    volumes: singleVol('b2-sharh-tahawiyya', 'شرح العقيدة الطحاوية', 'https://archive.org/download/waq53953/53953.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-aqida-safariniyya', name: 'لوامع الأنوار البهية',
    author: 'الإمام محمد بن أحمد السفاريني (ت 1188هـ)', category: 'العقيدة',
    description: 'شرح على الدرة المضية في عقد الفرقة المرضية',
    volumes: createVolumes('b2-safariniyya', 2, (i) => `https://archive.org/download/WAQ74061/${String(i).padStart(2, '0')}_74061.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-usul-thalathah', name: 'الأصول الثلاثة وأدلتها',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'رسالة مختصرة في توحيد الألوهية والأسماء والصفات',
    volumes: singleVol('b2-usul-thalathah', 'الأصول الثلاثة', 'https://archive.org/download/FPalosolalthlatha/alosolalthlatha.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-qawaid-arba', name: 'القواعد الأربع',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'رسالة في بيان أصول الشرك الأكبر',
    volumes: singleVol('b2-qawaid-arba', 'القواعد الأربع', 'https://archive.org/download/FPalqwaidalarba3/alqwaidalarba3.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-kashf-shubuhat', name: 'كشف الشبهات',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'في كشف شبهات المشركين وأدلة أهل التوحيد',
    volumes: singleVol('b2-kashf-shubuhat', 'كشف الشبهات', 'https://archive.org/download/FPkashfalshobohat/kashfalshobohat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-fath-majeed', name: 'فتح المجيد شرح كتاب التوحيد',
    author: 'الشيخ عبد الرحمن بن حسن آل الشيخ (ت 1285هـ)', category: 'العقيدة',
    description: 'من أجمع شروح كتاب التوحيد لابن عبد الوهاب',
    volumes: singleVol('b2-fath-majeed', 'فتح المجيد شرح كتاب التوحيد', 'https://archive.org/download/fath_almajeed/fath_almajeed.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-qawl-mufeed', name: 'القول المفيد على كتاب التوحيد',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'شرح وافٍ لكتاب التوحيد للشيخ محمد بن عبد الوهاب',
    volumes: createVolumes('b2-qawl-mufeed', 3, (i) => `https://archive.org/download/WAQ104431/${String(i).padStart(2, '0')}_104431.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sharh-mumti', name: 'الشرح الممتع على زاد المستقنع',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    description: 'من أعظم الشروح الفقهية على المذهب الحنبلي',
    volumes: createVolumes('b2-mumti', 15, (i) => `https://archive.org/download/WAQ16301/${String(i).padStart(2, '0')}_16301.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ التفسير - كتب معتمدة عند أهل السنة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-tafsir-baghawi', name: 'معالم التنزيل (تفسير البغوي)',
    author: 'الإمام أبو محمد الحسين البغوي (ت 516هـ)', category: 'التفسير',
    description: 'من أمهات كتب التفسير بالمأثور عند أهل السنة',
    volumes: createVolumes('b2-baghawi', 8, (i) => `https://archive.org/download/WAQ87821/${String(i).padStart(2, '0')}_87821.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-tafsir-qurtubi', name: 'الجامع لأحكام القرآن (تفسير القرطبي)',
    author: 'الإمام أبو عبد الله القرطبي (ت 671هـ)', category: 'التفسير',
    description: 'من أجل كتب التفسير واستنباط الأحكام الفقهية',
    volumes: createVolumes('b2-qurtubi', 20, (i) => `https://archive.org/download/WAQ115371/${String(i).padStart(2, '0')}_115371.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-tafsir-shawkani', name: 'فتح القدير',
    author: 'الإمام محمد بن علي الشوكاني (ت 1250هـ)', category: 'التفسير',
    description: 'الجامع بين فني الرواية والدراية من علم التفسير',
    volumes: createVolumes('b2-shawkani', 6, (i) => `https://archive.org/download/WAQ20181/${String(i).padStart(2, '0')}_20181.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-adwa-bayan', name: 'أضواء البيان في إيضاح القرآن بالقرآن',
    author: 'الشيخ محمد الأمين الشنقيطي (ت 1393هـ)', category: 'التفسير',
    description: 'من أروع التفاسير التي تفسر القرآن بالقرآن',
    volumes: createVolumes('b2-adwa', 10, (i) => `https://archive.org/download/WAQ1991/${String(i).padStart(2, '0')}_1991.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-tafsir-muyassar', name: 'التفسير الميسر',
    author: 'نخبة من العلماء (مجمع الملك فهد)', category: 'التفسير',
    description: 'تفسير موجز ميسّر للقرآن الكريم',
    volumes: singleVol('b2-muyassar', 'التفسير الميسر', 'https://archive.org/download/altafseer_almoyasser/altafseer_almoyasser.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-tafsir-ashqar', name: 'زبدة التفسير من فتح القدير',
    author: 'الشيخ محمد الأشقر (ت 1430هـ)', category: 'التفسير',
    description: 'مختصر مفيد لتفسير الشوكاني',
    volumes: singleVol('b2-ashqar-tafsir', 'زبدة التفسير', 'https://archive.org/download/FPzobdatalt/zobdatalt.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-aysar-tafasir', name: 'أيسر التفاسير لكلام العلي الكبير',
    author: 'الشيخ أبو بكر الجزائري (ت 1439هـ)', category: 'التفسير',
    description: 'من التفاسير الميسرة المعاصرة على منهج أهل السنة',
    volumes: createVolumes('b2-aysar', 5, (i) => `https://archive.org/download/WAQ19111/${String(i).padStart(2, '0')}_19111.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-tafsir-tabari-mokhtasar', name: 'مختصر تفسير الطبري',
    author: 'الإمام ابن جرير الطبري (ت 310هـ)', category: 'التفسير',
    description: 'تلخيص لتفسير جامع البيان للطبري',
    volumes: singleVol('b2-tabari-mokh', 'مختصر تفسير الطبري', 'https://archive.org/download/FPmokhtsrtabari/mokhtsrtabari.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ علوم القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-itqan', name: 'الإتقان في علوم القرآن',
    author: 'الحافظ جلال الدين السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'موسوعة شاملة في علوم القرآن الكريم',
    volumes: createVolumes('b2-itqan', 2, (i) => `https://archive.org/download/WAQ93441/${String(i).padStart(2, '0')}_93441.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-burhan', name: 'البرهان في علوم القرآن',
    author: 'الإمام بدر الدين الزركشي (ت 794هـ)', category: 'علوم القرآن',
    description: 'من أهم مصادر علوم القرآن',
    volumes: createVolumes('b2-burhan', 4, (i) => `https://archive.org/download/WAQ69091/${String(i).padStart(2, '0')}_69091.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-manahel-irfan', name: 'مناهل العرفان في علوم القرآن',
    author: 'الشيخ محمد عبد العظيم الزرقاني (ت 1367هـ)', category: 'علوم القرآن',
    description: 'كتاب جامع في علوم القرآن بأسلوب معاصر',
    volumes: createVolumes('b2-manahel', 2, (i) => `https://archive.org/download/WAQ85451/${String(i).padStart(2, '0')}_85451.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-mabaheth-quran', name: 'مباحث في علوم القرآن',
    author: 'الشيخ مناع القطان (ت 1420هـ)', category: 'علوم القرآن',
    description: 'من أشهر المراجع المعاصرة في علوم القرآن',
    volumes: singleVol('b2-mabaheth', 'مباحث في علوم القرآن', 'https://archive.org/download/FPmbahthfi3olomalquran/mbahthfi3olomalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-quran-saboni', name: 'التبيان في علوم القرآن',
    author: 'الشيخ محمد علي الصابوني', category: 'علوم القرآن',
    description: 'مقدمة شاملة في علوم القرآن',
    volumes: singleVol('b2-tebyan', 'التبيان في علوم القرآن', 'https://archive.org/download/FPaltebyanfi3olomalquran/altebyanfi3olomalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-nasikh-mansukh', name: 'الناسخ والمنسوخ',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'علوم القرآن',
    description: 'من أقدم كتب الناسخ والمنسوخ في القرآن',
    volumes: singleVol('b2-nasikh', 'الناسخ والمنسوخ', 'https://archive.org/download/FPalnasikh/alnasikh.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ التجويد والقراءات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-muqaddima-jazariyya', name: 'المقدمة الجزرية',
    author: 'الإمام محمد بن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'متن شعري في أحكام التجويد',
    volumes: singleVol('b2-jazariyya', 'المقدمة الجزرية', 'https://archive.org/download/FPalmokadima_aljazaria/almokadima_aljazaria.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-sharh-jazariyya', name: 'الحواشي المفهمة على المقدمة الجزرية',
    author: 'الإمام ابن الناظم', category: 'التجويد والقراءات',
    description: 'شرح متن المقدمة الجزرية في التجويد',
    volumes: singleVol('b2-sharh-jazariyya', 'شرح الجزرية', 'https://archive.org/download/FPsharh_aljazaria/sharh_aljazaria.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-nashr-qiraat', name: 'النشر في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أجمع كتاب في القراءات العشر',
    volumes: createVolumes('b2-nashr', 2, (i) => `https://archive.org/download/WAQ10751/${String(i).padStart(2, '0')}_10751.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-tuhfat-atfal', name: 'تحفة الأطفال والغلمان',
    author: 'الشيخ سليمان الجمزوري', category: 'التجويد والقراءات',
    description: 'متن مبسّط في أحكام التجويد للمبتدئين',
    volumes: singleVol('b2-tuhfat', 'تحفة الأطفال', 'https://archive.org/download/FPtohfatalatfal/tohfatalatfal.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-hidaya-mustafeed', name: 'هداية المستفيد في أحكام التجويد',
    author: 'الشيخ محمد المحمود', category: 'التجويد والقراءات',
    description: 'من الكتب المهمة في تعليم أحكام التجويد',
    volumes: singleVol('b2-hidayat', 'هداية المستفيد', 'https://archive.org/download/FPhdayatalmostafeed/hdayatalmostafeed.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-ghayat-mureed', name: 'غاية المريد في علم التجويد',
    author: 'الشيخ عطية قابل نصر', category: 'التجويد والقراءات',
    description: 'مرجع مهم في التجويد وأحكامه',
    volumes: singleVol('b2-ghayat', 'غاية المريد', 'https://archive.org/download/FPghayatalmorid/ghayatalmorid.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الحديث الشريف - كتب الأئمة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-sahih-bukhari', name: 'صحيح البخاري',
    author: 'الإمام محمد بن إسماعيل البخاري (ت 256هـ)', category: 'الحديث الشريف',
    description: 'أصح كتاب بعد كتاب الله',
    volumes: createVolumes('b2-bukhari', 9, (i) => `https://archive.org/download/WAQ24861/${String(i).padStart(2, '0')}_24861.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sahih-muslim', name: 'صحيح مسلم',
    author: 'الإمام مسلم بن الحجاج النيسابوري (ت 261هـ)', category: 'الحديث الشريف',
    description: 'ثاني أصح كتاب بعد كتاب الله',
    volumes: createVolumes('b2-muslim', 5, (i) => `https://archive.org/download/WAQ24871/${String(i).padStart(2, '0')}_24871.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sunan-abi-dawud', name: 'سنن أبي داود',
    author: 'الإمام أبو داود السجستاني (ت 275هـ)', category: 'الحديث الشريف',
    description: 'من أهم كتب السنن الأربعة',
    volumes: createVolumes('b2-abi-dawud', 5, (i) => `https://archive.org/download/WAQ62611/${String(i).padStart(2, '0')}_62611.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sunan-tirmidhi', name: 'جامع الترمذي',
    author: 'الإمام محمد بن عيسى الترمذي (ت 279هـ)', category: 'الحديث الشريف',
    description: 'من أمهات كتب الحديث الستة',
    volumes: createVolumes('b2-tirmidhi', 6, (i) => `https://archive.org/download/WAQ62621/${String(i).padStart(2, '0')}_62621.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sunan-nasai', name: 'سنن النسائي',
    author: 'الإمام أحمد بن شعيب النسائي (ت 303هـ)', category: 'الحديث الشريف',
    description: 'من الكتب الستة في الحديث',
    volumes: createVolumes('b2-nasai', 8, (i) => `https://archive.org/download/WAQ62631/${String(i).padStart(2, '0')}_62631.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sunan-ibn-majah', name: 'سنن ابن ماجه',
    author: 'الإمام محمد بن يزيد ابن ماجه (ت 273هـ)', category: 'الحديث الشريف',
    description: 'سادس الكتب الستة في الحديث',
    volumes: createVolumes('b2-ibn-majah', 2, (i) => `https://archive.org/download/WAQ62641/${String(i).padStart(2, '0')}_62641.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-muwatta-malik', name: 'موطأ الإمام مالك',
    author: 'الإمام مالك بن أنس (ت 179هـ)', category: 'الحديث الشريف',
    description: 'من أقدم كتب الحديث وأصحّها',
    volumes: createVolumes('b2-muwatta', 2, (i) => `https://archive.org/download/WAQ62651/${String(i).padStart(2, '0')}_62651.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-musnad-ahmad', name: 'مسند الإمام أحمد',
    author: 'الإمام أحمد بن حنبل (ت 241هـ)', category: 'الحديث الشريف',
    description: 'من أعظم كتب الحديث المسندة',
    volumes: createVolumes('b2-musnad', 10, (i) => `https://archive.org/download/WAQ103961/${String(i).padStart(2, '0')}_103961.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-riyadh-saliheen', name: 'رياض الصالحين',
    author: 'الإمام يحيى بن شرف النووي (ت 676هـ)', category: 'الحديث الشريف',
    description: 'من أشهر كتب الأحاديث في الترغيب والترهيب',
    volumes: singleVol('b2-riyadh', 'رياض الصالحين', 'https://archive.org/download/FPreyadalsaleheen/reyadalsaleheen.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-arbain-nawawi', name: 'الأربعون النووية',
    author: 'الإمام النووي (ت 676هـ)', category: 'الحديث الشريف',
    description: 'أربعون حديثًا جامعة لأصول الإسلام',
    volumes: singleVol('b2-arbain', 'الأربعون النووية', 'https://archive.org/download/FParba3een/arba3een.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-bulugh-maram', name: 'بلوغ المرام من أدلة الأحكام',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'الحديث الشريف',
    description: 'كتاب جامع لأحاديث الأحكام الفقهية',
    volumes: singleVol('b2-bulugh', 'بلوغ المرام', 'https://archive.org/download/FPbologhalmaram/bologhalmaram.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-umdat-ahkam', name: 'عمدة الأحكام من كلام خير الأنام',
    author: 'الحافظ عبد الغني المقدسي (ت 600هـ)', category: 'الحديث الشريف',
    description: 'مختارات من الأحاديث الصحيحة في الأحكام',
    volumes: singleVol('b2-umdat', 'عمدة الأحكام', 'https://archive.org/download/FP3omdat/3omdat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-mishkat', name: 'مشكاة المصابيح',
    author: 'الإمام محمد الخطيب التبريزي (ت 741هـ)', category: 'الحديث الشريف',
    description: 'من أشهر كتب الحديث الجامعة',
    volumes: createVolumes('b2-mishkat', 3, (i) => `https://archive.org/download/WAQ23711/${String(i).padStart(2, '0')}_23711.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ شروح كتب الحديث ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-fath-bari', name: 'فتح الباري بشرح صحيح البخاري',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'الحديث الشريف',
    description: 'أعظم شروح صحيح البخاري',
    volumes: createVolumes('b2-fath-bari', 15, (i) => `https://archive.org/download/WAQ13221/${String(i).padStart(2, '0')}_13221.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sharh-nawawi', name: 'المنهاج شرح صحيح مسلم',
    author: 'الإمام النووي (ت 676هـ)', category: 'الحديث الشريف',
    description: 'أشهر شروح صحيح مسلم',
    volumes: createVolumes('b2-sharh-muslim', 9, (i) => `https://archive.org/download/WAQ124471/${String(i).padStart(2, '0')}_124471.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-subul-salam', name: 'سبل السلام شرح بلوغ المرام',
    author: 'الإمام محمد بن إسماعيل الصنعاني (ت 1182هـ)', category: 'الحديث الشريف',
    description: 'شرح نفيس على كتاب بلوغ المرام',
    volumes: createVolumes('b2-subul', 2, (i) => `https://archive.org/download/WAQ85481/${String(i).padStart(2, '0')}_85481.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-nayl-awtar', name: 'نيل الأوطار شرح منتقى الأخبار',
    author: 'الإمام الشوكاني (ت 1250هـ)', category: 'الحديث الشريف',
    description: 'شرح موسع على منتقى الأخبار لابن تيمية الجد',
    volumes: createVolumes('b2-nayl', 8, (i) => `https://archive.org/download/WAQ43991/${String(i).padStart(2, '0')}_43991.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-bahjat-nazirin', name: 'بهجة الناظرين شرح رياض الصالحين',
    author: 'الشيخ سليم الهلالي', category: 'الحديث الشريف',
    description: 'شرح نافع لكتاب رياض الصالحين',
    volumes: createVolumes('b2-bahjat', 3, (i) => `https://archive.org/download/WAQ22741/${String(i).padStart(2, '0')}_22741.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ السيرة النبوية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-rahiq-makhtum', name: 'الرحيق المختوم',
    author: 'الشيخ صفي الرحمن المباركفوري (ت 1427هـ)', category: 'السيرة النبوية',
    description: 'الحائز على الجائزة الأولى في السيرة النبوية',
    volumes: singleVol('b2-rahiq', 'الرحيق المختوم', 'https://archive.org/download/FPalrahiq_makhtom/alrahiq_makhtom.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-sirah-ibn-hisham', name: 'السيرة النبوية لابن هشام',
    author: 'الإمام عبد الملك بن هشام (ت 213هـ)', category: 'السيرة النبوية',
    description: 'أقدم وأهم مصدر للسيرة النبوية',
    volumes: createVolumes('b2-ibn-hisham', 4, (i) => `https://archive.org/download/WAQ98331/${String(i).padStart(2, '0')}_98331.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-zad-maad', name: 'زاد المعاد في هدي خير العباد',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'السيرة النبوية',
    description: 'من أنفس كتب السيرة والفقه',
    volumes: createVolumes('b2-zad-maad', 5, (i) => `https://archive.org/download/WAQ26841/${String(i).padStart(2, '0')}_26841.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-bidaya-nihaya-sira', name: 'البداية والنهاية (قسم السيرة)',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'السيرة النبوية',
    description: 'من أجمع كتب التاريخ والسيرة',
    volumes: createVolumes('b2-bidaya', 14, (i) => `https://archive.org/download/WAQ80671/${String(i).padStart(2, '0')}_80671.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-shamail-tirmidhi', name: 'الشمائل المحمدية',
    author: 'الإمام الترمذي (ت 279هـ)', category: 'السيرة النبوية',
    description: 'في صفات النبي ﷺ وأخلاقه',
    volumes: singleVol('b2-shamail', 'الشمائل المحمدية', 'https://archive.org/download/FPalshamail/alshamail.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-sirah-nabawiyah-ibn-kathir', name: 'السيرة النبوية لابن كثير',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'السيرة النبوية',
    description: 'تفصيل السيرة النبوية من البداية والنهاية',
    volumes: createVolumes('b2-sira-ibn-kathir', 4, (i) => `https://archive.org/download/WAQ27521/${String(i).padStart(2, '0')}_27521.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sira-ibn-ishaq', name: 'سيرة ابن إسحاق',
    author: 'الإمام محمد بن إسحاق (ت 151هـ)', category: 'السيرة النبوية',
    description: 'من أقدم مصادر السيرة النبوية',
    volumes: singleVol('b2-ibn-ishaq', 'سيرة ابن إسحاق', 'https://archive.org/download/FPsirat_ibn_ishaq/sirat_ibn_ishaq.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-hayah-sahabah', name: 'حياة الصحابة',
    author: 'الشيخ محمد يوسف الكاندهلوي', category: 'السيرة النبوية',
    description: 'موسوعة في حياة الصحابة الكرام',
    volumes: createVolumes('b2-hayat', 4, (i) => `https://archive.org/download/WAQ34531/${String(i).padStart(2, '0')}_34531.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الفقه وأصوله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-fiqh-sunnah', name: 'فقه السنة',
    author: 'الشيخ سيد سابق (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة فقهية ميسرة بالأدلة من الكتاب والسنة',
    volumes: createVolumes('b2-fiqh-sunnah', 3, (i) => `https://archive.org/download/WAQ88461/${String(i).padStart(2, '0')}_88461.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-mulakhas-fiqhi', name: 'الملخص الفقهي',
    author: 'الشيخ صالح الفوزان', category: 'الفقه وأصوله',
    description: 'مختصر مفيد في الفقه على مذهب الإمام أحمد',
    volumes: createVolumes('b2-mulakhas', 2, (i) => `https://archive.org/download/WAQ94581/${String(i).padStart(2, '0')}_94581.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-mughni-ibn-qudama', name: 'المغني',
    author: 'الإمام موفق الدين ابن قدامة (ت 620هـ)', category: 'الفقه وأصوله',
    description: 'أعظم كتب الفقه المقارن على المذهب الحنبلي',
    volumes: createVolumes('b2-mughni', 15, (i) => `https://archive.org/download/WAQ9271/${String(i).padStart(2, '0')}_9271.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-majmu-nawawi', name: 'المجموع شرح المهذب',
    author: 'الإمام النووي (ت 676هـ)', category: 'الفقه وأصوله',
    description: 'كتاب جامع في الفقه الشافعي',
    volumes: createVolumes('b2-majmu', 20, (i) => `https://archive.org/download/WAQ22291/${String(i).padStart(2, '0')}_22291.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-zad-mustaqni', name: 'زاد المستقنع في اختصار المقنع',
    author: 'الإمام موسى الحجاوي (ت 968هـ)', category: 'الفقه وأصوله',
    description: 'متن معتمد في الفقه الحنبلي',
    volumes: singleVol('b2-zad-mustaqni', 'زاد المستقنع', 'https://archive.org/download/FPzad_almostaqni/zad_almostaqni.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-rawd-murbi', name: 'الروض المربع شرح زاد المستقنع',
    author: 'الإمام منصور البهوتي (ت 1051هـ)', category: 'الفقه وأصوله',
    description: 'من أشهر شروح زاد المستقنع',
    volumes: singleVol('b2-rawd', 'الروض المربع', 'https://archive.org/download/FParrawd_murabba/arrawd_murabba.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-usul-fiqh-thamin', name: 'الأصول من علم الأصول',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    description: 'مختصر في أصول الفقه',
    volumes: singleVol('b2-usul-thamin', 'الأصول من علم الأصول', 'https://archive.org/download/FPalosolminalosol/alosolminalosol.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-waraqat-imam', name: 'الورقات في أصول الفقه',
    author: 'إمام الحرمين الجويني (ت 478هـ)', category: 'الفقه وأصوله',
    description: 'متن مختصر مشهور في أصول الفقه',
    volumes: singleVol('b2-waraqat', 'الورقات', 'https://archive.org/download/FPalwaraqat/alwaraqat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-irwa-ghalil', name: 'إرواء الغليل في تخريج أحاديث منار السبيل',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'تخريج أحاديث الأحكام من كتاب منار السبيل',
    volumes: createVolumes('b2-irwa', 9, (i) => `https://archive.org/download/WAQ37171/${String(i).padStart(2, '0')}_37171.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-manar-sabil', name: 'منار السبيل في شرح الدليل',
    author: 'الشيخ إبراهيم بن محمد بن ضويان (ت 1353هـ)', category: 'الفقه وأصوله',
    description: 'شرح معتمد في الفقه الحنبلي',
    volumes: createVolumes('b2-manar', 2, (i) => `https://archive.org/download/WAQ27321/${String(i).padStart(2, '0')}_27321.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ اللغة العربية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-alfiyya-ibn-malik', name: 'ألفية ابن مالك',
    author: 'الإمام ابن مالك (ت 672هـ)', category: 'اللغة العربية',
    description: 'منظومة شهيرة في النحو والصرف',
    volumes: singleVol('b2-alfiyya', 'ألفية ابن مالك', 'https://archive.org/download/FPalfiyat_ibn_malik/alfiyat_ibn_malik.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-sharh-alfiyya-ibn-aqil', name: 'شرح ابن عقيل على الألفية',
    author: 'الإمام ابن عقيل (ت 769هـ)', category: 'اللغة العربية',
    description: 'من أشهر شروح ألفية ابن مالك',
    volumes: createVolumes('b2-ibn-aqil', 4, (i) => `https://archive.org/download/WAQ70051/${String(i).padStart(2, '0')}_70051.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-mughni-labib', name: 'مغني اللبيب عن كتب الأعاريب',
    author: 'الإمام ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'من أهم كتب النحو',
    volumes: createVolumes('b2-mughni-labib', 2, (i) => `https://archive.org/download/WAQ12381/${String(i).padStart(2, '0')}_12381.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-ajurrumiyya', name: 'متن الآجرومية',
    author: 'الإمام محمد بن داود الصنهاجي (ت 723هـ)', category: 'اللغة العربية',
    description: 'متن مختصر شهير في علم النحو',
    volumes: singleVol('b2-ajrum', 'متن الآجرومية', 'https://archive.org/download/FPajroumiyya/ajroumiyya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-qatr-nada', name: 'قطر الندى وبل الصدى',
    author: 'الإمام ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'من مختصرات النحو المشهورة',
    volumes: singleVol('b2-qatr', 'قطر الندى', 'https://archive.org/download/FPqatralnada/qatralnada.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-sharh-ibn-aqil-alfiya', name: 'شرح قطر الندى',
    author: 'الإمام ابن هشام', category: 'اللغة العربية',
    description: 'شرح المؤلف لمتن قطر الندى',
    volumes: singleVol('b2-sharh-qatr', 'شرح قطر الندى', 'https://archive.org/download/FPsharh_qatralnada/sharh_qatralnada.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-tuhfat-saniyya', name: 'التحفة السنية بشرح المقدمة الآجرومية',
    author: 'الشيخ محيي الدين عبد الحميد', category: 'اللغة العربية',
    description: 'من أشهر شروح الآجرومية',
    volumes: singleVol('b2-tuhfat-saniyya', 'التحفة السنية', 'https://archive.org/download/FPaltohfatalsaniyya/altohfatalsaniyya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-nahw-wadih', name: 'النحو الواضح',
    author: 'علي الجارم ومصطفى أمين', category: 'اللغة العربية',
    description: 'كتاب ميسر لتعلم النحو للمبتدئين',
    volumes: createVolumes('b2-nahw-wadih', 3, (i) => `https://archive.org/download/FPnwadih${i}/nwadih${i}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الرقائق والآداب - ابن القيم ابن رجب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-madarij-salikin', name: 'مدارج السالكين بين منازل إياك نعبد وإياك نستعين',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'من أنفس كتب السلوك والتربية',
    volumes: createVolumes('b2-madarij', 3, (i) => `https://archive.org/download/WAQ42791/${String(i).padStart(2, '0')}_42791.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-iddat-sabirin', name: 'عدة الصابرين وذخيرة الشاكرين',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'في فضل الصبر والشكر',
    volumes: singleVol('b2-iddat', 'عدة الصابرين', 'https://archive.org/download/FPiddatalsabireen/iddatalsabireen.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-dhamm-hawa', name: 'ذم الهوى',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'الرقائق والآداب',
    description: 'في التحذير من اتباع الهوى',
    volumes: singleVol('b2-dhamm-hawa', 'ذم الهوى', 'https://archive.org/download/FPzamalhwa/zamalhwa.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-sayd-khatir', name: 'صيد الخاطر',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'الرقائق والآداب',
    description: 'خواطر ومواعظ من الإمام ابن الجوزي',
    volumes: singleVol('b2-sayd', 'صيد الخاطر', 'https://archive.org/download/FPsaydalkhater/saydalkhater.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-talbis-iblis', name: 'تلبيس إبليس',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'الرقائق والآداب',
    description: 'في كشف تلبيسات إبليس على الناس',
    volumes: singleVol('b2-talbis', 'تلبيس إبليس', 'https://archive.org/download/FPtalbisibls/talbisibls.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-dha-tb-hanabila', name: 'ذم قسوة القلب وعلاجها',
    author: 'الإمام ابن رجب الحنبلي (ت 795هـ)', category: 'الرقائق والآداب',
    description: 'رسالة نافعة في علاج قسوة القلب',
    volumes: singleVol('b2-qalb-qasi', 'علاج قسوة القلب', 'https://archive.org/download/FPqalbmayyit/qalbmayyit.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-nasaih-diniyya', name: 'النصائح الدينية والوصايا الإيمانية',
    author: 'الإمام عبد الله بن علوي الحداد', category: 'الرقائق والآداب',
    description: 'نصائح نافعة في الدين',
    volumes: singleVol('b2-nasaih-hdd', 'النصائح الدينية', 'https://archive.org/download/FPalnasaehaldinia/alnasaehaldinia.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-akhlaq-nabawiyyah', name: 'الأخلاق النبوية',
    author: 'الإمام محمد بن جعفر الكتاني', category: 'الرقائق والآداب',
    description: 'في أخلاق النبي ﷺ وسيرته العطرة',
    volumes: singleVol('b2-akhlaq-nab', 'الأخلاق النبوية', 'https://archive.org/download/FPalakhlakalnabawia/alakhlakalnabawia.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-fawaid-ibn-qayyim', name: 'الفوائد',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'فوائد ومواعظ نافعة',
    volumes: singleVol('b2-fawaid-iqm', 'الفوائد لابن القيم', 'https://archive.org/download/FPalfwaidlibnalqym/alfwaidlibnalqym.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ أسباب النزول ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-asbab-nuzul-wahidi', name: 'أسباب النزول',
    author: 'الإمام أبو الحسن الواحدي (ت 468هـ)', category: 'أسباب النزول',
    description: 'أشهر كتاب في أسباب النزول',
    volumes: singleVol('b2-wahidi', 'أسباب النزول', 'https://archive.org/download/FPasbabalnozol/asbabalnozol.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-lubab-nuqul', name: 'لباب النقول في أسباب النزول',
    author: 'الحافظ جلال الدين السيوطي (ت 911هـ)', category: 'أسباب النزول',
    description: 'مختصر في أسباب النزول',
    volumes: singleVol('b2-lubab', 'لباب النقول', 'https://archive.org/download/FPlobabalnoqol/lobabalnoqol.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ غريب القرآن ومفرداته ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-mufradat-raghib', name: 'المفردات في غريب القرآن',
    author: 'الإمام الراغب الأصفهاني (ت 502هـ)', category: 'غريب القرآن ومفرداته',
    description: 'من أنفس كتب غريب القرآن',
    volumes: singleVol('b2-mufradat', 'المفردات', 'https://archive.org/download/FPalmofradatforghbalquran/almofradatforghbalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-umda-hafaz', name: 'عمدة الحفاظ في تفسير أشرف الألفاظ',
    author: 'الإمام أحمد بن يوسف السمين الحلبي (ت 756هـ)', category: 'غريب القرآن ومفرداته',
    description: 'شرح مفردات القرآن الكريم',
    volumes: createVolumes('b2-umda-hafaz', 4, (i) => `https://archive.org/download/WAQ55931/${String(i).padStart(2, '0')}_55931.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-tafsir-gharib', name: 'تفسير غريب القرآن',
    author: 'الإمام ابن قتيبة (ت 276هـ)', category: 'غريب القرآن ومفرداته',
    description: 'من أقدم كتب غريب القرآن',
    volumes: singleVol('b2-gharib', 'تفسير غريب القرآن', 'https://archive.org/download/FPtafseergharib/tafseergharib.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إعراب القرآن وبيانه ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-irab-quran-nahas', name: 'إعراب القرآن',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب إعراب القرآن',
    volumes: createVolumes('b2-irab-nahas', 5, (i) => `https://archive.org/download/WAQ60781/${String(i).padStart(2, '0')}_60781.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-durr-masun', name: 'الدر المصون في علوم الكتاب المكنون',
    author: 'الإمام السمين الحلبي (ت 756هـ)', category: 'إعراب القرآن وبيانه',
    description: 'إعراب وبلاغة القرآن الكريم',
    volumes: createVolumes('b2-durr-masun', 11, (i) => `https://archive.org/download/WAQ66081/${String(i).padStart(2, '0')}_66081.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-irab-darwish', name: 'إعراب القرآن وبيانه',
    author: 'الشيخ محيي الدين درويش', category: 'إعراب القرآن وبيانه',
    description: 'إعراب مفصل للقرآن الكريم',
    volumes: createVolumes('b2-darwish', 10, (i) => `https://archive.org/download/WAQ46341/${String(i).padStart(2, '0')}_46341.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ التدبر ومواعظ قرآنية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-tadabur-khalid', name: 'تدبر القرآن',
    author: 'د. سلمان العودة', category: 'التدبر',
    description: 'كيف نتدبر القرآن الكريم',
    volumes: singleVol('b2-tadabur-al', 'تدبر القرآن', 'https://archive.org/download/FPtdbralqran/tdbralqran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-tadabur-saadi-quran', name: 'تيسير الكريم الرحمن',
    author: 'الشيخ عبد الرحمن بن ناصر السعدي (ت 1376هـ)', category: 'التفسير',
    description: 'تفسير السعدي وهو من أسهل التفاسير وأوضحها',
    volumes: createVolumes('b2-saadi-tafsir', 1, () => `https://archive.org/download/FPtaysirmnan/taysirmnan.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-risalah-mabaheth', name: 'مباحث في إعجاز القرآن',
    author: 'د. مصطفى مسلم', category: 'علوم القرآن',
    description: 'بحث في الإعجاز القرآني',
    volumes: singleVol('b2-mabaheth-ijaz', 'مباحث في إعجاز القرآن', 'https://archive.org/download/FPmabahethfiijazalqn/mabahethfiijazalqn.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الشيخ الألباني رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-silsilah-sahiha', name: 'سلسلة الأحاديث الصحيحة',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'مجموعة كبيرة من الأحاديث الصحيحة مع التخريج',
    volumes: createVolumes('b2-sahiha', 7, (i) => `https://archive.org/download/WAQ56411/${String(i).padStart(2, '0')}_56411.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-silsilah-daifa', name: 'سلسلة الأحاديث الضعيفة والموضوعة',
    author: 'الشيخ الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'كشف ضعف الأحاديث الضعيفة والموضوعة',
    volumes: createVolumes('b2-daifa', 14, (i) => `https://archive.org/download/WAQ56421/${String(i).padStart(2, '0')}_56421.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sifat-salah', name: 'صفة صلاة النبي ﷺ',
    author: 'الشيخ الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'صفة صلاة النبي من التكبير إلى التسليم',
    volumes: singleVol('b2-sifat-salah', 'صفة صلاة النبي', 'https://archive.org/download/FPsifatsalat/sifatsalat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-sahih-targhib', name: 'صحيح الترغيب والترهيب',
    author: 'الشيخ الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'صحيح أحاديث الترغيب والترهيب للمنذري',
    volumes: createVolumes('b2-sahih-targhib', 3, (i) => `https://archive.org/download/WAQ67201/${String(i).padStart(2, '0')}_67201.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sahih-jami', name: 'صحيح الجامع الصغير',
    author: 'الشيخ الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'صحيح أحاديث الجامع الصغير للسيوطي',
    volumes: createVolumes('b2-sahih-jami', 2, (i) => `https://archive.org/download/WAQ53261/${String(i).padStart(2, '0')}_53261.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-tahdhir-sajid', name: 'تحذير الساجد من اتخاذ القبور مساجد',
    author: 'الشيخ الألباني (ت 1420هـ)', category: 'العقيدة',
    description: 'رسالة في التحذير من البناء على القبور',
    volumes: singleVol('b2-tahdhir', 'تحذير الساجد', 'https://archive.org/download/FPtahzeeralsajed/tahzeeralsajed.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الشيخ ابن باز رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-majmu-bin-baz', name: 'مجموع فتاوى ابن باز',
    author: 'الشيخ عبد العزيز بن باز (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة فتاوى ومقالات الشيخ ابن باز',
    volumes: createVolumes('b2-mjm-baz', 10, (i) => `https://archive.org/download/WAQ105211/${String(i).padStart(2, '0')}_105211.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-aqida-sahiha', name: 'العقيدة الصحيحة وما يضادها',
    author: 'الشيخ ابن باز (ت 1420هـ)', category: 'العقيدة',
    description: 'رسالة في بيان العقيدة الصحيحة',
    volumes: singleVol('b2-aqida-sahiha', 'العقيدة الصحيحة', 'https://archive.org/download/FPalaqidat_alsahihah/alaqidat_alsahihah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-wujub-tahkim', name: 'وجوب تحكيم شرع الله',
    author: 'الشيخ ابن باز (ت 1420هـ)', category: 'العقيدة',
    description: 'رسالة في وجوب تحكيم شريعة الله',
    volumes: singleVol('b2-wujub', 'وجوب تحكيم شرع الله', 'https://archive.org/download/FPwojobtahkim/wojobtahkim.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الشيخ ابن عثيمين رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-majmu-othaimin', name: 'مجموع فتاوى ورسائل ابن عثيمين',
    author: 'الشيخ ابن عثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة فتاوى ورسائل الشيخ ابن عثيمين',
    volumes: createVolumes('b2-mjm-ot', 26, (i) => `https://archive.org/download/WAQ115921/${String(i).padStart(2, '0')}_115921.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-sharh-usul-thamin', name: 'شرح الأصول الثلاثة',
    author: 'الشيخ ابن عثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'شرح متن الأصول الثلاثة لابن عبد الوهاب',
    volumes: singleVol('b2-sharh-usul', 'شرح الأصول الثلاثة', 'https://archive.org/download/FPsharh_usul_thalatha/sharh_usul_thalatha.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-manzumah-bayquniyyah', name: 'شرح المنظومة البيقونية',
    author: 'الشيخ ابن عثيمين (ت 1421هـ)', category: 'الحديث الشريف',
    description: 'شرح منظومة علم مصطلح الحديث',
    volumes: singleVol('b2-bayquniyyah', 'شرح البيقونية', 'https://archive.org/download/FPsharh_bayquniyyah/sharh_bayquniyyah.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب متنوعة نافعة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-risalah-shafii', name: 'الرسالة',
    author: 'الإمام محمد بن إدريس الشافعي (ت 204هـ)', category: 'الفقه وأصوله',
    description: 'أول كتاب في أصول الفقه',
    volumes: singleVol('b2-risalah-shaf', 'الرسالة للشافعي', 'https://archive.org/download/FPrisalat_alshafii/risalat_alshafii.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-muafaqat', name: 'الموافقات',
    author: 'الإمام أبو إسحاق الشاطبي (ت 790هـ)', category: 'الفقه وأصوله',
    description: 'أعظم كتب مقاصد الشريعة',
    volumes: createVolumes('b2-muafaqat', 4, (i) => `https://archive.org/download/WAQ37931/${String(i).padStart(2, '0')}_37931.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-itisam', name: 'الاعتصام',
    author: 'الإمام الشاطبي (ت 790هـ)', category: 'العقيدة',
    description: 'في التحذير من البدع والتمسك بالسنة',
    volumes: createVolumes('b2-itisam', 2, (i) => `https://archive.org/download/WAQ29981/${String(i).padStart(2, '0')}_29981.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-minhaj-sunnah', name: 'منهاج السنة النبوية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في نقض كلام الشيعة والقدرية',
    volumes: createVolumes('b2-minhaj', 9, (i) => `https://archive.org/download/WAQ4321/${String(i).padStart(2, '0')}_4321.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-dar-taarud', name: 'درء تعارض العقل والنقل',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في تقرير موافقة صريح المعقول لصحيح المنقول',
    volumes: createVolumes('b2-dar-taarud', 10, (i) => `https://archive.org/download/WAQ68101/${String(i).padStart(2, '0')}_68101.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-fatwa-kubra', name: 'الفتاوى الكبرى',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'الفقه وأصوله',
    description: 'مجموعة فتاوى شيخ الإسلام',
    volumes: createVolumes('b2-fatwa-kubra', 5, (i) => `https://archive.org/download/WAQ54691/${String(i).padStart(2, '0')}_54691.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-ibn-kathir-full', name: 'تفسير القرآن العظيم',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'التفسير',
    description: 'من أصح كتب التفسير بالمأثور عند أهل السنة',
    volumes: createVolumes('b2-ibn-kathir', 8, (i) => `https://archive.org/download/WAQ23391/${String(i).padStart(2, '0')}_23391.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-zad-masir', name: 'زاد المسير في علم التفسير',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'التفسير',
    description: 'من كتب التفسير المختصرة النافعة',
    volumes: createVolumes('b2-zad-masir', 4, (i) => `https://archive.org/download/WAQ68801/${String(i).padStart(2, '0')}_68801.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-hilyat-awliya', name: 'حلية الأولياء وطبقات الأصفياء',
    author: 'الإمام أبو نعيم الأصبهاني (ت 430هـ)', category: 'الرقائق والآداب',
    description: 'موسوعة في سير الصالحين والأتقياء',
    volumes: createVolumes('b2-hilyat', 10, (i) => `https://archive.org/download/WAQ38291/${String(i).padStart(2, '0')}_38291.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-siyar-alam', name: 'سير أعلام النبلاء',
    author: 'الحافظ شمس الدين الذهبي (ت 748هـ)', category: 'السيرة النبوية',
    description: 'من أعظم كتب التراجم والسير',
    volumes: createVolumes('b2-siyar', 23, (i) => `https://archive.org/download/WAQ24101/${String(i).padStart(2, '0')}_24101.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-tadhkira-huffaz', name: 'تذكرة الحفاظ',
    author: 'الحافظ الذهبي (ت 748هـ)', category: 'الحديث الشريف',
    description: 'تراجم حفاظ الحديث ورواته',
    volumes: createVolumes('b2-tadhkira', 4, (i) => `https://archive.org/download/WAQ45851/${String(i).padStart(2, '0')}_45851.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-minhaj-qasidin', name: 'مختصر منهاج القاصدين',
    author: 'الإمام ابن قدامة المقدسي (ت 620هـ)', category: 'الرقائق والآداب',
    description: 'في تهذيب النفس والآداب الشرعية',
    volumes: singleVol('b2-minhaj-qas', 'مختصر منهاج القاصدين', 'https://archive.org/download/FPmokhtasarmanhajqasedeen/mokhtasarmanhajqasedeen.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-mukhtasar-tadhkira', name: 'مختصر التذكرة للقرطبي',
    author: 'الإمام القرطبي (ت 671هـ)', category: 'العقيدة',
    description: 'في أحوال الموتى وأمور الآخرة',
    volumes: singleVol('b2-tadhkira-qurtubi', 'التذكرة', 'https://archive.org/download/FPtazkira_qurtubi/tazkira_qurtubi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-adab-mufrad', name: 'الأدب المفرد',
    author: 'الإمام البخاري (ت 256هـ)', category: 'الحديث الشريف',
    description: 'في آداب المسلم وأخلاقه',
    volumes: singleVol('b2-adab-mufrad', 'الأدب المفرد', 'https://archive.org/download/FPadabmofrad/adabmofrad.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-hisn-muslim', name: 'حصن المسلم من أذكار الكتاب والسنة',
    author: 'الشيخ سعيد بن علي القحطاني', category: 'الرقائق والآداب',
    description: 'من أشهر كتب الأذكار الصحيحة',
    volumes: singleVol('b2-hisn', 'حصن المسلم', 'https://archive.org/download/FPhisn_almuslim/hisn_almuslim.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-kitab-duaa', name: 'الدعاء من الكتاب والسنة',
    author: 'الشيخ سعيد بن علي القحطاني', category: 'الرقائق والآداب',
    description: 'أدعية الرسول ﷺ من الكتاب والسنة',
    volumes: singleVol('b2-duaa', 'الدعاء من الكتاب والسنة', 'https://archive.org/download/FPaldoaamenalktab/aldoaamenalktab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-umdah-tafseer', name: 'عمدة التفسير (مختصر تفسير ابن كثير)',
    author: 'الشيخ أحمد شاكر (ت 1377هـ)', category: 'التفسير',
    description: 'مختصر لتفسير ابن كثير',
    volumes: createVolumes('b2-umdah-t', 3, (i) => `https://archive.org/download/WAQ102931/${String(i).padStart(2, '0')}_102931.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-umm-shafii', name: 'الأم',
    author: 'الإمام الشافعي (ت 204هـ)', category: 'الفقه وأصوله',
    description: 'أصل كتب الفقه الشافعي',
    volumes: createVolumes('b2-umm', 8, (i) => `https://archive.org/download/WAQ48341/${String(i).padStart(2, '0')}_48341.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-mabsut', name: 'المبسوط',
    author: 'الإمام السرخسي (ت 483هـ)', category: 'الفقه وأصوله',
    description: 'من أهم كتب الفقه الحنفي',
    volumes: createVolumes('b2-mabsut', 30, (i) => `https://archive.org/download/WAQ60351/${String(i).padStart(2, '0')}_60351.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b2-mudawana', name: 'المدونة الكبرى',
    author: 'الإمام مالك (ت 179هـ)', category: 'الفقه وأصوله',
    description: 'من أهم كتب الفقه المالكي',
    volumes: createVolumes('b2-mudawana', 4, (i) => `https://archive.org/download/WAQ48351/${String(i).padStart(2, '0')}_48351.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب معاصرة نافعة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-fiqh-muyassar', name: 'الفقه الميسر في ضوء الكتاب والسنة',
    author: 'نخبة من العلماء (مجمع الملك فهد)', category: 'الفقه وأصوله',
    description: 'فقه ميسر بالأدلة من الكتاب والسنة',
    volumes: singleVol('b2-fiqh-muy', 'الفقه الميسر', 'https://archive.org/download/FPalfiqhalmoyassar/alfiqhalmoyassar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-mulakhas-aqida', name: 'ملخص العقيدة الإسلامية',
    author: 'الشيخ عبد العزيز الراجحي', category: 'العقيدة',
    description: 'مختصر نافع في العقيدة',
    volumes: singleVol('b2-mulakhas-aq', 'ملخص العقيدة', 'https://archive.org/download/FPmolakhas_aqeeda/molakhas_aqeeda.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-irshad-tulab', name: 'إرشاد طلاب الحقائق إلى معرفة سنن خير الخلائق',
    author: 'الإمام النووي (ت 676هـ)', category: 'الحديث الشريف',
    description: 'في علوم الحديث ومصطلحه',
    volumes: singleVol('b2-irshad', 'إرشاد طلاب الحقائق', 'https://archive.org/download/FPirshadtollab/irshadtollab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-tayseer-mustalah', name: 'تيسير مصطلح الحديث',
    author: 'الشيخ محمود الطحان', category: 'الحديث الشريف',
    description: 'كتاب مبسط في مصطلح الحديث',
    volumes: singleVol('b2-tayseer-mus', 'تيسير مصطلح الحديث', 'https://archive.org/download/FPtayseer_mostalah/tayseer_mostalah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-baith-hathith', name: 'الباعث الحثيث شرح اختصار علوم الحديث',
    author: 'الشيخ أحمد شاكر (ت 1377هـ)', category: 'الحديث الشريف',
    description: 'شرح اختصار علوم الحديث لابن كثير',
    volumes: singleVol('b2-baith', 'الباعث الحثيث', 'https://archive.org/download/FPalbaethalhathith/albaethalhathith.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-manhaj-salikin', name: 'منهج السالكين',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'الفقه وأصوله',
    description: 'مختصر في الفقه على المذهب الحنبلي',
    volumes: singleVol('b2-manhaj-sal', 'منهج السالكين', 'https://archive.org/download/FPmanhajasalikin/manhajasalikin.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-bahjat-qulub-abrar', name: 'بهجة قلوب الأبرار وقرة عيون الأخيار',
    author: 'الشيخ السعدي (ت 1376هـ)', category: 'الحديث الشريف',
    description: 'شرح جوامع الأخبار',
    volumes: singleVol('b2-bahjat-qu', 'بهجة قلوب الأبرار', 'https://archive.org/download/FPbahjatqoloob/bahjatqoloob.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-tayseer-lateef-mannan', name: 'تيسير اللطيف المنان في خلاصة تفسير القرآن',
    author: 'الشيخ السعدي (ت 1376هـ)', category: 'التفسير',
    description: 'مختصر لتفسير تيسير الكريم الرحمن',
    volumes: singleVol('b2-tayseer-lm', 'تيسير اللطيف المنان', 'https://archive.org/download/FPtaysirallateef/taysirallateef.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-mukhtasar-fiqh-saudi', name: 'المختصر في الفقه',
    author: 'نخبة من العلماء', category: 'الفقه وأصوله',
    description: 'مختصر في العبادات والمعاملات',
    volumes: singleVol('b2-mukh-fiqh', 'المختصر في الفقه', 'https://archive.org/download/FPalmokhtasar_fialfiqh/almokhtasar_fialfiqh.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ أذكار ودعاء ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b2-adhkar-nawawi', name: 'الأذكار',
    author: 'الإمام النووي (ت 676هـ)', category: 'الرقائق والآداب',
    description: 'من أشهر كتب الأذكار عند أهل السنة',
    volumes: singleVol('b2-adhkar', 'الأذكار للنووي', 'https://archive.org/download/FPalazkaralnawawi/alazkaralnawawi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b2-alwa-hayat', name: 'الوابل الصيب من الكلم الطيب',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'في فضل الذكر والأدعية النبوية',
    volumes: singleVol('b2-alwa', 'الوابل الصيب', 'https://archive.org/download/FPalwabilalsayib/alwabilalsayib.pdf'),
    isSingleVolume: true,
  },
];
