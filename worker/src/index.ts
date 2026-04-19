/**
 * Cloudflare Worker - Quran Audio & Video Proxy
 * 
 * Endpoints:
 * - GET /cors?url=... → CORS proxy for Archive.org, PDFs, and audio files (supports Range requests)
 * - GET /duration?id=YOUTUBE_ID → returns duration (seconds) of a YouTube video
 * - GET /batch-duration?ids=ID1,ID2,... → returns map of ids to durations
 * 
 * This Worker serves as a CORS proxy for the static Next.js app
 */

// CORS headers
const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Range, Accept',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges, Content-Type',
  'Access-Control-Max-Age': '86400',
};

// Handle OPTIONS request
function handleOptions(): Response {
  return new Response(null, { headers: corsHeaders });
}

// JSON response helper
function jsonResponse(data: any, status = 200, cacheSeconds = 3600): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`,
      ...corsHeaders,
    },
  });
}

// ----------------------------------------------------
// CORS PROXY (supports Range requests for PDF streaming)
// ----------------------------------------------------
async function handleCorsProxy(request: Request, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return jsonResponse({ error: 'Missing url parameter' }, 400);
  }

  // Basic safety: only allow http(s)
  if (!/^https?:\/\//i.test(targetUrl)) {
    return jsonResponse({ error: 'Invalid url protocol' }, 400);
  }

  try {
    // Forward Range & User-Agent headers for partial content (essential for PDF streaming)
    const upstreamHeaders: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (Noor-Al-Quran-App/3.1)',
      'Accept': request.headers.get('Accept') || '*/*',
    };
    const range = request.headers.get('Range');
    if (range) upstreamHeaders['Range'] = range;

    // Build cache key; only cache full GETs (no Range) to avoid partial cache poisoning
    const cache = (caches as any).default;
    let cacheKey: Request | null = null;
    if (request.method === 'GET' && !range) {
      cacheKey = new Request(targetUrl, { method: 'GET' });
      const cached = await cache.match(cacheKey);
      if (cached) {
        const cachedHeaders = new Headers(cached.headers);
        for (const [k, v] of Object.entries(corsHeaders)) cachedHeaders.set(k, v);
        return new Response(cached.body, { status: cached.status, headers: cachedHeaders });
      }
    }

    const response = await fetch(targetUrl, {
      method: request.method === 'HEAD' ? 'HEAD' : 'GET',
      headers: upstreamHeaders,
      redirect: 'follow',
      cf: {
        // Cache at Cloudflare edge for 1 hour for repeat requests
        cacheTtl: 3600,
        cacheEverything: true,
      } as any,
    });

    // Passthrough important headers
    const outHeaders = new Headers();
    const contentType = response.headers.get('Content-Type');
    const contentLength = response.headers.get('Content-Length');
    const contentRange = response.headers.get('Content-Range');
    const acceptRanges = response.headers.get('Accept-Ranges');
    const lastModified = response.headers.get('Last-Modified');
    const etag = response.headers.get('ETag');

    if (contentType) outHeaders.set('Content-Type', contentType);
    if (contentLength) outHeaders.set('Content-Length', contentLength);
    if (contentRange) outHeaders.set('Content-Range', contentRange);
    if (acceptRanges) outHeaders.set('Accept-Ranges', acceptRanges);
    else outHeaders.set('Accept-Ranges', 'bytes'); // Tell clients we support ranges
    if (lastModified) outHeaders.set('Last-Modified', lastModified);
    if (etag) outHeaders.set('ETag', etag);

    outHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    for (const [k, v] of Object.entries(corsHeaders)) outHeaders.set(k, v);

    const out = new Response(response.body, { status: response.status, headers: outHeaders });

    // Put full responses in cache in background
    if (cacheKey && response.ok && response.status === 200) {
      ctx.waitUntil(cache.put(cacheKey, out.clone()));
    }
    return out;
  } catch (error: any) {
    return jsonResponse({ error: error.message || 'proxy_failed' }, 502, 60);
  }
}

// ----------------------------------------------------
// YOUTUBE VIDEO DURATION
// Scrapes YouTube oEmbed + watch page to extract duration
// ----------------------------------------------------
const ID_RE = /^[A-Za-z0-9_-]{11}$/;

async function fetchYoutubeDuration(id: string): Promise<number | null> {
  if (!ID_RE.test(id)) return null;

  // Check cache first
  const cache = (caches as any).default;
  const cacheKey = new Request(`https://cache.local/yt-duration/${id}`);
  const cached = await cache.match(cacheKey);
  if (cached) {
    const v = await cached.json<any>();
    if (typeof v?.duration === 'number') return v.duration;
  }

  try {
    // Try the watch page and parse approxDurationMs or lengthSeconds
    const res = await fetch(`https://www.youtube.com/watch?v=${id}&hl=en`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cf: { cacheTtl: 86400, cacheEverything: true } as any,
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Pattern 1: "lengthSeconds":"123"
    let m = html.match(/"lengthSeconds"\s*:\s*"(\d+)"/);
    if (m) {
      const dur = parseInt(m[1], 10);
      await cache.put(cacheKey, new Response(JSON.stringify({ duration: dur }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=604800' },
      }));
      return dur;
    }
    // Pattern 2: approxDurationMs
    m = html.match(/"approxDurationMs"\s*:\s*"(\d+)"/);
    if (m) {
      const dur = Math.round(parseInt(m[1], 10) / 1000);
      await cache.put(cacheKey, new Response(JSON.stringify({ duration: dur }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=604800' },
      }));
      return dur;
    }
    // If video is unavailable/private
    if (/Video unavailable|This video isn't available/i.test(html)) {
      await cache.put(cacheKey, new Response(JSON.stringify({ duration: -1 }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' },
      }));
      return -1;
    }
    return null;
  } catch {
    return null;
  }
}

async function handleDuration(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';
  if (!ID_RE.test(id)) return jsonResponse({ error: 'invalid id' }, 400);
  const duration = await fetchYoutubeDuration(id);
  return jsonResponse({ id, duration }, 200, 604800);
}

async function handleBatchDuration(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const idsParam = url.searchParams.get('ids') || '';
  const ids = idsParam.split(',').map(s => s.trim()).filter(s => ID_RE.test(s)).slice(0, 50);
  if (ids.length === 0) return jsonResponse({ error: 'no valid ids' }, 400);

  const results = await Promise.all(ids.map(async id => {
    const d = await fetchYoutubeDuration(id);
    return [id, d] as const;
  }));
  const map: Record<string, number | null> = {};
  for (const [id, d] of results) map[id] = d;
  return jsonResponse({ durations: map }, 200, 604800);
}

// ----------------------------------------------------
// YOUTUBE CHANNEL SHORTS FEED
// Fetches recent videos from a channel RSS, filters shorts (<= 75s)
// ----------------------------------------------------
const CHANNEL_ID_RE = /^UC[A-Za-z0-9_-]{22}$/;

async function handleChannelShorts(request: Request, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const channelId = url.searchParams.get('channelId') || '';
  const maxSec = Math.min(300, parseInt(url.searchParams.get('maxSec') || '75', 10));

  if (!CHANNEL_ID_RE.test(channelId)) {
    return jsonResponse({ error: 'invalid channelId' }, 400);
  }

  try {
    // Fetch RSS feed from YouTube
    const rssRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (Noor-Al-Quran-App/3.1)' },
        cf: { cacheTtl: 3600, cacheEverything: true } as any,
      }
    );
    if (!rssRes.ok) return jsonResponse({ error: 'rss fetch failed', status: rssRes.status }, 502);
    const xml = await rssRes.text();

    // Parse entries
    type Entry = { id: string; title: string; published: string };
    const entries: Entry[] = [];
    const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
    let m: RegExpExecArray | null;
    while ((m = entryRe.exec(xml)) !== null) {
      const block = m[1];
      const idMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = block.match(/<title>([^<]+)<\/title>/);
      const pubMatch = block.match(/<published>([^<]+)<\/published>/);
      if (idMatch && titleMatch) {
        entries.push({
          id: idMatch[1],
          title: titleMatch[1],
          published: pubMatch?.[1] || '',
        });
      }
    }

    // Fetch durations for each (cached aggressively)
    const withDurations = await Promise.all(entries.slice(0, 25).map(async e => {
      const dur = await fetchYoutubeDuration(e.id);
      return { ...e, duration: dur };
    }));

    const shorts = withDurations.filter(
      e => typeof e.duration === 'number' && e.duration > 0 && e.duration <= maxSec
    );

    return jsonResponse({ channelId, total: entries.length, shorts }, 200, 3600);
  } catch (error: any) {
    return jsonResponse({ error: error.message || 'feed_failed' }, 500, 60);
  }
}

// ----------------------------------------------------
// YOUTUBE PLAYLIST FEED (similar to channel)
// ----------------------------------------------------
const PLAYLIST_ID_RE = /^(PL|UU|FL|OL|LL)[A-Za-z0-9_-]{10,40}$/;

async function handlePlaylistShorts(request: Request, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get('playlistId') || '';
  const maxSec = Math.min(300, parseInt(url.searchParams.get('maxSec') || '75', 10));

  if (!PLAYLIST_ID_RE.test(playlistId)) {
    return jsonResponse({ error: 'invalid playlistId' }, 400);
  }

  try {
    const rssRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (Noor-Al-Quran-App/3.1)' },
        cf: { cacheTtl: 3600, cacheEverything: true } as any,
      }
    );
    if (!rssRes.ok) return jsonResponse({ error: 'rss fetch failed' }, 502);
    const xml = await rssRes.text();

    type Entry = { id: string; title: string };
    const entries: Entry[] = [];
    const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
    let m: RegExpExecArray | null;
    while ((m = entryRe.exec(xml)) !== null) {
      const block = m[1];
      const idMatch = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = block.match(/<title>([^<]+)<\/title>/);
      if (idMatch && titleMatch) entries.push({ id: idMatch[1], title: titleMatch[1] });
    }

    const withDurations = await Promise.all(entries.slice(0, 25).map(async e => {
      const dur = await fetchYoutubeDuration(e.id);
      return { ...e, duration: dur };
    }));

    const shorts = withDurations.filter(
      e => typeof e.duration === 'number' && e.duration > 0 && e.duration <= maxSec
    );

    return jsonResponse({ playlistId, total: entries.length, shorts }, 200, 3600);
  } catch (error: any) {
    return jsonResponse({ error: error.message || 'feed_failed' }, 500, 60);
  }
}

// ----------------------------------------------------
// MAIN HANDLER
// ----------------------------------------------------
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') return handleOptions();

    if (path === '/cors') return handleCorsProxy(request, ctx);
    if (path === '/duration') return handleDuration(request);
    if (path === '/batch-duration') return handleBatchDuration(request);
    if (path === '/channel-shorts') return handleChannelShorts(request, ctx);
    if (path === '/playlist-shorts') return handlePlaylistShorts(request, ctx);

    return jsonResponse({
      name: 'Noor Al-Quran Proxy',
      version: '3.2.0',
      description: 'CORS proxy + YouTube duration/shorts fetcher',
      endpoints: {
        '/cors?url=': 'GET - CORS proxy with Range support (PDF/audio)',
        '/duration?id=': 'GET - YouTube video duration in seconds',
        '/batch-duration?ids=id1,id2': 'GET - batch (max 50 ids)',
        '/channel-shorts?channelId=UCxxxx&maxSec=75': 'GET - recent shorts from channel',
        '/playlist-shorts?playlistId=PLxxxx&maxSec=75': 'GET - recent shorts from playlist',
      },
    });
  },
};
