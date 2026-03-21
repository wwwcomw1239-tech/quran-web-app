'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { surahs, Surah } from '@/data/surahs';
import { reciters, getAudioUrl } from '@/data/reciters';
import {
  Header,
  ReciterSelector,
  SearchFilter,
  SurahList,
  AudioPlayerBar,
  Footer,
  DownloadDialog,
  BooksLibrary,
  AnnouncementBanner,
  FloatingScrollButtons,
} from '@/components/quran';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, BookOpen } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/lib/i18n';
import {
  checkAudioInCache,
  getAudioFromCache,
  saveAudioOffline,
  removeAudioFromCache,
  getCacheStats,
  isCacheApiSupported,
} from '@/lib/audioCache';

type FilterType = 'all' | 'مكية' | 'مدنية';

function QuranWebAppContent() {
  const { t, isRTL, direction } = useLanguage();

  // State
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
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [isLoadingFileSize, setIsLoadingFileSize] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Offline cache state
  const [isCached, setIsCached] = useState(false);
  const [isCaching, setIsCaching] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);
  const [cacheStats, setCacheStats] = useState({ count: 0, totalSize: 0, formattedSize: '0 B' });
  const [cacheSupported, setCacheSupported] = useState(true);
  const [cachedBlobUrl, setCachedBlobUrl] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Bookmark utility functions
  const BOOKMARK_KEY = 'quran-bookmarks';
  
  const getBookmark = (reciterId: string, surahId: number): number | null => {
    try {
      const data = localStorage.getItem(BOOKMARK_KEY);
      if (!data) return null;
      const bookmarks = JSON.parse(data);
      const key = `${reciterId}-${surahId}`;
      return bookmarks[key]?.timestamp || null;
    } catch {
      return null;
    }
  };
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

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('quran-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Check if Cache API is supported
  useEffect(() => {
    setCacheSupported(isCacheApiSupported());
  }, []);

  // Load cache stats on mount
  useEffect(() => {
    if (cacheSupported) {
      getCacheStats().then(setCacheStats);
    }
  }, [cacheSupported]);

  // Check cache status when surah or reciter changes
  useEffect(() => {
    if (!currentSurah || !cacheSupported) {
      setIsCached(false);
      return;
    }

    const audioUrl = getAudioUrl(selectedReciter, currentSurah.id);
    checkAudioInCache(audioUrl, selectedReciter, currentSurah.id).then(setIsCached);
  }, [currentSurah, selectedReciter, cacheSupported]);

  // Clean up blob URL on unmount or surah change
  useEffect(() => {
    return () => {
      if (cachedBlobUrl) {
        URL.revokeObjectURL(cachedBlobUrl);
      }
    };
  }, [cachedBlobUrl]);

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

  // Stop audio when reciter changes
  useEffect(() => {
    if (audioRef.current && currentSurah) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);

      // Clean up old blob URL
      if (cachedBlobUrl) {
        URL.revokeObjectURL(cachedBlobUrl);
        setCachedBlobUrl(null);
      }

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

  // Play surah function - CHECKS CACHE FIRST
  const playSurah = useCallback(async (surah: Surah) => {
    // Toggle play/pause if same surah
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

    // Clean up old blob URL
    if (cachedBlobUrl) {
      URL.revokeObjectURL(cachedBlobUrl);
      setCachedBlobUrl(null);
    }

    if (audioRef.current) {
      const audioUrl = getAudioUrl(selectedReciter, surah.id);
      let playUrl = audioUrl;

      // CHECK CACHE FIRST
      if (cacheSupported) {
        const inCache = await checkAudioInCache(audioUrl, selectedReciter, surah.id);
        setIsCached(inCache);

        if (inCache) {
          const blobUrl = await getAudioFromCache(audioUrl, selectedReciter, surah.id);
          if (blobUrl) {
            playUrl = blobUrl;
            setCachedBlobUrl(blobUrl);
            console.log('[Audio] Playing from cache:', surah.id);
          }
        } else {
          console.log('[Audio] Playing from network:', surah.id);
        }
      }

      audioRef.current.src = playUrl;
      audioRef.current.load();

      // Set playback rate
      audioRef.current.playbackRate = playbackRate;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            
            // Resume from bookmark if exists
            const savedBookmark = getBookmark(selectedReciter, surah.id);
            if (savedBookmark && audioRef.current && savedBookmark < audioRef.current.duration) {
              audioRef.current.currentTime = savedBookmark;
              console.log('[Audio] Resuming from bookmark:', savedBookmark);
            }
          })
          .catch((error) => {
            console.error('Audio play error:', error);
            setAudioError(t('audioError'));
            setIsLoading(false);
            setIsPlaying(false);
          });
      }
    }
  }, [currentSurah, isPlaying, selectedReciter, t, cacheSupported, cachedBlobUrl, playbackRate]);

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
      setAudioError(t('loadError'));
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
  }, [isRepeat, playNext, t]);

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

  const playRandom = () => {
    const randomIndex = Math.floor(Math.random() * surahs.length);
    playSurah(surahs[randomIndex]);
  };

  // Seek forward by 10 seconds
  const seekForward = useCallback(() => {
    if (!audioRef.current || !duration) return;
    const newTime = Math.min(audioRef.current.currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
  }, [duration]);

  // Seek backward by 10 seconds
  const seekBackward = useCallback(() => {
    if (!audioRef.current) return;
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
  }, []);

  // Change playback rate
  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  // Toggle cache for current surah
  const toggleCache = useCallback(async () => {
    if (!currentSurah || !cacheSupported || isCaching) return;

    const audioUrl = getAudioUrl(selectedReciter, currentSurah.id);

    if (isCached) {
      // Remove from cache
      const success = await removeAudioFromCache(selectedReciter, currentSurah.id);
      if (success) {
        setIsCached(false);
        // Clean up blob URL
        if (cachedBlobUrl) {
          URL.revokeObjectURL(cachedBlobUrl);
          setCachedBlobUrl(null);
        }
        // Update stats
        const stats = await getCacheStats();
        setCacheStats(stats);
      }
    } else {
      // Save to cache
      setIsCaching(true);
      setCacheProgress(0);

      const result = await saveAudioOffline(
        audioUrl,
        selectedReciter,
        currentSurah.id,
        currentSurah.nameArabic,
        currentSurah.nameEnglish,
        currentReciter.nameArabic,
        currentReciter.nameEnglish,
        (progress) => setCacheProgress(progress)
      );

      setIsCaching(false);
      setCacheProgress(0);

      if (result.success) {
        setIsCached(true);
        // Update stats
        const stats = await getCacheStats();
        setCacheStats(stats);
      } else {
        // Show error alert
        let errorMessage = isRTL ? 'حدث خطأ أثناء الحفظ' : 'Error saving audio';
        
        if (result.error === 'storage_full') {
          errorMessage = isRTL 
            ? 'مساحة التخزين ممتلئة. احذف بعض الملفات المحفوظة.' 
            : 'Storage is full. Please remove some cached files.';
        } else if (result.error === 'Cache API not supported') {
          errorMessage = isRTL 
            ? 'متصفحك لا يدعم التخزين المؤقت' 
            : 'Your browser does not support offline caching';
        }
        
        alert(errorMessage);
      }
    }
  }, [currentSurah, selectedReciter, isCached, isCaching, cacheSupported, cachedBlobUrl, isRTL, currentReciter]);

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

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    // Clean up blob URL
    if (cachedBlobUrl) {
      URL.revokeObjectURL(cachedBlobUrl);
      setCachedBlobUrl(null);
    }
    setCurrentSurah(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsCached(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black" dir={direction}>
      {/* Audio Element - Optimized for streaming with minimal preload */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Headphones className="w-5 h-5" />
              <span className="font-medium">{t('audioLibrary')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="books"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">{t('booksLibrary')}</span>
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
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-4 py-2">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {isRTL 
                    ? `${cacheStats.count} سورة محفوظة (${cacheStats.formattedSize})`
                    : `${cacheStats.count} surahs cached (${cacheStats.formattedSize})`
                  }
                </span>
              </div>
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
        </Tabs>
      </main>

      {/* Footer */}
      <Footer
        ref={footerRef}
        onContactDeveloper={handleContactDeveloper}
      />

      {/* Floating Scroll Buttons - Positioned above audio player */}
      <FloatingScrollButtons hasActiveAudio={!!currentSurah} />

      {/* Audio Player Bar */}
      <AudioPlayerBar
        currentSurah={currentSurah}
        isPlaying={isPlaying}
        isLoading={isLoading}
        progress={progress}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isRepeat={isRepeat}
        reciterId={selectedReciter}
        reciterName={currentReciter.nameArabic}
        isCached={isCached}
        isCaching={isCaching}
        cacheProgress={cacheProgress}
        onTogglePlay={togglePlay}
        onPrevious={playPrevious}
        onNext={playNext}
        onSeek={seekTo}
        onToggleMute={toggleMute}
        onVolumeChange={changeVolume}
        onToggleRepeat={() => setIsRepeat(!isRepeat)}
        onRandom={playRandom}
        onClose={closePlayer}
        onToggleCache={cacheSupported ? toggleCache : undefined}
        onSeekForward={seekForward}
        onSeekBackward={seekBackward}
        onPlaybackRateChange={handlePlaybackRateChange}
        playbackRate={playbackRate}
      />

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
  return (
    <LanguageProvider>
      <QuranWebAppContent />
    </LanguageProvider>
  );
}
