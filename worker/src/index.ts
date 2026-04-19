/**
 * Cloudflare Worker - Quran Audio & Video Proxy (v4.0)
 * 
 * Endpoints:
 * - GET /cors?url=... → Smart CORS proxy for Archive.org, PDFs, and audio (supports Range requests)
 *   • Auto-resolves archive.org/download/ItemId/file.pdf → direct ia*.us.archive.org server
 *     (works even when archive.org main site returns 503/HTML error pages)
 *   • Detects Archive.org HTML error pages and returns a real 404 instead of silently
 *     passing through the error HTML
 * - GET /check?url=... → Returns {ok: boolean, reason?: string} to check if a PDF URL actually works
 * - GET /resolve?url=... → Resolves archive.org/download URL to direct server URL
 * - GET /duration?id=YOUTUBE_ID → returns duration (seconds) of a YouTube video
 * - GET /batch-duration?ids=ID1,ID2,... → returns map of ids to durations
 * - GET /channel-shorts, /playlist-shorts → YouTube feeds
 */

// CORS headers
const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Range, Accept',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges, Content-Type, X-Proxy-Status, X-Archive-Item',
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
// ARCHIVE.ORG RESOLVER
// Converts archive.org/download/ItemId/file.pdf → direct ia*.us.archive.org server URL
// Uses the metadata API (very fast, cached aggressively at the edge)
// ----------------------------------------------------
interface ArchiveMetadata {
  dir?: string;
  d1?: string;
  d2?: string;
  server?: string;
  files?: Array<{ name: string; size?: string; format?: string }>;
  workable_servers?: string[];
  alternate_locations?: { workable?: Array<{ server: string; dir: string }> };
}

/**
 * Parses an archive.org download URL and returns { itemId, fileName } or null.
 * Supported patterns:
 *   https://archive.org/download/ITEM_ID/FILE_NAME
 *   https://ia800808.us.archive.org/18/items/ITEM_ID/FILE_NAME
 */
function parseArchiveUrl(url: string): { itemId: string; fileName: string } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const path = u.pathname;

    // Pattern 1: archive.org/download/ITEM/FILE
    if (host === 'archive.org' || host === 'www.archive.org') {
      const m = path.match(/^\/download\/([^\/]+)\/(.+)$/);
      if (m) return { itemId: decodeURIComponent(m[1]), fileName: decodeURIComponent(m[2]) };
    }

    // Pattern 2: iaXXX.us.archive.org/N/items/ITEM/FILE
    if (/^ia\d+\.us\.archive\.org$/i.test(host) || /\.archive\.org$/i.test(host)) {
      const m = path.match(/\/items\/([^\/]+)\/(.+)$/);
      if (m) return { itemId: decodeURIComponent(m[1]), fileName: decodeURIComponent(m[2]) };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fetches archive.org metadata with edge caching. Returns null on error/empty.
 */
async function fetchArchiveMetadata(itemId: string): Promise<ArchiveMetadata | null> {
  try {
    const metaUrl = `https://archive.org/metadata/${encodeURIComponent(itemId)}`;
    const res = await fetch(metaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Noor-Al-Quran-App/4.0)',
        'Accept': 'application/json',
      },
      cf: {
        cacheTtl: 21600, // 6 hours - metadata rarely changes
        cacheEverything: true,
      } as any,
    });
    if (!res.ok) return null;
    const data = await res.json<ArchiveMetadata>();
    // An empty object {} means the item is gone / restricted / invalid
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Resolves an archive.org URL to a direct server URL that is far more reliable
 * than the /download/ path (which often returns 503 HTML error pages).
 *
 * Returns an ordered list of candidate URLs to try (most reliable first).
 */
async function resolveArchiveUrl(originalUrl: string): Promise<{
  candidates: string[];
  itemExists: boolean;
  itemId?: string;
  fileName?: string;
}> {
  const parsed = parseArchiveUrl(originalUrl);
  if (!parsed) return { candidates: [originalUrl], itemExists: true };

  const { itemId, fileName } = parsed;
  const meta = await fetchArchiveMetadata(itemId);

  if (!meta) {
    // Item doesn't exist or is restricted - try the original URL anyway
    // (sometimes metadata is blocked but download still works) but also signal missing
    return {
      candidates: [originalUrl],
      itemExists: false,
      itemId,
      fileName,
    };
  }

  // Verify the requested file exists inside the item
  const fileExists = !meta.files || meta.files.some(f => f.name === fileName);
  if (!fileExists) {
    // Try to find a file with similar name
    const similar = meta.files?.find(
      f => f.name.toLowerCase() === fileName.toLowerCase() ||
           f.name.replace(/\s+/g, '') === fileName.replace(/\s+/g, '')
    );
    if (similar) {
      return buildCandidates(meta, similar.name, itemId);
    }
    return { candidates: [originalUrl], itemExists: false, itemId, fileName };
  }

  return buildCandidates(meta, fileName, itemId);
}

function buildCandidates(meta: ArchiveMetadata, fileName: string, itemId: string): {
  candidates: string[];
  itemExists: boolean;
  itemId: string;
  fileName: string;
} {
  const dir = meta.dir || `/items/${itemId}`;
  const encFile = encodeURIComponent(fileName).replace(/%2F/g, '/');
  const candidates: string[] = [];

  // Priority 1: Primary server
  if (meta.server) candidates.push(`https://${meta.server}${dir}/${encFile}`);
  // Priority 2: d1 / d2 fallbacks
  if (meta.d1 && meta.d1 !== meta.server) candidates.push(`https://${meta.d1}${dir}/${encFile}`);
  if (meta.d2 && meta.d2 !== meta.server && meta.d2 !== meta.d1) candidates.push(`https://${meta.d2}${dir}/${encFile}`);
  // Priority 3: alternate locations
  const alts = meta.alternate_locations?.workable || [];
  for (const alt of alts) {
    const u = `https://${alt.server}${alt.dir}/${encFile}`;
    if (!candidates.includes(u)) candidates.push(u);
  }
  // Priority 4: canonical /download path (least reliable but still possible)
  candidates.push(`https://archive.org/download/${encodeURIComponent(itemId)}/${encFile}`);

  return { candidates, itemExists: true, itemId, fileName };
}

/**
 * Detects if a response body is actually an Archive.org HTML error page
 * disguised as a successful response. Returns true if it's an error page.
 */
function isArchiveErrorHtml(contentType: string | null, firstBytes: string): boolean {
  if (!contentType) return false;
  const ct = contentType.toLowerCase();
  if (!ct.includes('text/html')) return false; // Real PDFs/audio are never text/html
  // Check for well-known archive.org error signals
  const sample = firstBytes.toLowerCase();
  return (
    sample.includes("internet archive: error") ||
    sample.includes("item's metadata does not exist") ||
    sample.includes("item's metadata is not parseable") ||
    sample.includes("specified item's metadata does not exist") ||
    sample.includes("is not available") ||
    sample.includes("cannot be shown") ||
    sample.includes("access is restricted") ||
    // Generic: any HTML response when caller expects PDF
    true // returning any HTML where PDF was expected is almost always an error
  );
}

// ----------------------------------------------------
// CORS PROXY (smart: resolves archive.org items, validates responses)
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
    // ── Smart archive.org resolution ──
    const { candidates, itemExists } = await resolveArchiveUrl(targetUrl);

    // If the item genuinely doesn't exist on archive.org, short-circuit with a 404
    if (!itemExists && candidates.length === 1 && candidates[0] === targetUrl) {
      // Still try once in case the metadata API is just blocked
      // But if first attempt fails, we'll surface a proper 404
    }

    // Forward Range & User-Agent headers for partial content (essential for PDF streaming)
    const range = request.headers.get('Range');
    const buildUpstreamHeaders = (): HeadersInit => {
      const h: HeadersInit = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': request.headers.get('Accept') || 'application/pdf,*/*',
      };
      if (range) (h as Record<string, string>)['Range'] = range;
      return h;
    };

    // Try each candidate until we get a valid (non-HTML) response
    let lastError: { status: number; reason: string } | null = null;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];

      // Build cache key; only cache full GETs (no Range) to avoid partial cache poisoning
      const cache = (caches as any).default;
      let cacheKey: Request | null = null;
      if (request.method === 'GET' && !range) {
        cacheKey = new Request(candidate, { method: 'GET' });
        const cached = await cache.match(cacheKey);
        if (cached) {
          const ct = cached.headers.get('Content-Type') || '';
          // Only serve cached response if it's NOT an error page
          if (!ct.toLowerCase().includes('text/html')) {
            const cachedHeaders = new Headers(cached.headers);
            for (const [k, v] of Object.entries(corsHeaders)) cachedHeaders.set(k, v);
            cachedHeaders.set('X-Proxy-Status', `cache-hit-${i}`);
            return new Response(cached.body, { status: cached.status, headers: cachedHeaders });
          }
        }
      }

      const response = await fetch(candidate, {
        method: request.method === 'HEAD' ? 'HEAD' : 'GET',
        headers: buildUpstreamHeaders(),
        redirect: 'follow',
        cf: {
          cacheTtl: 3600,
          cacheEverything: true,
        } as any,
      });

      const contentType = response.headers.get('Content-Type') || '';

      // Hard errors - try next candidate
      if (!response.ok && response.status !== 206) {
        lastError = { status: response.status, reason: `HTTP ${response.status}` };
        continue;
      }

      // Response is HTML even though caller expects binary → it's an error page
      // For HEAD we can't sniff body; trust Content-Type only
      if (contentType.toLowerCase().includes('text/html')) {
        if (request.method === 'HEAD') {
          lastError = { status: 502, reason: 'upstream_returned_html' };
          continue;
        }
        // For GET, peek at the first chunk to confirm it's an error page
        const cloned = response.clone();
        const reader = cloned.body?.getReader();
        let sample = '';
        if (reader) {
          const { value } = await reader.read();
          reader.cancel();
          if (value) sample = new TextDecoder().decode(value.slice(0, 2048));
        }
        if (isArchiveErrorHtml(contentType, sample)) {
          lastError = { status: 404, reason: 'archive_item_missing' };
          continue; // try next candidate
        }
        // It's legit HTML, fall through (rare for PDFs)
      }

      // ── Good response ──
      const outHeaders = new Headers();
      const contentLength = response.headers.get('Content-Length');
      const contentRange = response.headers.get('Content-Range');
      const acceptRanges = response.headers.get('Accept-Ranges');
      const lastModified = response.headers.get('Last-Modified');
      const etag = response.headers.get('ETag');

      if (contentType) outHeaders.set('Content-Type', contentType);
      if (contentLength) outHeaders.set('Content-Length', contentLength);
      if (contentRange) outHeaders.set('Content-Range', contentRange);
      if (acceptRanges) outHeaders.set('Accept-Ranges', acceptRanges);
      else outHeaders.set('Accept-Ranges', 'bytes');
      if (lastModified) outHeaders.set('Last-Modified', lastModified);
      if (etag) outHeaders.set('ETag', etag);

      outHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      outHeaders.set('X-Proxy-Status', `ok-candidate-${i}`);
      for (const [k, v] of Object.entries(corsHeaders)) outHeaders.set(k, v);

      const out = new Response(response.body, { status: response.status, headers: outHeaders });

      // Cache only genuine successful responses (200, binary content)
      const cache2 = (caches as any).default;
      if (!range && response.ok && response.status === 200 && !contentType.toLowerCase().includes('text/html')) {
        const cacheKey2 = new Request(candidate, { method: 'GET' });
        ctx.waitUntil(cache2.put(cacheKey2, out.clone()));
      }
      return out;
    }

    // All candidates failed
    const errStatus = lastError?.status === 404 ? 404 : 502;
    const errHeaders = new Headers({
      'Content-Type': 'application/json',
      'X-Proxy-Status': `all-failed: ${lastError?.reason || 'unknown'}`,
    });
    for (const [k, v] of Object.entries(corsHeaders)) errHeaders.set(k, v);
    return new Response(JSON.stringify({
      error: lastError?.reason || 'not_found',
      message: errStatus === 404
        ? 'هذا الكتاب غير متوفر حالياً على المصدر. قد يكون قد تم حذفه أو تقييد الوصول إليه.'
        : 'تعذر الوصول إلى الخادم حالياً. حاول مرة أخرى لاحقاً.',
      status: errStatus,
    }), { status: errStatus, headers: errHeaders });
  } catch (error: any) {
    return jsonResponse({ error: error.message || 'proxy_failed' }, 502, 60);
  }
}

// ----------------------------------------------------
// URL CHECKER - returns {ok: boolean, reason?: string}
// Cheap endpoint for the frontend to validate links in batches
// ----------------------------------------------------
async function handleCheck(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
    return jsonResponse({ ok: false, reason: 'invalid_url' }, 400);
  }

  try {
    const { itemExists, candidates } = await resolveArchiveUrl(targetUrl);
    return jsonResponse({
      ok: itemExists,
      reason: itemExists ? undefined : 'item_missing',
      candidateCount: candidates.length,
    }, 200, 21600);
  } catch (e: any) {
    return jsonResponse({ ok: false, reason: e.message || 'check_failed' }, 200, 300);
  }
}

// ----------------------------------------------------
// URL RESOLVER - returns the best direct URL for a given archive URL
// ----------------------------------------------------
async function handleResolve(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
    return jsonResponse({ error: 'invalid_url' }, 400);
  }
  try {
    const r = await resolveArchiveUrl(targetUrl);
    return jsonResponse({
      ok: r.itemExists,
      itemId: r.itemId,
      fileName: r.fileName,
      candidates: r.candidates,
      best: r.candidates[0] || null,
    }, 200, 21600);
  } catch (e: any) {
    return jsonResponse({ error: e.message || 'resolve_failed' }, 500, 60);
  }
}

// ----------------------------------------------------
// YOUTUBE VIDEO DURATION
// ----------------------------------------------------
const ID_RE = /^[A-Za-z0-9_-]{11}$/;

async function fetchYoutubeDuration(id: string): Promise<number | null> {
  if (!ID_RE.test(id)) return null;

  const cache = (caches as any).default;
  const cacheKey = new Request(`https://cache.local/yt-duration/${id}`);
  const cached = await cache.match(cacheKey);
  if (cached) {
    const v = await cached.json<any>();
    if (typeof v?.duration === 'number') return v.duration;
  }

  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${id}&hl=en`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cf: { cacheTtl: 86400, cacheEverything: true } as any,
    });
    if (!res.ok) return null;
    const html = await res.text();

    let m = html.match(/"lengthSeconds"\s*:\s*"(\d+)"/);
    if (m) {
      const dur = parseInt(m[1], 10);
      await cache.put(cacheKey, new Response(JSON.stringify({ duration: dur }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=604800' },
      }));
      return dur;
    }
    m = html.match(/"approxDurationMs"\s*:\s*"(\d+)"/);
    if (m) {
      const dur = Math.round(parseInt(m[1], 10) / 1000);
      await cache.put(cacheKey, new Response(JSON.stringify({ duration: dur }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=604800' },
      }));
      return dur;
    }
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
    const rssRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (Noor-Al-Quran-App/4.0)' },
        cf: { cacheTtl: 3600, cacheEverything: true } as any,
      }
    );
    if (!rssRes.ok) return jsonResponse({ error: 'rss fetch failed', status: rssRes.status }, 502);
    const xml = await rssRes.text();

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
// YOUTUBE PLAYLIST FEED
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
        headers: { 'User-Agent': 'Mozilla/5.0 (Noor-Al-Quran-App/4.0)' },
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
    if (path === '/check') return handleCheck(request);
    if (path === '/resolve') return handleResolve(request);
    if (path === '/duration') return handleDuration(request);
    if (path === '/batch-duration') return handleBatchDuration(request);
    if (path === '/channel-shorts') return handleChannelShorts(request, ctx);
    if (path === '/playlist-shorts') return handlePlaylistShorts(request, ctx);

    return jsonResponse({
      name: 'Noor Al-Quran Proxy',
      version: '4.0.0',
      description: 'Smart CORS proxy with Archive.org resolver + YouTube duration/shorts fetcher',
      endpoints: {
        '/cors?url=': 'GET - Smart CORS proxy (auto-resolves archive.org items, detects HTML errors)',
        '/check?url=': 'GET - Returns {ok: boolean} to validate a PDF URL',
        '/resolve?url=': 'GET - Resolves archive.org URL to direct server URL',
        '/duration?id=': 'GET - YouTube video duration in seconds',
        '/batch-duration?ids=id1,id2': 'GET - batch (max 50 ids)',
        '/channel-shorts?channelId=UCxxxx&maxSec=75': 'GET - recent shorts from channel',
        '/playlist-shorts?playlistId=PLxxxx&maxSec=75': 'GET - recent shorts from playlist',
      },
    });
  },
};
