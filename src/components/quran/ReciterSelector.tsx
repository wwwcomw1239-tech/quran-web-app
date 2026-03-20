'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Headphones, User, Check } from 'lucide-react';
import { reciters, Reciter } from '@/data/reciters';
import { useLanguage } from '@/lib/i18n';

interface ReciterSelectorProps {
  selectedReciter: string;
  onSelectReciter: (reciterId: string) => void;
}

export function ReciterSelector({ selectedReciter, onSelectReciter }: ReciterSelectorProps) {
  const { t, isRTL } = useLanguage();
  const [reciterSearchQuery, setReciterSearchQuery] = useState('');
  const [reciterDialogOpen, setReciterDialogOpen] = useState(false);

  // Get selected reciter info
  const currentReciter = useMemo(() => {
    return reciters.find(r => r.id === selectedReciter) || reciters[0];
  }, [selectedReciter]);

  // Filter reciters based on search query
  const filteredReciters = useMemo(() => {
    if (!reciterSearchQuery.trim()) return reciters;
    const query = reciterSearchQuery.toLowerCase();
    return reciters.filter(r =>
      r.nameArabic.includes(reciterSearchQuery) ||
      r.nameEnglish.toLowerCase().includes(query)
    );
  }, [reciterSearchQuery]);

  const handleSelectReciter = (reciterId: string) => {
    onSelectReciter(reciterId);
    setReciterDialogOpen(false);
    setReciterSearchQuery('');
  };

  // Get display name based on language
  const displayName = isRTL ? currentReciter.nameArabic : currentReciter.nameEnglish;
  const displaySubName = isRTL ? currentReciter.nameEnglish : currentReciter.nameArabic;

  return (
    <>
      {/* Reciter Selection Card */}
      <div className="bg-gradient-to-l from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-2xl shadow-lg p-5 mb-6 border border-emerald-200 dark:border-emerald-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="font-bold text-slate-900 dark:text-white">{t('selectReciter')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{reciters.length} {isRTL ? 'قارئ متاح' : 'reciters available'}</p>
            </div>
          </div>

          {/* Searchable Reciter Button */}
          <Button
            onClick={() => setReciterDialogOpen(true)}
            className={`w-full sm:w-72 h-12 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl justify-between px-4 hover:bg-emerald-50 dark:hover:bg-slate-700 ${isRTL ? 'flex-row-reverse' : ''}`}
            variant="outline"
          >
            <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
              <span className="font-bold text-slate-900 dark:text-white">{displayName}</span>
              <span className="text-xs text-slate-500">{displaySubName}</span>
            </div>
            <Search className={`w-4 h-4 text-slate-400 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>

        {/* Current Reciter Info */}
        <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isRTL ? 'يتم الاستماع الآن بصوت' : 'Now listening to'}
              </p>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">{currentReciter.nameArabic}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Searchable Reciter Dialog */}
      <Dialog open={reciterDialogOpen} onOpenChange={setReciterDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">{t('selectReciter')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
              <Input
                placeholder={isRTL ? 'ابحث باسم القارئ...' : 'Search by reciter name...'}
                value={reciterSearchQuery}
                onChange={(e) => setReciterSearchQuery(e.target.value)}
                className={`bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white h-12 rounded-xl ${isRTL ? 'pr-10' : 'pl-10'}`}
                autoFocus
              />
            </div>

            {/* Reciters List */}
            <div className="max-h-96 overflow-y-auto space-y-1" dir={isRTL ? 'rtl' : 'ltr'}>
              {filteredReciters.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>{isRTL ? 'لم يتم العثور على نتائج' : 'No results found'}</p>
                </div>
              ) : (
                filteredReciters.map((reciter) => (
                  <ReciterItem
                    key={reciter.id}
                    reciter={reciter}
                    isSelected={selectedReciter === reciter.id}
                    onSelect={() => handleSelectReciter(reciter.id)}
                    isRTL={isRTL}
                  />
                ))
              )}
            </div>

            <p className="text-xs text-center text-slate-500">
              {filteredReciters.length} {isRTL ? 'من' : 'of'} {reciters.length} {isRTL ? 'قارئ' : 'reciters'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ReciterItemProps {
  reciter: Reciter;
  isSelected: boolean;
  onSelect: () => void;
  isRTL: boolean;
}

function ReciterItem({ reciter, isSelected, onSelect, isRTL }: ReciterItemProps) {
  const displayName = isRTL ? reciter.nameArabic : reciter.nameEnglish;
  const displaySubName = isRTL ? reciter.nameEnglish : reciter.nameArabic;

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isRTL ? 'text-right flex-row-reverse' : 'text-left'} ${
        isSelected
          ? 'bg-emerald-100 dark:bg-emerald-900 border-2 border-emerald-500'
          : 'bg-slate-50 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 border-2 border-transparent'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isSelected
          ? 'bg-emerald-500 text-white'
          : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
      }`}>
        {isSelected ? (
          <Check className="w-5 h-5" />
        ) : (
          <User className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-bold text-slate-900 dark:text-white">{displayName}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{displaySubName}</p>
      </div>
    </button>
  );
}
