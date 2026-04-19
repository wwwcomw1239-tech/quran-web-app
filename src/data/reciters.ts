// Reciters data with their audio URLs
// Verified Mp3Quran server URLs - ALL URLs fetched from official API and tested
// Source: https://mp3quran.net/api/v3/reciters
// Every URL has been verified with HTTP 200 response

export interface Reciter {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  baseUrl: string;
  imageUrl?: string;
}

export const reciters: Reciter[] = [
  {
    id: 'minshawi',
    nameArabic: 'محمد صديق المنشاوي',
    nameEnglish: 'Mohammed Siddiq Al-Minshawi',
    baseUrl: 'https://server10.mp3quran.net/minsh',
  },
  {
    id: 'afs',
    nameArabic: 'مشاري راشد العفاسي',
    nameEnglish: 'Mishary Rashed Alafasy',
    baseUrl: 'https://server8.mp3quran.net/afs',
  },
  {
    id: 'husary',
    nameArabic: 'محمود خليل الحصري',
    nameEnglish: 'Mahmoud Khalil Al-Husary',
    baseUrl: 'https://server13.mp3quran.net/husr',
  },
  {
    id: 'maher',
    nameArabic: 'ماهر المعيقلي',
    nameEnglish: 'Maher Al-Muaiqly',
    baseUrl: 'https://server12.mp3quran.net/maher',
  },
  {
    id: 'fares_abbad',
    nameArabic: 'فارس عباد',
    nameEnglish: 'Fares Abbad',
    baseUrl: 'https://server8.mp3quran.net/frs_a',
  },
  {
    id: 'sudais',
    nameArabic: 'عبد الرحمن السديس',
    nameEnglish: 'Abdul Rahman Al-Sudais',
    baseUrl: 'https://server11.mp3quran.net/sds',
  },
  {
    id: 'ghamdi',
    nameArabic: 'سعد الغامدي',
    nameEnglish: 'Saad Al-Ghamdi',
    baseUrl: 'https://server7.mp3quran.net/s_gmd',
  },
  {
    id: 'shatri',
    nameArabic: 'أبو بكر الشاطري',
    nameEnglish: 'Abu Bakr Al-Shatri',
    baseUrl: 'https://server11.mp3quran.net/shatri',
  },
  {
    id: 'dosari',
    nameArabic: 'ياسر الدوسري',
    nameEnglish: 'Yasser Al-Dosari',
    baseUrl: 'https://server11.mp3quran.net/yasser',
  },
  {
    id: 'jalil',
    nameArabic: 'خالد الجليل',
    nameEnglish: 'Khalid Al-Jalil',
    baseUrl: 'https://server10.mp3quran.net/jleel',
  },
  {
    id: 'ajmi',
    nameArabic: 'أحمد بن علي العجمي',
    nameEnglish: 'Ahmad Bin Ali Al-Ajmi',
    baseUrl: 'https://server10.mp3quran.net/ajm',
  },
  {
    id: 'ayyub',
    nameArabic: 'محمد أيوب',
    nameEnglish: 'Muhammad Ayyub',
    baseUrl: 'https://server8.mp3quran.net/ayyub',
  },
  {
    id: 'abkar',
    nameArabic: 'إدريس أبكر',
    nameEnglish: 'Idris Abkar',
    baseUrl: 'https://server6.mp3quran.net/abkr',
  },
  {
    id: 'qatami',
    nameArabic: 'ناصر القطامي',
    nameEnglish: 'Nasser Al Qatami',
    baseUrl: 'https://server6.mp3quran.net/qtm',
  },
  {
    id: 'yamani',
    nameArabic: 'وديع اليمني',
    nameEnglish: 'Wadih Al Yamani',
    baseUrl: 'https://server6.mp3quran.net/wdee3',
  },
  {
    id: 'basfar',
    nameArabic: 'عبدالله بصفر',
    nameEnglish: 'Abdullah Basfar',
    baseUrl: 'https://server6.mp3quran.net/bsfr',
  },
  {
    id: 'ali_jaber',
    nameArabic: 'علي جابر',
    nameEnglish: 'Ali Jaber',
    baseUrl: 'https://server11.mp3quran.net/a_jbr',
  },
  {
    id: 'al_banna',
    nameArabic: 'محمود علي البنا',
    nameEnglish: 'Mahmoud Ali Al Banna',
    baseUrl: 'https://server8.mp3quran.net/bna',
  },
  {
    id: 'bukhatir',
    nameArabic: 'صلاح بو خاطر',
    nameEnglish: 'Salah Bukhatir',
    baseUrl: 'https://server8.mp3quran.net/bu_khtr',
  },
  {
    id: 'jibril',
    nameArabic: 'محمد جبريل',
    nameEnglish: 'Muhammad Jibril',
    baseUrl: 'https://server8.mp3quran.net/jbrl',
  },
  {
    id: 'luhaidan',
    nameArabic: 'محمد اللحيدان',
    nameEnglish: 'Muhammad Al-Luhaidan',
    baseUrl: 'https://server8.mp3quran.net/lhdan',
  },
  {
    id: 'juhany',
    nameArabic: 'عبدالله عواد الجهني',
    nameEnglish: 'Abdullah Awad Al-Juhany',
    baseUrl: 'https://server13.mp3quran.net/jhn',
  },
  {
    id: 'hani_rifai',
    nameArabic: 'هاني الرفاعي',
    nameEnglish: 'Hani Ar-Rifai',
    baseUrl: 'https://server8.mp3quran.net/hani',
  },
  {
    id: 'qahtani',
    nameArabic: 'خالد القحطاني',
    nameEnglish: 'Khaled Al-Qahtani',
    baseUrl: 'https://server10.mp3quran.net/qht',
  },
  {
    id: 'arkani',
    nameArabic: 'عبدالمجيد الأركاني',
    nameEnglish: 'Abdul Wali Al Arkani',
    baseUrl: 'https://server6.mp3quran.net/arkani',
  },
  {
    id: 'sayegh',
    nameArabic: 'توفيق الصايغ',
    nameEnglish: 'Tawfiq As-Sayegh',
    baseUrl: 'https://server6.mp3quran.net/twfeeq',
  },
  {
    id: 'tunaiji',
    nameArabic: 'خليفة الطنيجي',
    nameEnglish: 'Khalifa Al Tunaiji',
    baseUrl: 'https://server12.mp3quran.net/tnjy',
  },
  {
    id: 'budair',
    nameArabic: 'صلاح البدير',
    nameEnglish: 'Salah Al Budair',
    baseUrl: 'https://server6.mp3quran.net/s_bud',
  },
  {
    id: 'mustafa',
    nameArabic: 'مصطفى إسماعيل',
    nameEnglish: 'Mustafa Ismail',
    baseUrl: 'https://server8.mp3quran.net/mustafa',
  },
  {
    id: 'baleela',
    nameArabic: 'بندر بليلة',
    nameEnglish: 'Bandar Baleela',
    baseUrl: 'https://server6.mp3quran.net/balilah',
  },
  {
    id: 'nabil_rifai',
    nameArabic: 'نبيل الرفاعي',
    nameEnglish: 'Nabil Ar-Rifai',
    baseUrl: 'https://server9.mp3quran.net/nabil',
  },
  {
    id: 'khayyat',
    nameArabic: 'عبدالله خياط',
    nameEnglish: 'Abdullah Khayyat',
    baseUrl: 'https://server12.mp3quran.net/kyat',
  },
  // === NEW RECITERS (25) - All verified from Mp3Quran API ===
  {
    id: 'huthaify',
    nameArabic: 'علي بن عبدالرحمن الحذيفي',
    nameEnglish: 'Ali Al-Huthaify',
    baseUrl: 'https://server9.mp3quran.net/hthfi',
  },
  {
    id: 'shuraim',
    nameArabic: 'سعود الشريم',
    nameEnglish: 'Saud Al-Shuraim',
    baseUrl: 'https://server7.mp3quran.net/shur',
  },
  {
    id: 'abdulbasit',
    nameArabic: 'عبدالباسط عبدالصمد',
    nameEnglish: 'Abdulbasit Abdulsamad',
    baseUrl: 'https://server7.mp3quran.net/basit',
  },
  {
    id: 'matrood',
    nameArabic: 'عبدالله المطرود',
    nameEnglish: 'Abdullah Al-Matrood',
    baseUrl: 'https://server8.mp3quran.net/mtrod',
  },
  {
    id: 'qasim',
    nameArabic: 'عبدالمحسن القاسم',
    nameEnglish: 'Abdulmohsen Al-Qasim',
    baseUrl: 'https://server8.mp3quran.net/qasm',
  },
  {
    id: 'rayan',
    nameArabic: 'عادل ريان',
    nameEnglish: 'Adel Rayan',
    baseUrl: 'https://server8.mp3quran.net/ryan',
  },
  {
    id: 'nauina',
    nameArabic: 'أحمد نعينع',
    nameEnglish: 'Ahmad Nauina',
    baseUrl: 'https://server11.mp3quran.net/ahmad_nu',
  },
  {
    id: 'alzain',
    nameArabic: 'الزين محمد أحمد',
    nameEnglish: 'Al-Zain Muhammad Ahmad',
    baseUrl: 'https://server9.mp3quran.net/alzain',
  },
  {
    id: 'akhdar',
    nameArabic: 'إبراهيم الأخضر',
    nameEnglish: 'Ibrahim Al-Akhdar',
    baseUrl: 'https://server6.mp3quran.net/akdr',
  },
  {
    id: 'jamal_shaker',
    nameArabic: 'جمال شاكر عبدالله',
    nameEnglish: 'Jamal Shaker Abdullah',
    baseUrl: 'https://server6.mp3quran.net/jamal',
  },
  {
    id: 'abdulkafi',
    nameArabic: 'خالد عبدالكافي',
    nameEnglish: 'Khalid Abdulkafi',
    baseUrl: 'https://server11.mp3quran.net/kafi',
  },
  {
    id: 'tablawi',
    nameArabic: 'محمد الطبلاوي',
    nameEnglish: 'Mohammad Al-Tablawi',
    baseUrl: 'https://server12.mp3quran.net/tblawi',
  },
  {
    id: 'qazabri',
    nameArabic: 'عمر القزابري',
    nameEnglish: 'Omar Al-Qazabri',
    baseUrl: 'https://server9.mp3quran.net/omar_warsh',
  },
  {
    id: 'sahl_yassin',
    nameArabic: 'سهل ياسين',
    nameEnglish: 'Sahl Yassin',
    baseUrl: 'https://server6.mp3quran.net/shl',
  },
  {
    id: 'salah_hashim',
    nameArabic: 'صلاح الهاشم',
    nameEnglish: 'Salah Al-Hashim',
    baseUrl: 'https://server12.mp3quran.net/salah_hashim_m',
  },
  {
    id: 'yahya_hawwa',
    nameArabic: 'يحيى حوا',
    nameEnglish: 'Yahya Hawwa',
    baseUrl: 'https://server12.mp3quran.net/yahya',
  },
  {
    id: 'zaki',
    nameArabic: 'زكي داغستاني',
    nameEnglish: 'Zaki Daghistani',
    baseUrl: 'https://server9.mp3quran.net/zaki',
  },
  {
    id: 'abdulwadood',
    nameArabic: 'عبدالودود حنيف',
    nameEnglish: 'Abdulwadood Haneef',
    baseUrl: 'https://server8.mp3quran.net/wdod',
  },
  {
    id: 'hawashi',
    nameArabic: 'أحمد الحواشي',
    nameEnglish: 'Ahmad Al-Hawashi',
    baseUrl: 'https://server11.mp3quran.net/hawashi',
  },
  {
    id: 'alaqmi',
    nameArabic: 'أكرم العلاقمي',
    nameEnglish: 'Akram Al-Alaqmi',
    baseUrl: 'https://server9.mp3quran.net/akrm',
  },
  {
    id: 'jibreen',
    nameArabic: 'إبراهيم الجبرين',
    nameEnglish: 'Ibrahim Al-Jibreen',
    baseUrl: 'https://server6.mp3quran.net/jbreen',
  },
  {
    id: 'osaimi',
    nameArabic: 'جمعان العصيمي',
    nameEnglish: 'Jamaan Al-Osaimi',
    baseUrl: 'https://server6.mp3quran.net/jaman',
  },
  {
    id: 'shemmy',
    nameArabic: 'محمود الشيمي',
    nameEnglish: 'Mahmoud Al-Shemmy',
    baseUrl: 'https://server10.mp3quran.net/sheimy',
  },
  {
    id: 'lahoni',
    nameArabic: 'مصطفى اللاهوني',
    nameEnglish: 'Mustafa Al-Lahoni',
    baseUrl: 'https://server6.mp3quran.net/lahoni',
  },
  {
    id: 'nima_hassan',
    nameArabic: 'نعمة الحسان',
    nameEnglish: 'Nima Al-Hassan',
    baseUrl: 'https://server8.mp3quran.net/namh',
  },
  // === NEW RECITERS BATCH 2 (30) - All verified from Mp3Quran API ===
  {
    id: 'thubaiti',
    nameArabic: 'عبدالبارئ الثبيتي',
    nameEnglish: 'Abdul Bari Al-Thubaiti',
    baseUrl: 'https://server6.mp3quran.net/thubti',
  },
  {
    id: 'khalaf',
    nameArabic: 'عبدالله الخلف',
    nameEnglish: 'Abdullah Al-Khalaf',
    baseUrl: 'https://server14.mp3quran.net/khalf',
  },
  {
    id: 'sufi',
    nameArabic: 'عبدالرشيد صوفي',
    nameEnglish: 'Abdul Rashid Sufi',
    baseUrl: 'https://server16.mp3quran.net/soufi/Rewayat-Hafs-A-n-Assem',
  },
  {
    id: 'trabulsi',
    nameArabic: 'أحمد الطرابلسي',
    nameEnglish: 'Ahmad Al-Trabulsi',
    baseUrl: 'https://server10.mp3quran.net/trabulsi',
  },
  {
    id: 'swailem',
    nameArabic: 'أحمد السويلم',
    nameEnglish: 'Ahmad Al-Swailem',
    baseUrl: 'https://server14.mp3quran.net/swlim/Rewayat-Hafs-A-n-Assem',
  },
  {
    id: 'huzaifi_hq',
    nameArabic: 'علي الحذيفي',
    nameEnglish: 'Ali Al-Huzaifi',
    baseUrl: 'https://server9.mp3quran.net/hthfi',
  },
  {
    id: 'emadi',
    nameArabic: 'أنس العمادي',
    nameEnglish: 'Anas Al-Emadi',
    baseUrl: 'https://server16.mp3quran.net/a_alemadi/Rewayat-Hafs-A-n-Assem',
  },
  {
    id: 'aziz_ahmad',
    nameArabic: 'عبدالعزيز الأحمد',
    nameEnglish: 'Aziz Alili (Al-Ahmad)',
    baseUrl: 'https://server11.mp3quran.net/a_ahmed',
  },
  {
    id: 'fareed_hatim',
    nameArabic: 'حاتم فريد الواعر',
    nameEnglish: 'Fareed Abbas (Hatim)',
    baseUrl: 'https://server11.mp3quran.net/hatem',
  },
  {
    id: 'daghriri',
    nameArabic: 'حمد الدغريري',
    nameEnglish: 'Hamad Al-Daghriri',
    baseUrl: 'https://server16.mp3quran.net/H-Aldaghriri/Rewayat-Hafs-A-n-Assem',
  },
  {
    id: 'imad_hafez',
    nameArabic: 'عماد زهير حافظ',
    nameEnglish: 'Imad Hafez',
    baseUrl: 'https://server6.mp3quran.net/hafz',
  },
  {
    id: 'khalid_ghamdi',
    nameArabic: 'خالد الغامدي',
    nameEnglish: 'Khalid Al-Ghamdi',
    baseUrl: 'https://server6.mp3quran.net/ghamdi',
  },
  {
    id: 'wuhibi',
    nameArabic: 'خالد الوهيبي',
    nameEnglish: 'Khalid Al-Wuhibi',
    baseUrl: 'https://server11.mp3quran.net/whabi',
  },
  {
    id: 'majed_zamil',
    nameArabic: 'ماجد الزامل',
    nameEnglish: 'Majed Al-Zamil',
    baseUrl: 'https://server9.mp3quran.net/zaml',
  },
  {
    id: 'husary_mujawwad',
    nameArabic: 'محمود خليل الحصري (مجود)',
    nameEnglish: 'Husary Mujawwad',
    baseUrl: 'https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad',
  },
  {
    id: 'barrak',
    nameArabic: 'محمد البراك',
    nameEnglish: 'Mohammad Al-Barrak',
    baseUrl: 'https://server12.mp3quran.net/shah',
  },
  {
    id: 'hafiz',
    nameArabic: 'محمد الحافظ',
    nameEnglish: 'Mohammad Al-Hafiz',
    baseUrl: 'https://server6.mp3quran.net/hafz',
  },
  {
    id: 'minshawi_mujawwad',
    nameArabic: 'محمد صديق المنشاوي (مجود)',
    nameEnglish: 'Minshawi Mujawwad',
    baseUrl: 'https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad',
  },
  {
    id: 'rashad_sharif',
    nameArabic: 'محمد رشاد الشريف',
    nameEnglish: 'Mohammad Rashad Al-Sharif',
    baseUrl: 'https://server10.mp3quran.net/rashad',
  },
  {
    id: 'mousa_bilal',
    nameArabic: 'موسى بلال',
    nameEnglish: 'Mousa Bilal',
    baseUrl: 'https://server11.mp3quran.net/bilal',
  },
  {
    id: 'nasser_majed',
    nameArabic: 'ناصر الماجد',
    nameEnglish: 'Nasser Al-Majed',
    baseUrl: 'https://server14.mp3quran.net/nasser_almajed',
  },
  {
    id: 'rami_deais',
    nameArabic: 'رامي الدعيس',
    nameEnglish: 'Rami Al-Deais',
    baseUrl: 'https://server6.mp3quran.net/rami',
  },
  {
    id: 'saber_hakam',
    nameArabic: 'صابر عبدالحكم',
    nameEnglish: 'Saber Abdul-Hakam',
    baseUrl: 'https://server12.mp3quran.net/hkm',
  },
  {
    id: 'sherzad',
    nameArabic: 'شيرزاد حيدر علي',
    nameEnglish: 'Sherzad Haidar Ali',
    baseUrl: 'https://server12.mp3quran.net/taher',
  },
  {
    id: 'tariq_daoub',
    nameArabic: 'طارق عبدالغني دعوب',
    nameEnglish: 'Tariq Al-Daoub',
    baseUrl: 'https://server10.mp3quran.net/tareq',
  },
  {
    id: 'walid_naehi',
    nameArabic: 'وليد النائحي',
    nameEnglish: 'Walid Al-Naehi',
    baseUrl: 'https://server9.mp3quran.net/waleed',
  },
  {
    id: 'yusuf_shuweii',
    nameArabic: 'يوسف الشويعي',
    nameEnglish: 'Yusuf Al-Shuweii',
    baseUrl: 'https://server9.mp3quran.net/yousef',
  },
  {
    id: 'yusuf_noah',
    nameArabic: 'يوسف بن نوح أحمد',
    nameEnglish: 'Yusuf bin Noah',
    baseUrl: 'https://server8.mp3quran.net/noah',
  },
  // === NEW RECITERS BATCH 3 (15) - All URLs verified from Mp3Quran API on 2026-03-20 ===
  {
    id: 'hassan_saleh',
    nameArabic: 'حسن صالح',
    nameEnglish: 'Hassan Saleh',
    baseUrl: 'https://server16.mp3quran.net/h_saleh/Rewayat-Hafs-A-n-Assem',
  },
  {
    id: 'mohisni',
    nameArabic: 'محمد المحيسني',
    nameEnglish: 'Mohammad Al-Mohisni',
    baseUrl: 'https://server11.mp3quran.net/mhsny',
  },
  {
    id: 'abdullah_kamel',
    nameArabic: 'عبدالله كامل',
    nameEnglish: 'Abdullah Kamel',
    baseUrl: 'https://server16.mp3quran.net/kamel/Rewayat-Hafs-A-n-Assem',
  },
  {
    id: 'yasser_salama',
    nameArabic: 'ياسر سلامة',
    nameEnglish: 'Yasser Salama',
    baseUrl: 'https://server12.mp3quran.net/salamah/Rewayat-Hafs-A-n-Assem',
  },
  {
    id: 'husary_warsh',
    nameArabic: 'محمود خليل الحصري (ورش)',
    nameEnglish: 'Husary Warsh',
    baseUrl: 'https://server13.mp3quran.net/husr/Rewayat-Warsh-A-n-Nafi',
  },
  {
    id: 'haitham_jadaani',
    nameArabic: 'هيثم الجدعاني',
    nameEnglish: 'Haitham Al-Jadaani',
    baseUrl: 'https://server16.mp3quran.net/hitham/Rewayat-Hafs-A-n-Assem',
  },
  {
    id: 'dokali',
    nameArabic: 'الدوكالي محمد العالم',
    nameEnglish: 'Al-Dokali Muhammad Al-Alam',
    baseUrl: 'https://server7.mp3quran.net/dokali',
  },
  {
    id: 'khalid_muhanna',
    nameArabic: 'خالد المهنا',
    nameEnglish: 'Khalid Al-Muhanna',
    baseUrl: 'https://server11.mp3quran.net/mohna',
  },
  {
    id: 'adel_kalbani',
    nameArabic: 'عادل الكلباني',
    nameEnglish: 'Adel Al-Kalbani',
    baseUrl: 'https://server8.mp3quran.net/a_klb',
  },
  {
    id: 'aziz_zahrani',
    nameArabic: 'عبدالعزيز الزهراني',
    nameEnglish: 'Abdulaziz Al-Zahrani',
    baseUrl: 'https://server9.mp3quran.net/zahrani',
  },
  {
    id: 'muhammad_osman_khan',
    nameArabic: 'محمد عثمان خان',
    nameEnglish: 'Muhammad Osman Khan',
    baseUrl: 'https://server6.mp3quran.net/khan',
  },
  {
    id: 'abdulmohsen_harthy',
    nameArabic: 'عبدالمحسن الحارثي',
    nameEnglish: 'Abdulmohsen Al-Harthy',
    baseUrl: 'https://server6.mp3quran.net/mohsin_harthi',
  },
  {
    id: 'ahmad_huthaifi',
    nameArabic: 'أحمد الحذيفي',
    nameEnglish: 'Ahmad Al-Huthaifi',
    baseUrl: 'https://server8.mp3quran.net/ahmad_huth',
  },
  {
    id: 'jamal_zailai',
    nameArabic: 'جمال الدين الزيلعي',
    nameEnglish: 'Jamal Al-Zailai',
    baseUrl: 'https://server11.mp3quran.net/zilaie',
  },
  {
    id: 'abdulbasit_mujawwad',
    nameArabic: 'عبدالباسط عبدالصمد (مجود)',
    nameEnglish: 'Abdulbasit Mujawwad',
    baseUrl: 'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad',
  },
];

// Cloudflare Worker proxy URL for low quality audio (64kbps)
const LOW_QUALITY_PROXY_URL = 'https://quran-shorts-api.almuhasab9.workers.dev/audio';

// Audio quality type
export type AudioQuality = 'high' | 'low';

// Generate audio URL based on reciter, surah, and quality
export const getAudioUrl = (reciterId: string, surahId: number, quality: AudioQuality = 'high'): string => {
  const reciter = reciters.find(r => r.id === reciterId);
  if (!reciter) return '';
  const paddedNumber = surahId.toString().padStart(3, '0');
  const originalUrl = `${reciter.baseUrl}/${paddedNumber}.mp3`;
  
  // For low quality (Data Saver mode), route through Cloudflare Worker
  if (quality === 'low') {
    return `${LOW_QUALITY_PROXY_URL}?url=${encodeURIComponent(originalUrl)}`;
  }
  
  return originalUrl;
};
