'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { surahs, totalVerses, makkiCount, madaniCount, Surah } from '@/data/surahs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Repeat,
  Shuffle,
  X,
} from 'lucide-react';

type FilterType = 'all' | 'مكية' | 'مدنية';

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

  // Play surah function
  const playSurah = useCallback((surah: Surah) => {
    if (currentSurah?.id === surah.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentSurah(surah);
      setIsLoading(true);
      if (audioRef.current) {
        audioRef.current.src = surah.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [currentSurah, isPlaying]);

  // Play next surah
  const playNext = useCallback(() => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
    if (currentIndex < surahs.length - 1) {
      playSurah(surahs[currentIndex + 1]);
    }
  }, [currentSurah, playSurah]);

  // Play previous surah
  const playPrevious = useCallback(() => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
    if (currentIndex > 0) {
      playSurah(surahs[currentIndex - 1]);
    }
  }, [currentSurah, playSurah]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [isRepeat, playNext]);

  const togglePlay = () => {
    if (!audioRef.current || !currentSurah) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const seekTo = (value: number) => {
    if (!audioRef.current) return;
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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playRandom = () => {
    const randomIndex = Math.floor(Math.random() * surahs.length);
    playSurah(surahs[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white" dir="rtl">
      {/* Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30 mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent mb-4">
            القرآن الكريم
          </h1>
          <p className="text-emerald-200/80 text-lg mb-6">
            استمع إلى تلاوات الشيخ محمد صديق المنشاوي
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Card className="bg-white/5 backdrop-blur-sm border-emerald-500/20 px-6 py-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-100">{surahs.length} سورة</span>
              </div>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-emerald-500/20 px-6 py-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-emerald-100">{totalVerses.toLocaleString('ar-EG')} آية</span>
              </div>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-emerald-500/20 px-6 py-3">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-blue-300" />
                <span className="text-emerald-100">{makkiCount} مكية</span>
              </div>
            </Card>
            <Card className="bg-white/5 backdrop-blur-sm border-emerald-500/20 px-6 py-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-orange-400" />
                <span className="text-emerald-100">{madaniCount} مدنية</span>
              </div>
            </Card>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <Input
                placeholder="ابحث باسم السورة أو رقمها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-emerald-500/30 text-white placeholder:text-emerald-200/50 pr-10 h-12 rounded-xl focus:ring-2 focus:ring-emerald-400/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={`h-12 px-6 rounded-xl ${
                  filter === 'all'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-white/5 border-emerald-500/30 text-emerald-100 hover:bg-white/10'
                }`}
              >
                الكل
              </Button>
              <Button
                variant={filter === 'مكية' ? 'default' : 'outline'}
                onClick={() => setFilter('مكية')}
                className={`h-12 px-6 rounded-xl ${
                  filter === 'مكية'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white/5 border-emerald-500/30 text-emerald-100 hover:bg-white/10'
                }`}
              >
                <Moon className="w-4 h-4 ml-2" />
                مكية
              </Button>
              <Button
                variant={filter === 'مدنية' ? 'default' : 'outline'}
                onClick={() => setFilter('مدنية')}
                className={`h-12 px-6 rounded-xl ${
                  filter === 'مدنية'
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-white/5 border-emerald-500/30 text-emerald-100 hover:bg-white/10'
                }`}
              >
                <Sun className="w-4 h-4 ml-2" />
                مدنية
              </Button>
              <Button
                variant={showFavorites ? 'default' : 'outline'}
                onClick={() => setShowFavorites(!showFavorites)}
                className={`h-12 px-6 rounded-xl ${
                  showFavorites
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-white/5 border-emerald-500/30 text-emerald-100 hover:bg-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ml-2 ${showFavorites ? 'fill-current' : ''}`} />
                المفضلة
              </Button>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {currentSurah && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-emerald-500/30 p-4 z-50 shadow-2xl shadow-emerald-500/10">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col gap-4">
                {/* Progress Bar */}
                <div className="flex items-center gap-4">
                  <span className="text-xs text-emerald-300 w-12">{formatTime(currentTime)}</span>
                  <Progress
                    value={progress}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = ((rect.right - e.clientX) / rect.width) * 100;
                      seekTo(percent);
                    }}
                    className="flex-1 h-2 cursor-pointer bg-emerald-900/50 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-teal-400"
                  />
                  <span className="text-xs text-emerald-300 w-12">{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{currentSurah.nameArabic}</h3>
                      <p className="text-emerald-300 text-sm">{currentSurah.nameEnglish}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={playRandom}
                      className="text-emerald-300 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <Shuffle className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={playPrevious}
                      className="text-emerald-300 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={togglePlay}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/30"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                      className="text-emerald-300 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsRepeat(!isRepeat)}
                      className={`rounded-full ${isRepeat ? 'text-emerald-400 bg-emerald-500/20' : 'text-emerald-300 hover:text-white hover:bg-white/10'}`}
                    >
                      <Repeat className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-emerald-300 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => changeVolume(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-emerald-900/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentSurah(null)}
                      className="text-emerald-300 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-32">
          {filteredSurahs.map((surah) => (
            <Card
              key={surah.id}
              className={`group relative overflow-hidden transition-all duration-300 cursor-pointer ${
                currentSurah?.id === surah.id
                  ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 hover:bg-white/10 border-emerald-500/20 hover:border-emerald-400/40'
              } backdrop-blur-sm`}
              onClick={() => playSurah(surah)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Surah Number */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ${
                    surah.type === 'مكية'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                      : 'bg-gradient-to-br from-orange-500 to-orange-700'
                  }`}>
                    {surah.id}
                  </div>

                  {/* Surah Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold text-white">{surah.nameArabic}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(surah.id);
                        }}
                        className={`w-8 h-8 rounded-full ${
                          favorites.includes(surah.id)
                            ? 'text-rose-400 bg-rose-500/20'
                            : 'text-emerald-300/50 hover:text-rose-400 hover:bg-rose-500/10'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(surah.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <p className="text-emerald-300/80 text-sm mb-2">{surah.nameEnglish}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          surah.type === 'مكية'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-orange-500/20 text-orange-300'
                        }`}
                      >
                        {surah.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-300">
                        {surah.versesCount} آية
                      </Badge>
                    </div>
                  </div>

                  {/* Play Icon */}
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentSurah?.id === surah.id && isPlaying
                      ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                      : 'bg-white/10 opacity-0 group-hover:opacity-100'
                  }`}>
                    {currentSurah?.id === surah.id && isPlaying ? (
                      <div className="flex gap-0.5 items-end h-4">
                        <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
                        <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-75" />
                        <div className="w-1 h-3 bg-white rounded-full animate-pulse delay-150" />
                      </div>
                    ) : (
                      <Play className="w-5 h-5 text-white mr-[-2px]" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredSurahs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-emerald-400/50" />
            </div>
            <h3 className="text-xl text-emerald-200 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-emerald-300/60">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`text-center py-6 text-emerald-300/60 text-sm ${currentSurah ? 'pb-32' : ''}`}>
        <p>القرآن الكريم - تلاوات الشيخ محمد صديق المنشاوي</p>
        <p className="mt-1">جميع التلاوات من موقع mp3quran.net</p>
      </footer>
    </div>
  );
}
