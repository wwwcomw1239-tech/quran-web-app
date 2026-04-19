'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Play, Search, X, BookOpen, Mic2,
  Sparkles, ChevronDown, ChevronUp, Video, Filter,
  Star, User, ArrowRight, Maximize2, Minimize2,
  BookMarked, GraduationCap, Lightbulb, MessageCircle,
  Scroll, RefreshCw, AlertCircle, Download, Share2,
  Heart, Bookmark, ExternalLink, Settings, SkipForward, SkipBack,
  Volume2, Clock, Eye
} from 'lucide-react';
import { QURAN_VIDEOS, type VideoCategory, type QuranVideo } from '@/data/videos';

// CATEGORY CONFIG
// ============================================

const CATEGORY_CONFIG: Record<VideoCategory, { icon: any; color: string; bgColor: string; description: string }> = {
  'تفسير القرآن': {
    icon: BookMarked,
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'from-emerald-500 to-teal-600',
    description: 'دروس تفسير القرآن الكريم'
  },
  'تدبر وتأملات': {
    icon: Lightbulb,
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'from-purple-500 to-fuchsia-600',
    description: 'تدبرات وتأملات في آيات القرآن الكريم'
  },
  'أحكام التلاوة والتجويد': {
    icon: Mic2,
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'from-amber-500 to-orange-600',
    description: 'دروس في أحكام التجويد وتلاوة القرآن الكريم'
  },
  'علوم القرآن': {
    icon: GraduationCap,
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'from-blue-500 to-indigo-600',
    description: 'دروس في علوم القرآن المختلفة'
  },
  'قصص القرآن': {
    icon: Scroll,
    color: 'text-cyan-700 dark:text-cyan-300',
    bgColor: 'from-cyan-500 to-teal-600',
    description: 'قصص الأنبياء والأمم في القرآن الكريم'
  },
  'إعجاز القرآن': {
    icon: Sparkles,
    color: 'text-rose-700 dark:text-rose-300',
    bgColor: 'from-rose-500 to-pink-600',
    description: 'أوجه الإعجاز في القرآن الكريم'
  },
};

// ============================================
// VIDEOS DATABASE
// جميع المعرفات مأخوذة من فيديوهات يوتيوب حقيقية
// ============================================


// ============================================
// MAIN COMPONENT
// ============================================

export function QuranVideos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [activeVideo, setActiveVideo] = useState<QuranVideo | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState<string | 'all'>('all');
  const [videoError, setVideoError] = useState(false);
  const [unavailableIds, setUnavailableIds] = useState<Set<string>>(new Set());
  // PAGINATION: limit initial render for performance (show more on demand)
  const INITIAL_VISIBLE_PER_CATEGORY = 12;
  const INITIAL_VISIBLE_ALL = 24;
  const LOAD_MORE_STEP = 24;
  const [visiblePerCategory, setVisiblePerCategory] = useState<Record<string, number>>({});
  const [visibleAll, setVisibleAll] = useState(INITIAL_VISIBLE_ALL);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleAll(INITIAL_VISIBLE_ALL);
    setVisiblePerCategory({});
  }, [searchQuery, selectedCategory, selectedScholar]);

  const getVisibleForCategory = (cat: string) => {
    return visiblePerCategory[cat] ?? INITIAL_VISIBLE_PER_CATEGORY;
  };

  const showMoreForCategory = (cat: string, total: number) => {
    setVisiblePerCategory(prev => ({
      ...prev,
      [cat]: Math.min(total, (prev[cat] ?? INITIAL_VISIBLE_PER_CATEGORY) + LOAD_MORE_STEP),
    }));
  };

  // Get unique scholars
  const scholars = useMemo(() => {
    const set = new Set(QURAN_VIDEOS.map(v => v.scholar));
    return Array.from(set).sort();
  }, []);

  // Filter videos
  const filteredVideos = useMemo(() => {
    let result = QURAN_VIDEOS;
    if (selectedCategory !== 'all') {
      result = result.filter(v => v.category === selectedCategory);
    }
    if (selectedScholar !== 'all') {
      result = result.filter(v => v.scholar === selectedScholar);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        v => v.title.toLowerCase().includes(query) ||
          v.scholar.toLowerCase().includes(query) ||
          (v.description && v.description.toLowerCase().includes(query))
      );
    }
    return result;
  }, [searchQuery, selectedCategory, selectedScholar]);

  // Group by category
  const videosByCategory = useMemo(() => {
    const cats = Object.keys(CATEGORY_CONFIG) as VideoCategory[];
    const grouped: Record<VideoCategory, QuranVideo[]> = {} as any;
    cats.forEach(cat => {
      grouped[cat] = filteredVideos.filter(v => v.category === cat);
    });
    return grouped;
  }, [filteredVideos]);

  const categories = Object.keys(CATEGORY_CONFIG) as VideoCategory[];
  const getCategoryCount = (cat: VideoCategory) => QURAN_VIDEOS.filter(v => v.category === cat).length;

  // Check video availability when active video changes
  useEffect(() => {
    if (!activeVideo) return;
    
    if (unavailableIds.has(activeVideo.youtubeId)) {
      setVideoError(true);
      return;
    }

    const checkVideo = async () => {
      try {
        const response = await fetch(
          `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${activeVideo.youtubeId}`,
          { signal: AbortSignal.timeout(5000) }
        );
        const data = await response.json();
        
        if (data.error || !data.title) {
          setUnavailableIds(prev => new Set([...prev, activeVideo.youtubeId]));
          setVideoError(true);
        }
      } catch {
        // On error, don't mark as unavailable
      }
    };

    checkVideo();

    return () => {
      if (videoCheckTimerRef.current) {
        clearTimeout(videoCheckTimerRef.current);
      }
    };
  }, [activeVideo?.youtubeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter out unavailable videos from display
  const displayFilteredVideos = useMemo(() => {
    return filteredVideos.filter(v => !unavailableIds.has(v.youtubeId));
  }, [filteredVideos, unavailableIds]);

  // Play video
  const playVideo = useCallback((video: QuranVideo) => {
    setActiveVideo(video);
    setIsFullscreen(false);
    setVideoError(false);
    setTimeout(() => {
      videoContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
    setIsFullscreen(false);
    setVideoError(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Get embed URL - youtube-nocookie.com for privacy
  // IMPORTANT: No sandbox attribute to allow proper YouTube playback
  const getEmbedUrl = (youtubeId: string): string => {
    const params = new URLSearchParams({
      playsinline: '1',
      modestbranding: '1',
      rel: '0',
      autoplay: '1',
      controls: '1',
      fs: '1',
      iv_load_policy: '3',
      disablekb: '0',
      cc_load_policy: '0',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    });
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
  };

  // ============================================
  // VIDEO DOWNLOAD HANDLER
  // ============================================

  const handleVideoDownload = useCallback((video: QuranVideo, quality: string) => {
    const qualityMap: Record<string, string> = {
      '360p': 'small',
      '480p': 'medium', 
      '720p': 'hd720',
      '1080p': 'hd1080',
    };
    // Open YouTube page directly for download (users can use browser extensions or YouTube apps)
    const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleShare = useCallback(async (video: QuranVideo) => {
    const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    if (navigator.share) {
      try { await navigator.share({ title: video.title, text: video.description || video.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, []);

  // ============================================
  // VIDEO PLAYER - Enhanced Cinema Mode
  // ============================================

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const renderVideoPlayer = () => {
    if (!activeVideo) return null;
    const catInfo = CATEGORY_CONFIG[activeVideo.category];

    // Get next/prev videos
    const currentIdx = QURAN_VIDEOS.findIndex(v => v.id === activeVideo.id);
    const nextVideo = currentIdx < QURAN_VIDEOS.length - 1 ? QURAN_VIDEOS[currentIdx + 1] : null;
    const prevVideo = currentIdx > 0 ? QURAN_VIDEOS[currentIdx - 1] : null;

    return (
      <div 
        ref={videoContainerRef}
        className={`${isFullscreen ? 'fixed inset-0 z-[100] bg-black flex flex-col' : 'mb-6'}`}
      >
        {/* Cinema Mode Player */}
        <div className={`relative ${isFullscreen ? 'flex-1 flex flex-col' : 'rounded-2xl overflow-hidden shadow-2xl'}`}>
          {/* Video Header Bar */}
          <div className={`flex items-center justify-between px-4 py-2.5 ${
            isFullscreen 
              ? 'bg-black/95 border-b border-white/5' 
              : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
          }`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button variant="ghost" size="sm" onClick={closeVideo}
                className="gap-1.5 text-white hover:bg-white/10 flex-shrink-0 rounded-lg">
                <ArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">إغلاق</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-sm truncate">{activeVideo.title}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-white/50 text-xs truncate">{activeVideo.scholar}</p>
                  <Badge className={`text-[9px] bg-gradient-to-r ${catInfo.bgColor} text-white border-0 px-1.5 py-0`}>
                    {activeVideo.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}
                className="text-white hover:bg-white/10 flex-shrink-0 rounded-lg p-2">
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Video Frame */}
          <div className={`relative bg-black ${isFullscreen ? 'flex-1' : 'aspect-video'}`}>
            {videoError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                </div>
                <p className="text-base font-bold mb-1">تعذّر تحميل الفيديو</p>
                <p className="text-xs text-slate-400 mb-5">قد يكون الفيديو غير متاح حالياً</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setVideoError(false)}
                    className="gap-2 text-white border-white/20 hover:bg-white/10 rounded-xl">
                    <RefreshCw className="w-4 h-4" /> إعادة المحاولة
                  </Button>
                  {nextVideo && (
                    <Button variant="outline" size="sm" onClick={() => playVideo(nextVideo)}
                      className="gap-2 text-white border-white/20 hover:bg-white/10 rounded-xl">
                      <SkipForward className="w-4 h-4" /> التالي
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <iframe
                key={activeVideo.id}
                src={getEmbedUrl(activeVideo.youtubeId)}
                className="w-full h-full border-0"
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; playsinline"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="eager"
                // @ts-ignore - fetchpriority is a valid iframe attribute
                fetchpriority="high"
                onError={() => setVideoError(true)}
              />
            )}
          </div>

          {/* Action Bar - YouTube-beating Design */}
          {!isFullscreen && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Left: Nav buttons */}
                <div className="flex items-center gap-1">
                  {prevVideo && (
                    <button onClick={() => playVideo(prevVideo)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs transition-all">
                      <SkipBack className="w-3.5 h-3.5" /> السابق
                    </button>
                  )}
                  {nextVideo && (
                    <button onClick={() => playVideo(nextVideo)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs transition-all">
                      التالي <SkipForward className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Right: Action buttons */}
                <div className="flex items-center gap-1">
                  <button onClick={() => setLiked(prev => { const n = new Set(prev); if (n.has(activeVideo.id)) n.delete(activeVideo.id); else n.add(activeVideo.id); return n; })}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                      liked.has(activeVideo.id) ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}>
                    <Heart className={`w-3.5 h-3.5 ${liked.has(activeVideo.id) ? 'fill-white' : ''}`} /> إعجاب
                  </button>
                  <button onClick={() => setSaved(prev => { const n = new Set(prev); if (n.has(activeVideo.id)) n.delete(activeVideo.id); else n.add(activeVideo.id); return n; })}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                      saved.has(activeVideo.id) ? 'bg-yellow-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}>
                    <Bookmark className={`w-3.5 h-3.5 ${saved.has(activeVideo.id) ? 'fill-white' : ''}`} /> حفظ
                  </button>
                  <button onClick={() => handleShare(activeVideo)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs transition-all">
                    <Share2 className="w-3.5 h-3.5" /> مشاركة
                  </button>
                  <div className="relative">
                    <button onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs transition-all">
                      <Download className="w-3.5 h-3.5" /> تنزيل
                    </button>
                    {showDownloadMenu && (
                      <div className="absolute bottom-full mb-2 left-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-2 min-w-[180px] z-50">
                        <p className="text-[10px] text-slate-400 px-2 pb-1 mb-1 border-b border-white/10">اختر الجودة</p>
                        {['360p', '480p', '720p', '1080p'].map(q => (
                          <button key={q} onClick={() => { handleVideoDownload(activeVideo, q); setShowDownloadMenu(false); }}
                            className="w-full text-right px-3 py-2 rounded-lg text-xs text-white hover:bg-white/10 transition-colors flex items-center justify-between">
                            <span>{q}</span>
                            <Download className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                        <div className="border-t border-white/10 mt-1 pt-1">
                          <button onClick={() => { window.open(`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`, '_blank'); setShowDownloadMenu(false); }}
                            className="w-full text-right px-3 py-2 rounded-lg text-xs text-emerald-400 hover:bg-white/10 transition-colors flex items-center justify-between">
                            <span>فتح في يوتيوب</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Video Info Panel */}
        {!isFullscreen && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mt-3 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-0.5">{activeVideo.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm">{activeVideo.scholar}</p>
                  <span className="text-slate-300">•</span>
                  <Badge className={`text-[10px] bg-gradient-to-r ${catInfo.bgColor} text-white border-0`}>
                    {activeVideo.category}
                  </Badge>
                </div>
                {activeVideo.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{activeVideo.description}</p>
                )}
              </div>
            </div>

            {/* Related Videos Suggestion */}
            {(nextVideo || prevVideo) && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">مقاطع ذات صلة</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {QURAN_VIDEOS.filter(v => v.scholar === activeVideo.scholar && v.id !== activeVideo.id).slice(0, 4).map(v => (
                    <button key={v.id} onClick={() => playVideo(v)}
                      className="flex-shrink-0 w-32 group text-right">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-1">
                        <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt={v.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 line-clamp-2 leading-tight">{v.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // VIDEO CARD
  // ============================================

  // تحسين: warmup عند hover لتسريع بدء التشغيل (preconnect + prefetch iframe origin)
  const warmupYoutube = useCallback(() => {
    if (typeof document === 'undefined') return;
    if ((window as any).__ytWarmedUp) return;
    (window as any).__ytWarmedUp = true;
    const origins = [
      'https://www.youtube-nocookie.com',
      'https://www.youtube.com',
      'https://i.ytimg.com',
      'https://yt3.ggpht.com',
      'https://googlevideo.com',
    ];
    origins.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);

  const renderVideoCard = (video: QuranVideo) => {
    const isActive = activeVideo?.id === video.id;
    const catInfo = CATEGORY_CONFIG[video.category];

    return (
      <Card
        key={video.id}
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${
          isActive ? 'ring-2 ring-emerald-500 shadow-emerald-100 dark:shadow-emerald-900/30' : ''
        }`}
        onClick={() => playVideo(video)}
        onMouseEnter={warmupYoutube}
        onTouchStart={warmupYoutube}
      >
        <CardContent className="p-0">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <img
              src={`https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 text-emerald-600 mr-[-2px]" fill="currentColor" />
              </div>
            </div>
            {/* Category badge */}
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r ${catInfo.bgColor} text-white text-[10px] font-medium shadow-lg`}>
              {video.category}
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1.5 leading-tight">
              {video.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{video.scholar}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank'); }}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                title="تنزيل"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </button>
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
      <div className="bg-gradient-to-bl from-rose-500 via-rose-600 to-pink-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">المقاطع القرآنية المرئية</h2>
            <p className="text-rose-100 text-sm">دروس ومقاطع قرآنية مرئية</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>{QURAN_VIDEOS.length} مقطع</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{scholars.length} عالم</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{categories.length} تصنيف</span>
          </div>
        </div>
      </div>

      {/* Active Video Player */}
      {renderVideoPlayer()}

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="ابحث بالعنوان أو اسم العالم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 h-12 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="space-y-3">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={`rounded-full px-4 py-1.5 h-auto text-sm ${
              selectedCategory === 'all'
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            الكل ({QURAN_VIDEOS.length})
          </Button>
          {categories.map(cat => {
            const count = getCategoryCount(cat);
            if (count === 0) return null;
            return (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`rounded-full px-4 py-1.5 h-auto text-sm ${
                  selectedCategory === cat
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {cat} ({count})
              </Button>
            );
          })}
        </div>

        {/* Scholar Filter */}
        <div className="flex justify-center">
          <select
            value={selectedScholar}
            onChange={(e) => setSelectedScholar(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm min-w-[200px]"
          >
            <option value="all">جميع العلماء</option>
            {scholars.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      {(searchQuery || selectedCategory !== 'all' || selectedScholar !== 'all') && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          عرض {filteredVideos.length} مقطع
        </p>
      )}

      {/* Videos Grid by Category */}
      {selectedCategory === 'all' && !searchQuery && selectedScholar === 'all' ? (
        categories.map(category => {
          const categoryVideos = videosByCategory[category];
          if (!categoryVideos || categoryVideos.length === 0) return null;
          const catInfo = CATEGORY_CONFIG[category];
          const CatIcon = catInfo.icon;
          const visibleCount = getVisibleForCategory(category);
          const visibleVideos = categoryVideos.slice(0, visibleCount);
          const hasMore = categoryVideos.length > visibleCount;

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{category}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{catInfo.description}</p>
                </div>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <Badge variant="outline" className="text-xs">{categoryVideos.length} مقطع</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleVideos.map(video => renderVideoCard(video))}
              </div>
              {hasMore && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showMoreForCategory(category, categoryVideos.length)}
                    className="gap-2"
                  >
                    <ChevronDown className="w-4 h-4" />
                    عرض المزيد ({categoryVideos.length - visibleCount} متبقية)
                  </Button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVideos.slice(0, visibleAll).map(video => renderVideoCard(video))}
          </div>
          {filteredVideos.length > visibleAll && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisibleAll(v => v + LOAD_MORE_STEP)}
                className="gap-2"
              >
                <ChevronDown className="w-4 h-4" />
                عرض المزيد ({filteredVideos.length - visibleAll} متبقية)
              </Button>
            </div>
          )}
        </>
      )}

      {/* No results */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">لم يتم العثور على مقاطع مطابقة</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">جرب كلمات بحث مختلفة</p>
        </div>
      )}

    </div>
  );
}
