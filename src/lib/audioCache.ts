/**
 * Audio Cache Utility for Offline Listening
 * 
 * Uses the Cache API to store audio files on the user's device
 * All fetch requests go through the Cloudflare Worker CORS proxy
 * 
 * Files are stored FOREVER until manually deleted by the user
 */

import { getProxiedUrl, shouldProxy } from './proxy';

// Cache name for audio files
const CACHE_NAME = 'quran-audio-cache-v1';

// Metadata key in localStorage
const CACHE_META_KEY = 'quran-audio-cache-meta';

/**
 * Interface for cached audio metadata
 */
export interface CachedAudioMeta {
  url: string;
  id: string;
  timestamp: number;
  size: number;
  surahId: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  reciterId: string;
  reciterNameArabic: string;
  reciterNameEnglish: string;
}

/**
 * Generate a unique cache key for an audio file
 */
export function getCacheKey(reciterId: string, surahId: number): string {
  return `${reciterId}-${surahId}`;
}

/**
 * Get the cache metadata store from localStorage
 */
export function getAllCachedAudio(): CachedAudioMeta[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CACHE_META_KEY);
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
    localStorage.setItem(CACHE_META_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to save cache metadata:', error);
  }
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
    const key = getCacheKey(reciterId, surahId);
    const response = await cache.match(key);
    
    return !!response;
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
    const key = getCacheKey(reciterId, surahId);
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
 * 
 * @throws QuotaExceededError when storage is full
 */
export async function saveAudioOffline(
  audioUrl: string,
  reciterId: string,
  surahId: number,
  surahNameArabic: string,
  surahNameEnglish: string,
  reciterNameArabic: string,
  reciterNameEnglish: string,
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
    
    // Store in cache - let browser handle quota
    const cache = await caches.open(CACHE_NAME);
    const key = getCacheKey(reciterId, surahId);
    
    try {
      await cache.put(key, cachedResponse);
    } catch (cacheError: any) {
      if (cacheError.name === 'QuotaExceededError') {
        return { success: false, error: 'storage_full' };
      }
      throw cacheError;
    }
    
    // Update metadata
    const metadata = getAllCachedAudio();
    const newMeta: CachedAudioMeta = {
      url: audioUrl,
      id: key,
      timestamp: Date.now(),
      size: blob.size,
      surahId,
      surahNameArabic,
      surahNameEnglish,
      reciterId,
      reciterNameArabic,
      reciterNameEnglish,
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
  reciterId: string,
  surahId: number
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const key = getCacheKey(reciterId, surahId);
    
    const deleted = await cache.delete(key);
    
    // Update metadata
    const metadata = getAllCachedAudio();
    const filteredMeta = metadata.filter(m => m.id !== key);
    saveCacheMetadata(filteredMeta);
    
    return deleted;
  } catch (error) {
    console.error('Error removing audio from cache:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  count: number;
  totalSize: number;
  formattedSize: string;
}> {
  const metadata = getAllCachedAudio();
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
    localStorage.removeItem(CACHE_META_KEY);
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
