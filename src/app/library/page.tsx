'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';

// Custom debounce hook
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  return debouncedCallback;
}

import { 
  BookOpen, 
  Search, 
  Loader2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  X,
  AlertTriangle,
  Hash,
  Copy,
  Check,
  ScrollText,
  Library,
  GraduationCap,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n';
import {
  getTafsirsList,
  getSurahTafsir,
  getHadithBooks,
  getHadithsFromBook,
  searchHadiths,
  getHadithBookInfo,
  Tafsir,
  VerseWithTafsir,
  HadithBook,
  Hadith,
  ERROR_MESSAGES,
} from '@/lib/islamic-api';

import { surahs } from '@/data/surahs';
import { BooksLibrary } from '@/components/quran/BooksLibrary';

type LibraryTab = 'tafsir' | 'hadith' | 'books';
type ViewState = 'list' | 'detail';

export default function LibraryPage() {
  const { isRTL, direction } = useLanguage();

  // Tab state
  const [activeTab, setActiveTab] = useState<LibraryTab>('tafsir');

  // Tafsir state
  const [tafsirs, setTafsirs] = useState<Tafsir[]>([]);
  const [selectedTafsir, setSelectedTafsir] = useState<Tafsir | null>(null);
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const [tafsirVerses, setTafsirVerses] = useState<VerseWithTafsir[]>([]);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirError, setTafsirError] = useState<string | null>(null);
  const [tafsirViewState, setTafsirViewState] = useState<ViewState>('list');
  const [tafsirProgress, setTafsirProgress] = useState<string>('');

  // Local search
  const [localTafsirSearch, setLocalTafsirSearch] = useState('');
  const [surahSearchQuery, setSurahSearchQuery] = useState('');

  // Hadith state
  const [hadithBooks, setHadithBooks] = useState<HadithBook[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [hadithPage, setHadithPage] = useState(1);
  const [hadithTotal, setHadithTotal] = useState(0);
  const [hadithLoading, setHadithLoading] = useState(false);
  const [hadithError, setHadithError] = useState<string | null>(null);
  const [hadithViewState, setHadithViewState] = useState<ViewState>('list');
  const [localHadithSearch, setLocalHadithSearch] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // UI state
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [copiedHadith, setCopiedHadith] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);

  // Refs for cancel
  const tafsirAbortRef = useRef<AbortController | null>(null);

  // Scroll to ayah
  const scrollToAyah = useCallback((ayahNumber: number) => {
    const element = document.getElementById(`verse-${ayahNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-emerald-400');
      setTimeout(() => element.classList.remove('ring-2', 'ring-emerald-400'), 2000);
    }
  }, []);

  const handleAyahSelect = useCallback((ayahNumber: number) => {
    setSelectedAyah(ayahNumber);
    scrollToAyah(ayahNumber);
  }, [scrollToAyah]);

  // Copy functions
  const handleCopyVerse = useCallback((verse: VerseWithTafsir) => {
    const text = `${verse.text_uthmani}\n\n${verse.tafsir_text ? `التفسير: ${verse.tafsir_text}` : ''}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedVerse(verse.verse_number);
      toast.success('تم نسخ الآية والتفسير');
      setTimeout(() => setCopiedVerse(null), 2000);
    });
  }, []);

  const handleCopyHadith = useCallback((hadith: Hadith) => {
    const text = `${hadith.text}\n\n[${hadith.book?.name} - حديث رقم ${hadith.hadithnumber}]`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedHadith(hadith.id);
      toast.success('تم نسخ الحديث');
      setTimeout(() => setCopiedHadith(null), 2000);
    });
  }, []);

  // Filtered data
  const filteredVerses = useMemo(() => {
    if (!localTafsirSearch.trim()) return tafsirVerses;
    const query = localTafsirSearch.toLowerCase();
    return tafsirVerses.filter(verse => 
      verse.text_uthmani?.includes(localTafsirSearch) ||
      (verse.tafsir_text && verse.tafsir_text.toLowerCase().includes(query))
    );
  }, [tafsirVerses, localTafsirSearch]);

  const filteredHadiths = useMemo(() => {
    if (!localHadithSearch.trim()) return hadiths;
    const query = localHadithSearch.toLowerCase();
    return hadiths.filter(hadith => hadith.text?.toLowerCase().includes(query));
  }, [hadiths, localHadithSearch]);

  const filteredSurahs = useMemo(() => {
    if (!surahSearchQuery.trim()) return surahs;
    const query = surahSearchQuery.toLowerCase();
    return surahs.filter(s => 
      s.nameArabic.includes(surahSearchQuery) ||
      s.nameEnglish.toLowerCase().includes(query) ||
      s.id.toString() === surahSearchQuery
    );
  }, [surahSearchQuery]);

  // Tafsir statistics
  const tafsirStats = useMemo(() => {
    if (!tafsirVerses.length) return null;
    const withTafsir = tafsirVerses.filter(v => v.tafsir_available && v.tafsir_text && !v.tafsir_text.startsWith('[')).length;
    const merged = tafsirVerses.filter(v => v.tafsir_text?.startsWith('[')).length;
    const missing = tafsirVerses.filter(v => !v.tafsir_available).length;
    return { total: tafsirVerses.length, withTafsir, merged, missing };
  }, [tafsirVerses]);

  // Load tafsirs list on mount
  useEffect(() => {
    const loadTafsirs = async () => {
      const result = await getTafsirsList();
      if (result.data) {
        setTafsirs(result.data);
        if (result.data.length > 0) {
          setSelectedTafsir(result.data[0]);
        }
      } else {
        setTafsirError(result.error);
        if (result.isRateLimited) setIsRateLimited(true);
      }
    };
    if (activeTab === 'tafsir') loadTafsirs();
  }, [activeTab]);

  // Load hadith books on mount
  useEffect(() => {
    const loadBooks = async () => {
      const result = await getHadithBooks();
      if (result.data) {
        setHadithBooks(result.data);
      } else {
        setHadithError(result.error);
        if (result.isRateLimited) setIsRateLimited(true);
      }
    };
    if (activeTab === 'hadith') loadBooks();
  }, [activeTab]);

  // Load tafsir when surah or tafsir changes
  useEffect(() => {
    const loadTafsir = async () => {
      if (selectedSurahId === null || !selectedTafsir) return;

      // Cancel previous request
      if (tafsirAbortRef.current) {
        tafsirAbortRef.current.abort();
      }
      tafsirAbortRef.current = new AbortController();

      setTafsirLoading(true);
      setTafsirError(null);
      setTafsirVerses([]);
      setLocalTafsirSearch('');
      setTafsirProgress('جاري تحميل الآيات والتفسير...');

      try {
        const result = await getSurahTafsir(selectedSurahId, selectedTafsir.id);

        if (result.data) {
          setTafsirVerses(result.data);
          setTafsirViewState('detail');
          setTafsirProgress('');
          
          const realTafsirCount = result.data.filter(v => v.tafsir_available && v.tafsir_text && !v.tafsir_text.startsWith('[')).length;
          const totalVerses = result.data.length;
          
          if (realTafsirCount === 0) {
            toast.warning('التفسير غير متوفر لهذه السورة مع هذا المفسر، جرب تفسيراً آخر');
          } else if (realTafsirCount < totalVerses) {
            toast.success(`تم تحميل التفسير بنجاح (${realTafsirCount} من ${totalVerses} آية)`);
          } else {
            toast.success(`تم تحميل التفسير بنجاح - ${totalVerses} آية`);
          }
        } else {
          setTafsirError(result.error);
          if (result.isRateLimited) {
            setIsRateLimited(true);
            toast.error(ERROR_MESSAGES.rateLimited);
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setTafsirError(ERROR_MESSAGES.networkError);
        }
      }

      setTafsirLoading(false);
      setTafsirProgress('');
    };

    loadTafsir();
  }, [selectedSurahId, selectedTafsir]);

  // Handle surah selection
  const handleSurahSelect = (surahId: number) => {
    setSelectedSurahId(surahId);
  };

  // Handle tafsir change
  const handleTafsirChange = (tafsirId: number) => {
    const tafsir = tafsirs.find(t => t.id === tafsirId);
    if (tafsir && tafsir.id !== selectedTafsir?.id) {
      setSelectedTafsir(tafsir);
    }
  };

  // Load hadiths
  useEffect(() => {
    const loadHadiths = async () => {
      if (selectedBookId === null) return;
      setHadithLoading(true);
      setHadithError(null);
      setLocalHadithSearch('');

      const result = await getHadithsFromBook(selectedBookId, hadithPage, 20);
      if (result.data) {
        setHadiths(result.data.hadiths);
        setHadithTotal(result.data.total);
        setHadithViewState('detail');
      } else {
        setHadithError(result.error);
        if (result.isRateLimited) {
          setIsRateLimited(true);
          toast.error(ERROR_MESSAGES.rateLimited);
        }
      }
      setHadithLoading(false);
    };
    loadHadiths();
  }, [selectedBookId, hadithPage]);

  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId);
    setHadithPage(1);
  };

  // Debounced search
  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const result = await searchHadiths(query);
    if (result.data) setSearchResults(result.data);
    else if (result.error) toast.error(result.error);
    setSearchLoading(false);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Retry tafsir load
  const retryTafsirLoad = useCallback(() => {
    if (selectedSurahId && selectedTafsir) {
      setTafsirError(null);
      setTafsirVerses([]);
      // Trigger reload by toggling surah id
      const id = selectedSurahId;
      setSelectedSurahId(null);
      setTimeout(() => setSelectedSurahId(id), 100);
    }
  }, [selectedSurahId, selectedTafsir]);

  // ============================================
  // UI RENDER HELPERS
  // ============================================

  const renderRateLimitError = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        المكتبة تواجه ضغطاً كبيراً
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-md">
        {ERROR_MESSAGES.rateLimited}
      </p>
      <Button onClick={() => { setIsRateLimited(false); window.location.reload(); }} className="gap-2">
        <RefreshCw className="w-4 h-4" />
        إعادة المحاولة
      </Button>
    </div>
  );

  const renderLoading = (message?: string) => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-200 dark:border-emerald-800"></div>
        <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
        {message || 'جاري التحميل...'}
      </p>
      {tafsirProgress && (
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          {tafsirProgress}
        </p>
      )}
    </div>
  );

  const renderError = (error: string, onRetry?: () => void) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-4">{error}</p>
      <Button variant="outline" onClick={onRetry || (() => window.location.reload())}>
        <RefreshCw className="w-4 h-4 ml-2" />
        إعادة المحاولة
      </Button>
    </div>
  );

  // Helper data
  const selectedSurah = selectedSurahId ? surahs.find(s => s.id === selectedSurahId) : null;
  const selectedBook = selectedBookId ? hadithBooks.find(b => b.id === selectedBookId) : null;
  const selectedBookInfo = selectedBookId ? getHadithBookInfo(selectedBookId) : null;

  // ============================================
  // TAFSIR LIST VIEW
  // ============================================

  const renderTafsirList = () => (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-bl from-emerald-500 via-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <BookMarked className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">تفسير القرآن الكريم</h2>
            <p className="text-emerald-100 text-sm">اختر سورة ثم اختر التفسير المناسب</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {tafsirs.map(t => (
            <button
              key={t.id}
              onClick={() => handleTafsirChange(t.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedTafsir?.id === t.id
                  ? 'bg-white text-emerald-700 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="ابحث بالاسم أو الرقم..."
          className="pr-10 h-12 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          value={surahSearchQuery}
          onChange={(e) => setSurahSearchQuery(e.target.value)}
        />
        {surahSearchQuery && (
          <button onClick={() => setSurahSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {surahSearchQuery && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{filteredSurahs.length} سورة مطابقة</p>
      )}

      {/* Surah Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredSurahs.map((surah) => (
          <Card
            key={surah.id}
            className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group ${
              selectedSurahId === surah.id ? 'ring-2 ring-emerald-500 shadow-emerald-100 dark:shadow-emerald-900/20' : ''
            }`}
            onClick={() => handleSurahSelect(surah.id)}
          >
            <CardContent className="p-3 text-center">
              <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold mb-2 shadow-md group-hover:scale-110 transition-transform">
                {surah.id}
              </div>
              <p className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{surah.nameArabic}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{surah.nameEnglish}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Badge variant="outline" className="text-[9px] px-1.5 py-0">{surah.versesCount} آية</Badge>
                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                  surah.type === 'مكية' ? 'text-amber-600 border-amber-300' : 'text-blue-600 border-blue-300'
                }`}>{surah.type}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {surahSearchQuery && filteredSurahs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">لم يتم العثور على سور مطابقة</p>
        </div>
      )}
    </div>
  );

  // ============================================
  // TAFSIR DETAIL VIEW
  // ============================================

  const renderTafsirDetail = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-bl from-emerald-50 via-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:via-emerald-900/15 dark:to-teal-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/50">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              setTafsirViewState('list');
              setSelectedSurahId(null);
              setTafsirVerses([]);
              setLocalTafsirSearch('');
              setTafsirError(null);
              setSelectedAyah(null);
            }}
            className="gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-800/30"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للقائمة
          </Button>
          <div className="text-center">
            <h2 className="font-bold text-xl text-slate-900 dark:text-white">
              سورة {selectedSurah?.nameArabic}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge className="bg-emerald-500 text-white text-xs">{selectedTafsir?.name}</Badge>
              <Badge variant="outline" className="text-xs">{selectedSurah?.versesCount} آية</Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="ابحث في الآيات والتفسير..."
              className="pr-9 bg-white dark:bg-slate-800 rounded-xl"
              value={localTafsirSearch}
              onChange={(e) => setLocalTafsirSearch(e.target.value)}
            />
            {localTafsirSearch && (
              <button onClick={() => setLocalTafsirSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Ayah Selector */}
          <div className="relative">
            <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              className="pr-9 pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer min-w-[130px] h-10"
              value={selectedAyah || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value) handleAyahSelect(Number(value));
              }}
              disabled={tafsirLoading || tafsirVerses.length === 0}
            >
              <option value="" disabled>الذهاب لآية</option>
              {tafsirVerses.map((verse) => (
                <option key={verse.verse_number} value={verse.verse_number}>الآية {verse.verse_number}</option>
              ))}
            </select>
          </div>
          
          {/* Tafsir selector */}
          <select
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white h-10 min-w-[160px]"
            value={selectedTafsir?.id || ''}
            onChange={(e) => handleTafsirChange(Number(e.target.value))}
            disabled={tafsirLoading}
          >
            {tafsirs.map((tafsir) => (
              <option key={tafsir.id} value={tafsir.id}>{tafsir.name}</option>
            ))}
          </select>
        </div>

        {/* Stats bar */}
        {tafsirStats && !tafsirLoading && (
          <div className="flex items-center gap-3 mt-3 text-xs">
            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              {tafsirStats.withTafsir} آية مُفسَّرة
            </span>
            {tafsirStats.merged > 0 && (
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {tafsirStats.merged} آية مدمجة
              </span>
            )}
            {tafsirStats.missing > 0 && (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {tafsirStats.missing} غير متوفرة
              </span>
            )}
          </div>
        )}

        {localTafsirSearch && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {filteredVerses.length} آية مطابقة من {tafsirVerses.length}
          </p>
        )}
      </div>

      {/* Loading */}
      {tafsirLoading && renderLoading('جاري تحميل التفسير...')}

      {/* Error */}
      {tafsirError && !tafsirLoading && renderError(tafsirError, retryTafsirLoad)}

      {/* Verses */}
      {!tafsirLoading && !tafsirError && filteredVerses.length > 0 && (
        <ScrollArea className="h-[calc(100vh-380px)]">
          <div className="space-y-4 pl-2">
            {filteredVerses.map((verse) => (
              <Card 
                key={verse.id} 
                id={`verse-${verse.verse_number}`}
                className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-slate-200 dark:border-slate-700"
              >
                <CardContent className="p-5">
                  {/* Verse Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {verse.verse_number}
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">{verse.verse_key}</Badge>
                    </div>
                    <button
                      onClick={() => handleCopyVerse(verse)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="نسخ الآية والتفسير"
                    >
                      {copiedVerse === verse.verse_number ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-5 mb-4 border border-slate-200 dark:border-slate-700">
                    <p 
                      className="text-2xl leading-loose text-slate-900 dark:text-white text-right"
                      style={{ fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', serif", lineHeight: '2.2' }}
                    >
                      {verse.text_uthmani || verse.text_imlaei_simple || 'النص غير متوفر'}
                    </p>
                  </div>

                  {/* Tafsir */}
                  {verse.tafsir_available && verse.tafsir_text ? (
                    verse.tafsir_text.startsWith('[') ? (
                      // Merged verse indicator
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <span className="text-blue-700 dark:text-blue-300 text-sm">
                            {verse.tafsir_text.slice(1, -1)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Normal tafsir
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <BookMarked className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                            {selectedTafsir?.name || 'التفسير'}
                          </span>
                        </div>
                        <p 
                          className="text-base text-slate-700 dark:text-slate-300 leading-relaxed text-right whitespace-pre-line"
                          style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif", lineHeight: '2' }}
                        >
                          {verse.tafsir_text}
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="text-amber-700 dark:text-amber-300 text-sm">
                          التفسير غير متوفر لهذه الآية في هذا التفسير
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* No results from search */}
      {!tafsirLoading && !tafsirError && tafsirVerses.length > 0 && localTafsirSearch && filteredVerses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">لم يتم العثور على نتائج مطابقة</p>
        </div>
      )}
    </div>
  );

  // ============================================
  // HADITH LIST VIEW
  // ============================================

  const renderHadithList = () => (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-bl from-blue-500 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ScrollText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">الأحاديث النبوية الشريفة</h2>
            <p className="text-blue-100 text-sm">من أصح الكتب عند أهل السنة والجماعة</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-blue-100 text-sm">
          <GraduationCap className="w-4 h-4" />
          <span>{hadithBooks.length || 9} كتاب حديث متاح</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="ابحث في الأحاديث... (3 أحرف على الأقل)"
          className="pr-10 h-12 rounded-xl bg-white dark:bg-slate-800"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchQuery.length >= 3 && (
        <div className="mb-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            نتائج البحث
            {searchLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          </h3>
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.slice(0, 5).map((hadith) => (
                <Card key={hadith.id} className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-right mb-2" 
                      style={{ fontFamily: "'Amiri', serif", lineHeight: '1.8' }}>
                      {hadith.text?.slice(0, 200)}...
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">{hadith.book?.name}</Badge>
                      <Badge variant="outline" className="text-xs">حديث رقم {hadith.hadithnumber}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !searchLoading && (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">لم يتم العثور على نتائج</p>
          )}
        </div>
      )}

      {/* Books Grid */}
      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-blue-500" />
        كتب الحديث
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {hadithBooks.map((book) => {
          const info = getHadithBookInfo(book.id);
          return (
            <Card
              key={book.id}
              className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group ${
                selectedBookId === book.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleBookSelect(book.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{book.name}</h3>
                    {info && (
                      <>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 truncate">{info.author}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2">{info.description}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // ============================================
  // HADITH DETAIL VIEW
  // ============================================

  const renderHadithDetail = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-bl from-blue-50 via-blue-50 to-indigo-50 dark:from-blue-900/20 dark:via-blue-900/15 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800/50">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              setHadithViewState('list');
              setSelectedBookId(null);
              setHadiths([]);
              setLocalHadithSearch('');
              setHadithError(null);
            }}
            className="gap-2 hover:bg-blue-100 dark:hover:bg-blue-800/30"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للكتب
          </Button>
          <div className="text-center">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">{selectedBook?.name}</h2>
            {selectedBookInfo && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedBookInfo.author}</p>
            )}
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge className="bg-blue-500 text-white text-xs">الصفحة {hadithPage} من {Math.ceil(hadithTotal / 20) || 1}</Badge>
              <Badge variant="outline" className="text-xs">{hadithTotal} حديث</Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="ابحث في الأحاديث المعروضة..."
            className="pr-9 bg-white dark:bg-slate-800 rounded-xl"
            value={localHadithSearch}
            onChange={(e) => setLocalHadithSearch(e.target.value)}
          />
          {localHadithSearch && (
            <button onClick={() => setLocalHadithSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {localHadithSearch && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {filteredHadiths.length} حديث مطابق من {hadiths.length}
          </p>
        )}
      </div>

      {hadithLoading && renderLoading('جاري تحميل الأحاديث...')}
      {hadithError && !hadithLoading && renderError(hadithError)}

      {/* Hadith Cards */}
      {!hadithLoading && !hadithError && filteredHadiths.length > 0 && (
        <>
          <ScrollArea className="h-[calc(100vh-430px)]">
            <div className="space-y-4 pl-2">
              {filteredHadiths.map((hadith) => (
                <Card key={hadith.id} className="overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md text-sm">
                          {hadith.hadithnumber}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">رقم الحديث</p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedBook?.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyHadith(hadith)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="نسخ الحديث"
                      >
                        {copiedHadith === hadith.id ? (
                          <Check className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5">
                      <p className="text-lg leading-loose text-slate-900 dark:text-white text-right"
                        style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", lineHeight: '2' }}>
                        {hadith.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Button variant="outline" size="sm" disabled={hadithPage <= 1 || hadithLoading} onClick={() => setHadithPage(p => p - 1)} className="gap-1 rounded-xl">
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>
            <div className="flex items-center gap-2 px-4">
              <Badge className="bg-blue-500 text-white px-3 py-1">{hadithPage}</Badge>
              <span className="text-slate-400">/</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">{Math.ceil(hadithTotal / 20) || 1}</span>
            </div>
            <Button variant="outline" size="sm" disabled={hadithPage >= Math.ceil(hadithTotal / 20) || hadithLoading} onClick={() => setHadithPage(p => p + 1)} className="gap-1 rounded-xl">
              التالي
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}

      {!hadithLoading && !hadithError && localHadithSearch && filteredHadiths.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">لم يتم العثور على أحاديث مطابقة</p>
        </div>
      )}
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black" dir={direction}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <ArrowRight className="w-5 h-5" />
              <span className="font-medium text-sm">الرئيسية</span>
            </Link>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Library className="w-4 h-4 text-white" />
              </div>
              المكتبة الشاملة
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {isRateLimited && renderRateLimitError()}

        {!isRateLimited && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryTab)} className="w-full">
            <TabsList className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-1.5 mx-auto flex justify-center mb-6 border border-slate-200 dark:border-slate-800">
              <TabsTrigger value="tafsir" className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all">
                <BookMarked className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">التفسير</span>
              </TabsTrigger>
              <TabsTrigger value="hadith" className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
                <ScrollText className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">الحديث</span>
              </TabsTrigger>
              <TabsTrigger value="books" className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">الكتب</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tafsir" className="outline-none">
              {tafsirViewState === 'list' ? renderTafsirList() : renderTafsirDetail()}
            </TabsContent>

            <TabsContent value="hadith" className="outline-none">
              {hadithViewState === 'list' ? renderHadithList() : renderHadithDetail()}
            </TabsContent>

            <TabsContent value="books" className="outline-none">
              <BooksLibrary />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            جميع المحتويات من مصادر أهل السنة والجماعة فقط
          </p>
        </div>
      </footer>
    </div>
  );
}
