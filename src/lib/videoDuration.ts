/**
 * YouTube video duration checker + local cache
 * Uses our Cloudflare Worker to fetch real video length (in seconds).
 * - duration > 0 → video OK
 * - duration == -1 → video unavailable
 * - duration == null → unknown (worker failed)
 */

const WORKER = 'https://quran-shorts-api.wwwcomw1239.workers.dev';
const CACHE_KEY = 'yt-duration-cache-v1';
const UNAVAILABLE = -1;

type DurationCache = Record<string, number>;

let mem: DurationCache | null = null;

function loadCache(): DurationCache {
  if (mem) return mem;
  if (typeof window === 'undefined') return (mem = {});
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    mem = raw ? JSON.parse(raw) : {};
  } catch {
    mem = {};
  }
  return mem!;
}

function saveCache(cache: DurationCache) {
  mem = cache;
  if (typeof window === 'undefined') return;
  try {
    // Keep cache reasonable (<5000 entries)
    const keys = Object.keys(cache);
    if (keys.length > 5000) {
      const trimmed: DurationCache = {};
      keys.slice(-4000).forEach(k => (trimmed[k] = cache[k]));
      mem = trimmed;
      localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
      return;
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

/**
 * Get a single video's duration. Returns cached value if available.
 * duration in seconds, or -1 if unavailable, or null if unknown.
 */
export async function getVideoDuration(id: string, timeoutMs = 5000): Promise<number | null> {
  if (!id) return null;
  const cache = loadCache();
  if (id in cache) return cache[id];

  try {
    const res = await fetch(`${WORKER}/duration?id=${encodeURIComponent(id)}`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const data = await res.json() as { id: string; duration: number | null };
    if (typeof data.duration === 'number') {
      cache[id] = data.duration;
      saveCache(cache);
      return data.duration;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Batch check up to 50 videos' durations in parallel (one request).
 * Returns a map {id: duration}.
 */
export async function getVideoDurationsBatch(
  ids: string[],
  timeoutMs = 10000
): Promise<Record<string, number | null>> {
  if (ids.length === 0) return {};
  const cache = loadCache();
  const result: Record<string, number | null> = {};
  const missing: string[] = [];

  for (const id of ids) {
    if (id in cache) result[id] = cache[id];
    else missing.push(id);
  }
  if (missing.length === 0) return result;

  // Batch in chunks of 50
  const chunks: string[][] = [];
  for (let i = 0; i < missing.length; i += 50) chunks.push(missing.slice(i, i + 50));

  await Promise.all(chunks.map(async chunk => {
    try {
      const res = await fetch(`${WORKER}/batch-duration?ids=${chunk.join(',')}`, {
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) return;
      const data = await res.json() as { durations: Record<string, number | null> };
      for (const [id, dur] of Object.entries(data.durations || {})) {
        if (typeof dur === 'number') {
          cache[id] = dur;
          result[id] = dur;
        }
      }
    } catch {
      // Ignore batch errors; individual ids will be retried next visit
    }
  }));

  saveCache(cache);
  return result;
}

/**
 * Quick synchronous lookup from cache only.
 */
export function getCachedDuration(id: string): number | null {
  const cache = loadCache();
  return id in cache ? cache[id] : null;
}

export function isShort(duration: number | null | undefined, maxSeconds = 75): boolean {
  // treat ≤ 75s as short; unknown → allow (optimistic)
  if (duration == null) return true;
  if (duration === UNAVAILABLE) return false;
  return duration > 0 && duration <= maxSeconds;
}

export function isAvailable(duration: number | null | undefined): boolean {
  return duration !== UNAVAILABLE;
}
