/**
 * Proxy utilities for bypassing regional blocks
 * Cloudflare Worker Proxy for archive.org and mp3quran.net URLs
 */

// The deployed Cloudflare Worker proxy URL (updated to new Worker)
const PROXY_URL = 'https://quran-shorts-api.wwwcomw1239.workers.dev/cors';

// Domains that need to be proxied (blocked in some regions)
const PROXIED_DOMAINS = [
  'archive.org',
  'www.archive.org',
  'ia800.us.archive.org',
  'ia600.us.archive.org',
  'ia700.us.archive.org',
  'ia802.us.archive.org',
  'ia803.us.archive.org',
  'ia804.us.archive.org',
  'ia902.us.archive.org',
  'ia903.us.archive.org',
];

/**
 * Check if a URL should be proxied
 */
export function shouldProxy(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return PROXIED_DOMAINS.some(domain =>
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Get the proxied URL for a given URL
 * If the URL should be proxied, return the proxy URL with the original URL as a query parameter
 * Otherwise, return the original URL
 */
export function getProxiedUrl(url: string): string {
  if (!url) return url;

  // Check if URL should be proxied
  if (shouldProxy(url)) {
    // Encode the URL and pass it through the proxy
    return `${PROXY_URL}?url=${encodeURIComponent(url)}`;
  }

  return url;
}

/**
 * Get direct URL (without proxy) - for cases where proxy is not needed
 */
export function getDirectUrl(url: string): string {
  return url;
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
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
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

  return new Blob(chunks);
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
