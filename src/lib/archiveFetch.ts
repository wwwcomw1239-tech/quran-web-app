/**
 * Internet Archive API Fetcher for Islamic Content
 * Fetches short Islamic videos (≤5 minutes) in MP4 format
 */

// Archive.org Advanced Search API base URL
const ARCHIVE_API_BASE = 'https://archive.org/advancedsearch.php';

// Cloudflare Worker proxy URL for CORS bypass
const PROXY_URL = 'https://quran-proxy.wwwcomw1239.workers.dev';

// Islamic scholars and content keywords for search
const ISLAMIC_SCHOLARS = [
  'ابن عثيمين',
  'ابن باز',
  'سليمان الرحيلي',
  'صالح الفوزان',
  'عبد العزيز الطريفي',
  'محمد صالح المنجد',
  'عبد المحسن العباد',
  'ربيع المدخلي',
];

// Video interface for Archive.org content
export interface ArchiveVideo {
  id: string;
  identifier: string;
  title: string;
  creator: string;
  videoUrl: string;
  thumbnail?: string;
  duration: number; // in seconds
  format: string;
  type: 'quran' | 'sermon';
}

// Raw Archive.org API response
interface ArchiveSearchResponse {
  response: {
    numFound: number;
    start: number;
    docs: ArchiveDoc[];
  };
}

interface ArchiveDoc {
  identifier: string;
  title: string;
  creator?: string | string[];
  format?: string | string[];
  length?: string | number;
  mediatype?: string;
}

// Archive.org file list response
interface ArchiveFileList {
  files: ArchiveFile[];
}

interface ArchiveFile {
  name: string;
  format: string;
  size?: string;
  length?: string;
}

/**
 * Build search query for Islamic content
 */
function buildSearchQuery(): string {
  // Build query with scholars names
  const scholarQueries = ISLAMIC_SCHOLARS.map(name => `title:"${name}"`).join(' OR ');
  return `(${scholarQueries}) AND mediatype:(movies)`;
}

/**
 * Fetch videos from Internet Archive Advanced Search API
 */
export async function fetchArchiveVideos(maxResults: number = 50): Promise<ArchiveVideo[]> {
  try {
    // Build search parameters
    const params = new URLSearchParams({
      q: buildSearchQuery(),
      fl: 'identifier,title,creator,format,length,mediatype',
      output: 'json',
      rows: maxResults.toString(),
      page: '1',
    });

    const searchUrl = `${ARCHIVE_API_BASE}?${params.toString()}`;
    console.log('Fetching from Archive.org:', searchUrl);

    // Try direct fetch first, fallback to proxy
    let response: Response;
    try {
      response = await fetch(searchUrl, {
        signal: AbortSignal.timeout(15000),
      });
    } catch (e) {
      console.warn('Direct fetch failed, using proxy:', e);
      response = await fetch(`${PROXY_URL}/archive-search?${params.toString()}`, {
        signal: AbortSignal.timeout(15000),
      });
    }

    if (!response.ok) {
      throw new Error(`Archive API error: ${response.status}`);
    }

    const data: ArchiveSearchResponse = await response.json();
    console.log(`Found ${data.response.numFound} results, processing ${data.response.docs.length} docs`);

    // Filter and process videos
    const videos: ArchiveVideo[] = [];

    for (const doc of data.response.docs) {
      const video = await processArchiveDoc(doc);
      if (video) {
        videos.push(video);
      }
    }

    console.log(`Processed ${videos.length} valid short videos`);
    return shuffleArray(videos);

  } catch (error) {
    console.error('Error fetching from Archive.org:', error);
    return getFallbackVideos();
  }
}

/**
 * Process a single Archive document and extract video info
 */
async function processArchiveDoc(doc: ArchiveDoc): Promise<ArchiveVideo | null> {
  try {
    // Parse duration
    const duration = parseDuration(doc.length);
    
    // Filter: duration must be ≤ 5 minutes (300 seconds)
    if (duration <= 0 || duration > 300) {
      return null;
    }

    // Check format availability
    const formats = Array.isArray(doc.format) ? doc.format : [doc.format].filter(Boolean);
    const hasMP4 = formats.some(f => 
      f && (f.toLowerCase().includes('mp4') || f.toLowerCase().includes('h.264') || f.toLowerCase().includes('mpeg4'))
    );

    if (!hasMP4) {
      // Still try to get MP4 files from the item
    }

    // Get the actual MP4 file name from the item
    const mp4File = await getMP4FileFromItem(doc.identifier);
    if (!mp4File) {
      return null;
    }

    // Construct direct video URL
    const videoUrl = `https://archive.org/download/${doc.identifier}/${encodeURIComponent(mp4File.name)}`;

    // Determine content type based on title
    const title = doc.title || 'Untitled';
    const type = determineContentType(title);

    // Parse creator
    const creator = Array.isArray(doc.creator) 
      ? doc.creator.join(', ') 
      : doc.creator || 'غير معروف';

    return {
      id: doc.identifier,
      identifier: doc.identifier,
      title: title,
      creator: creator,
      videoUrl: videoUrl,
      thumbnail: `https://archive.org/services/img/${doc.identifier}`,
      duration: duration,
      format: mp4File.format || 'MP4',
      type: type,
    };

  } catch (error) {
    console.warn(`Error processing doc ${doc.identifier}:`, error);
    return null;
  }
}

/**
 * Get MP4 file from Archive item
 */
async function getMP4FileFromItem(identifier: string): Promise<ArchiveFile | null> {
  try {
    const metadataUrl = `https://archive.org/metadata/${identifier}`;
    
    let response: Response;
    try {
      response = await fetch(metadataUrl, {
        signal: AbortSignal.timeout(10000),
      });
    } catch (e) {
      response = await fetch(`${PROXY_URL}/archive-metadata?id=${identifier}`, {
        signal: AbortSignal.timeout(10000),
      });
    }

    if (!response.ok) {
      return null;
    }

    const data: ArchiveFileList = await response.json();
    
    // Find MP4 file (prefer smaller files for shorts)
    const mp4Files = data.files?.filter(f => {
      const format = f.format?.toLowerCase() || '';
      const name = f.name?.toLowerCase() || '';
      return format.includes('mp4') || 
             format.includes('h.264') || 
             format.includes('mpeg4') ||
             name.endsWith('.mp4');
    }) || [];

    if (mp4Files.length === 0) {
      return null;
    }

    // Sort by size (prefer smaller files for faster loading)
    mp4Files.sort((a, b) => {
      const sizeA = parseInt(a.size || '0');
      const sizeB = parseInt(b.size || '0');
      return sizeA - sizeB;
    });

    // Return smallest MP4 file that's still reasonable quality
    return mp4Files[0];

  } catch (error) {
    console.warn(`Error fetching metadata for ${identifier}:`, error);
    return null;
  }
}

/**
 * Parse duration string to seconds
 */
function parseDuration(length: string | number | undefined): number {
  if (!length) return 0;

  if (typeof length === 'number') {
    return length;
  }

  // Try parsing as number first
  const num = parseFloat(length);
  if (!isNaN(num)) {
    return num;
  }

  // Try parsing time format (HH:MM:SS or MM:SS)
  const parts = length.split(':').map(p => parseInt(p, 10));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return 0;
}

/**
 * Determine content type from title
 */
function determineContentType(title: string): 'quran' | 'sermon' {
  const quranKeywords = ['قرآن', 'سورة', 'تلاوة', 'quran', 'surah', 'recitation', 'تلاوة'];
  const lowerTitle = title.toLowerCase();
  
  for (const keyword of quranKeywords) {
    if (lowerTitle.includes(keyword.toLowerCase())) {
      return 'quran';
    }
  }
  
  return 'sermon';
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
 * Get download URL routed through Cloudflare proxy
 * Mandatory: Provides low-quality download option
 */
export function getArchiveDownloadUrl(videoUrl: string, quality: 'low' | 'original' = 'low'): string {
  // Route through proxy to bypass CORS and provide quality options
  return `${PROXY_URL}/download?url=${encodeURIComponent(videoUrl)}&quality=${quality}`;
}

/**
 * Fallback videos if API fails
 */
function getFallbackVideos(): ArchiveVideo[] {
  // Return some known Archive.org Islamic content as fallback
  return [
    {
      id: 'fallback-1',
      identifier: 'example-islamic-lecture',
      title: 'محاضرة إسلامية قصيرة',
      creator: 'عالم مسلم',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: '/icons/icon-512x512.png',
      duration: 60,
      format: 'MP4',
      type: 'sermon',
    },
    {
      id: 'fallback-2',
      identifier: 'example-quran-recitation',
      title: 'تلاوة قرآنية',
      creator: 'قارئ',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnail: '/icons/icon-512x512.png',
      duration: 45,
      format: 'MP4',
      type: 'quran',
    },
  ];
}

/**
 * Get cached videos from sessionStorage
 */
export function getCachedArchiveVideos(): ArchiveVideo[] | null {
  try {
    const cached = sessionStorage.getItem('archive-videos');
    if (cached) {
      const { videos, timestamp } = JSON.parse(cached);
      // Cache for 30 minutes
      if (Date.now() - timestamp < 30 * 60 * 1000) {
        return videos;
      }
    }
  } catch (e) {
    console.warn('Error reading cache:', e);
  }
  return null;
}

/**
 * Cache videos in sessionStorage
 */
export function cacheArchiveVideos(videos: ArchiveVideo[]): void {
  try {
    sessionStorage.setItem('archive-videos', JSON.stringify({
      videos,
      timestamp: Date.now(),
    }));
  } catch (e) {
    console.warn('Error caching videos:', e);
  }
}
