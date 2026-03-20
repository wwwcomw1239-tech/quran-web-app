/**
 * Cloudflare Worker - Quran Shorts API
 * 
 * Endpoints:
 * - GET /api/shorts → Returns list of videos from R2 bucket
 * - GET /download?url=... → Proxies video downloads
 * - GET /cors?url=... → CORS proxy for Archive.org
 * 
 * This Worker serves as the dynamic API for the static Next.js app
 */

interface VideoInfo {
  id: string;
  title: string;
  author: string;
  videoUrl: string;
  thumbnail?: string;
  duration: number;
  type: 'quran' | 'sermon';
}

interface Env {
  BUCKET?: R2Bucket;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// Real Quranic videos from Archive.org (Sheikh Abdul Basit Abdul Samad)
const FALLBACK_VIDEOS: VideoInfo[] = [
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

// Handle OPTIONS request
function handleOptions(): Response {
  return new Response(null, { headers: corsHeaders });
}

// JSON response helper
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      ...corsHeaders,
    },
  });
}

// Get videos from R2 bucket or fallback
async function getVideos(env: Env): Promise<VideoInfo[]> {
  try {
    // Try to get manifest from R2
    if (env.BUCKET) {
      const manifest = await env.BUCKET.get('manifest.json');
      if (manifest) {
        const data = await manifest.json() as { videos: VideoInfo[] };
        if (data.videos && data.videos.length > 0) {
          console.log('Serving videos from R2 manifest');
          return data.videos;
        }
      }

      // Try to list objects in bucket
      const listed = await env.BUCKET.list({ prefix: '', maxKeys: 50 });
      if (listed.objects.length > 0) {
        const videos: VideoInfo[] = listed.objects
          .filter(obj => obj.key.endsWith('.mp4'))
          .map((obj) => ({
            id: obj.key.replace('.mp4', ''),
            title: parseTitle(obj.key),
            author: 'الشيخ عبدالباسط عبدالصمد',
            videoUrl: `https://pub-${obj.key}/${obj.key}`,
            thumbnail: '/icons/icon-512x512.png',
            duration: 60,
            type: 'quran' as const,
          }));
        
        if (videos.length > 0) {
          console.log(`Serving ${videos.length} videos from R2 bucket list`);
          return videos;
        }
      }
    }
  } catch (error) {
    console.error('R2 access error:', error);
  }

  // Return fallback videos
  console.log('Using fallback videos');
  return FALLBACK_VIDEOS;
}

// Parse video title from filename
function parseTitle(filename: string): string {
  const name = filename.replace('.mp4', '').replace(/_/g, ' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Handle /api/shorts endpoint
async function handleShortsAPI(request: Request, env: Env): Promise<Response> {
  const videos = await getVideos(env);
  
  // Shuffle videos
  const shuffled = videos.sort(() => Math.random() - 0.5);
  
  return jsonResponse({
    success: true,
    count: shuffled.length,
    videos: shuffled,
    source: env.BUCKET ? 'r2' : 'fallback',
  });
}

// Handle /download endpoint (proxy for CORS bypass)
async function handleDownload(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const videoUrl = url.searchParams.get('url');
  
  if (!videoUrl) {
    return jsonResponse({ error: 'Missing url parameter' }, 400);
  }

  try {
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Noor-Al-Quran-App/1.0',
      },
    });

    if (!response.ok) {
      return jsonResponse({ error: 'Failed to fetch video' }, response.status);
    }

    const contentType = response.headers.get('Content-Type') || 'video/mp4';
    const contentLength = response.headers.get('Content-Length');
    const contentRange = response.headers.get('Content-Range');

    const headers: HeadersInit = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'attachment; filename="quran_video.mp4"',
    };

    if (contentLength) headers['Content-Length'] = contentLength;
    if (contentRange) headers['Content-Range'] = contentRange;

    return new Response(response.body, { headers });

  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// Handle /cors endpoint (general CORS proxy)
async function handleCorsProxy(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return jsonResponse({ error: 'Missing url parameter' }, 400);
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Noor-Al-Quran-App/1.0',
      },
    });

    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// Main request handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Route requests
    if (path === '/api/shorts' || path === '/shorts') {
      return handleShortsAPI(request, env);
    }

    if (path === '/download') {
      return handleDownload(request);
    }

    if (path === '/cors') {
      return handleCorsProxy(request);
    }

    // Default response
    return jsonResponse({
      name: 'Noor Al-Quran API',
      version: '2.0.0',
      endpoints: {
        '/api/shorts': 'GET - List all shorts videos',
        '/download?url=': 'GET - Download video (CORS proxy)',
        '/cors?url=': 'GET - General CORS proxy',
      },
    });
  },
};
