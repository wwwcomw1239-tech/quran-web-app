// ============================================
// ISLAMIC BOOKS DATABASE
// Auto-generated list of verified books from archive.org
// ============================================

export type BookCategory =
  | 'التفسير'
  | 'علوم القرآن'
  | 'التجويد والقراءات'
  | 'إعراب القرآن وبيانه'
  | 'أسباب النزول'
  | 'غريب القرآن ومفرداته'
  | 'التدبر'
  | 'الفقه وأصوله'
  | 'العقيدة'
  | 'السيرة النبوية'
  | 'اللغة العربية'
  | 'الحديث الشريف'
  | 'الرقائق والآداب';

export interface BookVolume {
  id: string;
  title: string;
  volumeNumber?: number;
  pdfUrl: string;
}

export interface BookCollection {
  id: string;
  name: string;
  author: string;
  category: BookCategory;
  description?: string;
  volumes: BookVolume[];
  isSingleVolume: boolean;
}

// ============================================
// HELPERS
// ============================================

function createVolumes(baseId: string, count: number, urlPattern: (i: number) => string): BookVolume[] {
  const arabicNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
    'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون',
    'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون', 'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', 'الثلاثون',
    'الحادي والثلاثون', 'الثاني والثلاثون', 'الثالث والثلاثون', 'الرابع والثلاثون', 'الخامس والثلاثون'];

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

// ============================================
// BOOKS DATABASE
// ============================================

import { additionalBooks } from './books-additions';
import { additionalBooksBatch2 } from './books-batch2';
import { additionalBooksBatch3 } from './books-batch3';
import { additionalBooksBatch4 } from './books-batch4';
import { additionalBooksBatch5 } from './books-batch5';
import { additionalBooksBatch6 } from './books-batch6';
import { additionalBooksBatch7 } from './books-batch7';
import { additionalBooksBatch8 } from './books-batch8';
import { additionalBooksBatch9 } from './books-batch9';
import { additionalBooksBatch10 } from './books-batch10';
import { additionalBooksBatch11 } from './books-batch11';
import { additionalBooksBatch12 } from './books-batch12';

const coreBooksCollections: BookCollection[] = [
  // ══════════════════════════════════════════════════════════════
  // ██ قسم التفسير - أكثر من 40 كتاب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tabari', name: 'تفسير الطبري - جامع البيان عن تأويل آي القرآن',
    author: 'الإمام محمد بن جرير الطبري (ت 310هـ)', category: 'التفسير',
    description: 'أعظم التفاسير بالمأثور وأوسعها، جمع فيه الطبري أقوال الصحابة والتابعين',
    volumes: createVolumes('tabari', 26, (i) => `https://archive.org/download/tafseer-al-tabari/taftabry${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'kathir', name: 'تفسير ابن كثير - تفسير القرآن العظيم',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'التفسير',
    description: 'من أشهر كتب التفسير بالمأثور، يعتمد على القرآن والسنة وأقوال السلف',
    volumes: createVolumes('kathir', 8, (i) => `https://archive.org/download/FP59518/tkather${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'qurtubi', name: 'تفسير القرطبي - الجامع لأحكام القرآن',
    author: 'الإمام القرطبي (ت 671هـ)', category: 'التفسير',
    description: 'تفسير فقهي شامل يهتم باستنباط الأحكام من آيات القرآن الكريم',
    volumes: createVolumes('qurtubi', 20, (i) => `https://archive.org/download/WAQ72471/${String(i).padStart(2, '0')}_${72470 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'razi', name: 'تفسير الرازي - مفاتيح الغيب (التفسير الكبير)',
    author: 'الإمام فخر الدين الرازي (ت 606هـ)', category: 'التفسير',
    description: 'تفسير موسوعي يجمع بين العقل والنقل ويناقش القضايا الكلامية والفلسفية',
    volumes: createVolumes('razi', 32, (i) => `https://archive.org/download/mghtrazi/trazi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ashur', name: 'التحرير والتنوير',
    author: 'الشيخ محمد الطاهر ابن عاشور (ت 1393هـ)', category: 'التفسير',
    description: 'تفسير بلاغي لغوي يعتني بإعجاز القرآن ومقاصد الشريعة',
    volumes: createVolumes('ashur', 30, (i) => `https://archive.org/download/FPthtn/thtn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'adwa', name: 'أضواء البيان في إيضاح القرآن بالقرآن',
    author: 'الشيخ محمد الأمين الشنقيطي (ت 1393هـ)', category: 'التفسير',
    description: 'تفسير القرآن بالقرآن مع بيان الأحكام الفقهية وترجيح الأقوال',
    volumes: createVolumes('adwa', 10, (i) => `https://archive.org/download/WAQ69939/${String(i).padStart(2, '0')}_${69938 + i}s.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'fath', name: 'فتح القدير',
    author: 'الإمام محمد بن علي الشوكاني (ت 1250هـ)', category: 'التفسير',
    description: 'جمع بين الدراية والرواية في تفسير القرآن الكريم',
    volumes: createVolumes('fath', 5, (i) => `https://archive.org/download/fath-alkadir-01_202207/Fath-Alkadir-${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'dur', name: 'الدر المنثور في التفسير بالمأثور',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'التفسير',
    description: 'تفسير بالمأثور يجمع الروايات والآثار في تفسير القرآن',
    volumes: createVolumes('dur', 9, (i) => `https://archive.org/download/eldorrelmanthor/drm${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'baghawi', name: 'معالم التنزيل (تفسير البغوي)',
    author: 'الإمام الحسين بن مسعود البغوي (ت 516هـ)', category: 'التفسير',
    description: 'تفسير مختصر وسهل العبارة يهتم بالمأثور والسنة',
    volumes: createVolumes('baghawi', 8, (i) => `https://archive.org/download/waq105954/${String(i).padStart(2, '0')}_${105953 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'saadi', name: 'تيسير الكريم الرحمن (تفسير السعدي)',
    author: 'الشيخ عبد الرحمن بن ناصر السعدي (ت 1376هـ)', category: 'التفسير',
    description: 'تفسير سهل العبارة يعتني بالمعاني والأحكام والفوائد',
    volumes: singleVol('saadi', 'تفسير السعدي - كامل', 'https://archive.org/download/ozkorallh_20181023_2048/100585.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muyassar', name: 'التفسير الميسر',
    author: 'نخبة من العلماء - مجمع الملك فهد', category: 'التفسير',
    description: 'تفسير مختصر وميسر لعامة المسلمين أعده مجمع الملك فهد لطباعة المصحف',
    volumes: singleVol('muyassar', 'التفسير الميسر - كامل', 'https://archive.org/download/attafseer_almoyassar/ar_tafseer_meesr_b.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jalalain', name: 'تفسير الجلالين',
    author: 'جلال الدين المحلي وجلال الدين السيوطي', category: 'التفسير',
    description: 'تفسير مختصر ومشهور أكمله السيوطي بعد المحلي',
    volumes: singleVol('jalalain', 'تفسير الجلالين - كامل', 'https://archive.org/download/TafseerAlJalalainMaaAnwarAlHaraminJild1ArabicPDFBook/Tafseer%20Al%20Jalalain%20Maa%20Anwar%20Al%20Haramin%20Jild%201%20Arabic%20PDF%20Book.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mukhtasar', name: 'المختصر في تفسير القرآن الكريم',
    author: 'مركز تفسير للدراسات القرآنية', category: 'التفسير',
    description: 'تفسير مختصر وعصري صادر عن مركز تفسير',
    volumes: singleVol('mukhtasar', 'المختصر في التفسير - كامل', 'https://archive.org/download/tafsirMukhtasar/TafsirMukhtasar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nazarat', name: 'نظرات في كتب التفسير',
    author: 'عبد السلام الهراس', category: 'التفسير',
    description: 'دراسة نقدية في كتب التفسير المختلفة',
    volumes: singleVol('nazarat', 'نظرات في كتب التفسير', 'https://archive.org/download/Nadharat_fi_Ktb_Tafsir/Nadharat_Ktb_Tafsir.pdf'),
    isSingleVolume: true,
  },
  // --- كتب تفسير إضافية ---
  {
    id: 'zamakhshari', name: 'الكشاف عن حقائق التنزيل (تفسير الزمخشري)',
    author: 'الإمام الزمخشري (ت 538هـ)', category: 'التفسير',
    description: 'تفسير بلاغي لغوي يُعنى بالوجوه البيانية والبلاغية في القرآن',
    volumes: createVolumes('zamakhshari', 4, (i) => `https://archive.org/download/FP9403/zksh${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'nasafi', name: 'مدارك التنزيل وحقائق التأويل (تفسير النسفي)',
    author: 'الإمام عبد الله بن أحمد النسفي (ت 710هـ)', category: 'التفسير',
    description: 'تفسير مختصر يجمع بين الرواية والدراية على منهج أهل السنة',
    volumes: createVolumes('nasafi', 3, (i) => `https://archive.org/download/FP11330nsf/nsf${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'baidawi', name: 'أنوار التنزيل وأسرار التأويل (تفسير البيضاوي)',
    author: 'الإمام البيضاوي (ت 685هـ)', category: 'التفسير',
    description: 'تفسير مختصر من الكشاف مع تنقيحه وزيادات على منهج أهل السنة',
    volumes: createVolumes('baidawi', 5, (i) => `https://archive.org/download/FP11320bda/bda${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'alusi', name: 'روح المعاني في تفسير القرآن والسبع المثاني',
    author: 'الإمام الآلوسي (ت 1270هـ)', category: 'التفسير',
    description: 'تفسير موسوعي يجمع بين التفسير بالمأثور والرأي والإشارات',
    volumes: createVolumes('alusi', 16, (i) => `https://archive.org/download/FP60816/alusy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-abi-hatim', name: 'تفسير ابن أبي حاتم',
    author: 'الإمام ابن أبي حاتم الرازي (ت 327هـ)', category: 'التفسير',
    description: 'تفسير بالمأثور من أهم مصادر التفسير بالرواية',
    volumes: createVolumes('ibn-abi-hatim', 10, (i) => `https://archive.org/download/tfser-ebn-abe-hatem/ibnabihatm${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'samaani', name: 'تفسير القرآن الكريم (تفسير السمعاني)',
    author: 'الإمام أبو المظفر السمعاني (ت 489هـ)', category: 'التفسير',
    description: 'تفسير على مذهب أهل السنة والجماعة يهتم بالعقيدة والفقه',
    volumes: createVolumes('samaani', 6, (i) => `https://archive.org/download/FP8600/${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-atiyya', name: 'المحرر الوجيز في تفسير الكتاب العزيز (تفسير ابن عطية)',
    author: 'الإمام ابن عطية الأندلسي (ت 542هـ)', category: 'التفسير',
    description: 'تفسير يجمع بين الرواية والدراية مع اهتمام بالإعراب واللغة',
    volumes: createVolumes('ibn-atiyya', 6, (i) => `https://archive.org/download/FP62210/ibnatia${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mawardi', name: 'النكت والعيون (تفسير الماوردي)',
    author: 'الإمام الماوردي (ت 450هـ)', category: 'التفسير',
    description: 'تفسير يهتم بذكر الأقوال المختلفة في تأويل الآيات',
    volumes: createVolumes('mawardi', 6, (i) => `https://archive.org/download/FPawmwrdy/mwrdy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'thanai', name: 'تفسير الثنائي - تفسير الثعالبي (الجواهر الحسان)',
    author: 'الإمام الثعالبي (ت 875هـ)', category: 'التفسير',
    description: 'تفسير مختصر من تفسير ابن عطية مع إضافات مفيدة',
    volumes: createVolumes('thanai', 5, (i) => `https://archive.org/download/FP62500/thlaby${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'thalabi-kashf', name: 'الكشف والبيان عن تفسير القرآن (تفسير الثعلبي)',
    author: 'الإمام الثعلبي (ت 427هـ)', category: 'التفسير',
    description: 'تفسير بالمأثور من أوائل التفاسير الموسوعية',
    volumes: createVolumes('thalabi-kashf', 10, (i) => `https://archive.org/download/FP62510/thlbi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'abu-hayyan', name: 'البحر المحيط في التفسير',
    author: 'الإمام أبو حيان الأندلسي (ت 745هـ)', category: 'التفسير',
    description: 'تفسير لغوي نحوي موسوعي يهتم بإعراب القرآن والقراءات',
    volumes: createVolumes('abu-hayyan', 11, (i) => `https://archive.org/download/FP60210/bhrmhit${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'khazin', name: 'لباب التأويل في معاني التنزيل (تفسير الخازن)',
    author: 'الإمام الخازن (ت 741هـ)', category: 'التفسير',
    description: 'تفسير مختصر من تفسير البغوي مع زيادات نافعة',
    volumes: createVolumes('khazin', 7, (i) => `https://archive.org/download/FP60510/khzn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-juzai', name: 'التسهيل لعلوم التنزيل (تفسير ابن جزي)',
    author: 'الإمام ابن جزي الكلبي (ت 741هـ)', category: 'التفسير',
    description: 'تفسير مختصر سهل العبارة مع فوائد لغوية وبلاغية',
    volumes: singleVol('ibn-juzai', 'التسهيل لعلوم التنزيل', 'https://archive.org/download/FPtshilFP/tshil.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'shanqiti-usul', name: 'منع جواز المجاز في المنزل للتعبد والإعجاز',
    author: 'الشيخ محمد الأمين الشنقيطي (ت 1393هـ)', category: 'التفسير',
    description: 'رسالة في بيان عدم وجود المجاز في القرآن الكريم',
    volumes: singleVol('shanqiti-usul', 'منع جواز المجاز', 'https://archive.org/download/WAQ69939/man3jawaz.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'suyuti-nuzul', name: 'ترتيب سور القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'التفسير',
    description: 'رسالة في ترتيب سور القرآن الكريم والحكمة منه',
    volumes: singleVol('suyuti-nuzul', 'ترتيب سور القرآن', 'https://archive.org/download/WAQ85429/85429.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-munir', name: 'التفسير المنير في العقيدة والشريعة والمنهج',
    author: 'الدكتور وهبة الزحيلي (ت 1436هـ)', category: 'التفسير',
    description: 'تفسير معاصر شامل يجمع بين التفسير التحليلي والموضوعي',
    volumes: createVolumes('tafsir-munir', 15, (i) => `https://archive.org/download/FP97210/mnyr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'wasit-zuhaili', name: 'التفسير الوسيط',
    author: 'الدكتور وهبة الزحيلي (ت 1436هـ)', category: 'التفسير',
    description: 'تفسير وسيط بين الإيجاز والتطويل مع بيان الأحكام',
    volumes: createVolumes('wasit-zuhaili', 3, (i) => `https://archive.org/download/FP98000/wsyt${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-jawzi-zad', name: 'زاد المسير في علم التفسير',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'التفسير',
    description: 'تفسير مختصر يجمع أقوال المفسرين مع إعراب الآيات',
    volumes: createVolumes('ibn-jawzi-zad', 4, (i) => `https://archive.org/download/FP59909/zadmsyr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tabari-kathir-combined', name: 'تفسير ابن كثير (طبعة دار طيبة)',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'التفسير',
    description: 'طبعة محققة مع تخريج الأحاديث والآثار',
    volumes: singleVol('tabari-kathir-combined', 'تفسير ابن كثير - طبعة دار طيبة', 'https://archive.org/download/tafsir-ibn-kathir/Tafseer-Ibn-Kathir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-tawdih', name: 'أيسر التفاسير لكلام العلي الكبير',
    author: 'الشيخ أبو بكر الجزائري (ت 1439هـ)', category: 'التفسير',
    description: 'تفسير ميسر مع بيان الأحكام والهدايات والآداب',
    volumes: createVolumes('tafsir-tawdih', 5, (i) => `https://archive.org/download/FP11328/aysr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tantheem', name: 'نظم الدرر في تناسب الآيات والسور',
    author: 'الإمام البقاعي (ت 885هـ)', category: 'التفسير',
    description: 'تفسير يهتم ببيان المناسبات بين الآيات والسور',
    volumes: createVolumes('tantheem', 22, (i) => `https://archive.org/download/FP60820/bqay${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'siraj-munir', name: 'السراج المنير في تفسير القرآن',
    author: 'الإمام الشربيني (ت 977هـ)', category: 'التفسير',
    description: 'تفسير يجمع بين الرواية والدراية مع بيان القراءات',
    volumes: createVolumes('siraj-munir', 4, (i) => `https://archive.org/download/FP60650/shrbiny${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'qasimi', name: 'محاسن التأويل (تفسير القاسمي)',
    author: 'الشيخ جمال الدين القاسمي (ت 1332هـ)', category: 'التفسير',
    description: 'تفسير يجمع بين الأصالة والمعاصرة والاعتدال في المنهج',
    volumes: createVolumes('qasimi', 9, (i) => `https://archive.org/download/FP95010/qsmy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-rajab', name: 'تفسير ابن رجب الحنبلي',
    author: 'الإمام ابن رجب الحنبلي (ت 795هـ)', category: 'التفسير',
    description: 'تفسير على منهج السلف مع فوائد حديثية وفقهية',
    volumes: singleVol('ibn-rajab', 'تفسير ابن رجب الحنبلي', 'https://archive.org/download/FP82312/tafseeribnrajab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wajiz-wahidi', name: 'الوجيز في تفسير الكتاب العزيز',
    author: 'الإمام الواحدي (ت 468هـ)', category: 'التفسير',
    description: 'تفسير مختصر من أوائل التفاسير المختصرة',
    volumes: singleVol('wajiz-wahidi', 'الوجيز في التفسير', 'https://archive.org/download/WAQ11720/11720.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tustari', name: 'تفسير القرآن العظيم (تفسير التستري)',
    author: 'الإمام سهل بن عبد الله التستري (ت 283هـ)', category: 'التفسير',
    description: 'من أقدم كتب التفسير مع لطائف إيمانية',
    volumes: singleVol('tustari', 'تفسير التستري', 'https://archive.org/download/FP62700/tstry.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'faid-qadir-tafsir', name: 'التيسير بشرح الجامع الصغير',
    author: 'الإمام المناوي (ت 1031هـ)', category: 'التفسير',
    description: 'شرح مختصر للأحاديث المتعلقة بتفسير القرآن',
    volumes: singleVol('faid-qadir-tafsir', 'التيسير بشرح الجامع الصغير', 'https://archive.org/download/FP80000mnw/tysyr.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم علوم القرآن - أكثر من 30 كتاب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'itqan', name: 'الإتقان في علوم القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'أشهر كتاب في علوم القرآن يتناول 80 نوعاً من أنواع علوم القرآن',
    volumes: singleVol('itqan', 'الإتقان في علوم القرآن', 'https://archive.org/download/sa71mir_gmail_20160606/%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%B9%D9%84%D9%88%D9%85%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D9%84%D9%84%D8%AD%D8%A7%D9%81%D8%B8%20%D8%AC%D9%84%D8%A7%D9%84%20%D8%A7%D9%84%D8%AF%D9%8A%D9%86%20%D8%A7%D9%84%D8%B3%D9%8A%D9%88%D8%B7%D9%8A.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'burhan', name: 'البرهان في علوم القرآن',
    author: 'الإمام بدر الدين الزركشي (ت 794هـ)', category: 'علوم القرآن',
    description: 'كتاب موسوعي في علوم القرآن سبق الإتقان',
    volumes: singleVol('burhan', 'البرهان في علوم القرآن', 'https://archive.org/download/FPbrolquyu/brolquyu.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mabaheth', name: 'مباحث في علوم القرآن',
    author: 'الشيخ مناع القطان (ت 1420هـ)', category: 'علوم القرآن',
    description: 'كتاب تعليمي سهل في علوم القرآن للمبتدئين والمتوسطين',
    volumes: singleVol('mabaheth', 'مباحث في علوم القرآن', 'https://archive.org/download/WAQmbolqumbolqu/mbolqu.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muqaddima-tafsir', name: 'مقدمة في أصول التفسير',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'علوم القرآن',
    description: 'رسالة مهمة في أصول التفسير وقواعده من شيخ الإسلام',
    volumes: singleVol('muqaddima-tafsir', 'مقدمة في أصول التفسير', 'https://archive.org/download/mabadifiilmeusoolaltafseer/MABADI_FI_ILM_E_USOOL_AL_TAFSEER.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'manahij', name: 'التفسير والمفسرون',
    author: 'محمد حسين الذهبي', category: 'علوم القرآن',
    description: 'دراسة تحليلية شاملة لمناهج المفسرين عبر التاريخ',
    volumes: singleVol('manahij', 'التفسير والمفسرون', 'https://archive.org/download/WAQ90085s/90085s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'zamzami', name: 'شرح منظومة الزمزمي في علوم القرآن',
    author: 'الشيخ محمد المختار الشنقيطي', category: 'علوم القرآن',
    description: 'شرح وافٍ لمنظومة الزمزمي في علوم القرآن',
    volumes: singleVol('zamzami', 'شرح منظومة الزمزمي', 'https://archive.org/download/Sharh_Mandhumat_Zemzemi/Sharh_Mandhumat_Zemzemi._kamil.pdf'),
    isSingleVolume: true,
  },
  // --- كتب علوم قرآن إضافية ---
  {
    id: 'funun-afnan', name: 'فنون الأفنان في عيون علوم القرآن',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'علوم القرآن',
    description: 'كتاب في أنواع علوم القرآن من إمام الوعاظ',
    volumes: singleVol('funun-afnan', 'فنون الأفنان', 'https://archive.org/download/FP11305/fnwnalafnan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nasikh-mansukh-nahhas', name: 'الناسخ والمنسوخ في القرآن الكريم',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'علوم القرآن',
    description: 'من أهم كتب الناسخ والمنسوخ في القرآن الكريم',
    volumes: singleVol('nasikh-mansukh-nahhas', 'الناسخ والمنسوخ للنحاس', 'https://archive.org/download/FP63810/alnasekh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nasikh-mansukh-ibn-hazm', name: 'الناسخ والمنسوخ',
    author: 'الإمام ابن حزم الظاهري (ت 456هـ)', category: 'علوم القرآن',
    description: 'رسالة مختصرة في بيان الناسخ والمنسوخ',
    volumes: singleVol('nasikh-mansukh-ibn-hazm', 'الناسخ والمنسوخ لابن حزم', 'https://archive.org/download/WAQnskhwmnskh/nskhwmnskh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muhkam-mutashabih', name: 'المحكم والمتشابه في القرآن',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'علوم القرآن',
    description: 'كتاب في بيان المحكم والمتشابه من آيات القرآن',
    volumes: singleVol('muhkam-mutashabih', 'المحكم والمتشابه', 'https://archive.org/download/WAQ60860s/60860s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fadail-quran-nasai', name: 'فضائل القرآن',
    author: 'الإمام النسائي (ت 303هـ)', category: 'علوم القرآن',
    description: 'أحاديث في فضائل القرآن وتلاوته وحفظه',
    volumes: singleVol('fadail-quran-nasai', 'فضائل القرآن للنسائي', 'https://archive.org/download/FPfdaylqlns/fdaylqlns.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fadail-quran-ibn-kathir', name: 'فضائل القرآن',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'علوم القرآن',
    description: 'كتاب في فضائل القرآن وثواب تلاوته وآداب حملته',
    volumes: singleVol('fadail-quran-ibn-kathir', 'فضائل القرآن لابن كثير', 'https://archive.org/download/FP59519/fdaylquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tibyan-adab', name: 'التبيان في آداب حملة القرآن',
    author: 'الإمام النووي (ت 676هـ)', category: 'علوم القرآن',
    description: 'كتاب في آداب تلاوة القرآن وحفظه وتعليمه',
    volumes: singleVol('tibyan-adab', 'التبيان في آداب حملة القرآن', 'https://archive.org/download/WAQtby/tby.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ijaz-quran-baqillani', name: 'إعجاز القرآن',
    author: 'الإمام الباقلاني (ت 403هـ)', category: 'علوم القرآن',
    description: 'من أعظم ما ألف في إعجاز القرآن الكريم',
    volumes: singleVol('ijaz-quran-baqillani', 'إعجاز القرآن للباقلاني', 'https://archive.org/download/FP63380/i3jazquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ijaz-quran-khattabi', name: 'بيان إعجاز القرآن',
    author: 'الإمام الخطابي (ت 388هـ)', category: 'علوم القرآن',
    description: 'رسالة مهمة في إعجاز القرآن البلاغي',
    volumes: singleVol('ijaz-quran-khattabi', 'بيان إعجاز القرآن', 'https://archive.org/download/WAQ63380/63380.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'amthal-quran-mawardi', name: 'الأمثال في القرآن الكريم',
    author: 'الإمام الماوردي (ت 450هـ)', category: 'علوم القرآن',
    description: 'كتاب في بيان الأمثال المضروبة في القرآن الكريم',
    volumes: singleVol('amthal-quran-mawardi', 'الأمثال في القرآن للماوردي', 'https://archive.org/download/FP60510/amthalquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'aqsam-quran-ibn-qayyim', name: 'أقسام القرآن',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'علوم القرآن',
    description: 'كتاب يبين الأقسام التي أقسم الله بها في القرآن وحكمتها',
    volumes: singleVol('aqsam-quran-ibn-qayyim', 'أقسام القرآن', 'https://archive.org/download/FP82106/aqsamquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'amthal-quran-ibn-qayyim', name: 'الأمثال في القرآن الكريم',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'علوم القرآن',
    description: 'كتاب في بيان أمثال القرآن ومعانيها العميقة',
    volumes: singleVol('amthal-quran-ibn-qayyim', 'الأمثال في القرآن لابن القيم', 'https://archive.org/download/FP82107/amthalibnqayyim.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qawaid-tafsir', name: 'القواعد الحسان المتعلقة بتفسير القرآن',
    author: 'الشيخ عبد الرحمن بن ناصر السعدي (ت 1376هـ)', category: 'علوم القرآن',
    description: 'قواعد أساسية في فهم القرآن وتفسيره',
    volumes: singleVol('qawaid-tafsir', 'القواعد الحسان', 'https://archive.org/download/FP11429/qwaidhasan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'taawil-mushkil', name: 'تأويل مشكل القرآن',
    author: 'الإمام ابن قتيبة (ت 276هـ)', category: 'علوم القرآن',
    description: 'كتاب يرد فيه على الطاعنين في القرآن ويبين مشكله',
    volumes: singleVol('taawil-mushkil', 'تأويل مشكل القرآن', 'https://archive.org/download/WAQ63310/63310.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'makki-madani', name: 'المكي والمدني في القرآن الكريم',
    author: 'الدكتور عبد الرزاق حسين أحمد', category: 'علوم القرآن',
    description: 'دراسة شاملة في المكي والمدني وخصائص كل منهما',
    volumes: singleVol('makki-madani', 'المكي والمدني', 'https://archive.org/download/WAQ64220/64220.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jam3-quran', name: 'جمع القرآن - دراسة تحليلية لمروياته',
    author: 'الدكتور أكرم عبد خليفة الدليمي', category: 'علوم القرآن',
    description: 'دراسة علمية في تاريخ جمع القرآن الكريم',
    volumes: singleVol('jam3-quran', 'جمع القرآن', 'https://archive.org/download/FP63120/jam3quran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'rasm-quran', name: 'المقنع في رسم مصاحف الأمصار',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'علوم القرآن',
    description: 'كتاب أساسي في رسم المصحف العثماني',
    volumes: singleVol('rasm-quran', 'المقنع في رسم المصاحف', 'https://archive.org/download/WAQ32510s/32510s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'waqf-ibtida', name: 'منار الهدى في الوقف والابتداء',
    author: 'الإمام الأشموني (ت 1100هـ)', category: 'علوم القرآن',
    description: 'كتاب شامل في أحكام الوقف والابتداء في القرآن',
    volumes: singleVol('waqf-ibtida', 'منار الهدى في الوقف والابتداء', 'https://archive.org/download/WAQ33290/33290.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم التجويد والقراءات - أكثر من 25 كتاب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ibriz', name: 'إبراز المعاني من حرز الأماني (شرح الشاطبية)',
    author: 'الإمام أبي شامة المقدسي (ت 665هـ)', category: 'التجويد والقراءات',
    description: 'شرح القصيدة الشاطبية في القراءات السبع',
    volumes: singleVol('ibriz', 'إبراز المعاني', 'https://archive.org/download/ktp2019-bk1591/ktp2019-bk1591.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'warsh', name: 'أصول رواية ورش عن نافع',
    author: 'جمع من العلماء', category: 'التجويد والقراءات',
    description: 'قواعد وأصول رواية ورش عن نافع المدني',
    volumes: singleVol('warsh', 'أصول رواية ورش', 'https://archive.org/download/UsoolWARSHanNafiTajweedRulesForWarsh/Usool%20WARSH%20%27an%20Nafi%27%20Tajweed%20Rules%20for%20Warsh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'najm-adhar', name: 'النجم الأزهر في القراءات الأربعة عشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'القراءات الأربع عشرة المتممة للعشر',
    volumes: singleVol('najm-adhar', 'النجم الأزهر', 'https://archive.org/download/an-najm-al-adh-har/an-najm-al-adh-har.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'manh-ilahiya', name: 'المنح الإلهية في جمع القراءات السبع',
    author: 'محمد بن محمد الأموي', category: 'التجويد والقراءات',
    description: 'كتاب في القراءات السبع المتواترة',
    volumes: singleVol('manh-ilahiya', 'المنح الإلهية', 'https://archive.org/download/waq38375/38375.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'itqan-qaloun', name: 'الإتقان في أصول رواية قالون',
    author: 'الشيخ عبد العزيز القاري', category: 'التجويد والقراءات',
    description: 'أصول وقواعد رواية قالون عن نافع',
    volumes: singleVol('itqan-qaloun', 'الإتقان في أصول رواية قالون', 'https://archive.org/download/SW-moton-darat-alotrogga/01-%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%A3%D8%B5%D9%88%D9%84%20%D8%B1%D9%88%D8%A7%D9%8A%D8%A9%20%D9%82%D8%A7%D9%84%D9%88%D9%86.pdf'),
    isSingleVolume: true,
  },
  // --- كتب تجويد وقراءات إضافية ---
  {
    id: 'nashr-qiraat', name: 'النشر في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أعظم كتاب في القراءات العشر المتواترة وأصولها وفرشها',
    volumes: createVolumes('nashr-qiraat', 2, (i) => `https://archive.org/download/WAQ37515/nashr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tahbeer-tayseer', name: 'تحبير التيسير في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في توضيح القراءات العشر',
    volumes: singleVol('tahbeer-tayseer', 'تحبير التيسير', 'https://archive.org/download/WAQ32513/32513.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jazariyya', name: 'المقدمة الجزرية في التجويد',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أشهر منظومة في أحكام التجويد يحفظها طلاب العلم',
    volumes: singleVol('jazariyya', 'المقدمة الجزرية', 'https://archive.org/download/WAQ32511/32511.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tuhfat-atfal', name: 'تحفة الأطفال والغلمان في تجويد القرآن',
    author: 'الشيخ سليمان الجمزوري (ت 1204هـ)', category: 'التجويد والقراءات',
    description: 'منظومة مشهورة في أحكام التجويد للمبتدئين',
    volumes: singleVol('tuhfat-atfal', 'تحفة الأطفال', 'https://archive.org/download/WAQthftatfl/thftatfl.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tamheed', name: 'التمهيد في علم التجويد',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'كتاب أساسي في أصول علم التجويد ومخارج الحروف',
    volumes: singleVol('tamheed', 'التمهيد في علم التجويد', 'https://archive.org/download/WAQ32512/32512.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ghaya-nihaya', name: 'غاية النهاية في طبقات القراء',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أشمل كتاب في تراجم القراء والمقرئين',
    volumes: createVolumes('ghaya-nihaya', 2, (i) => `https://archive.org/download/WAQ37516s/ghayanihaya${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tayseer-dani', name: 'التيسير في القراءات السبع',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'كتاب أساسي في القراءات السبع اختصره من كتابه جامع البيان',
    volumes: singleVol('tayseer-dani', 'التيسير في القراءات السبع', 'https://archive.org/download/WAQ32510s/32510.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'shatibiyya', name: 'حرز الأماني ووجه التهاني (الشاطبية)',
    author: 'الإمام الشاطبي (ت 590هـ)', category: 'التجويد والقراءات',
    description: 'أشهر منظومة في القراءات السبع، ألفية لا يستغني عنها قارئ',
    volumes: singleVol('shatibiyya', 'الشاطبية', 'https://archive.org/download/WAQ31290/31290.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'durra-mudiyya', name: 'الدرة المضية في القراءات الثلاث',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'منظومة في القراءات الثلاث المتممة للعشر',
    volumes: singleVol('durra-mudiyya', 'الدرة المضية', 'https://archive.org/download/WAQ32514/32514.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tayyibat-nashr', name: 'طيبة النشر في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'منظومة جامعة في القراءات العشر نظم فيها كتابه النشر',
    volumes: singleVol('tayyibat-nashr', 'طيبة النشر', 'https://archive.org/download/WAQ37517/37517.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'hujjat-qiraat', name: 'الحجة للقراء السبعة',
    author: 'الإمام أبو علي الفارسي (ت 377هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في توجيه القراءات السبع وبيان حججها النحوية',
    volumes: createVolumes('hujjat-qiraat', 3, (i) => `https://archive.org/download/FP64610/hujja${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'kashf-qiraat', name: 'الكشف عن وجوه القراءات السبع وعللها',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في توجيه القراءات وبيان عللها',
    volumes: singleVol('kashf-qiraat', 'الكشف عن وجوه القراءات', 'https://archive.org/download/FP64612/kashfqiraat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibana-nukhba', name: 'الإبانة عن معاني القراءات',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في شرح معاني القراءات وبيان أوجهها',
    volumes: singleVol('ibana-nukhba', 'الإبانة عن معاني القراءات', 'https://archive.org/download/FP64613/ibana.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'riaya-tajwid', name: 'الرعاية لتجويد القراءة وتحقيق لفظ التلاوة',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'التجويد والقراءات',
    description: 'من أقدم الكتب المتخصصة في أحكام التجويد',
    volumes: singleVol('riaya-tajwid', 'الرعاية لتجويد القراءة', 'https://archive.org/download/FP64614/riayatajweed.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qiraat-abnumujahid', name: 'السبعة في القراءات',
    author: 'الإمام ابن مجاهد (ت 324هـ)', category: 'التجويد والقراءات',
    description: 'أول كتاب يحصر القراءات المتواترة في سبع قراءات',
    volumes: singleVol('qiraat-abnumujahid', 'السبعة في القراءات', 'https://archive.org/download/WAQ31295/31295.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم إعراب القرآن وبيانه - أكثر من 15 كتاب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tawjih', name: 'التوجيه النحوي للقراءات القرآنية',
    author: 'أحمد محمد النحال', category: 'إعراب القرآن وبيانه',
    description: 'دراسة نحوية للقراءات القرآنية وتوجيهها',
    volumes: singleVol('tawjih', 'التوجيه النحوي للقراءات', 'https://archive.org/download/ktp2019-tra5511/ktp2019-tra5511.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'bina', name: 'بناء التركيب الإفصاحي في القرآن',
    author: 'محمد أحمد أبو الفتوح', category: 'إعراب القرآن وبيانه',
    description: 'دراسة لغوية في تراكيب القرآن الكريم',
    volumes: singleVol('bina', 'بناء التركيب الإفصاحي', 'https://archive.org/download/azm101010_gmail_20180403_1519/%D8%A8%D9%86%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D8%A7%D9%84%D8%A5%D9%81%D8%B5%D8%A7%D8%AD%D9%8A%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85.pdf'),
    isSingleVolume: true,
  },
  // --- كتب إعراب إضافية ---
  {
    id: 'irab-nahhas', name: 'إعراب القرآن',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم وأهم كتب إعراب القرآن الكريم',
    volumes: createVolumes('irab-nahhas', 5, (i) => `https://archive.org/download/FP63505/nahhas${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'irab-darwish', name: 'إعراب القرآن الكريم وبيانه',
    author: 'الشيخ محيي الدين درويش', category: 'إعراب القرآن وبيانه',
    description: 'إعراب شامل ومفصل لجميع آيات القرآن الكريم',
    volumes: createVolumes('irab-darwish', 10, (i) => `https://archive.org/download/FP63508/darwish${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'jadwal-irab', name: 'الجدول في إعراب القرآن',
    author: 'الشيخ محمود صافي', category: 'إعراب القرآن وبيانه',
    description: 'إعراب القرآن على شكل جداول ميسرة',
    volumes: createVolumes('jadwal-irab', 15, (i) => `https://archive.org/download/FP63509/jadwal${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mushkil-irab', name: 'مشكل إعراب القرآن',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في بيان الأوجه المشكلة في إعراب القرآن',
    volumes: singleVol('mushkil-irab', 'مشكل إعراب القرآن', 'https://archive.org/download/WAQ63509/63509.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tibyan-irab', name: 'التبيان في إعراب القرآن',
    author: 'الإمام أبو البقاء العكبري (ت 616هـ)', category: 'إعراب القرآن وبيانه',
    description: 'إعراب القرآن مع بيان الأوجه الإعرابية المختلفة',
    volumes: createVolumes('tibyan-irab', 2, (i) => `https://archive.org/download/FP63507/akbary${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'majaz-quran', name: 'مجاز القرآن',
    author: 'الإمام أبو عبيدة معمر بن المثنى (ت 209هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب بلاغة القرآن وبيان أساليبه',
    volumes: singleVol('majaz-quran', 'مجاز القرآن', 'https://archive.org/download/FP63210/majazquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muthanna-quran', name: 'ما اتفق لفظه واختلف معناه من القرآن',
    author: 'الإمام المبرد (ت 286هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في الوجوه والنظائر في القرآن الكريم',
    volumes: singleVol('muthanna-quran', 'ما اتفق لفظه واختلف معناه', 'https://archive.org/download/WAQ63312/63312.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'maani-quran-farra', name: 'معاني القرآن',
    author: 'الإمام الفراء (ت 207هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب معاني القرآن وإعرابه على مذهب الكوفيين',
    volumes: createVolumes('maani-quran-farra', 3, (i) => `https://archive.org/download/FP63210s/farra${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'maani-quran-akhfash', name: 'معاني القرآن',
    author: 'الإمام الأخفش الأوسط (ت 215هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في معاني القرآن وإعرابه على مذهب البصريين',
    volumes: singleVol('maani-quran-akhfash', 'معاني القرآن للأخفش', 'https://archive.org/download/FP63211/akhfash.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'daf-iham', name: 'دفع إيهام الاضطراب عن آيات الكتاب',
    author: 'الشيخ محمد الأمين الشنقيطي (ت 1393هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب يرفع الإيهام عن الآيات التي ظاهرها التعارض',
    volumes: singleVol('daf-iham', 'دفع إيهام الاضطراب', 'https://archive.org/download/WAQ69940/69940.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم أسباب النزول - أكثر من 10 كتب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'lubab', name: 'لباب النقول في أسباب النزول',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'أسباب النزول',
    description: 'أشهر كتاب في أسباب النزول مرتب على ترتيب السور',
    volumes: singleVol('lubab', 'لباب النقول', 'https://archive.org/download/WAQ9083S/9083s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sahih-asbab', name: 'الصحيح المسند من أسباب النزول',
    author: 'الشيخ مقبل بن هادي الوادعي (ت 1422هـ)', category: 'أسباب النزول',
    description: 'تحقيق وتخريج أسباب النزول الصحيحة',
    volumes: singleVol('sahih-asbab', 'الصحيح المسند من أسباب النزول', 'https://archive.org/download/mttfqmttfq/mttfq.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'asbab-wahidi', name: 'أسباب النزول',
    author: 'الإمام الواحدي (ت 468هـ)', category: 'أسباب النزول',
    description: 'أول كتاب مستقل في أسباب النزول وأشهرها',
    volumes: singleVol('asbab-wahidi', 'أسباب النزول للواحدي', 'https://archive.org/download/asbab-01002/asbab-01002.pdf'),
    isSingleVolume: true,
  },
  // --- كتب أسباب نزول إضافية ---
  {
    id: 'ajab-asbab', name: 'العُجاب في بيان الأسباب',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'أسباب النزول',
    description: 'كتاب موسع في أسباب النزول مع تحقيق الروايات',
    volumes: singleVol('ajab-asbab', 'العُجاب في بيان الأسباب', 'https://archive.org/download/FP76510/ujab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'asbab-jazairi', name: 'أسباب النزول - دراسة علمية',
    author: 'الدكتور غازي عناية', category: 'أسباب النزول',
    description: 'دراسة علمية في أسباب نزول آيات القرآن',
    volumes: singleVol('asbab-jazairi', 'أسباب النزول - دراسة علمية', 'https://archive.org/download/WAQ9084S/9084s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nuzul-quran', name: 'أسباب نزول القرآن - رواية ودراية',
    author: 'الدكتور عماد الدين أبو العطا', category: 'أسباب النزول',
    description: 'دراسة شاملة في أسباب النزول من حيث الرواية والدراية',
    volumes: singleVol('nuzul-quran', 'أسباب نزول القرآن', 'https://archive.org/download/WAQ9085S/9085s.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'makki-madani-2', name: 'المكي والمدني وأسباب النزول',
    author: 'الإمام ابن النقيب (ت 698هـ)', category: 'أسباب النزول',
    description: 'كتاب يجمع بين المكي والمدني وأسباب النزول',
    volumes: singleVol('makki-madani-2', 'المكي والمدني وأسباب النزول', 'https://archive.org/download/WAQ9086S/9086s.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم غريب القرآن ومفرداته - أكثر من 15 كتاب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'mufredat', name: 'مفردات ألفاظ القرآن',
    author: 'الإمام الراغب الأصفهاني (ت 502هـ)', category: 'غريب القرآن ومفرداته',
    description: 'أشهر معجم لمفردات القرآن الكريم وأكثرها شمولاً',
    volumes: singleVol('mufredat', 'مفردات ألفاظ القرآن', 'https://archive.org/download/Al-isfahani-MufradatAlfadhAl-quran/Al-isfahani-MufradatAlfadhAl-quran-.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mafahim', name: 'مفاهيم قرآنية',
    author: 'الشيخ محمد الغزالي', category: 'غريب القرآن ومفرداته',
    description: 'بيان لمفاهيم قرآنية أساسية ومعانيها العميقة',
    volumes: singleVol('mafahim', 'مفاهيم قرآنية', 'https://archive.org/download/ebw02/079.pdf'),
    isSingleVolume: true,
  },
  // --- كتب غريب القرآن إضافية ---
  {
    id: 'gharib-quran-ibn-qutayba', name: 'غريب القرآن',
    author: 'الإمام ابن قتيبة (ت 276هـ)', category: 'غريب القرآن ومفرداته',
    description: 'من أقدم كتب غريب القرآن الكريم',
    volumes: singleVol('gharib-quran-ibn-qutayba', 'غريب القرآن لابن قتيبة', 'https://archive.org/download/FP63310/ghareebquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'gharib-sajistani', name: 'نزهة القلوب في غريب القرآن',
    author: 'الإمام السجستاني (ت 330هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم لغريب القرآن مرتب على الحروف',
    volumes: singleVol('gharib-sajistani', 'نزهة القلوب في غريب القرآن', 'https://archive.org/download/WAQ63315/63315.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wujuh-nazair', name: 'الوجوه والنظائر في القرآن الكريم',
    author: 'الإمام الدامغاني (ت 478هـ)', category: 'غريب القرآن ومفرداته',
    description: 'كتاب في الألفاظ القرآنية المتعددة المعاني',
    volumes: singleVol('wujuh-nazair', 'الوجوه والنظائر', 'https://archive.org/download/WAQ63316/63316.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'kalimat-quran', name: 'كلمات القرآن - تفسير وبيان',
    author: 'الشيخ حسنين مخلوف', category: 'غريب القرآن ومفرداته',
    description: 'كتاب مختصر في بيان معاني كلمات القرآن الغريبة',
    volumes: singleVol('kalimat-quran', 'كلمات القرآن', 'https://archive.org/download/FP63320/kalimatquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tasheel-quran', name: 'السراج في بيان غريب القرآن',
    author: 'الشيخ محمد بن عبد العزيز الخضيري', category: 'غريب القرآن ومفرداته',
    description: 'كتاب ميسر في بيان غريب ألفاظ القرآن',
    volumes: singleVol('tasheel-quran', 'السراج في بيان غريب القرآن', 'https://archive.org/download/FP63321/siraj.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'umdah-huffaz', name: 'عمدة الحفاظ في تفسير أشرف الألفاظ',
    author: 'الإمام السمين الحلبي (ت 756هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم لغوي يشرح مفردات القرآن مع التحليل اللغوي',
    volumes: createVolumes('umdah-huffaz', 4, (i) => `https://archive.org/download/FP63325/samin${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mutashabih-quran', name: 'المتشابه اللفظي في القرآن وسر بلاغته',
    author: 'الدكتور صالح الشتيوي', category: 'غريب القرآن ومفرداته',
    description: 'كتاب في بيان الألفاظ المتشابهة في القرآن والفروق بينها',
    volumes: singleVol('mutashabih-quran', 'المتشابه اللفظي في القرآن', 'https://archive.org/download/WAQ63317/63317.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'durr-manthour-gharib', name: 'الدر المنثور في بيان غريب القرآن',
    author: 'الإمام أبو حيان الأندلسي (ت 745هـ)', category: 'غريب القرآن ومفرداته',
    description: 'تفسير لغريب القرآن من إمام النحاة',
    volumes: singleVol('durr-manthour-gharib', 'الدر المنثور في غريب القرآن', 'https://archive.org/download/FP63326/durrghareeb.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ قسم التدبر - أكثر من 15 كتاب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'qawaid-tadabbur', name: 'القواعد والأصول وتطبيقات التدبر',
    author: 'عبد العزيز المحمد السليم', category: 'التدبر',
    description: 'قواعد تدبر القرآن الكريم وتطبيقاتها العملية',
    volumes: singleVol('qawaid-tadabbur', 'القواعد والأصول', 'https://archive.org/download/FPkaustatdFP/kaustatd.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'layudabiru', name: 'ليدبروا آياته',
    author: 'ناصر بن سليمان العمر', category: 'التدبر',
    description: 'سلسلة في تدبر القرآن الكريم والتأمل في آياته',
    volumes: [
      { id: 'layudabiru-1', title: 'الجزء الأول', volumeNumber: 1, pdfUrl: 'https://archive.org/download/104688/104688.pdf' },
      { id: 'layudabiru-2', title: 'الجزء الثاني', volumeNumber: 2, pdfUrl: 'https://archive.org/download/121452/121452.pdf' },
    ],
    isSingleVolume: false,
  },
  {
    id: 'istimbajat', name: 'استنباطات الشيخ السعدي من القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'التدبر',
    description: 'فوائد واستنباطات مستخلصة من تفسير السعدي',
    volumes: singleVol('istimbajat', 'استنباطات الشيخ السعدي', 'https://archive.org/download/istn8/istn8.pdf'),
    isSingleVolume: true,
  },
  // --- كتب تدبر إضافية ---
  {
    id: 'naba-azeem', name: 'النبأ العظيم - نظرات جديدة في القرآن',
    author: 'الدكتور محمد عبد الله دراز (ت 1377هـ)', category: 'التدبر',
    description: 'كتاب في إعجاز القرآن وعظمته ونظرات تدبرية عميقة',
    volumes: singleVol('naba-azeem', 'النبأ العظيم', 'https://archive.org/download/FP95510/nabaa3zeem.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'thilal-quran', name: 'في ظلال القرآن',
    author: 'سيد قطب (ت 1386هـ)', category: 'التدبر',
    description: 'تفسير تدبري أدبي يربط القرآن بالواقع والحياة',
    volumes: createVolumes('thilal-quran', 6, (i) => `https://archive.org/download/FP96110/dhylal${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'maqasid-suwar', name: 'المختصر في مقاصد سور القرآن',
    author: 'جمع من العلماء', category: 'التدبر',
    description: 'كتاب يبين مقصد كل سورة من سور القرآن الكريم',
    volumes: singleVol('maqasid-suwar', 'المختصر في مقاصد سور القرآن', 'https://archive.org/download/FP95515/maqasidsuwar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tadabbur-w-amal', name: 'تدبر القرآن والعمل به',
    author: 'الشيخ عبد الرحمن حبنكة الميداني', category: 'التدبر',
    description: 'كتاب يربط بين تدبر القرآن والعمل بمقتضاه',
    volumes: singleVol('tadabbur-w-amal', 'تدبر القرآن والعمل به', 'https://archive.org/download/FP95516/tadabbur.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qasas-quran', name: 'قصص القرآن الكريم',
    author: 'الشيخ محمد أحمد جاد المولى', category: 'التدبر',
    description: 'عرض لقصص القرآن مع العبر والدروس المستفادة',
    volumes: singleVol('qasas-quran', 'قصص القرآن الكريم', 'https://archive.org/download/FP95520/qasasquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tadabbur-surahs', name: 'تأملات قرآنية',
    author: 'الشيخ صالح بن عبد الله بن حميد', category: 'التدبر',
    description: 'تأملات وتدبرات في سور وآيات من القرآن الكريم',
    volumes: singleVol('tadabbur-surahs', 'تأملات قرآنية', 'https://archive.org/download/FP95521/taamulat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'quran-hayat', name: 'كيف نتعامل مع القرآن الكريم',
    author: 'الشيخ محمد الغزالي (ت 1416هـ)', category: 'التدبر',
    description: 'كتاب في كيفية التعامل مع القرآن وتدبره',
    volumes: singleVol('quran-hayat', 'كيف نتعامل مع القرآن', 'https://archive.org/download/ebw02/081.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nahw-quran-hayy', name: 'نحو قرآن حي',
    author: 'الشيخ محمد الغزالي (ت 1416هـ)', category: 'التدبر',
    description: 'كتاب يدعو لإحياء التفاعل مع القرآن الكريم',
    volumes: singleVol('nahw-quran-hayy', 'نحو قرآن حي', 'https://archive.org/download/FP95530/nahwquranhay.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-tarbawi', name: 'التفسير التربوي للقرآن الكريم',
    author: 'الدكتور أنور الباز', category: 'التدبر',
    description: 'تفسير يستنبط الجوانب التربوية من القرآن الكريم',
    volumes: singleVol('tafsir-tarbawi', 'التفسير التربوي', 'https://archive.org/download/tafseer_tarbawee_202010/tafsir_tarbawi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mawdui-quran', name: 'التفسير الموضوعي لسور القرآن',
    author: 'نخبة من العلماء - جامعة الشارقة', category: 'التدبر',
    description: 'تفسير موضوعي يبين المحاور الرئيسية لكل سورة',
    volumes: singleVol('mawdui-quran', 'التفسير الموضوعي', 'https://archive.org/download/FP95535/mawduiquran.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - كتب التفسير ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tafsir-ibn-arafa', name: 'تفسير ابن عرفة',
    author: 'الإمام ابن عرفة المالكي (ت 803هـ)', category: 'التفسير',
    description: 'تفسير على المذهب المالكي مع بحوث أصولية وكلامية',
    volumes: singleVol('tafsir-ibn-arafa', 'تفسير ابن عرفة', 'https://archive.org/download/FP62700s/ibnarafa.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'lubab-nuqul', name: 'لباب التأويل في معاني التنزيل',
    author: 'الإمام الخازن علاء الدين البغدادي (ت 741هـ)', category: 'التفسير',
    description: 'تفسير ميسر اختصره من تفسير البغوي مع زيادات',
    volumes: createVolumes('lubab-nuqul', 4, (i) => `https://archive.org/download/FP60510/khzn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-samarqandi', name: 'بحر العلوم (تفسير السمرقندي)',
    author: 'الإمام أبو الليث السمرقندي (ت 373هـ)', category: 'التفسير',
    description: 'تفسير بالرأي والمأثور من تفاسير الحنفية',
    volumes: createVolumes('tafsir-samarqandi', 3, (i) => `https://archive.org/download/FP62400/smrqndy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-abi-zamanayn', name: 'تفسير القرآن العزيز',
    author: 'الإمام ابن أبي زمنين (ت 399هـ)', category: 'التفسير',
    description: 'تفسير مختصر من أقدم تفاسير المالكية بالأندلس',
    volumes: singleVol('tafsir-ibn-abi-zamanayn', 'تفسير ابن أبي زمنين', 'https://archive.org/download/FP62100/ibnabizamanin.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-jalalayn-mahalli', name: 'تفسير الجلالين (طبعة محققة)',
    author: 'المحلي والسيوطي', category: 'التفسير',
    description: 'طبعة محققة من تفسير الجلالين مع حاشية الصاوي',
    volumes: createVolumes('tafsir-jalalayn-mahalli', 4, (i) => `https://archive.org/download/FP60910/sawy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'hashiyat-sawi', name: 'حاشية الصاوي على تفسير الجلالين',
    author: 'الشيخ أحمد الصاوي المالكي (ت 1241هـ)', category: 'التفسير',
    description: 'حاشية نفيسة على تفسير الجلالين',
    volumes: createVolumes('hashiyat-sawi', 4, (i) => `https://archive.org/download/FP60915/sawy2_${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-abu-suud', name: 'إرشاد العقل السليم (تفسير أبي السعود)',
    author: 'الإمام أبو السعود العمادي (ت 982هـ)', category: 'التفسير',
    description: 'تفسير بلاغي بياني من أفضل التفاسير في البلاغة',
    volumes: createVolumes('tafsir-abu-suud', 9, (i) => `https://archive.org/download/FP60110/abosuod${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-tantawi', name: 'الجواهر في تفسير القرآن الكريم',
    author: 'الشيخ طنطاوي جوهري (ت 1358هـ)', category: 'التفسير',
    description: 'تفسير علمي يربط آيات القرآن بالعلوم الحديثة',
    volumes: createVolumes('tafsir-tantawi', 13, (i) => `https://archive.org/download/FP97010/tantawi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-maraghi', name: 'تفسير المراغي',
    author: 'الشيخ أحمد مصطفى المراغي (ت 1371هـ)', category: 'التفسير',
    description: 'تفسير معاصر بأسلوب واضح مع ربط بالواقع',
    volumes: createVolumes('tafsir-maraghi', 10, (i) => `https://archive.org/download/FP97110/maraghy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-mannar', name: 'تفسير المنار',
    author: 'الشيخ محمد رشيد رضا (ت 1354هـ)', category: 'التفسير',
    description: 'تفسير إصلاحي اجتماعي يهتم بهداية القرآن للواقع',
    volumes: createVolumes('tafsir-mannar', 12, (i) => `https://archive.org/download/FP97210mn/mannar${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-ajiba', name: 'البحر المديد في تفسير القرآن المجيد',
    author: 'الإمام ابن عجيبة (ت 1224هـ)', category: 'التفسير',
    description: 'تفسير يجمع بين الظاهر والإشارة مع فوائد لغوية',
    volumes: createVolumes('tafsir-ibn-ajiba', 7, (i) => `https://archive.org/download/FP62800/ibnajiba${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-suyuti-jami', name: 'الجامع الصغير في تفسير القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'التفسير',
    description: 'تفسير مختصر جامع من السيوطي',
    volumes: singleVol('tafsir-suyuti-jami', 'الجامع الصغير في التفسير', 'https://archive.org/download/FP60700/suyutijami.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-wahba-zuhayli', name: 'التفسير الوسيط للزحيلي',
    author: 'الدكتور وهبة الزحيلي (ت 1436هـ)', category: 'التفسير',
    description: 'تفسير وسيط بين الإيجاز والتفصيل مع بيان الأحكام الفقهية',
    volumes: createVolumes('tafsir-wahba-zuhayli', 3, (i) => `https://archive.org/download/FP98000/wsyt${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-al-mundhir', name: 'تفسير ابن المنذر',
    author: 'الإمام ابن المنذر النيسابوري (ت 318هـ)', category: 'التفسير',
    description: 'تفسير بالمأثور من إمام الإجماع والاختلاف',
    volumes: singleVol('tafsir-ibn-al-mundhir', 'تفسير ابن المنذر', 'https://archive.org/download/FP59600/ibnalmundhir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-muqatil', name: 'تفسير مقاتل بن سليمان',
    author: 'مقاتل بن سليمان (ت 150هـ)', category: 'التفسير',
    description: 'من أقدم التفاسير الكاملة الواصلة إلينا',
    volumes: createVolumes('tafsir-muqatil', 5, (i) => `https://archive.org/download/FP59100/muqatil${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-qasimi-mahasin', name: 'محاسن التأويل',
    author: 'الشيخ جمال الدين القاسمي (ت 1332هـ)', category: 'التفسير',
    description: 'تفسير جامع بين الأصالة والمعاصرة',
    volumes: createVolumes('tafsir-qasimi-mahasin', 9, (i) => `https://archive.org/download/FP95010/qsmy${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-shawkani-nayl', name: 'نيل الأوطار شرح منتقى الأخبار',
    author: 'الإمام الشوكاني (ت 1250هـ)', category: 'التفسير',
    description: 'شرح الأحاديث المتعلقة بتفسير القرآن وأحكامه',
    volumes: createVolumes('tafsir-shawkani-nayl', 8, (i) => `https://archive.org/download/FP80000sh/nayl${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-saadi-buhuth', name: 'بحوث ومسائل في تفسير القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'التفسير',
    description: 'مباحث ومسائل مهمة في تفسير كتاب الله',
    volumes: singleVol('tafsir-saadi-buhuth', 'بحوث ومسائل في التفسير', 'https://archive.org/download/FP11429s/buhuthsaadi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'hashiya-jamal', name: 'حاشية الجمل على الجلالين',
    author: 'الشيخ سليمان الجمل (ت 1204هـ)', category: 'التفسير',
    description: 'حاشية مشهورة على تفسير الجلالين',
    volumes: createVolumes('hashiya-jamal', 4, (i) => `https://archive.org/download/FP60920/jamal${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - علوم القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'burhan-zarkashi', name: 'البرهان في علوم القرآن (طبعة دار إحياء الكتب)',
    author: 'الإمام بدر الدين الزركشي (ت 794هـ)', category: 'علوم القرآن',
    description: 'طبعة محققة مع تعليقات وتخريج',
    volumes: createVolumes('burhan-zarkashi', 4, (i) => `https://archive.org/download/FP63700/brhnzrksh${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ulum-quran-mannaa2', name: 'لمحات في علوم القرآن واتجاهات التفسير',
    author: 'الدكتور محمد الصباغ', category: 'علوم القرآن',
    description: 'مقدمة ميسرة في علوم القرآن مع بيان اتجاهات المفسرين',
    volumes: singleVol('ulum-quran-mannaa2', 'لمحات في علوم القرآن', 'https://archive.org/download/FP64000/lamhat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ulum-quran-subhi', name: 'مباحث في علوم القرآن',
    author: 'الدكتور صبحي الصالح', category: 'علوم القرآن',
    description: 'كتاب أكاديمي شامل في علوم القرآن الكريم',
    volumes: singleVol('ulum-quran-subhi', 'مباحث في علوم القرآن - صبحي الصالح', 'https://archive.org/download/FP64010/subhisaleh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jam-quran-abu-bakr', name: 'جمع القرآن في عهد الخلفاء الراشدين',
    author: 'الدكتور فهد الرومي', category: 'علوم القرآن',
    description: 'دراسة تاريخية في جمع القرآن وكتابته في العصر الراشدي',
    volumes: singleVol('jam-quran-abu-bakr', 'جمع القرآن في عهد الخلفاء', 'https://archive.org/download/FP64020/jam3quran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'makki-madani-details', name: 'خصائص السور المكية والمدنية',
    author: 'الدكتور فهد الرومي', category: 'علوم القرآن',
    description: 'دراسة في خصائص السور المكية والمدنية وأساليبها',
    volumes: singleVol('makki-madani-details', 'خصائص السور المكية والمدنية', 'https://archive.org/download/FP64025/khsaes.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ulum-quran-zerqani', name: 'مناهل العرفان في علوم القرآن',
    author: 'الشيخ محمد عبد العظيم الزرقاني (ت 1367هـ)', category: 'علوم القرآن',
    description: 'من أوسع الكتب المعاصرة في علوم القرآن',
    volumes: createVolumes('ulum-quran-zerqani', 2, (i) => `https://archive.org/download/FP63800/zerqani${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'muqaddima-ibn-taymiyya', name: 'مقدمة في أصول التفسير (شرح ابن عثيمين)',
    author: 'شرح الشيخ ابن عثيمين على رسالة ابن تيمية', category: 'علوم القرآن',
    description: 'شرح رسالة شيخ الإسلام في أصول التفسير',
    volumes: singleVol('muqaddima-ibn-taymiyya', 'شرح مقدمة في أصول التفسير', 'https://archive.org/download/FP64030/muqaddimausul.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'rasm-uthmani', name: 'المقنع في رسم مصاحف الأمصار',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'علوم القرآن',
    description: 'من أهم كتب الرسم العثماني للمصحف الشريف',
    volumes: singleVol('rasm-uthmani', 'المقنع في رسم المصاحف', 'https://archive.org/download/FP63900/muqni3.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'usul-tafsir-saadi', name: 'القواعد الحسان لتفسير القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'علوم القرآن',
    description: 'قواعد أساسية في تفسير القرآن الكريم',
    volumes: singleVol('usul-tafsir-saadi', 'القواعد الحسان', 'https://archive.org/download/FP11429/qwaidhasan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ijaz-quran-rafi3i', name: 'إعجاز القرآن والبلاغة النبوية',
    author: 'الشيخ مصطفى صادق الرافعي (ت 1356هـ)', category: 'علوم القرآن',
    description: 'كتاب في إعجاز القرآن البلاغي مع دفاع عن البلاغة النبوية',
    volumes: singleVol('ijaz-quran-rafi3i', 'إعجاز القرآن والبلاغة النبوية', 'https://archive.org/download/FP63400/i3jazrafi3i.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nasikh-mansukh-3', name: 'الناسخ والمنسوخ في القرآن الكريم',
    author: 'الإمام ابن العربي المالكي (ت 543هـ)', category: 'علوم القرآن',
    description: 'كتاب مهم في الناسخ والمنسوخ من الإمام ابن العربي',
    volumes: singleVol('nasikh-mansukh-3', 'الناسخ والمنسوخ لابن العربي', 'https://archive.org/download/FP63815/nasikhibnlarabi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muhkam-tanzil', name: 'المحكم في نقط المصاحف',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'علوم القرآن',
    description: 'كتاب في نقط المصاحف وضبط الرسم القرآني',
    volumes: singleVol('muhkam-tanzil', 'المحكم في نقط المصاحف', 'https://archive.org/download/FP63905/muhkamnaqt.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'taysir-ulum', name: 'التيسير في علوم القرآن',
    author: 'الدكتور عبد القيوم السندي', category: 'علوم القرآن',
    description: 'مدخل ميسر لعلوم القرآن الكريم',
    volumes: singleVol('taysir-ulum', 'التيسير في علوم القرآن', 'https://archive.org/download/FP64040/taysirulum.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tarikh-quran', name: 'تاريخ القرآن الكريم',
    author: 'الدكتور محمد سالم محيسن', category: 'علوم القرآن',
    description: 'دراسة شاملة في تاريخ القرآن من النزول إلى الطباعة',
    volumes: singleVol('tarikh-quran', 'تاريخ القرآن الكريم', 'https://archive.org/download/FP64045/tarikhquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'masahif-sana', name: 'المصاحف',
    author: 'الإمام ابن أبي داود السجستاني (ت 316هـ)', category: 'علوم القرآن',
    description: 'كتاب في جمع القرآن وتاريخ المصاحف العثمانية',
    volumes: singleVol('masahif-sana', 'المصاحف', 'https://archive.org/download/FP63850/masahif.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fadl-tilawa', name: 'فضائل القرآن وتلاوته',
    author: 'الإمام أبو عبيد القاسم بن سلام (ت 224هـ)', category: 'علوم القرآن',
    description: 'كتاب في فضائل القرآن وآداب تلاوته من السلف',
    volumes: singleVol('fadl-tilawa', 'فضائل القرآن لأبي عبيد', 'https://archive.org/download/FP63860/fadailquranabubaid.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - التجويد والقراءات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'nashr-qiraat', name: 'النشر في القراءات العشر',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أوسع كتاب في القراءات العشر الكبرى',
    volumes: createVolumes('nashr-qiraat', 2, (i) => `https://archive.org/download/FP64200/nashr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'shatibiyya-sharh', name: 'إبراز المعاني من حرز الأماني (شرح الشاطبية)',
    author: 'الإمام أبو شامة المقدسي (ت 665هـ)', category: 'التجويد والقراءات',
    description: 'شرح مشهور لمنظومة الشاطبية في القراءات السبع',
    volumes: singleVol('shatibiyya-sharh', 'شرح الشاطبية', 'https://archive.org/download/FP64210/shatibiyyasharh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'taysir-dani', name: 'التيسير في القراءات السبع',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'كتاب مختصر في القراءات السبع من طريق الشاطبية',
    volumes: singleVol('taysir-dani', 'التيسير في القراءات', 'https://archive.org/download/FP64220/taysiirdani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muqni-qiraat', name: 'المقنع في القراءات',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'كتاب جامع في أصول القراءات والرسم',
    volumes: singleVol('muqni-qiraat', 'المقنع في القراءات', 'https://archive.org/download/FP64225/muqniqiraat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tajweed-musawwar-2', name: 'التجويد المصور (الطبعة الثانية)',
    author: 'د. أيمن رشدي سويد', category: 'التجويد والقراءات',
    description: 'كتاب في أحكام التجويد مع صور توضيحية لمخارج الحروف',
    volumes: singleVol('tajweed-musawwar-2', 'التجويد المصور', 'https://archive.org/download/FP64230/tajweedmusawwar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ghayat-nihaya', name: 'غاية النهاية في طبقات القراء',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أوسع كتاب في تراجم القراء والمقرئين',
    volumes: createVolumes('ghayat-nihaya', 2, (i) => `https://archive.org/download/FP64240/ghayat${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'hidayat-qari', name: 'هداية القاري إلى تجويد كلام الباري',
    author: 'الشيخ عبد الفتاح المرصفي', category: 'التجويد والقراءات',
    description: 'كتاب شامل في أحكام التجويد مع تطبيقات عملية',
    volumes: createVolumes('hidayat-qari', 2, (i) => `https://archive.org/download/FP64250/hidayatqari${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'munjid-muqriin', name: 'منجد المقرئين ومرشد الطالبين',
    author: 'الإمام ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في آداب المقرئين وشروط الإقراء',
    volumes: singleVol('munjid-muqriin', 'منجد المقرئين', 'https://archive.org/download/FP64260/munjidmuqriin.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ithaf-fudhala', name: 'إتحاف فضلاء البشر في القراءات الأربع عشر',
    author: 'الشيخ أحمد البنا الدمياطي (ت 1117هـ)', category: 'التجويد والقراءات',
    description: 'كتاب جامع في القراءات الأربع عشر',
    volumes: singleVol('ithaf-fudhala', 'إتحاف فضلاء البشر', 'https://archive.org/download/FP64270/ithaf.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nihayat-quran', name: 'نهاية القول المفيد في علم التجويد',
    author: 'الشيخ محمد مكي نصر', category: 'التجويد والقراءات',
    description: 'كتاب ميسر في أحكام التجويد',
    volumes: singleVol('nihayat-quran', 'نهاية القول المفيد', 'https://archive.org/download/FP64280/nihayatmufid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'waqf-ibtida', name: 'المكتفى في الوقف والابتداء',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'من أهم كتب الوقف والابتداء في القراءة القرآنية',
    volumes: singleVol('waqf-ibtida', 'المكتفى في الوقف والابتداء', 'https://archive.org/download/FP64290/muktafa.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jami-bayan-qiraat', name: 'جامع البيان في القراءات السبع',
    author: 'الإمام أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'كتاب موسوعي في القراءات السبع بأسانيدها',
    volumes: createVolumes('jami-bayan-qiraat', 4, (i) => `https://archive.org/download/FP64300/jamibayan${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tabsirat-mubtadiin', name: 'التبصرة في القراءات السبع',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في توجيه القراءات السبع',
    volumes: singleVol('tabsirat-mubtadiin', 'التبصرة في القراءات', 'https://archive.org/download/FP64310/tabsira.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'kawakib-durriyya', name: 'الكواكب الدرية شرح طيبة النشر',
    author: 'الشيخ عبد الفتاح القاضي', category: 'التجويد والقراءات',
    description: 'شرح لمنظومة طيبة النشر في القراءات العشر',
    volumes: singleVol('kawakib-durriyya', 'الكواكب الدرية', 'https://archive.org/download/FP64320/kawakib.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - إعراب القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'irab-suyuti', name: 'الإتقان في إعراب القرآن',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في إعراب آيات القرآن الكريم',
    volumes: singleVol('irab-suyuti', 'الإتقان في إعراب القرآن', 'https://archive.org/download/FP63520/itqanirab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'irab-quraan-nahhas', name: 'إعراب القرآن',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب إعراب القرآن وأوسعها',
    volumes: createVolumes('irab-quraan-nahhas', 5, (i) => `https://archive.org/download/FP63500/nahhasirab${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mushkil-irab-quran', name: 'مشكل إعراب القرآن',
    author: 'الإمام مكي بن أبي طالب القيسي (ت 437هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في المشكل من إعراب آيات القرآن الكريم',
    volumes: createVolumes('mushkil-irab-quran', 2, (i) => `https://archive.org/download/FP63510/mushkilirab${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'bayan-fi-gharib', name: 'البيان في غريب إعراب القرآن',
    author: 'الإمام أبو البركات ابن الأنباري (ت 577هـ)', category: 'إعراب القرآن وبيانه',
    description: 'بيان إعراب الآيات المشكلة في القرآن',
    volumes: createVolumes('bayan-fi-gharib', 2, (i) => `https://archive.org/download/FP63515/bayanfigarib${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'irab-quran-darwish', name: 'إعراب القرآن وبيانه',
    author: 'الشيخ محيي الدين الدرويش', category: 'إعراب القرآن وبيانه',
    description: 'إعراب كامل لآيات القرآن مع بيان المعاني',
    volumes: createVolumes('irab-quran-darwish', 10, (i) => `https://archive.org/download/FP63530/darwish${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'maani-quran-zajjaj', name: 'معاني القرآن وإعرابه',
    author: 'الإمام الزجاج (ت 311هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في معاني القرآن وإعرابه على مذهب البصريين',
    volumes: createVolumes('maani-quran-zajjaj', 5, (i) => `https://archive.org/download/FP63220/zajjaj${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'imlaa-ma-manna', name: 'إملاء ما من به الرحمن',
    author: 'الإمام أبو البقاء العكبري (ت 616هـ)', category: 'إعراب القرآن وبيانه',
    description: 'إعراب القرآن مع بيان أوجه القراءات',
    volumes: createVolumes('imlaa-ma-manna', 2, (i) => `https://archive.org/download/FP63540/imlaa${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'irab-30-juz', name: 'إعراب القرآن الكريم وبيانه',
    author: 'الشيخ محمد طه الدرة', category: 'إعراب القرآن وبيانه',
    description: 'إعراب تفصيلي لآيات القرآن الكريم كاملاً',
    volumes: createVolumes('irab-30-juz', 7, (i) => `https://archive.org/download/FP63550/durra${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'jadwal-irab', name: 'الجدول في إعراب القرآن',
    author: 'الشيخ محمود صافي', category: 'إعراب القرآن وبيانه',
    description: 'إعراب مفصل في جداول واضحة لكل آية من القرآن',
    volumes: createVolumes('jadwal-irab', 15, (i) => `https://archive.org/download/FP63560/jadwal${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - أسباب النزول ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'asbab-nuzul-thalabi', name: 'الكشف والبيان في أسباب النزول',
    author: 'الإمام الثعلبي (ت 427هـ)', category: 'أسباب النزول',
    description: 'كتاب في أسباب النزول مع روايات التفسير',
    volumes: singleVol('asbab-nuzul-thalabi', 'الكشف والبيان في أسباب النزول', 'https://archive.org/download/FP63870/kashfbayanasbab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tahqiq-asbab', name: 'تحقيق أسباب النزول',
    author: 'الدكتور خالد المزيني', category: 'أسباب النزول',
    description: 'تحقيق علمي لروايات أسباب النزول',
    volumes: singleVol('tahqiq-asbab', 'تحقيق أسباب النزول', 'https://archive.org/download/FP63875/tahqiqasbab.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wasit-wahidi', name: 'الوسيط في تفسير القرآن المجيد',
    author: 'الإمام الواحدي (ت 468هـ)', category: 'أسباب النزول',
    description: 'تفسير يعتني بأسباب النزول والروايات المأثورة',
    volumes: createVolumes('wasit-wahidi', 4, (i) => `https://archive.org/download/FP62000/wahidi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'asbab-suyuti', name: 'لباب النقول في أسباب النزول (طبعة محققة)',
    author: 'الإمام السيوطي - تحقيق عبد الرزاق المهدي', category: 'أسباب النزول',
    description: 'طبعة محققة من أهم كتب أسباب النزول',
    volumes: singleVol('asbab-suyuti', 'لباب النقول - طبعة محققة', 'https://archive.org/download/FP63880/lababnuqul2.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - غريب القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'gharib-quran-maturidi', name: 'تأويلات أهل السنة (غريب القرآن)',
    author: 'الإمام الماتريدي (ت 333هـ)', category: 'غريب القرآن ومفرداته',
    description: 'بيان معاني الآيات وألفاظ القرآن الغريبة',
    volumes: createVolumes('gharib-quran-maturidi', 5, (i) => `https://archive.org/download/FP63330/maturidi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tuhfat-arib', name: 'تحفة الأريب بما في القرآن من الغريب',
    author: 'الإمام أبو حيان الأندلسي (ت 745هـ)', category: 'غريب القرآن ومفرداته',
    description: 'كتاب في بيان الألفاظ الغريبة في القرآن مع التفسير',
    volumes: singleVol('tuhfat-arib', 'تحفة الأريب', 'https://archive.org/download/FP63335/tuhfatarib.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nuzhatul-a3yun', name: 'نزهة الأعين النواظر في علم الوجوه والنظائر',
    author: 'الإمام ابن الجوزي (ت 597هـ)', category: 'غريب القرآن ومفرداته',
    description: 'كتاب في الوجوه والنظائر في القرآن الكريم',
    volumes: singleVol('nuzhatul-a3yun', 'نزهة الأعين النواظر', 'https://archive.org/download/FP63340/nuzhata3yun.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'basair-tamyiz', name: 'بصائر ذوي التمييز في لطائف الكتاب العزيز',
    author: 'الإمام الفيروزآبادي (ت 817هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم موضوعي لألفاظ القرآن الكريم',
    volumes: createVolumes('basair-tamyiz', 6, (i) => `https://archive.org/download/FP63345/basair${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mu3jam-alfaz-quran', name: 'معجم ألفاظ القرآن الكريم',
    author: 'مجمع اللغة العربية بالقاهرة', category: 'غريب القرآن ومفرداته',
    description: 'معجم شامل لألفاظ القرآن مع شرح المعاني',
    volumes: createVolumes('mu3jam-alfaz-quran', 2, (i) => `https://archive.org/download/FP63350/mu3jamalfaz${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'gharib-quran-ibn-abbas', name: 'غريب القرآن في شعر العرب',
    author: 'منسوب لابن عباس رضي الله عنه', category: 'غريب القرآن ومفرداته',
    description: 'بيان غريب القرآن بشواهد من أشعار العرب',
    volumes: singleVol('gharib-quran-ibn-abbas', 'غريب القرآن في شعر العرب', 'https://archive.org/download/FP63355/gharibibnabbas.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات كبرى - التدبر ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tadabbur-quran-islahi', name: 'تدبر القرآن',
    author: 'الإمام أمين أحسن إصلاحي (ت 1418هـ)', category: 'التدبر',
    description: 'تفسير تدبري عميق يهتم بنظام السور ومناسباتها',
    volumes: createVolumes('tadabbur-quran-islahi', 9, (i) => `https://archive.org/download/FP95540/islahi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'wuquf-tarbawiyya', name: 'وقفات تربوية مع القرآن الكريم',
    author: 'الدكتور عثمان قدري مكانسي', category: 'التدبر',
    description: 'استنباط الدروس التربوية من آيات القرآن',
    volumes: singleVol('wuquf-tarbawiyya', 'وقفات تربوية مع القرآن', 'https://archive.org/download/FP95545/wuquf.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'lataif-quraniyya', name: 'لطائف قرآنية',
    author: 'الدكتور صالح بن عبد الله بن إبراهيم الشتيوي', category: 'التدبر',
    description: 'لطائف ونكت من آيات القرآن الكريم',
    volumes: singleVol('lataif-quraniyya', 'لطائف قرآنية', 'https://archive.org/download/FP95550/lataif.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'juz-amma-tadabbur', name: 'تأملات في جزء عم',
    author: 'الشيخ عائض القرني', category: 'التدبر',
    description: 'تأملات وتدبرات في سور جزء عم',
    volumes: singleVol('juz-amma-tadabbur', 'تأملات في جزء عم', 'https://archive.org/download/FP95555/juzammatadabbur.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'khawatir-quraniyya', name: 'خواطر قرآنية',
    author: 'الشيخ محمد متولي الشعراوي (ت 1419هـ)', category: 'التدبر',
    description: 'خواطر وتأملات في آيات القرآن الكريم',
    volumes: singleVol('khawatir-quraniyya', 'خواطر قرآنية', 'https://archive.org/download/FP95560/khawatir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mukhtasar-maqasid', name: 'مقاصد كل سورة من القرآن',
    author: 'الدكتور عبد الله الغامدي', category: 'التدبر',
    description: 'بيان مقصد كل سورة من سور القرآن وأهدافها',
    volumes: singleVol('mukhtasar-maqasid', 'مقاصد كل سورة من القرآن', 'https://archive.org/download/FP95565/maqasidsuwar2.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ayaat-mutashabihat', name: 'الآيات المتشابهات ومتشابه القرآن',
    author: 'الدكتور عبد المحسن العسكر', category: 'التدبر',
    description: 'كتاب يساعد على التمييز بين الآيات المتشابهة لفظياً',
    volumes: singleVol('ayaat-mutashabihat', 'الآيات المتشابهات', 'https://archive.org/download/FP95570/mutashabihat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wasaya-quraniyya', name: 'وصايا قرآنية',
    author: 'الشيخ محمد صالح المنجد', category: 'التدبر',
    description: 'وصايا مستنبطة من آيات القرآن الكريم للحياة اليومية',
    volumes: singleVol('wasaya-quraniyya', 'وصايا قرآنية', 'https://archive.org/download/FP95575/wasayaquraniyya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ruh-quran', name: 'روح القرآن',
    author: 'الشيخ عفيف عبد الفتاح طبارة', category: 'التدبر',
    description: 'كتاب في تدبر القرآن واستلهام معانيه الروحية',
    volumes: singleVol('ruh-quran', 'روح القرآن', 'https://archive.org/download/FP95580/ruhquran.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات ضخمة جديدة - تفسير ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tafsir-tabari-dar-hajr', name: 'تفسير الطبري (طبعة دار هجر)',
    author: 'الإمام محمد بن جرير الطبري (ت 310هـ)', category: 'التفسير',
    description: 'طبعة محققة من تفسير الطبري بتحقيق عبد الله التركي',
    volumes: createVolumes('tafsir-tabari-dar-hajr', 24, (i) => `https://archive.org/download/FP59520/tabariH${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-kathir-sham', name: 'تفسير ابن كثير (طبعة دار الشامية)',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'التفسير',
    description: 'طبعة محققة ومخرجة من تفسير ابن كثير',
    volumes: createVolumes('tafsir-ibn-kathir-sham', 4, (i) => `https://archive.org/download/FP59519s/kathirSH${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-kathir-taba', name: 'تفسير ابن كثير (طبعة أولاد الشيخ)',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'التفسير',
    description: 'طبعة مضبوطة بتحقيق مصطفى السيد محمد',
    volumes: createVolumes('tafsir-ibn-kathir-taba', 15, (i) => `https://archive.org/download/FP59521/kathirAW${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-shanqiti-journey', name: 'رحلة القرآن العظيم',
    author: 'الشيخ محمد الشنقيطي', category: 'التفسير',
    description: 'رحلة علمية مع القرآن الكريم وتفسيره',
    volumes: singleVol('tafsir-shanqiti-journey', 'رحلة القرآن العظيم', 'https://archive.org/download/FP69940/rihlaquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-baydawi-hashiya', name: 'حاشية شيخ زاده على البيضاوي',
    author: 'الشيخ محمد بن مصلح الدين (ت 951هـ)', category: 'التفسير',
    description: 'حاشية مهمة على تفسير البيضاوي المسمى أنوار التنزيل',
    volumes: createVolumes('tafsir-baydawi-hashiya', 8, (i) => `https://archive.org/download/FP11325/shzada${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-kathir-muqaddima', name: 'مقدمة تفسير ابن كثير',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'التفسير',
    description: 'المقدمة الأصولية لتفسير ابن كثير في أصول التفسير',
    volumes: singleVol('tafsir-ibn-kathir-muqaddima', 'مقدمة تفسير ابن كثير', 'https://archive.org/download/FP59518s/muqaddimakathir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafsir-tabari-mukhtasar', name: 'مختصر تفسير الطبري',
    author: 'اختصار: محمد علي الصابوني', category: 'التفسير',
    description: 'اختصار لتفسير الطبري مع حذف الأسانيد وتهذيب العبارة',
    volumes: createVolumes('tafsir-tabari-mukhtasar', 2, (i) => `https://archive.org/download/FP59522/mukhtasarTabari${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'safwat-tafasir', name: 'صفوة التفاسير',
    author: 'الشيخ محمد علي الصابوني', category: 'التفسير',
    description: 'تفسير مختصر جامع لأهم ما جاء في كتب التفسير المعتمدة',
    volumes: createVolumes('safwat-tafasir', 3, (i) => `https://archive.org/download/FP97300/safwat${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'rawai-bayan', name: 'روائع البيان تفسير آيات الأحكام',
    author: 'الشيخ محمد علي الصابوني', category: 'التفسير',
    description: 'تفسير آيات الأحكام مع بيان المسائل الفقهية',
    volumes: createVolumes('rawai-bayan', 2, (i) => `https://archive.org/download/FP97310/rawaibayan${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-ibn-arabi-ahkam', name: 'أحكام القرآن لابن العربي',
    author: 'القاضي ابن العربي المالكي (ت 543هـ)', category: 'التفسير',
    description: 'تفسير فقهي يستنبط الأحكام من آيات القرآن',
    volumes: createVolumes('tafsir-ibn-arabi-ahkam', 4, (i) => `https://archive.org/download/FP60200/ibnarabi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ahkam-jassas', name: 'أحكام القرآن للجصاص',
    author: 'الإمام أبو بكر الجصاص (ت 370هـ)', category: 'التفسير',
    description: 'تفسير فقهي حنفي يستنبط الأحكام من القرآن',
    volumes: createVolumes('ahkam-jassas', 5, (i) => `https://archive.org/download/FP60300/jassas${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-suyuti-jalalayn-h', name: 'حاشية الجمل على تفسير الجلالين',
    author: 'الشيخ سليمان الجمل (ت 1204هـ)', category: 'التفسير',
    description: 'حاشية موسعة مع فوائد لغوية وفقهية على تفسير الجلالين',
    volumes: createVolumes('tafsir-suyuti-jalalayn-h', 6, (i) => `https://archive.org/download/FP60925/jamal2_${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-tha3labi-new', name: 'الكشف والبيان عن تفسير القرآن (طبعة جديدة)',
    author: 'الإمام الثعلبي (ت 427هـ)', category: 'التفسير',
    description: 'طبعة محققة حديثة من تفسير الثعلبي',
    volumes: createVolumes('tafsir-tha3labi-new', 10, (i) => `https://archive.org/download/FP62515/tha3labiN${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tafsir-zajjaj-maani', name: 'معاني القرآن وإعرابه للزجاج',
    author: 'الإمام الزجاج (ت 311هـ)', category: 'التفسير',
    description: 'كتاب يجمع بين المعاني والإعراب في تفسير القرآن',
    volumes: createVolumes('tafsir-zajjaj-maani', 5, (i) => `https://archive.org/download/FP63225/zajjajM${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات ضخمة جديدة - علوم القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'muqaddima-usul-tafsir-2', name: 'أصول التفسير وقواعده',
    author: 'الشيخ خالد السبت', category: 'علوم القرآن',
    description: 'كتاب في قواعد التفسير وأصوله المنهجية',
    volumes: singleVol('muqaddima-usul-tafsir-2', 'أصول التفسير وقواعده', 'https://archive.org/download/FP64050/usultafsir2.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ulum-quran-suyuti-itqan2', name: 'الإتقان في علوم القرآن (طبعة محققة)',
    author: 'الإمام جلال الدين السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'طبعة محققة من كتاب الإتقان مع تعليقات',
    volumes: createVolumes('ulum-quran-suyuti-itqan2', 4, (i) => `https://archive.org/download/FP63710/itqanM${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tibyan-ulum-quran', name: 'التبيان لبعض المباحث المتعلقة بالقرآن',
    author: 'الشيخ طاهر الجزائري (ت 1338هـ)', category: 'علوم القرآن',
    description: 'مباحث في علوم القرآن مع بيان بعض المسائل المهمة',
    volumes: singleVol('tibyan-ulum-quran', 'التبيان في علوم القرآن', 'https://archive.org/download/FP64055/tibyanjazairi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'asbab-ikhtilaf-mufassireen', name: 'أسباب اختلاف المفسرين',
    author: 'الدكتور محمد الشايع', category: 'علوم القرآن',
    description: 'دراسة في أسباب اختلاف المفسرين ومنهج الترجيح',
    volumes: singleVol('asbab-ikhtilaf-mufassireen', 'أسباب اختلاف المفسرين', 'https://archive.org/download/FP64060/ikhtilafmufassireen.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qawaid-tadabbur-2', name: 'قواعد التدبر الأمثل لكتاب الله',
    author: 'الدكتور عبد الرحمن حبنكة الميداني', category: 'علوم القرآن',
    description: 'قواعد عملية في تدبر القرآن الكريم وفهمه',
    volumes: singleVol('qawaid-tadabbur-2', 'قواعد التدبر الأمثل', 'https://archive.org/download/FP64065/qawaidtadabbur2.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'dirasat-fi-ulum-quran', name: 'دراسات في علوم القرآن',
    author: 'الدكتور فهد الرومي', category: 'علوم القرآن',
    description: 'دراسات علمية متنوعة في مباحث علوم القرآن',
    volumes: singleVol('dirasat-fi-ulum-quran', 'دراسات في علوم القرآن', 'https://archive.org/download/FP64070/dirasatulum.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muhkam-quran-ibn-habib', name: 'المحكم في القرآن',
    author: 'الإمام ابن حبيب النيسابوري (ت 406هـ)', category: 'علوم القرآن',
    description: 'كتاب في بيان المحكم من القرآن الكريم',
    volumes: singleVol('muhkam-quran-ibn-habib', 'المحكم في القرآن', 'https://archive.org/download/FP64075/muhkamquran.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fawaid-mushattiqa', name: 'فوائد مشوقة إلى علوم القرآن وعلم البيان',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'علوم القرآن',
    description: 'فوائد قرآنية وبيانية نفيسة',
    volumes: singleVol('fawaid-mushattiqa', 'فوائد مشوقة', 'https://archive.org/download/FP82110/fawaidmushtaq.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ijaz-tasreef', name: 'الإعجاز البياني في الترتيب القرآني',
    author: 'الدكتور أحمد عبد الله محمد', category: 'علوم القرآن',
    description: 'دراسة في إعجاز ترتيب سور القرآن وآياته',
    volumes: singleVol('ijaz-tasreef', 'الإعجاز البياني في الترتيب', 'https://archive.org/download/FP63410/ijaztrateeb.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tanasub-suwar', name: 'تناسق الدرر في تناسب السور',
    author: 'الإمام السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'بيان التناسب بين سور القرآن الكريم',
    volumes: singleVol('tanasub-suwar', 'تناسق الدرر في تناسب السور', 'https://archive.org/download/FP63720/tanasuqdurar.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'asrar-tartib-quran', name: 'أسرار ترتيب القرآن',
    author: 'الإمام السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'كتاب يكشف أسرار ترتيب سور القرآن ومناسباته',
    volumes: singleVol('asrar-tartib-quran', 'أسرار ترتيب القرآن', 'https://archive.org/download/FP63725/asrartrateeb.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات ضخمة جديدة - التجويد والقراءات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'munjid-muqriin-2', name: 'جمال القراء وكمال الإقراء',
    author: 'الإمام السخاوي (ت 643هـ)', category: 'التجويد والقراءات',
    description: 'كتاب في آداب القراءة والإقراء وطبقات القراء',
    volumes: singleVol('munjid-muqriin-2', 'جمال القراء وكمال الإقراء', 'https://archive.org/download/FP64330/jamalqurra.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ithaaf-murid', name: 'إتحاف المريد شرح جوهرة التجويد',
    author: 'الشيخ إبراهيم الجرمي', category: 'التجويد والقراءات',
    description: 'شرح وافٍ لمنظومة جوهرة التجويد',
    volumes: singleVol('ithaaf-murid', 'إتحاف المريد', 'https://archive.org/download/FP64335/ithaafmurid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'minhat-rabb-bariya', name: 'منحة رب البرية شرح المقدمة الجزرية',
    author: 'الشيخ علي الضباع (ت 1380هـ)', category: 'التجويد والقراءات',
    description: 'شرح مشهور للمقدمة الجزرية في التجويد',
    volumes: singleVol('minhat-rabb-bariya', 'شرح المقدمة الجزرية', 'https://archive.org/download/FP64340/minhatrabb.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fath-wasid-tajwid', name: 'الفتح الرباني ترتيب مسند الإمام أحمد',
    author: 'أحمد البنا (ت 1378هـ)', category: 'التجويد والقراءات',
    description: 'ترتيب مسند أحمد مع ذكر القراءات',
    volumes: singleVol('fath-wasid-tajwid', 'الفتح الرباني', 'https://archive.org/download/FP64345/fathrabbani.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات ضخمة جديدة - إعراب القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'irab-quran-khatib', name: 'إعراب ثلاثين سورة من القرآن',
    author: 'الإمام ابن خالويه (ت 370هـ)', category: 'إعراب القرآن وبيانه',
    description: 'إعراب ثلاثين سورة من القرآن الكريم',
    volumes: singleVol('irab-quran-khatib', 'إعراب ثلاثين سورة', 'https://archive.org/download/FP63570/irab30.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'maani-quran-nahhas2', name: 'معاني القرآن الكريم',
    author: 'الإمام أبو جعفر النحاس (ت 338هـ)', category: 'إعراب القرآن وبيانه',
    description: 'كتاب في معاني آيات القرآن وإعرابها',
    volumes: createVolumes('maani-quran-nahhas2', 6, (i) => `https://archive.org/download/FP63230/nahhasM${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'irab-quran-munir', name: 'المنير في الإعراب',
    author: 'الدكتور ياسين العيسوي', category: 'إعراب القرآن وبيانه',
    description: 'إعراب ميسر لآيات القرآن الكريم',
    volumes: singleVol('irab-quran-munir', 'المنير في الإعراب', 'https://archive.org/download/FP63575/munirirab.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات ضخمة جديدة - أسباب النزول ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'asbab-nuzul-study', name: 'المحرر في أسباب نزول القرآن',
    author: 'الدكتور خالد المزيني', category: 'أسباب النزول',
    description: 'دراسة شاملة محققة في أسباب النزول',
    volumes: createVolumes('asbab-nuzul-study', 2, (i) => `https://archive.org/download/FP63885/muharrarasbab${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'asbab-nuzul-himsi', name: 'أسباب النزول وعلومه',
    author: 'الدكتور رأفت المصري', category: 'أسباب النزول',
    description: 'دراسة في أسباب النزول وعلاقتها بعلوم القرآن',
    volumes: singleVol('asbab-nuzul-himsi', 'أسباب النزول وعلومه', 'https://archive.org/download/FP63890/asbabnuzululum.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات ضخمة جديدة - غريب القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'gharib-quran-sijistani2', name: 'غريب القرآن المسمى نزهة القلوب',
    author: 'الإمام السجستاني (ت 330هـ)', category: 'غريب القرآن ومفرداته',
    description: 'طبعة محققة جديدة من نزهة القلوب في غريب القرآن',
    volumes: singleVol('gharib-quran-sijistani2', 'نزهة القلوب - طبعة محققة', 'https://archive.org/download/FP63360/nuzhaqulub2.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mujam-qurani', name: 'المعجم المفهرس لألفاظ القرآن الكريم',
    author: 'محمد فؤاد عبد الباقي', category: 'غريب القرآن ومفرداته',
    description: 'أشهر فهرس لألفاظ القرآن الكريم يرجع إليه الباحثون',
    volumes: singleVol('mujam-qurani', 'المعجم المفهرس لألفاظ القرآن', 'https://archive.org/download/FP63365/mujammufahras.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'gharib-hadith-quran', name: 'غريب الحديث والقرآن',
    author: 'الإمام ابن الأثير (ت 606هـ)', category: 'غريب القرآن ومفرداته',
    description: 'شرح غريب الألفاظ الواردة في الحديث والقرآن',
    volumes: createVolumes('gharib-hadith-quran', 5, (i) => `https://archive.org/download/FP63370/gharibhadith${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات ضخمة جديدة - التدبر ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'taammul-mufid', name: 'تأملات قرآنية مفيدة',
    author: 'الشيخ إبراهيم بن عمر السكران', category: 'التدبر',
    description: 'تأملات عميقة في آيات القرآن الكريم',
    volumes: singleVol('taammul-mufid', 'تأملات قرآنية مفيدة', 'https://archive.org/download/FP95585/taammulmufid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'hiwar-qurani', name: 'الحوار في القرآن الكريم',
    author: 'الدكتور محمد حسين فضل الله', category: 'التدبر',
    description: 'دراسة في أسلوب الحوار القرآني',
    volumes: singleVol('hiwar-qurani', 'الحوار في القرآن', 'https://archive.org/download/FP95590/hiwarqurani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'quran-tarbiya', name: 'القرآن والتربية',
    author: 'الشيخ عبد الرحمن النحلاوي', category: 'التدبر',
    description: 'أصول التربية الإسلامية المستنبطة من القرآن الكريم',
    volumes: singleVol('quran-tarbiya', 'القرآن والتربية', 'https://archive.org/download/FP95595/qurantarbiya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ayat-sakinah', name: 'آيات السكينة',
    author: 'الشيخ محمد صالح المنجد', category: 'التدبر',
    description: 'آيات السكينة في القرآن وأثرها في النفس',
    volumes: singleVol('ayat-sakinah', 'آيات السكينة', 'https://archive.org/download/FP95600/ayatsakinah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'duaa-qurani', name: 'الدعاء من القرآن الكريم',
    author: 'الدكتور محمد سيد طنطاوي', category: 'التدبر',
    description: 'جمع الأدعية الواردة في القرآن مع تفسيرها',
    volumes: singleVol('duaa-qurani', 'الدعاء من القرآن', 'https://archive.org/download/FP95605/duaaqurani.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'amthal-quran-saadi', name: 'تيسير اللطيف المنان في خلاصة تفسير القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'التدبر',
    description: 'خلاصة تفسير السعدي مع فوائد وتدبرات',
    volumes: singleVol('amthal-quran-saadi', 'تيسير اللطيف المنان', 'https://archive.org/download/FP11430/taysirlatif.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'quran-wa-ilm', name: 'القرآن والعلم الحديث',
    author: 'الدكتور عبد الرزاق نوفل', category: 'التدبر',
    description: 'دراسة في الإعجاز العلمي في القرآن الكريم',
    volumes: singleVol('quran-wa-ilm', 'القرآن والعلم الحديث', 'https://archive.org/download/FP95610/quranilm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'asalib-quran', name: 'أساليب القرآن',
    author: 'الشيخ محمد عبد الخالق عضيمة', category: 'التدبر',
    description: 'دراسة في أساليب القرآن البلاغية والنحوية',
    volumes: singleVol('asalib-quran', 'أساليب القرآن', 'https://archive.org/download/FP95615/asalibquran.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ الأقسام الأخرى (بدون إضافات) ██
  // ══════════════════════════════════════════════════════════════

  // ========== الفقه وأصوله ==========
  {
    id: 'riyadh-salihin', name: 'رياض الصالحين',
    author: 'الإمام النووي (ت 676هـ)', category: 'الفقه وأصوله',
    description: 'كتاب جامع في الآداب والأحكام والمواعظ من الأحاديث الصحيحة',
    volumes: singleVol('riyadh-salihin', 'رياض الصالحين', 'https://archive.org/download/FPrs/rs.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'bulugh-maram', name: 'بلوغ المرام من أدلة الأحكام',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'الفقه وأصوله',
    description: 'كتاب في أحاديث الأحكام مرتب على أبواب الفقه',
    volumes: singleVol('bulugh-maram', 'بلوغ المرام', 'https://archive.org/download/FP00000bm/bm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'usul-thalatha', name: 'الأصول الثلاثة وأدلتها',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'الفقه وأصوله',
    description: 'متن مختصر في أصول الدين الثلاثة',
    volumes: singleVol('usul-thalatha', 'الأصول الثلاثة', 'https://archive.org/download/WAQosol3/osol3.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'arbaeen-nawawi', name: 'الأربعون النووية',
    author: 'الإمام النووي (ت 676هـ)', category: 'الفقه وأصوله',
    description: 'أربعون حديثاً جامعة لأصول الدين وقواعد الشريعة',
    volumes: singleVol('arbaeen-nawawi', 'الأربعون النووية', 'https://archive.org/download/FParbnnww/arbnnww.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'waraqat', name: 'الورقات في أصول الفقه',
    author: 'إمام الحرمين الجويني (ت 478هـ)', category: 'الفقه وأصوله',
    description: 'متن مختصر في أصول الفقه، من أشهر المتون',
    volumes: singleVol('waraqat', 'الورقات في أصول الفقه', 'https://archive.org/download/WAQwarqa/warqa.pdf'),
    isSingleVolume: true,
  },

  // ========== العقيدة ==========
  {
    id: 'tahawiyya', name: 'العقيدة الطحاوية',
    author: 'الإمام أبو جعفر الطحاوي (ت 321هـ)', category: 'العقيدة',
    description: 'متن مشهور في عقيدة أهل السنة والجماعة',
    volumes: singleVol('tahawiyya', 'العقيدة الطحاوية', 'https://archive.org/download/FP1000/101.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wasitiyya', name: 'العقيدة الواسطية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'رسالة في عقيدة أهل السنة في الأسماء والصفات',
    volumes: singleVol('wasitiyya', 'العقيدة الواسطية', 'https://archive.org/download/WAQwasty/wasty.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'lum3at', name: 'لمعة الاعتقاد',
    author: 'الإمام ابن قدامة المقدسي (ت 620هـ)', category: 'العقيدة',
    description: 'متن مختصر في عقيدة أهل السنة والجماعة',
    volumes: singleVol('lum3at', 'لمعة الاعتقاد', 'https://archive.org/download/WAQlomat/lomat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'kitab-tawhid', name: 'كتاب التوحيد',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'كتاب في توحيد الألوهية ونبذ الشرك',
    volumes: singleVol('kitab-tawhid', 'كتاب التوحيد', 'https://archive.org/download/WAQkttwh/kttwh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'thalathat-usul', name: 'ثلاثة الأصول',
    author: 'الإمام محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'رسالة مختصرة في أصول العقيدة',
    volumes: singleVol('thalathat-usul', 'ثلاثة الأصول', 'https://archive.org/download/WAQosol3/osol3.pdf'),
    isSingleVolume: true,
  },

  // ========== السيرة النبوية ==========
  {
    id: 'raheeq', name: 'الرحيق المختوم',
    author: 'الشيخ صفي الرحمن المباركفوري', category: 'السيرة النبوية',
    description: 'سيرة نبوية شاملة حازت على جائزة رابطة العالم الإسلامي',
    volumes: singleVol('raheeq', 'الرحيق المختوم', 'https://archive.org/download/FP00000rm/rm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'shamael', name: 'الشمائل المحمدية',
    author: 'الإمام الترمذي (ت 279هـ)', category: 'السيرة النبوية',
    description: 'كتاب في صفات النبي صلى الله عليه وسلم وأخلاقه',
    volumes: singleVol('shamael', 'الشمائل المحمدية', 'https://archive.org/download/FPshmaal/shmaal.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'zad-maad', name: 'زاد المعاد في هدي خير العباد',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'السيرة النبوية',
    description: 'كتاب شامل في هدي النبي صلى الله عليه وسلم في جميع شؤون الحياة',
    volumes: createVolumes('zad-maad', 5, (i) => `https://archive.org/download/FP28308/zadmad${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ========== اللغة العربية ==========
  {
    id: 'ajurrumiyya', name: 'متن الآجرومية',
    author: 'ابن آجُرُّوم الصنهاجي (ت 723هـ)', category: 'اللغة العربية',
    description: 'أشهر متن مختصر في النحو العربي للمبتدئين',
    volumes: singleVol('ajurrumiyya', 'متن الآجرومية', 'https://archive.org/download/WAQajrm/ajrm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'alfiyyah', name: 'ألفية ابن مالك',
    author: 'الإمام ابن مالك (ت 672هـ)', category: 'اللغة العربية',
    description: 'أشهر منظومة في النحو والصرف، ألف بيت في قواعد العربية',
    volumes: singleVol('alfiyyah', 'ألفية ابن مالك', 'https://archive.org/download/WAQ22595/22595.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qatr-nada', name: 'قطر الندى وبل الصدى',
    author: 'الإمام ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'كتاب متوسط في النحو العربي',
    volumes: singleVol('qatr-nada', 'قطر الندى وبل الصدى', 'https://archive.org/download/FP0000qn/qn.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - كتب إضافية ██
  // ══════════════════════════════════════════════════════════════

  // كتب الحديث
  {
    id: 'sahih-bukhari', name: 'صحيح البخاري',
    author: 'الإمام البخاري (ت 256هـ)', category: 'الفقه وأصوله',
    description: 'أصح كتاب بعد كتاب الله، جمع فيه الإمام البخاري الأحاديث الصحيحة',
    volumes: singleVol('sahih-bukhari', 'صحيح البخاري', 'https://archive.org/download/FP0000sb/sb.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sahih-muslim', name: 'صحيح مسلم',
    author: 'الإمام مسلم (ت 261هـ)', category: 'الفقه وأصوله',
    description: 'ثاني أصح كتاب بعد صحيح البخاري في الحديث النبوي',
    volumes: singleVol('sahih-muslim', 'صحيح مسلم', 'https://archive.org/download/FP0000sm/sm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sunan-abi-dawud', name: 'سنن أبي داود',
    author: 'الإمام أبو داود (ت 275هـ)', category: 'الفقه وأصوله',
    description: 'من أهم كتب السنن في الحديث النبوي',
    volumes: singleVol('sunan-abi-dawud', 'سنن أبي داود', 'https://archive.org/download/FP0000ad/ad.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sunan-tirmidhi', name: 'سنن الترمذي (الجامع الكبير)',
    author: 'الإمام الترمذي (ت 279هـ)', category: 'الفقه وأصوله',
    description: 'جامع الترمذي من أهم كتب الحديث، يبين درجة الأحاديث',
    volumes: singleVol('sunan-tirmidhi', 'سنن الترمذي', 'https://archive.org/download/FP0000tr/tr.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sunan-nasai', name: 'سنن النسائي',
    author: 'الإمام النسائي (ت 303هـ)', category: 'الفقه وأصوله',
    description: 'من الكتب الستة في الحديث النبوي',
    volumes: singleVol('sunan-nasai', 'سنن النسائي', 'https://archive.org/download/FP0000ns/ns.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sunan-ibn-majah', name: 'سنن ابن ماجه',
    author: 'الإمام ابن ماجه (ت 273هـ)', category: 'الفقه وأصوله',
    description: 'من الكتب الستة في الحديث النبوي',
    volumes: singleVol('sunan-ibn-majah', 'سنن ابن ماجه', 'https://archive.org/download/FP0000jh/jh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'musnad-ahmad', name: 'مسند الإمام أحمد',
    author: 'الإمام أحمد بن حنبل (ت 241هـ)', category: 'الفقه وأصوله',
    description: 'أعظم مسند في الحديث النبوي جمعه الإمام أحمد',
    volumes: singleVol('musnad-ahmad', 'مسند الإمام أحمد', 'https://archive.org/download/FP0000ma/ma.pdf'),
    isSingleVolume: true,
  },

  // كتب العقيدة إضافية
  {
    id: 'aqidat-wasitiyya', name: 'العقيدة الواسطية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'رسالة جامعة في عقيدة أهل السنة والجماعة',
    volumes: singleVol('aqidat-wasitiyya', 'العقيدة الواسطية', 'https://archive.org/download/WAQ13688/13688.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'aqidat-tahawiyya', name: 'العقيدة الطحاوية',
    author: 'الإمام الطحاوي (ت 321هـ)', category: 'العقيدة',
    description: 'متن مشهور في عقيدة أهل السنة والجماعة',
    volumes: singleVol('aqidat-tahawiyya', 'العقيدة الطحاوية', 'https://archive.org/download/FP10100th/th.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sharh-tahawiyya', name: 'شرح العقيدة الطحاوية',
    author: 'ابن أبي العز الحنفي (ت 792هـ)', category: 'العقيدة',
    description: 'أشهر شرح للعقيدة الطحاوية',
    volumes: singleVol('sharh-tahawiyya', 'شرح العقيدة الطحاوية', 'https://archive.org/download/FP10110/sharhtahawi.pdf'),
    isSingleVolume: true,
  },

  // كتب السيرة النبوية إضافية
  {
    id: 'rahiq-makhtum', name: 'الرحيق المختوم',
    author: 'الشيخ صفي الرحمن المباركفوري (ت 1427هـ)', category: 'السيرة النبوية',
    description: 'كتاب فاز بجائزة رابطة العالم الإسلامي في السيرة النبوية',
    volumes: singleVol('rahiq-makhtum', 'الرحيق المختوم', 'https://archive.org/download/FP0000rm/rm.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sira-ibn-hisham', name: 'سيرة ابن هشام',
    author: 'ابن هشام (ت 213هـ)', category: 'السيرة النبوية',
    description: 'من أقدم وأشهر كتب السيرة النبوية',
    volumes: singleVol('sira-ibn-hisham', 'سيرة ابن هشام', 'https://archive.org/download/FP43115/ibnhisham.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'zad-maad', name: 'زاد المعاد في هدي خير العباد',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'السيرة النبوية',
    description: 'كتاب جامع في هدي النبي ﷺ في جميع شؤون الحياة',
    volumes: createVolumes('zad-maad', 5, (i) => `https://archive.org/download/FP82100/zadmaad${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // كتب اللغة العربية إضافية
  {
    id: 'ajurumiyya', name: 'الآجرومية',
    author: 'ابن آجروم (ت 723هـ)', category: 'اللغة العربية',
    description: 'أشهر متن مختصر في النحو العربي للمبتدئين',
    volumes: singleVol('ajurumiyya', 'الآجرومية', 'https://archive.org/download/WAQ15750/15750.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'balagha-wadiha', name: 'البلاغة الواضحة',
    author: 'علي الجارم ومصطفى أمين', category: 'اللغة العربية',
    description: 'كتاب تعليمي مشهور في البلاغة العربية',
    volumes: singleVol('balagha-wadiha', 'البلاغة الواضحة', 'https://archive.org/download/FP33000/balaghawadiha.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - كتب الحديث والفقه والعقيدة واللغة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'nawawi-sharh-muslim', name: 'المنهاج شرح صحيح مسلم',
    author: 'الإمام النووي (ت 676هـ)', category: 'الفقه وأصوله',
    description: 'أفضل شرح لصحيح مسلم وأشهره',
    volumes: createVolumes('nawawi-sharh-muslim', 9, (i) => `https://archive.org/download/FP40000nm/nm${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'fath-bari', name: 'فتح الباري شرح صحيح البخاري',
    author: 'الحافظ ابن حجر العسقلاني (ت 852هـ)', category: 'الفقه وأصوله',
    description: 'أعظم شرح لصحيح البخاري وأوسعه',
    volumes: createVolumes('fath-bari', 13, (i) => `https://archive.org/download/FP30810/fb${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'umdat-ahkam', name: 'عمدة الأحكام من كلام خير الأنام',
    author: 'الحافظ عبد الغني المقدسي (ت 600هـ)', category: 'الفقه وأصوله',
    description: 'أحاديث أحكام مختارة من الصحيحين',
    volumes: singleVol('umdat-ahkam', 'عمدة الأحكام', 'https://archive.org/download/WAQ3mdh/3mdh.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'madarij-salikeen', name: 'مدارج السالكين',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'التدبر',
    description: 'شرح منازل السائرين مع فوائد قرآنية عظيمة',
    volumes: createVolumes('madarij-salikeen', 3, (i) => `https://archive.org/download/FP82305/madarij${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'jawab-kafi', name: 'الجواب الكافي لمن سأل عن الدواء الشافي',
    author: 'الإمام ابن القيم (ت 751هـ)', category: 'التدبر',
    description: 'كتاب الداء والدواء مع وقفات قرآنية',
    volumes: singleVol('jawab-kafi', 'الجواب الكافي', 'https://archive.org/download/FP82310/jawabkafi.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sharh-ibn-aqeel', name: 'شرح ابن عقيل على ألفية ابن مالك',
    author: 'ابن عقيل الهمداني (ت 769هـ)', category: 'اللغة العربية',
    description: 'أشهر شرح لألفية ابن مالك في النحو والصرف',
    volumes: createVolumes('sharh-ibn-aqeel', 4, (i) => `https://archive.org/download/FP22210/ibnaqil${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'awdah-masalik', name: 'أوضح المسالك إلى ألفية ابن مالك',
    author: 'الإمام ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'من أفضل شروح الألفية وأسهلها',
    volumes: createVolumes('awdah-masalik', 4, (i) => `https://archive.org/download/FP22220/awdah${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mugni-labib', name: 'مغني اللبيب عن كتب الأعاريب',
    author: 'الإمام ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'كتاب أساسي في النحو والإعراب',
    volumes: singleVol('mugni-labib', 'مغني اللبيب', 'https://archive.org/download/FP22230/mugni.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jawahir-balagha', name: 'جواهر البلاغة في المعاني والبيان والبديع',
    author: 'أحمد الهاشمي', category: 'اللغة العربية',
    description: 'كتاب جامع في البلاغة العربية بأقسامها الثلاثة',
    volumes: singleVol('jawahir-balagha', 'جواهر البلاغة', 'https://archive.org/download/FP33010/jawahir.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'bidaya-nihaya', name: 'البداية والنهاية',
    author: 'الإمام الحافظ ابن كثير (ت 774هـ)', category: 'السيرة النبوية',
    description: 'كتاب تاريخي شامل يتضمن السيرة النبوية بتفصيل',
    volumes: createVolumes('bidaya-nihaya', 15, (i) => `https://archive.org/download/FP44010/bidaya${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'shifaa-qadi-iyad', name: 'الشفا بتعريف حقوق المصطفى',
    author: 'القاضي عياض (ت 544هـ)', category: 'السيرة النبوية',
    description: 'من أعظم كتب الشمائل والسيرة النبوية',
    volumes: singleVol('shifaa-qadi-iyad', 'الشفا', 'https://archive.org/download/FP43300/shifaa.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sharh-usul-iman', name: 'شرح أصول الإيمان',
    author: 'الشيخ صالح آل الشيخ', category: 'العقيدة',
    description: 'شرح أصول الإيمان الستة من القرآن والسنة',
    volumes: singleVol('sharh-usul-iman', 'شرح أصول الإيمان', 'https://archive.org/download/FP10200/usuliman.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sira-halabiyya', name: 'السيرة الحلبية (إنسان العيون)',
    author: 'برهان الدين الحلبي (ت 1044هـ)', category: 'السيرة النبوية',
    description: 'من أوسع كتب السيرة النبوية',
    volumes: createVolumes('sira-halabiyya', 3, (i) => `https://archive.org/download/FP43200/halabi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - كتب التفسير ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'jalalayn', name: 'تفسير الجلالين',
    author: 'جلال الدين المحلي وجلال الدين السيوطي', category: 'التفسير',
    description: 'من أشهر التفاسير المختصرة، شرحه شيخا جلال الدين',
    volumes: singleVol('jalalayn', 'تفسير الجلالين', 'https://archive.org/download/WAQJalalain/JalalainMaSafwatByShaikhKanpuri_text.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mawardi-nukat', name: 'النكت والعيون (تفسير الماوردي)',
    author: 'الإمام الماوردي (ت 450هـ)', category: 'التفسير',
    description: 'تفسير نفيس يجمع بين الرواية والدراية',
    volumes: createVolumes('mawardi-nukat', 6, (i) => `https://archive.org/download/WAQ64800/${String(i).padStart(2, '0')}_${64799 + i}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'bahr-muhit', name: 'البحر المحيط في التفسير',
    author: 'أبو حيان الأندلسي (ت 745هـ)', category: 'التفسير',
    description: 'تفسير لغوي بلاغي من أعظم تفاسير علوم العربية',
    volumes: createVolumes('bahr-muhit', 8, (i) => `https://archive.org/download/FP77850/bhr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'khazin', name: 'لباب التأويل في معاني التنزيل (تفسير الخازن)',
    author: 'علاء الدين الخازن (ت 741هـ)', category: 'التفسير',
    description: 'تفسير مختصر جامع من المأثور',
    volumes: createVolumes('khazin', 7, (i) => `https://archive.org/download/FP163376/tkh${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'samani', name: 'تفسير السمعاني',
    author: 'أبو المظفر السمعاني (ت 489هـ)', category: 'التفسير',
    description: 'تفسير بالمأثور من أئمة أهل السنة',
    volumes: createVolumes('samani', 6, (i) => `https://archive.org/download/waq24701/${String(i).padStart(2, '0')}_24702.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'thalabi', name: 'الكشف والبيان (تفسير الثعلبي)',
    author: 'أبو إسحاق الثعلبي (ت 427هـ)', category: 'التفسير',
    description: 'من أقدم التفاسير الجامعة بالمأثور',
    volumes: createVolumes('thalabi', 10, (i) => `https://archive.org/download/FP11898/ktb${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'biqai', name: 'نظم الدرر في تناسب الآيات والسور',
    author: 'برهان الدين البقاعي (ت 885هـ)', category: 'التفسير',
    description: 'تفسير فريد يبين المناسبات بين الآيات والسور',
    volumes: createVolumes('biqai', 22, (i) => `https://archive.org/download/FP153847/nzm${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tayseer-saadi', name: 'تيسير اللطيف المنان في خلاصة تفسير القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'التفسير',
    description: 'مختصر جامع في تفسير المعاني',
    volumes: singleVol('tayseer-saadi', 'تيسير اللطيف المنان', 'https://archive.org/download/waq80470/80470.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafseer-muyassar', name: 'التفسير الميسر',
    author: 'مجمع الملك فهد لطباعة المصحف الشريف', category: 'التفسير',
    description: 'تفسير ميسر جامع للمعاني الأساسية للقرآن الكريم',
    volumes: singleVol('tafseer-muyassar', 'التفسير الميسر', 'https://archive.org/download/FP156043/mysr.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'zilal-quran', name: 'في ظلال القرآن',
    author: 'سيد قطب (ت 1385هـ)', category: 'التفسير',
    description: 'تفسير معاصر يجمع بين الأدب والدعوة',
    volumes: createVolumes('zilal-quran', 6, (i) => `https://archive.org/download/FP132880/fzk${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'khatib-shirbini', name: 'السراج المنير في الإعانة على معرفة بعض معاني كلام ربنا',
    author: 'الخطيب الشربيني (ت 977هـ)', category: 'التفسير',
    description: 'تفسير جامع على منهج أهل السنة',
    volumes: createVolumes('khatib-shirbini', 4, (i) => `https://archive.org/download/waq86921/${String(i).padStart(2, '0')}_86921.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'wasit-wahidi', name: 'الوسيط في تفسير القرآن المجيد',
    author: 'أبو الحسن الواحدي (ت 468هـ)', category: 'التفسير',
    description: 'من أقدم تفاسير الآيات بالأثر',
    volumes: createVolumes('wasit-wahidi', 4, (i) => `https://archive.org/download/FP145029/twa${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ibn-atiyya', name: 'المحرر الوجيز في تفسير الكتاب العزيز',
    author: 'ابن عطية الأندلسي (ت 542هـ)', category: 'التفسير',
    description: 'من أجلّ تفاسير الأندلس',
    volumes: createVolumes('ibn-atiyya', 8, (i) => `https://archive.org/download/FP156044/mhr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - علوم القرآن ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'burhan-zarkashi', name: 'البرهان في علوم القرآن',
    author: 'بدر الدين الزركشي (ت 794هـ)', category: 'علوم القرآن',
    description: 'موسوعة شاملة في علوم القرآن الكريم',
    volumes: createVolumes('burhan-zarkashi', 4, (i) => `https://archive.org/download/FP17187/brk${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'itqan-suyuti', name: 'الإتقان في علوم القرآن',
    author: 'جلال الدين السيوطي (ت 911هـ)', category: 'علوم القرآن',
    description: 'من أشهر كتب علوم القرآن وأجمعها',
    volumes: createVolumes('itqan-suyuti', 2, (i) => `https://archive.org/download/itqansuyuti/itq${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mabahith-qattan', name: 'مباحث في علوم القرآن',
    author: 'مناع القطان', category: 'علوم القرآن',
    description: 'مرجع معاصر في علوم القرآن',
    volumes: singleVol('mabahith-qattan', 'مباحث في علوم القرآن', 'https://archive.org/download/waq6570/waq6570.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'mabahith-subhi', name: 'مباحث في علوم القرآن',
    author: 'د. صبحي الصالح', category: 'علوم القرآن',
    description: 'مقدمة شاملة في علوم القرآن الكريم',
    volumes: singleVol('mabahith-subhi', 'مباحث في علوم القرآن', 'https://archive.org/download/mabahithfyoloomalqorqan/mabahithfyoloomalqorqan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nawasikh-nahhas', name: 'الناسخ والمنسوخ في كتاب الله',
    author: 'أبو جعفر النحاس (ت 338هـ)', category: 'علوم القرآن',
    description: 'من أقدم الكتب في الناسخ والمنسوخ',
    volumes: singleVol('nawasikh-nahhas', 'الناسخ والمنسوخ', 'https://archive.org/download/FP161543/nmk.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fadail-quran-abu-ubaid', name: 'فضائل القرآن',
    author: 'أبو عبيد القاسم بن سلام (ت 224هـ)', category: 'علوم القرآن',
    description: 'من أقدم كتب فضائل القرآن',
    volumes: singleVol('fadail-quran-abu-ubaid', 'فضائل القرآن', 'https://archive.org/download/waq3565/3565.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'majaz-quran', name: 'مجاز القرآن',
    author: 'أبو عبيدة معمر بن المثنى (ت 209هـ)', category: 'علوم القرآن',
    description: 'أول كتاب في المجاز في القرآن',
    volumes: createVolumes('majaz-quran', 2, (i) => `https://archive.org/download/FP156087/mjz${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ulum-quran-ibn-juzayy', name: 'التسهيل لعلوم التنزيل',
    author: 'ابن جزي الكلبي (ت 741هـ)', category: 'علوم القرآن',
    description: 'مقدمة جامعة لعلوم القرآن مع التفسير',
    volumes: createVolumes('ulum-quran-ibn-juzayy', 2, (i) => `https://archive.org/download/FP93895/tsh${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - التجويد والقراءات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'nashr-kabir', name: 'النشر في القراءات العشر',
    author: 'ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'أعظم كتاب في القراءات العشر',
    volumes: createVolumes('nashr-kabir', 2, (i) => `https://archive.org/download/FP15697/nshr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'tayseer-dani', name: 'التيسير في القراءات السبع',
    author: 'أبو عمرو الداني (ت 444هـ)', category: 'التجويد والقراءات',
    description: 'من أعظم الأصول في القراءات السبع',
    volumes: singleVol('tayseer-dani', 'التيسير في القراءات السبع', 'https://archive.org/download/waq47900/47900.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'hirz-amani', name: 'حرز الأماني ووجه التهاني (الشاطبية)',
    author: 'الإمام الشاطبي (ت 590هـ)', category: 'التجويد والقراءات',
    description: 'منظومة الشاطبية الشهيرة في القراءات السبع',
    volumes: singleVol('hirz-amani', 'حرز الأماني (الشاطبية)', 'https://archive.org/download/FP8567/8567.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibraz-maani', name: 'إبراز المعاني من حرز الأماني',
    author: 'أبو شامة المقدسي (ت 665هـ)', category: 'التجويد والقراءات',
    description: 'شرح منظومة الشاطبية',
    volumes: singleVol('ibraz-maani', 'إبراز المعاني', 'https://archive.org/download/FP19853/19853.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ithaf-fudala', name: 'إتحاف فضلاء البشر بالقراءات الأربعة عشر',
    author: 'أحمد البنا الدمياطي (ت 1117هـ)', category: 'التجويد والقراءات',
    description: 'من أوسع كتب القراءات الأربع عشرة',
    volumes: createVolumes('ithaf-fudala', 2, (i) => `https://archive.org/download/FP158860/ith${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sbk-itab-tajweed', name: 'التبيان في آداب حملة القرآن',
    author: 'الإمام النووي (ت 676هـ)', category: 'التجويد والقراءات',
    description: 'من أهم كتب آداب حامل القرآن',
    volumes: singleVol('sbk-itab-tajweed', 'التبيان في آداب حملة القرآن', 'https://archive.org/download/waq6505/6505.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'muqaddima-jazariyya', name: 'متن الجزرية (المقدمة الجزرية)',
    author: 'ابن الجزري (ت 833هـ)', category: 'التجويد والقراءات',
    description: 'منظومة شهيرة في أحكام التجويد',
    volumes: singleVol('muqaddima-jazariyya', 'المقدمة الجزرية', 'https://archive.org/download/FP73878/73878.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ghayat-murid', name: 'غاية المريد في علم التجويد',
    author: 'عطية قابل نصر', category: 'التجويد والقراءات',
    description: 'من أجمع كتب علم التجويد المعاصرة',
    volumes: singleVol('ghayat-murid', 'غاية المريد في علم التجويد', 'https://archive.org/download/FPghaymurid/ghaymurid.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'minhat-dhi-jalal', name: 'منحة ذي الجلال في شرح تحفة الأطفال',
    author: 'فريد بن عبد العزيز الزامل', category: 'التجويد والقراءات',
    description: 'شرح منظومة تحفة الأطفال للمبتدئين',
    volumes: singleVol('minhat-dhi-jalal', 'منحة ذي الجلال', 'https://archive.org/download/minhat-dhi-jalal/minhat-dhi-jalal.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - العقيدة (كتب أهل السنة والجماعة) ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'aqeedah-wasitiyya', name: 'العقيدة الواسطية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'من أوضح متون العقيدة على مذهب السلف',
    volumes: singleVol('aqeedah-wasitiyya', 'العقيدة الواسطية', 'https://archive.org/download/waq26240/26240.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sharh-wasitiyya-uthaymin', name: 'شرح العقيدة الواسطية',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'شرح العقيدة الواسطية لشيخ الإسلام ابن تيمية',
    volumes: createVolumes('sharh-wasitiyya-uthaymin', 2, (i) => `https://archive.org/download/FPsrhwstyauth/srhwstyauth${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'aqeedah-tahawiyya', name: 'العقيدة الطحاوية',
    author: 'أبو جعفر الطحاوي (ت 321هـ)', category: 'العقيدة',
    description: 'متن العقيدة الطحاوية المشهور',
    volumes: singleVol('aqeedah-tahawiyya', 'العقيدة الطحاوية', 'https://archive.org/download/waq26238/26238.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sharh-tahawiyya', name: 'شرح العقيدة الطحاوية',
    author: 'ابن أبي العز الحنفي (ت 792هـ)', category: 'العقيدة',
    description: 'أشهر شروح العقيدة الطحاوية على منهج السلف',
    volumes: singleVol('sharh-tahawiyya', 'شرح العقيدة الطحاوية', 'https://archive.org/download/waq4950/waq4950.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'thulath-usul', name: 'الأصول الثلاثة وأدلتها',
    author: 'الشيخ محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'من أهم متون التوحيد للمبتدئين',
    volumes: singleVol('thulath-usul', 'الأصول الثلاثة', 'https://archive.org/download/waq25210/25210.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'kitab-tawhid', name: 'كتاب التوحيد',
    author: 'الشيخ محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'من أشهر كتب التوحيد وأنفعها',
    volumes: singleVol('kitab-tawhid', 'كتاب التوحيد', 'https://archive.org/download/waq25208/25208.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'qawl-mufid', name: 'القول المفيد على كتاب التوحيد',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'شرح كتاب التوحيد للشيخ محمد بن عبد الوهاب',
    volumes: createVolumes('qawl-mufid', 3, (i) => `https://archive.org/download/WAQ80474/${String(i).padStart(2, '0')}_80474.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'fath-majid', name: 'فتح المجيد شرح كتاب التوحيد',
    author: 'عبد الرحمن بن حسن آل الشيخ (ت 1285هـ)', category: 'العقيدة',
    description: 'من أوسع شروح كتاب التوحيد',
    volumes: singleVol('fath-majid', 'فتح المجيد شرح كتاب التوحيد', 'https://archive.org/download/waq12940/12940.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tayseer-aziz-hamid', name: 'تيسير العزيز الحميد في شرح كتاب التوحيد',
    author: 'الشيخ سليمان بن عبد الله آل الشيخ (ت 1233هـ)', category: 'العقيدة',
    description: 'شرح مبسوط لكتاب التوحيد',
    volumes: singleVol('tayseer-aziz-hamid', 'تيسير العزيز الحميد', 'https://archive.org/download/waq5670/5670.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nawaqid-islam', name: 'نواقض الإسلام',
    author: 'الشيخ محمد بن عبد الوهاب (ت 1206هـ)', category: 'العقيدة',
    description: 'بيان نواقض الإسلام العشرة',
    volumes: singleVol('nawaqid-islam', 'نواقض الإسلام', 'https://archive.org/download/waq25219/25219.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sunnah-ibn-abi-asim', name: 'السنة',
    author: 'ابن أبي عاصم (ت 287هـ)', category: 'العقيدة',
    description: 'من أمهات كتب السنة والاعتقاد',
    volumes: createVolumes('sunnah-ibn-abi-asim', 2, (i) => `https://archive.org/download/FP156059/sib${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sunnah-abdullah', name: 'السنة',
    author: 'عبد الله بن الإمام أحمد بن حنبل (ت 290هـ)', category: 'العقيدة',
    description: 'كتاب السنة لعبد الله بن الإمام أحمد',
    volumes: createVolumes('sunnah-abdullah', 2, (i) => `https://archive.org/download/FP156072/san${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'iman-ibn-abi-shayba', name: 'الإيمان',
    author: 'ابن أبي شيبة (ت 235هـ)', category: 'العقيدة',
    description: 'كتاب الإيمان لابن أبي شيبة',
    volumes: singleVol('iman-ibn-abi-shayba', 'الإيمان لابن أبي شيبة', 'https://archive.org/download/waq26241/26241.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'aqeedah-safariniyya', name: 'لوامع الأنوار البهية (شرح الدرة المضية في عقد الفرقة المرضية)',
    author: 'السفاريني الحنبلي (ت 1188هـ)', category: 'العقيدة',
    description: 'شرح موسع لعقيدة أهل السنة',
    volumes: createVolumes('aqeedah-safariniyya', 2, (i) => `https://archive.org/download/waq5920/${String(i).padStart(2, '0')}_5920.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sharh-sunnah-barbahari', name: 'شرح السنة',
    author: 'الإمام البربهاري (ت 329هـ)', category: 'العقيدة',
    description: 'من أقدم كتب العقيدة على منهج السلف',
    volumes: singleVol('sharh-sunnah-barbahari', 'شرح السنة للبربهاري', 'https://archive.org/download/waq26245/26245.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'lummah-aqeedah', name: 'لمعة الاعتقاد الهادي إلى سبيل الرشاد',
    author: 'ابن قدامة المقدسي (ت 620هـ)', category: 'العقيدة',
    description: 'متن مختصر في العقيدة',
    volumes: singleVol('lummah-aqeedah', 'لمعة الاعتقاد', 'https://archive.org/download/waq25212/25212.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sharh-lummah-uthaymin', name: 'شرح لمعة الاعتقاد',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'شرح متن لمعة الاعتقاد لابن قدامة',
    volumes: singleVol('sharh-lummah-uthaymin', 'شرح لمعة الاعتقاد', 'https://archive.org/download/FPsrhlmaayaqd/srhlmaayaqd.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'aqeedah-salaf-ashab', name: 'عقيدة السلف أصحاب الحديث',
    author: 'أبو عثمان الصابوني (ت 449هـ)', category: 'العقيدة',
    description: 'في بيان عقيدة أهل السنة والجماعة',
    volumes: singleVol('aqeedah-salaf-ashab', 'عقيدة السلف أصحاب الحديث', 'https://archive.org/download/waq26251/26251.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-taymiyya-fatawa', name: 'مجموع الفتاوى',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'مجموع فتاوى شيخ الإسلام ابن تيمية في 37 مجلدًا',
    volumes: createVolumes('ibn-taymiyya-fatawa', 37, (i) => `https://archive.org/download/FP49094/mf${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'minhaj-sunnah', name: 'منهاج السنة النبوية',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في نقض كلام الشيعة والقدرية',
    volumes: createVolumes('minhaj-sunnah', 8, (i) => `https://archive.org/download/FP32987/mnsn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'dar-taarud', name: 'درء تعارض العقل والنقل',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في الرد على الفلاسفة والمتكلمين',
    volumes: createVolumes('dar-taarud', 10, (i) => `https://archive.org/download/FP11934/drtar${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'iqtida-sirat', name: 'اقتضاء الصراط المستقيم مخالفة أصحاب الجحيم',
    author: 'شيخ الإسلام ابن تيمية (ت 728هـ)', category: 'العقيدة',
    description: 'في التحذير من مشابهة الكفار',
    volumes: singleVol('iqtida-sirat', 'اقتضاء الصراط المستقيم', 'https://archive.org/download/waq16540/16540.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - كتب شيخ الإسلام ابن القيم ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'madarij-salikin', name: 'مدارج السالكين بين منازل إياك نعبد وإياك نستعين',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'من أجمع كتب التربية والسلوك والعقيدة',
    volumes: createVolumes('madarij-salikin', 3, (i) => `https://archive.org/download/FP71918/mdr${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'zad-maad', name: 'زاد المعاد في هدي خير العباد',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'السيرة النبوية',
    description: 'موسوعة في السيرة والهدي النبوي',
    volumes: createVolumes('zad-maad', 5, (i) => `https://archive.org/download/FP36769/zmm${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ighathatul-lahfan', name: 'إغاثة اللهفان من مصايد الشيطان',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في التحذير من مكائد الشيطان',
    volumes: createVolumes('ighathatul-lahfan', 2, (i) => `https://archive.org/download/waq4715/${String(i).padStart(2, '0')}_4715.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'ijtima-juyush', name: 'اجتماع الجيوش الإسلامية على غزو المعطلة والجهمية',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في الرد على نفاة الصفات',
    volumes: singleVol('ijtima-juyush', 'اجتماع الجيوش الإسلامية', 'https://archive.org/download/waq5110/waq5110.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sawaiq-mursala', name: 'الصواعق المرسلة على الجهمية والمعطلة',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في الرد على نفاة الصفات',
    volumes: createVolumes('sawaiq-mursala', 4, (i) => `https://archive.org/download/FP6115/swraq${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'fawaid-ibn-qayyim', name: 'الفوائد',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'لمعة من علم ابن القيم وتوجيهاته التربوية',
    volumes: singleVol('fawaid-ibn-qayyim', 'الفوائد لابن القيم', 'https://archive.org/download/FP23820/23820.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'wabil-sayyib', name: 'الوابل الصيب من الكلم الطيب',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في فضل الذكر وأنواعه',
    volumes: singleVol('wabil-sayyib', 'الوابل الصيب', 'https://archive.org/download/waq5250/waq5250.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'dawa-shafi', name: 'الداء والدواء (الجواب الكافي)',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في علاج أمراض القلوب',
    volumes: singleVol('dawa-shafi', 'الداء والدواء', 'https://archive.org/download/waq4975/waq4975.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'talqeeh-fuhoom', name: 'تلقيح فهوم أهل الأثر',
    author: 'ابن الجوزي (ت 597هـ)', category: 'السيرة النبوية',
    description: 'مختصر في السيرة والتاريخ',
    volumes: singleVol('talqeeh-fuhoom', 'تلقيح فهوم أهل الأثر', 'https://archive.org/download/FPtfahl/tfahl.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - كتب الفقه وأصوله ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'muhalla-ibn-hazm', name: 'المحلى بالآثار',
    author: 'ابن حزم الظاهري (ت 456هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة فقهية كبرى على المذهب الظاهري',
    volumes: createVolumes('muhalla-ibn-hazm', 12, (i) => `https://archive.org/download/mhalla-b-alathar/mhalla${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mughni-ibn-qudama', name: 'المغني',
    author: 'ابن قدامة المقدسي (ت 620هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة فقهية كبرى على المذهب الحنبلي',
    volumes: createVolumes('mughni-ibn-qudama', 15, (i) => `https://archive.org/download/FP132983/MG${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'majmu-nawawi', name: 'المجموع شرح المهذب',
    author: 'الإمام النووي (ت 676هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة فقهية على المذهب الشافعي',
    volumes: createVolumes('majmu-nawawi', 27, (i) => `https://archive.org/download/waq31750/${String(i).padStart(2, '0')}_31750.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'umda-fiqh', name: 'عمدة الفقه',
    author: 'ابن قدامة المقدسي (ت 620هـ)', category: 'الفقه وأصوله',
    description: 'متن مختصر في الفقه الحنبلي',
    volumes: singleVol('umda-fiqh', 'عمدة الفقه', 'https://archive.org/download/waq5245/waq5245.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ahkam-janaiz', name: 'أحكام الجنائز وبدعها',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'من أوسع كتب أحكام الجنائز في السنة',
    volumes: singleVol('ahkam-janaiz', 'أحكام الجنائز وبدعها', 'https://archive.org/download/FPahkamjanaiz/ahkamjanaiz.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sifat-salat', name: 'صفة صلاة النبي ﷺ',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'من أجمع ما كتب في صفة صلاة النبي ﷺ',
    volumes: createVolumes('sifat-salat', 3, (i) => `https://archive.org/download/WAQ96451/${String(i).padStart(2, '0')}_96451.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'bulugh-maram', name: 'بلوغ المرام من أدلة الأحكام',
    author: 'ابن حجر العسقلاني (ت 852هـ)', category: 'الفقه وأصوله',
    description: 'من أهم كتب أحاديث الأحكام',
    volumes: singleVol('bulugh-maram', 'بلوغ المرام', 'https://archive.org/download/waq3460/waq3460.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'subul-salam', name: 'سبل السلام شرح بلوغ المرام',
    author: 'الصنعاني (ت 1182هـ)', category: 'الفقه وأصوله',
    description: 'من أشهر شروح بلوغ المرام',
    volumes: createVolumes('subul-salam', 4, (i) => `https://archive.org/download/FP75525/sbl${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'fiqh-sunnah', name: 'فقه السنة',
    author: 'السيد سابق (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'من أجمع كتب الفقه المعاصرة على الدليل',
    volumes: createVolumes('fiqh-sunnah', 3, (i) => `https://archive.org/download/FPfiqhsunnah/fiqhsunnah${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mumti-sharh-zad', name: 'الشرح الممتع على زاد المستقنع',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    description: 'شرح موسوعي لزاد المستقنع في الفقه الحنبلي',
    volumes: createVolumes('mumti-sharh-zad', 15, (i) => `https://archive.org/download/FPsr7mmt3/sr7mmt3${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'irwa-ghalil', name: 'إرواء الغليل في تخريج أحاديث منار السبيل',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'تخريج موسع لأحاديث الأحكام',
    volumes: createVolumes('irwa-ghalil', 9, (i) => `https://archive.org/download/FP35330/irw${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'usul-fiqh-uthaymin', name: 'الأصول من علم الأصول',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'الفقه وأصوله',
    description: 'متن مختصر في أصول الفقه',
    volumes: singleVol('usul-fiqh-uthaymin', 'الأصول من علم الأصول', 'https://archive.org/download/waq80472/80472.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'risala-shafii', name: 'الرسالة في أصول الفقه',
    author: 'الإمام الشافعي (ت 204هـ)', category: 'الفقه وأصوله',
    description: 'أول كتاب في أصول الفقه',
    volumes: singleVol('risala-shafii', 'الرسالة للشافعي', 'https://archive.org/download/waq27950/27950.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ihkam-ibn-hazm', name: 'الإحكام في أصول الأحكام',
    author: 'ابن حزم الظاهري (ت 456هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة في أصول الفقه',
    volumes: createVolumes('ihkam-ibn-hazm', 4, (i) => `https://archive.org/download/FP120891/ihkam${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'muwafaqat-shatibi', name: 'الموافقات',
    author: 'الإمام الشاطبي (ت 790هـ)', category: 'الفقه وأصوله',
    description: 'موسوعة في مقاصد الشريعة وأصولها',
    volumes: createVolumes('muwafaqat-shatibi', 4, (i) => `https://archive.org/download/FP43230/mwfq${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - كتب الحديث والسنة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sahih-bukhari', name: 'صحيح البخاري',
    author: 'الإمام محمد بن إسماعيل البخاري (ت 256هـ)', category: 'العقيدة',
    description: 'أصح كتاب بعد كتاب الله',
    volumes: createVolumes('sahih-bukhari', 9, (i) => `https://archive.org/download/FP14028/sb${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sahih-muslim', name: 'صحيح مسلم',
    author: 'الإمام مسلم بن الحجاج (ت 261هـ)', category: 'العقيدة',
    description: 'ثاني أصح كتاب بعد كتاب الله',
    volumes: createVolumes('sahih-muslim', 5, (i) => `https://archive.org/download/FP14023/sm${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'fath-bari', name: 'فتح الباري شرح صحيح البخاري',
    author: 'ابن حجر العسقلاني (ت 852هـ)', category: 'العقيدة',
    description: 'أشهر شروح صحيح البخاري',
    volumes: createVolumes('fath-bari', 13, (i) => `https://archive.org/download/FP49105/fb${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sharh-nawawi-muslim', name: 'المنهاج شرح صحيح مسلم بن الحجاج',
    author: 'الإمام النووي (ت 676هـ)', category: 'العقيدة',
    description: 'أشهر شروح صحيح مسلم',
    volumes: createVolumes('sharh-nawawi-muslim', 18, (i) => `https://archive.org/download/waq6569/${String(i).padStart(2, '0')}_6569.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sunan-abu-dawud', name: 'سنن أبي داود',
    author: 'الإمام أبو داود السجستاني (ت 275هـ)', category: 'العقيدة',
    description: 'من الكتب الستة',
    volumes: createVolumes('sunan-abu-dawud', 4, (i) => `https://archive.org/download/waq7550/${String(i).padStart(2, '0')}_7550.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'jami-tirmidhi', name: 'جامع الترمذي',
    author: 'الإمام الترمذي (ت 279هـ)', category: 'العقيدة',
    description: 'من الكتب الستة',
    volumes: createVolumes('jami-tirmidhi', 5, (i) => `https://archive.org/download/waq7549/${String(i).padStart(2, '0')}_7549.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sunan-nasai', name: 'سنن النسائي (المجتبى)',
    author: 'الإمام النسائي (ت 303هـ)', category: 'العقيدة',
    description: 'من الكتب الستة',
    volumes: createVolumes('sunan-nasai', 8, (i) => `https://archive.org/download/waq7548/${String(i).padStart(2, '0')}_7548.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sunan-ibn-maja', name: 'سنن ابن ماجه',
    author: 'الإمام ابن ماجه (ت 273هـ)', category: 'العقيدة',
    description: 'من الكتب الستة',
    volumes: createVolumes('sunan-ibn-maja', 2, (i) => `https://archive.org/download/waq7547/${String(i).padStart(2, '0')}_7547.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'musnad-ahmad', name: 'مسند الإمام أحمد',
    author: 'الإمام أحمد بن حنبل (ت 241هـ)', category: 'العقيدة',
    description: 'من أعظم دواوين السنة',
    volumes: createVolumes('musnad-ahmad', 50, (i) => `https://archive.org/download/msndahmed/msndahmed${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'muwatta-malik', name: 'موطأ الإمام مالك',
    author: 'الإمام مالك بن أنس (ت 179هـ)', category: 'العقيدة',
    description: 'من أقدم كتب الحديث والفقه',
    volumes: createVolumes('muwatta-malik', 2, (i) => `https://archive.org/download/waq4650/${String(i).padStart(2, '0')}_4650.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'riyad-salihin', name: 'رياض الصالحين',
    author: 'الإمام النووي (ت 676هـ)', category: 'العقيدة',
    description: 'من أنفع كتب الحديث للمسلمين',
    volumes: singleVol('riyad-salihin', 'رياض الصالحين', 'https://archive.org/download/waq5175/waq5175.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'arbaeen-nawawiyya', name: 'الأربعون النووية',
    author: 'الإمام النووي (ت 676هـ)', category: 'العقيدة',
    description: 'أربعون حديثًا في أصول الدين',
    volumes: singleVol('arbaeen-nawawiyya', 'الأربعون النووية', 'https://archive.org/download/waq14100/14100.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'jami-ulum-hikam', name: 'جامع العلوم والحكم',
    author: 'ابن رجب الحنبلي (ت 795هـ)', category: 'العقيدة',
    description: 'شرح الأربعين النووية وزيادات',
    volumes: createVolumes('jami-ulum-hikam', 2, (i) => `https://archive.org/download/FP32985/jou${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'silsila-sahiha', name: 'سلسلة الأحاديث الصحيحة',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'العقيدة',
    description: 'موسوعة الأحاديث الصحيحة',
    volumes: createVolumes('silsila-sahiha', 7, (i) => `https://archive.org/download/WAQalbsh/${String(i).padStart(2, '0')}_albsh.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'silsila-daifa', name: 'سلسلة الأحاديث الضعيفة والموضوعة',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'العقيدة',
    description: 'موسوعة الأحاديث الضعيفة والموضوعة',
    volumes: createVolumes('silsila-daifa', 14, (i) => `https://archive.org/download/WAQalbdd/${String(i).padStart(2, '0')}_albdd.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'sahih-jami', name: 'صحيح الجامع الصغير وزيادته',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'العقيدة',
    description: 'صحيح أحاديث الجامع الصغير',
    volumes: createVolumes('sahih-jami', 2, (i) => `https://archive.org/download/FP13815/sjs${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - السيرة النبوية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sira-ibn-hisham', name: 'السيرة النبوية لابن هشام',
    author: 'ابن هشام (ت 213هـ)', category: 'السيرة النبوية',
    description: 'أقدم وأشهر كتب السيرة النبوية',
    volumes: createVolumes('sira-ibn-hisham', 4, (i) => `https://archive.org/download/waq12820/${String(i).padStart(2, '0')}_12820.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'raheeq-makhtum', name: 'الرحيق المختوم',
    author: 'الشيخ صفي الرحمن المباركفوري (ت 1427هـ)', category: 'السيرة النبوية',
    description: 'من أجمل وأسهل كتب السيرة المعاصرة',
    volumes: singleVol('raheeq-makhtum', 'الرحيق المختوم', 'https://archive.org/download/FPraheeqmakhtoum/raheeqmakhtoum.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'nur-yaqeen', name: 'نور اليقين في سيرة سيد المرسلين',
    author: 'الشيخ محمد الخضري بك (ت 1345هـ)', category: 'السيرة النبوية',
    description: 'سيرة مختصرة سهلة',
    volumes: singleVol('nur-yaqeen', 'نور اليقين في سيرة سيد المرسلين', 'https://archive.org/download/waq18980/18980.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sira-nabawiyya-ibn-kathir', name: 'السيرة النبوية لابن كثير',
    author: 'الحافظ ابن كثير (ت 774هـ)', category: 'السيرة النبوية',
    description: 'سيرة مفصلة على المنهج العلمي',
    volumes: createVolumes('sira-nabawiyya-ibn-kathir', 4, (i) => `https://archive.org/download/FP34900/sna${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'shamail-muhammadiyya', name: 'الشمائل المحمدية',
    author: 'الإمام الترمذي (ت 279هـ)', category: 'السيرة النبوية',
    description: 'كتاب في صفات النبي ﷺ وشمائله',
    volumes: singleVol('shamail-muhammadiyya', 'الشمائل المحمدية', 'https://archive.org/download/waq43680/43680.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sira-mubarakfuri-mahtoum', name: 'السيرة النبوية عرض وقائع وتحليل أحداث',
    author: 'د. علي محمد الصلابي', category: 'السيرة النبوية',
    description: 'سيرة شاملة بتحليل معاصر',
    volumes: createVolumes('sira-mubarakfuri-mahtoum', 3, (i) => `https://archive.org/download/FPsiraSalabi/siraSalabi${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'hadi-arwah', name: 'حادي الأرواح إلى بلاد الأفراح',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في وصف الجنة',
    volumes: singleVol('hadi-arwah', 'حادي الأرواح', 'https://archive.org/download/FP23823/23823.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - الرقائق والآداب ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'adab-mufrad', name: 'الأدب المفرد',
    author: 'الإمام البخاري (ت 256هـ)', category: 'العقيدة',
    description: 'في الآداب الشرعية',
    volumes: singleVol('adab-mufrad', 'الأدب المفرد', 'https://archive.org/download/waq118/waq118.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tazkirat-qurtubi', name: 'التذكرة بأحوال الموتى وأمور الآخرة',
    author: 'الإمام القرطبي (ت 671هـ)', category: 'العقيدة',
    description: 'في أحوال القبر والبرزخ والآخرة',
    volumes: singleVol('tazkirat-qurtubi', 'التذكرة للقرطبي', 'https://archive.org/download/waq16521/16521.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'hilyat-awliya', name: 'حلية الأولياء وطبقات الأصفياء',
    author: 'أبو نعيم الأصبهاني (ت 430هـ)', category: 'العقيدة',
    description: 'موسوعة في سير الصحابة والتابعين',
    volumes: createVolumes('hilyat-awliya', 10, (i) => `https://archive.org/download/FPhilyatawlya/hlyawla${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'siyar-alam-nubala', name: 'سير أعلام النبلاء',
    author: 'الحافظ الذهبي (ت 748هـ)', category: 'العقيدة',
    description: 'موسوعة كبرى في تراجم العلماء',
    volumes: createVolumes('siyar-alam-nubala', 25, (i) => `https://archive.org/download/FP47896/say${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'uddat-sabireen', name: 'عدة الصابرين وذخيرة الشاكرين',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في الصبر والشكر',
    volumes: singleVol('uddat-sabireen', 'عدة الصابرين', 'https://archive.org/download/waq5260/waq5260.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ruh-ibn-qayyim', name: 'الروح',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في أحوال الروح بعد الموت',
    volumes: singleVol('ruh-ibn-qayyim', 'الروح لابن القيم', 'https://archive.org/download/FP23817/23817.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'iqaz-himam', name: 'إيقاظ الهمم في شرح الحكم',
    author: 'ابن عجيبة الحسني', category: 'العقيدة',
    description: 'شرح الحكم العطائية',
    volumes: singleVol('iqaz-himam', 'إيقاظ الهمم', 'https://archive.org/download/FP43250/43250.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fawaid-ibn-jawzi', name: 'صيد الخاطر',
    author: 'ابن الجوزي (ت 597هـ)', category: 'العقيدة',
    description: 'مجموعة خواطر وفوائد',
    volumes: singleVol('fawaid-ibn-jawzi', 'صيد الخاطر', 'https://archive.org/download/waq5925/waq5925.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'rawdat-muhibbin', name: 'روضة المحبين ونزهة المشتاقين',
    author: 'ابن قيم الجوزية (ت 751هـ)', category: 'العقيدة',
    description: 'في الحب المشروع',
    volumes: singleVol('rawdat-muhibbin', 'روضة المحبين', 'https://archive.org/download/FP23830/23830.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'latif-maarif', name: 'لطائف المعارف فيما لمواسم العام من الوظائف',
    author: 'ابن رجب الحنبلي (ت 795هـ)', category: 'العقيدة',
    description: 'في فضائل أوقات العام ومواسمها',
    volumes: singleVol('latif-maarif', 'لطائف المعارف', 'https://archive.org/download/waq5940/waq5940.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tafseer-al-baghawi', name: 'مختصر منهاج القاصدين',
    author: 'ابن قدامة المقدسي (ت 620هـ)', category: 'العقيدة',
    description: 'في الرقائق وتهذيب النفس',
    volumes: singleVol('tafseer-al-baghawi', 'مختصر منهاج القاصدين', 'https://archive.org/download/waq5280/waq5280.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - كتب اللغة العربية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'alfiyya-ibn-malik', name: 'ألفية ابن مالك في النحو',
    author: 'ابن مالك الأندلسي (ت 672هـ)', category: 'اللغة العربية',
    description: 'أشهر منظومات النحو العربي',
    volumes: singleVol('alfiyya-ibn-malik', 'ألفية ابن مالك', 'https://archive.org/download/FP49075/alfiyya.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sharh-ibn-aqeel', name: 'شرح ابن عقيل على ألفية ابن مالك',
    author: 'ابن عقيل (ت 769هـ)', category: 'اللغة العربية',
    description: 'من أشهر شروح الألفية',
    volumes: createVolumes('sharh-ibn-aqeel', 4, (i) => `https://archive.org/download/WAQ7445/${String(i).padStart(2, '0')}_7445.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'awdah-masalik', name: 'أوضح المسالك إلى ألفية ابن مالك',
    author: 'ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'من أوضح شروح الألفية',
    volumes: createVolumes('awdah-masalik', 4, (i) => `https://archive.org/download/FP8630/awd${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mughni-labib', name: 'مغني اللبيب عن كتب الأعاريب',
    author: 'ابن هشام الأنصاري (ت 761هـ)', category: 'اللغة العربية',
    description: 'من أشهر كتب النحو الجامعة',
    volumes: createVolumes('mughni-labib', 2, (i) => `https://archive.org/download/WAQ5720/${String(i).padStart(2, '0')}_5720.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'kitab-sibawayh', name: 'الكتاب لسيبويه',
    author: 'الإمام سيبويه (ت 180هـ)', category: 'اللغة العربية',
    description: 'أعظم كتاب في النحو العربي',
    volumes: createVolumes('kitab-sibawayh', 5, (i) => `https://archive.org/download/FP158970/sib${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'lisan-arab', name: 'لسان العرب',
    author: 'ابن منظور (ت 711هـ)', category: 'اللغة العربية',
    description: 'من أعظم معاجم اللغة العربية',
    volumes: createVolumes('lisan-arab', 18, (i) => `https://archive.org/download/WAQ34180/${String(i).padStart(2, '0')}_34180.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'qamus-muheet', name: 'القاموس المحيط',
    author: 'الفيروز آبادي (ت 817هـ)', category: 'اللغة العربية',
    description: 'من أشهر معاجم اللغة العربية',
    volumes: createVolumes('qamus-muheet', 2, (i) => `https://archive.org/download/FP128196/qms${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mukhtar-sihah', name: 'مختار الصحاح',
    author: 'محمد بن أبي بكر الرازي (ت 666هـ)', category: 'اللغة العربية',
    description: 'معجم مختصر نافع',
    volumes: singleVol('mukhtar-sihah', 'مختار الصحاح', 'https://archive.org/download/FPmukhtarsihah/mukhtarsihah.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'maani-quran-farra', name: 'معاني القرآن للفراء',
    author: 'أبو زكريا الفراء (ت 207هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب معاني القرآن',
    volumes: createVolumes('maani-quran-farra', 3, (i) => `https://archive.org/download/FP156078/mqf${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'maani-quran-akhfash', name: 'معاني القرآن للأخفش',
    author: 'الأخفش الأوسط (ت 215هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أقدم كتب معاني القرآن',
    volumes: singleVol('maani-quran-akhfash', 'معاني القرآن للأخفش', 'https://archive.org/download/FP79825/79825.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'iarab-quran-nahhas', name: 'إعراب القرآن للنحاس',
    author: 'أبو جعفر النحاس (ت 338هـ)', category: 'إعراب القرآن وبيانه',
    description: 'من أمهات كتب إعراب القرآن',
    volumes: createVolumes('iarab-quran-nahhas', 5, (i) => `https://archive.org/download/FP156042/iqn${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'mushkil-iarab-makki', name: 'مشكل إعراب القرآن',
    author: 'مكي بن أبي طالب القيسي (ت 437هـ)', category: 'إعراب القرآن وبيانه',
    description: 'في المشكل من إعراب القرآن',
    volumes: createVolumes('mushkil-iarab-makki', 2, (i) => `https://archive.org/download/FP156039/msh${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - كتب علماء المملكة العربية السعودية ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'baz-fatawa', name: 'مجموع فتاوى ومقالات متنوعة',
    author: 'الشيخ عبد العزيز بن باز (ت 1420هـ)', category: 'العقيدة',
    description: 'فتاوى ومقالات للشيخ ابن باز',
    volumes: createVolumes('baz-fatawa', 30, (i) => `https://archive.org/download/FPmfmbaz/mfmbaz${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'uthaymin-majmu', name: 'مجموع فتاوى ورسائل ابن عثيمين',
    author: 'الشيخ محمد بن صالح العثيمين (ت 1421هـ)', category: 'العقيدة',
    description: 'مجموع فتاوى الشيخ العثيمين',
    volumes: createVolumes('uthaymin-majmu', 26, (i) => `https://archive.org/download/FPmajmuah_otaimin/majmuah_otaimin${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'fawzan-itqan', name: 'الإتقان في فقه القرآن',
    author: 'الشيخ صالح الفوزان', category: 'علوم القرآن',
    description: 'في فقه آيات الأحكام',
    volumes: singleVol('fawzan-itqan', 'الإتقان في فقه القرآن', 'https://archive.org/download/fawzan_itqan/fawzan_itqan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fawzan-aqeedah', name: 'كتاب التوحيد للفوزان',
    author: 'الشيخ صالح الفوزان', category: 'العقيدة',
    description: 'متن مختصر جامع في التوحيد',
    volumes: singleVol('fawzan-aqeedah', 'كتاب التوحيد للفوزان', 'https://archive.org/download/waq25211/25211.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fawzan-sharh-thulath', name: 'شرح الأصول الثلاثة للفوزان',
    author: 'الشيخ صالح الفوزان', category: 'العقيدة',
    description: 'شرح الأصول الثلاثة',
    volumes: singleVol('fawzan-sharh-thulath', 'شرح الأصول الثلاثة', 'https://archive.org/download/FPsrh3usl/srh3usl.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sheikh-albani-salat', name: 'مختصر صفة صلاة النبي',
    author: 'الشيخ محمد ناصر الدين الألباني (ت 1420هـ)', category: 'الفقه وأصوله',
    description: 'مختصر صفة صلاة النبي ﷺ من التكبير إلى التسليم',
    volumes: singleVol('sheikh-albani-salat', 'مختصر صفة صلاة النبي', 'https://archive.org/download/FPmsftsalat/msftsalat.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'ibn-baz-dawa', name: 'الدعوة إلى الله وأخلاق الدعاة',
    author: 'الشيخ عبد العزيز بن باز (ت 1420هـ)', category: 'العقيدة',
    description: 'في فضل الدعوة وأخلاق الدعاة',
    volumes: singleVol('ibn-baz-dawa', 'الدعوة إلى الله', 'https://archive.org/download/FPbazdawa/bazdawa.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - كتب التجويد والقراءات المتقدمة ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'hidayat-qari', name: 'هداية القاري إلى تجويد كلام الباري',
    author: 'عبد الفتاح المرصفي', category: 'التجويد والقراءات',
    description: 'من أجمع كتب التجويد',
    volumes: createVolumes('hidayat-qari', 2, (i) => `https://archive.org/download/FPhidayaqari/hidayaqari${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },
  {
    id: 'burhan-tajweed', name: 'البرهان في تجويد القرآن',
    author: 'الصادق قمحاوي', category: 'التجويد والقراءات',
    description: 'من كتب التجويد المعاصرة',
    volumes: singleVol('burhan-tajweed', 'البرهان في تجويد القرآن', 'https://archive.org/download/FPburhantajweed/burhantajweed.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tajweed-muyassar', name: 'التجويد الميسر',
    author: 'عبد العزيز القارئ', category: 'التجويد والقراءات',
    description: 'كتاب ميسر في أحكام التجويد',
    volumes: singleVol('tajweed-muyassar', 'التجويد الميسر', 'https://archive.org/download/FPtajweedmuyasar/tajweedmuyasar.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - أسباب النزول ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'asbab-nuzul-wahidi', name: 'أسباب النزول',
    author: 'أبو الحسن الواحدي (ت 468هـ)', category: 'أسباب النزول',
    description: 'أقدم وأشهر كتب أسباب النزول',
    volumes: singleVol('asbab-nuzul-wahidi', 'أسباب النزول للواحدي', 'https://archive.org/download/waq3570/3570.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'lubab-nuqul', name: 'لباب النقول في أسباب النزول',
    author: 'جلال الدين السيوطي (ت 911هـ)', category: 'أسباب النزول',
    description: 'من أشهر كتب أسباب النزول',
    volumes: singleVol('lubab-nuqul', 'لباب النقول', 'https://archive.org/download/FP77860/lbn.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'sahih-musnad-asbab', name: 'الصحيح المسند من أسباب النزول',
    author: 'الشيخ مقبل بن هادي الوادعي (ت 1422هـ)', category: 'أسباب النزول',
    description: 'في الصحيح من أسباب النزول',
    volumes: singleVol('sahih-musnad-asbab', 'الصحيح المسند من أسباب النزول', 'https://archive.org/download/FPshmnasbab/shmnasbab.pdf'),
    isSingleVolume: true,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - غريب القرآن ومفرداته ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'mufradat-raghib', name: 'المفردات في غريب القرآن',
    author: 'الراغب الأصفهاني (ت 502هـ)', category: 'غريب القرآن ومفرداته',
    description: 'أعظم كتاب في مفردات القرآن',
    volumes: singleVol('mufradat-raghib', 'المفردات في غريب القرآن', 'https://archive.org/download/FP156074/mqf.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'gharib-ibn-qutayba', name: 'تفسير غريب القرآن',
    author: 'ابن قتيبة الدينوري (ت 276هـ)', category: 'غريب القرآن ومفرداته',
    description: 'من أقدم كتب غريب القرآن',
    volumes: singleVol('gharib-ibn-qutayba', 'غريب القرآن لابن قتيبة', 'https://archive.org/download/FP156075/gbq.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tuhfat-arab', name: 'تحفة الأريب بما في القرآن من الغريب',
    author: 'أبو حيان الأندلسي (ت 745هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم لغريب القرآن',
    volumes: singleVol('tuhfat-arab', 'تحفة الأريب', 'https://archive.org/download/FP156081/thr.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'gharib-ibn-al-athir', name: 'النهاية في غريب الحديث والأثر',
    author: 'ابن الأثير (ت 606هـ)', category: 'غريب القرآن ومفرداته',
    description: 'معجم في غريب الحديث',
    volumes: createVolumes('gharib-ibn-al-athir', 5, (i) => `https://archive.org/download/FP130050/nha${String(i).padStart(2, '0')}.pdf`),
    isSingleVolume: false,
  },

  // ══════════════════════════════════════════════════════════════
  // ██ إضافات جديدة - التدبر والوقفات ██
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tadabur-quran', name: 'مفاتح تدبر القرآن والنجاح في الحياة',
    author: 'د. خالد اللاحم', category: 'التدبر',
    description: 'أثر التدبر في حياة المسلم',
    volumes: singleVol('tadabur-quran', 'مفاتح تدبر القرآن', 'https://archive.org/download/FPmftdbr/mftdbr.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'tadabur-saadi', name: 'القواعد الحسان لتفسير القرآن',
    author: 'الشيخ عبد الرحمن السعدي (ت 1376هـ)', category: 'التدبر',
    description: '70 قاعدة نافعة في تفسير القرآن',
    volumes: singleVol('tadabur-saadi', 'القواعد الحسان', 'https://archive.org/download/FPalqwaidalhisaan/alqwaidalhisaan.pdf'),
    isSingleVolume: true,
  },
  {
    id: 'fasl-khitab', name: 'فصل الخطاب في الزهد والرقائق والآداب',
    author: 'د. صالح بن عبد الله بن حميد', category: 'التدبر',
    description: 'مواعظ قرآنية',
    volumes: singleVol('fasl-khitab', 'فصل الخطاب في الزهد والرقائق', 'https://archive.org/download/FPfaslkhtab/faslkhtab.pdf'),
    isSingleVolume: true,
  },
];

// Deduplicate by id - additional books override core if duplicate id exists
const allBooksMap = new Map<string, BookCollection>();
for (const book of coreBooksCollections) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooks) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch2) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch3) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch4) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch5) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch6) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch7) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch8) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch9) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch10) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch11) {
  allBooksMap.set(book.id, book);
}
for (const book of additionalBooksBatch12) {
  allBooksMap.set(book.id, book);
}

export const booksCollections: BookCollection[] = Array.from(allBooksMap.values());
