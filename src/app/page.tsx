'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { surahs, Surah } from '@/data/surahs';
import { reciters, getAudioUrl } from '@/data/reciters';
import {
  Header,
  ReciterSelector,
  SearchFilter,
  SurahList,
  Footer,
  DownloadDialog,
  AnnouncementBanner,
  FloatingScrollButtons,
} from '@/components/quran';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, BookOpen, Download, ChevronLeft, ChevronRight, Library, Video, Flame, Baby, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useAudioQuality } from '@/lib/audioQuality';
import { useAudioPlayer } from '@/lib/AudioPlayerContext';

// Lazy load heavy components for better performance
function TabLoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );
}

const BooksLibrary = dynamic(() => import('@/components/quran/BooksLibrary').then(m => ({ default: m.BooksLibrary })), {
  loading: () => <TabLoadingSpinner />,
  ssr: false,
});
const QuranVideos = dynamic(() => import('@/components/quran/QuranVideos').then(m => ({ default: m.QuranVideos })), {
  loading: () => <TabLoadingSpinner />,
  ssr: false,
});
const QuranShorts = dynamic(() => import('@/components/quran/QuranShorts').then(m => ({ default: m.QuranShorts })), {
  loading: () => <TabLoadingSpinner />,
  ssr: false,
});
const KidsVideos = dynamic(() => import('@/components/quran/KidsVideos').then(m => ({ default: m.KidsVideos })), {
  loading: () => <TabLoadingSpinner />,
  ssr: false,
});

type FilterType = 'all' | 'مكية' | 'مدنية';

function QuranWebAppContent() {
  const { t, isRTL, direction } = useLanguage();
  const { quality } = useAudioQuality();
  
  // Use global audio player context
  const {
    currentSurah,
    isPlaying,
    isLoading,
    favorites,
    showFavorites,
    filter,
    searchQuery,
    selectedReciter,
    cacheStats,
    playSurah,
    toggleFavorite,
    setShowFavorites,
    setFilter,
    setSearchQuery,
    setSelectedReciter,
  } = useAudioPlayer();

  // Download dialog state (local)
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedSurahForDownload, setSelectedSurahForDownload] = useState<Surah | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [isLoadingFileSize, setIsLoadingFileSize] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const footerRef = useRef<HTMLElement | null>(null);

  // Get selected reciter info
  const currentReciter = useMemo(() => {
    return reciters.find(r => r.id === selectedReciter) || reciters[0];
  }, [selectedReciter]);

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

  // Contact developer function
  const handleContactDeveloper = () => {
    const email = 'almubarmaj8@gmail.com';
    const subject = encodeURIComponent(isRTL ? 'تواصل من تطبيق القرآن الكريم' : 'Contact from Quran App');
    const gmailUrl = `googlegmail://co?to=${email}&subject=${subject}`;
    const mailtoUrl = `mailto:${email}?subject=${subject}`;

    const start = Date.now();
    window.location.href = gmailUrl;

    setTimeout(() => {
      if (Date.now() - start < 1000) {
        window.location.href = mailtoUrl;
      }
    }, 500);
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

  const handleDownload = async (surah: Surah) => {
    setSelectedSurahForDownload(surah);
    setFileSize(null);
    setIsLoadingFileSize(true);
    setDownloadDialogOpen(true);

    const audioUrl = getAudioUrl(selectedReciter, surah.id);
    const size = await fetchFileSize(audioUrl);
    setFileSize(size);
    setIsLoadingFileSize(false);
  };

  // Download audio - Original quality only
  const downloadAudio = async () => {
    if (!selectedSurahForDownload) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    const audioUrl = getAudioUrl(selectedReciter, selectedSurahForDownload.id);

    const fileName = `${selectedSurahForDownload.id.toString().padStart(3, '0')}_${selectedSurahForDownload.nameArabic}_${currentReciter.nameArabic}_original.mp3`;

    try {
      const response = await fetch(audioUrl);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

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

      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error('Download error:', error);
      window.open(audioUrl, '_blank');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black" dir={direction}>
      {/* Header */}
      <Header />

      {/* Announcement Banner */}
      <div className="container mx-auto pt-4">
        <AnnouncementBanner />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-36">
        {/* Library Tabs */}
        <Tabs defaultValue="audio" className="w-full mb-6">
          <TabsList className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-1.5 mx-auto flex justify-center mb-6 border border-slate-200 dark:border-slate-800">
            <TabsTrigger
              value="audio"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Headphones className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">{t('audioLibrary')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="books"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">{t('booksLibrary')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Video className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">{isRTL ? 'مقاطع مرئية' : 'Videos'}</span>
            </TabsTrigger>
            <TabsTrigger
              value="shorts"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl data-[state=active]:bg-violet-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Flame className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">{isRTL ? 'مقاطع قصيرة' : 'Shorts'}</span>
            </TabsTrigger>
            <TabsTrigger
              value="kids"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Baby className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">{isRTL ? 'مقاطع الأطفال' : 'Kids'}</span>
            </TabsTrigger>
            <TabsTrigger
              value="library"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
              onClick={() => window.location.href = '/library'}
            >
              <Library className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">{isRTL ? 'المكتبة الشاملة' : 'Library'}</span>
            </TabsTrigger>
          </TabsList>

          {/* Audio Library Tab */}
          <TabsContent value="audio" className="space-y-6 outline-none">
            {/* Reciter Selection */}
            <ReciterSelector
              selectedReciter={selectedReciter}
              onSelectReciter={setSelectedReciter}
            />

            {/* Search and Filter */}
            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filter={filter}
              onFilterChange={setFilter}
              showFavorites={showFavorites}
              onToggleFavorites={() => setShowFavorites(!showFavorites)}
              favoritesCount={favorites.length}
              filteredCount={filteredSurahs.length}
            />

            {/* Cache Stats - Show if there are cached files */}
            {cacheStats.count > 0 && (
              <Link
                href="/downloads"
                className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-4 py-2 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:shadow-md transition-all duration-300 group"
              >
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  {isRTL 
                    ? `${cacheStats.count} سورة محفوظة (${cacheStats.formattedSize})`
                    : `${cacheStats.count} surahs cached (${cacheStats.formattedSize})`
                  }
                </span>
                {isRTL ? (
                  <ChevronLeft className="w-4 h-4 text-emerald-500 dark:text-emerald-400 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                )}
              </Link>
            )}

            {/* Surah List */}
            <SurahList
              surahs={filteredSurahs}
              currentSurahId={currentSurah?.id ?? null}
              isPlaying={isPlaying}
              isLoading={isLoading}
              favorites={favorites}
              onPlay={playSurah}
              onToggleFavorite={toggleFavorite}
              onDownload={handleDownload}
            />
          </TabsContent>

          {/* Books Library Tab */}
          <TabsContent value="books" className="outline-none">
            <BooksLibrary />
          </TabsContent>

          {/* Quran Videos Tab */}
          <TabsContent value="videos" className="outline-none">
            <QuranVideos />
          </TabsContent>

          {/* Quran Shorts Tab */}
          <TabsContent value="shorts" className="outline-none">
            <QuranShorts />
          </TabsContent>

          {/* Kids Videos Tab */}
          <TabsContent value="kids" className="outline-none">
            <KidsVideos />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <Footer
        ref={footerRef}
        onContactDeveloper={handleContactDeveloper}
      />

      {/* Floating Scroll Buttons - Positioned above audio player */}
      <FloatingScrollButtons hasActiveAudio={!!currentSurah} />

      {/* Download Dialog */}
      <DownloadDialog
        open={downloadDialogOpen}
        surah={selectedSurahForDownload}
        reciterName={currentReciter.nameArabic}
        fileSize={fileSize}
        isLoadingFileSize={isLoadingFileSize}
        isDownloading={isDownloading}
        downloadProgress={downloadProgress}
        onClose={() => setDownloadDialogOpen(false)}
        onDownload={downloadAudio}
      />
    </div>
  );
}

export default function QuranWebApp() {
  return <QuranWebAppContent />;
}
