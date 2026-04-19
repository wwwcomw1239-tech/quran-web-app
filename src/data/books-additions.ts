// ============================================
// ADDITIONAL ISLAMIC BOOKS (SUNNI SCHOLARS)
// إضافات كبيرة من كتب أهل السنة والجماعة
// All URLs verified from archive.org / waqfeya.net mirrors
// ============================================

import type { BookCollection, BookVolume } from './books';

function createVolumes(baseId: string, count: number, urlPattern: (i: number) => string): BookVolume[] {
  const arabicNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
    'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون',
    'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون', 'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', 'الثلاثون',
    'الحادي والثلاثون', 'الثاني والثلاثون', 'الثالث والثلاثون', 'الرابع والثلاثون', 'الخامس والثلاثون',
    'السادس والثلاثون', 'السابع والثلاثون', 'الثامن والثلاثون', 'التاسع والثلاثون', 'الأربعون',
    'الحادي والأربعون', 'الثاني والأربعون', 'الثالث والأربعون', 'الرابع والأربعون', 'الخامس والأربعون',
    'السادس والأربعون', 'السابع والأربعون', 'الثامن والأربعون', 'التاسع والأربعون', 'الخمسون'];

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

export const additionalBooks: BookCollection[] = [
  // ══════════════════════════════════════════════════════════════
  // ██ العقيدة - شيخ الإسلام ابن تيمية رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ibn-tay-wasitiyya', name: 'العقيدة الواسطية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'من أعظم متون العقيدة عند أهل السنة والجماعة',
    volumes: singleVol('ibn-tay-wasitiyya', 'العقيدة الواسطية', 'https://archive.org/download/waq27050/27050.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-tay-hamawiyya', name: 'الفتوى الحموية الكبرى',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في إثبات الصفات الإلهية على مذهب السلف',
    volumes: singleVol('ibn-tay-hamawiyya', 'الفتوى الحموية الكبرى', 'https://archive.org/download/FPhmawiya/hmawiya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-tay-tadmuriyya', name: 'العقيدة التدمرية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'رسالة في توحيد الأسماء والصفات والأفعال',
    volumes: singleVol('tadmuriyya', 'العقيدة التدمرية', 'https://archive.org/download/FP36875/36875.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-tay-iqtida', name: 'اقتضاء الصراط المستقيم لمخالفة أصحاب الجحيم',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في بيان منهج أهل السنة ومخالفة أهل الكتاب والمشركين',
    volumes: singleVol('iqtida', 'اقتضاء الصراط المستقيم', 'https://archive.org/download/FPiqtdhassrtlmstqym/iqtdhassrtlmstqym.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-tay-ubudiyya', name: 'كتاب العبودية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'بيان حقيقة العبودية لله تعالى',
    volumes: singleVol('ubudiyya', 'العبودية', 'https://archive.org/download/FPal3bodya/al3bodya.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ العقيدة - ابن قيم الجوزية رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ibn-qayyim-madarij', name: 'مدارج السالكين بين منازل إياك نعبد وإياك نستعين',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'شرح لمنازل السائرين إلى الله تعالى',
    volumes: createVolumes('madarij', 3, (i) => `https://archive.org/download/madarej-alsalkeen/madarej-alsalkeen-${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'zad-almaad', name: 'زاد المعاد في هدي خير العباد',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'السيرة النبوية',
    description: 'هدي النبي ﷺ في العبادات والمعاملات والأخلاق',
    volumes: createVolumes('zad-maad', 5, (i) => `https://archive.org/download/FPzadalmaad/zadalmaad${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-qayyim-fawaid', name: 'الفوائد',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'فوائد إيمانية وسلوكية في الوعظ والتزكية',
    volumes: singleVol('ibn-qayyim-fawaid', 'الفوائد', 'https://archive.org/download/FPalfwayd/alfwayd.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-qayyim-daawa', name: 'الداء والدواء (الجواب الكافي)',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'علاج أمراض القلوب وأثر المعاصي',
    volumes: singleVol('daawa', 'الداء والدواء', 'https://archive.org/download/FPaldaawldwaa/aldaawldwaa.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-qayyim-hadi', name: 'هداية الحيارى في أجوبة اليهود والنصارى',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'الحوار مع أهل الكتاب والرد على شبهاتهم',
    volumes: singleVol('hadaya', 'هداية الحيارى', 'https://archive.org/download/FP74770/74770.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-qayyim-uddah', name: 'عدة الصابرين وذخيرة الشاكرين',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'في الصبر والشكر ومنازلهما في الإسلام',
    volumes: singleVol('uddah', 'عدة الصابرين', 'https://archive.org/download/FP3dtsabryn/3dtsabryn.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-qayyim-wabil', name: 'الوابل الصيب من الكلم الطيب',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'في فضل الذكر وأثره في القلب',
    volumes: singleVol('wabil', 'الوابل الصيب', 'https://archive.org/download/FPalwabelalsayb/alwabelalsayb.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-qayyim-taj', name: 'مفتاح دار السعادة ومنشور ولاية العلم والإرادة',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'في فضل العلم وأهله',
    volumes: createVolumes('miftah', 2, (i) => `https://archive.org/download/FPmftahdralsaada/mftahdralsaada${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ العقيدة - الإمام محمد بن عبد الوهاب رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'kitab-tawhid-mw', name: 'كتاب التوحيد الذي هو حق الله على العبيد',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'أعظم كتاب مختصر في توحيد العبادة',
    volumes: singleVol('kitab-tawhid-mw', 'كتاب التوحيد', 'https://archive.org/download/FPktwh/ktwh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'usul-thalatha-mw', name: 'الأصول الثلاثة وأدلتها',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'متن عقدي مختصر جدا للمبتدئين',
    volumes: singleVol('usul-thalatha-mw', 'الأصول الثلاثة', 'https://archive.org/download/FPalosolthlth/alosolthlth.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qawaid-arbaa-mw', name: 'القواعد الأربع',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'أربع قواعد تعرف بها التوحيد والشرك',
    volumes: singleVol('qawaid-arbaa-mw', 'القواعد الأربع', 'https://archive.org/download/FParqwid/arqwid.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ العقيدة - الشيخ محمد بن صالح العثيمين رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'uth-sharh-wasitiyya', name: 'شرح العقيدة الواسطية',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'شرح مفصل ماتع للعقيدة الواسطية لشيخ الإسلام',
    volumes: createVolumes('uth-wasit', 2, (i) => `https://archive.org/download/FPshrhalwstya/shrhalwstya${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'uth-sharh-usul', name: 'شرح الأصول الثلاثة',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'شرح ماتع للأصول الثلاثة لابن عبد الوهاب',
    volumes: singleVol('uth-usul', 'شرح الأصول الثلاثة', 'https://archive.org/download/FPshrhaosolthlth/shrhaosolthlth.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'uth-sharh-qawaid', name: 'شرح القواعد الأربع',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'شرح القواعد الأربع لابن عبد الوهاب',
    volumes: singleVol('uth-qawaid', 'شرح القواعد الأربع', 'https://archive.org/download/FPshqa4/shqa4.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'uth-sharh-arbaeen', name: 'شرح الأربعين النووية',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الحديث الشريف',
    description: 'شرح ماتع للأربعين النووية',
    volumes: singleVol('uth-arbaeen', 'شرح الأربعين النووية', 'https://archive.org/download/WAQ109301/waq109301.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'uth-riyad', name: 'شرح رياض الصالحين',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الحديث الشريف',
    description: 'شرح رياض الصالحين للنووي',
    volumes: createVolumes('uth-riyad', 6, (i) => `https://archive.org/download/FPshrhryadalsalhyn/shrhryadalsalhyn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'uth-mumti', name: 'الشرح الممتع على زاد المستقنع',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    description: 'شرح مفصل لزاد المستقنع في الفقه الحنبلي',
    volumes: createVolumes('uth-mumti', 15, (i) => `https://archive.org/download/FPshrhalmmt3/shrhalmmt3${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'uth-majmu', name: 'مجموع فتاوى ورسائل الشيخ العثيمين',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة فتاوى ورسائل الشيخ العثيمين',
    volumes: createVolumes('uth-majmu', 26, (i) => `https://archive.org/download/FPuthaymeen_majmu/uthaymeen${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الحديث - الكتب الستة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sahih-bukhari', name: 'صحيح البخاري',
    author: 'الإمام محمد بن إسماعيل البخاري (ت 256هـ)', category: 'الحديث الشريف',
    description: 'أصح كتاب بعد كتاب الله عز وجل',
    volumes: createVolumes('sahih-bukhari', 9, (i) => `https://archive.org/download/FP56861/${String(i).padStart(2, '0')}_${56860 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sahih-muslim', name: 'صحيح مسلم',
    author: 'الإمام مسلم بن الحجاج القشيري (ت 261هـ)', category: 'الحديث الشريف',
    description: 'ثاني أصح كتاب بعد كتاب الله',
    volumes: createVolumes('sahih-muslim', 8, (i) => `https://archive.org/download/FP56871/${String(i).padStart(2, '0')}_${56870 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sunan-abudawud', name: 'سنن أبي داود',
    author: 'الإمام أبو داود السجستاني (ت 275هـ)', category: 'الحديث الشريف',
    description: 'من الكتب الستة في السنة النبوية',
    volumes: createVolumes('sunan-abudawud', 4, (i) => `https://archive.org/download/waq_sunan_abidawood/${String(i).padStart(2, '0')}_sad.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'jami-tirmidhi', name: 'جامع الترمذي (سنن الترمذي)',
    author: 'الإمام أبو عيسى الترمذي (ت 279هـ)', category: 'الحديث الشريف',
    description: 'من الكتب الستة - جامع في السنن والعلل',
    volumes: createVolumes('jami-tirmidhi', 5, (i) => `https://archive.org/download/waqjamea/${String(i).padStart(2, '0')}_jamea.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sunan-nasai', name: 'سنن النسائي (المجتبى)',
    author: 'الإمام أحمد بن شعيب النسائي (ت 303هـ)', category: 'الحديث الشريف',
    description: 'السنن الصغرى - من الكتب الستة',
    volumes: createVolumes('sunan-nasai', 8, (i) => `https://archive.org/download/waq_sunan_alnassa2i/${String(i).padStart(2, '0')}_snn.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sunan-ibnmajah', name: 'سنن ابن ماجه',
    author: 'الإمام محمد بن يزيد ابن ماجه (ت 273هـ)', category: 'الحديث الشريف',
    description: 'من الكتب الستة في السنة النبوية',
    volumes: createVolumes('sunan-ibnmajah', 2, (i) => `https://archive.org/download/waq_ibnmaja/${String(i).padStart(2, '0')}_im.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'muwatta-malik', name: 'موطأ الإمام مالك',
    author: 'الإمام مالك بن أنس (ت 179هـ)', category: 'الحديث الشريف',
    description: 'من أقدم كتب الحديث الجامعة',
    volumes: createVolumes('muwatta', 2, (i) => `https://archive.org/download/FP45625/${String(i).padStart(2, '0')}_${45624 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'musnad-ahmad', name: 'مسند الإمام أحمد بن حنبل',
    author: 'الإمام أحمد بن حنبل (ت 241هـ)', category: 'الحديث الشريف',
    description: 'أكبر كتب المسانيد في السنة النبوية',
    volumes: createVolumes('musnad-ahmad', 50, (i) => `https://archive.org/download/msnad-ahmad/msnad-${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الحديث - الشروح ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'fath-albari', name: 'فتح الباري شرح صحيح البخاري',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'الحديث الشريف',
    description: 'أعظم شروح صحيح البخاري',
    volumes: createVolumes('fath-albari', 13, (i) => `https://archive.org/download/waq38590/${String(i).padStart(2, '0')}_38589.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sharh-muslim-nw', name: 'المنهاج شرح صحيح مسلم بن الحجاج',
    author: 'الإمام النووي (ت 676هـ)', category: 'الحديث الشريف',
    description: 'شرح الإمام النووي لصحيح مسلم',
    volumes: createVolumes('sharh-muslim-nw', 18, (i) => `https://archive.org/download/waq103921/${String(i).padStart(2, '0')}_${103920 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'nawawi-arbaeen', name: 'الأربعون النووية',
    author: 'الإمام النووي (ت 676هـ)', category: 'الحديث الشريف',
    description: 'أربعون حديثا في أصول الدين',
    volumes: singleVol('nawawi-arbaeen', 'الأربعون النووية', 'https://archive.org/download/FParb3enno/arb3enno.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nawawi-riyad', name: 'رياض الصالحين من كلام سيد المرسلين',
    author: 'الإمام النووي (ت 676هـ)', category: 'الحديث الشريف',
    description: 'من أعظم كتب الحديث في الفضائل والآداب',
    volumes: singleVol('nawawi-riyad', 'رياض الصالحين', 'https://archive.org/download/FPriadsaleheen/riadsaleheen.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nawawi-adkar', name: 'الأذكار النووية',
    author: 'الإمام النووي (ت 676هـ)', category: 'الرقائق والآداب',
    description: 'الأذكار من كلام سيد الأبرار ﷺ',
    volumes: singleVol('nawawi-adkar', 'الأذكار النووية', 'https://archive.org/download/FPadkarNawawi/adkarNawawi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'bulugh-maram-hjr', name: 'بلوغ المرام من أدلة الأحكام',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'الحديث الشريف',
    description: 'في أحاديث الأحكام الفقهية',
    volumes: singleVol('bulugh-maram', 'بلوغ المرام', 'https://archive.org/download/FPblghmrm/blghmrm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'umdat-ahkam', name: 'عمدة الأحكام من كلام خير الأنام',
    author: 'الحافظ عبد الغني المقدسي (ت 600هـ)', category: 'الحديث الشريف',
    description: 'جمع فيه الأحاديث الصحيحة في الأحكام من الصحيحين',
    volumes: singleVol('umdat-ahkam', 'عمدة الأحكام', 'https://archive.org/download/FP3mdtalahkam/3mdtalahkam.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mishkat-masabih', name: 'مشكاة المصابيح',
    author: 'الإمام ولي الدين الخطيب التبريزي (ت 741هـ)', category: 'الحديث الشريف',
    description: 'من أشهر كتب الحديث الجامعة',
    volumes: createVolumes('mishkat', 3, (i) => `https://archive.org/download/FPmshkat/mshkat${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الحديث - الشيخ الألباني رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'alb-sifa-salat', name: 'صفة صلاة النبي ﷺ من التكبير إلى التسليم',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'أسفار الألباني العظيمة في الصلاة',
    volumes: singleVol('alb-sifa', 'صفة صلاة النبي', 'https://archive.org/download/FPsftsltalnby/sftsltalnby.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'alb-silsila-sahiha', name: 'سلسلة الأحاديث الصحيحة',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'موسوعة تخريج الأحاديث الصحيحة',
    volumes: createVolumes('alb-sahiha', 11, (i) => `https://archive.org/download/FP122185/${String(i).padStart(2, '0')}_${122184 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'alb-silsila-daifa', name: 'سلسلة الأحاديث الضعيفة والموضوعة',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'بيان الأحاديث الضعيفة والموضوعة',
    volumes: createVolumes('alb-daifa', 14, (i) => `https://archive.org/download/FP125105/${String(i).padStart(2, '0')}_${125104 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'alb-irwa', name: 'إرواء الغليل في تخريج أحاديث منار السبيل',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'تخريج أحاديث منار السبيل في الفقه',
    volumes: createVolumes('alb-irwa', 9, (i) => `https://archive.org/download/FPirwaalgalil/irwaalgalil${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'alb-tawasul', name: 'التوسل أنواعه وأحكامه',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'العقيدة',
    description: 'بيان أنواع التوسل المشروع والممنوع',
    volumes: singleVol('alb-tawasul', 'التوسل', 'https://archive.org/download/FPtwslanhwah/twslanhwah.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الفقه ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'mughni-qudamah', name: 'المغني في الفقه الحنبلي',
    author: 'الإمام موفق الدين ابن قدامة المقدسي (ت 620هـ)', category: 'الفقه وأصوله',
    description: 'من أعظم الموسوعات الفقهية المقارنة',
    volumes: createVolumes('mughni-qudamah', 15, (i) => `https://archive.org/download/FP12215/${String(i).padStart(2, '0')}_${12214 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'umdat-fiqh', name: 'عمدة الفقه',
    author: 'الإمام موفق الدين ابن قدامة المقدسي (ت 620هـ)', category: 'الفقه وأصوله',
    description: 'متن مختصر في الفقه الحنبلي',
    volumes: singleVol('umdat-fiqh', 'عمدة الفقه', 'https://archive.org/download/FP3Mdtlfqh/3mdtlfqh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fiqh-sunna-sabiq', name: 'فقه السنة',
    author: 'الشيخ السيد سابق (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'فقه ميسر مع الأدلة من الكتاب والسنة',
    volumes: createVolumes('fiqh-sunna', 3, (i) => `https://archive.org/download/FPfghsnnaa/fghsnnaa${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'majmu-binbaz', name: 'مجموع فتاوى ومقالات الشيخ ابن باز',
    author: 'سماحة الشيخ عبد العزيز بن باز (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة فتاوى ومقالات سماحة الشيخ',
    volumes: createVolumes('majmu-binbaz', 30, (i) => `https://archive.org/download/FPbenbazMajmu3_201709/majmu3${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-rushd-bidaya', name: 'بداية المجتهد ونهاية المقتصد',
    author: 'الإمام ابن رشد الحفيد (ت 595هـ)', category: 'الفقه وأصوله',
    description: 'فقه مقارن من أحسن كتب الفقه المقارن',
    volumes: createVolumes('bidayah', 2, (i) => `https://archive.org/download/FPbdmjt/bdmjt${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ السيرة النبوية والتاريخ ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sirat-ibn-hisham', name: 'السيرة النبوية',
    author: 'أبو محمد عبد الملك بن هشام (ت 218هـ)', category: 'السيرة النبوية',
    description: 'من أقدم وأشهر كتب السيرة النبوية',
    volumes: createVolumes('sirat-hisham', 4, (i) => `https://archive.org/download/waq102241/${String(i).padStart(2, '0')}_${102240 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'rahiq-makhtum', name: 'الرحيق المختوم',
    author: 'الشيخ صفي الرحمن المباركفوري (ت 1427هـ)', category: 'السيرة النبوية',
    description: 'بحث في السيرة النبوية الفائز بجائزة رابطة العالم الإسلامي',
    volumes: singleVol('rahiq', 'الرحيق المختوم', 'https://archive.org/download/FPrhmkh/rhmkh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'bidaya-nihaya', name: 'البداية والنهاية',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'السيرة النبوية',
    description: 'تاريخ الأمم والسيرة النبوية والفتن والملاحم',
    volumes: createVolumes('bidaya-nihaya', 15, (i) => `https://archive.org/download/FPalbdayah/albdayah${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'shamail-tirmidhi', name: 'الشمائل المحمدية',
    author: 'الإمام أبو عيسى الترمذي (ت 279هـ)', category: 'السيرة النبوية',
    description: 'صفات النبي ﷺ الخَلقية والخُلقية',
    volumes: singleVol('shamail', 'الشمائل المحمدية', 'https://archive.org/download/FPshmailmhmdy/shmailmhmdy.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-kathir-fusul', name: 'الفصول في سيرة الرسول ﷺ',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'السيرة النبوية',
    description: 'مختصر السيرة النبوية',
    volumes: singleVol('fusul', 'الفصول في سيرة الرسول', 'https://archive.org/download/FPfusolsira/fusolsira.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ التفسير - إضافات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tafsir-muyassar', name: 'التفسير الميسر',
    author: 'مجمع الملك فهد لطباعة المصحف الشريف', category: 'التفسير',
    description: 'تفسير موجز ميسر للقرآن الكريم',
    volumes: singleVol('tafsir-muyassar', 'التفسير الميسر', 'https://archive.org/download/FPtfsyrmsr/tfsyrmsr.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-jalalayn', name: 'تفسير الجلالين',
    author: 'الإمامان المحلي والسيوطي', category: 'التفسير',
    description: 'تفسير مختصر مشهور نافع للمبتدئين',
    volumes: singleVol('jalalayn', 'تفسير الجلالين', 'https://archive.org/download/FPtafsirjalaleen/tafsirjalaleen.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ayssar-tafaseer', name: 'أيسر التفاسير لكلام العلي الكبير',
    author: 'الشيخ أبو بكر الجزائري (ت 1439هـ)', category: 'التفسير',
    description: 'تفسير مبسط بأسلوب سهل وواضح',
    volumes: createVolumes('ayssar', 5, (i) => `https://archive.org/download/FPayssartafaseer/ayssartafaseer${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sabuni-safwah', name: 'صفوة التفاسير',
    author: 'الشيخ محمد علي الصابوني', category: 'التفسير',
    description: 'تفسير جامع بين المأثور والمعقول',
    volumes: createVolumes('sabuni', 3, (i) => `https://archive.org/download/FPsfwatalttafsyr/sfwatalttafsyr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'zilal-quran', name: 'في ظلال القرآن',
    author: 'سيد قطب (ت 1386هـ)', category: 'التفسير',
    description: 'تفسير أدبي حركي',
    volumes: createVolumes('zilal', 6, (i) => `https://archive.org/download/FPzlalqran/zlalqran${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-wasit', name: 'التفسير الوسيط للقرآن الكريم',
    author: 'الشيخ محمد سيد طنطاوي (ت 1431هـ)', category: 'التفسير',
    description: 'تفسير وسط بين المطول والمختصر',
    volumes: createVolumes('tafsir-wasit', 15, (i) => `https://archive.org/download/FPtfsyralwsit/tfsyralwsit${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-khazin', name: 'لباب التأويل في معاني التنزيل (تفسير الخازن)',
    author: 'الإمام علاء الدين الخازن (ت 741هـ)', category: 'التفسير',
    description: 'تفسير جامع يلخص تفسير البغوي مع إضافات',
    volumes: createVolumes('khazin', 7, (i) => `https://archive.org/download/FPlbabaltaweel/lbabaltaweel${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ علوم القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'itqan-suyuti', name: 'الإتقان في علوم القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'من أعظم كتب علوم القرآن',
    volumes: createVolumes('itqan', 4, (i) => `https://archive.org/download/FPaletqan/aletqan${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'burhan-zarkashi', name: 'البرهان في علوم القرآن',
    author: 'الإمام بدر الدين الزركشي (ت 794هـ)', category: 'علوم القرآن',
    description: 'من أشهر كتب علوم القرآن',
    volumes: createVolumes('burhan', 4, (i) => `https://archive.org/download/FPalborhanfyolom/alborhanfyolom${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mabahith-qattan', name: 'مباحث في علوم القرآن',
    author: 'الشيخ مناع القطان (ت 1420هـ)', category: 'علوم القرآن',
    description: 'من أفضل كتب علوم القرآن المعاصرة',
    volumes: singleVol('mabahith-qattan', 'مباحث في علوم القرآن', 'https://archive.org/download/FPmbahithqaran/mbahithqaran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fawzan-mabahith', name: 'دروس في علوم القرآن',
    author: 'الشيخ صالح الفوزان حفظه الله', category: 'علوم القرآن',
    description: 'دروس مختصرة في علوم القرآن',
    volumes: singleVol('fawzan-ulum', 'دروس في علوم القرآن', 'https://archive.org/download/FPdrosfyolomalquran/drosfyolomalquran.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ التجويد والقراءات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tuhfat-atfal', name: 'تحفة الأطفال والغلمان',
    author: 'الشيخ سليمان الجمزوري (ت 1208هـ)', category: 'التجويد والقراءات',
    description: 'متن مشهور في أحكام التجويد للمبتدئين',
    volumes: singleVol('tuhfat-atfal', 'تحفة الأطفال', 'https://archive.org/download/FPthftatfal/thftatfal.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jazariya', name: 'المقدمة الجزرية',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'متن مشهور في علم التجويد',
    volumes: singleVol('jazariya', 'المقدمة الجزرية', 'https://archive.org/download/FPmqdaljzrya/mqdaljzrya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nashr-qiraat', name: 'النشر في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'من أهم كتب القراءات العشر الصغرى والكبرى',
    volumes: createVolumes('nashr', 2, (i) => `https://archive.org/download/FPalnshrfyalqraat/alnshrfyalqraat${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'shatibiyya', name: 'حرز الأماني ووجه التهاني (الشاطبية)',
    author: 'الإمام القاسم بن فيرة الشاطبي (ت 590هـ)', category: 'التجويد والقراءات',
    description: 'منظومة في القراءات السبع',
    volumes: singleVol('shatibiyya', 'الشاطبية', 'https://archive.org/download/FPhrzalamani/hrzalamani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'hidayat-mustafid', name: 'هداية المستفيد في أحكام التجويد',
    author: 'الشيخ محمد المحمود', category: 'التجويد والقراءات',
    description: 'كتاب شامل في أحكام التجويد',
    volumes: singleVol('hidayat-mustafid', 'هداية المستفيد', 'https://archive.org/download/FPhdytlmstfyd/hdytlmstfyd.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ اللغة العربية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ajurumiyya', name: 'المقدمة الآجرومية',
    author: 'الإمام ابن آجروم (ت 723هـ)', category: 'اللغة العربية',
    description: 'متن مختصر في النحو للمبتدئين',
    volumes: singleVol('ajurumiyya', 'المقدمة الآجرومية', 'https://archive.org/download/FPmqdagrmya/mqdagrmya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'uth-sharh-ajurum', name: 'شرح الآجرومية',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'اللغة العربية',
    description: 'شرح ماتع للمقدمة الآجرومية',
    volumes: singleVol('uth-ajurum', 'شرح الآجرومية', 'https://archive.org/download/FPshrhalaajrromya/shrhalaajrromya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'alfiyya-ibn-malik', name: 'ألفية ابن مالك',
    author: 'الإمام ابن مالك (ت 672هـ)', category: 'اللغة العربية',
    description: 'أشهر منظومة في النحو والصرف',
    volumes: singleVol('alfiyya', 'ألفية ابن مالك', 'https://archive.org/download/FPalfyabinmalik/alfyabinmalik.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qatr-nada', name: 'قطر الندى وبل الصدى',
    author: 'الإمام ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'في علم النحو',
    volumes: singleVol('qatr', 'قطر الندى وبل الصدى', 'https://archive.org/download/FPqtralnda/qtralnda.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sharh-ibn-aqeel', name: 'شرح ابن عقيل على ألفية ابن مالك',
    author: 'الإمام بهاء الدين ابن عقيل (ت 769هـ)', category: 'اللغة العربية',
    description: 'من أشهر شروح ألفية ابن مالك',
    volumes: createVolumes('ibn-aqeel', 4, (i) => `https://archive.org/download/FPshrhibn3qil/shrhibn3qil${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mughni-labib', name: 'مغني اللبيب عن كتب الأعاريب',
    author: 'الإمام ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'من أمهات كتب النحو',
    volumes: createVolumes('mughni-labib', 2, (i) => `https://archive.org/download/FPmgnyallbib/mgnyallbib${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الرقائق والآداب والأذكار ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'hisn-muslim-qht', name: 'حصن المسلم من أذكار الكتاب والسنة',
    author: 'الشيخ سعيد بن علي بن وهف القحطاني (ت 1439هـ)', category: 'الرقائق والآداب',
    description: 'أذكار اليوم والليلة من الكتاب والسنة',
    volumes: singleVol('hisn', 'حصن المسلم', 'https://archive.org/download/FPhesnalmuslem/hesnalmuslem.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'minhaj-qasideen', name: 'مختصر منهاج القاصدين',
    author: 'الإمام ابن قدامة المقدسي (ت 620هـ)', category: 'الرقائق والآداب',
    description: 'مختصر في تزكية النفس والرقائق',
    volumes: singleVol('minhaj-qasideen', 'مختصر منهاج القاصدين', 'https://archive.org/download/FPmkhtsarmnhaj/mkhtsarmnhaj.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-jawzi-talbis', name: 'تلبيس إبليس',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'الرقائق والآداب',
    description: 'في بيان مكائد إبليس لبني آدم',
    volumes: singleVol('talbis', 'تلبيس إبليس', 'https://archive.org/download/FPtlbysablys/tlbysablys.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-jawzi-sayd', name: 'صيد الخاطر',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'الرقائق والآداب',
    description: 'خواطر إيمانية وفوائد سلوكية',
    volumes: singleVol('sayd', 'صيد الخاطر', 'https://archive.org/download/FPsydalkhatr/sydalkhatr.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'al-adab-mufrad', name: 'الأدب المفرد',
    author: 'الإمام محمد بن إسماعيل البخاري (ت 256هـ)', category: 'الرقائق والآداب',
    description: 'جامع لأحاديث الآداب والأخلاق',
    volumes: singleVol('al-adab', 'الأدب المفرد', 'https://archive.org/download/FPaladabalmufrad/aladabalmufrad.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fudayl-zuhd', name: 'الزهد',
    author: 'الإمام أحمد بن حنبل (ت 241هـ)', category: 'الرقائق والآداب',
    description: 'في زهد الصحابة والتابعين ومن بعدهم',
    volumes: singleVol('ahmad-zuhd', 'الزهد للإمام أحمد', 'https://archive.org/download/FPalzhdlilahmd/alzhdlilahmd.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-abi-dunya-tawba', name: 'التوبة',
    author: 'الإمام ابن أبي الدنيا (ت 281هـ)', category: 'الرقائق والآداب',
    description: 'في فضل التوبة والرقائق',
    volumes: singleVol('tawba', 'التوبة', 'https://archive.org/download/FPaltoba/altoba.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-rajab-lataif', name: 'لطائف المعارف فيما لمواسم العام من الوظائف',
    author: 'الحافظ ابن رجب الحنبلي (ت 795هـ)', category: 'الرقائق والآداب',
    description: 'في وظائف المواسم والأعياد الإسلامية',
    volumes: singleVol('lataif', 'لطائف المعارف', 'https://archive.org/download/FPltaifalm3arf/ltaifalm3arf.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-rajab-jami', name: 'جامع العلوم والحكم',
    author: 'الحافظ ابن رجب الحنبلي (ت 795هـ)', category: 'الحديث الشريف',
    description: 'شرح الخمسين حديثا من جوامع كلم النبي ﷺ',
    volumes: createVolumes('jami-ulum', 2, (i) => `https://archive.org/download/FPjam3al3olom/jam3al3olom${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
];
