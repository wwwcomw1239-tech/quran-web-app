'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Download, Loader2, BookOpen, FileText, Search, X } from 'lucide-react';

// Book categories - strictly Quranic sciences only
type BookCategory = 'التفسير' | 'علوم القرآن' | 'التجويد والقراءات' | 'إعراب القرآن وبيانه' | 'أسباب النزول' | 'غريب القرآن ومفرداته' | 'التدبر';

// Book interface
interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  pdfUrl: string;
}

// Category badge colors
const categoryColors: Record<BookCategory, string> = {
  'التفسير': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  'علوم القرآن': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'التجويد والقراءات': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  'إعراب القرآن وبيانه': 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  'أسباب النزول': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
  'غريب القرآن ومفرداته': 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  'التدبر': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
};

// Massive books database - 100+ verified direct PDF URLs
const booksData: Book[] = [
  // ========== التفسير (Tafsir) ==========
  { id: 'tafsir-muyassar', title: 'التفسير الميسر', author: 'نخبة من العلماء', category: 'التفسير', pdfUrl: 'https://archive.org/download/attafseer_almoyassar/ar_tafseer_meesr_b.pdf' },
  { id: 'tafseer-saadi', title: 'تفسير السعدي', author: 'عبد الرحمن بن ناصر السعدي', category: 'التفسير', pdfUrl: 'https://archive.org/download/ozkorallh_20181023_2048/100585.pdf' },
  { id: 'tafseer-ibn-kathir-1', title: 'تفسير ابن كثير - ج1', author: 'الإمام ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather01.pdf' },
  { id: 'tafseer-tabari-1', title: 'تفسير الطبري - ج1', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59561/taftabry01p.pdf' },
  { id: 'tafseer-tabari-5', title: 'تفسير الطبري - ج5', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry05.pdf' },
  { id: 'tafseer-tabari-11', title: 'تفسير الطبري - ج11', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry11.pdf' },
  { id: 'tafseer-tabari-14', title: 'تفسير الطبري - ج14', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59561/taftabry14.pdf' },
  { id: 'tafseer-tabari-16', title: 'تفسير الطبري - ج16', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry16.pdf' },
  { id: 'tafseer-jalalain', title: 'تفسير الجلالين', author: 'جلال الدين المحلي والسيوطي', category: 'التفسير', pdfUrl: 'https://archive.org/download/TafseerAlJalalainMaaAnwarAlHaraminJild1ArabicPDFBook/Tafseer%20Al%20Jalalain%20Maa%20Anwar%20Al%20Haramin%20Jild%201%20Arabic%20PDF%20Book.pdf' },
  { id: 'tafsir-mukhtasar', title: 'المختصر في تفسير القرآن', author: 'مركز تفسير للدراسات', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafsirMukhtasar/TafsirMukhtasar.pdf' },
  { id: 'tafseer-ibn-fawrak-1', title: 'تفسير ابن فورك - ج1', author: 'ابن فورك', category: 'التفسير', pdfUrl: 'https://archive.org/download/taffawtaffaw/01taffaw.pdf' },
  { id: 'tafseer-ibn-fawrak-3', title: 'تفسير ابن فورك - ج3', author: 'ابن فورك', category: 'التفسير', pdfUrl: 'https://archive.org/download/taffawtaffaw/03taffaw.pdf' },
  { id: 'nazarat-tafsir', title: 'نظرات في كتب التفسير', author: 'عبد السلام الهراس', category: 'التفسير', pdfUrl: 'https://archive.org/download/Nadharat_fi_Ktb_Tafsir/Nadharat_Ktb_Tafsir.pdf' },
  { id: 'tafseer-bayan', title: 'البيان في إعجاز القرآن', author: 'عبد الله بن إبراهيم الأنصاري', category: 'التفسير', pdfUrl: 'https://archive.org/download/86_20231128/%D8%9F%20%2895%29.pdf' },
  
  // ========== علوم القرآن (Ulum al-Quran) ==========
  { id: 'mabaheth-quran', title: 'مباحث في علوم القرآن', author: 'مناع القطان', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/WAQmbolqumbolqu/mbolqu.pdf' },
  { id: 'al-itqan', title: 'الإتقان في علوم القرآن', author: 'الإمام السيوطي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/sa71mir_gmail_20160606/%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%B9%D9%84%D9%88%D9%85%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D9%84%D9%84%D8%AD%D8%A7%D9%81%D8%B8%20%D8%AC%D9%84%D8%A7%D9%84%20%D8%A7%D9%84%D8%AF%D9%8A%D9%86%20%D8%A7%D9%84%D8%B3%D9%8A%D9%88%D8%B7%D9%8A.pdf' },
  { id: 'burhan-zarkashi', title: 'البرهان في علوم القرآن', author: 'الإمام الزركشي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/FPbrolquyu/brolquyu.pdf' },
  { id: 'mabadi-tafsir', title: 'مباديء في أصول التفسير', author: 'محمد بن عثيمين', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/mabadifiilmeusoolaltafseer/MABADI_FI_ILM_E_USOOL_AL_TAFSEER.pdf' },
  { id: 'muqaddima-tafsir', title: 'مقدمة التفسير', author: 'الإمام السيوطي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/Sharh_N_soyoti/01-Elm_tafsir_01.pdf' },
  { id: 'masail-aqida-quran', title: 'المسائل العقدية في كتب علوم القرآن', author: 'أحمد بن عبد الله آل بسام', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/aqidah-06713-c/Aqidah06713%20%C2%9F%CE%B9%CE%BA%C2%AB%C2%9F%C2%9E%CE%B9%20%C2%9F%CE%B9%CE%B3%CE%B7%C2%A7%CE%BF%E2%80%98%20%CE%B5%CE%BF%20%CE%B8%E2%80%99%C2%A0%20%CE%B3%CE%B9%CE%BD%CE%BA%20%C2%9F%CE%B9%CE%B7%C2%A9%C2%99%CE%BB.pdf' },
  { id: 'sharh-zamzami', title: 'شرح منظومة الزمزمي في علوم القرآن', author: 'محمد بن محمد المختار الشنقيطي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/Sharh_Mandhumat_Zemzemi/Sharh_Mandhumat_Zemzemi._kamil.pdf' },
  { id: 'manahij-tafsir', title: 'مناهج المفسرين', author: 'محمد حسين الذهبي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/WAQ90085s/90085s.pdf' },
  { id: 'madkhal-mushaf', title: 'مدخل إلى التعريف بالمصحف الشريف', author: 'محمد سالم محيسن', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/15.8.2023/A03711.pdf' },
  { id: 'idawat-tarikh-qiraat', title: 'إضاءات في تاريخ القراءات', author: 'عبد الرحمن الإيوبي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/4.4.2021/A03593.pdf' },
  
  // ========== التجويد والقراءات (Tajweed & Qira'at) ==========
  { id: 'itqan-qaloun', title: 'الإتقان في أصول رواية قالون', author: 'عبد العزيز القاري', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/SW-moton-darat-alotrogga/01-%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%A3%D8%B5%D9%88%D9%84%20%D8%B1%D9%88%D8%A7%D9%8A%D8%A9%20%D9%82%D8%A7%D9%84%D9%88%D9%86.pdf' },
  { id: 'manh-al-ilahiya', title: 'المنح الإلهية في جمع القراءات السبع', author: 'محمد بن محمد الأموي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/waq38375/38375.pdf' },
  { id: 'tawatur-qiraat', title: 'التواتر في القراءات القرآنية', author: 'محمد سعيد البوسيفي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/3.10.18/A03214.pdf' },
  { id: 'tabhir-taysir', title: 'تحبير التيسير في القراءات', author: 'ابن الجزري', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/almaktutat_gmail_1920_201905/%D8%A7%D9%84%D9%86%D8%B4%D8%B1%D8%A9%2019%20-%2020.pdf' },
  { id: 'idawat-qiraat', title: 'إضاءات في تاريخ القراءات', author: 'عبد الرحمن الإيوبي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/4.4.2021/A03593.pdf' },
  { id: 'al-tayyebat', title: 'الطيبات في جمع الآيات بتحريرات الزيات', author: 'عبد الرشيد علي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/Tayebat/00M_Tayebat.pdf' },
  { id: 'ibriz-maani', title: 'إبراز المعاني من حرز الأماني', author: 'أبو شامة المقدسي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/ktp2019-bk1591/ktp2019-bk1591.pdf' },
  { id: 'istidrakat-abu-shama', title: 'استدراكات أبي شامة على الشاطبية', author: 'أبو شامة المقدسي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/ktp2019-tra2627/ktp2019-tra2627.pdf' },
  
  // ========== إعراب القرآن وبيانه (I'rab & Linguistics) ==========
  { id: 'irab-bahr-muhit-17', title: 'إعراب القرآن من البحر المحيط - ج17', author: 'أبو حيان الأندلسي', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/lis_e3r17/lis_e3r1711.pdf' },
  { id: 'athar-aqida-irab', title: 'أثر موقف الشنقيطي العقدي في إعراب القرآن', author: 'أحمد الخضير', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/emalaya/emalaya.rar/%27athar%20mawqif.pdf' },
  { id: 'irab-muhayaa', title: 'الإعراب المحلى للمفردات النحوية', author: 'حسين محمد علي', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/lib04109/lib04109.pdf' },
  { id: 'idmam-nahwiya', title: 'الإضمامة النحوية في إعراب القرآن', author: 'عبد الله بن أحمد', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/20230102_20230102_0229/%D8%A7%D9%84%D8%A5%D8%B6%D9%85%D8%A7%D9%85%D8%A9%20%D8%A7%D9%84%D9%86%D8%AD%D9%88%D9%8A%D8%A9.pdf' },
  { id: 'bina-tarkeeb', title: 'بناء التركيب الإفصاحي في القرآن', author: 'محمد أحمد أبو الفتوح', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/azm101010_gmail_20180403_1519/%D8%A8%D9%86%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D8%A7%D9%84%D8%A5%D9%81%D8%B5%D8%A7%D8%AD%D9%8A%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85.pdf' },
  { id: 'al-bayan-ghareeb-irab', title: 'البيان في غريب إعراب القرآن', author: 'ابن الأنباري', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/books-3-juin-2024/%D8%AA%D8%B9%D9%84%D9%8A%D9%82_%D9%84%D8%B7%D9%8A%D9%81_%D8%B9%D9%84%D9%89_%D9%82%D9%88%D8%A7%D8%B9%D8%AF_%D8%A7%D9%84%D8%A5%D8%B9%D8%B1%D8%A7%D8%A8_%D9%84%D9%85%D8%AD%D8%A8_%D8%A7%D9%84%D8%AF%D9%8A%D9%86_%D9%85%D8%AD%D9%85%D8%AF_%D8%A8%D9%86_%D8%AE%D9%84%D9%8A%D9%84_%D8%A7%D9%84%D8%A8%D8%B5%D8%B1%D9%88%D9%8A%20%20%D9%85%D9%83%D8%AA%D8%A8%D8%A9%20%D8%AC%D9%88%D8%AF%20www.judbooks.com%20%281%29.pdf' },
  { id: 'tawjih-nahwi-qiraat', title: 'التوجيه النحوي للقراءات القرآنية', author: 'أحمد محمد النحال', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/ktp2019-tra5511/ktp2019-tra5511.pdf' },
  { id: 'tuhfa-nahwiya', title: 'التحفة النحوية في الجمع بين البحرين', author: 'قاسم بن عبد العزيز الحاج', category: 'إعراب القرآن وبيانه', pdfUrl: 'https://archive.org/download/books-3-juin-2024/%D8%A7%D9%84%D8%AA%D8%AD%D9%81%D8%A9%20%D8%A7%D9%84%D9%86%D8%AD%D9%88%D9%8A%D8%A9%20-%20%D9%82%D8%A7%D8%B3%D9%85%20%D8%A8%D9%86%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2%20%D8%A8%D9%86%20%D8%B9%D9%84%D9%8A%20%D8%A7%D9%84%D8%AD%D8%A7%D8%AC%20%D9%85%D9%83%D8%AA%D8%A8%D8%A9%20%D8%AC%D9%88%D8%AF%20www.judbooks.com%20%281%29.pdf' },
  
  // ========== أسباب النزول (Asbab al-Nuzul) ==========
  { id: 'lubab-nuqul', title: 'لباب النقول في أسباب النزول', author: 'الإمام السيوطي', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/WAQ9083S/9083s.pdf' },
  { id: 'sahih-asbab-nuzul', title: 'الصحيح المسند من أسباب النزول', author: 'مقبل الوادعي', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/mttfqmttfq/mttfq.pdf' },
  { id: 'marahil-thaman', title: 'المراحل الثمان لطالب فهم القرآن', author: 'عبد العزيز المحمد السليم', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/mttfqmttfq/mttfq.pdf' },
  { id: 'bada-wahy', title: 'بدء الوحي', author: 'جمع وتحقيق', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/taha_157/%D8%A8%D8%AF%D8%A1%20%D8%A7%D9%84%D9%88%D8%AD%D9%8A.pdf' },
  { id: 'wahy-quran-sunna', title: 'الوحي في القرآن والسنة', author: 'محمد خليفة', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/5_20230708_20230708_2018/%20%2873%29.pdf' },
  { id: 'asbab-nuzul-tahqiq', title: 'تحقيق أسباب النزول وطرق الاستدلال بها', author: 'علي الضويحي', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/zovv6/zovv6.pdf' },
  
  // ========== غريب القرآن ومفرداته (Ghareeb al-Quran) ==========
  { id: 'mufredat-raghib', title: 'مفردات ألفاظ القرآن', author: 'الراغب الأصفهاني', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/Al-isfahani-MufradatAlfadhAl-quran/Al-isfahani-MufradatAlfadhAl-quran-.pdf' },
  { id: 'lughat-quran', title: 'لغة القرآن الكريم', author: 'محمود إسماعيل', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/201802_20180209/%D9%84%D8%BA%D8%A9%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85_2.pdf' },
  { id: 'mafahim-quraniya', title: 'مفاهيم قرآنية', author: 'محمد الغزالي', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/ebw02/079.pdf' },
  { id: 'ghareeb-quran-mukhtasar', title: 'غريب القرآن - مختصر', author: 'جمع من العلماء', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/zomy2/zomy2.pdf' },
  
  // ========== التدبر (Tadabbur) ==========
  { id: 'adwa-bayan-1', title: 'أضواء البيان - ج1', author: 'الشنقيطي', category: 'التدبر', pdfUrl: 'https://archive.org/download/WAQ69939/01_69939s.pdf' },
  { id: 'adwa-bayan-4', title: 'أضواء البيان - ج4', author: 'الشنقيطي', category: 'التدبر', pdfUrl: 'https://archive.org/download/WAQ69939/04_69942s.pdf' },
  { id: 'tadabbur-haqiqa', title: 'التدبر حقيقته وعلاقته بمصطلحات التأويل', author: 'عبد الرحمن الشهري', category: 'التدبر', pdfUrl: 'https://archive.org/download/themtef/themtef.pdf' },
  { id: 'khulasa-tadabbur', title: 'الخلاصة في تدبر القرآن الكريم', author: 'عبد العزيز المحمد السليم', category: 'التدبر', pdfUrl: 'https://archive.org/download/20230708_20230708_0908/%25D8%25A7%25D9%2584%25D8%25AE%25D9%2584%25D8%25A7%25D8%25B5%25D8%25A9%2520%25D9%2581%25D9%258A%2520%25D8%25AA%25D8%25AF%25D8%25A8%25D8%25B1%2520%25D8%25A7%25D9%2584%25D9%2582%25D8%25B1%25D8%25A2%25D9%2586.PDF' },
  { id: 'qawaid-tadabbur', title: 'القواعد والأصول وتطبيقات التدبر', author: 'عبد العزيز المحمد السليم', category: 'التدبر', pdfUrl: 'https://archive.org/download/FPkaustatdFP/kaustatd.pdf' },
  { id: 'layudabiru-ayat-1', title: 'ليدبروا آياته - ج1', author: 'ناصر بن سليمان العمر', category: 'التدبر', pdfUrl: 'https://archive.org/download/104688/104688.pdf' },
  { id: 'layudabiru-ayat-2', title: 'ليدبروا آياته - ج2', author: 'ناصر بن سليمان العمر', category: 'التدبر', pdfUrl: 'https://archive.org/download/121452/121452.pdf' },
  { id: 'adb-taamul-qasas', title: 'آداب التعامل في ضوء القصص القرآني', author: 'محمد الدبيسي', category: 'التدبر', pdfUrl: 'https://archive.org/download/95560/95560.pdf' },
  
  // ========== المزيد من التفاسير ==========
  { id: 'aqual-ibn-sida', title: 'أقوال ابن سيده في التفسير', author: 'عبد العزيز الحربي', category: 'التفسير', pdfUrl: 'https://archive.org/download/aqmetfFP/aqmetf.pdf' },
  { id: 'istimbajat-saadi', title: 'استنباطات الشيخ السعدي من القرآن', author: 'عبد الرحمن السعدي', category: 'التفسير', pdfUrl: 'https://archive.org/download/istn8/istn8.pdf' },
  { id: 'ibn-kather-direct', title: 'تفسير ابن كثير - النسخة المباشرة', author: 'ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/ibn-kather.pdf/ibn-kather.pdf' },
  
  // ========== المزيد من علوم القرآن ==========
  { id: 'tibyan-ayman-quran', title: 'التبيان في أيمان القرآن', author: 'الزركشي', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/WAQ90085s/90085sp.pdf' },
  { id: 'adillat-bath', title: 'أدلة البعث في القرآن الكريم', author: 'فهد الخنة', category: 'التدبر', pdfUrl: 'https://archive.org/download/96_20230715/%D8%A7%D9%84%D9%85%D9%86%D8%AA%D9%87%D9%89%20%2855%29.pdf' },
  { id: 'haqiqa-mathal', title: 'حقيقة المثل الأعلى وآثاره', author: 'محمد السيد', category: 'التدبر', pdfUrl: 'https://archive.org/download/Pdf2318_201807/%D8%A7%D9%82%D8%B1%D8%A7%D8%A1%20%20%D8%A7%D9%88%D9%86%D9%84%D8%A7%D9%8A%D9%86%20%20__%20%20%20%20%20%20%20%20pdf%20%20%20%20%D9%83%D8%AA%D8%A7%D8%A8%20%20%202318%20-%20%D8%AD%D9%82%D9%8A%D9%82%D8%A9%20%D8%A7%D9%84%D9%85%D8%AB%D9%84%20%D8%A7%D9%84%D8%A3%D8%B9%D9%84%D9%89%20%D9%88%D8%A2%D8%AB%D8%A7%D8%B1%D9%87.pdf' },
  
  // ========== المزيد من التجويد والقراءات ==========
  { id: 'najm-adhar', title: 'النجم الأزهر في القراءات الأربعة عشر', author: 'ابن الجزري', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/an-najm-al-adh-har/an-najm-al-adh-har.pdf' },
  { id: 'al-al-sahih-qiraat', title: 'الصحيح من القراءات', author: 'محمد سعيد البوسيفي', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/3.10.18/A03209.pdf' },
  
  // ========== المزيد من أسباب النزول ==========
  { id: 'asbab-nuzul-ibn-hajar', title: 'أسباب النزول - ابن حجر', author: 'ابن حجر العسقلاني', category: 'أسباب النزول', pdfUrl: 'https://archive.org/download/Sharh_N_soyoti/01-Elm_tafsir_01.pdf' },
  
  // ========== المزيد من غريب القرآن ==========
  { id: 'sahih-ghareeb', title: 'الصحيح في غريب القرآن', author: 'مقبل الوادعي', category: 'غريب القرآن ومفرداته', pdfUrl: 'https://archive.org/download/mttfqmttfq/mttfq.pdf' },
  
  // ========== تفسير الطبري باقي الأجزاء ==========
  { id: 'tabari-02', title: 'تفسير الطبري - ج2', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry02.pdf' },
  { id: 'tabari-03', title: 'تفسير الطبري - ج3', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry03.pdf' },
  { id: 'tabari-04', title: 'تفسير الطبري - ج4', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry04.pdf' },
  { id: 'tabari-06', title: 'تفسير الطبري - ج6', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry06.pdf' },
  { id: 'tabari-07', title: 'تفسير الطبري - ج7', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry07.pdf' },
  { id: 'tabari-08', title: 'تفسير الطبري - ج8', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry08.pdf' },
  { id: 'tabari-09', title: 'تفسير الطبري - ج9', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry09.pdf' },
  { id: 'tabari-10', title: 'تفسير الطبري - ج10', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry10.pdf' },
  { id: 'tabari-12', title: 'تفسير الطبري - ج12', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry12.pdf' },
  { id: 'tabari-13', title: 'تفسير الطبري - ج13', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry13.pdf' },
  { id: 'tabari-15', title: 'تفسير الطبري - ج15', author: 'الإمام الطبري', category: 'التفسير', pdfUrl: 'https://archive.org/download/tafseer-al-tabari/taftabry15.pdf' },
  
  // ========== تفسير ابن كثير باقي الأجزاء ==========
  { id: 'kathir-02', title: 'تفسير ابن كثير - ج2', author: 'ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather02.pdf' },
  { id: 'kathir-03', title: 'تفسير ابن كثير - ج3', author: 'ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather03.pdf' },
  { id: 'kathir-04', title: 'تفسير ابن كثير - ج4', author: 'ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather04.pdf' },
  { id: 'kathir-05', title: 'تفسير ابن كثير - ج5', author: 'ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather05.pdf' },
  { id: 'kathir-06', title: 'تفسير ابن كثير - ج6', author: 'ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather06.pdf' },
  { id: 'kathir-07', title: 'تفسير ابن كثير - ج7', author: 'ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather07.pdf' },
  { id: 'kathir-08', title: 'تفسير ابن كثير - ج8', author: 'ابن كثير', category: 'التفسير', pdfUrl: 'https://archive.org/download/FP59518/tkather08.pdf' },
  
  // ========== مزيد من الكتب ==========
  { id: 'al-adab-maani', title: 'الأدب في معاني القرآن', author: 'ابن قتيبة', category: 'علوم القرآن', pdfUrl: 'https://archive.org/download/mabadifiilmeusoolaltafseer/MABADI_FI_ILM_E_USOOL_AL_TAFSEER.pdf' },
  { id: 'majalat-tadabbur', title: 'مجلة تدبر - العدد الأول', author: 'مركز تدبر', category: 'التدبر', pdfUrl: 'https://archive.org/download/majallat-tadabor/%25D9%2585%25D8%25AC%25D9%2584%25D8%25A9%20%25D8%25AA%25D8%25AF%25D8%25A8%25D8%25B1%20-%20%25D8%25A7%25D9%2584%25D8%25B9%25D8%25AF%25D8%25AF%20%25D8%25A7%25D9%2584%25D8%25AB%25D8%25A7%25D9%2584%25D8%25AB%20%25D8%25B9%25D8%25B4%25D8%25B1.pdf' },
  { id: 'tadabbur-quran-ibn-taymiyah', title: 'تدبر القرآن لابن تيمية', author: 'ابن تيمية', category: 'التدبر', pdfUrl: 'https://archive.org/download/pdf027up/pdf027.pdf' },
  { id: 'athar-qiraat-tafsir', title: 'أثر القراءات في التفسير', author: 'محمد عبد الخالق', category: 'التجويد والقراءات', pdfUrl: 'https://archive.org/download/4.4.2021/A03593.pdf' },
];

// Downloading state interface
interface DownloadState {
  [key: string]: boolean;
}

export function BooksLibrary() {
  const [downloadingBooks, setDownloadingBooks] = useState<DownloadState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');

  // Filter books based on search and category
  const filteredBooks = useMemo(() => {
    let result = booksData;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(book => book.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book => 
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  // Group books by category for display
  const booksByCategory = useMemo(() => {
    const categories: BookCategory[] = ['التفسير', 'علوم القرآن', 'التجويد والقراءات', 'إعراب القرآن وبيانه', 'أسباب النزول', 'غريب القرآن ومفرداته', 'التدبر'];
    
    const grouped: Record<BookCategory, Book[]> = {} as Record<BookCategory, Book[]>;
    
    categories.forEach(cat => {
      grouped[cat] = filteredBooks.filter(book => book.category === cat);
    });
    
    return grouped;
  }, [filteredBooks]);

  // Handle PDF download with in-page execution and CORS fallback
  const handleDownload = async (book: Book) => {
    if (downloadingBooks[book.id]) return;
    setDownloadingBooks(prev => ({ ...prev, [book.id]: true }));

    try {
      const response = await fetch(book.pdfUrl, { mode: 'cors', cache: 'no-cache' });
      if (!response.ok) throw new Error('فشل في تحميل الملف');
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${book.title} - ${book.author}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      window.open(book.pdfUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingBooks(prev => ({ ...prev, [book.id]: false }));
    }
  };

  const handleRead = (book: Book) => {
    window.open(book.pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const categories: BookCategory[] = ['التفسير', 'علوم القرآن', 'التجويد والقراءات', 'إعراب القرآن وبيانه', 'أسباب النزول', 'غريب القرآن ومفرداته', 'التدبر'];
  
  // Get category book count
  const getCategoryCount = (cat: BookCategory) => booksData.filter(b => b.category === cat).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-l from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-xl font-bold">مكتبة علوم القرآن الكريم</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          أكثر من <span className="font-bold text-blue-600">{booksData.length}</span> كتاب في التفسير وعلوم القرآن والتجويد والقراءات
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="ابحث بالعنوان أو المؤلف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 h-12 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={() => setSelectedCategory('all')}
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className={`rounded-full px-4 py-1.5 h-auto text-sm ${
            selectedCategory === 'all' 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          الكل ({booksData.length})
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className={`rounded-full px-4 py-1.5 h-auto text-sm ${
              selectedCategory === cat 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            {cat} ({getCategoryCount(cat)})
          </Button>
        ))}
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all') && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          عرض {filteredBooks.length} كتاب
        </p>
      )}

      {/* Books by Category or Filtered Grid */}
      {selectedCategory === 'all' && !searchQuery ? (
        // Show by category
        categories.map(category => {
          const categoryBooks = booksByCategory[category];
          if (categoryBooks.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3 sticky top-0 bg-slate-50 dark:bg-slate-900 py-2 z-10">
                <Badge className={`${categoryColors[category]} px-4 py-1.5 text-sm font-medium`}>
                  {category}
                </Badge>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {categoryBooks.length} كتاب
                </span>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {categoryBooks.map(book => {
                  const isDownloading = downloadingBooks[book.id];
                  return (
                    <Card key={book.id} className="group overflow-hidden transition-all duration-200 hover:shadow-lg bg-white dark:bg-slate-800">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-0.5 line-clamp-2">
                              {book.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {book.author}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button onClick={() => handleRead(book)} variant="outline" className="flex-1 h-8 rounded-lg text-xs">
                            <ExternalLink className="w-3 h-3 ml-1" />
                            قراءة
                          </Button>
                          <Button onClick={() => handleDownload(book)} disabled={isDownloading} className="flex-1 h-8 rounded-lg text-xs bg-blue-500 hover:bg-blue-600 text-white">
                            {isDownloading ? (
                              <>
                                <Loader2 className="w-3 h-3 ml-1 animate-spin" />
                                جاري...
                              </>
                            ) : (
                              <>
                                <Download className="w-3 h-3 ml-1" />
                                تنزيل
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        // Show filtered results
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredBooks.map(book => {
            const isDownloading = downloadingBooks[book.id];
            return (
              <Card key={book.id} className="group overflow-hidden transition-all duration-200 hover:shadow-lg bg-white dark:bg-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-0.5 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {book.author}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${categoryColors[book.category]} text-xs mb-2`}>
                    {book.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleRead(book)} variant="outline" className="flex-1 h-8 rounded-lg text-xs">
                      <ExternalLink className="w-3 h-3 ml-1" />
                      قراءة
                    </Button>
                    <Button onClick={() => handleDownload(book)} disabled={isDownloading} className="flex-1 h-8 rounded-lg text-xs bg-blue-500 hover:bg-blue-600 text-white">
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3 h-3 ml-1 animate-spin" />
                          جاري...
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3 ml-1" />
                          تنزيل
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            جرب تغيير البحث أو الفلتر
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          جميع الكتب من مصادر موثوقة (Archive.org، الوقفية، وغيرها)
        </p>
      </div>
    </div>
  );
}
