'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Heart, BookOpen } from 'lucide-react';

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
  const filterButtons: { type: FilterType; label: string }[] = [
    { type: 'all', label: 'الكل' },
    { type: 'مكية', label: 'مكية' },
    { type: 'مدنية', label: 'مدنية' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 sticky top-4 z-40">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="ابحث باسم السورة أو رقمها..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white pr-10 h-12 rounded-xl"
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
              {btn.label}
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
            <Heart className={`w-4 h-4 ml-1 ${showFavorites ? 'fill-white' : ''}`} />
            المفضلة
            {favoritesCount > 0 && (
              <Badge className="mr-1 bg-white/20 text-white">
                {favoritesCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
        <BookOpen className="w-4 h-4 inline ml-1" />
        عرض {filteredCount} سورة
      </div>
    </div>
  );
}
