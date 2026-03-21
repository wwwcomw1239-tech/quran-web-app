'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Heart, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

type FilterType = 'all' | 'مكية' | 'مدنية';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  filteredCount: number;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  showFavorites,
  onToggleFavorites,
  favoritesCount,
  filteredCount,
}: SearchFilterProps) {
  const { t, isRTL } = useLanguage();

  const filterButtons: { type: FilterType; labelKey: 'all' | 'makki' | 'madani' }[] = [
    { type: 'all', labelKey: 'all' },
    { type: 'مكية', labelKey: 'makki' },
    { type: 'مدنية', labelKey: 'madani' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white h-12 rounded-xl ${isRTL ? 'pr-10' : 'pl-10'}`}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {filterButtons.map((btn) => (
            <Button
              key={btn.type}
              onClick={() => onFilterChange(btn.type)}
              variant={filter === btn.type ? 'default' : 'outline'}
              className={`h-10 px-4 rounded-xl ${
                filter === btn.type
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700'
              }`}
            >
              {t(btn.labelKey)}
            </Button>
          ))}

          {/* Favorites Button */}
          <Button
            onClick={onToggleFavorites}
            variant={showFavorites ? 'default' : 'outline'}
            className={`h-10 px-4 rounded-xl ${
              showFavorites
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'border-rose-200 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'} ${showFavorites ? 'fill-white' : ''}`} />
            {t('favorites')}
            {favoritesCount > 0 && (
              <Badge className={`${isRTL ? 'mr-1' : 'ml-1'} bg-white/20 text-white`}>
                {favoritesCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
        <BookOpen className={`w-4 h-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
        {t('displaying')} {filteredCount} {t('surah')}
      </div>
    </div>
  );
}
