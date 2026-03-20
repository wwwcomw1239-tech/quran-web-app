export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // App Branding
    appName: 'نور القرآن',
    appNameFull: 'نور القرآن - Noor Al-Quran',
    appTitle: 'نور القرآن',
    appSubtitle: 'استمع إلى تلاوات عطرة من كتاب الله',
    
    // Header
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
    
    // Offline Cache
    saveOffline: 'حفظ للاستماع بدون إنترنت',
    savedOffline: 'محفوظ للاستماع بدون إنترنت',
    removeOffline: 'إزالة من الذاكرة',
    caching: 'جاري الحفظ...',
    offlineReady: 'متاح بدون إنترنت',
    storageFull: 'مساحة التخزين ممتلئة',
    cacheError: 'حدث خطأ أثناء الحفظ',
    cachedSurahs: 'سورة محفوظة',

    // Download Dialog
    download: 'تحميل',
    downloadSurah: 'تحميل السورة',
    fileSize: 'حجم الملف',
    originalQuality: 'الجودة الأصلية',
    downloading: 'جاري التحميل...',
    downloadingProgress: 'جارِ التحميل',
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
    contactDeveloperFull: 'للتواصل مع المطور عبر الإيميل',
    backToTop: 'العودة للأعلى',
    rights: 'جميع الحقوق محفوظة',
    developedBy: 'تطوير داوود الاحمدي',

    // Errors
    noResults: 'لا توجد نتائج',
    tryDifferent: 'جرب تغيير معايير البحث أو الفلترة',
    audioError: 'حدث خطأ أثناء تشغيل الصوت',
    loadError: 'تعذر تحميل الملف الصوتي',

    // Announcement
    newReciters: 'تم إضافة 15 قارئ جديد! أصبح العدد 100 قارئ',
    developerNote: 'مرحباً بكم في نور القرآن - تم تحديث التطبيق بخلفية جديدة وأداء محسّن',

    // Language
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
  },
  en: {
    // App Branding
    appName: 'Noor Al-Quran',
    appNameFull: 'Noor Al-Quran - نور القرآن',
    appTitle: 'Noor Al-Quran',
    appSubtitle: 'Listen to beautiful recitations from the Book of Allah',
    
    // Header
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
    
    // Offline Cache
    saveOffline: 'Save for offline listening',
    savedOffline: 'Saved for offline listening',
    removeOffline: 'Remove from offline',
    caching: 'Saving...',
    offlineReady: 'Available offline',
    storageFull: 'Storage is full',
    cacheError: 'Error saving audio',
    cachedSurahs: 'surahs cached',

    // Download Dialog
    download: 'Download',
    downloadSurah: 'Download Surah',
    fileSize: 'File size',
    originalQuality: 'Original Quality',
    downloading: 'Downloading...',
    downloadingProgress: 'Downloading',
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
    contactDeveloperFull: 'Contact the developer via email',
    backToTop: 'Back to Top',
    rights: 'All rights reserved',
    developedBy: 'Developed by Dawood Al-Ahmadi',

    // Errors
    noResults: 'No results found',
    tryDifferent: 'Try changing search or filter criteria',
    audioError: 'An error occurred while playing audio',
    loadError: 'Could not load audio file',

    // Announcement
    newReciters: '15 new reciters added! Now 100 reciters total',
    developerNote: 'Welcome to Noor Al-Quran - Updated with new design and improved performance',

    // Language
    language: 'Language',
    arabic: 'العربية',
    english: 'English',
  },
};

export type TranslationKey = keyof typeof translations.ar;
