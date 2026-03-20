/**
 * Audio Cache Utility for Offline Listening
 * 
 * Uses the Cache API to store audio files on the user's device
 * All fetch requests go through the Cloudflare Worker CORS proxy
 */

import { getProxiedUrl, shouldProxy } from './proxy';

// Cache name for audio files
const CACHE_NAME = 'quran-audio-cache-v1';

// Cache expiration time (30 days in milliseconds)
const CACHE_EXPIRATION = 30 * 24 * 60 * 60 * 1000;

// Maximum cache size (500MB)
const MAX_CACHE_SIZE = 500 * 1024 * 1024;

/**
 * Interface for cached audio metadata
 */
interface CachedAudioMeta {
  url: string;
  id: string;
  timestamp: number;
  size: number;
  surahId: number;
  reciterId: string;
}

/**
 * Generate a unique cache key for an audio file
 */
function getCacheKey(audioUrl: string, reciterId: string, surahId: number): string {
  return `${reciterId}-${surahId}`;
}

/**
 * Get the cache metadata store from localStorage
 */
function getCacheMetadata(): CachedAudioMeta[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('quran-audio-cache-meta');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save cache metadata to localStorage
 */
function saveCacheMetadata(metadata: CachedAudioMeta[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('quran-audio-cache-meta', JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to save cache metadata:', error);
  }
}

/**
 * Get the current cache size
 */
async function getCacheSize(): Promise<number> {
  const metadata = getCacheMetadata();
  return metadata.reduce((total, item) => total + item.size, 0);
}

/**
 * Clean up old cache entries if size exceeds limit
 */
async function cleanupCache(): Promise<void> {
  const metadata = getCacheMetadata();
  const currentSize = await getCacheSize();
  
  if (currentSize <= MAX_CACHE_SIZE) return;
  
  // Sort by timestamp (oldest first)
  const sorted = [...metadata].sort((a, b) => a.timestamp - b.timestamp);
  
  const cache = await caches.open(CACHE_NAME);
  let freedSize = 0;
  const toRemove: CachedAudioMeta[] = [];
  
  for (const item of sorted) {
    if (currentSize - freedSize <= MAX_CACHE_SIZE * 0.8) break;
    await cache.delete(item.url);
    freedSize += item.size;
    toRemove.push(item);
  }
  
  // Update metadata
  const remaining = metadata.filter(item => !toRemove.includes(item));
  saveCacheMetadata(remaining);
}

/**
 * Check if audio is already in cache
 */
export async function checkAudioInCache(
  audioUrl: string,
  reciterId: string,
  surahId: number
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const key = getCacheKey(audioUrl, reciterId, surahId);
    const response = await cache.match(key);
    
    if (response) {
      // Check if cache entry is expired
      const metadata = getCacheMetadata();
      const meta = metadata.find(m => m.id === key);
      
      if (meta && Date.now() - meta.timestamp < CACHE_EXPIRATION) {
        return true;
      } else {
        // Remove expired entry
        await cache.delete(key);
        const newMeta = metadata.filter(m => m.id !== key);
        saveCacheMetadata(newMeta);
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking cache:', error);
    return false;
  }
}

/**
 * Get audio from cache as Blob URL
 */
export async function getAudioFromCache(
  audioUrl: string,
  reciterId: string,
  surahId: number
): Promise<string | null> {
  if (typeof window === 'undefined' || !('caches' in window)) return null;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const key = getCacheKey(audioUrl, reciterId, surahId);
    const response = await cache.match(key);
    
    if (response) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting audio from cache:', error);
    return null;
  }
}

/**
 * Save audio to cache for offline listening
 * CRITICAL: All fetch requests go through CORS proxy
 */
export async function saveAudioOffline(
  audioUrl: string,
  reciterId: string,
  surahId: number,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { success: false, error: 'Cache API not supported' };
  }
  
  try {
    // Check if already cached
    const isCached = await checkAudioInCache(audioUrl, reciterId, surahId);
    if (isCached) {
      return { success: true };
    }
    
    // Get the proxied URL to avoid CORS issues
    const proxiedUrl = shouldProxy(audioUrl) ? getProxiedUrl(audioUrl) : audioUrl;
    
    onProgress?.(5);
    
    // Fetch the audio file
    const response = await fetch(proxiedUrl, {
      headers: {
        'Accept': 'audio/mpeg, audio/*, */*',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    onProgress?.(20);
    
    // Get content length for progress tracking
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    // Read the response body with progress tracking
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }
    
    const chunks: Uint8Array[] = [];
    let receivedLength = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      if (total > 0 && onProgress) {
        const progress = 20 + Math.round((receivedLength / total) * 70);
        onProgress(progress);
      }
    }
    
    onProgress?.(90);
    
    // Create blob from chunks
    const blob = new Blob(chunks, { type: 'audio/mpeg' });
    
    // Create a new response with the blob
    const cachedResponse = new Response(blob, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': blob.size.toString(),
        'Cache-Date': new Date().toISOString(),
      },
    });
    
    // Store in cache
    const cache = await caches.open(CACHE_NAME);
    const key = getCacheKey(audioUrl, reciterId, surahId);
    
    try {
      await cache.put(key, cachedResponse);
    } catch (cacheError: any) {
      if (cacheError.name === 'QuotaExceededError') {
        // Try to clean up and retry
        await cleanupCache();
        try {
          await cache.put(key, cachedResponse.clone());
        } catch {
          return { success: false, error: 'storage_full' };
        }
      } else {
        throw cacheError;
      }
    }
    
    // Update metadata
    const metadata = getCacheMetadata();
    const newMeta: CachedAudioMeta = {
      url: audioUrl,
      id: key,
      timestamp: Date.now(),
      size: blob.size,
      surahId,
      reciterId,
    };
    
    // Remove old entry for same key if exists
    const filteredMeta = metadata.filter(m => m.id !== key);
    saveCacheMetadata([...filteredMeta, newMeta]);
    
    onProgress?.(100);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error saving audio to cache:', error);
    return { 
      success: false, 
      error: error.message || 'unknown_error' 
    };
  }
}

/**
 * Remove audio from cache
 */
export async function removeAudioFromCache(
  audioUrl: string,
  reciterId: string,
  surahId: number
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const key = getCacheKey(audioUrl, reciterId, surahId);
    
    const deleted = await cache.delete(key);
    
    // Update metadata
    const metadata = getCacheMetadata();
    const filteredMeta = metadata.filter(m => m.id !== key);
    saveCacheMetadata(filteredMeta);
    
    return deleted;
  } catch (error) {
    console.error('Error removing audio from cache:', error);
    return false;
  }
}

/**
 * Get all cached audio metadata
 */
export function getCachedAudioList(): CachedAudioMeta[] {
  return getCacheMetadata();
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  count: number;
  totalSize: number;
  formattedSize: string;
}> {
  const metadata = getCacheMetadata();
  const totalSize = metadata.reduce((sum, item) => sum + item.size, 0);
  
  return {
    count: metadata.length,
    totalSize,
    formattedSize: formatFileSize(totalSize),
  };
}

/**
 * Clear the entire audio cache
 */
export async function clearAudioCache(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  
  try {
    await caches.delete(CACHE_NAME);
    localStorage.removeItem('quran-audio-cache-meta');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Check if Cache API is available
 */
export function isCacheApiSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window;
}
