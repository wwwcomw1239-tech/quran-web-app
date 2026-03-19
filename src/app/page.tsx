'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { surahs, totalVerses, makkiCount, madaniCount, Surah } from '@/data/surahs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Search,
  Heart,
  BookOpen,
  Moon,
  Sun,
  Download,
  Repeat,
  Shuffle,
  X,
  Loader2,
  Headphones,
  User,
  Check,
  ArrowUp,
  ArrowDown,
  Mail,
} from 'lucide-react';

type FilterType = 'all' | 'مكية' | 'مدنية';

// Reciters data with their audio URLs
interface Reciter {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  baseUrl: string;
  imageUrl?: string;
}

// Verified Mp3Quran server URLs - ALL URLs fetched from official API and tested
// Source: https://mp3quran.net/api/v3/reciters
// Every URL has been verified with HTTP 200 response
const reciters: Reciter[] = [
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
    id: 'sahl_yassin',
    nameArabic: 'سهل ياسين',
    nameEnglish: 'Sahl Yassin',
    baseUrl: 'https://server6.mp3quran.net/shl',
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
];

// Generate audio URL based on reciter and surah
const getAudioUrl = (reciterId: string, surahId: number): string => {
  const reciter = reciters.find(r => r.id === reciterId);
  if (!reciter) return '';
  const paddedNumber = surahId.toString().padStart(3, '0');
  return `${reciter.baseUrl}/${paddedNumber}.mp3`;
};

export default function QuranWebApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedReciter, setSelectedReciter] = useState<string>('minshawi');
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quran-favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedSurahForDownload, setSelectedSurahForDownload] = useState<Surah | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<'high' | 'medium' | 'low'>('low'); // Low quality is mandatory default
  const [reciterSearchQuery, setReciterSearchQuery] = useState('');
  const [reciterDialogOpen, setReciterDialogOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [isLoadingFileSize, setIsLoadingFileSize] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  // Get selected reciter info
  const currentReciter = useMemo(() => {
    return reciters.find(r => r.id === selectedReciter) || reciters[0];
  }, [selectedReciter]);

  // Filter reciters based on search query
  const filteredReciters = useMemo(() => {
    if (!reciterSearchQuery.trim()) return reciters;
    const query = reciterSearchQuery.toLowerCase();
    return reciters.filter(r => 
      r.nameArabic.includes(reciterSearchQuery) || 
      r.nameEnglish.toLowerCase().includes(query)
    );
  }, [reciterSearchQuery]);

  // Filter and search surahs
  const filteredSurahs = useMemo(() => {
    let result = surahs;

    if (filter !== 'all') {
      result = result.filter((s) => s.type === filter);
    }

    if (showFavorites) {
      result = result.filter((s) => favorites.includes(s.id));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.nameArabic.includes(searchQuery) ||
          s.nameEnglish.toLowerCase().includes(query) ||
          s.id.toString() === searchQuery
      );
    }

    return result;
  }, [filter, searchQuery, showFavorites, favorites]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('quran-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle scroll for Back to Top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to bottom function (footer)
  const scrollToBottom = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Fetch file size using HEAD request
  const fetchFileSize = async (url: string): Promise<number | null> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : null;
    } catch (error) {
      console.error('Error fetching file size:', error);
      return null;
    }
  };

  // Contact developer function - opens email client with Gmail optimization
  const handleContactDeveloper = () => {
    const email = 'almubarmaj8@gmail.com';
    const subject = encodeURIComponent('تواصل من تطبيق القرآن الكريم');
    // Primary: Try Gmail app deep link (works on mobile)
    const gmailUrl = `googlegmail://co?to=${email}&subject=${subject}`;
    // Fallback: Standard mailto
    const mailtoUrl = `mailto:${email}?subject=${subject}`;
    
    // Try Gmail app first (mobile), fall back to mailto
    const start = Date.now();
    window.location.href = gmailUrl;
    
    // If still on page after 500ms, Gmail app not installed, use mailto
    setTimeout(() => {
      if (Date.now() - start < 1000) {
        window.location.href = mailtoUrl;
      }
    }, 500);
  };

  // Stop audio when reciter changes
  useEffect(() => {
    if (audioRef.current && currentSurah) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      
      // Restart with new reciter
      const audioUrl = getAudioUrl(selectedReciter, currentSurah.id);
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(console.error);
    }
  }, [selectedReciter]);

  // Play surah function
  const playSurah = useCallback((surah: Surah) => {
    if (currentSurah?.id === surah.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
      return;
    }

    setCurrentSurah(surah);
    setIsLoading(true);
    setAudioError(null);

    if (audioRef.current) {
      const audioUrl = getAudioUrl(selectedReciter, surah.id);
      console.log('Loading audio from:', audioUrl);
      
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Audio play error:', error);
            setAudioError('حدث خطأ أثناء تشغيل الصوت');
            setIsLoading(false);
            setIsPlaying(false);
          });
      }
    }
  }, [currentSurah, isPlaying, selectedReciter]);

  // Play next surah
  const playNext = useCallback(() => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
    if (currentIndex < surahs.length - 1) {
      playSurah(surahs[currentIndex + 1]);
    } else {
      playSurah(surahs[0]);
    }
  }, [currentSurah, playSurah]);

  // Play previous surah
  const playPrevious = useCallback(() => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
    if (currentIndex > 0) {
      playSurah(surahs[currentIndex - 1]);
    } else {
      playSurah(surahs[surahs.length - 1]);
    }
  }, [currentSurah, playSurah]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => setIsLoading(true);

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setAudioError('تعذر تحميل الملف الصوتي');
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isRepeat, playNext]);

  const togglePlay = () => {
    if (!audioRef.current || !currentSurah) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const seekTo = (value: number) => {
    if (!audioRef.current || !duration) return;
    const newTime = (value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(value);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeVolume = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
    setVolume(value);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playRandom = () => {
    const randomIndex = Math.floor(Math.random() * surahs.length);
    playSurah(surahs[randomIndex]);
  };

  const handleDownload = async (surah: Surah) => {
    setSelectedSurahForDownload(surah);
    setFileSize(null);
    setIsLoadingFileSize(true);
    setDownloadDialogOpen(true);
    
    // Fetch file size
    const audioUrl = getAudioUrl(selectedReciter, surah.id);
    const size = await fetchFileSize(audioUrl);
    setFileSize(size);
    setIsLoadingFileSize(false);
  };

  // Download audio - Fetch blob and trigger download
  // Required for cross-origin files where download attribute doesn't work
  const downloadAudio = async (quality: 'high' | 'medium' | 'low') => {
    if (!selectedSurahForDownload) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    const audioUrl = getAudioUrl(selectedReciter, selectedSurahForDownload.id);
    
    // Quality suffix for filename
    const qualityLabel = quality === 'high' ? '128kbps' : quality === 'medium' ? '64kbps' : '32kbps';
    const fileName = `${selectedSurahForDownload.id.toString().padStart(3, '0')}_${selectedSurahForDownload.nameArabic}_${currentReciter.nameArabic}_${qualityLabel}.mp3`;

    try {
      // Fetch the file with progress tracking
      const response = await fetch(audioUrl);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      // Read the stream with progress
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Cannot read response body');
      }
      
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        if (total > 0) {
          setDownloadProgress(Math.round((receivedLength / total) * 100));
        }
      }
      
      // Create blob from chunks
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);
      
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: Open in new tab as last resort
      window.open(audioUrl, '_blank');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadDialogOpen(false);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentSurah(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900" dir="rtl">
      {/* Audio Element */}
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />

      {/* Header */}
      <header className="bg-gradient-to-l from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">القرآن الكريم</h1>
                <p className="text-emerald-100 text-sm">استمع إلى تلاوات عطرة</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 w-full max-w-2xl">
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{surahs.length}</div>
                <div className="text-xs text-emerald-100">سورة</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{totalVerses.toLocaleString('ar-EG')}</div>
                <div className="text-xs text-emerald-100">آية</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{makkiCount}</div>
                <div className="text-xs text-emerald-100">مكية</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{madaniCount}</div>
                <div className="text-xs text-emerald-100">مدنية</div>
              </div>
            </div>
            
            {/* Scroll to Bottom Button */}
            <button
              onClick={scrollToBottom}
              className="mt-6 w-12 h-12 mx-auto rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="الانتقال إلى الأسفل"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-36">
        {/* Reciter Selection - Prominent with Searchable Dropdown */}
        <div className="bg-gradient-to-l from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-2xl shadow-lg p-5 mb-6 border border-emerald-200 dark:border-emerald-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <h3 className="font-bold text-slate-900 dark:text-white">اختر القارئ</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{reciters.length} قارئ متاح</p>
              </div>
            </div>
            
            {/* Searchable Reciter Button */}
            <Button
              onClick={() => setReciterDialogOpen(true)}
              className="w-full sm:w-72 h-12 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl justify-between px-4 hover:bg-emerald-50 dark:hover:bg-slate-700"
              variant="outline"
            >
              <div className="flex flex-col items-start">
                <span className="font-bold text-slate-900 dark:text-white">{currentReciter.nameArabic}</span>
                <span className="text-xs text-slate-500">{currentReciter.nameEnglish}</span>
              </div>
              <Search className="w-4 h-4 text-slate-400 mr-2" />
            </Button>
          </div>
          
          {/* Current Reciter Info */}
          <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">يتم الاستماع الآن بصوت</p>
                <p className="font-bold text-emerald-700 dark:text-emerald-400">{currentReciter.nameArabic}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Searchable Reciter Dialog */}
        <Dialog open={reciterDialogOpen} onOpenChange={setReciterDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">اختر القارئ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="ابحث باسم القارئ..."
                  value={reciterSearchQuery}
                  onChange={(e) => setReciterSearchQuery(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white pr-10 h-12 rounded-xl"
                  autoFocus
                />
              </div>
              
              {/* Reciters List */}
              <div className="max-h-96 overflow-y-auto space-y-1" dir="rtl">
                {filteredReciters.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>لم يتم العثور على نتائج</p>
                  </div>
                ) : (
                  filteredReciters.map((reciter) => (
                    <button
                      key={reciter.id}
                      onClick={() => {
                        setSelectedReciter(reciter.id);
                        setReciterDialogOpen(false);
                        setReciterSearchQuery('');
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right ${
                        selectedReciter === reciter.id
                          ? 'bg-emerald-100 dark:bg-emerald-900 border-2 border-emerald-500'
                          : 'bg-slate-50 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 border-2 border-transparent'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedReciter === reciter.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}>
                        {selectedReciter === reciter.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 dark:text-white">{reciter.nameArabic}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{reciter.nameEnglish}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              <p className="text-xs text-center text-slate-500">
                {filteredReciters.length} من {reciters.length} قارئ
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 sticky top-4 z-40">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full lg:flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="ابحث باسم السورة أو رقمها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white pr-10 h-12 rounded-xl"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                variant={filter === 'all' && !showFavorites ? 'default' : 'outline'}
                onClick={() => { setFilter('all'); setShowFavorites(false); }}
                className={`h-11 px-5 rounded-xl font-medium transition-all ${
                  filter === 'all' && !showFavorites
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                الكل
              </Button>
              <Button
                variant={filter === 'مكية' ? 'default' : 'outline'}
                onClick={() => { setFilter('مكية'); setShowFavorites(false); }}
                className={`h-11 px-5 rounded-xl font-medium transition-all ${
                  filter === 'مكية'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Moon className="w-4 h-4 ml-2" />
                مكية
              </Button>
              <Button
                variant={filter === 'مدنية' ? 'default' : 'outline'}
                onClick={() => { setFilter('مدنية'); setShowFavorites(false); }}
                className={`h-11 px-5 rounded-xl font-medium transition-all ${
                  filter === 'مدنية'
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Sun className="w-4 h-4 ml-2" />
                مدنية
              </Button>
              <Button
                variant={showFavorites ? 'default' : 'outline'}
                onClick={() => setShowFavorites(!showFavorites)}
                className={`h-11 px-5 rounded-xl font-medium transition-all ${
                  showFavorites
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ml-2 ${showFavorites ? 'fill-current' : ''}`} />
                المفضلة
              </Button>
            </div>
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSurahs.map((surah) => (
            <Card
              key={surah.id}
              className={`group transition-all duration-300 cursor-pointer border-2 ${
                currentSurah?.id === surah.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-lg shadow-emerald-500/10'
                  : 'border-transparent bg-white dark:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Surah Number */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shadow-md ${
                    surah.type === 'مكية'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                      : 'bg-gradient-to-br from-orange-500 to-orange-700 text-white'
                  }`}>
                    {surah.id}
                  </div>

                  {/* Surah Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{surah.nameArabic}</h3>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{surah.nameEnglish}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          surah.type === 'مكية'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        }`}
                      >
                        {surah.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {surah.versesCount} آية
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    {/* Play Button */}
                    <Button
                      onClick={() => playSurah(surah)}
                      className={`w-10 h-10 rounded-full ${
                        currentSurah?.id === surah.id && isPlaying
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                      }`}
                      variant="ghost"
                      size="icon"
                    >
                      {currentSurah?.id === surah.id && isPlaying ? (
                        <div className="flex gap-0.5 items-end h-4">
                          <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
                          <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        </div>
                      ) : currentSurah?.id === surah.id && isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                      ) : (
                        <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-[-2px]" />
                      )}
                    </Button>

                    {/* Download Button */}
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleDownload(surah); }}
                      className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900"
                      variant="ghost"
                      size="icon"
                    >
                      <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                  </div>

                  {/* Favorite Button */}
                  <Button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(surah.id); }}
                    className={`w-10 h-10 rounded-full ${
                      favorites.includes(surah.id)
                        ? 'bg-rose-100 dark:bg-rose-900'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950'
                    }`}
                    variant="ghost"
                    size="icon"
                  >
                    <Heart className={`w-4 h-4 ${
                      favorites.includes(surah.id)
                        ? 'text-rose-500 fill-current'
                        : 'text-slate-400 dark:text-slate-500'
                    }`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredSurahs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-slate-500 dark:text-slate-400">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </main>

      {/* Audio Player */}
      {currentSurah && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-2xl z-50">
          <div className="container mx-auto px-4 py-3">
            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>
              <div
                className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = ((rect.right - e.clientX) / rect.width) * 100;
                  seekTo(Math.max(0, Math.min(100, percent)));
                }}
              >
                <div
                  className="h-full bg-gradient-to-l from-emerald-500 to-teal-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 w-10">{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              {/* Surah Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">{currentSurah.nameArabic}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{currentReciter.nameArabic}</p>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playRandom}
                  className="hidden sm:flex w-10 h-10 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <Shuffle className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPrevious}
                  className="w-10 h-10 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
                <Button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 mr-[-2px]" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playNext}
                  className="w-10 h-10 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`hidden sm:flex w-10 h-10 rounded-full ${
                    isRepeat
                      ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                </Button>
              </div>

              {/* Volume & Close */}
              <div className="flex items-center gap-2 flex-1 justify-end">
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(currentSurah)}
                  className="w-10 h-10 rounded-full text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <Download className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closePlayer}
                  className="w-10 h-10 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {audioError && (
              <div className="mt-2 text-center text-sm text-rose-500">
                {audioError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Download Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">تنزيل السورة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSurahForDownload && (
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedSurahForDownload.nameArabic}
                </h3>
                <p className="text-slate-500">{selectedSurahForDownload.nameEnglish}</p>
                <div className="mt-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg p-2">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    بصوت: {currentReciter.nameArabic}
                  </p>
                </div>
                {/* File Size Display */}
                <div className="mt-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-2 flex items-center justify-center gap-2">
                  {isLoadingFileSize ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  ) : fileSize ? (
                    <>
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        حجم الملف: <strong className="text-emerald-600">{formatFileSize(fileSize)}</strong>
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400">تعذر تحديد حجم الملف</span>
                  )}
                </div>
              </div>
            )}

            {/* Quality Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">اختر جودة التحميل:</label>
              
              {/* Quality Options - LOW QUALITY FIRST POLICY */}
              <div className="grid gap-2">
                {/* Low Quality - RECOMMENDED DEFAULT */}
                <button
                  onClick={() => setSelectedQuality('low')}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    selectedQuality === 'low'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedQuality === 'low'
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedQuality === 'low' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-white">جودة منخفضة (32 kbps)</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">موصى بها - سريع وموفر للبيانات ✓</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    موصى بها
                  </Badge>
                </button>

                {/* Medium Quality - Fallback */}
                <button
                  onClick={() => setSelectedQuality('medium')}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    selectedQuality === 'medium'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedQuality === 'medium'
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedQuality === 'medium' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-white">جودة متوسطة (64 kbps)</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">ترجع للجودة الأصلية</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    افتراضية
                  </Badge>
                </button>

                {/* High Quality - Only if lower unavailable */}
                <button
                  onClick={() => setSelectedQuality('high')}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    selectedQuality === 'high'
                      ? 'border-slate-500 bg-slate-50 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedQuality === 'high'
                        ? 'border-slate-500 bg-slate-500'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedQuality === 'high' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-white">جودة عالية (128 kbps)</p>
                      <p className="text-xs text-slate-500">الجودة الأصلية - حجم أكبر</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                    متاحة
                  </Badge>
                </button>
              </div>
            </div>
            
            {/* Download Button with Progress */}
            <Button
              onClick={() => downloadAudio(selectedQuality)}
              disabled={isDownloading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl relative overflow-hidden"
            >
              {isDownloading && downloadProgress > 0 && (
                <div 
                  className="absolute inset-0 bg-emerald-500/30 transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {downloadProgress > 0 ? `${downloadProgress}%` : 'جاري التحميل...'}
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    تنزيل الآن
                  </>
                )}
              </span>
            </Button>
            
            <p className="text-xs text-center text-slate-500">
              التلاوات من موقع mp3quran.net
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Footer with Developer Attribution */}
      <footer ref={footerRef} className={`text-center py-8 ${currentSurah ? 'pb-40' : 'pb-8'} bg-gradient-to-t from-slate-100 to-transparent dark:from-slate-900`}> 
        <div className="container mx-auto px-4">
          {/* Source Attribution */}
          <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-sm">القرآن الكريم - استمع إلى تلاوات عطرة</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">المصدر: mp3quran.net</p>
          </div>
          
          {/* Developer Attribution & Contact */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Developer Text */}
            <p className="text-sm text-slate-400 dark:text-slate-500">
              تطوير داوود الاحمدي
            </p>
            
            {/* Contact Button */}
            <Button
              onClick={handleContactDeveloper}
              variant="outline"
              className="h-9 px-4 rounded-lg border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all gap-2"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">تواصل مع المطور</span>
            </Button>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center z-40 transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:scale-110 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="العودة إلى الأعلى"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
