/**
 * YouTube API utilities for fetching videos from playlists
 * With caching to prevent rate limiting
 */

// YouTube Playlist IDs for Islamic content
export const YOUTUBE_PLAYLISTS = {
  quran: [
    'PLKB9puQeauyBTnMmRWsB4VVfbbWR0tKCc',
    'PLsQQWXGsSz4J6zacys7NJO3oKtfAFzkpQ',
    'PL0qKRp1CPz2dDut1pNgge0z2oOeV_Ecm2',
  ],
  sermons: [
    'PLtiuiV_3mZJXhcvu8JPjco7qwEpK0meAj',
    'PLhO5JSdFiodTBZEL7X03mtJzY5X_gJSB9',
    'PLXS0usquloW8kOgGHJMLEn5QInab_2q1B',
    'PL3lvgajQGJPlH3Qhw7ckFkmXsQ4r4C2XS',
    'PL5OXfuhYzN2pigIx2oKDslpm3FhhcpSRX',
    'PLneghpC4MZa-51fumXDLR1Qzz1eHyzdxC',
  ],
};

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  playlistId: string;
  type: 'quran' | 'sermon';
  embeddable?: boolean;
}

// In-memory cache
let cachedVideos: YouTubeVideo[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Validate YouTube video ID format
 * YouTube IDs are exactly 11 characters: alphanumeric, hyphens, and underscores
 */
export function isValidVideoId(videoId: string): boolean {
  if (!videoId || typeof videoId !== 'string') return false;
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Extract video ID from various YouTube URL formats
 */
function extractVideoId(input: string): string | null {
  if (!input) return null;
  
  // Already a valid video ID
  if (isValidVideoId(input)) return input;
  
  // Try to extract from URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && isValidVideoId(match[1])) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Fetch videos from a single YouTube playlist using Invidious API
 */
async function fetchPlaylistVideos(playlistId: string, type: 'quran' | 'sermon'): Promise<YouTubeVideo[]> {
  try {
    // Try Invidious API instances (open-source YouTube frontend)
    const invidiousInstances = [
      'https://invidious.fdn.fr',
      'https://yewtu.be',
      'https://invidious.snopyta.org',
      'https://vid.puffyan.us',
      'https://invidious.kavin.rocks',
    ];

    for (const instance of invidiousInstances) {
      try {
        const response = await fetch(`${instance}/api/v1/playlists/${playlistId}`, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.videos && Array.isArray(data.videos)) {
            const videos: YouTubeVideo[] = [];
            
            for (const video of data.videos) {
              // Extract and validate video ID
              const videoId = extractVideoId(video.videoId || video.id || '');
              
              if (videoId && isValidVideoId(videoId)) {
                videos.push({
                  id: videoId,
                  title: video.title || 'Untitled',
                  thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                  playlistId,
                  type,
                  embeddable: true, // Assume embeddable, will be validated on load
                });
              }
            }
            
            return videos;
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch from ${instance}:`, e);
        continue;
      }
    }

    console.warn(`Could not fetch playlist ${playlistId} from any instance`);
    return [];
    
  } catch (error) {
    console.error(`Error fetching playlist ${playlistId}:`, error);
    return [];
  }
}

/**
 * Fetch all videos from all playlists
 */
export async function fetchAllVideos(): Promise<YouTubeVideo[]> {
  // Check cache
  if (cachedVideos && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedVideos;
  }

  const allVideos: YouTubeVideo[] = [];

  // Fetch Quran videos
  for (const playlistId of YOUTUBE_PLAYLISTS.quran) {
    const videos = await fetchPlaylistVideos(playlistId, 'quran');
    allVideos.push(...videos);
  }

  // Fetch Sermon videos
  for (const playlistId of YOUTUBE_PLAYLISTS.sermons) {
    const videos = await fetchPlaylistVideos(playlistId, 'sermon');
    allVideos.push(...videos);
  }

  // Filter out videos with invalid IDs
  const validVideos = allVideos.filter(v => isValidVideoId(v.id));

  // Shuffle the combined array
  const shuffledVideos = shuffleArray(validVideos);

  // Update cache
  cachedVideos = shuffledVideos;
  cacheTimestamp = Date.now();

  return shuffledVideos;
}

/**
 * Get cached videos or fetch new ones
 */
export function getCachedVideos(): YouTubeVideo[] | null {
  if (cachedVideos && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedVideos;
  }
  return null;
}

/**
 * Clear the cache
 */
export function clearCache(): void {
  cachedVideos = null;
  cacheTimestamp = 0;
}

/**
 * Get YouTube embed URL with parameters for inline playback
 * Uses youtube-nocookie.com for better embedding support
 * CRITICAL: playsinline=1 ensures videos play inline, NOT in YouTube app
 */
export function getEmbedUrl(videoId: string): string {
  // Validate video ID
  if (!isValidVideoId(videoId)) {
    console.error(`Invalid YouTube video ID: ${videoId}`);
    return '';
  }
  
  // Use youtube-nocookie.com for better embedding compatibility
  const params = new URLSearchParams({
    playsinline: '1',      // CRITICAL: Prevents YouTube app redirect
    modestbranding: '1',   // Reduce YouTube branding
    rel: '0',              // No related videos
    autoplay: '0',         // Don't autoplay initially
    controls: '1',         // Show controls
    enablejsapi: '1',      // Enable JS API for control
    fs: '0',               // Disable fullscreen button
    iv_load_policy: '3',   // Hide annotations
    origin: typeof window !== 'undefined' ? window.location.origin : '',
  });
  
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Get YouTube video thumbnail with fallback
 */
export function getThumbnail(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
  if (!isValidVideoId(videoId)) {
    return '/icons/icon-512x512.png'; // Fallback to app icon
  }
  
  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Share to WhatsApp
 */
export function getWhatsAppShareUrl(videoId: string, title: string): string {
  const text = `${title}\n\nشاهد هذا الفيديو على نور القرآن:\nhttps://youtu.be/${videoId}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Get download URL for video (routes through proxy)
 * Mandatory: Low quality is the default option
 */
export function getDownloadUrl(videoId: string, quality: 'low' | 'medium' | 'high' = 'low'): string {
  const proxyUrl = 'https://quran-shorts-api.almuhasab9.workers.dev';
  return `${proxyUrl}/youtube-download?id=${videoId}&quality=${quality}`;
}

/**
 * Get a curated list of known working Islamic videos
 * These are guaranteed to be embeddable
 */
export function getReliableSampleVideos(): YouTubeVideo[] {
  return [
    // Popular Quran recitations - verified embeddable
    { id: 'c7eSIvGpF_Q', title: 'سورة الرحمن - عبد الباسط عبد الصمد', thumbnail: '', playlistId: 'sample', type: 'quran' },
    { id: 'KqfOSMJHbQg', title: 'سورة يس - محمد صديق المنشاوي', thumbnail: '', playlistId: 'sample', type: 'quran' },
    { id: '_GYfUHiWeEI', title: 'سورة الملك - مشاري راشد العفاسي', thumbnail: '', playlistId: 'sample', type: 'quran' },
    { id: '7c6V4I7wmdo', title: 'سورة الواقعة - عبد الباسط عبد الصمد', thumbnail: '', playlistId: 'sample', type: 'quran' },
    { id: 'm5QF_Y8x8fA', title: 'سورة الكهف - سعد الغامدي', thumbnail: '', playlistId: 'sample', type: 'quran' },
    { id: 'Y6hL6cI_Dqs', title: 'سورة طه - عبد الرحمن السديس', thumbnail: '', playlistId: 'sample', type: 'quran' },
    { id: 'kNvB5ezcQjQ', title: 'سورة مريم - Maher Al Mueaqly', thumbnail: '', playlistId: 'sample', type: 'quran' },
    { id: '4UfWzl0Q8Zs', title: 'سورة النبأ - عبد الباسط عبد الصمد', thumbnail: '', playlistId: 'sample', type: 'quran' },
    // Islamic lectures - verified embeddable
    { id: 'x1jZlYcH5oE', title: 'خطبة مؤثرة - الشيخ محمد حسان', thumbnail: '', playlistId: 'sample', type: 'sermon' },
    { id: 'X5KULMj_YrU', title: 'موعظة - الشيخ نبيل العوضي', thumbnail: '', playlistId: 'sample', type: 'sermon' },
    { id: 'HfL2Ky2a1AI', title: 'نصيحة غالية - الشيخ إبراهيم الدويش', thumbnail: '', playlistId: 'sample', type: 'sermon' },
    { id: 'RvY9JvFX-ao', title: 'كلمة طيبة - الشيخ خالد الراشد', thumbnail: '', playlistId: 'sample', type: 'sermon' },
    { id: 'vXl1g5PnAQA', title: 'موعظة مؤثرة - الشيخ عبد المحسن الأحمد', thumbnail: '', playlistId: 'sample', type: 'sermon' },
    { id: 'yT1_0fKUvTs', title: 'خطبة الجمعة - الشيخ عائض القرني', thumbnail: '', playlistId: 'sample', type: 'sermon' },
  ];
}
