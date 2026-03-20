/**
 * Video data source for Shorts
 * 
 * Primary: Cloudflare Worker API (https://quran-proxy.wwwcomw1239.workers.dev/api/shorts)
 * Fallback: Local shorts.json
 */

// Video interface
export interface ShortsVideo {
  id: string;
  title: string;
  author: string;
  videoUrl: string;
  thumbnail?: string;
  duration: number;
  type: 'quran' | 'sermon';
}

// Local fallback data (used when Worker is unavailable)
const LOCAL_VIDEOS: ShortsVideo[] = [
  {
    id: 'quran-1',
    title: 'سورة الأنبياء - تلاوة خاشعة',
    author: 'الشيخ عبدالباسط عبدالصمد',
    videoUrl: 'https://archive.org/download/a0251204aaaaaaaaaaa/%C2%AB%20%D8%A3%D9%8E%D8%A5%D9%8B%D9%84%D9%8E%D9%B0%D9%87%D9%8C%20%D9%85%D9%8E%D9%91%D8%B9%D9%8E%20%D8%A7%D9%84%D9%84%D9%8E%D9%91%D9%87%D9%8B%20%C2%BB%20%D8%AA%D9%84%D8%A7%D9%88%D8%A9%20%D8%AE%D8%A7%D8%B4%D8%B9%D8%A9%20%D8%AC%D8%AF%D8%A7%D9%8B%20%D8%A8%D8%B5%D9%88%D8%AA%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B5%D9%85%D8%AF.mp4',
    thumbnail: '/icons/icon-512x512.png',
    duration: 60,
    type: 'quran',
  },
  {
    id: 'quran-2',
    title: 'ألم نجعل له عينين - مرئيات',
    author: 'الشيخ عبدالباسط عبدالصمد',
    videoUrl: 'https://archive.org/download/a0251204aaaaaaaaaaa/%C2%AB%20%D8%A3%D9%8E%D9%84%D9%8E%D9%85%D9%92%20%D9%86%D9%8E%D8%AC%D9%8E%D8%B9%D9%8E%D9%84%D9%92%20%D9%84%D9%8E%D9%87%D9%8F%20%D8%B9%D9%8E%D9%8A%D9%92%D9%86%D9%8E%D9%8A%D9%92%D9%86%D9%8E%20%D9%88%D9%8E%D9%84%D9%90%D8%B3%D9%8E%D8%A7%D9%86%D9%8B%D8%A7%20%D9%88%D9%8E%D8%B4%D9%8E%D9%81%D9%8E%D8%AA%D9%8E%D9%8A%D9%92%D9%86%D9%8E%20%C2%BB%20%D9%85%D9%86%20%D8%A3%D8%AC%D9%85%D9%84%20%D9%85%D8%B1%D8%A6%D9%8A%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B5%D9%85%D8%AF.mp4',
    thumbnail: '/icons/icon-512x512.png',
    duration: 60,
    type: 'quran',
  },
];

// Worker API URL
const WORKER_API_URL = 'https://quran-proxy.wwwcomw1239.workers.dev/api/shorts';

// Worker API response interface
interface WorkerAPIResponse {
  success: boolean;
  count: number;
  videos: ShortsVideo[];
  source: string;
}

/**
 * Get videos from Worker API (primary) with local fallback
 */
export async function getVideos(): Promise<ShortsVideo[]> {
  try {
    // Check sessionStorage cache first (5 minutes)
    const cached = sessionStorage.getItem('shorts-videos-cache');
    if (cached) {
      const { videos, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000 && videos.length > 0) {
        console.log('[Shorts] Using cached videos');
        return videos;
      }
    }

    // Fetch from Worker API
    console.log('[Shorts] Fetching from Worker API...');
    const response = await fetch(WORKER_API_URL, {
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const data: WorkerAPIResponse = await response.json();
      
      if (data.success && data.videos && data.videos.length > 0) {
        console.log(`[Shorts] Got ${data.videos.length} videos from ${data.source}`);
        
        // Cache the result
        sessionStorage.setItem('shorts-videos-cache', JSON.stringify({
          videos: data.videos,
          timestamp: Date.now(),
        }));

        return shuffleArray(data.videos);
      }
    }
  } catch (error) {
    console.warn('[Shorts] Worker API failed, using local fallback:', error);
  }

  // Return local videos as fallback
  console.log('[Shorts] Using local fallback videos');
  return shuffleArray(LOCAL_VIDEOS);
}

/**
 * Get download URL (through proxy for CORS bypass)
 */
export function getDownloadUrl(videoUrl: string): string {
  // Route through Worker proxy for CORS bypass
  return `https://quran-proxy.wwwcomw1239.workers.dev/download?url=${encodeURIComponent(videoUrl)}`;
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
