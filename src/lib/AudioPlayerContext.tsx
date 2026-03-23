'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { Surah } from '@/data/surahs';
import { reciters, getAudioUrl } from '@/data/reciters';
import {
  checkAudioInCache,
  getAudioFromCache,
  saveAudioOffline,
  removeAudioFromCache,
  getCacheStats,
  isCacheApiSupported,
} from '@/lib/audioCache';

// Bookmark utility
const BOOKMARK_KEY = 'quran-bookmarks';

const getBookmark = (reciterId: string, surahId: number): number | null => {
  try {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(BOOKMARK_KEY);
    if (!data) return null;
    const bookmarks = JSON.parse(data);
    const key = `${reciterId}-${surahId}`;
    return bookmarks[key]?.timestamp || null;
  } catch {
    return null;
  }
};

const saveBookmark = (reciterId: string, surahId: number, currentTime: number) => {
  try {
    const data = localStorage.getItem(BOOKMARK_KEY);
    const bookmarks = data ? JSON.parse(data) : {};
    const key = `${reciterId}-${surahId}`;
    bookmarks[key] = {
      reciterId,
      surahId,
      timestamp: currentTime,
      savedAt: Date.now()
    };
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    console.error('Error saving bookmark:', error);
    return false;
  }
};

// Cache stats type
interface CacheStats {
  count: number;
  totalSize: number;
  formattedSize: string;
}

// Context type
interface AudioPlayerContextType {
  // State
  currentSurah: Surah | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  selectedReciter: string;
  reciterName: string;
  isCached: boolean;
  isCaching: boolean;
  cacheProgress: number;
  cacheStats: CacheStats;
  quality: 'high' | 'low';
  playbackRate: number;
  favorites: number[];
  showFavorites: boolean;
  filter: 'all' | 'مكية' | 'مدنية';
  searchQuery: string;
  cachedBlobUrl: string | null;
  audioError: string | null;
  cacheSupported: boolean;

  // Actions
  playSurah: (surah: Surah) => Promise<void>;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (value: number) => void;
  seekForward: () => void;
  seekBackward: () => void;
  toggleMute: () => void;
  changeVolume: (value: number) => void;
  toggleRepeat: () => void;
  playRandom: () => void;
  closePlayer: () => void;
  toggleCache: () => Promise<void>;
  toggleFavorite: (surahId: number) => void;
  setShowFavorites: (show: boolean) => void;
  setFilter: (filter: 'all' | 'مكية' | 'مدنية') => void;
  setSearchQuery: (query: string) => void;
  setSelectedReciter: (reciterId: string) => void;
  setQuality: (quality: 'high' | 'low') => void;
  setPlaybackRate: (rate: number) => void;
  saveCurrentBookmark: () => void;
  refreshCacheStats: () => Promise<void>;
  
  // For downloads page - play from cached blob
  playFromCache: (item: {
    surahId: number;
    surahNameArabic: string;
    surahNameEnglish: string;
    reciterId: string;
    reciterNameArabic: string;
    reciterNameEnglish: string;
  }) => Promise<boolean>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

// Surahs data - import directly to avoid circular deps
import { surahs } from '@/data/surahs';

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  // Audio state
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Reciter state
  const [selectedReciter, setSelectedReciter] = useState<string>('minshawi');
  const [quality, setQuality] = useState<'high' | 'low'>('high');

  // Cache state
  const [isCached, setIsCached] = useState(false);
  const [isCaching, setIsCaching] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);
  const [cacheStats, setCacheStats] = useState<CacheStats>({ count: 0, totalSize: 0, formattedSize: '0 B' });
  const [cacheSupported, setCacheSupported] = useState(true);
  const [cachedBlobUrl, setCachedBlobUrl] = useState<string | null>(null);

  // UI state
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quran-favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [filter, setFilter] = useState<'all' | 'مكية' | 'مدنية'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get current reciter info
  const currentReciter = reciters.find(r => r.id === selectedReciter) || reciters[0];
  const reciterName = currentReciter.nameArabic;

  // Check cache support
  useEffect(() => {
    setCacheSupported(isCacheApiSupported());
  }, []);

  // Load cache stats
  const refreshCacheStats = useCallback(async () => {
    if (cacheSupported) {
      const stats = await getCacheStats();
      setCacheStats(stats);
    }
  }, [cacheSupported]);

  useEffect(() => {
    refreshCacheStats();
  }, [refreshCacheStats]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('quran-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Check cache status
  useEffect(() => {
    if (!currentSurah || !cacheSupported) {
      setIsCached(false);
      return;
    }
    const audioUrl = getAudioUrl(selectedReciter, currentSurah.id, quality);
    checkAudioInCache(audioUrl, selectedReciter, currentSurah.id).then(setIsCached);
  }, [currentSurah, selectedReciter, cacheSupported, quality]);

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (cachedBlobUrl) {
        URL.revokeObjectURL(cachedBlobUrl);
      }
    };
  }, [cachedBlobUrl]);

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
        playNextInternal();
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setAudioError('حدث خطأ في تحميل الصوت');
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
  }, [isRepeat]);

  // Play next surah (internal)
  const playNextInternal = useCallback(() => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
    if (currentIndex < surahs.length - 1) {
      playSurah(surahs[currentIndex + 1]);
    } else {
      playSurah(surahs[0]);
    }
  }, [currentSurah]);

  // Play surah
  const playSurah = useCallback(async (surah: Surah) => {
    // Toggle if same surah
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
      const audioUrl = getAudioUrl(selectedReciter, surah.id, quality);
      let playUrl = audioUrl;

      // Check cache first
      if (cacheSupported) {
        const inCache = await checkAudioInCache(audioUrl, selectedReciter, surah.id);
        setIsCached(inCache);

        if (inCache) {
          const result = await getAudioFromCache(audioUrl, selectedReciter, surah.id);
          if (result.url) {
            playUrl = result.url;
            setCachedBlobUrl(result.url);
            console.log('[Audio] Playing from cache:', surah.id);
          }
        } else {
          console.log('[Audio] Playing from network:', surah.id);
        }
      }

      audioRef.current.src = playUrl;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);

            // Resume from bookmark
            const savedBookmark = getBookmark(selectedReciter, surah.id);
            if (savedBookmark && audioRef.current && savedBookmark < audioRef.current.duration) {
              audioRef.current.currentTime = savedBookmark;
              console.log('[Audio] Resuming from bookmark:', savedBookmark);
            }
          })
          .catch((error) => {
            console.error('Audio play error:', error);
            setAudioError('حدث خطأ في تشغيل الصوت');
            setIsLoading(false);
            setIsPlaying(false);
          });
      }
    }
  }, [currentSurah, isPlaying, selectedReciter, quality, cacheSupported, cachedBlobUrl, playbackRate]);

  // Play from cache (for downloads page)
  const playFromCache = useCallback(async (item: {
    surahId: number;
    surahNameArabic: string;
    surahNameEnglish: string;
    reciterId: string;
    reciterNameArabic: string;
    reciterNameEnglish: string;
  }): Promise<boolean> => {
    try {
      // Find the surah
      const surah = surahs.find(s => s.id === item.surahId);
      if (!surah) {
        console.error('[Audio] Surah not found:', item.surahId);
        return false;
      }

      // Get from cache
      const audioUrl = getAudioUrl(item.reciterId, item.surahId, quality);
      const result = await getAudioFromCache(audioUrl, item.reciterId, item.surahId);

      if (!result.url) {
        console.error('[Audio] Failed to get from cache:', result.error);
        return false;
      }

      // Clean up old blob URL
      if (cachedBlobUrl) {
        URL.revokeObjectURL(cachedBlobUrl);
      }
      setCachedBlobUrl(result.url);

      // Update state
      setCurrentSurah(surah);
      setSelectedReciter(item.reciterId);
      setIsCached(true);
      setIsLoading(true);
      setAudioError(null);

      // Play
      if (audioRef.current) {
        audioRef.current.src = result.url;
        audioRef.current.load();
        audioRef.current.playbackRate = playbackRate;

        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[Audio] playFromCache error:', error);
      setIsLoading(false);
      return false;
    }
  }, [cachedBlobUrl, playbackRate, quality]);

  // Toggle play
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSurah) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  }, [currentSurah, isPlaying]);

  // Play next
  const playNext = useCallback(() => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
    if (currentIndex < surahs.length - 1) {
      playSurah(surahs[currentIndex + 1]);
    } else {
      playSurah(surahs[0]);
    }
  }, [currentSurah, playSurah]);

  // Play previous
  const playPrevious = useCallback(() => {
    if (!currentSurah) return;
    const currentIndex = surahs.findIndex((s) => s.id === currentSurah.id);
    if (currentIndex > 0) {
      playSurah(surahs[currentIndex - 1]);
    } else {
      playSurah(surahs[surahs.length - 1]);
    }
  }, [currentSurah, playSurah]);

  // Seek
  const seekTo = useCallback((value: number) => {
    if (!audioRef.current || !duration) return;
    const newTime = (value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(value);
  }, [duration]);

  // Seek forward 10s
  const seekForward = useCallback(() => {
    if (!audioRef.current || !duration) return;
    const newTime = Math.min(audioRef.current.currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
  }, [duration]);

  // Seek backward 10s
  const seekBackward = useCallback(() => {
    if (!audioRef.current) return;
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Change volume
  const changeVolume = useCallback((value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
    setVolume(value);
  }, []);

  // Toggle repeat
  const toggleRepeat = useCallback(() => {
    setIsRepeat(prev => !prev);
  }, []);

  // Play random
  const playRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * surahs.length);
    playSurah(surahs[randomIndex]);
  }, [playSurah]);

  // Close player
  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
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
  }, [cachedBlobUrl]);

  // Toggle cache
  const toggleCache = useCallback(async () => {
    if (!currentSurah || !cacheSupported || isCaching) return;

    const audioUrl = getAudioUrl(selectedReciter, currentSurah.id, quality);

    if (isCached) {
      const success = await removeAudioFromCache(selectedReciter, currentSurah.id);
      if (success) {
        setIsCached(false);
        if (cachedBlobUrl) {
          URL.revokeObjectURL(cachedBlobUrl);
          setCachedBlobUrl(null);
        }
        refreshCacheStats();
      }
    } else {
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
        refreshCacheStats();
      } else {
        let errorMessage = 'حدث خطأ أثناء الحفظ';
        if (result.error === 'storage_full') {
          errorMessage = 'مساحة التخزين ممتلئة. احذف بعض الملفات المحفوظة.';
        }
        alert(errorMessage);
      }
    }
  }, [currentSurah, selectedReciter, isCached, isCaching, cacheSupported, cachedBlobUrl, currentReciter, quality, refreshCacheStats]);

  // Toggle favorite
  const toggleFavorite = useCallback((surahId: number) => {
    setFavorites((prev) =>
      prev.includes(surahId) ? prev.filter((f) => f !== surahId) : [...prev, surahId]
    );
  }, []);

  // Save current bookmark
  const saveCurrentBookmark = useCallback(() => {
    if (!currentSurah || !selectedReciter || !currentTime) return;
    saveBookmark(selectedReciter, currentSurah.id, currentTime);
  }, [currentSurah, selectedReciter, currentTime]);

  // Handle quality change
  const handleSetQuality = useCallback((newQuality: 'high' | 'low') => {
    setQuality(newQuality);
    // Reload audio if playing
    if (audioRef.current && currentSurah && isPlaying) {
      const savedTime = audioRef.current.currentTime;
      
      if (cachedBlobUrl) {
        URL.revokeObjectURL(cachedBlobUrl);
        setCachedBlobUrl(null);
      }

      const audioUrl = getAudioUrl(selectedReciter, currentSurah.id, newQuality);
      
      const reloadWithNewQuality = async () => {
        let playUrl = audioUrl;

        if (cacheSupported) {
          const inCache = await checkAudioInCache(audioUrl, selectedReciter, currentSurah.id);
          setIsCached(inCache);

          if (inCache) {
            const result = await getAudioFromCache(audioUrl, selectedReciter, currentSurah.id);
            if (result.url) {
              playUrl = result.url;
              setCachedBlobUrl(result.url);
            }
          }
        }

        if (audioRef.current) {
          audioRef.current.src = playUrl;
          audioRef.current.load();
          audioRef.current.playbackRate = playbackRate;

          audioRef.current.play()
            .then(() => {
              setIsLoading(false);
              if (audioRef.current && savedTime > 0) {
                audioRef.current.currentTime = savedTime;
              }
            })
            .catch((error) => {
              console.error('Error reloading audio with new quality:', error);
              setIsPlaying(false);
            });
        }
      };

      setIsLoading(true);
      reloadWithNewQuality();
    }
  }, [currentSurah, isPlaying, selectedReciter, cacheSupported, cachedBlobUrl, playbackRate]);

  // Handle playback rate change
  const handleSetPlaybackRate = useCallback((rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  // Handle reciter change
  const handleSetSelectedReciter = useCallback((reciterId: string) => {
    setSelectedReciter(reciterId);
    
    // Reload audio if playing
    if (audioRef.current && currentSurah) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);

      if (cachedBlobUrl) {
        URL.revokeObjectURL(cachedBlobUrl);
        setCachedBlobUrl(null);
      }

      const audioUrl = getAudioUrl(reciterId, currentSurah.id, quality);
      audioRef.current.src = audioUrl;
      audioRef.current.load();

      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(console.error);
    }
  }, [currentSurah, cachedBlobUrl, quality]);

  const value: AudioPlayerContextType = {
    // State
    currentSurah,
    isPlaying,
    isLoading,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat,
    selectedReciter,
    reciterName,
    isCached,
    isCaching,
    cacheProgress,
    cacheStats,
    quality,
    playbackRate,
    favorites,
    showFavorites,
    filter,
    searchQuery,
    cachedBlobUrl,
    audioError,
    cacheSupported,

    // Actions
    playSurah,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    seekForward,
    seekBackward,
    toggleMute,
    changeVolume,
    toggleRepeat,
    playRandom,
    closePlayer,
    toggleCache,
    toggleFavorite,
    setShowFavorites,
    setFilter,
    setSearchQuery,
    setSelectedReciter: handleSetSelectedReciter,
    setQuality: handleSetQuality,
    setPlaybackRate: handleSetPlaybackRate,
    saveCurrentBookmark,
    refreshCacheStats,
    playFromCache,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {/* Global Audio Element */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}

export { AudioPlayerContext };
