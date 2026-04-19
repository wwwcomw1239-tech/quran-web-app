// ============================================
// ADDITIONAL ISLAMIC BOOKS - BATCH 4
// كتب إضافية - الدفعة الرابعة - مكتبة أكبر وأشمل
// من كتب السلف وعلماء أهل السنة والجماعة
// ============================================

import type { BookCollection, BookVolume } from './books';

function createVolumes(baseId: string, count: number, urlPattern: (i: number) => string): BookVolume[] {
  const arabicNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
    'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون',
    'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون'];

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

export const additionalBooksBatch4: BookCollection[] = [
  // ══════════════════════════════════════════════════════════════
  // ██ كتب الشيخ محمد بن عبد الوهاب رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-usul-thalatha', name: 'الأصول الثلاثة وأدلتها',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'من أهم متون العقيدة للمبتدئين',
    volumes: singleVol('b4-usul-thalatha', 'الأصول الثلاثة', 'https://archive.org/download/FPalosoulalthalathah/alosoulalthalathah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-qawaid-arba', name: 'القواعد الأربع',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'رسالة مختصرة في معرفة الشرك وأنواعه',
    volumes: singleVol('b4-qawaid-arba', 'القواعد الأربع', 'https://archive.org/download/FPalqwaidalarbaa/alqwaidalarbaa.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-kashf-shubuhat', name: 'كشف الشبهات',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'في كشف شبهات المشركين',
    volumes: singleVol('b4-kashf-shubuhat', 'كشف الشبهات', 'https://archive.org/download/FPkashfalshobohat/kashfalshobohat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-masail-jahiliyya', name: 'مسائل الجاهلية',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'المسائل التي خالف فيها رسول الله ﷺ أهل الجاهلية',
    volumes: singleVol('b4-masail-jahiliyya', 'مسائل الجاهلية', 'https://archive.org/download/FPmasailaljahiliah/masailaljahiliah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-mufid-mustafid', name: 'مفيد المستفيد في كفر تارك التوحيد',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    volumes: singleVol('b4-mufid-mustafid', 'مفيد المستفيد', 'https://archive.org/download/FPmofidalmostafid/mofidalmostafid.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الشيخ ابن باز رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-majmou-bin-baz', name: 'مجموع فتاوى ومقالات الشيخ ابن باز',
    author: 'الشيخ عبد العزيز بن باز (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'مجموع فتاوى سماحة الشيخ ابن باز رحمه الله',
    volumes: createVolumes('b4-binbaz', 12, (i) => `https://archive.org/download/WAQ50201/${String(i).padStart(2, '0')}_50201.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-aqida-sahiha', name: 'العقيدة الصحيحة وما يضادها',
    author: 'الشيخ عبد العزيز بن باز (ت 1420هـ)', category: 'العقيدة',
    description: 'رسالة مختصرة في العقيدة',
    volumes: singleVol('b4-aqida-sahiha', 'العقيدة الصحيحة', 'https://archive.org/download/FPalaqidahalsahiha/alaqidahalsahiha.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-duroos-muhimma', name: 'الدروس المهمة لعامة الأمة',
    author: 'الشيخ عبد العزيز بن باز (ت 1420هـ)', category: 'العقيدة',
    description: 'دروس مختصرة ضرورية لكل مسلم',
    volumes: singleVol('b4-duroos-muhimma', 'الدروس المهمة', 'https://archive.org/download/FPaldoroosalmohimmah/aldoroosalmohimmah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-wujub-tahkim', name: 'وجوب تحكيم شرع الله',
    author: 'الشيخ عبد العزيز بن باز (ت 1420هـ)', category: 'العقيدة',
    volumes: singleVol('b4-wujub-tahkim', 'وجوب تحكيم شرع الله', 'https://archive.org/download/FPwjobtahkimshara/wjobtahkimshara.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-tuhfat-ikhwan', name: 'تحفة الإخوان بأجوبة مهمة تتعلق بأركان الإسلام',
    author: 'الشيخ عبد العزيز بن باز (ت 1420هـ)', category: 'الفقه وأصوله',
    volumes: singleVol('b4-tuhfat-ikhwan', 'تحفة الإخوان', 'https://archive.org/download/FPtohfatalekhwan/tohfatalekhwan.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الشيخ الألباني رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-sifat-salah', name: 'صفة صلاة النبي صلى الله عليه وسلم',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'من التكبير إلى التسليم كأنك تراها',
    volumes: singleVol('b4-sifat-salah', 'صفة صلاة النبي', 'https://archive.org/download/FPsifatsalatelnabi/sifatsalatelnabi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-asl-sifat-salah', name: 'أصل صفة صلاة النبي صلى الله عليه وسلم',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'النسخة المطولة من صفة الصلاة',
    volumes: createVolumes('b4-asl-sifat', 3, (i) => `https://archive.org/download/WAQ118071/${String(i).padStart(2, '0')}_118071.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-ahkam-janaiz', name: 'أحكام الجنائز وبدعها',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    volumes: singleVol('b4-ahkam-janaiz', 'أحكام الجنائز', 'https://archive.org/download/FPahkamjanaiz/ahkamjanaiz.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-tamamul-minna', name: 'تمام المنة في التعليق على فقه السنة',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    volumes: singleVol('b4-tamamul-minna', 'تمام المنة', 'https://archive.org/download/FPtmamalminnah/tmamalminnah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-irwa-ghalil', name: 'إرواء الغليل في تخريج أحاديث منار السبيل',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'تخريج مفصل لأحاديث منار السبيل',
    volumes: createVolumes('b4-irwa', 9, (i) => `https://archive.org/download/WAQ8001/${String(i).padStart(2, '0')}_8001.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-silsila-sahiha', name: 'السلسلة الصحيحة',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'سلسلة الأحاديث الصحيحة',
    volumes: createVolumes('b4-sahiha', 7, (i) => `https://archive.org/download/WAQ109301/${String(i).padStart(2, '0')}_109301.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-silsila-daifa', name: 'السلسلة الضعيفة',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    description: 'سلسلة الأحاديث الضعيفة والموضوعة',
    volumes: createVolumes('b4-daifa', 14, (i) => `https://archive.org/download/WAQ109311/${String(i).padStart(2, '0')}_109311.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-sahih-targhib', name: 'صحيح الترغيب والترهيب',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الحديث الشريف',
    volumes: createVolumes('b4-s-targhib', 3, (i) => `https://archive.org/download/WAQ109321/${String(i).padStart(2, '0')}_109321.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-manzila-sunna', name: 'منزلة السنة في الإسلام',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'العقيدة',
    volumes: singleVol('b4-manzila-sunna', 'منزلة السنة في الإسلام', 'https://archive.org/download/FPmanzilatalsunnah/manzilatalsunnah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-hijab-muslima', name: 'حجاب المرأة المسلمة في الكتاب والسنة',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    volumes: singleVol('b4-hijab', 'حجاب المرأة المسلمة', 'https://archive.org/download/FPhijabalmra/hijabalmra.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الشيخ ابن عثيمين رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-sharh-mumti', name: 'الشرح الممتع على زاد المستقنع',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    description: 'من أنفس شروح الفقه الحنبلي',
    volumes: createVolumes('b4-mumti', 15, (i) => `https://archive.org/download/WAQ107851/${String(i).padStart(2, '0')}_107851.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-majmou-uthaymeen', name: 'مجموع فتاوى ورسائل ابن عثيمين',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    volumes: createVolumes('b4-mj-uth', 26, (i) => `https://archive.org/download/WAQ129221/${String(i).padStart(2, '0')}_129221.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-sharh-aqida-wasitiyya', name: 'شرح العقيدة الواسطية',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    volumes: createVolumes('b4-wasitiyya-uth', 2, (i) => `https://archive.org/download/WAQ11841/${String(i).padStart(2, '0')}_11841.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-sharh-usul-iman', name: 'شرح أصول الإيمان',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    volumes: singleVol('b4-usul-iman', 'شرح أصول الإيمان', 'https://archive.org/download/FPsharhoosoulaleman/sharhoosoulaleman.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-sharh-qawaid-muthla', name: 'القواعد المثلى في صفات الله وأسمائه الحسنى',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    volumes: singleVol('b4-qawaid-muthla', 'القواعد المثلى', 'https://archive.org/download/FPalqwaidalmothla/alqwaidalmothla.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-fatawa-aqida', name: 'فتاوى العقيدة',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    volumes: singleVol('b4-fatawa-aqida', 'فتاوى العقيدة', 'https://archive.org/download/FPftawaalaqida/ftawaalaqida.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-fatawa-arkan', name: 'فتاوى أركان الإسلام',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    volumes: singleVol('b4-fatawa-arkan', 'فتاوى أركان الإسلام', 'https://archive.org/download/FPftawa_arkan/ftawa_arkan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-usul-fiqh-uth', name: 'الأصول من علم الأصول',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    description: 'مختصر في أصول الفقه',
    volumes: singleVol('b4-usul-fiqh', 'الأصول من علم الأصول', 'https://archive.org/download/FPalosoulminelmalosoul/alosoulminelmalosoul.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-mustalah-hadith', name: 'مصطلح الحديث',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الحديث الشريف',
    volumes: singleVol('b4-mustalah', 'مصطلح الحديث', 'https://archive.org/download/FPmostalahalhadith/mostalahalhadith.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-sharh-arbaeen', name: 'شرح الأربعين النووية',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الحديث الشريف',
    volumes: singleVol('b4-sharh-arbaeen', 'شرح الأربعين النووية', 'https://archive.org/download/FPsharhalarbaeenalnawawiyah/sharhalarbaeenalnawawiyah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-sharh-riyad-uth', name: 'شرح رياض الصالحين للعثيمين',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الحديث الشريف',
    volumes: createVolumes('b4-riyad-uth', 6, (i) => `https://archive.org/download/WAQ29481/${String(i).padStart(2, '0')}_29481.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الشيخ صالح الفوزان حفظه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-aqeedah-tawheed', name: 'عقيدة التوحيد',
    author: 'الشيخ صالح الفوزان', category: 'العقيدة',
    volumes: singleVol('b4-aqeedah-tawheed', 'عقيدة التوحيد', 'https://archive.org/download/FPaqidatalthawheed/aqidatalthawheed.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-irshad-tawheed', name: 'إرشاد إلى صحيح الاعتقاد والرد على أهل الشرك والإلحاد',
    author: 'الشيخ صالح الفوزان', category: 'العقيدة',
    volumes: singleVol('b4-irshad', 'الإرشاد إلى صحيح الاعتقاد', 'https://archive.org/download/FPalershad/alershad.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-mulakhas-fiqh', name: 'الملخص الفقهي',
    author: 'الشيخ صالح الفوزان', category: 'الفقه وأصوله',
    description: 'ملخص شامل في الفقه',
    volumes: createVolumes('b4-mulakhas', 2, (i) => `https://archive.org/download/WAQ11291/${String(i).padStart(2, '0')}_11291.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-muntaqa-fatawa', name: 'المنتقى من فتاوى الفوزان',
    author: 'الشيخ صالح الفوزان', category: 'الفقه وأصوله',
    volumes: createVolumes('b4-muntaqa', 5, (i) => `https://archive.org/download/WAQ11311/${String(i).padStart(2, '0')}_11311.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-sharh-kitab-tawheed', name: 'شرح كتاب التوحيد (الفوزان)',
    author: 'الشيخ صالح الفوزان', category: 'العقيدة',
    description: 'إعانة المستفيد بشرح كتاب التوحيد',
    volumes: createVolumes('b4-s-tawheed', 2, (i) => `https://archive.org/download/WAQ107731/${String(i).padStart(2, '0')}_107731.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-sharh-usul-thalatha-fz', name: 'شرح الأصول الثلاثة (الفوزان)',
    author: 'الشيخ صالح الفوزان', category: 'العقيدة',
    volumes: singleVol('b4-sharh-u3-fz', 'شرح الأصول الثلاثة', 'https://archive.org/download/FPsharhosoulthlatha/sharhosoulthlatha.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب السيرة والتاريخ ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-rawd-unuf', name: 'الروض الأنف في شرح السيرة النبوية',
    author: 'السهيلي (ت 581هـ)', category: 'السيرة النبوية',
    volumes: createVolumes('b4-rawd', 7, (i) => `https://archive.org/download/WAQ78081/${String(i).padStart(2, '0')}_78081.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-sira-nabawiya-ibn-kathir', name: 'السيرة النبوية لابن كثير',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'السيرة النبوية',
    volumes: createVolumes('b4-sira-ibn-kathir', 4, (i) => `https://archive.org/download/WAQ24691/${String(i).padStart(2, '0')}_24691.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-tarikh-islam', name: 'تاريخ الإسلام للذهبي',
    author: 'الإمام الذهبي (ت 748هـ)', category: 'السيرة النبوية',
    volumes: createVolumes('b4-tarikh-islam', 15, (i) => `https://archive.org/download/WAQ69501/${String(i).padStart(2, '0')}_69501.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-fasl-khitab-sira', name: 'فقه السيرة',
    author: 'الشيخ محمد الغزالي', category: 'السيرة النبوية',
    description: 'بتخريج الشيخ الألباني',
    volumes: singleVol('b4-fasl-sira', 'فقه السيرة', 'https://archive.org/download/FPfiqhalseerah/fiqhalseerah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-hayat-sahaba', name: 'حياة الصحابة',
    author: 'محمد يوسف الكاندهلوي', category: 'السيرة النبوية',
    volumes: createVolumes('b4-hayat-sahaba', 4, (i) => `https://archive.org/download/WAQ9751/${String(i).padStart(2, '0')}_9751.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-suwar-sahaba', name: 'صور من حياة الصحابة',
    author: 'الدكتور عبد الرحمن رأفت الباشا', category: 'السيرة النبوية',
    volumes: singleVol('b4-suwar-sahaba', 'صور من حياة الصحابة', 'https://archive.org/download/FPsuwarminhayatalsahabah/suwarminhayatalsahabah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-khulafa-rashidoon', name: 'الخلفاء الراشدون',
    author: 'د. علي محمد الصلابي', category: 'السيرة النبوية',
    description: 'سيرة الخلفاء الأربعة بشكل مفصل',
    volumes: createVolumes('b4-khulafa', 4, (i) => `https://archive.org/download/WAQ114951/${String(i).padStart(2, '0')}_114951.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الإمام ابن تيمية رحمه الله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-iqtida-sirat', name: 'اقتضاء الصراط المستقيم لمخالفة أصحاب الجحيم',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    volumes: createVolumes('b4-iqtida', 2, (i) => `https://archive.org/download/WAQ67451/${String(i).padStart(2, '0')}_67451.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-minhaj-sunna', name: 'منهاج السنة النبوية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في الرد على الرافضة',
    volumes: createVolumes('b4-minhaj-sunna', 9, (i) => `https://archive.org/download/WAQ40631/${String(i).padStart(2, '0')}_40631.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-daraa-taarud', name: 'درء تعارض العقل والنقل',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    volumes: createVolumes('b4-daraa', 11, (i) => `https://archive.org/download/WAQ40251/${String(i).padStart(2, '0')}_40251.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-jawab-sahih', name: 'الجواب الصحيح لمن بدل دين المسيح',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    volumes: createVolumes('b4-jawab-sahih', 6, (i) => `https://archive.org/download/WAQ19251/${String(i).padStart(2, '0')}_19251.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-furqan-awliya', name: 'الفرقان بين أولياء الرحمن وأولياء الشيطان',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    volumes: singleVol('b4-furqan', 'الفرقان بين أولياء الرحمن', 'https://archive.org/download/FPalforqan/alforqan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-ubudiyya', name: 'العبودية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    volumes: singleVol('b4-ubudiyya', 'العبودية', 'https://archive.org/download/FPalobodiyah/alobodiyah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-risala-tadmuriyya', name: 'الرسالة التدمرية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    volumes: singleVol('b4-tadmuriyya', 'الرسالة التدمرية', 'https://archive.org/download/FPaltadmoriyah/altadmoriyah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-risala-hamawiyya', name: 'الفتوى الحموية الكبرى',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    volumes: singleVol('b4-hamawiyya', 'الفتوى الحموية الكبرى', 'https://archive.org/download/FPalhamawiyah/alhamawiyah.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب المتون العلمية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-usul-sitta', name: 'الأصول الستة',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    volumes: singleVol('b4-usul-sitta', 'الأصول الستة', 'https://archive.org/download/FPalosoolalsittah/alosoolalsittah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-nawaqid-islam', name: 'نواقض الإسلام',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    volumes: singleVol('b4-nawaqid', 'نواقض الإسلام', 'https://archive.org/download/FPnwaqidalislam/nwaqidalislam.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-aqida-barbahari', name: 'شرح السنة للبربهاري',
    author: 'الإمام البربهاري (ت 329هـ)', category: 'العقيدة',
    volumes: singleVol('b4-barbahari', 'شرح السنة', 'https://archive.org/download/FPsharhalsunnah_albarbahari/sharhalsunnah_albarbahari.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-usul-sunna-ahmad', name: 'أصول السنة للإمام أحمد',
    author: 'الإمام أحمد بن حنبل (ت 241هـ)', category: 'العقيدة',
    volumes: singleVol('b4-usul-sunna', 'أصول السنة', 'https://archive.org/download/FPosoolalsunnah_ahmad/osoolalsunnah_ahmad.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-sunna-khalal', name: 'السنة للخلال',
    author: 'أبو بكر الخلال (ت 311هـ)', category: 'العقيدة',
    volumes: createVolumes('b4-s-khalal', 3, (i) => `https://archive.org/download/WAQ70051/${String(i).padStart(2, '0')}_70051.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-sharh-usul-itiqad', name: 'شرح أصول اعتقاد أهل السنة والجماعة',
    author: 'الإمام اللالكائي (ت 418هـ)', category: 'العقيدة',
    volumes: createVolumes('b4-lalkai', 9, (i) => `https://archive.org/download/WAQ80151/${String(i).padStart(2, '0')}_80151.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-iban-kubra', name: 'الإبانة الكبرى لابن بطة',
    author: 'ابن بطة العكبري (ت 387هـ)', category: 'العقيدة',
    volumes: createVolumes('b4-ibana', 5, (i) => `https://archive.org/download/WAQ99801/${String(i).padStart(2, '0')}_99801.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-sharh-tahawiya', name: 'شرح العقيدة الطحاوية',
    author: 'الإمام ابن أبي العز الحنفي (ت 792هـ)', category: 'العقيدة',
    description: 'بتحقيق الأرنؤوط والتركي',
    volumes: createVolumes('b4-tahawiya', 2, (i) => `https://archive.org/download/WAQ67471/${String(i).padStart(2, '0')}_67471.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب التفسير الإضافية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-tafsir-baghawi', name: 'معالم التنزيل للبغوي',
    author: 'الإمام البغوي (ت 516هـ)', category: 'التفسير',
    volumes: createVolumes('b4-baghawi', 8, (i) => `https://archive.org/download/WAQ47281/${String(i).padStart(2, '0')}_47281.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-tafsir-bahr-muhit', name: 'البحر المحيط لأبي حيان',
    author: 'أبو حيان الأندلسي (ت 745هـ)', category: 'التفسير',
    volumes: createVolumes('b4-bahr', 8, (i) => `https://archive.org/download/WAQ35931/${String(i).padStart(2, '0')}_35931.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-mahasin-tanzil', name: 'محاسن التأويل للقاسمي',
    author: 'محمد جمال الدين القاسمي (ت 1332هـ)', category: 'التفسير',
    volumes: createVolumes('b4-qasimi', 10, (i) => `https://archive.org/download/WAQ75141/${String(i).padStart(2, '0')}_75141.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-tafsir-shinqiti', name: 'العذب النمير من مجالس الشنقيطي',
    author: 'الشيخ محمد الأمين الشنقيطي (ت 1393هـ)', category: 'التفسير',
    volumes: createVolumes('b4-adhb', 4, (i) => `https://archive.org/download/WAQ109411/${String(i).padStart(2, '0')}_109411.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-zubdat-tafsir', name: 'زبدة التفسير من فتح القدير',
    author: 'الشيخ محمد سليمان الأشقر', category: 'التفسير',
    description: 'اختصار تفسير الشوكاني',
    volumes: singleVol('b4-zubdat', 'زبدة التفسير', 'https://archive.org/download/FPzobdatalthafsir/zobdatalthafsir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-mukhtasar-tafsir', name: 'المختصر في التفسير',
    author: 'جماعة من علماء التفسير', category: 'التفسير',
    description: 'من إصدارات مركز تفسير للدراسات القرآنية',
    volumes: singleVol('b4-mukhtasar-tafsir', 'المختصر في التفسير', 'https://archive.org/download/FPalmokhtasarfialtafsir/almokhtasarfialtafsir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-tayseer-kareem', name: 'تيسير الكريم الرحمن في تفسير كلام المنان',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'التفسير',
    description: 'تفسير السعدي - طبعة مفاتيح الغيب',
    volumes: singleVol('b4-tayseer', 'تيسير الكريم الرحمن', 'https://archive.org/download/FPtaiseerkarimrahman/taiseerkarimrahman.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الحديث والشروح ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-fath-bari-ibn-rajab', name: 'فتح الباري لابن رجب',
    author: 'الحافظ ابن رجب الحنبلي (ت 795هـ)', category: 'الحديث الشريف',
    description: 'شرح ابن رجب على صحيح البخاري',
    volumes: createVolumes('b4-ibn-rajab-fath', 10, (i) => `https://archive.org/download/WAQ40991/${String(i).padStart(2, '0')}_40991.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-umda-qari', name: 'عمدة القاري شرح صحيح البخاري',
    author: 'بدر الدين العيني (ت 855هـ)', category: 'الحديث الشريف',
    volumes: createVolumes('b4-umda', 25, (i) => `https://archive.org/download/WAQ14301/${String(i).padStart(2, '0')}_14301.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-mirqat-mafatih', name: 'مرقاة المفاتيح شرح مشكاة المصابيح',
    author: 'الملا علي القاري (ت 1014هـ)', category: 'الحديث الشريف',
    volumes: createVolumes('b4-mirqat', 10, (i) => `https://archive.org/download/WAQ49101/${String(i).padStart(2, '0')}_49101.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-tuhfat-ahwadhi', name: 'تحفة الأحوذي بشرح جامع الترمذي',
    author: 'المباركفوري (ت 1353هـ)', category: 'الحديث الشريف',
    volumes: createVolumes('b4-ahwadhi', 10, (i) => `https://archive.org/download/WAQ34181/${String(i).padStart(2, '0')}_34181.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-awn-maabud', name: 'عون المعبود شرح سنن أبي داود',
    author: 'العظيم آبادي', category: 'الحديث الشريف',
    volumes: createVolumes('b4-awn', 14, (i) => `https://archive.org/download/WAQ33071/${String(i).padStart(2, '0')}_33071.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-mustadrak', name: 'المستدرك على الصحيحين',
    author: 'الحاكم النيسابوري (ت 405هـ)', category: 'الحديث الشريف',
    volumes: createVolumes('b4-mustadrak', 5, (i) => `https://archive.org/download/WAQ14111/${String(i).padStart(2, '0')}_14111.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-musnad-shafii', name: 'مسند الإمام الشافعي',
    author: 'الإمام الشافعي (ت 204هـ)', category: 'الحديث الشريف',
    volumes: singleVol('b4-shafii', 'مسند الشافعي', 'https://archive.org/download/FPmosnadalshafie/mosnadalshafie.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-bulugh-maram-shrh', name: 'سبل السلام شرح بلوغ المرام',
    author: 'الإمام الصنعاني (ت 1182هـ)', category: 'الحديث الشريف',
    volumes: createVolumes('b4-subul', 4, (i) => `https://archive.org/download/WAQ68921/${String(i).padStart(2, '0')}_68921.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-nayl-awtar', name: 'نيل الأوطار شرح منتقى الأخبار',
    author: 'الإمام الشوكاني (ت 1250هـ)', category: 'الحديث الشريف',
    volumes: createVolumes('b4-nayl', 8, (i) => `https://archive.org/download/WAQ24601/${String(i).padStart(2, '0')}_24601.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-jamii-ulum-hikam', name: 'جامع العلوم والحكم',
    author: 'الحافظ ابن رجب الحنبلي (ت 795هـ)', category: 'الحديث الشريف',
    description: 'شرح خمسين حديثا من جوامع الكلم',
    volumes: createVolumes('b4-jami-ulum', 2, (i) => `https://archive.org/download/WAQ11801/${String(i).padStart(2, '0')}_11801.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الرقائق والآداب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-riyad-salihin', name: 'رياض الصالحين',
    author: 'الإمام النووي (ت 676هـ)', category: 'الرقائق والآداب',
    description: 'المشهور بين طلبة العلم والمبتدئين',
    volumes: singleVol('b4-riyad', 'رياض الصالحين', 'https://archive.org/download/FPriyadhalsaliheen/riyadhalsaliheen.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-adab-mufrad', name: 'الأدب المفرد',
    author: 'الإمام البخاري (ت 256هـ)', category: 'الرقائق والآداب',
    description: 'في الآداب النبوية',
    volumes: singleVol('b4-adab-mufrad', 'الأدب المفرد', 'https://archive.org/download/FPaladabalmofrad/aladabalmofrad.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-iqtida-ilm', name: 'اقتضاء العلم العمل',
    author: 'الخطيب البغدادي (ت 463هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-iqtida-ilm', 'اقتضاء العلم العمل', 'https://archive.org/download/FPiqtidaalilmalamal/iqtidaalilmalamal.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-jami-bayan-ilm', name: 'جامع بيان العلم وفضله',
    author: 'ابن عبد البر (ت 463هـ)', category: 'الرقائق والآداب',
    volumes: createVolumes('b4-jami-bayan', 2, (i) => `https://archive.org/download/WAQ56471/${String(i).padStart(2, '0')}_56471.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-hilyat-talib', name: 'حلية طالب العلم',
    author: 'الشيخ بكر أبو زيد (ت 1429هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-hilyat', 'حلية طالب العلم', 'https://archive.org/download/FPhilyatalib/hilyatalib.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-mujib-da', name: 'مجيب الداعي',
    author: 'ابن الجوزي (ت 597هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-mujib', 'مجيب الداعي', 'https://archive.org/download/FPmojibaldaei/mojibaldaei.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-talbis-iblis', name: 'تلبيس إبليس',
    author: 'ابن الجوزي (ت 597هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-talbis', 'تلبيس إبليس', 'https://archive.org/download/FPtalbisiblis/talbisiblis.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-sayd-khater', name: 'صيد الخاطر',
    author: 'ابن الجوزي (ت 597هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-sayd', 'صيد الخاطر', 'https://archive.org/download/FPsaydalkhater/saydalkhater.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-tadhkira', name: 'التذكرة في أحوال الموتى وأمور الآخرة',
    author: 'الإمام القرطبي (ت 671هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-tadhkira', 'التذكرة', 'https://archive.org/download/FPaltadhkirah/altadhkirah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-mukhtasar-minhaj', name: 'مختصر منهاج القاصدين',
    author: 'ابن قدامة المقدسي (ت 620هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-mukhtasar-minhaj', 'مختصر منهاج القاصدين', 'https://archive.org/download/FPmokhtasarminhajalqasideen/mokhtasarminhajalqasideen.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-raqaiq-ibn-qayyim', name: 'الفوائد',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-fawaid', 'الفوائد لابن القيم', 'https://archive.org/download/FPalfawaid_ibnalqayim/alfawaid_ibnalqayim.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-uddat-sabirin', name: 'عدة الصابرين وذخيرة الشاكرين',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-uddat', 'عدة الصابرين', 'https://archive.org/download/FPoddatalsabereen/oddatalsabereen.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب علوم القرآن والتجويد ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-burhan-zarkashi', name: 'البرهان في علوم القرآن',
    author: 'الإمام الزركشي (ت 794هـ)', category: 'علوم القرآن',
    volumes: createVolumes('b4-burhan', 4, (i) => `https://archive.org/download/WAQ10911/${String(i).padStart(2, '0')}_10911.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-nashr-qiraat', name: 'النشر في القراءات العشر',
    author: 'ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    volumes: createVolumes('b4-nashr', 2, (i) => `https://archive.org/download/WAQ34641/${String(i).padStart(2, '0')}_34641.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-tayseer-dani', name: 'التيسير في القراءات السبع',
    author: 'الإمام الداني (ت 444هـ)', category: 'التجويد والقراءات',
    volumes: singleVol('b4-tayseer-qiraat', 'التيسير', 'https://archive.org/download/FPaltayseer_aldani/altayseer_aldani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-hirz-amani', name: 'حرز الأماني ووجه التهاني (الشاطبية)',
    author: 'الإمام الشاطبي (ت 590هـ)', category: 'التجويد والقراءات',
    description: 'متن الشاطبية في القراءات السبع',
    volumes: singleVol('b4-shatibiyya', 'حرز الأماني', 'https://archive.org/download/FPalshatibiyah/alshatibiyah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-muqaddima-jazariyya', name: 'متن المقدمة الجزرية',
    author: 'ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    volumes: singleVol('b4-jazariyya', 'المقدمة الجزرية', 'https://archive.org/download/FPalmoqadimahaljazariyah/almoqadimahaljazariyah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-ghayat-muneyah', name: 'غاية المريد في علم التجويد',
    author: 'الشيخ عطية قابل نصر', category: 'التجويد والقراءات',
    volumes: singleVol('b4-ghayat', 'غاية المريد في التجويد', 'https://archive.org/download/FPghayatalmoreed/ghayatalmoreed.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-fasail-quran', name: 'فضائل القرآن لابن كثير',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'علوم القرآن',
    volumes: singleVol('b4-fadail-quran', 'فضائل القرآن', 'https://archive.org/download/FPfadailalquran_ibnkathir/fadailalquran_ibnkathir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-tibyan-nawawi', name: 'التبيان في آداب حملة القرآن',
    author: 'الإمام النووي (ت 676هـ)', category: 'علوم القرآن',
    volumes: singleVol('b4-tibyan', 'التبيان في آداب حملة القرآن', 'https://archive.org/download/FPaltibyan_nawawi/altibyan_nawawi.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب اللغة العربية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-lisan-arab', name: 'لسان العرب',
    author: 'ابن منظور (ت 711هـ)', category: 'اللغة العربية',
    description: 'أشهر معاجم اللغة العربية',
    volumes: createVolumes('b4-lisan', 15, (i) => `https://archive.org/download/WAQ40061/${String(i).padStart(2, '0')}_40061.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-qamus-muhit', name: 'القاموس المحيط',
    author: 'الفيروزآبادي (ت 817هـ)', category: 'اللغة العربية',
    volumes: createVolumes('b4-qamus', 4, (i) => `https://archive.org/download/WAQ62781/${String(i).padStart(2, '0')}_62781.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-sihah', name: 'الصحاح في اللغة',
    author: 'الجوهري (ت 393هـ)', category: 'اللغة العربية',
    volumes: createVolumes('b4-sihah', 6, (i) => `https://archive.org/download/WAQ56491/${String(i).padStart(2, '0')}_56491.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-misbah-munir', name: 'المصباح المنير في غريب الشرح الكبير',
    author: 'الفيومي (ت 770هـ)', category: 'اللغة العربية',
    volumes: singleVol('b4-misbah', 'المصباح المنير', 'https://archive.org/download/FPalmisbahalmonir/almisbahalmonir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-sharh-ibn-aqil', name: 'شرح ابن عقيل على ألفية ابن مالك',
    author: 'ابن عقيل (ت 769هـ)', category: 'اللغة العربية',
    volumes: createVolumes('b4-ibn-aqil', 4, (i) => `https://archive.org/download/WAQ11401/${String(i).padStart(2, '0')}_11401.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-nahw-wadih', name: 'النحو الواضح',
    author: 'علي الجارم ومصطفى أمين', category: 'اللغة العربية',
    description: 'في قواعد اللغة العربية',
    volumes: createVolumes('b4-nahw-wadih', 3, (i) => `https://archive.org/download/WAQ116071/${String(i).padStart(2, '0')}_116071.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-jami-duroos', name: 'جامع الدروس العربية',
    author: 'مصطفى الغلاييني', category: 'اللغة العربية',
    volumes: createVolumes('b4-ghalayini', 3, (i) => `https://archive.org/download/WAQ12771/${String(i).padStart(2, '0')}_12771.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الدعوة والمنهج ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-wujub-luzum', name: 'وجوب لزوم الجماعة',
    author: 'د. جمال بن أحمد بادي', category: 'العقيدة',
    volumes: singleVol('b4-wujub-luzum', 'وجوب لزوم الجماعة', 'https://archive.org/download/FPwjobluzomaljamaah/wjobluzomaljamaah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-limadha-salafi', name: 'لماذا اخترت المنهج السلفي',
    author: 'الشيخ سليم الهلالي', category: 'العقيدة',
    volumes: singleVol('b4-limadha-salafi', 'لماذا اخترت المنهج السلفي', 'https://archive.org/download/FPlimadhakhtaratalmanhajalsalafi/limadhakhtaratalmanhajalsalafi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-manhaj-anbiya', name: 'منهج الأنبياء في الدعوة إلى الله',
    author: 'الشيخ ربيع بن هادي المدخلي', category: 'العقيدة',
    volumes: singleVol('b4-manhaj-anbiya', 'منهج الأنبياء في الدعوة إلى الله', 'https://archive.org/download/FPmanhajalanbia/manhajalanbia.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-tarbiyah-islamiya', name: 'التربية الإسلامية',
    author: 'جماعة من العلماء', category: 'الرقائق والآداب',
    volumes: singleVol('b4-tarbiyah', 'التربية الإسلامية', 'https://archive.org/download/FPaltarbiyahalislamiyah/altarbiyahalislamiyah.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب تزكية النفس ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-sair-hathithah', name: 'السير الحثيث إلى توضيح شرح الحديث',
    author: 'مجموعة من الباحثين', category: 'الحديث الشريف',
    volumes: singleVol('b4-sair-hathithah', 'السير الحثيث', 'https://archive.org/download/FPalsayralhathith/alsayralhathith.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-aham-ghafil', name: 'أهم المهمات لتعليم الصلاة والطهارة',
    author: 'الشيخ عبد العزيز بن باز', category: 'الفقه وأصوله',
    volumes: singleVol('b4-aham', 'أهم المهمات', 'https://archive.org/download/FPahammalmohimmat/ahammalmohimmat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-waqafat-tarbawiya', name: 'وقفات تربوية في ضوء القرآن الكريم',
    author: 'د. أحمد فريد', category: 'الرقائق والآداب',
    volumes: singleVol('b4-waqafat', 'وقفات تربوية', 'https://archive.org/download/FPwaqafaattarbawiyyah/waqafaattarbawiyyah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-dalil-mumin', name: 'دليل المؤمن الحزين إلى جنة رب العالمين',
    author: 'مجدي السيد إبراهيم', category: 'الرقائق والآداب',
    volumes: singleVol('b4-dalil-mumin', 'دليل المؤمن الحزين', 'https://archive.org/download/FPdalilalmoumin/dalilalmoumin.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-lataif-maarif', name: 'لطائف المعارف فيما لمواسم العام من الوظائف',
    author: 'الحافظ ابن رجب الحنبلي (ت 795هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-lataif', 'لطائف المعارف', 'https://archive.org/download/FPlataifalmaarif/lataifalmaarif.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-ilal-hadith', name: 'العلل لابن أبي حاتم',
    author: 'ابن أبي حاتم الرازي (ت 327هـ)', category: 'الحديث الشريف',
    volumes: createVolumes('b4-ilal', 2, (i) => `https://archive.org/download/WAQ99771/${String(i).padStart(2, '0')}_99771.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-mandhumat-bayquniyya', name: 'متن المنظومة البيقونية',
    author: 'عمر بن محمد البيقوني (ت 1080هـ)', category: 'الحديث الشريف',
    volumes: singleVol('b4-bayquniyya', 'المنظومة البيقونية', 'https://archive.org/download/FPalmanzomahalbayquniya/almanzomahalbayquniya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-nukhbat-fikr', name: 'نخبة الفكر في مصطلح أهل الأثر',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'الحديث الشريف',
    volumes: singleVol('b4-nukhbat', 'نخبة الفكر', 'https://archive.org/download/FPnokhbatalfikr/nokhbatalfikr.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-nuzhat-nazar', name: 'نزهة النظر شرح نخبة الفكر',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'الحديث الشريف',
    volumes: singleVol('b4-nuzhat', 'نزهة النظر', 'https://archive.org/download/FPnozhatalnazar/nozhatalnazar.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب معاصرة نافعة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-hisnu-muslim', name: 'حصن المسلم من أذكار الكتاب والسنة',
    author: 'د. سعيد بن علي بن وهف القحطاني', category: 'الرقائق والآداب',
    description: 'مختصر للأذكار اليومية',
    volumes: singleVol('b4-hisnu-muslim', 'حصن المسلم', 'https://archive.org/download/FPhisnalmoslim/hisnalmoslim.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-adhkar-nawawi', name: 'الأذكار للنووي',
    author: 'الإمام النووي (ت 676هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-adhkar-nawawi', 'الأذكار', 'https://archive.org/download/FPadhkaralnawawi/adhkaralnawawi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-wabil-sayyib', name: 'الوابل الصيب من الكلم الطيب',
    author: 'الإمام ابن قيم الجوزية (ت 751هـ)', category: 'الرقائق والآداب',
    description: 'في فضل الذكر',
    volumes: singleVol('b4-wabil', 'الوابل الصيب', 'https://archive.org/download/FPalwabilalsayib/alwabilalsayib.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-kalim-tayyib', name: 'الكلم الطيب',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'الرقائق والآداب',
    description: 'من الأذكار والأوراد - بتحقيق الألباني',
    volumes: singleVol('b4-kalim', 'الكلم الطيب', 'https://archive.org/download/FPalkalimaltayib/alkalimaltayib.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-amal-yawm-layla', name: 'عمل اليوم والليلة',
    author: 'الإمام النسائي (ت 303هـ)', category: 'الرقائق والآداب',
    volumes: singleVol('b4-amal-yawm', 'عمل اليوم والليلة', 'https://archive.org/download/FPamalalyawm/amalalyawm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-shama-muhammadiya', name: 'الشمائل المحمدية',
    author: 'الإمام الترمذي (ت 279هـ)', category: 'السيرة النبوية',
    description: 'في صفات النبي ﷺ الخلقية والخلقية',
    volumes: singleVol('b4-shamail', 'الشمائل المحمدية', 'https://archive.org/download/FPalshamailalmohammadiyah/alshamailalmohammadiyah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-zad-maad-mukhtasar', name: 'مختصر زاد المعاد',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'السيرة النبوية',
    description: 'اختصار زاد المعاد لابن القيم',
    volumes: singleVol('b4-zad-mukh', 'مختصر زاد المعاد', 'https://archive.org/download/FPmokhtasarzadalmaad/mokhtasarzadalmaad.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ كتب الفقه الإضافية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'b4-fiqh-sunna', name: 'فقه السنة',
    author: 'السيد سابق', category: 'الفقه وأصوله',
    description: 'مع تعليقات الشيخ الألباني',
    volumes: createVolumes('b4-fiqh-sunnah', 3, (i) => `https://archive.org/download/WAQ11461/${String(i).padStart(2, '0')}_11461.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-fiqh-muyassar', name: 'الفقه الميسر في ضوء الكتاب والسنة',
    author: 'نخبة من العلماء', category: 'الفقه وأصوله',
    volumes: singleVol('b4-muyassar', 'الفقه الميسر', 'https://archive.org/download/FPalfiqhalmoyasar/alfiqhalmoyasar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'b4-sharh-bulugh', name: 'توضيح الأحكام من بلوغ المرام',
    author: 'الشيخ عبد الله البسام', category: 'الفقه وأصوله',
    volumes: createVolumes('b4-tawdih', 7, (i) => `https://archive.org/download/WAQ43141/${String(i).padStart(2, '0')}_43141.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-bidaya-mujtahid', name: 'بداية المجتهد ونهاية المقتصد',
    author: 'ابن رشد الحفيد (ت 595هـ)', category: 'الفقه وأصوله',
    volumes: createVolumes('b4-bidaya', 4, (i) => `https://archive.org/download/WAQ12711/${String(i).padStart(2, '0')}_12711.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'b4-mawsua-fiqhiyya', name: 'الموسوعة الفقهية الكويتية (أجزاء مختارة)',
    author: 'وزارة الأوقاف الكويتية', category: 'الفقه وأصوله',
    description: 'مرجع فقهي جامع',
    volumes: createVolumes('b4-mawsua', 10, (i) => `https://archive.org/download/WAQ100551/${String(i).padStart(2, '0')}_100551.pdf`),
    isSingleVolume: false,
  },
];
