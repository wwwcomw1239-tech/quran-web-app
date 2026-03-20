/**
 * Internet Archive API Fetcher for Islamic Content
 * Client-side fetching with CORS proxy fallback
 */

// Archive.org Advanced Search API base URL
const ARCHIVE_API_BASE = 'https://archive.org/advancedsearch.php';

// Cloudflare Worker proxy URL for CORS bypass
const CORS_PROXY = 'https://quran-proxy.wwwcomw1239.workers.dev/cors';

// Video interface
export interface ShortsVideo {
  id: string;
  identifier: string;
  title: string;
  author: string;
  videoUrl: string;
  thumbnail?: string;
  duration: number;
  format: string;
  type: 'quran' | 'sermon';
}

// Archive.org search response
interface ArchiveSearchResponse {
  response: {
    numFound: number;
    start: number;
    docs: ArchiveDoc[];
  };
}

interface ArchiveDoc {
  identifier: string;
  title?: string;
  creator?: string | string[];
  format?: string | string[];
  length?: unknown;
  mediatype?: string;
}

// Archive.org metadata response
interface ArchiveMetadata {
  files?: ArchiveFile[];
  metadata?: {
    title?: string;
    creator?: string | string[];
  };
}

interface ArchiveFile {
  name: string;
  format?: string;
  size?: string;
  length?: string;
}

/**
 * Robust duration parser - handles ALL Archive.org formats
 */
function parseDurationToSeconds(length: unknown): number {
  if (length === null || length === undefined) return 0;

  // Handle arrays
  if (Array.isArray(length)) {
    if (length.length === 0) return 0;
    return parseDurationToSeconds(length[0]);
  }

  // Handle numbers
  if (typeof length === 'number') {
    return Math.round(length);
  }

  // Handle strings
  if (typeof length === 'string') {
    const trimmed = length.trim();
    
    // Plain number
    const numValue = parseFloat(trimmed);
    if (!isNaN(numValue) && numValue > 0) {
      return Math.round(numValue);
    }

    // Time format (HH:MM:SS or MM:SS)
    const timeParts = trimmed.split(':').map(p => parseInt(p, 10));
    if (timeParts.length === 3 && !timeParts.some(isNaN)) {
      return timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    } else if (timeParts.length === 2 && !timeParts.some(isNaN)) {
      return timeParts[0] * 60 + timeParts[1];
    }

    // "sec", "seconds", "min", "minutes"
    const secMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:sec|seconds?)/i);
    if (secMatch) {
      return Math.round(parseFloat(secMatch[1]));
    }

    const minMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:min|minutes?)/i);
    if (minMatch) {
      return Math.round(parseFloat(minMatch[1]) * 60);
    }
  }

  return 0;
}

/**
 * Fetch with CORS proxy fallback
 */
async function fetchWithCors(url: string, timeout: number = 15000): Promise<Response> {
  try {
    // Try direct fetch first
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeout),
    });
    if (response.ok) return response;
  } catch (e) {
    console.log('Direct fetch failed, trying CORS proxy');
  }

  // Use CORS proxy
  const proxyUrl = `${CORS_PROXY}?url=${encodeURIComponent(url)}`;
  return fetch(proxyUrl, {
    signal: AbortSignal.timeout(timeout),
  });
}

/**
 * Build multiple search queries with fallbacks
 */
function buildSearchQueries(): string[] {
  // Primary - English scholar names (more likely to have results)
  const englishScholars = '(title:"Ibn Uthaymeen" OR title:"Ibn Baz" OR title:"Salih Al-Fawzan" OR title:"Sulaiman Al-Ruhaili") AND mediatype:(movies)';
  
  // Fallback 1 - Generic Islamic/Quran
  const islamicContent = '(title:"Quran" OR title:"Islamic Lecture" OR title:"Muslim") AND mediatype:(movies)';
  
  // Fallback 2 - Short films
  const shortFilms = 'mediatype:(movies) AND collection:(shortfilms)';
  
  return [englishScholars, islamicContent, shortFilms];
}

/**
 * Fetch videos from Internet Archive
 */
export async function fetchArchiveVideos(maxResults: number = 30): Promise<ShortsVideo[]> {
  const queries = buildSearchQueries();
  
  for (const query of queries) {
    try {
      console.log(`[Archive] Trying query: ${query.substring(0, 50)}...`);
      
      const params = new URLSearchParams({
        q: query,
        fl: 'identifier,title,creator,format,length,mediatype',
        output: 'json',
        rows: maxResults.toString(),
        page: '1',
      });

      const searchUrl = `${ARCHIVE_API_BASE}?${params.toString()}`;
      
      const response = await fetchWithCors(searchUrl, 20000);

      if (!response.ok) {
        console.error(`[Archive] HTTP error: ${response.status}`);
        continue;
      }

      const data: ArchiveSearchResponse = await response.json();
      console.log(`[Archive] Response: ${data.response.numFound} results, ${data.response.docs.length} docs`);

      if (data.response.docs.length === 0) {
        continue;
      }

      // Process videos
      const videos: ShortsVideo[] = [];
      
      for (const doc of data.response.docs) {
        try {
          const video = await processArchiveDoc(doc);
          // Filter: duration must be > 0 and <= 300 seconds (5 min)
          if (video && video.duration > 0 && video.duration <= 300) {
            videos.push(video);
          }
        } catch (e) {
          console.warn(`[Archive] Error processing ${doc.identifier}`);
        }
      }

      console.log(`[Archive] Processed ${videos.length} valid short videos`);

      if (videos.length > 0) {
        return shuffleArray(videos);
      }
      
    } catch (error) {
      console.error(`[Archive] Query failed:`, error);
      continue;
    }
  }

  console.error('[Archive] All queries failed');
  return getFallbackVideos();
}

/**
 * Process a single Archive document
 */
async function processArchiveDoc(doc: ArchiveDoc): Promise<ShortsVideo | null> {
  if (!doc.identifier) return null;

  try {
    const duration = parseDurationToSeconds(doc.length);
    
    const mp4File = await getMP4FileFromItem(doc.identifier);
    if (!mp4File) return null;

    const videoUrl = `https://archive.org/download/${doc.identifier}/${encodeURIComponent(mp4File.name)}`;
    const title = doc.title || 'Untitled';
    
    const author = Array.isArray(doc.creator) 
      ? doc.creator.join(', ') 
      : doc.creator || 'Unknown';

    return {
      id: doc.identifier,
      identifier: doc.identifier,
      title: title,
      author: author,
      videoUrl: videoUrl,
      thumbnail: `https://archive.org/services/img/${doc.identifier}`,
      duration: duration,
      format: mp4File.format || 'MP4',
      type: determineContentType(title),
    };

  } catch (error) {
    return null;
  }
}

/**
 * Get MP4 file from Archive item
 */
async function getMP4FileFromItem(identifier: string): Promise<ArchiveFile | null> {
  try {
    const metadataUrl = `https://archive.org/metadata/${identifier}`;
    
    const response = await fetchWithCors(metadataUrl, 15000);
    if (!response.ok) return null;

    const data: ArchiveMetadata = await response.json();
    
    if (!data.files || !Array.isArray(data.files)) return null;

    const mp4Files = data.files.filter(f => {
      const format = (f.format || '').toLowerCase();
      const name = (f.name || '').toLowerCase();
      return format.includes('mp4') || 
             format.includes('h.264') || 
             name.endsWith('.mp4');
    });

    if (mp4Files.length === 0) return null;

    // Prefer smaller files
    mp4Files.sort((a, b) => parseInt(a.size || '0') - parseInt(b.size || '0'));

    return mp4Files[0];

  } catch (error) {
    return null;
  }
}

/**
 * Determine content type from title
 */
function determineContentType(title: string): 'quran' | 'sermon' {
  const quranKeywords = ['quran', 'surah', 'recitation', 'قرآن', 'سورة', 'تلاوة'];
  const lowerTitle = title.toLowerCase();
  
  for (const keyword of quranKeywords) {
    if (lowerTitle.includes(keyword)) return 'quran';
  }
  
  return 'sermon';
}

/**
 * Fisher-Yates shuffle
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
 * Fallback videos (guaranteed working)
 */
export function getFallbackVideos(): ShortsVideo[] {
  return [
    {
      id: 'fallback-1',
      identifier: 'sample-quran-1',
      title: 'سورة الرحمن - تلاوة خاشعة',
      author: 'قارئ',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: '/icons/icon-512x512.png',
      duration: 10,
      format: 'MP4',
      type: 'quran',
    },
    {
      id: 'fallback-2',
      identifier: 'sample-lecture-1',
      title: 'خطبة قصيرة - نصيحة غالية',
      author: 'شيخ',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnail: '/icons/icon-512x512.png',
      duration: 12,
      format: 'MP4',
      type: 'sermon',
    },
    {
      id: 'fallback-3',
      identifier: 'sample-quran-2',
      title: 'أذكار الصباح والمساء',
      author: 'قارئ',
      videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      thumbnail: '/icons/icon-512x512.png',
      duration: 30,
      format: 'MP4',
      type: 'quran',
    },
  ];
}

/**
 * Get download URL through proxy
 */
export function getArchiveDownloadUrl(videoUrl: string): string {
  return `https://quran-proxy.wwwcomw1239.workers.dev/download?url=${encodeURIComponent(videoUrl)}`;
}
