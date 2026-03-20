/**
 * Video data source for Shorts
 * Primary: Local JSON file (reliable)
 * Fallback: Internet Archive API (dynamic)
 */

// Local video data (imported at build time)
import localShortsData from '@/data/shorts.json';

// Video interface
export interface ShortsVideo {
  id: string;
  identifier?: string;
  title: string;
  author: string;
  videoUrl: string;
  thumbnail?: string;
  duration: number;
  format?: string;
  type: 'quran' | 'sermon';
}

// Archive.org API base URL
const ARCHIVE_API_BASE = 'https://archive.org/advancedsearch.php';
const CORS_PROXY = 'https://quran-proxy.wwwcomw1239.workers.dev/cors';

/**
 * Get videos from local JSON file (most reliable)
 */
export function getLocalVideos(): ShortsVideo[] {
  return localShortsData as ShortsVideo[];
}

/**
 * Fetch with CORS proxy fallback
 */
async function fetchWithCors(url: string, timeout: number = 15000): Promise<Response> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeout),
    });
    if (response.ok) return response;
  } catch (e) {
    console.log('[Archive] Direct fetch failed, trying CORS proxy');
  }

  try {
    const proxyUrl = `${CORS_PROXY}?url=${encodeURIComponent(url)}`;
    return fetch(proxyUrl, {
      signal: AbortSignal.timeout(timeout),
    });
  } catch (e) {
    throw new Error('Both direct and proxy fetch failed');
  }
}

/**
 * Robust duration parser
 */
function parseDurationToSeconds(length: unknown): number {
  if (length === null || length === undefined) return 0;
  if (Array.isArray(length)) return length.length > 0 ? parseDurationToSeconds(length[0]) : 0;
  if (typeof length === 'number') return Math.round(length);
  if (typeof length === 'string') {
    const numValue = parseFloat(length);
    if (!isNaN(numValue) && numValue > 0) return Math.round(numValue);
    const timeParts = length.split(':').map(p => parseInt(p, 10));
    if (timeParts.length === 3 && !timeParts.some(isNaN)) return timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    if (timeParts.length === 2 && !timeParts.some(isNaN)) return timeParts[0] * 60 + timeParts[1];
  }
  return 0;
}

/**
 * Fetch from Internet Archive (with fallback)
 */
async function fetchArchiveVideos(maxResults: number = 20): Promise<ShortsVideo[]> {
  const queries = [
    '(title:"Quran" OR title:"Islamic") AND mediatype:(movies)',
    'mediatype:(movies) AND collection:(shortfilms)',
  ];

  for (const query of queries) {
    try {
      const params = new URLSearchParams({
        q: query,
        fl: 'identifier,title,creator,format,length',
        output: 'json',
        rows: maxResults.toString(),
      });

      const response = await fetchWithCors(`${ARCHIVE_API_BASE}?${params}`, 20000);
      if (!response.ok) continue;

      const data = await response.json();
      const docs = data.response?.docs || [];
      
      if (docs.length === 0) continue;

      const videos: ShortsVideo[] = [];
      for (const doc of docs) {
        const duration = parseDurationToSeconds(doc.length);
        if (duration > 0 && duration <= 300) {
          const videoUrl = `https://archive.org/download/${doc.identifier}/${doc.identifier}.mp4`;
          videos.push({
            id: doc.identifier,
            identifier: doc.identifier,
            title: doc.title || 'Untitled',
            author: Array.isArray(doc.creator) ? doc.creator.join(', ') : doc.creator || 'Unknown',
            videoUrl,
            thumbnail: `https://archive.org/services/img/${doc.identifier}`,
            duration,
            format: 'MP4',
            type: determineContentType(doc.title || ''),
          });
        }
      }

      if (videos.length > 0) return shuffleArray(videos);
    } catch (e) {
      console.error('[Archive] Query failed:', e);
      continue;
    }
  }

  return [];
}

/**
 * Determine content type
 */
function determineContentType(title: string): 'quran' | 'sermon' {
  const quranKeywords = ['quran', 'surah', 'recitation', 'قرآن', 'سورة', 'تلاوة'];
  return quranKeywords.some(k => title.toLowerCase().includes(k)) ? 'quran' : 'sermon';
}

/**
 * Shuffle array
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
 * Main function: Get videos (local first, then Archive)
 */
export async function getVideos(): Promise<ShortsVideo[]> {
  // Always start with local videos (guaranteed to work)
  const localVideos = getLocalVideos();
  
  // Try to fetch additional videos from Archive (in background)
  try {
    const archiveVideos = await fetchArchiveVideos(10);
    if (archiveVideos.length > 0) {
      // Combine local + archive, remove duplicates
      const allVideos = [...localVideos];
      const localIds = new Set(localVideos.map(v => v.id));
      
      for (const video of archiveVideos) {
        if (!localIds.has(video.id)) {
          allVideos.push(video);
        }
      }
      
      return shuffleArray(allVideos);
    }
  } catch (e) {
    console.log('[Archive] Using local videos only');
  }

  return shuffleArray(localVideos);
}

/**
 * Get download URL (through proxy for CORS)
 */
export function getDownloadUrl(videoUrl: string): string {
  // Route through proxy for CORS bypass
  if (videoUrl.includes('archive.org') || videoUrl.includes('w3schools') || videoUrl.includes('sample-videos')) {
    return `https://quran-proxy.wwwcomw1239.workers.dev/download?url=${encodeURIComponent(videoUrl)}`;
  }
  return videoUrl;
}
