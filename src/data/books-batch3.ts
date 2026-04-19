// ============================================
// ADDITIONAL ISLAMIC BOOKS - BATCH 3
// كتب إضافية - الدفعة الثالثة - كتب معاصرة وتراثية
// ============================================

import type { BookCollection, BookVolume } from './books';

function createVolumes(baseId: string, count: number, urlPattern: (i: number) => string): BookVolume[] {
  const arabicNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
    'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون'];

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

export const additionalBooksBatch3: BookCollection[] = [
  // ══════════════════════════════════════════════════════════════
  // ██ كتب ابن القيم رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-ighatha-lhf', name: 'إغاثة اللهفان من مصايد الشيطان',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'في مكائد الشيطان وكيفية الحذر منها',
    volumes: createVolumes('b3-ighatha', 2, (i) => `https://archive.org/download/WAQ6301/${String(i).padStart(2, '0')}_6301.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-jawab-kafi', name: 'الجواب الكافي لمن سأل عن الدواء الشافي',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'المعروف بـ الداء والدواء',
    volumes: singleVol('b3-jawab', 'الجواب الكافي', 'https://archive.org/download/FPaljawabalkafi/aljawabalkafi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-tariq-hijratayn', name: 'طريق الهجرتين وباب السعادتين',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'من أنفس كتب التربية والسلوك',
    volumes: singleVol('b3-tariq', 'طريق الهجرتين', 'https://archive.org/download/FPtariqalhijratayn/tariqalhijratayn.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-rouh', name: 'الروح',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في أحوال الأرواح والنفوس',
    volumes: singleVol('b3-rouh', 'الروح لابن القيم', 'https://archive.org/download/FPalrouh/alrouh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-hadi-arwah', name: 'حادي الأرواح إلى بلاد الأفراح',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في وصف الجنة وأهلها',
    volumes: singleVol('b3-hadi', 'حادي الأرواح', 'https://archive.org/download/FPhadialarwah/hadialarwah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-shifaa-alil', name: 'شفاء العليل في مسائل القضاء والقدر والحكمة والتعليل',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في مسائل القضاء والقدر',
    volumes: singleVol('b3-shifaa', 'شفاء العليل', 'https://archive.org/download/FPshifaalalil/shifaalalil.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-miftah-dar', name: 'مفتاح دار السعادة',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'في فضل العلم وأدبه',
    volumes: createVolumes('b3-miftah', 2, (i) => `https://archive.org/download/WAQ7351/${String(i).padStart(2, '0')}_7351.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-ilam-muwaqqiin', name: 'إعلام الموقعين عن رب العالمين',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الفقه وأصوله',
    description: 'في أصول الفتوى والأحكام',
    volumes: createVolumes('b3-ilam', 4, (i) => `https://archive.org/download/WAQ6601/${String(i).padStart(2, '0')}_6601.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-sawaiq', name: 'الصواعق المرسلة على الجهمية والمعطلة',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في الرد على الجهمية والمعطلة',
    volumes: createVolumes('b3-sawaiq', 4, (i) => `https://archive.org/download/WAQ20511/${String(i).padStart(2, '0')}_20511.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب شيخ الإسلام ابن تيمية - إضافات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-majmu-fatawa-tay', name: 'مجموع فتاوى شيخ الإسلام ابن تيمية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'الفقه وأصوله',
    description: 'أكبر موسوعة علمية في التراث الإسلامي',
    volumes: createVolumes('b3-mjm-tay', 20, (i) => `https://archive.org/download/WAQ58751/${String(i).padStart(2, '0')}_58751.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-sarm-maslul', name: 'الصارم المسلول على شاتم الرسول',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في حكم شاتم النبي ﷺ',
    volumes: createVolumes('b3-sarm', 3, (i) => `https://archive.org/download/WAQ36971/${String(i).padStart(2, '0')}_36971.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-ubudiyya', name: 'العبودية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'رسالة في حقيقة العبودية لله',
    volumes: singleVol('b3-ubudiyya', 'العبودية', 'https://archive.org/download/FPaloboodiyya/aloboodiyya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-furqan', name: 'الفرقان بين أولياء الرحمن وأولياء الشيطان',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في الفرق بين الأولياء الصادقين والكاذبين',
    volumes: singleVol('b3-furqan', 'الفرقان', 'https://archive.org/download/FPalforkan/alforkan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-qaidah-jaleela', name: 'قاعدة جليلة في التوسل والوسيلة',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في أنواع التوسل المشروع والممنوع',
    volumes: singleVol('b3-qaidah', 'قاعدة جليلة في التوسل', 'https://archive.org/download/FPqaidajalila/qaidajalila.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب السلف - أئمة أهل السنة ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-usul-sunnah-ahmad', name: 'أصول السنة',
    author: 'الإمام أحمد بن حنبل (ت 241هـ)', category: 'العقيدة',
    description: 'رسالة مختصرة في عقيدة أهل السنة',
    volumes: singleVol('b3-usul-sunnah', 'أصول السنة للإمام أحمد', 'https://archive.org/download/FPusulsunnahahmad/usulsunnahahmad.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-sunnah-khallal', name: 'السنة',
    author: 'الإمام أبو بكر الخلال (ت 311هـ)', category: 'العقيدة',
    description: 'موسوعة في عقيدة السلف',
    volumes: createVolumes('b3-sunnah-kh', 5, (i) => `https://archive.org/download/WAQ108051/${String(i).padStart(2, '0')}_108051.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-sunnah-abdullah', name: 'السنة',
    author: 'الإمام عبد الله بن الإمام أحمد (ت 290هـ)', category: 'العقيدة',
    description: 'في إثبات الصفات الإلهية',
    volumes: createVolumes('b3-sunnah-ab', 2, (i) => `https://archive.org/download/WAQ37091/${String(i).padStart(2, '0')}_37091.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-sharh-usul-lalaka', name: 'شرح أصول اعتقاد أهل السنة والجماعة',
    author: 'الإمام اللالكائي (ت 418هـ)', category: 'العقيدة',
    description: 'من أشهر كتب عقيدة أهل السنة',
    volumes: createVolumes('b3-lalaka', 9, (i) => `https://archive.org/download/WAQ16001/${String(i).padStart(2, '0')}_16001.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-ibana-ashari', name: 'الإبانة عن أصول الديانة',
    author: 'الإمام أبو الحسن الأشعري (ت 324هـ)', category: 'العقيدة',
    description: 'الكتاب الذي رجع فيه أبو الحسن الأشعري إلى مذهب السلف',
    volumes: singleVol('b3-ibana-ash', 'الإبانة', 'https://archive.org/download/FPalibana_ashari/alibana_ashari.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-shara-sunnah-baghawi', name: 'شرح السنة',
    author: 'الإمام البغوي (ت 516هـ)', category: 'الحديث الشريف',
    description: 'من أمهات كتب الحديث والفقه',
    volumes: createVolumes('b3-sharh-sun', 15, (i) => `https://archive.org/download/WAQ35711/${String(i).padStart(2, '0')}_35711.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الحافظ ابن كثير ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-bidaya-nihaya-full', name: 'البداية والنهاية',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'السيرة النبوية',
    description: 'موسوعة في التاريخ الإسلامي والفتن وأشراط الساعة',
    volumes: createVolumes('b3-bidaya-full', 20, (i) => `https://archive.org/download/WAQ69691/${String(i).padStart(2, '0')}_69691.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-jami-masanid', name: 'جامع المسانيد والسنن',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'الحديث الشريف',
    description: 'جمع فيه بين المسانيد والسنن',
    volumes: createVolumes('b3-jami-mas', 10, (i) => `https://archive.org/download/WAQ23211/${String(i).padStart(2, '0')}_23211.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الحافظ الذهبي ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-tarikh-islam', name: 'تاريخ الإسلام ووفيات المشاهير والأعلام',
    author: 'الحافظ الذهبي (ت 748هـ)', category: 'السيرة النبوية',
    description: 'موسوعة في التاريخ الإسلامي',
    volumes: createVolumes('b3-tarikh-is', 15, (i) => `https://archive.org/download/WAQ21491/${String(i).padStart(2, '0')}_21491.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-mizan-itidal', name: 'ميزان الاعتدال في نقد الرجال',
    author: 'الحافظ الذهبي (ت 748هـ)', category: 'الحديث الشريف',
    description: 'من أهم كتب الجرح والتعديل',
    volumes: createVolumes('b3-mizan', 4, (i) => `https://archive.org/download/WAQ19571/${String(i).padStart(2, '0')}_19571.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-kabair-dhahabi', name: 'الكبائر',
    author: 'الحافظ الذهبي (ت 748هـ)', category: 'الرقائق والآداب',
    description: 'في ذكر كبائر الذنوب والتحذير منها',
    volumes: singleVol('b3-kabair', 'الكبائر', 'https://archive.org/download/FPalkabaer/alkabaer.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب العلماء المعاصرين الثقات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-fatawa-lajna', name: 'فتاوى اللجنة الدائمة للبحوث العلمية والإفتاء',
    author: 'اللجنة الدائمة (برئاسة ابن باز)', category: 'الفقه وأصوله',
    description: 'فتاوى علمية معتمدة',
    volumes: createVolumes('b3-lajna', 25, (i) => `https://archive.org/download/WAQ124521/${String(i).padStart(2, '0')}_124521.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-silsilah-ahadeeth-alb', name: 'صحيح سنن أبي داود',
    author: 'الشيخ الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'تحقيق وتخريج أحاديث سنن أبي داود',
    volumes: createVolumes('b3-sah-abi-d', 3, (i) => `https://archive.org/download/WAQ24001/${String(i).padStart(2, '0')}_24001.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-sah-ibn-majah', name: 'صحيح سنن ابن ماجه',
    author: 'الشيخ الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'تحقيق وتخريج أحاديث سنن ابن ماجه',
    volumes: createVolumes('b3-sah-imj', 2, (i) => `https://archive.org/download/WAQ23991/${String(i).padStart(2, '0')}_23991.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-sah-tirmidhi', name: 'صحيح سنن الترمذي',
    author: 'الشيخ الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'تحقيق وتخريج أحاديث سنن الترمذي',
    volumes: createVolumes('b3-sah-tir', 3, (i) => `https://archive.org/download/WAQ23981/${String(i).padStart(2, '0')}_23981.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب في الآداب والأخلاق ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-adab-dunya-deen', name: 'أدب الدنيا والدين',
    author: 'الإمام أبو الحسن الماوردي (ت 450هـ)', category: 'الرقائق والآداب',
    description: 'من أنفس كتب الآداب',
    volumes: singleVol('b3-adab-dun', 'أدب الدنيا والدين', 'https://archive.org/download/FPadabaldunya/adabaldunya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-moukni-ahkam', name: 'المقنع في أصول الأحكام',
    author: 'الإمام ابن قدامة المقدسي (ت 620هـ)', category: 'الفقه وأصوله',
    description: 'متن شهير في الفقه الحنبلي',
    volumes: singleVol('b3-moukni', 'المقنع', 'https://archive.org/download/FPalmoukni/almoukni.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-kitab-hiyal', name: 'إبطال الحيل',
    author: 'الإمام ابن بطة العكبري (ت 387هـ)', category: 'الفقه وأصوله',
    description: 'في إبطال الحيل الشرعية',
    volumes: singleVol('b3-ibtal-hiyal', 'إبطال الحيل', 'https://archive.org/download/FPibtalalhiyal/ibtalalhiyal.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب متنوعة ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-muhalla-ibn-hazm', name: 'المحلى بالآثار',
    author: 'الإمام ابن حزم الظاهري (ت 456هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة فقهية كبيرة',
    volumes: createVolumes('b3-muhalla', 12, (i) => `https://archive.org/download/WAQ48571/${String(i).padStart(2, '0')}_48571.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-ihkam-ibn-hazm', name: 'الإحكام في أصول الأحكام',
    author: 'الإمام ابن حزم الظاهري (ت 456هـ)', category: 'الفقه وأصوله',
    description: 'في أصول الفقه على منهج الظاهرية',
    volumes: createVolumes('b3-ihkam', 4, (i) => `https://archive.org/download/WAQ59181/${String(i).padStart(2, '0')}_59181.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-mustasfa-ghazali', name: 'المستصفى من علم الأصول',
    author: 'الإمام الغزالي (ت 505هـ)', category: 'الفقه وأصوله',
    description: 'من أهم كتب أصول الفقه',
    volumes: createVolumes('b3-mustasfa', 2, (i) => `https://archive.org/download/WAQ26591/${String(i).padStart(2, '0')}_26591.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-ahkam-quran-jassas', name: 'أحكام القرآن',
    author: 'الإمام أبو بكر الجصاص (ت 370هـ)', category: 'التفسير',
    description: 'من أهم كتب أحكام القرآن',
    volumes: createVolumes('b3-ahkam-jas', 5, (i) => `https://archive.org/download/WAQ88711/${String(i).padStart(2, '0')}_88711.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-ahkam-quran-arabi', name: 'أحكام القرآن',
    author: 'الإمام أبو بكر بن العربي (ت 543هـ)', category: 'التفسير',
    description: 'كتاب نفيس في أحكام القرآن',
    volumes: createVolumes('b3-ahkam-ar', 4, (i) => `https://archive.org/download/WAQ93751/${String(i).padStart(2, '0')}_93751.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ رسائل نافعة ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-fatawa-ibn-baz-maj', name: 'فتاوى نور على الدرب',
    author: 'الشيخ ابن باز (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'مجموعة فتاوى من برنامج نور على الدرب',
    volumes: createVolumes('b3-nur-darb', 10, (i) => `https://archive.org/download/WAQ113731/${String(i).padStart(2, '0')}_113731.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-al-shafaa', name: 'الشفا بتعريف حقوق المصطفى',
    author: 'القاضي عياض (ت 544هـ)', category: 'السيرة النبوية',
    description: 'في بيان حقوق النبي ﷺ',
    volumes: createVolumes('b3-shifaa-qadi', 2, (i) => `https://archive.org/download/WAQ91461/${String(i).padStart(2, '0')}_91461.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-al-amm', name: 'العلو للعلي الغفار',
    author: 'الحافظ الذهبي (ت 748هـ)', category: 'العقيدة',
    description: 'في إثبات علو الله',
    volumes: singleVol('b3-al-amm', 'العلو', 'https://archive.org/download/FPalulofor/alulofor.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-arsh', name: 'العرش',
    author: 'الحافظ الذهبي (ت 748هـ)', category: 'العقيدة',
    description: 'في إثبات العرش واستواء الله عليه',
    volumes: createVolumes('b3-arsh', 2, (i) => `https://archive.org/download/WAQ22441/${String(i).padStart(2, '0')}_22441.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-asmaa-sifat', name: 'الأسماء والصفات',
    author: 'الإمام البيهقي (ت 458هـ)', category: 'العقيدة',
    description: 'في إثبات الأسماء والصفات على منهج السلف',
    volumes: createVolumes('b3-asmaa-sif', 2, (i) => `https://archive.org/download/WAQ74291/${String(i).padStart(2, '0')}_74291.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب التفسير الميسر ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-tafsir-ruh', name: 'روح المعاني في تفسير القرآن العظيم',
    author: 'الإمام محمود الألوسي (ت 1270هـ)', category: 'التفسير',
    description: 'من أضخم كتب التفسير',
    volumes: createVolumes('b3-ruh-mani', 16, (i) => `https://archive.org/download/WAQ99471/${String(i).padStart(2, '0')}_99471.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-tahreer-tanweer', name: 'التحرير والتنوير',
    author: 'الإمام محمد الطاهر ابن عاشور (ت 1393هـ)', category: 'التفسير',
    description: 'تفسير يعتني بالبلاغة والفصاحة',
    volumes: createVolumes('b3-tahreer', 15, (i) => `https://archive.org/download/WAQ47791/${String(i).padStart(2, '0')}_47791.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-mokhtasar-ibn-kathir', name: 'صفوة التفاسير',
    author: 'الشيخ محمد علي الصابوني', category: 'التفسير',
    description: 'تفسير مختصر جامع',
    volumes: createVolumes('b3-safwat', 3, (i) => `https://archive.org/download/WAQ108871/${String(i).padStart(2, '0')}_108871.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب نافعة للعامة ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-reyad-quran', name: 'رياض القرآن',
    author: 'الشيخ محمد بن عبد الوهاب (ت 1206هـ)', category: 'التدبر',
    description: 'مختارات من آيات القرآن الكريم',
    volumes: singleVol('b3-reyad', 'رياض القرآن', 'https://archive.org/download/FPreyadalquran/reyadalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-mufid-tawheed', name: 'المفيد في مهمات التوحيد',
    author: 'د. عبد القادر السندي', category: 'العقيدة',
    description: 'مختصر نافع في التوحيد',
    volumes: singleVol('b3-mufid', 'المفيد في التوحيد', 'https://archive.org/download/FPalmofidftawhid/almofidftawhid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-tayseer-aziz-hameed', name: 'تيسير العزيز الحميد في شرح كتاب التوحيد',
    author: 'الشيخ سليمان بن عبد الله آل الشيخ (ت 1233هـ)', category: 'العقيدة',
    description: 'شرح كتاب التوحيد لجده الشيخ محمد بن عبد الوهاب',
    volumes: singleVol('b3-tayseer-az', 'تيسير العزيز الحميد', 'https://archive.org/download/FPtaysiralazizalhamid/taysiralazizalhamid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-durar-saniyya', name: 'الدرر السنية في الأجوبة النجدية',
    author: 'الشيخ عبد الرحمن بن قاسم (ت 1392هـ)', category: 'العقيدة',
    description: 'موسوعة علمية تضم مؤلفات أئمة الدعوة النجدية',
    volumes: createVolumes('b3-durar', 16, (i) => `https://archive.org/download/WAQ107341/${String(i).padStart(2, '0')}_107341.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب في تربية الأبناء ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-tuhfat-mawdud', name: 'تحفة المودود بأحكام المولود',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الفقه وأصوله',
    description: 'في تربية الأبناء وأحكام المولود',
    volumes: singleVol('b3-tuhfat-maw', 'تحفة المودود', 'https://archive.org/download/FPtuhfatalmawdud/tuhfatalmawdud.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب القرطبي ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-tadhkirat-qur', name: 'التذكرة في أحوال الموتى وأمور الآخرة',
    author: 'الإمام القرطبي (ت 671هـ)', category: 'العقيدة',
    description: 'في أحوال الموتى واليوم الآخر',
    volumes: createVolumes('b3-tadhkirat-q', 2, (i) => `https://archive.org/download/WAQ40151/${String(i).padStart(2, '0')}_40151.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب ابن رجب الحنبلي ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-ihkam-fath', name: 'فتح الباري بشرح صحيح البخاري',
    author: 'الحافظ ابن رجب الحنبلي (ت 795هـ)', category: 'الحديث الشريف',
    description: 'شرح صحيح البخاري (غير كامل)',
    volumes: createVolumes('b3-ihkam-fath', 10, (i) => `https://archive.org/download/WAQ48561/${String(i).padStart(2, '0')}_48561.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-tahwif', name: 'التخويف من النار والتعريف بحال دار البوار',
    author: 'الحافظ ابن رجب الحنبلي (ت 795هـ)', category: 'الرقائق والآداب',
    description: 'في التحذير من النار',
    volumes: singleVol('b3-tahwif', 'التخويف من النار', 'https://archive.org/download/FPaltakhweef/altakhweef.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-ghurbat-islam', name: 'كشف الكربة في وصف حال أهل الغربة',
    author: 'الحافظ ابن رجب الحنبلي (ت 795هـ)', category: 'الرقائق والآداب',
    description: 'في فضل الصحابة والغرباء',
    volumes: singleVol('b3-ghurba', 'كشف الكربة', 'https://archive.org/download/FPkashfalkurba/kashfalkurba.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب ابن تيمية الأخرى ══
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b3-talkhis', name: 'تلخيص كتاب الاستغاثة',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'الرد على البكري في الاستغاثة',
    volumes: createVolumes('b3-talkhis', 2, (i) => `https://archive.org/download/WAQ84901/${String(i).padStart(2, '0')}_84901.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b3-haql-nahi', name: 'الحسبة في الإسلام',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'الفقه وأصوله',
    description: 'في الأمر بالمعروف والنهي عن المنكر',
    volumes: singleVol('b3-hisba', 'الحسبة في الإسلام', 'https://archive.org/download/FPalhisba/alhisba.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b3-siyasa-shari', name: 'السياسة الشرعية في إصلاح الراعي والرعية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'الفقه وأصوله',
    description: 'في السياسة الشرعية والحكم الإسلامي',
    volumes: singleVol('b3-siyasa', 'السياسة الشرعية', 'https://archive.org/download/FPalsiyasa_alshariyya/alsiyasa_alshariyya.pdf'),
    isSingleVolume: true,
  },
];
