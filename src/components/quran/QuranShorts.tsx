'use client';

import { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play, ChevronUp, ChevronDown, Heart, Share2, X,
  Sparkles, User, BookOpen, Lightbulb,
  Settings, Maximize2, Minimize2,
  Search, RefreshCw, AlertCircle,
  Flame, Star, Bookmark, SkipForward,
  ListVideo, ChevronRight, ChevronLeft, Pause,
  Eye, Clock, Hash, Layers
} from 'lucide-react';
import { SERIES, QURAN_SHORTS, type ShortCategory, type QuranShort, type Series } from '@/data/shorts';
import { SHORTS_CHANNELS } from '@/data/shorts-channels';
import {
  getCachedDuration, getVideoDurationsBatch, isShort, isAvailable,
  fetchMultiChannelShorts, type ChannelShort,
} from '@/lib/videoDuration';

type VideoQuality = '360p' | '480p' | '720p' | '1080p';

// ============================================
// CATEGORY CONFIG
// ============================================

const SHORT_CATEGORY_CONFIG: Record<ShortCategory, { icon: any; color: string; gradient: string; emoji: string }> = {
  'مواعظ قرآنية': { icon: Flame, color: 'text-orange-400', gradient: 'from-orange-500 to-red-600', emoji: '🔥' },
  'تدبرات': { icon: Lightbulb, color: 'text-yellow-400', gradient: 'from-yellow-500 to-amber-600', emoji: '💡' },
  'قصص مؤثرة': { icon: BookOpen, color: 'text-blue-400', gradient: 'from-blue-500 to-indigo-600', emoji: '📖' },
  'فوائد قرآنية': { icon: Star, color: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-600', emoji: '⭐' },
  'أسرار القرآن': { icon: Sparkles, color: 'text-purple-400', gradient: 'from-purple-500 to-fuchsia-600', emoji: '✨' },
  'خواطر إيمانية': { icon: Heart, color: 'text-rose-400', gradient: 'from-rose-500 to-pink-600', emoji: '❤️' },
};

const QUALITY_OPTIONS: { value: VideoQuality; label: string; description: string }[] = [
  { value: '360p', label: '360p', description: 'اقتصادي - إنترنت ضعيف' },
  { value: '480p', label: '480p', description: 'متوسط - إنترنت عادي' },
  { value: '720p', label: '720p HD', description: 'عالي الجودة' },
  { value: '1080p', label: '1080p Full HD', description: 'أعلى جودة' },
];


// ============================================
// LAZY THUMBNAIL COMPONENT
// ============================================

const LazyThumbnail = memo(function LazyThumbnail({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin: '200px' });
    obs.observe(imgRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="w-full h-full bg-slate-800">
      {inView && (
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
      {(!inView || !loaded) && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 animate-pulse" />
      )}
    </div>
  );
});

// ============================================
// VIEW MODES
// ============================================

type ViewMode = 'shorts' | 'series' | 'browse';

// ============================================
// MAIN COMPONENT
// ============================================

export function QuranShorts() {
  const [viewMode, setViewMode] = useState<ViewMode>('shorts');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ShortCategory | 'all'>('all');
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loadedCount, setLoadedCount] = useState(20);
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());
  const [longVideoIds, setLongVideoIds] = useState<Set<string>>(new Set());
  const [durationMap, setDurationMap] = useState<Record<string, number>>({});
  const [dynamicShorts, setDynamicShorts] = useState<QuranShort[]>([]);
  const [isLoadingMoreShorts, setIsLoadingMoreShorts] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MAX_SHORT_SECONDS = 75; // أي فيديو أطول من 75 ثانية يُعد غير مناسب للشورتس

  // قاعدة المقاطع = الثابتة + الديناميكية المُحمّلة
  const ALL_SHORTS = useMemo<QuranShort[]>(() => {
    // إزالة التكرار بناءً على youtubeId
    const seen = new Set<string>();
    const out: QuranShort[] = [];
    for (const s of [...QURAN_SHORTS, ...dynamicShorts]) {
      if (!seen.has(s.youtubeId)) {
        seen.add(s.youtubeId);
        out.push(s);
      }
    }
    return out;
  }, [dynamicShorts]);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);

  // Filter shorts - إزالة المقاطع الطويلة وغير المتاحة تلقائياً
  const filteredShorts = useMemo(() => {
    let result = ALL_SHORTS;
    // استبعاد المقاطع الطويلة (> 75 ثانية) والمقاطع غير المتاحة
    result = result.filter(s =>
      !longVideoIds.has(s.youtubeId) && !unavailableIds.has(s.youtubeId)
    );
    if (selectedSeries) {
      result = result.filter(s => s.seriesId === selectedSeries);
    } else {
      if (selectedCategory !== 'all') {
        result = result.filter(s => s.category === selectedCategory);
      }
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s => s.title.toLowerCase().includes(query) ||
          s.scholar.toLowerCase().includes(query) ||
          (s.description && s.description.toLowerCase().includes(query))
      );
    }
    return result;
  }, [selectedCategory, selectedSeries, searchQuery, longVideoIds, unavailableIds, ALL_SHORTS]);

  // فحص مسبق للمدد من الكاش المحلي عند التحميل
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const longs = new Set<string>();
    const unavail = new Set<string>();
    const map: Record<string, number> = {};
    for (const s of ALL_SHORTS) {
      const d = getCachedDuration(s.youtubeId);
      if (d == null) continue;
      map[s.youtubeId] = d;
      if (d === -1) unavail.add(s.youtubeId);
      else if (d > MAX_SHORT_SECONDS) longs.add(s.youtubeId);
    }
    setDurationMap(map);
    if (longs.size) setLongVideoIds(longs);
    if (unavail.size) setUnavailableIds(prev => new Set([...prev, ...unavail]));
  }, [ALL_SHORTS]);

  // جلب ديناميكي للشورتس من قنوات موثوقة (في الخلفية)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;

    const loadDynamicShorts = async () => {
      setIsLoadingMoreShorts(true);
      try {
        // اجلب بدفعات صغيرة لتجنب التحميل الزائد
        const batches: (typeof SHORTS_CHANNELS)[] = [];
        const batchSize = 4;
        for (let i = 0; i < SHORTS_CHANNELS.length; i += batchSize) {
          batches.push(SHORTS_CHANNELS.slice(i, i + batchSize));
        }

        for (const batch of batches) {
          if (cancelled) return;
          const ids = batch.map(c => c.id);
          const resultMap = await fetchMultiChannelShorts(ids, MAX_SHORT_SECONDS);
          const newShorts: QuranShort[] = [];
          batch.forEach(ch => {
            const list = resultMap[ch.id] || [];
            list.forEach((s: ChannelShort) => {
              newShorts.push({
                id: `dyn_${ch.id.slice(-6)}_${s.id}`,
                youtubeId: s.id,
                title: s.title,
                scholar: ch.scholar,
                category: ch.category,
              });
            });
          });
          if (cancelled) return;
          if (newShorts.length) {
            setDynamicShorts(prev => {
              const seen = new Set(prev.map(s => s.youtubeId));
              return [...prev, ...newShorts.filter(s => !seen.has(s.youtubeId))];
            });
          }
        }
      } finally {
        if (!cancelled) setIsLoadingMoreShorts(false);
      }
    };

    // ابدأ التحميل بعد ثانية من تحميل المكون
    const t = setTimeout(loadDynamicShorts, 1500);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  // فحص تدريجي لمدد المقاطع غير المفحوصة (في الخلفية، بدون عرقلة UI)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;

    const run = async () => {
      // أولوية: المقاطع الحالية + القريبة منها
      const priorityIds: string[] = [];
      const windowSize = 10;
      const start = Math.max(0, currentIndex - 2);
      const end = Math.min(filteredShorts.length, start + windowSize);
      for (let i = start; i < end; i++) {
        const s = filteredShorts[i];
        if (s && !(s.youtubeId in durationMap)) priorityIds.push(s.youtubeId);
      }
      // ثم المقاطع غير المفحوصة عموماً
      const allUnknown = ALL_SHORTS
        .filter(s => !(s.youtubeId in durationMap))
        .map(s => s.youtubeId);
      const toCheck = [...new Set([...priorityIds, ...allUnknown])].slice(0, 50);

      if (toCheck.length === 0) return;
      const results = await getVideoDurationsBatch(toCheck, 15000);
      if (cancelled) return;

      const longs = new Set(longVideoIds);
      const unavail = new Set(unavailableIds);
      const newMap = { ...durationMap };
      for (const [id, dur] of Object.entries(results)) {
        if (typeof dur !== 'number') continue;
        newMap[id] = dur;
        if (dur === -1) unavail.add(id);
        else if (dur > MAX_SHORT_SECONDS) longs.add(id);
      }
      setDurationMap(newMap);
      setLongVideoIds(longs);
      setUnavailableIds(unavail);
    };

    // debounce + خلفية
    const timer = setTimeout(run, 600);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [currentIndex, filteredShorts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentShort = filteredShorts[currentIndex] || filteredShorts[0];
  const categories = Object.keys(SHORT_CATEGORY_CONFIG) as ShortCategory[];

  const scholars = useMemo(() => {
    const set = new Set(ALL_SHORTS.map(s => s.scholar));
    return Array.from(set).sort();
  }, [ALL_SHORTS]);

  const seriesByCategory = useMemo(() => {
    const map: Record<string, Series[]> = {};
    SERIES.forEach(s => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, []);

  const getSeriesVideoCount = useCallback((seriesId: string) => {
    return ALL_SHORTS.filter(s => s.seriesId === seriesId).length;
  }, [ALL_SHORTS]);

  // Navigate
  const goNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVideoError(false);
    setCurrentIndex(prev => (prev + 1) % filteredShorts.length);
    setTimeout(() => setIsTransitioning(false), 250);
  }, [filteredShorts.length, isTransitioning]);

  const goPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVideoError(false);
    setCurrentIndex(prev => (prev - 1 + filteredShorts.length) % filteredShorts.length);
    setTimeout(() => setIsTransitioning(false), 250);
  }, [filteredShorts.length, isTransitioning]);

  // Touch handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback(() => {
    const diff = touchStartY.current - touchEndY.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (viewMode !== 'shorts') return;
      if (e.key === 'ArrowDown' || e.key === 'j') goNext();
      else if (e.key === 'ArrowUp' || e.key === 'k') goPrev();
      else if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev, isFullscreen, viewMode]);

  // Wheel
  useEffect(() => {
    if (viewMode !== 'shorts') return;
    const container = containerRef.current;
    if (!container) return;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;
      lastWheelTime.current = now;
      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
    };
    container.addEventListener('wheel', h, { passive: false });
    return () => container.removeEventListener('wheel', h);
  }, [goNext, goPrev, viewMode]);

  // فحص توفر ومدة الفيديو عبر Cloudflare Worker
  useEffect(() => {
    if (!currentShort) return;

    // إذا كنا نعلم أنه غير متاح أو طويل، تخطَّ فوراً
    if (unavailableIds.has(currentShort.youtubeId) || longVideoIds.has(currentShort.youtubeId)) {
      goNext();
      return;
    }

    // إن كانت المدة معروفة مسبقاً ومناسبة، لا حاجة للفحص
    const cachedDur = durationMap[currentShort.youtubeId] ?? getCachedDuration(currentShort.youtubeId);
    if (typeof cachedDur === 'number' && cachedDur > 0 && cachedDur <= MAX_SHORT_SECONDS) {
      return;
    }

    let cancelled = false;
    const checkVideo = async () => {
      try {
        // نستخدم worker endpoint الخاص بنا للحصول على مدة الفيديو
        const res = await fetch(
          `https://quran-shorts-api.wwwcomw1239.workers.dev/duration?id=${currentShort.youtubeId}`,
          { signal: AbortSignal.timeout(6000) }
        );
        if (cancelled) return;
        if (!res.ok) return;
        const data = await res.json() as { duration: number | null };
        const dur = data.duration;

        if (typeof dur !== 'number') return;

        setDurationMap(prev => ({ ...prev, [currentShort.youtubeId]: dur }));

        if (dur === -1) {
          setUnavailableIds(prev => new Set([...prev, currentShort.youtubeId]));
          setVideoError(true);
          videoCheckTimerRef.current = setTimeout(() => goNext(), 1200);
        } else if (dur > MAX_SHORT_SECONDS) {
          // فيديو طويل - أضفه للقائمة السوداء وانتقل للتالي
          setLongVideoIds(prev => new Set([...prev, currentShort.youtubeId]));
          videoCheckTimerRef.current = setTimeout(() => goNext(), 300);
        }
      } catch {
        // في حال الفشل، لا نفعل شيئاً ونترك الفيديو يحاول التشغيل
      }
    };

    checkVideo();

    return () => {
      cancelled = true;
      if (videoCheckTimerRef.current) clearTimeout(videoCheckTimerRef.current);
    };
  }, [currentShort?.youtubeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lazy load for browse mode
  useEffect(() => {
    if (viewMode !== 'browse') return;
    const h = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        setLoadedCount(prev => Math.min(prev + 20, filteredShorts.length));
      }
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [viewMode, filteredShorts.length]);

  // Actions
  const toggleLike = useCallback(() => {
    if (!currentShort) return;
    setLiked(prev => { const n = new Set(prev); if (n.has(currentShort.id)) n.delete(currentShort.id); else n.add(currentShort.id); return n; });
  }, [currentShort]);

  const toggleSave = useCallback(() => {
    if (!currentShort) return;
    setSaved(prev => { const n = new Set(prev); if (n.has(currentShort.id)) n.delete(currentShort.id); else n.add(currentShort.id); return n; });
  }, [currentShort]);

  const handleShare = useCallback(async () => {
    if (!currentShort) return;
    const url = `https://www.youtube.com/watch?v=${currentShort.youtubeId}`;
    if (navigator.share) { try { await navigator.share({ title: currentShort.title, text: currentShort.description, url }); } catch { } }
    else { await navigator.clipboard.writeText(url); }
  }, [currentShort]);

  const getEmbedUrl = useCallback((youtubeId: string): string => {
    const qMap: Record<VideoQuality, string> = { '360p': 'small', '480p': 'medium', '720p': 'large', '1080p': 'hd1080' };
    const p = new URLSearchParams({
      playsinline: '1', modestbranding: '1', rel: '0', autoplay: '1', controls: '1',
      fs: '0', iv_load_policy: '3', cc_load_policy: '0', vq: qMap[videoQuality],
      mute: '0', loop: '0', origin: typeof window !== 'undefined' ? window.location.origin : '',
    });
    // إذا كان الفيديو طويلاً نسبياً (> 60s) وعُرِف، نُوقف التشغيل عند 60 ثانية
    const dur = durationMap[youtubeId];
    if (typeof dur === 'number' && dur > 60 && dur <= MAX_SHORT_SECONDS) {
      p.set('end', '60');
    }
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?${p.toString()}`;
  }, [videoQuality, durationMap]);

  const playFromBrowse = useCallback((index: number) => {
    setCurrentIndex(index);
    setViewMode('shorts');
    setVideoError(false);
  }, []);

  const openSeries = useCallback((seriesId: string) => {
    setSelectedSeries(seriesId);
    setCurrentIndex(0);
    setViewMode('shorts');
    setVideoError(false);
  }, []);

  const clearSeries = useCallback(() => {
    setSelectedSeries(null);
    setCurrentIndex(0);
  }, []);

  // ============================================
  // RENDER: SERIES VIEW
  // ============================================

  const renderSeriesView = () => (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-bl from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ListVideo className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">السلاسل والقوائم</h2>
            <p className="text-purple-200 text-xs">{SERIES.length} سلسلة موضوعية</p>
          </div>
        </div>
      </div>

      {/* Series by Category */}
      {categories.map(cat => {
        const catSeries = seriesByCategory[cat];
        if (!catSeries || catSeries.length === 0) return null;
        const catConfig = SHORT_CATEGORY_CONFIG[cat];
        return (
          <div key={cat} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catConfig.gradient} flex items-center justify-center text-white`}>
                <catConfig.icon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{catConfig.emoji} {cat}</h3>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catSeries.map(series => {
                const count = getSeriesVideoCount(series.id);
                const firstVideo = ALL_SHORTS.find(s => s.seriesId === series.id);
                return (
                  <button
                    key={series.id}
                    onClick={() => openSeries(series.id)}
                    className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all text-right"
                  >
                    <div className="relative h-28 overflow-hidden">
                      {firstVideo && (
                        <LazyThumbnail youtubeId={firstVideo.youtubeId} title={series.title} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 right-2 left-2">
                        <p className="text-white font-bold text-sm truncate">{series.title}</p>
                        <p className="text-white/70 text-xs truncate">{series.scholar}</p>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-[10px] flex items-center gap-1">
                        <ListVideo className="w-3 h-3" />
                        {count} مقطع
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{series.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ============================================
  // RENDER: BROWSE VIEW
  // ============================================

  const renderBrowseView = () => {
    const visibleShorts = filteredShorts.slice(0, loadedCount);
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-bl from-indigo-600 via-blue-600 to-cyan-700 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">تصفح المقاطع</h2>
              <p className="text-blue-200 text-xs">{filteredShorts.length} مقطع متاح</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث بالعنوان أو اسم العالم..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => { setSelectedCategory('all'); setSelectedSeries(null); setLoadedCount(20); }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === 'all' && !selectedSeries ? 'bg-purple-500 text-white shadow' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
            الكل ({ALL_SHORTS.length})
          </button>
          {categories.map(cat => {
            const count = ALL_SHORTS.filter(s => s.category === cat).length;
            return (
              <button key={cat} onClick={() => { setSelectedCategory(cat); setSelectedSeries(null); setCurrentIndex(0); setLoadedCount(20); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === cat && !selectedSeries ? 'bg-purple-500 text-white shadow' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                {SHORT_CATEGORY_CONFIG[cat].emoji} {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleShorts.map((short, idx) => {
            const catConfig = SHORT_CATEGORY_CONFIG[short.category];
            return (
              <button
                key={short.id}
                onClick={() => playFromBrowse(filteredShorts.indexOf(short))}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all text-right"
              >
                <div className="relative aspect-video overflow-hidden">
                  <LazyThumbnail youtubeId={short.youtubeId} title={short.title} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-purple-600 mr-[-1px]" fill="currentColor" />
                    </div>
                  </div>
                  <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r ${catConfig.gradient} text-white text-[9px] font-medium shadow`}>
                    {catConfig.emoji}
                  </div>
                  {short.seriesId && (
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-white text-[9px] flex items-center gap-0.5">
                      <ListVideo className="w-2.5 h-2.5" />
                      سلسلة
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-bold text-[11px] text-slate-900 dark:text-white line-clamp-2 leading-tight mb-1">{short.title}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{short.scholar}</p>
                </div>
              </button>
            );
          })}
        </div>

        {loadedCount < filteredShorts.length && (
          <div className="text-center py-4">
            <button onClick={() => setLoadedCount(prev => Math.min(prev + 20, filteredShorts.length))}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow">
              عرض المزيد ({filteredShorts.length - loadedCount} مقطع متبقي)
            </button>
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // RENDER: SHORTS VIEW (Main Player)
  // ============================================

  const renderShortsView = () => {
    if (!currentShort) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-400">لا توجد مقاطع مطابقة</p>
        </div>
      );
    }

    const catConfig = SHORT_CATEGORY_CONFIG[currentShort.category];
    const currentSeriesObj = selectedSeries ? SERIES.find(s => s.id === selectedSeries) : null;

    return (
      <div className="space-y-3">
        {/* Series banner */}
        {currentSeriesObj && !isFullscreen && (
          <div className={`bg-gradient-to-r ${catConfig.gradient} rounded-xl p-3 text-white flex items-center justify-between`}>
            <div className="flex items-center gap-2 min-w-0">
              <ListVideo className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{currentSeriesObj.title}</p>
                <p className="text-white/70 text-[10px]">{currentSeriesObj.scholar} - {filteredShorts.length} مقطع</p>
              </div>
            </div>
            <button onClick={clearSeries} className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Category & Quality controls */}
        {!isFullscreen && !selectedSeries && (
          <div className="space-y-2">
            <div className="flex flex-wrap justify-center gap-1.5 px-1">
              <button onClick={() => { setSelectedCategory('all'); setCurrentIndex(0); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === 'all' ? 'bg-purple-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                الكل ({ALL_SHORTS.length})
              </button>
              {categories.map(cat => {
                const count = ALL_SHORTS.filter(s => s.category === cat).length;
                return (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === cat ? 'bg-purple-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                    {SHORT_CATEGORY_CONFIG[cat].emoji} {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quality bar */}
        {!isFullscreen && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">جودة:</span>
            <div className="flex gap-1">
              {QUALITY_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setVideoQuality(opt.value)}
                  className={`rounded-lg px-2 py-1 text-[10px] font-medium transition-all ${videoQuality === opt.value ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  title={opt.description}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Player */}
        <div
          ref={containerRef}
          className={`relative ${isFullscreen ? 'fixed inset-0 z-[100]' : 'rounded-2xl overflow-hidden shadow-2xl'}`}
          style={{ height: isFullscreen ? '100vh' : '70vh', maxHeight: isFullscreen ? '100vh' : '700px', minHeight: '400px' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />

          {/* Video */}
          <div className={`absolute inset-0 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {videoError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
                <p className="text-sm font-medium mb-2">هذا المقطع غير متاح حالياً</p>
                <p className="text-xs text-white/60 mb-3">جاري الانتقال للمقطع التالي...</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setVideoError(false); goNext(); }} className="gap-2 text-white border-white/30 hover:bg-white/10">
                    <SkipForward className="w-4 h-4" /> التالي
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setVideoError(false)} className="gap-2 text-white border-white/30 hover:bg-white/10">
                    <RefreshCw className="w-4 h-4" /> إعادة المحاولة
                  </Button>
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                key={`${currentShort.id}-${videoQuality}`}
                src={getEmbedUrl(currentShort.youtubeId)}
                className="w-full h-full border-0"
                title={currentShort.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; playsinline"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onError={() => setVideoError(true)}
              />
            )}
          </div>

          {/* Top overlay */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-3 pointer-events-none z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 pointer-events-auto">
                <Badge className={`text-[10px] bg-gradient-to-r ${catConfig.gradient} text-white border-0 shadow-lg`}>
                  {catConfig.emoji} {currentShort.category}
                </Badge>
                <span className="text-white/60 text-[10px]">{currentIndex + 1} / {filteredShorts.length}</span>
              </div>
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] flex items-center gap-1 hover:bg-black/60 transition-colors">
                  <Settings className="w-3 h-3" /> {videoQuality}
                </button>
                <button onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors">
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                {isFullscreen && (
                  <button onClick={() => setIsFullscreen(false)}
                    className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {showQualityMenu && (
              <div className="absolute top-12 left-2 bg-black/90 backdrop-blur-md rounded-xl p-2 shadow-2xl z-50 pointer-events-auto border border-white/10">
                {QUALITY_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setVideoQuality(opt.value); setShowQualityMenu(false); }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-colors ${videoQuality === opt.value ? 'bg-purple-500 text-white' : 'text-white/80 hover:bg-white/10'}`}>
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-[10px] opacity-70">{opt.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 z-10 pointer-events-none">
            <div className="flex items-end gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 pointer-events-auto">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-sm">{currentShort.scholar}</span>
                  {currentShort.seriesId && (
                    <span className="text-white/50 text-[10px] flex items-center gap-0.5"><ListVideo className="w-3 h-3" /> سلسلة</span>
                  )}
                </div>
                <h3 className="text-white font-bold text-base leading-tight mb-1">{currentShort.title}</h3>
                {currentShort.description && (
                  <p className="text-white/70 text-xs line-clamp-2">{currentShort.description}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col items-center gap-3 pointer-events-auto">
                <button onClick={toggleLike} className="flex flex-col items-center gap-0.5 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${liked.has(currentShort.id) ? 'bg-red-500 scale-110' : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'}`}>
                    <Heart className={`w-5 h-5 ${liked.has(currentShort.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-[10px]">إعجاب</span>
                </button>
                <button onClick={toggleSave} className="flex flex-col items-center gap-0.5 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${saved.has(currentShort.id) ? 'bg-yellow-500 scale-110' : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'}`}>
                    <Bookmark className={`w-5 h-5 ${saved.has(currentShort.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-[10px]">حفظ</span>
                </button>
                <button onClick={handleShare} className="flex flex-col items-center gap-0.5 group">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-[10px]">مشاركة</span>
                </button>
                <button onClick={goNext} className="flex flex-col items-center gap-0.5 group">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <SkipForward className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-[10px]">التالي</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 z-20 pointer-events-none">
            {filteredShorts.slice(Math.max(0, currentIndex - 3), Math.min(filteredShorts.length, currentIndex + 4)).map((_, i) => {
              const actualIndex = Math.max(0, currentIndex - 3) + i;
              return (
                <div key={actualIndex}
                  className={`w-1 rounded-full transition-all ${actualIndex === currentIndex ? 'h-4 bg-white' : 'h-1.5 bg-white/30'}`}
                />
              );
            })}
          </div>
        </div>

        {/* Swipe hint */}
        {!isFullscreen && (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <ChevronUp className="w-3 h-3" /> اسحب للأعلى أو استخدم الأسهم للتنقل <ChevronDown className="w-3 h-3" />
          </p>
        )}
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="space-y-4">
      {/* Top Navigation Tabs */}
      {!isFullscreen && (
        <>
          {/* Hero */}
          <div className="bg-gradient-to-bl from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">مقاطع قصيرة</h2>
                <p className="text-purple-200 text-xs">مواعظ وتدبرات وقصص مؤثرة</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <Flame className="w-3 h-3" /> <span>{ALL_SHORTS.length} مقطع</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <User className="w-3 h-3" /> <span>{scholars.length} عالم</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <ListVideo className="w-3 h-3" /> <span>{SERIES.length} سلسلة</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs flex items-center gap-1.5">
                <Settings className="w-3 h-3" /> <span>جودة {videoQuality}</span>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button onClick={() => { setViewMode('shorts'); setSelectedSeries(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'shorts' ? 'bg-purple-500 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Flame className="w-4 h-4" /> مشاهدة
            </button>
            <button onClick={() => setViewMode('series')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'series' ? 'bg-purple-500 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <ListVideo className="w-4 h-4" /> السلاسل
            </button>
            <button onClick={() => { setViewMode('browse'); setSelectedSeries(null); setLoadedCount(20); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'browse' ? 'bg-purple-500 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Layers className="w-4 h-4" /> تصفح
            </button>
          </div>
        </>
      )}

      {/* Content */}
      {viewMode === 'shorts' && renderShortsView()}
      {viewMode === 'series' && renderSeriesView()}
      {viewMode === 'browse' && renderBrowseView()}

    </div>
  );
}
