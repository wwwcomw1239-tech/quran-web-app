/**
 * Islamic Library API - ENHANCED VERSION with Quran.com v4 API
 * 
 * Real APIs used:
 * - Quran.com v4 API for verses and tafsir (PRIMARY - Most Reliable)
 * - fawazahmed0 Hadith API for hadiths
 * 
 * Features:
 * - Smart batched tafsir fetching (parallel requests)
 * - 24-hour caching with Next.js revalidate
 * - Robust error handling with fallback UI
 * - All tafsirs from Ahl al-Sunnah wal-Jama'ah only
 */

// API Configuration - QURAN.COM V4 API (Primary)
const QURAN_API = 'https://api.quran.com/api/v4';
const HADITH_API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';

// Cache configuration - 24 hours
const CACHE_REVALIDATE = 86400;

// In-memory cache for hadith books data
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

// Error messages in Arabic
export const ERROR_MESSAGES = {
  rateLimited: 'المكتبة تواجه ضغطاً كبيراً، يرجى المحاولة بعد قليل',
  serverError: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً',
  notFound: 'لم يتم العثور على البيانات المطلوبة',
  networkError: 'تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت',
  timeout: 'انتهت مهلة الطلب، يرجى المحاولة مرة أخرى',
  unknown: 'حدث خطأ غير متوقع',
  tafsirNotAvailable: 'عذراً، التفسير المطلوب غير متوفر حالياً في المصدر',
};

// ✅ VERIFIED Tafsirs from Quran.com API - Ahl al-Sunnah wal-Jama'ah ONLY
const AVAILABLE_TAFSIRS: Array<{ id: number; name: string; slug: string; language: string; author: string }> = [
  { id: 16, name: 'التفسير الميسر', slug: 'ar-tafsir-muyassar', language: 'arabic', author: 'مجمع الملك فهد' },
  { id: 91, name: 'تفسير السعدي', slug: 'ar-tafseer-al-saddi', language: 'arabic', author: 'الشيخ عبد الرحمن السعدي' },
  { id: 14, name: 'تفسير ابن كثير', slug: 'ar-tafsir-ibn-kathir', language: 'arabic', author: 'الإمام الحافظ ابن كثير' },
  { id: 15, name: 'تفسير الطبري', slug: 'ar-tafsir-al-tabari', language: 'arabic', author: 'الإمام محمد بن جرير الطبري' },
  { id: 90, name: 'تفسير القرطبي', slug: 'ar-tafseer-al-qurtubi', language: 'arabic', author: 'الإمام القرطبي' },
  { id: 93, name: 'تفسير البغوي', slug: 'ar-tafseer-al-baghawi', language: 'arabic', author: 'الإمام البغوي' },
  { id: 381, name: 'تفسير الوسيط - الزحيلي', slug: 'ar-tafsir-al-waseet', language: 'arabic', author: 'د. وهبة الزحيلي' },
];

// Available hadith books mapping - Ahl al-Sunnah wal-Jama'ah only
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
 * Fetch with timeout and error handling
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
 * Handle API response with proper error handling
 */
async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (response.status === 429) {
    return {
      data: null,
      error: ERROR_MESSAGES.rateLimited,
      status: 429,
      isRateLimited: true,
    };
  }

  if (response.status >= 500) {
    return {
      data: null,
      error: ERROR_MESSAGES.serverError,
      status: response.status,
      isRateLimited: false,
    };
  }

  if (response.status === 404) {
    return {
      data: null,
      error: ERROR_MESSAGES.notFound,
      status: 404,
      isRateLimited: false,
    };
  }

  if (response.ok) {
    try {
      const data = await response.json();
      return {
        data,
        error: null,
        status: response.status,
        isRateLimited: false,
      };
    } catch {
      return {
        data: null,
        error: ERROR_MESSAGES.unknown,
        status: response.status,
        isRateLimited: false,
      };
    }
  }

  return {
    data: null,
    error: ERROR_MESSAGES.unknown,
    status: response.status,
    isRateLimited: false,
  };
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
 * @param surahId - Surah number (1-114)
 */
export async function getSurahVerses(surahId: number): Promise<ApiResponse<QuranVerse[]>> {
  try {
    console.log(`[API] Fetching verses for surah ${surahId}`);

    // Validate surahId
    if (surahId < 1 || surahId > 114) {
      return {
        data: null,
        error: ERROR_MESSAGES.notFound,
        status: 404,
        isRateLimited: false,
      };
    }

    const response = await fetchWithTimeout(
      `${QURAN_API}/verses/by_chapter/${surahId}?language=ar&words=false&fields=text_uthmani,text_imlaei,verse_key,verse_number&per_page=300`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{
      verses: Array<{
        id: number;
        verse_number: number;
        verse_key: string;
        text_uthmani: string;
        text_imlaei: string;
      }>;
      pagination: { total_records: number };
    }>(response);

    if (result.data?.verses) {
      console.log(`[API] Successfully fetched ${result.data.verses.length} verses for surah ${surahId}`);
      return {
        data: result.data.verses,
        error: null,
        status: 200,
        isRateLimited: false,
      };
    }

    return {
      data: null,
      error: result.error,
      status: result.status,
      isRateLimited: result.isRateLimited,
    };
  } catch (error: any) {
    console.error(`[API] Error fetching verses for surah ${surahId}:`, error);
    return {
      data: null,
      error: error.message === 'timeout' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.networkError,
      status: 0,
      isRateLimited: false,
    };
  }
}

/**
 * Get Tafsir for a single verse
 * @param tafsirId - Tafsir ID from Quran.com
 * @param verseKey - Verse key (e.g., "1:1")
 */
export async function getVerseTafsir(
  tafsirId: number,
  verseKey: string
): Promise<ApiResponse<{ text: string }>> {
  try {
    const response = await fetchWithTimeout(
      `${QURAN_API}/tafsirs/${tafsirId}/by_ayah/${verseKey}`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{
      tafsir: {
        text: string;
        resource_name: string;
      };
    }>(response);

    if (result.data?.tafsir?.text) {
      // Clean HTML tags from tafsir text
      const cleanText = result.data.tafsir.text
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return {
        data: { text: cleanText },
        error: null,
        status: 200,
        isRateLimited: false,
      };
    }

    return {
      data: null,
      error: ERROR_MESSAGES.tafsirNotAvailable,
      status: 404,
      isRateLimited: false,
    };
  } catch (error: any) {
    console.error(`[API] Error fetching tafsir for ${verseKey}:`, error);
    return {
      data: null,
      error: ERROR_MESSAGES.tafsirNotAvailable,
      status: 0,
      isRateLimited: false,
    };
  }
}

/**
 * Get Surah with Tafsir - OPTIMIZED with parallel batch fetching
 * @param surahId - Surah number (1-114)
 * @param tafsirId - Tafsir ID from Quran.com
 */
export async function getSurahTafsir(
  surahId: number,
  tafsirId: number = 16
): Promise<ApiResponse<VerseWithTafsir[]>> {
  try {
    console.log(`[API] Fetching surah ${surahId} with tafsir ID ${tafsirId}`);

    // First, get all verses for the surah
    const versesResult = await getSurahVerses(surahId);

    if (!versesResult.data) {
      return {
        data: null,
        error: versesResult.error,
        status: versesResult.status,
        isRateLimited: versesResult.isRateLimited,
      };
    }

    const allVerses = versesResult.data;
    const verses: VerseWithTafsir[] = [];

    // Fetch tafsir in parallel batches of 5
    const BATCH_SIZE = 5;
    for (let i = 0; i < allVerses.length; i += BATCH_SIZE) {
      const batch = allVerses.slice(i, i + BATCH_SIZE);
      
      const batchResults = await Promise.allSettled(
        batch.map(verse => getVerseTafsir(tafsirId, verse.verse_key))
      );

      batch.forEach((verse, index) => {
        let tafsirText: string | null = null;
        let tafsirAvailable = false;

        const result = batchResults[index];
        if (result.status === 'fulfilled' && result.value.data?.text) {
          tafsirText = result.value.data.text;
          tafsirAvailable = true;
        }

        verses.push({
          id: verse.id,
          verse_number: verse.verse_number,
          verse_key: verse.verse_key,
          text_uthmani: verse.text_uthmani,
          text_imlaei_simple: verse.text_imlaei,
          tafsir_text: tafsirText,
          tafsir_available: tafsirAvailable,
        });
      });
    }

    console.log(`[API] Successfully processed ${verses.length} verses with tafsir`);

    return {
      data: verses,
      error: null,
      status: 200,
      isRateLimited: false,
    };
  } catch (error: any) {
    console.error(`[API] Error in getSurahTafsir:`, error);
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

  return {
    data: books,
    error: null,
    status: 200,
    isRateLimited: false,
  };
}

/**
 * Get Hadith book info
 */
export function getHadithBookInfo(bookId: string) {
  return HADITH_BOOKS_MAP[bookId] || null;
}

/**
 * Get Hadiths from a specific book - WITH CACHING
 * @param bookId - Book identifier (e.g., 'bukhari', 'muslim')
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 */
export async function getHadithsFromBook(
  bookId: string,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ hadiths: Hadith[]; total: number; page: number }>> {
  try {
    console.log(`[API] Fetching hadiths from book ${bookId}, page ${page}`);

    const bookInfo = HADITH_BOOKS_MAP[bookId];
    if (!bookInfo) {
      return {
        data: null,
        error: ERROR_MESSAGES.notFound,
        status: 404,
        isRateLimited: false,
      };
    }

    // Check in-memory cache first
    let rawHadiths = hadithCache[bookId];
    
    if (!rawHadiths) {
      const response = await fetchWithTimeout(
        `${HADITH_API_BASE}/editions/${bookInfo.file}.json`,
        {
          next: { revalidate: CACHE_REVALIDATE },
          headers: {
            'Accept': 'application/json',
          },
        },
        30000 // 30s timeout for large files
      );

      const result = await handleApiResponse<{
        hadiths: Array<{
          hadithnumber: number;
          arabnumber: number | string;
          text: string;
        }>;
      }>(response);

      if (result.data?.hadiths) {
        // Filter out hadiths with empty or very short text
        rawHadiths = result.data.hadiths.filter(h => 
          h.text && h.text.trim().length > 10
        );
        // Cache for future requests
        hadithCache[bookId] = rawHadiths;
      } else {
        return {
          data: null,
          error: result.error,
          status: result.status,
          isRateLimited: result.isRateLimited,
        };
      }
    }

    const total = rawHadiths.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHadiths = rawHadiths.slice(startIndex, endIndex);

    const hadiths: Hadith[] = paginatedHadiths.map((h: any) => ({
      id: `${bookId}-${h.hadithnumber}`,
      hadithnumber: h.hadithnumber,
      arabnumber: typeof h.arabnumber === 'string' ? parseInt(h.arabnumber) || h.hadithnumber : h.arabnumber || h.hadithnumber,
      text: h.text,
      book: {
        id: bookId,
        name: bookInfo.name,
      },
    }));

    console.log(`[API] Successfully fetched ${hadiths.length} hadiths from ${bookInfo.name}`);

    return {
      data: {
        hadiths,
        total,
        page,
      },
      error: null,
      status: 200,
      isRateLimited: false,
    };
  } catch (error: any) {
    console.error(`[API] Error fetching hadiths from ${bookId}:`, error);
    return {
      data: null,
      error: error.message === 'timeout' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.networkError,
      status: 0,
      isRateLimited: false,
    };
  }
}

/**
 * Search Hadiths - OPTIMIZED with caching
 */
export async function searchHadiths(
  query: string,
  bookId?: string
): Promise<ApiResponse<Hadith[]>> {
  try {
    if (!query || query.length < 3) {
      return {
        data: [],
        error: null,
        status: 200,
        isRateLimited: false,
      };
    }

    const booksToSearch = bookId ? [bookId] : Object.keys(HADITH_BOOKS_MAP).slice(0, 3);
    const results: Hadith[] = [];
    const queryLower = query.toLowerCase();

    for (const book of booksToSearch) {
      const bookInfo = HADITH_BOOKS_MAP[book];
      if (!bookInfo) continue;

      // Try cached data first
      let rawHadiths = hadithCache[book];
      
      if (!rawHadiths) {
        const response = await fetchWithTimeout(
          `${HADITH_API_BASE}/editions/${bookInfo.file}.json`,
          {
            next: { revalidate: CACHE_REVALIDATE },
            headers: {
              'Accept': 'application/json',
            },
          },
          30000
        );

        const result = await handleApiResponse<{
          hadiths: Array<{
            hadithnumber: number;
            arabnumber: number | string;
            text: string;
          }>;
        }>(response);

        if (result.data?.hadiths) {
          rawHadiths = result.data.hadiths.filter((h: any) => h.text && h.text.trim().length > 10);
          hadithCache[book] = rawHadiths;
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
            book: {
              id: book,
              name: bookInfo.name,
            },
          }));
        results.push(...filtered);
      }

      if (results.length >= 20) break;
    }

    return {
      data: results.slice(0, 20),
      error: null,
      status: 200,
      isRateLimited: false,
    };
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
