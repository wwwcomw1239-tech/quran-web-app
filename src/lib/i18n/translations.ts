export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Header
    appTitle: 'القرآن الكريم',
    appSubtitle: 'استمع إلى تلاوات عطرة',
    surahs: 'سورة',
    verses: 'آية',
    makki: 'مكية',
    madani: 'مدنية',
    scrollToBottom: 'الانتقال إلى الأسفل',

    // Tabs
    audioLibrary: 'المكتبة الصوتية',
    booksLibrary: 'المكتبة المقروءة',

    // Search & Filter
    searchPlaceholder: 'ابحث باسم السورة أو رقمها...',
    all: 'الكل',
    favorites: 'المفضلة',
    displaying: 'عرض',
    surah: 'سورة',

    // Surah Card
    verse: 'آية',

    // Audio Player
    repeat: 'تكرار',
    random: 'عشوائي',
    close: 'إغلاق',

    // Download Dialog
    download: 'تحميل',
    downloadSurah: 'تحميل السورة',
    fileSize: 'حجم الملف',
    originalQuality: 'الجودة الأصلية',
    downloading: 'جاري التحميل...',
    cancel: 'إلغاء',

    // Reciter Selector
    selectReciter: 'اختر القارئ',
    reciters: 'القراء',

    // Books Library
    searchBooks: 'ابحث في الكتب...',
    categories: 'الأقسام',
    allCategories: 'الكل',
    openBook: 'فتح الكتاب',
    downloadBook: 'تحميل الكتاب',
    booksCount: 'كتاب',

    // Footer
    contactDeveloper: 'تواصل مع المطور',
    backToTop: 'العودة للأعلى',
    rights: 'جميع الحقوق محفوظة',

    // Errors
    noResults: 'لا توجد نتائج',
    tryDifferent: 'جرب تغيير معايير البحث أو الفلترة',
    audioError: 'حدث خطأ أثناء تشغيل الصوت',
    loadError: 'تعذر تحميل الملف الصوتي',

    // Announcement
    newReciters: 'تم إضافة 15 قارئ جديد! أصبح العدد 100 قارئ',

    // Language
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
  },
  en: {
    // Header
    appTitle: 'The Holy Quran',
    appSubtitle: 'Listen to beautiful recitations',
    surahs: 'Surahs',
    verses: 'Verses',
    makki: 'Makki',
    madani: 'Madani',
    scrollToBottom: 'Scroll to bottom',

    // Tabs
    audioLibrary: 'Audio Library',
    booksLibrary: 'Books Library',

    // Search & Filter
    searchPlaceholder: 'Search by surah name or number...',
    all: 'All',
    favorites: 'Favorites',
    displaying: 'Displaying',
    surah: 'surah',

    // Surah Card
    verse: 'verse',

    // Audio Player
    repeat: 'Repeat',
    random: 'Random',
    close: 'Close',

    // Download Dialog
    download: 'Download',
    downloadSurah: 'Download Surah',
    fileSize: 'File size',
    originalQuality: 'Original Quality',
    downloading: 'Downloading...',
    cancel: 'Cancel',

    // Reciter Selector
    selectReciter: 'Select Reciter',
    reciters: 'Reciters',

    // Books Library
    searchBooks: 'Search books...',
    categories: 'Categories',
    allCategories: 'All',
    openBook: 'Open Book',
    downloadBook: 'Download Book',
    booksCount: 'books',

    // Footer
    contactDeveloper: 'Contact Developer',
    backToTop: 'Back to Top',
    rights: 'All rights reserved',

    // Errors
    noResults: 'No results found',
    tryDifferent: 'Try changing search or filter criteria',
    audioError: 'An error occurred while playing audio',
    loadError: 'Could not load audio file',

    // Announcement
    newReciters: '15 new reciters added! Now 100 reciters total',

    // Language
    language: 'Language',
    arabic: 'العربية',
    english: 'English',
  },
};

export type TranslationKey = keyof typeof translations.ar;
