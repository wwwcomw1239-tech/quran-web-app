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
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
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
            className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              isCurrentSurah
                ? 'ring-2 ring-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            <CardContent className="p-4">
              {/* Surah Header - Elegant Layout with Centered Name */}
              <div className={`flex items-center justify-between mb-3 min-h-[60px] ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                
                {/* Surah Number - Elegant styling on the right */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 transition-all duration-300 ${
                  isCurrentSurah
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-600 dark:text-slate-300'
                }`}>
                  {surah.id}
                </div>

                {/* Surah Info - Perfectly Centered with elegant typography */}
                <div className="flex-1 min-w-0 flex flex-col items-center justify-center px-3">
                  <h3 className={`font-bold text-slate-900 dark:text-white text-center ${
                    isRTL ? 'text-xl font-arabic' : 'text-base'
                  }`} style={isRTL ? { fontFamily: "'Tajawal', 'Cairo', 'Amiri', sans-serif" } : {}}>
                    {displayName}
                  </h3>
                  {isRTL && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      {surah.nameEnglish}
                    </p>
                  )}
                </div>

                {/* Favorite indicator - Left side */}
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                  {isFavorite && (
                    <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Surah Meta */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className={`text-xs font-medium ${
                    surah.type === 'مكية'
                      ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 dark:from-amber-900/50 dark:to-amber-800/30 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                      : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 dark:from-blue-900/50 dark:to-blue-800/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                  }`}
                >
                  {displayType}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                >
                  {surah.versesCount} {t('verse')}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Play/Pause Button */}
                <Button
                  onClick={() => onPlay(surah)}
                  className={`flex-1 h-11 rounded-xl transition-all duration-300 ${
                    isCurrentSurah && isPlaying
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                  }`}
                  disabled={isLoading && isCurrentSurah}
                >
                  {isLoading && isCurrentSurah ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isCurrentSurah && isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className={`w-5 h-5 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                  )}
                </Button>

                {/* Favorite Button */}
                <Button
                  onClick={() => onToggleFavorite(surah.id)}
                  variant="outline"
                  className={`h-11 w-11 p-0 rounded-xl transition-all duration-300 ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-300 dark:bg-rose-900/30 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/50'
                      : 'hover:bg-rose-50 dark:hover:bg-rose-900/20'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-all duration-300 ${
                      isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-400'
                    }`}
                  />
                </Button>

                {/* Download Button */}
                <Button
                  onClick={() => onDownload(surah)}
                  variant="outline"
                  className="h-11 w-11 p-0 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                >
                  <Download className="w-5 h-5 text-slate-400 hover:text-emerald-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
