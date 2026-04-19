'use client';

import { useState, useCallback } from 'react';

interface OptimizedThumbnailProps {
  youtubeId: string;
  alt: string;
  className?: string;
  quality?: 'mq' | 'hq' | 'sd' | 'maxres';
  priority?: boolean;
}

/**
 * صورة مصغرة محسنة ليوتيوب
 * - Lazy loading افتراضي
 * - Async decoding لعدم حجب الـ thread
 * - Fallback عند فشل تحميل الصورة
 */
export function OptimizedThumbnail({
  youtubeId,
  alt,
  className = '',
  quality = 'mq',
  priority = false,
}: OptimizedThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  const qualityMap = {
    mq: 'mqdefault',   // 320x180 - سريع جداً
    hq: 'hqdefault',   // 480x360 - مناسب
    sd: 'sddefault',   // 640x480 - ثقيل
    maxres: 'maxresdefault', // 1280x720 - ثقيل جداً
  };

  const primarySrc = `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}.jpg`;
  const fallbackSrc = `https://img.youtube.com/vi/${youtubeId}/default.jpg`;

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <img
      src={hasError ? fallbackSrc : primarySrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'low'}
      onError={handleError}
    />
  );
}
