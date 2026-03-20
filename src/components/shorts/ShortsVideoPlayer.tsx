'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, Share2, Download, Volume2, VolumeX, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShortsVideo, getArchiveDownloadUrl } from '@/lib/archiveFetch';

interface ShortsVideoPlayerProps {
  video: ShortsVideo;
  isActive: boolean;
  onLike?: (videoId: string) => void;
  isLiked?: boolean;
}

export function ShortsVideoPlayer({ video, isActive, onLike, isLiked = false }: ShortsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [videoOrientation, setVideoOrientation] = useState<'vertical' | 'horizontal'>('vertical');

  // Reset state when video changes
  useEffect(() => {
    setIsLoaded(false);
    setShowPlayButton(false);
  }, [video.id]);

  // Handle auto-play when video becomes active
  useEffect(() => {
    const videoElement = videoRef.current;
    const bgVideoElement = bgVideoRef.current;
    if (!videoElement) return;

    if (isActive) {
      videoElement.muted = true;
      videoElement.play().then(() => {
        setIsMuted(true);
        setIsLoaded(true);
        if (bgVideoElement) {
          bgVideoElement.muted = true;
          bgVideoElement.play().catch(() => {});
        }
      }).catch((error) => {
        console.warn('Autoplay prevented:', error);
        setShowPlayButton(true);
      });
    } else {
      videoElement.pause();
      videoElement.currentTime = 0;
      if (bgVideoElement) {
        bgVideoElement.pause();
        bgVideoElement.currentTime = 0;
      }
      setIsLoaded(false);
    }
  }, [isActive]);

  // Detect video orientation
  const handleVideoLoadedMetadata = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const { videoWidth, videoHeight } = videoElement;
    setVideoOrientation(videoWidth > videoHeight ? 'horizontal' : 'vertical');
  }, []);

  // Toggle mute/unmute
  const toggleMute = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newMuted = !isMuted;
    videoElement.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  // Manual play
  const handleManualPlay = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = isMuted;
    videoElement.play().then(() => {
      setShowPlayButton(false);
      setIsLoaded(true);
    }).catch((error) => {
      console.warn('Manual play failed:', error);
    });
  }, [isMuted]);

  // Share to WhatsApp
  const handleShare = useCallback(() => {
    const text = `${video.title}\n- ${video.author}\n\nمن تطبيق نور القرآن`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }, [video]);

  // Download video - through proxy for CORS bypass
  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      const downloadUrl = getArchiveDownloadUrl(video.videoUrl);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${video.title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.mp4`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
    }
    setTimeout(() => setIsDownloading(false), 1500);
  }, [video]);

  // Handle video loaded
  const handleVideoLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Handle video error
  const handleVideoError = useCallback(() => {
    console.error('Video failed to load:', video.videoUrl);
    setShowPlayButton(true);
  }, [video.videoUrl]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Loading Skeleton - True Black Background */}
      {!isLoaded && !showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
            <p className="text-white/70 text-sm bg-black/50 px-4 py-1 rounded-full">جاري التحميل...</p>
          </div>
        </div>
      )}

      {/* Blurred Background Video (for horizontal videos) */}
      {videoOrientation === 'horizontal' && (
        <video
          ref={bgVideoRef}
          src={video.videoUrl}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
          style={{ filter: 'blur(20px)' }}
        />
      )}

      {/* Main Video Player */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        playsInline
        preload="metadata"
        className={cn(
          "relative z-[1]",
          videoOrientation === 'horizontal'
            ? "h-full w-auto max-w-full object-contain"
            : "w-full h-full object-cover"
        )}
        onLoadedMetadata={handleVideoLoadedMetadata}
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        poster={video.thumbnail}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none z-[2]" />

      {/* Video Info - Bottom */}
      <div className="absolute bottom-20 left-4 right-20 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
            video.type === 'quran'
              ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
              : "bg-blue-500/30 text-blue-300 border border-blue-500/30"
          )}>
            {video.type === 'quran' ? 'تلاوة Quran' : 'خطبة Sermon'}
          </span>
          <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-white/10 text-white/70 backdrop-blur-sm">
            {formatDuration(video.duration)}
          </span>
        </div>
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">
          {video.title}
        </h3>
        <p className="text-white/70 text-sm mt-1 drop-shadow-lg">
          {video.author}
        </p>
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

      {/* Manual Play Button */}
      {showPlayButton && (
        <button
          onClick={handleManualPlay}
          className="absolute inset-0 flex items-center justify-center z-20 bg-black/30"
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
            <Play className="w-10 h-10 text-white fill-current ml-1" />
          </div>
        </button>
      )}

      {/* Play Button Overlay */}
      {isActive && !isLoaded && !showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 */
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
