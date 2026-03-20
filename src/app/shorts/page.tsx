'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Loader2, RefreshCw, Home, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { ShortsVideoPlayer } from '@/components/shorts/ShortsVideoPlayer';
import { fetchArchiveVideos, ShortsVideo } from '@/lib/archiveFetch';
import { cn } from '@/lib/utils';

export default function ShortsPage() {
  const [videos, setVideos] = useState<ShortsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load videos on mount
  useEffect(() => {
    loadVideos();

    // Load liked videos from localStorage
    try {
      const savedLikes = localStorage.getItem('shorts-liked-videos');
      if (savedLikes) {
        setLikedVideos(new Set(JSON.parse(savedLikes)));
      }
    } catch (e) {
      console.error('Failed to load liked videos:', e);
    }
  }, []);

  // Save liked videos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shorts-liked-videos', JSON.stringify([...likedVideos]));
    } catch (e) {
      console.error('Failed to save liked videos:', e);
    }
  }, [likedVideos]);

  // Load videos from Archive.org (client-side with CORS proxy)
  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check sessionStorage cache first (5 minutes)
      const cached = sessionStorage.getItem('shorts-videos-cache');
      if (cached) {
        const { videos: cachedVideos, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 5 * 60 * 1000 && cachedVideos.length > 0) {
          setVideos(cachedVideos);
          setLoading(false);
          return;
        }
      }

      // Fetch from Archive.org
      const fetchedVideos = await fetchArchiveVideos(30);
      
      if (fetchedVideos.length > 0) {
        // Check if using fallback videos
        const isFallbackData = fetchedVideos.some(v => v.id.startsWith('fallback'));
        setIsFallback(isFallbackData);
        setVideos(fetchedVideos);
        
        // Cache in sessionStorage
        sessionStorage.setItem('shorts-videos-cache', JSON.stringify({
          videos: fetchedVideos,
          timestamp: Date.now(),
        }));
      } else {
        setError('لم يتم العثور على فيديوهات');
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError('فشل في تحميل الفيديوهات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle like
  const handleLike = useCallback((videoId: string) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  }, []);

  // Intersection Observer for auto-play
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setActiveIndex(index);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.8,
      }
    );

    const videoElements = containerRef.current?.querySelectorAll('[data-video-item]');
    videoElements?.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [videos]);

  // Handle scroll for navigation
  const handleScroll = useCallback((e: React.WheelEvent) => {
    if (!containerRef.current) return;

    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(videos.length - 1, activeIndex + direction));

    const targetElement = containerRef.current.querySelector(`[data-index="${newIndex}"]`);
    targetElement?.scrollIntoView({ behavior: 'smooth' });
  }, [activeIndex, videos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        const newIndex = Math.min(videos.length - 1, activeIndex + 1);
        const targetElement = containerRef.current?.querySelector(`[data-index="${newIndex}"]`);
        targetElement?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = Math.max(0, activeIndex - 1);
        const targetElement = containerRef.current?.querySelector(`[data-index="${newIndex}"]`);
        targetElement?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, videos.length]);

  // Loading state - True Black Background
  if (loading && videos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
        <p className="text-white/70 text-lg">جاري تحميل الفيديوهات...</p>
      </div>
    );
  }

  // Error state
  if (error && videos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 px-6">
        <WifiOff className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-white text-lg font-bold mb-2">حدث خطأ</p>
        <p className="text-white/70 text-sm text-center mb-6">{error}</p>
        
        <div className="flex gap-4">
          <button
            onClick={loadVideos}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 py-3 font-medium transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>إعادة المحاولة</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-3 font-medium transition-all"
          >
            <Home className="w-5 h-5" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-40" dir="rtl">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Home Button */}
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <Home className="w-5 h-5" />
          </Link>

          {/* Title */}
          <div className="flex flex-col items-center">
            <h1 className="text-white font-bold text-lg">نور القرآن</h1>
            <span className="text-emerald-400 text-xs font-medium">Shorts</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadVideos}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Fallback indicator */}
      {isFallback && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            فيديوهات تجريبية - جاري البحث...
          </div>
        </div>
      )}

      {/* Video Feed - Full-screen vertical scroll with snap */}
      <div
        ref={containerRef}
        className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: 'y mandatory' }}
        onWheel={handleScroll}
      >
        {videos.map((video, index) => (
          <div
            key={`${video.id}-${index}`}
            data-video-item
            data-index={index}
            className="h-[100dvh] w-full snap-start snap-always relative"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ShortsVideoPlayer
              video={video}
              isActive={index === activeIndex}
              onLike={handleLike}
              isLiked={likedVideos.has(video.id)}
            />
          </div>
        ))}
      </div>

      {/* Video Counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
          <span className="text-white/70 text-sm">
            {activeIndex + 1} / {videos.length}
          </span>
        </div>
      </div>

      {/* Swipe Hint (first video only) */}
      {activeIndex === 0 && videos.length > 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="flex flex-col items-center text-white/50">
            <ArrowRight className="w-6 h-6 rotate-90" />
            <span className="text-xs mt-1 bg-black/30 px-3 py-1 rounded-full">اسحب للأعلى</span>
          </div>
        </div>
      )}
    </div>
  );
}
