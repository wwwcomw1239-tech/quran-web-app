'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, Share2, Download, Volume2, VolumeX, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShortsVideo, getDownloadUrl } from '@/lib/archiveFetch';

interface ShortsVideoPlayerProps {
  video: ShortsVideo;
  isActive: boolean;
  onLike?: (videoId: string) => void;
  isLiked?: boolean;
}

export function ShortsVideoPlayer({ video, isActive, onLike, isLiked = false }: ShortsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [videoOrientation, setVideoOrientation] = useState<'vertical' | 'horizontal'>('vertical');

  useEffect(() => {
    setIsLoaded(false);
    setShowPlayButton(false);
  }, [video.id]);

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
      }).catch(() => setShowPlayButton(true));
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

  const handleVideoLoadedMetadata = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const { videoWidth, videoHeight } = videoElement;
    setVideoOrientation(videoWidth > videoHeight ? 'horizontal' : 'vertical');
  }, []);

  const toggleMute = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const newMuted = !isMuted;
    videoElement.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  const handleManualPlay = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.muted = isMuted;
    videoElement.play().then(() => {
      setShowPlayButton(false);
      setIsLoaded(true);
    }).catch(() => {});
  }, [isMuted]);

  const handleShare = useCallback(() => {
    const text = `${video.title}\n- ${video.author}\n\nمن تطبيق نور القرآن`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [video]);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      const downloadUrl = getDownloadUrl(video.videoUrl);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${video.title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.mp4`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
    }
    setTimeout(() => setIsDownloading(false), 1500);
  }, [video]);

  const handleVideoLoaded = useCallback(() => setIsLoaded(true), []);
  const handleVideoError = useCallback(() => setShowPlayButton(true), []);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {!isLoaded && !showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
            <p className="text-white/70 text-sm bg-black/50 px-4 py-1 rounded-full">جاري التحميل...</p>
          </div>
        </div>
      )}

      {videoOrientation === 'horizontal' && (
        <video ref={bgVideoRef} src={video.videoUrl} loop muted playsInline className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60" style={{ filter: 'blur(20px)' }} />
      )}

      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        playsInline
        preload="metadata"
        className={cn("relative z-[1]", videoOrientation === 'horizontal' ? "h-full w-auto max-w-full object-contain" : "w-full h-full object-cover")}
        onLoadedMetadata={handleVideoLoadedMetadata}
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        poster={video.thumbnail}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none z-[2]" />

      <div className="absolute bottom-20 left-4 right-20 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm", video.type === 'quran' ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/30" : "bg-blue-500/30 text-blue-300 border border-blue-500/30")}>
            {video.type === 'quran' ? 'تلاوة Quran' : 'خطبة Sermon'}
          </span>
          {video.duration > 0 && (
            <span className="px-2 py-1 rounded-full text-[10px] bg-white/10 text-white/70 backdrop-blur-sm">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">{video.title}</h3>
        <p className="text-white/70 text-sm mt-1 drop-shadow-lg">{video.author}</p>
      </div>

      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-4 z-20">
        <button onClick={() => onLike?.(video.id)} className="flex flex-col items-center gap-1 group">
          <div className={cn("w-11 h-11 rounded-full flex items-center justify-center transition-all backdrop-blur-sm", isLiked ? "bg-red-500 text-white" : "bg-white/10 text-white group-hover:bg-white/25")}>
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
          </div>
          <span className="text-white text-[10px] drop-shadow-lg">{isLiked ? 'أعجبك' : 'إعجاب'}</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/25">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-white text-[10px] drop-shadow-lg">مشاركة</span>
        </button>
        <button onClick={handleDownload} disabled={isDownloading} className="flex flex-col items-center gap-1 group">
          <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm", isDownloading ? "bg-emerald-500" : "bg-white/10 group-hover:bg-white/25")}>
            {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          </div>
          <span className="text-white text-[10px] drop-shadow-lg">{isDownloading ? '...' : 'تحميل'}</span>
        </button>
        <button onClick={toggleMute} className="flex flex-col items-center gap-1 group">
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/25">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </div>
          <span className="text-white text-[10px] drop-shadow-lg">{isMuted ? 'صوت' : 'كتم'}</span>
        </button>
      </div>

      {showPlayButton && (
        <button onClick={handleManualPlay} className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30">
            <Play className="w-10 h-10 text-white fill-current ml-1" />
          </div>
        </button>
      )}

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

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
