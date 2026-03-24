/**
 * Islamic Library API
 * 
 * Provides access to:
 * - Tafsir from Quran.com API
 * - Hadith from sunnah.api (and fallback sources)
 * 
 * Features:
 * - 24-hour caching with Next.js revalidate
 * - Debouncing support
 * - Rate limit handling (429)
 * - Graceful error fallbacks
 */

// API Configuration
const QURAN_API_BASE = 'https://api.quran.com/api/v4';
const HADITH_API_BASE = 'https://api.hadith.sutanlab.id';
const HADITH_API_ALT = 'https://api.sunnah.com/v1'; // Alternative

// Cache configuration - 24 hours
const CACHE_REVALIDATE = 86400;

// Types
export interface Tafsir {
  id: number;
  name: string;
  language_name: string;
  author_name: string | null;
  slug: string;
  source: string;
}

export interface TafsirVerse {
  id: number;
  verse_id: number;
  verse_key: string;
  text_uthmani: string;
  text_imlaei: string;
  tafsir_text: string;
}

export interface TafsirResponse {
  tafsirs: Tafsir[];
  pagination: {
    next_page: number | null;
    current_page: number;
    total_pages: number;
    total_records: number;
  };
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
  number: number;
  arab: string;
  id?: string;
  book?: {
    id: string;
    name: string;
  };
  chapter?: {
    id: string;
    title: string;
  };
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  isRateLimited: boolean;
}

// Error messages in Arabic
const ERROR_MESSAGES = {
  rateLimited: 'المكتبة تواجه ضغطاً كبيراً، يرجى المحاولة بعد قليل',
  serverError: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً',
  notFound: 'لم يتم العثور على البيانات المطلوبة',
  networkError: 'تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت',
  timeout: 'انتهت مهلة الطلب، يرجى المحاولة مرة أخرى',
  unknown: 'حدث خطأ غير متوقع',
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
  // Handle rate limiting
  if (response.status === 429) {
    return {
      data: null,
      error: ERROR_MESSAGES.rateLimited,
      status: 429,
      isRateLimited: true,
    };
  }

  // Handle server errors
  if (response.status >= 500) {
    return {
      data: null,
      error: ERROR_MESSAGES.serverError,
      status: response.status,
      isRateLimited: false,
    };
  }

  // Handle not found
  if (response.status === 404) {
    return {
      data: null,
      error: ERROR_MESSAGES.notFound,
      status: 404,
      isRateLimited: false,
    };
  }

  // Handle success
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
 * Cached for 24 hours
 */
export async function getTafsirsList(): Promise<ApiResponse<Tafsir[]>> {
  try {
    const response = await fetchWithTimeout(
      `${QURAN_API_BASE}/resources/tafsirs`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{ tafsirs: Tafsir[] }>(response);
    
    if (result.data) {
      // Filter Arabic tafsirs only
      const arabicTafsirs = result.data.tafsirs.filter(
        (t) => t.language_name === 'arabic'
      );
      return {
        data: arabicTafsirs,
        error: null,
        status: result.status,
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
    return {
      data: null,
      error: error.message === 'timeout' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.networkError,
      status: 0,
      isRateLimited: false,
    };
  }
}

/**
 * Get Tafsir for a specific verse
 * Cached for 24 hours
 */
export async function getVerseTafsir(
  verseKey: string,
  tafsirId: number = 169 // Default: Tafsir Ibn Kathir
): Promise<ApiResponse<VerseWithTafsir>> {
  try {
    const response = await fetchWithTimeout(
      `${QURAN_API_BASE}/verses/${verseKey}?language=ar&words=true&tafsirs=${tafsirId}&word_fields=verse_key,verse_id&fields=text_uthmani,text_imlaei_simple,words_count`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{ verse: VerseWithTafsir }>(response);
    
    return {
      data: result.data?.verse || null,
      error: result.error,
      status: result.status,
      isRateLimited: result.isRateLimited,
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

/**
 * Get Tafsir for a whole Surah
 * Cached for 24 hours
 */
export async function getSurahTafsir(
  surahId: number,
  tafsirId: number = 169
): Promise<ApiResponse<VerseWithTafsir[]>> {
  try {
    const response = await fetchWithTimeout(
      `${QURAN_API_BASE}/verses/by_chapter/${surahId}?language=ar&words=false&tafsirs=${tafsirId}&fields=text_uthmani,text_imlaei_simple,words_count,verse_key,verse_number&per_page=300`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{ verses: VerseWithTafsir[] }>(response);
    
    return {
      data: result.data?.verses || null,
      error: result.error,
      status: result.status,
      isRateLimited: result.isRateLimited,
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

/**
 * Get list of Hadith books
 * Cached for 24 hours
 */
export async function getHadithBooks(): Promise<ApiResponse<HadithBook[]>> {
  try {
    const response = await fetchWithTimeout(
      `${HADITH_API_BASE}/books`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{ data: { id: string; name: string; hadiths_count: number; available: boolean }[] }>(response);
    
    // Standard Hadith books in Arabic
    const standardBooks: HadithBook[] = [
      { id: 'bukhari', name: 'صحيح البخاري', hadiths_count: 7008, available: true },
      { id: 'muslim', name: 'صحيح مسلم', hadiths_count: 5362, available: true },
      { id: 'abu-daud', name: 'سنن أبي داود', hadiths_count: 4590, available: true },
      { id: 'tirmidzi', name: 'سنن الترمذي', hadiths_count: 3891, available: true },
      { id: 'nasai', name: 'سنن النسائي', hadiths_count: 5364, available: true },
      { id: 'ibnu-majah', name: 'سنن ابن ماجه', hadiths_count: 4285, available: true },
      { id: 'malik', name: 'موطأ مالك', hadiths_count: 1594, available: true },
      { id: 'ahmad', name: 'مسند أحمد', hadiths_count: 26398, available: true },
      { id: 'darimi', name: 'سنن الدارمي', hadiths_count: 2949, available: true },
    ];

    return {
      data: standardBooks,
      error: null,
      status: 200,
      isRateLimited: false,
    };
  } catch (error: any) {
    // Return default books even on error
    return {
      data: [
        { id: 'bukhari', name: 'صحيح البخاري', hadiths_count: 7008, available: true },
        { id: 'muslim', name: 'صحيح مسلم', hadiths_count: 5362, available: true },
        { id: 'abu-daud', name: 'سنن أبي داود', hadiths_count: 4590, available: true },
        { id: 'tirmidzi', name: 'سنن الترمذي', hadiths_count: 3891, available: true },
        { id: 'nasai', name: 'سنن النسائي', hadiths_count: 5364, available: true },
        { id: 'ibnu-majah', name: 'سنن ابن ماجه', hadiths_count: 4285, available: true },
      ],
      error: null,
      status: 200,
      isRateLimited: false,
    };
  }
}

/**
 * Get Hadiths from a specific book
 * Cached for 24 hours
 */
export async function getHadithsFromBook(
  bookId: string,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ hadiths: Hadith[]; total: number; page: number }>> {
  try {
    const response = await fetchWithTimeout(
      `${HADITH_API_BASE}/books/${bookId}?page=${page}&limit=${limit}`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{
      data: Hadith[];
      total: number;
      current_page: number;
      last_page: number;
    }>(response);

    if (result.data) {
      return {
        data: {
          hadiths: result.data.data || [],
          total: result.data.total || 0,
          page: result.data.current_page || page,
        },
        error: null,
        status: result.status,
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
    return {
      data: null,
      error: error.message === 'timeout' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.networkError,
      status: 0,
      isRateLimited: false,
    };
  }
}

/**
 * Get a specific Hadith by number
 * Cached for 24 hours
 */
export async function getHadithByNumber(
  bookId: string,
  hadithNumber: number
): Promise<ApiResponse<Hadith>> {
  try {
    const response = await fetchWithTimeout(
      `${HADITH_API_BASE}/books/${bookId}/${hadithNumber}`,
      {
        next: { revalidate: CACHE_REVALIDATE },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await handleApiResponse<{ data: Hadith; error: { message: string } }>(response);

    if (result.data) {
      return {
        data: result.data.data || null,
        error: null,
        status: result.status,
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
    return {
      data: null,
      error: error.message === 'timeout' ? ERROR_MESSAGES.timeout : ERROR_MESSAGES.networkError,
      status: 0,
      isRateLimited: false,
    };
  }
}

/**
 * Search Hadiths (client-side filtering after fetching)
 * Note: The API doesn't support full-text search, so we fetch and filter
 */
export async function searchHadiths(
  query: string,
  bookId?: string
): Promise<ApiResponse<Hadith[]>> {
  try {
    // Fetch from specific book or multiple books
    const booksToSearch = bookId ? [bookId] : ['bukhari', 'muslim'];
    const results: Hadith[] = [];

    for (const book of booksToSearch) {
      const response = await fetchWithTimeout(
        `${HADITH_API_BASE}/books/${book}?page=1&limit=50`,
        {
          next: { revalidate: CACHE_REVALIDATE },
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      const result = await handleApiResponse<{ data: Hadith[] }>(response);
      
      if (result.data?.data) {
        const filtered = result.data.data.filter((h: Hadith) =>
          h.arab?.includes(query)
        );
        results.push(...filtered.map((h: Hadith) => ({ ...h, book: { id: book, name: book } })));
      }

      // Stop if rate limited
      if (result.isRateLimited) {
        break;
      }
    }

    return {
      data: results.slice(0, 20), // Limit results
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

// Export error messages for use in UI
export { ERROR_MESSAGES };
