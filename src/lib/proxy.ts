/**
 * Proxy utilities for bypassing regional blocks + handling Archive.org outages
 * Smart Cloudflare Worker Proxy with auto-resolution of direct archive servers
 */

// The deployed Cloudflare Worker proxy URL (v4.0 with smart archive.org resolver)
const PROXY_BASE = 'https://quran-shorts-api.almuhasab9.workers.dev';
const PROXY_URL = `${PROXY_BASE}/cors`;

// Domains that need to be proxied (blocked in some regions or unreliable)
const PROXIED_DOMAINS = [
  'archive.org',
  'www.archive.org',
  'ia600000.us.archive.org',
  'ia700000.us.archive.org',
  'ia800000.us.archive.org',
  'ia900000.us.archive.org',
];

/**
 * Check if a URL should be proxied
 */
export function shouldProxy(url: string): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    const host = urlObj.hostname.toLowerCase();
    // Catch any archive.org subdomain (ia800000, dn790000, etc.)
    if (host.endsWith('.archive.org') || host === 'archive.org') return true;
    return PROXIED_DOMAINS.some(
      domain => host === domain || host.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Get the proxied URL for a given URL.
 * For archive.org URLs, the worker auto-resolves to a direct server URL.
 */
export function getProxiedUrl(url: string): string {
  if (!url) return url;
  if (shouldProxy(url)) {
    return `${PROXY_URL}?url=${encodeURIComponent(url)}`;
  }
  return url;
}

/**
 * Get direct URL (without proxy)
 */
export function getDirectUrl(url: string): string {
  return url;
}

// ──────────────────────────────────────────────────────────────────────
// IN-MEMORY CACHES for link-health checks (no re-checks on every render)
// ──────────────────────────────────────────────────────────────────────
type CheckResult = { ok: boolean; reason?: string; checkedAt: number };
const checkCache = new Map<string, CheckResult>();
const CHECK_TTL_MS = 1000 * 60 * 30; // 30 min

/**
 * Quickly verify whether a PDF URL actually works (uses archive.org metadata API via the worker).
 * Returns {ok: true} for non-archive URLs by default (they can't be statically validated).
 */
export async function checkBookUrl(url: string): Promise<CheckResult> {
  if (!url) return { ok: false, reason: 'no_url', checkedAt: Date.now() };

  // Only archive.org URLs can be validated via metadata API
  if (!shouldProxy(url)) return { ok: true, checkedAt: Date.now() };

  const cached = checkCache.get(url);
  if (cached && Date.now() - cached.checkedAt < CHECK_TTL_MS) return cached;

  try {
    const res = await fetch(`${PROXY_BASE}/check?url=${encodeURIComponent(url)}`, {
      // 8s timeout to avoid blocking UI
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const fallback = { ok: true, reason: 'check_failed', checkedAt: Date.now() };
      checkCache.set(url, fallback);
      return fallback;
    }
    const json = (await res.json()) as { ok: boolean; reason?: string };
    const result: CheckResult = {
      ok: json.ok,
      reason: json.reason,
      checkedAt: Date.now(),
    };
    checkCache.set(url, result);
    return result;
  } catch {
    // On network errors, assume ok - don't punish users for our validation failure
    const fallback = { ok: true, reason: 'check_network_error', checkedAt: Date.now() };
    checkCache.set(url, fallback);
    return fallback;
  }
}

/**
 * Batch-check multiple book URLs efficiently (parallel with concurrency limit).
 * Uses the new /batch-check worker endpoint for much faster bulk validation (up to 80 URLs/request).
 * Falls back to individual /check calls on error.
 */
export async function checkBookUrls(urls: string[], concurrency = 6): Promise<Map<string, CheckResult>> {
  const result = new Map<string, CheckResult>();
  const unique = [...new Set(urls)].filter(Boolean);

  // Split URLs: archive.org ones need validation, others are assumed ok
  const toCheck: string[] = [];
  for (const u of unique) {
    if (!shouldProxy(u)) {
      result.set(u, { ok: true, checkedAt: Date.now() });
      continue;
    }
    const cached = checkCache.get(u);
    if (cached && Date.now() - cached.checkedAt < CHECK_TTL_MS) {
      result.set(u, cached);
      continue;
    }
    toCheck.push(u);
  }
  if (toCheck.length === 0) return result;

  // Batch in groups of 80 (worker cap)
  const batches: string[][] = [];
  for (let i = 0; i < toCheck.length; i += 80) batches.push(toCheck.slice(i, i + 80));

  await Promise.all(batches.map(async (batch) => {
    try {
      const res = await fetch(`${PROXY_BASE}/batch-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: batch }),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error('batch_failed');
      const data = await res.json() as { results: Record<string, { ok: boolean; reason?: string }> };
      const now = Date.now();
      for (const [u, r] of Object.entries(data.results || {})) {
        const entry: CheckResult = { ok: r.ok, reason: r.reason, checkedAt: now };
        checkCache.set(u, entry);
        result.set(u, entry);
      }
      // Any URLs missing from the response are assumed ok (optimistic)
      for (const u of batch) {
        if (!result.has(u)) result.set(u, { ok: true, checkedAt: now });
      }
    } catch {
      // Fallback to individual checks with concurrency
      const queue = [...batch];
      const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
        while (queue.length > 0) {
          const url = queue.shift();
          if (!url) break;
          const r = await checkBookUrl(url);
          result.set(url, r);
        }
      });
      await Promise.all(workers);
    }
  }));
  return result;
}

/**
 * Download a file through the proxy with progress tracking
 */
export async function downloadWithProxy(
  url: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const proxiedUrl = getProxiedUrl(url);

  const response = await fetch(proxiedUrl);

  if (!response.ok) {
    // Try to parse friendly error message from worker
    try {
      const errJson = (await response.clone().json()) as { message?: string };
      throw new Error(errJson?.message || `Download failed: ${response.status}`);
    } catch {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
  }

  const contentType = response.headers.get('Content-Type') || '';
  // Defensive: worker should already reject HTML error pages, but double-check
  if (contentType.toLowerCase().includes('text/html')) {
    throw new Error('الملف غير متاح على المصدر حالياً');
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedLength = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    chunks.push(value);
    receivedLength += value.length;

    if (total > 0 && onProgress) {
      onProgress(Math.round((receivedLength / total) * 100));
    }
  }

  return new Blob(chunks, { type: contentType || 'application/pdf' });
}

/**
 * Open a file through the proxy in a new tab
 */
export function openWithProxy(url: string): void {
  const proxiedUrl = getProxiedUrl(url);
  window.open(proxiedUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Get the proxy URL for reference
 */
export function getProxyUrl(): string {
  return PROXY_URL;
}

/**
 * Get the proxy base URL for reference
 */
export function getProxyBase(): string {
  return PROXY_BASE;
}
