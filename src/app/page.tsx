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
} from '@/components/quran';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, BookOpen } from 'lucide-react';

type FilterType = 'all' | 'مكية' | 'مدنية';

export default function QuranWebApp() {
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

  // Scroll functions
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Contact developer function
  const handleContactDeveloper = () => {
    const email = 'almubarmaj8@gmail.com';
    const subject = encodeURIComponent('تواصل من تطبيق القرآن الكريم');
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

  const playRandom = () => {
    const randomIndex = Math.floor(Math.random() * surahs.length);
    playSurah(surahs[randomIndex]);
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
      <Header onScrollToBottom={scrollToBottom} />

      {/* Announcement Banner */}
      <div className="container mx-auto pt-4">
        <AnnouncementBanner />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-36">
        {/* Library Tabs */}
        <Tabs defaultValue="audio" className="w-full mb-6">
          <TabsList className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-1.5 mx-auto flex justify-center mb-6">
            <TabsTrigger 
              value="audio" 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all"
            >
              <Headphones className="w-5 h-5" />
              <span className="font-medium">المكتبة الصوتية</span>
            </TabsTrigger>
            <TabsTrigger 
              value="books" 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">المكتبة المقروءة</span>
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
        showBackToTop={showBackToTop}
        onScrollToTop={scrollToTop}
        onContactDeveloper={handleContactDeveloper}
      />

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
        reciterName={currentReciter.nameArabic}
        onTogglePlay={togglePlay}
        onPrevious={playPrevious}
        onNext={playNext}
        onSeek={seekTo}
        onToggleMute={toggleMute}
        onVolumeChange={changeVolume}
        onToggleRepeat={() => setIsRepeat(!isRepeat)}
        onRandom={playRandom}
        onClose={closePlayer}
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
