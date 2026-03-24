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
  ArrowLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  FileText,
  X,
  Filter,
  AlertTriangle,
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
  Tafsir,
  VerseWithTafsir,
  HadithBook,
  Hadith,
  ERROR_MESSAGES,
} from '@/lib/islamic-api';

// Surah list for tafsir selection
import { surahs } from '@/data/surahs';

type LibraryTab = 'tafsir' | 'hadith';
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

  // Local search for displayed verses/tafsir
  const [localTafsirSearch, setLocalTafsirSearch] = useState('');

  // Search for surah list
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

  // Local search for displayed hadiths
  const [localHadithSearch, setLocalHadithSearch] = useState('');

  // Search state (global hadith search)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Rate limit state
  const [isRateLimited, setIsRateLimited] = useState(false);

  // ✅ NEW: Filtered verses based on local search
  const filteredVerses = useMemo(() => {
    if (!localTafsirSearch.trim()) return tafsirVerses;
    const query = localTafsirSearch.toLowerCase();
    return tafsirVerses.filter(verse => 
      verse.text_uthmani?.includes(localTafsirSearch) ||
      (verse.tafsir_text && verse.tafsir_text.toLowerCase().includes(query))
    );
  }, [tafsirVerses, localTafsirSearch]);

  // ✅ NEW: Filtered hadiths based on local search
  const filteredHadiths = useMemo(() => {
    if (!localHadithSearch.trim()) return hadiths;
    const query = localHadithSearch.toLowerCase();
    return hadiths.filter(hadith => 
      hadith.text?.toLowerCase().includes(query)
    );
  }, [hadiths, localHadithSearch]);

  // Load Tafsirs list on mount
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
        if (result.isRateLimited) {
          setIsRateLimited(true);
        }
      }
    };

    if (activeTab === 'tafsir') {
      loadTafsirs();
    }
  }, [activeTab]);

  // Load Hadith books on mount
  useEffect(() => {
    const loadBooks = async () => {
      const result = await getHadithBooks();
      
      if (result.data) {
        setHadithBooks(result.data);
      } else {
        setHadithError(result.error);
        if (result.isRateLimited) {
          setIsRateLimited(true);
        }
      }
    };

    if (activeTab === 'hadith') {
      loadBooks();
    }
  }, [activeTab]);

  // ✅ FIX: Load Tafsir when selectedSurahId OR selectedTafsir changes
  useEffect(() => {
    const loadTafsir = async () => {
      if (selectedSurahId === null || !selectedTafsir) return;

      setTafsirLoading(true);
      setTafsirError(null);
      setLocalTafsirSearch(''); // Reset local search
      console.log(`[Library] Loading tafsir for surah ${selectedSurahId} with tafsir ID ${selectedTafsir.id}`);

      const result = await getSurahTafsir(selectedSurahId, selectedTafsir.id);

      if (result.data) {
        setTafsirVerses(result.data);
        setTafsirViewState('detail');
        console.log(`[Library] Loaded ${result.data.length} verses`);
        
        // Check if any tafsir is available
        const hasTafsir = result.data.some(v => v.tafsir_available);
        if (!hasTafsir) {
          toast.warning(ERROR_MESSAGES.tafsirNotAvailable);
        }
      } else {
        setTafsirError(result.error);
        if (result.isRateLimited) {
          setIsRateLimited(true);
          toast.error(ERROR_MESSAGES.rateLimited);
        }
      }

      setTafsirLoading(false);
    };

    loadTafsir();
  }, [selectedSurahId, selectedTafsir]);

  // Handle surah selection
  const handleSurahSelect = (surahId: number) => {
    console.log(`[Library] User selected surah ${surahId}`);
    setSelectedSurahId(surahId);
  };

  // ✅ FIX: Handle tafsir change - reload data
  const handleTafsirChange = (tafsirId: number) => {
    const tafsir = tafsirs.find(t => t.id === tafsirId);
    if (tafsir && tafsir.id !== selectedTafsir?.id) {
      console.log(`[Library] User changed tafsir to ${tafsir.name}`);
      setSelectedTafsir(tafsir);
      // The useEffect will trigger reload because selectedTafsir changed
    }
  };

  // Load Hadiths when selectedBookId changes
  useEffect(() => {
    const loadHadiths = async () => {
      if (selectedBookId === null) return;

      setHadithLoading(true);
      setHadithError(null);
      setLocalHadithSearch(''); // Reset local search
      console.log(`[Library] Loading hadiths from book ${selectedBookId}, page ${hadithPage}`);

      const result = await getHadithsFromBook(selectedBookId, hadithPage, 20);

      if (result.data) {
        setHadiths(result.data.hadiths);
        setHadithTotal(result.data.total);
        setHadithViewState('detail');
        console.log(`[Library] Loaded ${result.data.hadiths.length} hadiths`);
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

  // Handle book selection
  const handleBookSelect = (bookId: string) => {
    console.log(`[Library] User selected book ${bookId}`);
    setSelectedBookId(bookId);
    setHadithPage(1); // Reset page
  };

  // Debounced search
  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const result = await searchHadiths(query);

    if (result.data) {
      setSearchResults(result.data);
    } else if (result.error) {
      toast.error(result.error);
    }

    setSearchLoading(false);
  }, 500);

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Render rate limit error UI
  const renderRateLimitError = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        {isRTL ? 'المكتبة تواجه ضغطاً كبيراً' : 'Library Under Heavy Load'}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-md">
        {ERROR_MESSAGES.rateLimited}
      </p>
      <Button
        onClick={() => window.location.reload()}
        className="gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        {isRTL ? 'إعادة المحاولة' : 'Retry'}
      </Button>
    </div>
  );

  // Render loading state
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
      <p className="text-slate-500 dark:text-slate-400">
        {isRTL ? 'جاري التحميل...' : 'Loading...'}
      </p>
    </div>
  );

  // Render error state
  const renderError = (error: string) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-center">{error}</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        {isRTL ? 'إعادة المحاولة' : 'Retry'}
      </Button>
    </div>
  );

  // Get current surah info
  const selectedSurah = selectedSurahId ? surahs.find(s => s.id === selectedSurahId) : null;
  const selectedBook = selectedBookId ? hadithBooks.find(b => b.id === selectedBookId) : null;

  // Filter surahs based on search
  const filteredSurahs = useMemo(() => {
    if (!surahSearchQuery.trim()) return surahs;
    const query = surahSearchQuery.toLowerCase();
    return surahs.filter(s => 
      s.nameArabic.includes(surahSearchQuery) ||
      s.nameEnglish.toLowerCase().includes(query)
    );
  }, [surahs, surahSearchQuery]);

  // Tafsir List View
  const renderTafsirList = () => (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder={isRTL ? 'ابحث في السور...' : 'Search surahs...'}
            className="pr-10"
            value={surahSearchQuery}
            onChange={(e) => setSurahSearchQuery(e.target.value)}
          />
          {surahSearchQuery && (
            <button
              onClick={() => setSurahSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="relative">
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            className="pr-10 pl-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer min-w-[180px]"
            value={selectedTafsir?.id || ''}
            onChange={(e) => handleTafsirChange(Number(e.target.value))}
          >
            {tafsirs.map((tafsir) => (
              <option key={tafsir.id} value={tafsir.id}>
                {tafsir.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Tafsir Info */}
      {selectedTafsir && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-sm text-emerald-700 dark:text-emerald-300">
          {isRTL ? 'التفسير المحدد:' : 'Selected Tafsir:'} <strong>{selectedTafsir.name}</strong>
        </div>
      )}

      {/* Results count */}
      {surahSearchQuery && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isRTL 
            ? `${filteredSurahs.length} سورة مطابقة` 
            : `${filteredSurahs.length} surahs matching`}
        </p>
      )}

      {/* Surah Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredSurahs.map((surah) => (
          <Card
            key={surah.id}
            className={`cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 ${
              selectedSurahId === surah.id ? 'ring-2 ring-emerald-500' : ''
            }`}
            onClick={() => handleSurahSelect(surah.id)}
          >
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold mb-2">
                {surah.id}
              </div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {isRTL ? surah.nameArabic : surah.nameEnglish}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {surah.versesCount} {isRTL ? 'آية' : 'verses'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {surahSearchQuery && filteredSurahs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">
            {isRTL ? 'لم يتم العثور على سور مطابقة' : 'No matching surahs found'}
          </p>
        </div>
      )}
    </div>
  );

  // ✅ IMPROVED: Tafsir Detail View with proper data binding
  const renderTafsirDetail = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              setTafsirViewState('list');
              setSelectedSurahId(null);
              setTafsirVerses([]);
              setLocalTafsirSearch('');
            }}
            className="gap-2"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRTL ? 'العودة للقائمة' : 'Back to list'}
          </Button>
          <div className="text-center">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {isRTL ? selectedSurah?.nameArabic : selectedSurah?.nameEnglish}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {selectedTafsir?.name}
            </p>
          </div>
          <div className="w-24" />
        </div>

        {/* Tafsir selector and local search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={isRTL ? 'ابحث في الآيات والتفسير...' : 'Search verses & tafsir...'}
              className="pr-9 bg-white dark:bg-slate-800"
              value={localTafsirSearch}
              onChange={(e) => setLocalTafsirSearch(e.target.value)}
            />
            {localTafsirSearch && (
              <button
                onClick={() => setLocalTafsirSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            value={selectedTafsir?.id || ''}
            onChange={(e) => handleTafsirChange(Number(e.target.value))}
            disabled={tafsirLoading}
          >
            {tafsirs.map((tafsir) => (
              <option key={tafsir.id} value={tafsir.id}>
                {tafsir.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search results count */}
        {localTafsirSearch && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isRTL 
              ? `${filteredVerses.length} آية مطابقة من ${tafsirVerses.length}` 
              : `${filteredVerses.length} matching verses of ${tafsirVerses.length}`}
          </p>
        )}
      </div>

      {/* Loading State */}
      {tafsirLoading && renderLoading()}

      {/* Error State */}
      {tafsirError && !tafsirLoading && renderError(tafsirError)}

      {/* ✅ CRITICAL FIX: Verses with Tafsir - Proper data binding */}
      {!tafsirLoading && !tafsirError && filteredVerses.length > 0 && (
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="space-y-4 pr-4">
            {filteredVerses.map((verse) => (
              <Card key={verse.id} className="overflow-hidden shadow-md">
                <CardContent className="p-5">
                  {/* Verse Number */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {verse.verse_number}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {verse.verse_key}
                    </Badge>
                  </div>

                  {/* ✅ CRITICAL: Arabic Text - ALWAYS RENDERED */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-5 mb-4 border border-slate-200 dark:border-slate-700">
                    <p 
                      className="text-2xl leading-loose text-slate-900 dark:text-white text-right"
                      style={{ 
                        fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', serif",
                        lineHeight: '2.2'
                      }}
                    >
                      {verse.text_uthmani || verse.text_imlaei_simple || 'النص غير متوفر'}
                    </p>
                  </div>

                  {/* ✅ CRITICAL: Tafsir - With fallback */}
                  {verse.tafsir_available && verse.tafsir_text ? (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                          <BookMarked className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {selectedTafsir?.name || (isRTL ? 'التفسير' : 'Tafsir')}
                        </span>
                      </div>
                      <p 
                        className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-right"
                        style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}
                      >
                        {verse.tafsir_text}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <span className="text-amber-700 dark:text-amber-300 text-sm">
                          {ERROR_MESSAGES.tafsirNotAvailable}
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

      {/* No search results */}
      {!tafsirLoading && !tafsirError && localTafsirSearch && filteredVerses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">
            {isRTL ? 'لم يتم العثور على نتائج مطابقة' : 'No matching results found'}
          </p>
        </div>
      )}
    </div>
  );

  // Hadith List View
  const renderHadithList = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder={isRTL ? 'ابحث في الأحاديث... (3 أحرف على الأقل)' : 'Search hadiths... (min 3 chars)'}
          className="pr-10"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Search Results */}
      {searchQuery.length >= 3 && (
        <div className="mb-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">
            {isRTL ? 'نتائج البحث' : 'Search Results'}
            {searchLoading && <Loader2 className="w-4 h-4 animate-spin inline mr-2" />}
          </h3>
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.slice(0, 5).map((hadith) => (
                <Card key={hadith.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-right mb-2" style={{ fontFamily: "'Amiri', serif" }}>
                      {hadith.text?.slice(0, 200)}...
                    </p>
                    <Badge variant="outline">
                      {hadith.book?.name || hadith.id}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !searchLoading && (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">
              {isRTL ? 'لم يتم العثور على نتائج' : 'No results found'}
            </p>
          )}
        </div>
      )}

      {/* Books Grid */}
      <h3 className="font-bold text-slate-900 dark:text-white mb-3">
        {isRTL ? 'كتب الحديث' : 'Hadith Books'}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {hadithBooks.map((book) => (
          <Card
            key={book.id}
            className={`cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 ${
              selectedBookId === book.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleBookSelect(book.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                {book.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRTL ? 'انقر للتصفح' : 'Click to browse'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Hadith Detail View
  const renderHadithDetail = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              setHadithViewState('list');
              setSelectedBookId(null);
              setHadiths([]);
              setLocalHadithSearch('');
            }}
            className="gap-2"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRTL ? 'العودة للكتب' : 'Back to books'}
          </Button>
          <div className="text-center">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {selectedBook?.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isRTL 
                ? `الصفحة ${hadithPage} من ${Math.ceil(hadithTotal / 20)}` 
                : `Page ${hadithPage} of ${Math.ceil(hadithTotal / 20)}`}
            </p>
          </div>
          <div className="w-24" />
        </div>

        {/* Local search in displayed hadiths */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={isRTL ? 'ابحث في الأحاديث المعروضة...' : 'Search displayed hadiths...'}
            className="pr-9 bg-white dark:bg-slate-800"
            value={localHadithSearch}
            onChange={(e) => setLocalHadithSearch(e.target.value)}
          />
          {localHadithSearch && (
            <button
              onClick={() => setLocalHadithSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search results count */}
        {localHadithSearch && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isRTL 
              ? `${filteredHadiths.length} حديث مطابق من ${hadiths.length}` 
              : `${filteredHadiths.length} matching hadiths of ${hadiths.length}`}
          </p>
        )}
      </div>

      {/* Loading State */}
      {hadithLoading && renderLoading()}

      {/* Error State */}
      {hadithError && !hadithLoading && renderError(hadithError)}

      {/* Hadith Cards */}
      {!hadithLoading && !hadithError && filteredHadiths.length > 0 && (
        <>
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-4 pr-4">
              {filteredHadiths.map((hadith) => (
                <Card key={hadith.id} className="overflow-hidden shadow-md">
                  <CardContent className="p-5">
                    {/* Hadith Number Badge - Prominent */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                          #{hadith.hadithnumber}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isRTL ? 'رقم الحديث' : 'Hadith Number'}
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {selectedBook?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Arabic Text - Clean display */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5">
                      <p 
                        className="text-xl leading-loose text-slate-900 dark:text-white text-right"
                        style={{ 
                          fontFamily: "'Amiri', 'Traditional Arabic', serif",
                          lineHeight: '2'
                        }}
                      >
                        {hadith.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              disabled={hadithPage <= 1 || hadithLoading}
              onClick={() => setHadithPage(p => p - 1)}
              className="gap-1"
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {isRTL ? 'السابق' : 'Previous'}
            </Button>
            
            <div className="flex items-center gap-2 px-4">
              <Badge variant="secondary" className="px-3 py-1">
                {hadithPage}
              </Badge>
              <span className="text-slate-400">/</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {Math.ceil(hadithTotal / 20) || 1}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={hadithPage >= Math.ceil(hadithTotal / 20) || hadithLoading}
              onClick={() => setHadithPage(p => p + 1)}
              className="gap-1"
            >
              {isRTL ? 'التالي' : 'Next'}
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </>
      )}

      {/* No search results */}
      {!hadithLoading && !hadithError && localHadithSearch && filteredHadiths.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">
            {isRTL ? 'لم يتم العثور على أحاديث مطابقة' : 'No matching hadiths found'}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black" dir={direction}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              <span className="font-medium">{isRTL ? 'الرئيسية' : 'Home'}</span>
            </Link>

            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-500" />
              {isRTL ? 'المكتبة الشاملة' : 'Islamic Library'}
            </h1>

            <div className="w-24" />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Rate Limit Error */}
        {isRateLimited && renderRateLimitError()}

        {/* Main Content */}
        {!isRateLimited && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryTab)} className="w-full">
            <TabsList className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-1.5 mx-auto flex justify-center mb-6 border border-slate-200 dark:border-slate-800">
              <TabsTrigger
                value="tafsir"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <BookMarked className="w-5 h-5" />
                <span className="font-medium">{isRTL ? 'التفسير' : 'Tafsir'}</span>
              </TabsTrigger>
              <TabsTrigger
                value="hadith"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">{isRTL ? 'الحديث' : 'Hadith'}</span>
              </TabsTrigger>
            </TabsList>

            {/* Tafsir Tab */}
            <TabsContent value="tafsir" className="outline-none">
              {tafsirViewState === 'list' ? renderTafsirList() : renderTafsirDetail()}
            </TabsContent>

            {/* Hadith Tab */}
            <TabsContent value="hadith" className="outline-none">
              {hadithViewState === 'list' ? renderHadithList() : renderHadithDetail()}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
