'use client';

import { useRef } from 'react';
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
  Check,
  WifiOff,
  Trash2,
} from 'lucide-react';
import { Surah } from '@/data/surahs';
import { useLanguage } from '@/lib/i18n';

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
}: AudioPlayerBarProps) {
  const { isRTL, t } = useLanguage();
  const progressRef = useRef<HTMLDivElement>(null);

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

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Surah Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white truncate">
                {displayName}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                - {reciterName}
              </span>
              {/* Cached indicator */}
              {isCached && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                  <WifiOff className="w-3 h-3" />
                  <span className="hidden sm:inline">{isRTL ? 'محفوظ' : 'Offline'}</span>
                </span>
              )}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-2">
            {/* Previous - swap icons for RTL */}
            <Button
              onClick={isRTL ? onNext : onPrevious}
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            {/* Play/Pause */}
            <Button
              onClick={onTogglePlay}
              className="h-12 w-12 p-0 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>

            {/* Next - swap icons for RTL */}
            <Button
              onClick={isRTL ? onPrevious : onNext}
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center gap-1">
            {/* Offline Download/Delete Button */}
            {onToggleCache && (
              <Button
                onClick={onToggleCache}
                variant={isCached ? 'destructive' : 'ghost'}
                disabled={isCaching}
                className={`h-8 w-8 p-0 rounded-full relative ${
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
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {/* Progress ring */}
                    <svg className="absolute inset-0 w-8 h-8 -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${cacheProgress * 0.88} 88`}
                        className="text-emerald-400"
                      />
                    </svg>
                  </>
                ) : isCached ? (
                  <Trash2 className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Repeat */}
            <Button
              onClick={onToggleRepeat}
              variant={isRepeat ? 'default' : 'ghost'}
              className={`h-8 w-8 p-0 rounded-full ${
                isRepeat 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </Button>

            {/* Random */}
            <Button
              onClick={onRandom}
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Shuffle className="w-4 h-4" />
            </Button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-1">
              <Button
                onClick={onToggleMute}
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              className="h-8 w-8 p-0 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
