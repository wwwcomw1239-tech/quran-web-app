'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Heart, Download, Loader2 } from 'lucide-react';
import { Surah } from '@/data/surahs';
import { useLanguage } from '@/lib/i18n';

interface SurahListProps {
  surahs: Surah[];
  currentSurahId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  favorites: number[];
  onPlay: (surah: Surah) => void;
  onToggleFavorite: (surahId: number) => void;
  onDownload: (surah: Surah) => void;
}

export function SurahList({
  surahs,
  currentSurahId,
  isPlaying,
  isLoading,
  favorites,
  onPlay,
  onToggleFavorite,
  onDownload,
}: SurahListProps) {
  const { t, isRTL } = useLanguage();

  if (surahs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-4xl">📖</span>
        </div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
          {t('noResults')}
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          {t('tryDifferent')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {surahs.map((surah) => {
        const isCurrentSurah = currentSurahId === surah.id;
        const isFavorite = favorites.includes(surah.id);

        // Get display names based on language
        const displayName = isRTL ? surah.nameArabic : surah.nameEnglish;
        const displayType = surah.type === 'مكية' ? t('makki') : t('madani');

        return (
          <Card
            key={surah.id}
            className={`group overflow-hidden transition-all duration-300 hover:shadow-xl ${
              isCurrentSurah
                ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                : 'bg-white dark:bg-slate-800'
            }`}
          >
            <CardContent className="p-4">
              {/* Surah Header - New Layout */}
              <div className="flex items-center justify-between mb-3 min-h-[52px]">
                {/* Surah Number - Far Right */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                  isCurrentSurah
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {surah.id}
                </div>

                {/* Surah Info - Centered */}
                <div className="flex-1 min-w-0 flex flex-col items-center justify-center px-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-center truncate text-lg">
                    {displayName}
                  </h3>
                  {isRTL && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {surah.nameEnglish}
                    </p>
                  )}
                </div>

                {/* Spacer for balance - Left side */}
                <div className="w-12 h-12 flex-shrink-0" />
              </div>

              {/* Surah Meta */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    surah.type === 'مكية'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  }`}
                >
                  {displayType}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {surah.versesCount} {t('verse')}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Play/Pause Button */}
                <Button
                  onClick={() => onPlay(surah)}
                  className={`flex-1 h-10 rounded-xl ${
                    isCurrentSurah && isPlaying
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-emerald-500 hover:bg-emerald-600'
                  } text-white`}
                  disabled={isLoading && isCurrentSurah}
                >
                  {isLoading && isCurrentSurah ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isCurrentSurah && isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>

                {/* Favorite Button */}
                <Button
                  onClick={() => onToggleFavorite(surah.id)}
                  variant="outline"
                  className={`h-10 w-10 p-0 rounded-xl ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/30 dark:border-rose-700'
                      : ''
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                    }`}
                  />
                </Button>

                {/* Download Button */}
                <Button
                  onClick={() => onDownload(surah)}
                  variant="outline"
                  className="h-10 w-10 p-0 rounded-xl"
                >
                  <Download className="w-5 h-5 text-slate-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
