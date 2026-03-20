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
}

// In-memory cache
let cachedVideos: YouTubeVideo[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

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
 * Fetch videos from a single YouTube playlist using Invidious API
 */
async function fetchPlaylistVideos(playlistId: string, type: 'quran' | 'sermon'): Promise<YouTubeVideo[]> {
  try {
    // Try Invidious API instances (open-source YouTube frontend)
    const invidiousInstances = [
      'https://vid.puffyan.us',
      'https://invidious.snopyta.org',
      'https://yewtu.be',
      'https://invidious.kavin.rocks',
      'https://inv.riverside.rocks',
    ];

    for (const instance of invidiousInstances) {
      try {
        const response = await fetch(`${instance}/api/v1/playlists/${playlistId}`, {
          signal: AbortSignal.timeout(8000),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.videos && Array.isArray(data.videos)) {
            return data.videos.map((video: any) => ({
              id: video.videoId,
              title: video.title || 'Untitled',
              thumbnail: video.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
              playlistId,
              type,
            }));
          }
        }
      } catch (e) {
        continue;
      }
    }

    console.warn(`Could not fetch playlist ${playlistId}`);
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

  // Shuffle the combined array
  const shuffledVideos = shuffleArray(allVideos);

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
 * CRITICAL: playsinline=1 ensures videos play inline, NOT in YouTube app
 */
export function getEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    playsinline: '1',      // CRITICAL: Prevents YouTube app redirect
    modestbranding: '1',   // Reduce YouTube branding
    showinfo: '0',         // Hide video info
    rel: '0',              // No related videos
    fs: '0',               // Disable fullscreen button
    controls: '1',         // Show controls for pause/play
    iv_load_policy: '3',   // Hide annotations
    disablekb: '1',        // Disable keyboard controls
    loop: '1',             // Loop video
    playlist: videoId,     // Required for loop
    mute: '1',             // Start muted for autoplay (browser policy)
    origin: typeof window !== 'undefined' ? window.location.origin : '',
    enablejsapi: '1',      // Enable JS API for control
  });
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Get YouTube video thumbnail
 */
export function getThumbnail(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
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
  const proxyUrl = 'https://quran-proxy.wwwcomw1239.workers.dev';
  return `${proxyUrl}/youtube-download?id=${videoId}&quality=${quality}`;
}
