/**
 * Islamic Library API - PRODUCTION READY
 * 
 * Real APIs used:
 * - Quran.com v4 API for verses and tafsir
 * - fawazahmed0 Hadith API for hadiths
 * 
 * CRITICAL FIX: Added per_page=300 to tafsir chapter endpoint
 * to fetch ALL verses in one request (API defaults to 10 without it)
 * 
 * Also handles:
 * - Missing verses in some tafsirs (e.g. Saadi merges some verses)
 * - Multi-page fetching for surahs with 300+ total_records
 * - Robust retry with exponential backoff
 * - In-memory caching
 */

// API Configuration
const QURAN_API = 'https://api.quran.com/api/v4';
const HADITH_API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';

// Cache
const CACHE_REVALIDATE = 86400;
const tafsirCache: Record<string, VerseWithTafsir[]> = {};
const hadithCache: Record<string, any> = {};

// Types
export interface QuranVerse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  text_imlaei: string;
}

export interface SurahInfo {
  id: number;
  name: string;
  englishName: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Tafsir {
  id: number;
  name: string;
  language_name: string;
  author_name: string | null;
  slug: string;
  source: string;
}

export interface VerseWithTafsir {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  text_imlaei_simple: string;
  tafsir_text: string | null;
  tafsir_available: boolean;
}

export interface HadithBook {
  id: string;
  name: string;
  hadiths_count: number;
  available: boolean;
}

export interface Hadith {
  id: string;
  hadithnumber: number;
  arabnumber: number;
  text: string;
  book?: {
    id: string;
    name: string;
  };
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  isRateLimited: boolean;
}

// Error messages
export const ERROR_MESSAGES = {
  rateLimited: 'المكتبة تواجه ضغطاً كبيراً، يرجى المحاولة بعد قليل',
  serverError: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً',
  notFound: 'لم يتم العثور على البيانات المطلوبة',
  networkError: 'تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت',
  timeout: 'انتهت مهلة الطلب، يرجى المحاولة مرة أخرى',
  unknown: 'حدث خطأ غير متوقع',
  tafsirNotAvailable: 'عذراً، التفسير المطلوب غير متوفر حالياً في المصدر',
};

// Verified Tafsirs from Quran.com API - Ahl al-Sunnah only
const AVAILABLE_TAFSIRS: Array<{ id: number; name: string; slug: string; language: string; author: string }> = [
  { id: 16, name: 'التفسير الميسر', slug: 'ar-tafsir-muyassar', language: 'arabic', author: 'مجمع الملك فهد' },
  { id: 91, name: 'تفسير السعدي', slug: 'ar-tafseer-al-saddi', language: 'arabic', author: 'الشيخ عبد الرحمن السعدي' },
  { id: 14, name: 'تفسير ابن كثير', slug: 'ar-tafsir-ibn-kathir', language: 'arabic', author: 'الإمام الحافظ ابن كثير' },
  { id: 15, name: 'تفسير الطبري', slug: 'ar-tafsir-al-tabari', language: 'arabic', author: 'الإمام محمد بن جرير الطبري' },
  { id: 90, name: 'تفسير القرطبي', slug: 'ar-tafseer-al-qurtubi', language: 'arabic', author: 'الإمام القرطبي' },
  { id: 94, name: 'تفسير البغوي', slug: 'ar-tafsir-al-baghawi', language: 'arabic', author: 'الإمام البغوي' },
  { id: 93, name: 'التفسير الوسيط - الطنطاوي', slug: 'ar-tafsir-al-wasit', language: 'arabic', author: 'محمد سيد طنطاوي' },
];

// Hadith books
const HADITH_BOOKS_MAP: Record<string, { name: string; file: string; author: string; description: string }> = {
  'bukhari': { name: 'صحيح البخاري', file: 'ara-bukhari', author: 'الإمام محمد بن إسماعيل البخاري', description: 'أصح كتاب بعد كتاب الله تعالى' },
  'muslim': { name: 'صحيح مسلم', file: 'ara-muslim', author: 'الإمام مسلم بن الحجاج النيسابوري', description: 'ثاني أصح كتب الحديث' },
  'abudawud': { name: 'سنن أبي داود', file: 'ara-abudawud', author: 'الإمام أبو داود السجستاني', description: 'من أمهات كتب السنن' },
  'tirmidhi': { name: 'سنن الترمذي', file: 'ara-tirmidhi', author: 'الإمام أبو عيسى الترمذي', description: 'الجامع الصحيح للترمذي' },
  'nasai': { name: 'سنن النسائي', file: 'ara-nasai', author: 'الإمام أحمد بن شعيب النسائي', description: 'المجتبى من السنن' },
  'ibnmajah': { name: 'سنن ابن ماجه', file: 'ara-ibnmajah', author: 'الإمام محمد بن يزيد ابن ماجه', description: 'السنن لابن ماجه' },
  'malik': { name: 'موطأ مالك', file: 'ara-malik', author: 'الإمام مالك بن أنس', description: 'أول كتاب مصنف في الحديث' },
  'ahmad': { name: 'مسند أحمد', file: 'ara-ahmad', author: 'الإمام أحمد بن حنبل', description: 'أعظم المسانيد' },
  'darimi': { name: 'سنن الدارمي', file: 'ara-darimi', author: 'الإمام عبد الله بن عبد الرحمن الدارمي', description: 'مسند الدارمي' },
};

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 15000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('timeout');
    }
    throw error;
  }
}

/**
 * Retry fetch with exponential backoff
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 2,
  timeout: number = 15000
): Promise<Response> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout);
      if (response.ok || response.status === 404) return response;
      if (response.status === 429) {
        // Rate limited - wait longer and retry
        await new Promise(r => setTimeout(r, (i + 1) * 3000));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        await new Promise(r => setTimeout(r, (i + 1) * 1500));
      }
    }
  }
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Clean HTML tags from text
 */
function cleanHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Get list of available Tafsirs
 */
export async function getTafsirsList(): Promise<ApiResponse<Tafsir[]>> {
  const tafsirs: Tafsir[] = AVAILABLE_TAFSIRS.map(t => ({
    id: t.id,
    name: t.name,
    language_name: t.language,
    author_name: t.author,
    slug: t.slug,
    source: 'quran.com',
  }));

  return {
    data: tafsirs,
    error: null,
    status: 200,
    isRateLimited: false,
  };
}

/**
 * Get Surah Verses from Quran.com API
 */
export async function getSurahVerses(surahId: number): Promise<ApiResponse<QuranVerse[]>> {
  try {
    if (surahId < 1 || surahId > 114) {
      return { data: null, error: ERROR_MESSAGES.notFound, status: 404, isRateLimited: false };
    }

    const response = await fetchWithRetry(
      `${QURAN_API}/verses/by_chapter/${surahId}?language=ar&words=false&fields=text_uthmani,text_imlaei,verse_key,verse_number&per_page=300`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: { 'Accept': 'application/json' },
      } as any
    );

    if (!response.ok) {
      return { data: null, error: ERROR_MESSAGES.serverError, status: response.status, isRateLimited: response.status === 429 };
    }

    const data = await response.json();
    if (data?.verses) {
      return { data: data.verses, error: null, status: 200, isRateLimited: false };
    }

    return { data: null, error: ERROR_MESSAGES.notFound, status: 404, isRateLimited: false };
  } catch (error: any) {
    return {
      data: null,
      error: error.message === 'timeout' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.networkError,
      status: 0,
      isRateLimited: false,
    };
  }
}

/**
 * CRITICAL FIX: Get tafsir for entire surah with PROPER PAGINATION
 * 
 * The Quran.com API defaults to per_page=10 if not specified.
 * We MUST pass per_page=300 to get all verses in one request.
 * For very long surahs, we also handle multi-page responses.
 */
async function getSurahTafsirText(surahId: number, tafsirId: number): Promise<Record<string, string>> {
  const tafsirMap: Record<string, string> = {};

  try {
    // ============================================================
    // MAIN REQUEST: Fetch tafsir with per_page=300
    // Without per_page, API returns only 10 items (the old bug!)
    // ============================================================
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const url = `${QURAN_API}/tafsirs/${tafsirId}/by_chapter/${surahId}?per_page=300&page=${currentPage}`;
      
      const response = await fetchWithRetry(
        url,
        {
          next: { revalidate: CACHE_REVALIDATE },
          headers: { 'Accept': 'application/json' },
        } as any,
        2,
        25000
      );

      if (!response.ok) {
        console.error(`[API] Tafsir request failed: status ${response.status}`);
        break;
      }

      const data = await response.json();
      
      if (data?.tafsirs && Array.isArray(data.tafsirs)) {
        for (const t of data.tafsirs) {
          if (t.verse_key && t.text) {
            const cleaned = cleanHtml(t.text);
            if (cleaned.length > 0) {
              tafsirMap[t.verse_key] = cleaned;
            }
          }
        }
      }

      // Check pagination for more pages
      const pagination = data?.pagination;
      if (pagination && pagination.next_page && pagination.next_page > currentPage) {
        currentPage = pagination.next_page;
      } else {
        hasMorePages = false;
      }
    }
  } catch (error) {
    console.error(`[API] Error fetching chapter tafsir for surah ${surahId}, tafsir ${tafsirId}:`, error);
  }

  // ============================================================
  // FALLBACK: If chapter endpoint returned NO results at all,
  // try the per-verse endpoint as a last resort
  // ============================================================
  if (Object.keys(tafsirMap).length === 0) {
    console.warn(`[API] Chapter endpoint returned 0 results. Falling back to per-verse for surah ${surahId}, tafsir ${tafsirId}`);
    try {
      const versesResp = await fetchWithRetry(
        `${QURAN_API}/verses/by_chapter/${surahId}?language=ar&words=false&fields=verse_key&per_page=300`,
        { headers: { 'Accept': 'application/json' } }
      );
      
      if (versesResp.ok) {
        const versesData = await versesResp.json();
        const verseKeys: string[] = versesData?.verses?.map((v: any) => v.verse_key) || [];
        
        // Fetch tafsir in batches of 5 (smaller batches to avoid rate limiting)
        const BATCH_SIZE = 5;
        for (let i = 0; i < verseKeys.length; i += BATCH_SIZE) {
          const batch = verseKeys.slice(i, i + BATCH_SIZE);
          const results = await Promise.allSettled(
            batch.map((key: string) =>
              fetchWithRetry(
                `${QURAN_API}/tafsirs/${tafsirId}/by_ayah/${key}`,
                { headers: { 'Accept': 'application/json' } },
                1,
                10000
              ).then(r => r.json())
            )
          );

          results.forEach((result, idx) => {
            if (result.status === 'fulfilled' && result.value?.tafsir?.text) {
              const cleaned = cleanHtml(result.value.tafsir.text);
              if (cleaned.length > 0) {
                tafsirMap[batch[idx]] = cleaned;
              }
            }
          });

          // Delay between batches to avoid rate limiting
          if (i + BATCH_SIZE < verseKeys.length) {
            await new Promise(r => setTimeout(r, 300));
          }
        }
      }
    } catch (error) {
      console.error('[API] Fallback tafsir fetch failed:', error);
    }
  }

  return tafsirMap;
}

/**
 * Get Surah with Tafsir - OPTIMIZED
 * 
 * Handles the case where some tafsirs don't cover every verse
 * (e.g. Saadi sometimes merges verses like 2:285-286)
 */
export async function getSurahTafsir(
  surahId: number,
  tafsirId: number = 16
): Promise<ApiResponse<VerseWithTafsir[]>> {
  try {
    // Check cache first
    const cacheKey = `${surahId}-${tafsirId}`;
    if (tafsirCache[cacheKey]) {
      return { data: tafsirCache[cacheKey], error: null, status: 200, isRateLimited: false };
    }

    // 1. Get all verses for the surah
    const versesResult = await getSurahVerses(surahId);
    if (!versesResult.data) {
      return { data: null, error: versesResult.error, status: versesResult.status, isRateLimited: versesResult.isRateLimited };
    }

    // 2. Get tafsir text for the entire surah
    const tafsirMap = await getSurahTafsirText(surahId, tafsirId);

    // 3. Combine verses with tafsir
    // For verses missing tafsir, try to find the nearest previous verse that has tafsir
    // (some tafsirs merge consecutive verses together)
    const verses: VerseWithTafsir[] = versesResult.data.map(verse => {
      let tafsirText = tafsirMap[verse.verse_key] || null;
      
      // If this verse has no tafsir, check if it was merged with the previous verse
      // This handles cases like Saadi's tafsir where 2:286 is merged into 2:285
      if (!tafsirText && verse.verse_number > 1) {
        const prevKey = `${surahId}:${verse.verse_number - 1}`;
        const prevTafsir = tafsirMap[prevKey];
        if (prevTafsir) {
          // Mark as merged - the tafsir was included in the previous verse
          tafsirText = `[تفسير هذه الآية مدمج مع الآية السابقة (${verse.verse_number - 1})]`;
        }
      }

      return {
        id: verse.id,
        verse_number: verse.verse_number,
        verse_key: verse.verse_key,
        text_uthmani: verse.text_uthmani,
        text_imlaei_simple: verse.text_imlaei || '',
        tafsir_text: tafsirText,
        tafsir_available: !!tafsirText,
      };
    });

    // Cache the result
    tafsirCache[cacheKey] = verses;

    return { data: verses, error: null, status: 200, isRateLimited: false };
  } catch (error: any) {
    return {
      data: null,
      error: error.message === 'timeout' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.networkError,
      status: 0,
      isRateLimited: false,
    };
  }
}

/**
 * Get list of Hadith books
 */
export async function getHadithBooks(): Promise<ApiResponse<HadithBook[]>> {
  const books: HadithBook[] = Object.entries(HADITH_BOOKS_MAP).map(([id, info]) => ({
    id,
    name: info.name,
    hadiths_count: 0,
    available: true,
  }));

  return { data: books, error: null, status: 200, isRateLimited: false };
}

/**
 * Get Hadith book info
 */
export function getHadithBookInfo(bookId: string) {
  return HADITH_BOOKS_MAP[bookId] || null;
}

/**
 * Get Hadiths from a specific book
 */
export async function getHadithsFromBook(
  bookId: string,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ hadiths: Hadith[]; total: number; page: number }>> {
  try {
    const bookInfo = HADITH_BOOKS_MAP[bookId];
    if (!bookInfo) {
      return { data: null, error: ERROR_MESSAGES.notFound, status: 404, isRateLimited: false };
    }

    let rawHadiths = hadithCache[bookId];

    if (!rawHadiths) {
      const response = await fetchWithRetry(
        `${HADITH_API_BASE}/editions/${bookInfo.file}.json`,
        {
          next: { revalidate: CACHE_REVALIDATE },
          headers: { 'Accept': 'application/json' },
        } as any,
        2,
        30000
      );

      if (!response.ok) {
        return { data: null, error: ERROR_MESSAGES.serverError, status: response.status, isRateLimited: response.status === 429 };
      }

      const data = await response.json();
      if (data?.hadiths) {
        rawHadiths = data.hadiths.filter((h: any) => h.text && h.text.trim().length > 10);
        hadithCache[bookId] = rawHadiths;
      } else {
        return { data: null, error: ERROR_MESSAGES.notFound, status: 404, isRateLimited: false };
      }
    }

    const total = rawHadiths.length;
    const startIndex = (page - 1) * limit;
    const paginatedHadiths = rawHadiths.slice(startIndex, startIndex + limit);

    const hadiths: Hadith[] = paginatedHadiths.map((h: any) => ({
      id: `${bookId}-${h.hadithnumber}`,
      hadithnumber: h.hadithnumber,
      arabnumber: typeof h.arabnumber === 'string' ? parseInt(h.arabnumber) || h.hadithnumber : h.arabnumber || h.hadithnumber,
      text: h.text,
      book: { id: bookId, name: bookInfo.name },
    }));

    return { data: { hadiths, total, page }, error: null, status: 200, isRateLimited: false };
  } catch (error: any) {
    return {
      data: null,
      error: error.message === 'timeout' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.networkError,
      status: 0,
      isRateLimited: false,
    };
  }
}

/**
 * Search Hadiths
 */
export async function searchHadiths(
  query: string,
  bookId?: string
): Promise<ApiResponse<Hadith[]>> {
  try {
    if (!query || query.length < 3) {
      return { data: [], error: null, status: 200, isRateLimited: false };
    }

    const booksToSearch = bookId ? [bookId] : Object.keys(HADITH_BOOKS_MAP).slice(0, 3);
    const results: Hadith[] = [];
    const queryLower = query.toLowerCase();

    for (const book of booksToSearch) {
      const bookInfo = HADITH_BOOKS_MAP[book];
      if (!bookInfo) continue;

      let rawHadiths = hadithCache[book];

      if (!rawHadiths) {
        try {
          const response = await fetchWithRetry(
            `${HADITH_API_BASE}/editions/${bookInfo.file}.json`,
            {
              next: { revalidate: CACHE_REVALIDATE },
              headers: { 'Accept': 'application/json' },
            } as any,
            1,
            30000
          );

          if (response.ok) {
            const data = await response.json();
            if (data?.hadiths) {
              rawHadiths = data.hadiths.filter((h: any) => h.text && h.text.trim().length > 10);
              hadithCache[book] = rawHadiths;
            }
          }
        } catch {
          continue;
        }
      }

      if (rawHadiths) {
        const filtered = rawHadiths
          .filter((h: any) => h.text?.toLowerCase().includes(queryLower))
          .slice(0, 10)
          .map((h: any) => ({
            id: `${book}-${h.hadithnumber}`,
            hadithnumber: h.hadithnumber,
            arabnumber: typeof h.arabnumber === 'string' ? parseInt(h.arabnumber) || h.hadithnumber : h.arabnumber || h.hadithnumber,
            text: h.text,
            book: { id: book, name: bookInfo.name },
          }));
        results.push(...filtered);
      }

      if (results.length >= 20) break;
    }

    return { data: results.slice(0, 20), error: null, status: 200, isRateLimited: false };
  } catch (error: any) {
    return {
      data: null,
      error: error.message === 'timeout' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.networkError,
      status: 0,
      isRateLimited: false,
    };
  }
}

// Re-export for backward compatibility
export type { VerseWithTafsir as VerseWithTafsirOld };
