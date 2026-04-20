'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Play, Search, X, BookOpen,
  Sparkles, Video,
  Star, Maximize2, Minimize2,
  Scroll, Baby, Heart, Tv
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ARABIC_VIDEOS, ENGLISH_VIDEOS, type KidsCategoryAr, type KidsCategoryEn, type KidsVideo } from '@/data/kids';

// ============================================
// CATEGORY CONFIG
// ============================================

interface CatConfig { icon: any; bgColor: string; emoji: string; descriptionAr: string; descriptionEn: string }

const KIDS_CATEGORY_CONFIG: Record<KidsCategoryAr, CatConfig & { enKey: KidsCategoryEn }> = {
  'قصص الأنبياء': { icon: BookOpen, bgColor: 'from-emerald-500 to-teal-600', emoji: '🌟', descriptionAr: 'قصص الأنبياء والرسل للأطفال', descriptionEn: 'Stories of the Prophets for Kids', enKey: 'Stories of the Prophets' },
  'قصص القرآن': { icon: Scroll, bgColor: 'from-blue-500 to-indigo-600', emoji: '📖', descriptionAr: 'قصص من القرآن الكريم للأطفال', descriptionEn: 'Stories from the Holy Quran for Kids', enKey: 'Quran Stories' },
  'قصص الحيوان في القرآن': { icon: Heart, bgColor: 'from-amber-500 to-orange-600', emoji: '🐪', descriptionAr: 'قصص الحيوانات المذكورة في القرآن', descriptionEn: 'Animal Stories mentioned in the Quran', enKey: 'Animal Stories from Quran' },
  'قصص الصحابة والتابعين': { icon: Star, bgColor: 'from-purple-500 to-fuchsia-600', emoji: '⭐', descriptionAr: 'قصص الصحابة والتابعين للأطفال', descriptionEn: 'Stories of the Companions for Kids', enKey: 'Companions Stories' },
  'أناشيد إسلامية بدون إيقاع': { icon: Sparkles, bgColor: 'from-rose-500 to-pink-600', emoji: '🎤', descriptionAr: 'أناشيد إسلامية بدون موسيقى', descriptionEn: 'Islamic Nasheeds without Music', enKey: 'Islamic Nasheeds (No Music)' },
  'تعليم القرآن للأطفال': { icon: Tv, bgColor: 'from-cyan-500 to-teal-600', emoji: '📚', descriptionAr: 'تعليم القرآن والتجويد للصغار', descriptionEn: 'Learn Quran & Tajweed for Kids', enKey: 'Learn Quran for Kids' },
  'آداب وأخلاق إسلامية': { icon: Baby, bgColor: 'from-lime-500 to-green-600', emoji: '🌿', descriptionAr: 'تعليم الآداب الإسلامية للأطفال', descriptionEn: 'Teaching Islamic Etiquette to Kids', enKey: 'Islamic Manners & Ethics' },
};


// ============================================
// COMPONENT
// ============================================

export function KidsVideos() {
  const { isRTL } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<KidsVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KidsCategoryAr | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Choose videos based on language
  const VIDEOS = useMemo(() => isRTL ? ARABIC_VIDEOS : ENGLISH_VIDEOS, [isRTL]);

  // Get unique sources
  const sources = useMemo(() => {
    return [...new Set(VIDEOS.map(v => isRTL ? v.sourceAr : v.sourceEn))].sort();
  }, [VIDEOS, isRTL]);

  const categories = useMemo(() => Object.keys(KIDS_CATEGORY_CONFIG) as KidsCategoryAr[], []);

  const getCategoryCount = useCallback((cat: KidsCategoryAr) => {
    return VIDEOS.filter(v => v.categoryAr === cat).length;
  }, [VIDEOS]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    let result = VIDEOS;
    if (selectedCategory !== 'all') {
      result = result.filter(v => v.categoryAr === selectedCategory);
    }
    if (selectedSource !== 'all') {
      result = result.filter(v => (isRTL ? v.sourceAr : v.sourceEn) === selectedSource);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => {
        const title = isRTL ? v.titleAr : v.titleEn;
        const source = isRTL ? v.sourceAr : v.sourceEn;
        const desc = isRTL ? (v.descriptionAr || '') : (v.descriptionEn || '');
        return title.toLowerCase().includes(q) || title.includes(searchQuery) ||
               source.toLowerCase().includes(q) || source.includes(searchQuery) ||
               desc.toLowerCase().includes(q);
      });
    }
    return result;
  }, [VIDEOS, selectedCategory, selectedSource, searchQuery, isRTL]);

  // Videos by category
  const videosByCategory = useMemo(() => {
    const map: Partial<Record<KidsCategoryAr, KidsVideo[]>> = {};
    for (const cat of categories) {
      const vids = VIDEOS.filter(v => v.categoryAr === cat);
      if (vids.length > 0) map[cat] = vids;
    }
    return map;
  }, [categories, VIDEOS]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;
    if (!isFullscreen) playerRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  // Reset filters on language change
  useEffect(() => {
    setActiveVideo(null);
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSource('all');
  }, [isRTL]);

  // ============================================
  // RENDER VIDEO PLAYER
  // ============================================

  const renderVideoPlayer = () => {
    if (!activeVideo) return null;
    const title = isRTL ? activeVideo.titleAr : activeVideo.titleEn;
    const source = isRTL ? activeVideo.sourceAr : activeVideo.sourceEn;

    return (
      <div ref={playerRef} className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
        <div className={`relative ${isFullscreen ? 'h-screen' : 'aspect-video'}`}>
          <iframe
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; playsinline"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="eager"
            // @ts-ignore - fetchpriority is a valid iframe attribute
            fetchpriority="high"
          />
        </div>
        <div className={`p-4 bg-gradient-to-t from-black/90 to-black/50 text-white ${isFullscreen ? 'absolute bottom-0 left-0 right-0' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{title}</h3>
              <p className="text-xs text-white/70 mt-0.5">{source}</p>
            </div>
            <div className={`flex gap-2 ${isRTL ? 'mr-2' : 'ml-2'}`}>
              <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition p-1">
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button onClick={() => setActiveVideo(null)} className="text-white/80 hover:text-white transition p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER VIDEO CARD
  // ============================================

  const renderVideoCard = (video: KidsVideo) => {
    const isActive = activeVideo?.id === video.id;
    const title = isRTL ? video.titleAr : video.titleEn;
    const source = isRTL ? video.sourceAr : video.sourceEn;
    const catConfig = KIDS_CATEGORY_CONFIG[video.categoryAr];
    const catLabel = isRTL ? video.categoryAr : video.categoryEn;

    return (
      <Card
        key={video.id}
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden border-0 shadow-md ${isActive ? 'ring-2 ring-orange-400 shadow-orange-200/50' : ''}`}
        onClick={() => setActiveVideo(video)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
            <img src={`https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/90 group-hover:bg-orange-500 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg">
                <Play className="w-5 h-5 text-white mr-[-2px]" fill="white" />
              </div>
            </div>
            {isActive && (
              <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'}`}>
                <Badge className="bg-orange-500 text-white text-[10px] px-2 py-0.5 animate-pulse">
                  {isRTL ? 'يعرض الآن' : 'Playing'}
                </Badge>
              </div>
            )}
            <div className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'}`}>
              <Badge className="bg-black/60 text-white text-[10px] px-2 py-0.5">
                {catConfig?.emoji} {catLabel}
              </Badge>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1 leading-tight">{title}</h3>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <Baby className="w-3 h-3 text-orange-500 dark:text-orange-400" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{source}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-bl from-orange-400 via-amber-500 to-yellow-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">🧒</div>
          <div>
            <h2 className="text-xl font-bold">{isRTL ? 'مقاطع الأطفال' : 'Kids Videos'}</h2>
            <p className="text-amber-100 text-sm">{isRTL ? 'قصص ومقاطع تعليمية مناسبة للأطفال' : 'Educational stories & videos for kids'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>{VIDEOS.length} {isRTL ? 'مقطع' : 'videos'}</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{Object.keys(videosByCategory).length} {isRTL ? 'تصنيف' : 'categories'}</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>{isRTL ? 'بدون موسيقى' : 'No Music'}</span>
          </div>
        </div>
      </div>

      {renderVideoPlayer()}

      {/* Search */}
      <div className="relative max-w-lg mx-auto">
        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
        <Input
          type="text"
          placeholder={isRTL ? 'ابحث بالعنوان أو المصدر...' : 'Search by title or source...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700`}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={`rounded-full px-4 py-1.5 h-auto text-sm ${selectedCategory === 'all' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}
          >
            {isRTL ? 'الكل' : 'All'} ({VIDEOS.length})
          </Button>
          {categories.map(cat => {
            const count = getCategoryCount(cat);
            if (count === 0) return null;
            const catInfo = KIDS_CATEGORY_CONFIG[cat];
            const label = isRTL ? cat : catInfo.enKey;
            return (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`rounded-full px-4 py-1.5 h-auto text-sm ${selectedCategory === cat ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}
              >
                {catInfo.emoji} {label} ({count})
              </Button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm min-w-[200px]"
          >
            <option value="all">{isRTL ? 'جميع المصادر' : 'All Sources'}</option>
            {sources.map(s => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all' || selectedSource !== 'all') && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {isRTL ? `عرض ${filteredVideos.length} مقطع` : `Showing ${filteredVideos.length} videos`}
        </p>
      )}

      {/* Videos Grid by Category */}
      {selectedCategory === 'all' && !searchQuery && selectedSource === 'all' ? (
        categories.map(category => {
          const categoryVideos = videosByCategory[category];
          if (!categoryVideos || categoryVideos.length === 0) return null;
          const catInfo = KIDS_CATEGORY_CONFIG[category];
          const CatIcon = catInfo.icon;
          const catLabel = isRTL ? category : catInfo.enKey;
          const catDesc = isRTL ? catInfo.descriptionAr : catInfo.descriptionEn;

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{catInfo.emoji} {catLabel}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{catDesc}</p>
                </div>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <Badge variant="outline" className="text-xs">{categoryVideos.length} {isRTL ? 'مقطع' : 'videos'}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryVideos.map(video => renderVideoCard(video))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVideos.map(video => renderVideoCard(video))}
        </div>
      )}

      {/* No results */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{isRTL ? 'لم يتم العثور على مقاطع مطابقة' : 'No matching videos found'}</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{isRTL ? 'جرب كلمات بحث مختلفة' : 'Try different search terms'}</p>
        </div>
      )}
    </div>
  );
}
