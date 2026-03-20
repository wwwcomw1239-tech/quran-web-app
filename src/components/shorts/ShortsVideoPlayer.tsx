'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, Share2, Download, Volume2, VolumeX, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getEmbedUrl, getWhatsAppShareUrl, YouTubeVideo } from '@/lib/youtube';

interface ShortsVideoPlayerProps {
  video: YouTubeVideo;
  isActive: boolean;
  onLike?: (videoId: string) => void;
  isLiked?: boolean;
}

export function ShortsVideoPlayer({ video, isActive, onLike, isLiked = false }: ShortsVideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle video visibility and auto-play
  useEffect(() => {
    if (!iframeRef.current) return;

    if (isActive) {
      // Video is in view - play
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        '*'
      );
    } else {
      // Video is out of view - pause
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
      setIsLoaded(false);
    }
  }, [isActive]);

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!iframeRef.current) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (newMuted) {
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"mute","args":""}',
        '*'
      );
    } else {
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"unMute","args":""}',
        '*'
      );
    }
  }, [isMuted]);

  // Share to WhatsApp
  const handleShare = useCallback(() => {
    const shareUrl = getWhatsAppShareUrl(video.id, video.title);
    window.open(shareUrl, '_blank');
  }, [video]);

  // Download video - opens download service in new tab
  // Mandatory: Low quality is the default
  const handleDownload = useCallback(() => {
    setIsDownloading(true);
    // Use a popular YouTube download service
    // ssyoutube.com is a trusted redirect service for downloads
    const downloadUrl = `https://www.ssyoutube.com/watch?v=${video.id}`;
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => setIsDownloading(false), 1000);
  }, [video]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black flex items-center justify-center"
    >
      {/* Loading Skeleton - True Black Background */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-white/70 text-sm">جاري التحميل...</p>
          </div>
        </div>
      )}

      {/* YouTube Iframe - pointer-events: none prevents redirect to YouTube */}
      <iframe
        ref={iframeRef}
        src={getEmbedUrl(video.id)}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={false}
        onLoad={handleIframeLoad}
        style={{ 
          border: 'none',
          pointerEvents: 'none', // CRITICAL: Prevents clicks from going to YouTube
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

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
      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-20">
        {/* Like Button */}
        <button
          onClick={() => onLike?.(video.id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm",
            isLiked 
              ? "bg-red-500 text-white" 
              : "bg-white/10 text-white group-hover:bg-white/20"
          )}>
            <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-lg">
            {isLiked ? 'أعجبك' : 'إعجاب'}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/20 transition-all">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-lg">مشاركة</span>
        </button>

        {/* Download Button - MANDATORY: Always visible and accessible */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm",
            isDownloading 
              ? "bg-emerald-500" 
              : "bg-white/10 group-hover:bg-white/20"
          )}>
            {isDownloading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Download className="w-6 h-6" />
            )}
          </div>
          <span className="text-white text-xs font-medium drop-shadow-lg">
            {isDownloading ? '...' : 'تحميل'}
          </span>
        </button>

        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/20 transition-all">
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </div>
          <span className="text-white text-xs font-medium drop-shadow-lg">
            {isMuted ? 'صوت' : 'كتم'}
          </span>
        </button>
      </div>

      {/* Play Button Overlay (when loading) */}
      {isActive && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-10 h-10 text-white fill-current ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
