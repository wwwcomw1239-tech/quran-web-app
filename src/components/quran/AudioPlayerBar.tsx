'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  X,
  Loader2,
  Download,
  WifiOff,
  Trash2,
  Rewind,
  FastForward,
  Bookmark,
} from 'lucide-react';
import { Surah } from '@/data/surahs';
import { useLanguage } from '@/lib/i18n';

// Bookmark utility functions
const BOOKMARK_KEY = 'quran-bookmarks';

const saveBookmark = (reciterId: string, surahId: number, currentTime: number) => {
  try {
    const bookmarks = getBookmarks();
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

const getBookmark = (reciterId: string, surahId: number): number | null => {
  try {
    const bookmarks = getBookmarks();
    const key = `${reciterId}-${surahId}`;
    return bookmarks[key]?.timestamp || null;
  } catch {
    return null;
  }
};

const getBookmarks = (): Record<string, { reciterId: string; surahId: number; timestamp: number; savedAt: number }> => {
  try {
    const data = localStorage.getItem(BOOKMARK_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

interface AudioPlayerBarProps {
  currentSurah: Surah | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  reciterId: string;
  reciterName: string;
  isCached?: boolean;
  isCaching?: boolean;
  cacheProgress?: number;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (value: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
  onToggleRepeat: () => void;
  onRandom: () => void;
  onClose: () => void;
  onToggleCache?: () => void;
  onSeekForward?: () => void;
  onSeekBackward?: () => void;
  onPlaybackRateChange?: (rate: number) => void;
  playbackRate?: number;
}

export function AudioPlayerBar({
  currentSurah,
  isPlaying,
  isLoading,
  progress,
  currentTime,
  duration,
  volume,
  isMuted,
  isRepeat,
  reciterId,
  reciterName,
  isCached = false,
  isCaching = false,
  cacheProgress = 0,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onToggleMute,
  onVolumeChange,
  onToggleRepeat,
  onRandom,
  onClose,
  onToggleCache,
  onSeekForward,
  onSeekBackward,
  onPlaybackRateChange,
  playbackRate = 1,
}: AudioPlayerBarProps) {
  const { isRTL, t } = useLanguage();
  const progressRef = useRef<HTMLDivElement>(null);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hasBookmark, setHasBookmark] = useState(false);

  const playbackRates = [1, 1.25, 1.5, 2];

  // Check if there's a saved bookmark for this surah
  useEffect(() => {
    if (currentSurah && reciterId) {
      const bookmark = getBookmark(reciterId, currentSurah.id);
      setHasBookmark(bookmark !== null);
    } else {
      setHasBookmark(false);
    }
  }, [currentSurah, reciterId]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    onSeek(newProgress);
  };

  const handleSaveBookmark = () => {
    if (!currentSurah || !reciterId || !currentTime) return;
    const success = saveBookmark(reciterId, currentSurah.id, currentTime);
    if (success) {
      setHasBookmark(true);
    }
  };

  if (!currentSurah) return null;

  // Get display name based on language
  const displayName = isRTL ? currentSurah.nameArabic : currentSurah.nameEnglish;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800 shadow-2xl z-50">
      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="h-1 bg-slate-200 dark:bg-slate-800 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-emerald-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mobile-First Two-Row Layout */}
      <div className="px-3 py-2 sm:px-4 sm:py-3">
        {/* Row 1: Surah Info - Full width, horizontal layout */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-0">
          {/* Surah Info Container */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate">
              {displayName}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate hidden sm:inline">
              - {reciterName}
            </span>
            {/* Cached indicator */}
            {isCached && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex-shrink-0">
                <WifiOff className="w-3 h-3" />
                <span className="hidden sm:inline">{isRTL ? 'محفوظ' : 'Offline'}</span>
              </span>
            )}
          </div>

          {/* Timer - Always visible */}
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono flex-shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Row 2: All Controls - Horizontal scrollable on mobile */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {/* Main Playback Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Rewind -10s */}
            {onSeekBackward && (
              <Button
                onClick={onSeekBackward}
                variant="ghost"
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
                title={isRTL ? 'ترجيع 10 ثواني' : 'Rewind 10s'}
              >
                <div className="relative">
                  <Rewind className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] font-bold">10</span>
                </div>
              </Button>
            )}

            {/* Previous */}
            <Button
              onClick={isRTL ? onNext : onPrevious}
              variant="ghost"
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Play/Pause */}
            <Button
              onClick={onTogglePlay}
              className="h-11 w-11 sm:h-12 sm:w-12 p-0 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex-shrink-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </Button>

            {/* Next */}
            <Button
              onClick={isRTL ? onPrevious : onNext}
              variant="ghost"
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Fast Forward +10s */}
            {onSeekForward && (
              <Button
                onClick={onSeekForward}
                variant="ghost"
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
                title={isRTL ? 'تقديم 10 ثواني' : 'Forward 10s'}
              >
                <div className="relative">
                  <FastForward className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] sm:text-[8px] font-bold">10</span>
                </div>
              </Button>
            )}
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Playback Speed Control */}
            {onPlaybackRateChange && (
              <div className="relative">
                <Button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  variant="ghost"
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex-shrink-0"
                  title={isRTL ? 'سرعة التشغيل' : 'Playback Speed'}
                >
                  {playbackRate}x
                </Button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-[60] min-w-[60px]">
                    {playbackRates.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          onPlaybackRateChange(rate);
                          setShowSpeedMenu(false);
                        }}
                        className={`block w-full px-3 py-1.5 text-sm text-center hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          playbackRate === rate 
                            ? 'text-emerald-600 dark:text-emerald-400 font-medium' 
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookmark Button */}
            <Button
              onClick={handleSaveBookmark}
              variant={hasBookmark ? 'default' : 'ghost'}
              className={`h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full flex-shrink-0 ${
                hasBookmark
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isRTL ? 'حفظ مكان التوقف' : 'Save position'}
            >
              <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${hasBookmark ? 'fill-current' : ''}`} />
            </Button>

            {/* Offline Download/Delete Button */}
            {onToggleCache && (
              <Button
                onClick={onToggleCache}
                variant={isCached ? 'destructive' : 'ghost'}
                disabled={isCaching}
                className={`h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full relative flex-shrink-0 ${
                  isCached
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isCached 
                  ? (isRTL ? 'إزالة من الذاكرة' : 'Remove from offline')
                  : (isRTL ? 'حفظ للاستماع بدون إنترنت' : 'Save for offline')
                }
              >
                {isCaching ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    {/* Progress ring */}
                    <svg className="absolute inset-0 w-9 h-9 sm:w-10 sm:h-10 -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${cacheProgress * 2.83} 283`}
                        className="text-emerald-400"
                      />
                    </svg>
                  </>
                ) : isCached ? (
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            )}

            {/* Repeat */}
            <Button
              onClick={onToggleRepeat}
              variant={isRepeat ? 'default' : 'ghost'}
              className={`h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full flex-shrink-0 ${
                isRepeat 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Random */}
            <Button
              onClick={onRandom}
              variant="ghost"
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0 hidden sm:flex"
            >
              <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Volume - Desktop only */}
            <div className="hidden md:flex items-center gap-1">
              <Button
                onClick={onToggleMute}
                variant="ghost"
                className="h-9 w-9 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1 accent-emerald-500"
              />
            </div>

            {/* Close */}
            <Button
              onClick={onClose}
              variant="ghost"
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
