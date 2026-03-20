'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Loader2, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { ShortsVideoPlayer } from '@/components/shorts/ShortsVideoPlayer';
import { fetchAllVideos, YouTubeVideo } from '@/lib/youtube';
import { cn } from '@/lib/utils';

// Sample videos fallback (when API fails)
const SAMPLE_VIDEOS: YouTubeVideo[] = [
  // Quran Recitations
  { id: 'c7eSIvGpF_Q', title: 'تلاوة عطرة من سورة الرحمن - عبد الباسط عبد الصمد', thumbnail: '', playlistId: 'sample', type: 'quran' },
  { id: 'KqfOSMJHbQg', title: 'سورة يس - الشيخ محمد صديق المنشاوي', thumbnail: '', playlistId: 'sample', type: 'quran' },
  { id: '5n2A2aFcHg0', title: 'سورة الرحمن - الشيخ مشاري راشد العفاسي', thumbnail: '', playlistId: 'sample', type: 'quran' },
  { id: '8dALWj-lQjA', title: 'تلاوة خاشعة - الشيخ مشاري راشد العفاسي', thumbnail: '', playlistId: 'sample', type: 'quran' },
  { id: '9n7d3bO4cWk', title: 'سورة الواقعة - عبد الباسط عبد الصمد', thumbnail: '', playlistId: 'sample', type: 'quran' },
  // Sermons
  { id: 'Wjt01W6YnQg', title: 'خطبة جمعة - الشيخ محمد حسان', thumbnail: '', playlistId: 'sample', type: 'sermon' },
  { id: 'a3gPZhN9TTU', title: 'موعظة مؤثرة - الشيخ نبيل العوضي', thumbnail: '', playlistId: 'sample', type: 'sermon' },
  { id: 'z6H-JNP7bLY', title: 'كلمة طيبة - الشيخ عبد المحسن الأحمد', thumbnail: '', playlistId: 'sample', type: 'sermon' },
  { id: 'mXJ8bW9kOqE', title: 'نصيحة غالية - الشيخ إبراهيم الدويش', thumbnail: '', playlistId: 'sample', type: 'sermon' },
  { id: 'pLqV6bZxKQw', title: 'خطبة مؤثرة - الشيخ خالد الراشد', thumbnail: '', playlistId: 'sample', type: 'sermon' },
];

export default function ShortsPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load videos on mount
  useEffect(() => {
    loadVideos();
    
    // Load liked videos from localStorage
    const savedLikes = localStorage.getItem('shorts-liked-videos');
    if (savedLikes) {
      try {
        setLikedVideos(new Set(JSON.parse(savedLikes)));
      } catch (e) {
        console.error('Failed to load liked videos:', e);
      }
    }
  }, []);

  // Save liked videos to localStorage
  useEffect(() => {
    localStorage.setItem('shorts-liked-videos', JSON.stringify([...likedVideos]));
  }, [likedVideos]);

  // Load videos from API
  const loadVideos = async () => {
    setLoading(true);
    
    try {
      const fetchedVideos = await fetchAllVideos();
      if (fetchedVideos.length === 0) {
        // Use sample videos if API fails
        setVideos(shuffleArray([...SAMPLE_VIDEOS]));
      } else {
        setVideos(fetchedVideos);
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
      // Use sample videos as fallback
      setVideos(shuffleArray([...SAMPLE_VIDEOS]));
    } finally {
      setLoading(false);
    }
  };

  // Fisher-Yates shuffle
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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
          if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setActiveIndex(index);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.9, // 90% visible
      }
    );

    // Observe all video containers
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
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const newIndex = Math.min(videos.length - 1, activeIndex + 1);
        const targetElement = containerRef.current?.querySelector(`[data-index="${newIndex}"]`);
        targetElement?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const newIndex = Math.max(0, activeIndex - 1);
        const targetElement = containerRef.current?.querySelector(`[data-index="${newIndex}"]`);
        targetElement?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, videos.length]);

  // Loading state - True Black Background
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
        <p className="text-white/70 text-lg">جاري تحميل الفيديوهات...</p>
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
          <h1 className="text-white font-bold text-xl">نور القرآن Shorts</h1>
          
          {/* Refresh Button */}
          <button
            onClick={loadVideos}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>
      </div>

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
        <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
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
            <span className="text-xs mt-1">اسحب للأعلى</span>
          </div>
        </div>
      )}
    </div>
  );
}
