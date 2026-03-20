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

// localStorage key for downloads registry - MUST be consistent
const DOWNLOADS_REGISTRY_KEY = 'quran_downloads_registry';

/**
 * Interface for cached audio metadata
 */
export interface CachedAudioMeta {
  id: string;
  url: string;
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
 * Get all cached audio from localStorage registry
 * This is the primary source of truth for the downloads list
 */
export function getAllCachedAudio(): CachedAudioMeta[] {
  if (typeof window === 'undefined') {
    console.log('[Cache] Window not available, returning empty array');
    return [];
  }
  
  try {
    const stored = localStorage.getItem(DOWNLOADS_REGISTRY_KEY);
    console.log('[Cache] Raw localStorage data:', stored);
    
    if (!stored) {
      console.log('[Cache] No registry found, returning empty array');
      return [];
    }
    
    const parsed = JSON.parse(stored);
    
    if (!Array.isArray(parsed)) {
      console.error('[Cache] Registry is not an array, resetting');
      localStorage.removeItem(DOWNLOADS_REGISTRY_KEY);
      return [];
    }
    
    console.log(`[Cache] Found ${parsed.length} items in registry`);
    return parsed;
  } catch (error) {
    console.error('[Cache] Error parsing registry:', error);
    // Reset corrupted data
    localStorage.removeItem(DOWNLOADS_REGISTRY_KEY);
    return [];
  }
}

/**
 * Save cache metadata to localStorage registry
 */
function saveToRegistry(metadata: CachedAudioMeta[]): boolean {
  if (typeof window === 'undefined') {
    console.error('[Cache] Cannot save to registry: window not available');
    return false;
  }
  
  try {
    const data = JSON.stringify(metadata);
    localStorage.setItem(DOWNLOADS_REGISTRY_KEY, data);
    console.log(`[Cache] Saved ${metadata.length} items to registry`);
    
    // Verify the save worked
    const verify = localStorage.getItem(DOWNLOADS_REGISTRY_KEY);
    if (verify !== data) {
      console.error('[Cache] Verification failed after save');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Cache] Error saving to registry:', error);
    return false;
  }
}

/**
 * Add item to registry
 */
function addToRegistry(item: CachedAudioMeta): boolean {
  const current = getAllCachedAudio();
  
  // Remove existing entry with same id
  const filtered = current.filter(m => m.id !== item.id);
  
  // Add new entry
  const updated = [...filtered, item];
  
  return saveToRegistry(updated);
}

/**
 * Remove item from registry
 */
function removeFromRegistry(id: string): boolean {
  const current = getAllCachedAudio();
  const filtered = current.filter(m => m.id !== id);
  return saveToRegistry(filtered);
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
    const key = getCacheKey(reciterId, surahId);
    
    // First check the registry (faster)
    const registry = getAllCachedAudio();
    const inRegistry = registry.some(m => m.id === key);
    
    if (inRegistry) {
      // Verify it's actually in the Cache API
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(key);
      
      if (response) {
        console.log(`[Cache] Hit: ${key}`);
        return true;
      } else {
        // Registry out of sync - remove from registry
        console.log(`[Cache] Registry says cached but not in Cache API: ${key}`);
        removeFromRegistry(key);
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('[Cache] Error checking cache:', error);
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
    console.error('[Cache] Error getting audio from cache:', error);
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
  console.log('[Cache] Starting save:', { reciterId, surahId, surahNameArabic });
  
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { success: false, error: 'Cache API not supported' };
  }
  
  try {
    const key = getCacheKey(reciterId, surahId);
    
    // Check if already cached
    const isCached = await checkAudioInCache(audioUrl, reciterId, surahId);
    if (isCached) {
      console.log('[Cache] Already cached:', key);
      return { success: true };
    }
    
    // Get the proxied URL to avoid CORS issues
    const proxiedUrl = shouldProxy(audioUrl) ? getProxiedUrl(audioUrl) : audioUrl;
    console.log('[Cache] Fetching from:', proxiedUrl.substring(0, 100) + '...');
    
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
    console.log('[Cache] Downloaded blob size:', blob.size);
    
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
    
    try {
      await cache.put(key, cachedResponse);
      console.log('[Cache] Successfully stored in Cache API:', key);
    } catch (cacheError: any) {
      if (cacheError.name === 'QuotaExceededError') {
        return { success: false, error: 'storage_full' };
      }
      throw cacheError;
    }
    
    // Save metadata to localStorage registry
    const meta: CachedAudioMeta = {
      id: key,
      url: audioUrl,
      timestamp: Date.now(),
      size: blob.size,
      surahId,
      surahNameArabic,
      surahNameEnglish,
      reciterId,
      reciterNameArabic,
      reciterNameEnglish,
    };
    
    const saved = addToRegistry(meta);
    if (!saved) {
      console.error('[Cache] Failed to save metadata to registry');
      // Try to clean up cache entry
      await cache.delete(key);
      return { success: false, error: 'Failed to save metadata' };
    }
    
    console.log('[Cache] Successfully saved to registry:', key);
    
    // Verify everything is saved
    const verifyRegistry = getAllCachedAudio();
    const verifyItem = verifyRegistry.find(m => m.id === key);
    if (!verifyItem) {
      console.error('[Cache] Verification failed - item not in registry after save');
      return { success: false, error: 'Verification failed' };
    }
    
    onProgress?.(100);
    
    return { success: true };
  } catch (error: any) {
    console.error('[Cache] Error saving audio to cache:', error);
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
    const key = getCacheKey(reciterId, surahId);
    console.log('[Cache] Removing:', key);
    
    // Remove from Cache API
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(key);
    
    // Remove from registry
    const removed = removeFromRegistry(key);
    
    console.log('[Cache] Removal result:', removed);
    return removed;
  } catch (error) {
    console.error('[Cache] Error removing audio from cache:', error);
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
    localStorage.removeItem(DOWNLOADS_REGISTRY_KEY);
    console.log('[Cache] Cleared all cache');
  } catch (error) {
    console.error('[Cache] Error clearing cache:', error);
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

/**
 * Debug: Log current cache state
 */
export function debugCacheState(): void {
  console.log('=== Cache Debug State ===');
  console.log('Registry:', getAllCachedAudio());
  console.log('localStorage key:', DOWNLOADS_REGISTRY_KEY);
  console.log('Cache API supported:', isCacheApiSupported());
}
