'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { surahs, totalVerses, makkiCount, madaniCount, Surah } from '@/data/surahs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Star,
  Download,
  Repeat,
  Shuffle,
  X,
  ChevronDown,
  Loader2,
  Headphones,
} from 'lucide-react';

type FilterType = 'all' | 'مكية' | 'مدنية';

// Audio sources with multiple reciters and qualities
const audioSources = {
  minshawi: {
    name: 'محمد صديق المنشاوي',
    baseUrl: 'https://server8.mp3quran.net/minsh',
    quality: {
      high: '', // Original quality
      medium: '', // Same file - mp3quran provides one quality
    }
  },
  husary: {
    name: 'محمد صديق المنشاوي',
    baseUrl: 'https://server8.mp3quran.net/minsh',
    quality: {
      high: '',
      medium: '',
    }
  }
};

export default function QuranWebApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Get formatted audio URL
  const getAudioUrl = useCallback((surahId: number): string => {
    const paddedId = surahId.toString().padStart(3, '0');
    return `https://server8.mp3quran.net/minsh/${paddedId}.mp3`;
  }, []);

  // Play surah function
  const playSurah = useCallback((surah: Surah) => {
    if (currentSurah?.id === surah.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentSurah(surah);
      setIsLoading(true);
      setAudioError(null);
      
      if (audioRef.current) {
        const audioUrl = getAudioUrl(surah.id);
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
    }
  }, [currentSurah, isPlaying, getAudioUrl]);

  // Play next surah
  const playNext = useCallback(() => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
    if (currentIndex < surahs.length - 1) {
      playSurah(surahs[currentIndex + 1]);
    } else {
      playSurah(surahs[0]); // Loop to first surah
    }
  }, [currentSurah, playSurah]);

  // Play previous surah
  const playPrevious = useCallback(() => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
    if (currentIndex > 0) {
      playSurah(surahs[currentIndex - 1]);
    } else {
      playSurah(surahs[surahs.length - 1]); // Loop to last surah
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

  const handleDownload = (surah: Surah) => {
    setSelectedSurahForDownload(surah);
    setDownloadDialogOpen(true);
  };

  const downloadAudio = (quality: 'high' | 'medium') => {
    if (!selectedSurahForDownload) return;
    const audioUrl = getAudioUrl(selectedSurahForDownload.id);
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${selectedSurahForDownload.id.toString().padStart(3, '0')}_${selectedSurahForDownload.nameArabic}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadDialogOpen(false);
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
      <audio ref={audioRef} preload="auto" />

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
                <p className="text-emerald-100 text-sm">بصوت الشيخ محمد صديق المنشاوي</p>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-36">
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
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{currentSurah.nameEnglish}</p>
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
              </div>
            )}
            <div className="space-y-2">
              <Button
                onClick={() => downloadAudio('high')}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                <Download className="w-5 h-5 ml-2" />
                تنزيل بجودة عالية (128 kbps)
              </Button>
              <Button
                onClick={() => downloadAudio('medium')}
                variant="outline"
                className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-700"
              >
                <Download className="w-5 h-5 ml-2" />
                تنزيل بجودة متوسطة (64 kbps)
              </Button>
            </div>
            <p className="text-xs text-center text-slate-500">
              التلاوة بصوت الشيخ محمد صديق المنشاوي رحمه الله
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className={`text-center py-6 text-slate-500 dark:text-slate-400 text-sm ${currentSurah ? 'pb-36' : ''}`}>
        <p>القرآن الكريم - تلاوات الشيخ محمد صديق المنشاوي</p>
        <p className="mt-1">المصدر: mp3quran.net</p>
      </footer>
    </div>
  );
}
