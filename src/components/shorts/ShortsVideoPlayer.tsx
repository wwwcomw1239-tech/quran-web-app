'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, Share2, Download, Volume2, VolumeX, Play, Loader2, SkipForward, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getEmbedUrl, getWhatsAppShareUrl, isValidVideoId, YouTubeVideo } from '@/lib/youtube';

interface ShortsVideoPlayerProps {
  video: YouTubeVideo;
  isActive: boolean;
  onLike?: (videoId: string) => void;
  isLiked?: boolean;
  onSkip?: () => void;
}

export function ShortsVideoPlayer({ video, isActive, onLike, isLiked = false, onSkip }: ShortsVideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validate video ID
  const validVideoId = isValidVideoId(video.id);
  const embedUrl = validVideoId ? getEmbedUrl(video.id) : '';

  // Reset state when video changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [video.id]);

  // Handle auto-play when video becomes active
  useEffect(() => {
    if (!iframeRef.current || hasError || !validVideoId) return;

    if (isActive) {
      // Set timeout to detect loading failures
      loadTimeoutRef.current = setTimeout(() => {
        if (!isLoaded) {
          setHasError(true);
        }
      }, 8000);

      // Try to play
      try {
        iframeRef.current.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          '*'
        );
      } catch (e) {
        console.warn('Could not send play command:', e);
      }
    } else {
      // Clear timeout
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }

      // Pause video when not active
      try {
        iframeRef.current.contentWindow?.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        );
      } catch (e) {
        // Ignore errors when pausing
      }
      setIsLoaded(false);
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [isActive, hasError, isLoaded, validVideoId]);

  // Listen for iframe load
  const handleIframeLoad = useCallback(() => {
    // Clear error timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    
    // Small delay to ensure content is ready
    setTimeout(() => {
      setIsLoaded(true);
      setHasError(false);
    }, 300);
  }, []);

  // Handle iframe error
  const handleIframeError = useCallback(() => {
    console.warn('Iframe error for video:', video.id);
    setHasError(true);
  }, [video.id]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!iframeRef.current) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    try {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: newMuted ? 'mute' : 'unMute', args: '' }),
        '*'
      );
    } catch (e) {
      console.warn('Could not toggle mute:', e);
    }
  }, [isMuted]);

  // Share to WhatsApp
  const handleShare = useCallback(() => {
    const shareUrl = getWhatsAppShareUrl(video.id, video.title);
    window.open(shareUrl, '_blank');
  }, [video]);

  // Watch on YouTube (fallback)
  const handleWatchOnYouTube = useCallback(() => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank', 'noopener,noreferrer');
  }, [video.id]);

  // Download video - Low quality is mandatory default
  const handleDownload = useCallback(() => {
    setIsDownloading(true);
    const downloadUrl = `https://www.ssyoutube.com/watch?v=${video.id}`;
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => setIsDownloading(false), 1500);
  }, [video.id]);

  // Error Fallback UI
  if (hasError || !validVideoId || !embedUrl) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        {/* Thumbnail Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: validVideoId 
              ? `url(https://img.youtube.com/vi/${video.id}/hqdefault.jpg)` 
              : 'none'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />

        {/* Error Message */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-amber-400" />
          </div>
          
          <h3 className="text-white font-bold text-xl mb-2">الفيديو غير متاح للتشغيل</h3>
          <p className="text-white/60 text-sm mb-4 max-w-xs">
            لا يمكن تشغيل هذا الفيديو داخل التطبيق. يمكنك مشاهدته مباشرة على YouTube.
          </p>
          
          {/* Video Title */}
          <p className="text-white/70 text-sm mb-6 line-clamp-2 max-w-sm">
            {video.title}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={handleWatchOnYouTube}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-3 font-medium transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              <span>مشاهدة على YouTube</span>
            </button>
            
            {onSkip && (
              <button
                onClick={onSkip}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-3 font-medium transition-all backdrop-blur-sm"
              >
                <SkipForward className="w-5 h-5" />
                <span>تخطي إلى الفيديو التالي</span>
              </button>
            )}
          </div>
        </div>

        {/* Video Type Badge */}
        <div className="absolute top-20 left-4 z-20">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
            video.type === 'quran' 
              ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
              : "bg-blue-500/30 text-blue-300 border border-blue-500/30"
          )}>
            {video.type === 'quran' ? ' تلاوة Quran' : 'خطبة Sermon'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black flex items-center justify-center"
    >
      {/* Loading Skeleton - True Black Background */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ 
              backgroundImage: `url(https://img.youtube.com/vi/${video.id}/hqdefault.jpg)` 
            }}
          />
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
            <p className="text-white/70 text-sm bg-black/50 px-4 py-1 rounded-full">جاري التحميل...</p>
          </div>
        </div>
      )}

      {/* YouTube Iframe */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen={false}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title={video.title}
        style={{ 
          border: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Video Info - Bottom */}
      <div className="absolute bottom-20 left-4 right-20 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
            video.type === 'quran' 
              ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
              : "bg-blue-500/30 text-blue-300 border border-blue-500/30"
          )}>
            {video.type === 'quran' ? ' تلاوة Quran' : 'خطبة Sermon'}
          </span>
        </div>
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">
          {video.title}
        </h3>
      </div>

      {/* Floating Action Buttons - Right Side */}
      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-4 z-20">
        {/* Like Button */}
        <button
          onClick={() => onLike?.(video.id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm",
            isLiked 
              ? "bg-red-500 text-white" 
              : "bg-white/10 text-white group-hover:bg-white/25"
          )}>
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
          </div>
          <span className="text-white text-[10px] font-medium drop-shadow-lg">
            {isLiked ? 'أعجبك' : 'إعجاب'}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/25 transition-all">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-white text-[10px] font-medium drop-shadow-lg">مشاركة</span>
        </button>

        {/* Download Button - MANDATORY */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm",
            isDownloading 
              ? "bg-emerald-500" 
              : "bg-white/10 group-hover:bg-white/25"
          )}>
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </div>
          <span className="text-white text-[10px] font-medium drop-shadow-lg">
            {isDownloading ? '...' : 'تحميل'}
          </span>
        </button>

        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/25 transition-all">
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </div>
          <span className="text-white text-[10px] font-medium drop-shadow-lg">
            {isMuted ? 'صوت' : 'كتم'}
          </span>
        </button>
      </div>

      {/* Play Button Overlay (when loading) */}
      {isActive && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
