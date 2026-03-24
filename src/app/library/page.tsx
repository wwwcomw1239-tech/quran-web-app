'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Volume2,
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
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [tafsirVerses, setTafsirVerses] = useState<VerseWithTafsir[]>([]);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirError, setTafsirError] = useState<string | null>(null);
  const [tafsirViewState, setTafsirViewState] = useState<ViewState>('list');

  // Hadith state
  const [hadithBooks, setHadithBooks] = useState<HadithBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [hadithPage, setHadithPage] = useState(1);
  const [hadithTotal, setHadithTotal] = useState(0);
  const [hadithLoading, setHadithLoading] = useState(false);
  const [hadithError, setHadithError] = useState<string | null>(null);
  const [hadithViewState, setHadithViewState] = useState<ViewState>('list');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Rate limit state
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Load Tafsirs list
  useEffect(() => {
    const loadTafsirs = async () => {
      setTafsirLoading(true);
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
      setTafsirLoading(false);
    };

    if (activeTab === 'tafsir') {
      loadTafsirs();
    }
  }, [activeTab]);

  // Load Hadith books
  useEffect(() => {
    const loadBooks = async () => {
      setHadithLoading(true);
      const result = await getHadithBooks();
      
      if (result.data) {
        setHadithBooks(result.data);
      } else {
        setHadithError(result.error);
        if (result.isRateLimited) {
          setIsRateLimited(true);
        }
      }
      setHadithLoading(false);
    };

    if (activeTab === 'hadith') {
      loadBooks();
    }
  }, [activeTab]);

  // Load Tafsir for selected surah
  const loadTafsir = useCallback(async () => {
    if (!selectedTafsir) return;

    setTafsirLoading(true);
    setTafsirError(null);

    const result = await getSurahTafsir(selectedSurah, selectedTafsir.id);

    if (result.data) {
      setTafsirVerses(result.data);
      setTafsirViewState('detail');
    } else {
      setTafsirError(result.error);
      if (result.isRateLimited) {
        setIsRateLimited(true);
        toast.error(ERROR_MESSAGES.rateLimited);
      }
    }

    setTafsirLoading(false);
  }, [selectedSurah, selectedTafsir]);

  // Load Hadiths from book
  const loadHadiths = useCallback(async (bookId: string, page: number = 1) => {
    setHadithLoading(true);
    setHadithError(null);

    const result = await getHadithsFromBook(bookId, page, 20);

    if (result.data) {
      setHadiths(result.data.hadiths);
      setHadithTotal(result.data.total);
      setHadithPage(result.data.page);
      setHadithViewState('detail');
    } else {
      setHadithError(result.error);
      if (result.isRateLimited) {
        setIsRateLimited(true);
        toast.error(ERROR_MESSAGES.rateLimited);
      }
    }

    setHadithLoading(false);
  }, []);

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
    </div>
  );

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
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          value={selectedTafsir?.id || ''}
          onChange={(e) => {
            const tafsir = tafsirs.find((t) => t.id === Number(e.target.value));
            setSelectedTafsir(tafsir || null);
          }}
        >
          {tafsirs.map((tafsir) => (
            <option key={tafsir.id} value={tafsir.id}>
              {tafsir.name}
            </option>
          ))}
        </select>
      </div>

      {/* Surah Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {surahs
          .filter((s) =>
            searchQuery
              ? s.nameArabic.includes(searchQuery) ||
                s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase())
              : true
          )
          .map((surah) => (
            <Card
              key={surah.id}
              className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
              onClick={() => {
                setSelectedSurah(surah.id);
                loadTafsir();
              }}
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
    </div>
  );

  // Tafsir Detail View
  const renderTafsirDetail = () => {
    const surah = surahs.find((s) => s.id === selectedSurah);

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
          <Button
            variant="ghost"
            onClick={() => setTafsirViewState('list')}
            className="gap-2"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRTL ? 'العودة للقائمة' : 'Back to list'}
          </Button>
          <div className="text-center">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {isRTL ? surah?.nameArabic : surah?.nameEnglish}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {selectedTafsir?.name}
            </p>
          </div>
          <div className="w-24" />
        </div>

        {/* Verses with Tafsir */}
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4 pr-4">
            {tafsirVerses.map((verse) => (
              <Card key={verse.id} className="overflow-hidden">
                <CardContent className="p-4">
                  {/* Verse Number */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {verse.verse_number}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {verse.verse_key}
                    </p>
                  </div>

                  {/* Arabic Text */}
                  <p className="text-xl leading-loose text-slate-900 dark:text-white mb-4 text-right font-arabic" style={{ fontFamily: "'Amiri', 'Tajawal', serif" }}>
                    {verse.text_uthmani}
                  </p>

                  {/* Tafsir */}
                  {verse.tafsirs && verse.tafsirs.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookMarked className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {isRTL ? 'التفسير' : 'Tafsir'}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-right" style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
                        {verse.tafsirs[0]?.text?.replace(/<[^>]*>/g, '') || ''}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

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
              {searchResults.slice(0, 5).map((hadith, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-right mb-2" style={{ fontFamily: "'Amiri', serif" }}>
                      {hadith.arab?.slice(0, 200)}...
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
            className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
            onClick={() => {
              setSelectedBook(book);
              loadHadiths(book.id);
            }}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                {book.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {book.hadiths_count.toLocaleString()} {isRTL ? 'حديث' : 'hadiths'}
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
      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <Button
          variant="ghost"
          onClick={() => setHadithViewState('list')}
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
            {isRTL ? `الصفحة ${hadithPage} من ${Math.ceil(hadithTotal / 20)}` : `Page ${hadithPage} of ${Math.ceil(hadithTotal / 20)}`}
          </p>
        </div>
        <div className="w-24" />
      </div>

      {/* Hadiths */}
      <ScrollArea className="h-[calc(100vh-350px)]">
        <div className="space-y-4 pr-4">
          {hadiths.map((hadith, index) => (
            <Card key={hadith.number || index}>
              <CardContent className="p-4">
                {/* Hadith Number */}
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-blue-500">
                    #{hadith.number}
                  </Badge>
                </div>

                {/* Arabic Text */}
                <p className="text-lg leading-loose text-slate-900 dark:text-white text-right mb-3" style={{ fontFamily: "'Amiri', serif" }}>
                  {hadith.arab}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 py-4">
        <Button
          variant="outline"
          disabled={hadithPage <= 1 || hadithLoading}
          onClick={() => selectedBook && loadHadiths(selectedBook.id, hadithPage - 1)}
        >
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {isRTL ? 'السابق' : 'Previous'}
        </Button>
        <span className="text-sm text-slate-500">
          {hadithPage} / {Math.ceil(hadithTotal / 20)}
        </span>
        <Button
          variant="outline"
          disabled={hadithPage >= Math.ceil(hadithTotal / 20) || hadithLoading}
          onClick={() => selectedBook && loadHadiths(selectedBook.id, hadithPage + 1)}
        >
          {isRTL ? 'التالي' : 'Next'}
          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
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
              {tafsirLoading && tafsirs.length === 0 ? (
                renderLoading()
              ) : tafsirError && tafsirs.length === 0 ? (
                renderError(tafsirError)
              ) : (
                tafsirViewState === 'list' ? renderTafsirList() : renderTafsirDetail()
              )}
            </TabsContent>

            {/* Hadith Tab */}
            <TabsContent value="hadith" className="outline-none">
              {hadithLoading && hadithBooks.length === 0 ? (
                renderLoading()
              ) : hadithError && hadithBooks.length === 0 ? (
                renderError(hadithError)
              ) : (
                hadithViewState === 'list' ? renderHadithList() : renderHadithDetail()
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
