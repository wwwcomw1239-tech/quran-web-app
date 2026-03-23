'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Play, 
  Trash2, 
  Download, 
  Headphones,
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getAllCachedAudio, 
  removeAudioFromCache, 
  getCacheStats,
  formatFileSize,
  CachedAudioMeta,
  debugCacheState,
} from '@/lib/audioCache';
import { useLanguage } from '@/lib/i18n';
import { useAudioPlayer } from '@/lib/AudioPlayerContext';

function DownloadsContent() {
  const { isRTL, direction } = useLanguage();
  const { 
    currentSurah, 
    isPlaying, 
    playFromCache,
    refreshCacheStats 
  } = useAudioPlayer();
  
  const [cachedAudio, setCachedAudio] = useState<CachedAudioMeta[]>([]);
  const [cacheStats, setCacheStats] = useState({ count: 0, totalSize: 0, formattedSize: '0 B' });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState<string | null>(null);

  // Load cached audio on mount
  useEffect(() => {
    loadCachedAudio();
  }, []);

  const loadCachedAudio = useCallback(async () => {
    setLoading(true);
    console.log('[Downloads] Loading cached audio...');
    
    // Debug: log current state
    debugCacheState();
    
    // Get cached audio from registry
    const cached = getAllCachedAudio();
    console.log('[Downloads] Found items:', cached.length, cached);
    
    // Sort by timestamp (newest first)
    const sorted = [...cached].sort((a, b) => b.timestamp - a.timestamp);
    setCachedAudio(sorted);
    
    // Get stats
    const stats = await getCacheStats();
    setCacheStats(stats);
    
    setLoading(false);
  }, []);

  const handlePlay = useCallback(async (item: CachedAudioMeta) => {
    setIsLoadingAudio(item.id);
    
    console.log('[Downloads] Attempting to play:', item.id);
    
    try {
      const success = await playFromCache({
        surahId: item.surahId,
        surahNameArabic: item.surahNameArabic,
        surahNameEnglish: item.surahNameEnglish,
        reciterId: item.reciterId,
        reciterNameArabic: item.reciterNameArabic,
        reciterNameEnglish: item.reciterNameEnglish,
      });
      
      setIsLoadingAudio(null);
      
      if (success) {
        toast.success(
          isRTL 
            ? `تشغيل: ${item.surahNameArabic}`
            : `Now playing: ${item.surahNameEnglish}`,
          { icon: <Volume2 className="w-4 h-4" /> }
        );
      } else {
        toast.error(
          isRTL ? 'فشل في تشغيل الملف الصوتي' : 'Failed to play audio file',
          {
            description: isRTL 
              ? 'قد يكون الملف تالفاً، حاول حذفه وإعادة تحميله' 
              : 'The file may be corrupted, try deleting and re-downloading'
          }
        );
      }
    } catch (error: any) {
      console.error('[Downloads] Play error:', error);
      setIsLoadingAudio(null);
      
      toast.error(
        isRTL ? 'حدث خطأ أثناء التشغيل' : 'An error occurred during playback',
        { description: error.message || String(error) }
      );
    }
  }, [playFromCache, isRTL]);

  const handleDelete = useCallback(async (item: CachedAudioMeta) => {
    setDeletingId(item.id);
    
    console.log('[Downloads] Deleting:', item.id);
    
    const success = await removeAudioFromCache(item.reciterId, item.surahId);
    console.log('[Downloads] Delete result:', success);
    
    if (success) {
      // Update UI immediately without reload
      setCachedAudio(prev => prev.filter(a => a.id !== item.id));
      const stats = await getCacheStats();
      setCacheStats(stats);
      refreshCacheStats();
      
      toast.success(
        isRTL ? 'تم حذف الملف بنجاح' : 'File deleted successfully'
      );
    } else {
      toast.error(
        isRTL ? 'فشل في حذف الملف' : 'Failed to delete file'
      );
    }
    
    setDeletingId(null);
  }, [isRTL, refreshCacheStats]);

  const handleClearAll = async () => {
    if (!confirm(isRTL ? 'هل تريد حذف جميع الملفات المحملة؟' : 'Delete all downloaded files?')) {
      return;
    }
    
    // Delete each item
    for (const item of cachedAudio) {
      await removeAudioFromCache(item.reciterId, item.surahId);
    }
    
    setCachedAudio([]);
    setCacheStats({ count: 0, totalSize: 0, formattedSize: '0 B' });
    refreshCacheStats();
    
    toast.success(
      isRTL ? 'تم حذف جميع الملفات' : 'All files deleted'
    );
  };

  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return isRTL 
      ? date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Check if this item is currently playing
  const isItemPlaying = (item: CachedAudioMeta) => {
    return currentSurah?.id === item.surahId && isPlaying;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black" dir={direction}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              <span className="font-medium">{isRTL ? 'الرئيسية' : 'Home'}</span>
            </Link>
            
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-6 h-6 text-emerald-500" />
              {isRTL ? 'تَنْزِيلَاتِي' : 'My Downloads'}
            </h1>
            
            <Button
              onClick={loadCachedAudio}
              variant="ghost"
              className="text-slate-600 dark:text-slate-400"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-36">
        {/* Stats Card */}
        {cachedAudio.length > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 mb-6 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {isRTL 
                      ? `${cacheStats.count} سورة محفوظة`
                      : `${cacheStats.count} surahs saved`
                    }
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isRTL 
                      ? `الحجم الإجمالي: ${cacheStats.formattedSize}`
                      : `Total size: ${cacheStats.formattedSize}`
                    }
                  </p>
                </div>
              </div>
              
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isRTL ? 'حَذْف الْكُل' : 'Clear All'}
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              {isRTL ? 'جاري التحميل...' : 'Loading...'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && cachedAudio.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
              <Download className="w-12 h-12 text-slate-400 dark:text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {isRTL ? 'لَا تُوجَدُ صَوْتِيَّاتٌ مُحَمَّلَةٌ بَعْد' : 'No downloaded audio yet'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-md">
              {isRTL 
                ? 'ابْدَأْ بِحِفْظِ السُّوَرِ لِلِاسْتِمَاعِ إِلَيْهَا بِدُونِ إِنْتَرْنِت مِنْ صَفْحَةِ الْمَكْتَبَةِ الصَّوْتِيَّة'
                : 'Start saving surahs for offline listening from the Audio Library'
              }
            </p>
            <Link href="/">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                <Headphones className="w-5 h-5" />
                {isRTL ? 'الذَّهَابُ لِلْمَكْتَبَةِ الصَّوْتِيَّة' : 'Go to Audio Library'}
              </Button>
            </Link>
          </div>
        )}

        {/* Downloads List */}
        {!loading && cachedAudio.length > 0 && (
          <div className="space-y-3">
            {cachedAudio.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Surah Number */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                    {item.surahId}
                  </div>
                  
                  {/* Surah Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {isRTL ? item.surahNameArabic : item.surahNameEnglish}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {isRTL ? item.reciterNameArabic : item.reciterNameEnglish}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 dark:text-slate-500">
                      <span>{formatFileSize(item.size)}</span>
                      <span>•</span>
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Play Button */}
                    <Button
                      onClick={() => handlePlay(item)}
                      className={`h-11 w-11 p-0 rounded-full ${
                        isItemPlaying(item)
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                      disabled={deletingId === item.id || isLoadingAudio === item.id}
                      title={isRTL ? 'تَشْغِيل' : 'Play'}
                    >
                      {isLoadingAudio === item.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isItemPlaying(item) ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <Play className="w-5 h-5" fill="currentColor" />
                      )}
                    </Button>
                    
                    {/* Delete Button */}
                    <Button
                      onClick={() => handleDelete(item)}
                      variant="outline"
                      className="h-11 w-11 p-0 rounded-full text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                      disabled={deletingId === item.id || isLoadingAudio === item.id}
                      title={isRTL ? 'حَذْف' : 'Delete'}
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Note */}
        {cachedAudio.length > 0 && (
          <div className="mt-6 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {isRTL 
                ? 'الْمَلَفَّاتُ الْمَحْفُوظَةُ تَبْقَى فِي جِهَازِكَ حَتَّى تَقُومَ بِحَذْفِهَا يَدَوِيًّا. يُمْكِنُكَ الِاسْتِمَاعُ إِلَيْهَا بِدُونِ إِنْتَرْنِت فِي أَيِّ وَقْت.'
                : 'Saved files stay on your device until you manually delete them. You can listen to them offline anytime.'
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DownloadsPage() {
  return <DownloadsContent />;
}
