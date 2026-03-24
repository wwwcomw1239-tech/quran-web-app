/**
 * Islamic Library API - DYNAMIC VERSION
 * 
 * Real APIs used:
 * - Quranenc API for translations/tafsir
 * - fawazahmed0 Hadith API for hadiths
 * 
 * Features:
 * - 24-hour caching with Next.js revalidate
 * - Debouncing support
 * - Rate limit handling (429)
 * - Dynamic surah/book fetching
 */

// API Configuration - REAL WORKING APIs
const QURANENC_API = 'https://quranenc.com/api/v1';
const HADITH_API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';

// Cache configuration - 24 hours
const CACHE_REVALIDATE = 86400;

// Types
export interface QuranVerse {
  id: number;
  sura: number;
  verseNumber: number;
  aya: string;
  translation: string;
  footnotes: string | null;
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
  words_count: number;
  tafsirs: {
    id: number;
    verse_id: number;
    tafsir_id: number;
    text: string;
    tafsir?: Tafsir;
  }[];
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
};

// Available translations/tafsirs - Updated with Ibn Kathir
const AVAILABLE_TRANSLATIONS = [
  { id: 1, name: 'التفسير الميسر', slug: 'arabic_moyassar', language: 'arabic' },
  { id: 2, name: 'تفسير السعدي', slug: 'arabic_saadi', language: 'arabic' },
  { id: 3, name: 'تفسير ابن كثير', slug: 'arabic_ibn_katheer', language: 'arabic' },
  { id: 4, name: 'المختصر في التفسير', slug: 'arabic_mokhtasar', language: 'arabic' },
  { id: 5, name: 'تفسير الجلالين', slug: 'arabic_jalalayn', language: 'arabic' },
];

// Available hadith books mapping
const HADITH_BOOKS_MAP: Record<string, { name: string; file: string }> = {
  'bukhari': { name: 'صحيح البخاري', file: 'ara-bukhari' },
  'muslim': { name: 'صحيح مسلم', file: 'ara-muslim' },
  'abudawud': { name: 'سنن أبي داود', file: 'ara-abudawud' },
  'tirmidhi': { name: 'سنن الترمذي', file: 'ara-tirmidhi' },
  'nasai': { name: 'سنن النسائي', file: 'ara-nasai' },
  'ibnmajah': { name: 'سنن ابن ماجه', file: 'ara-ibnmajah' },
  'malik': { name: 'موطأ مالك', file: 'ara-malik' },
  'ahmad': { name: 'مسند أحمد', file: 'ara-ahmad' },
  'darimi': { name: 'سنن الدارمي', file: 'ara-darimi' },
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
 * Get list of available Tafsirs/Translations
 */
export async function getTafsirsList(): Promise<ApiResponse<Tafsir[]>> {
  const tafsirs: Tafsir[] = AVAILABLE_TRANSLATIONS.map(t => ({
    id: t.id,
    name: t.name,
    language_name: t.language,
    author_name: null,
    slug: t.slug,
    source: 'quranenc',
  }));

  return {
    data: tafsirs,
    error: null,
    status: 200,
    isRateLimited: false,
  };
}

/**
 * Get Surah with Translation/Tafsir - DYNAMIC
 * @param surahId - Surah number (1-114)
 * @param translationSlug - Translation identifier
 */
export async function getSurahTafsir(
  surahId: number,
  translationSlug: string = 'arabic_moyassar'
): Promise<ApiResponse<VerseWithTafsir[]>> {
  try {
    console.log(`[API] Fetching surah ${surahId} with translation ${translationSlug}`);
    
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
      `${QURANENC_API}/translation/sura/${translationSlug}/${surahId}`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{
      result: Array<{
        id: number;
        sura: number;
        aya_number: number;
        aya: string;
        translation: string;
        footnotes: string | null;
      }>;
    }>(response);

    if (result.data?.result) {
      // Transform to our format
      const verses: VerseWithTafsir[] = result.data.result.map((v) => ({
        id: v.id,
        verse_number: v.aya_number,
        verse_key: `${surahId}:${v.aya_number}`,
        text_uthmani: v.aya,
        text_imlaei_simple: v.aya,
        words_count: 0,
        tafsirs: [{
          id: 1,
          verse_id: v.id,
          tafsir_id: 1,
          text: v.translation || '',
        }],
      }));

      console.log(`[API] Successfully fetched ${verses.length} verses for surah ${surahId}`);

      return {
        data: verses,
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
    console.error(`[API] Error fetching surah ${surahId}:`, error);
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
 * Get Hadiths from a specific book - DYNAMIC
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

    const response = await fetchWithTimeout(
      `${HADITH_API_BASE}/editions/${bookInfo.file}.json`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{
      hadiths: Array<{
        hadithnumber: number;
        arabnumber: number | string;
        text: string;
      }>;
    }>(response);

    if (result.data?.hadiths) {
      const allHadiths = result.data.hadiths;
      const total = allHadiths.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedHadiths = allHadiths.slice(startIndex, endIndex);

      const hadiths: Hadith[] = paginatedHadiths.map((h, index) => ({
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
    }

    return {
      data: null,
      error: result.error,
      status: result.status,
      isRateLimited: result.isRateLimited,
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
 * Search Hadiths
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

      const response = await fetchWithTimeout(
        `${HADITH_API_BASE}/editions/${bookInfo.file}.json`,
        {
          next: { revalidate: CACHE_REVALIDATE },
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      const result = await handleApiResponse<{
        hadiths: Array<{
          hadithnumber: number;
          arabnumber: number | string;
          text: string;
        }>;
      }>(response);

      if (result.data?.hadiths) {
        const filtered = result.data.hadiths
          .filter((h) => h.text?.toLowerCase().includes(queryLower))
          .slice(0, 10)
          .map((h) => ({
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
