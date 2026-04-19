'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ExternalLink, Download, Loader2, BookOpen, FileText, Search, X, 
  ChevronDown, ChevronUp, BookMarked, Library, Scroll, 
  PenLine, MessageCircleQuestion, Languages, Heart,
  Sparkles, Eye, ArrowRight, BookText, Scale, Feather,
  GraduationCap, BookOpenCheck, ScrollText, RefreshCw, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { booksCollections, type BookCategory, type BookVolume, type BookCollection } from '@/data/books';
import { getProxiedUrl, shouldProxy, downloadWithProxy } from '@/lib/proxy';

// ============================================
// CATEGORY CONFIG
// ============================================

const CATEGORY_INFO: Record<BookCategory, { icon: any; color: string; bgColor: string; description: string }> = {
  'التفسير': { 
    icon: BookMarked, color: 'text-emerald-700 dark:text-emerald-300', 
    bgColor: 'from-emerald-500 to-teal-600',
    description: 'كتب تفسير القرآن الكريم من أئمة أهل السنة والجماعة'
  },
  'علوم القرآن': { 
    icon: Library, color: 'text-blue-700 dark:text-blue-300', 
    bgColor: 'from-blue-500 to-indigo-600',
    description: 'مباحث وعلوم تتعلق بالقرآن الكريم'
  },
  'التجويد والقراءات': { 
    icon: Scroll, color: 'text-amber-700 dark:text-amber-300', 
    bgColor: 'from-amber-500 to-orange-600',
    description: 'أحكام التجويد والقراءات القرآنية'
  },
  'إعراب القرآن وبيانه': { 
    icon: PenLine, color: 'text-rose-700 dark:text-rose-300', 
    bgColor: 'from-rose-500 to-pink-600',
    description: 'إعراب آيات القرآن الكريم والتحليل النحوي'
  },
  'أسباب النزول': { 
    icon: MessageCircleQuestion, color: 'text-cyan-700 dark:text-cyan-300', 
    bgColor: 'from-cyan-500 to-teal-600',
    description: 'أسباب نزول آيات القرآن الكريم'
  },
  'غريب القرآن ومفرداته': { 
    icon: Languages, color: 'text-violet-700 dark:text-violet-300', 
    bgColor: 'from-violet-500 to-purple-600',
    description: 'معاني الكلمات ومفردات القرآن الكريم'
  },
  'التدبر': { 
    icon: Heart, color: 'text-purple-700 dark:text-purple-300', 
    bgColor: 'from-purple-500 to-fuchsia-600',
    description: 'تدبر آيات القرآن الكريم والتأمل فيها'
  },
  'الفقه وأصوله': {
    icon: Scale, color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'from-teal-500 to-emerald-600',
    description: 'كتب الفقه الإسلامي وأصوله'
  },
  'العقيدة': {
    icon: BookOpenCheck, color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'from-indigo-500 to-blue-600',
    description: 'كتب العقيدة الإسلامية على منهج أهل السنة والجماعة'
  },
  'السيرة النبوية': {
    icon: Feather, color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'from-orange-500 to-amber-600',
    description: 'سيرة النبي صلى الله عليه وسلم وشمائله'
  },
  'اللغة العربية': {
    icon: GraduationCap, color: 'text-sky-700 dark:text-sky-300',
    bgColor: 'from-sky-500 to-blue-600',
    description: 'كتب النحو والصرف والبلاغة'
  },
  'الحديث الشريف': {
    icon: ScrollText, color: 'text-lime-700 dark:text-lime-300',
    bgColor: 'from-lime-500 to-green-600',
    description: 'كتب السنة النبوية والأحاديث الشريفة'
  },
  'الرقائق والآداب': {
    icon: Heart, color: 'text-pink-700 dark:text-pink-300',
    bgColor: 'from-pink-500 to-rose-600',
    description: 'كتب الرقائق والآداب وتزكية النفس'
  },
};


// ============================================
// COMPONENT STATE TYPES
// ============================================

interface DownloadState { [key: string]: boolean; }
interface DownloadProgressState { [key: string]: number; } // 0-100

// ============================================
// MAIN COMPONENT
// ============================================

export function BooksLibrary() {
  const [downloadingBooks, setDownloadingBooks] = useState<DownloadState>({});
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgressState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});

  // PAGINATION: limit initial render for performance
  const INITIAL_VISIBLE_PER_CAT = 12;
  const INITIAL_VISIBLE_ALL_BOOKS = 24;
  const LOAD_MORE_STEP_BOOKS = 24;
  const [visiblePerCategoryBooks, setVisiblePerCategoryBooks] = useState<Record<string, number>>({});
  const [visibleAllBooks, setVisibleAllBooks] = useState(INITIAL_VISIBLE_ALL_BOOKS);

  // PDF Reader state
  const [pdfReaderUrl, setPdfReaderUrl] = useState<string | null>(null);
  const [pdfReaderTitle, setPdfReaderTitle] = useState<string>('');
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  // direct: يعرض الـ PDF مباشرة في iframe (أسرع على الأجهزة المكتبية)
  // google: Google Docs Viewer
  // pdfjs-proxy: Mozilla PDF.js (الأكثر توافقاً)
  // archive: عارض archive.org الأصلي
  const [viewerStrategy, setViewerStrategy] = useState<'direct' | 'google' | 'pdfjs-proxy' | 'archive'>('direct');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pdfLoadTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleAllBooks(INITIAL_VISIBLE_ALL_BOOKS);
    setVisiblePerCategoryBooks({});
  }, [searchQuery, selectedCategory]);

  const getVisibleBooksCount = useCallback((cat: string) => {
    return visiblePerCategoryBooks[cat] ?? INITIAL_VISIBLE_PER_CAT;
  }, [visiblePerCategoryBooks]);

  const showMoreBooksForCategory = useCallback((cat: string, total: number) => {
    setVisiblePerCategoryBooks(prev => ({
      ...prev,
      [cat]: Math.min(total, (prev[cat] ?? INITIAL_VISIBLE_PER_CAT) + LOAD_MORE_STEP_BOOKS),
    }));
  }, []);

  const toggleBookExpansion = useCallback((bookId: string) => {
    setExpandedBooks(prev => ({ ...prev, [bookId]: !prev[bookId] }));
  }, []);

  // Filter books
  const filteredCollections = useMemo(() => {
    let result = booksCollections;
    if (selectedCategory !== 'all') {
      result = result.filter(book => book.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book => book.name.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.description && book.description.toLowerCase().includes(query))
      );
    }
    return result;
  }, [searchQuery, selectedCategory]);

  // Group by category
  const booksByCategory = useMemo(() => {
    const categories = Object.keys(CATEGORY_INFO) as BookCategory[];
    const grouped: Record<BookCategory, BookCollection[]> = {} as any;
    categories.forEach(cat => {
      grouped[cat] = filteredCollections.filter(book => book.category === cat);
    });
    return grouped;
  }, [filteredCollections]);

  const totalBooksCount = useMemo(() => booksCollections.reduce((acc, c) => acc + c.volumes.length, 0), []);
  const categories = Object.keys(CATEGORY_INFO) as BookCategory[];
  const getCategoryCount = (cat: BookCategory) => booksCollections.filter(b => b.category === cat).length;

  // ============================================
  // PDF VIEWER - Multiple strategies with fallback
  // ============================================

  // Strategy types
  type ViewerStrategy = 'direct' | 'google' | 'pdfjs-proxy' | 'archive';

  // Strategy 1 (NEW DEFAULT): عرض مباشر عبر بروكسي Cloudflare - الأسرع
  // لأن Worker يعالج CORS + Range ويكاش النتيجة عالمياً
  const getDirectViewerUrl = (pdfUrl: string): string => {
    // #toolbar=0 لإخفاء شريط PDF الافتراضي، view=FitH لملاءمة العرض
    return shouldProxy(pdfUrl) ? getProxiedUrl(pdfUrl) + '#view=FitH' : pdfUrl + '#view=FitH';
  };

  // Strategy 2: Mozilla PDF.js viewer with Cloudflare proxy
  // Works globally including regions where archive.org is blocked
  const getPdfJsViewerUrl = (pdfUrl: string): string => {
    // Use proxied URL if archive.org (to bypass geo-blocks)
    const proxiedPdfUrl = shouldProxy(pdfUrl) ? getProxiedUrl(pdfUrl) : pdfUrl;
    // Mozilla's hosted PDF.js viewer
    return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(proxiedPdfUrl)}`;
  };

  // Strategy 3: Google Docs viewer (سريع لكن يتطلب أن يكون الرابط public)
  const getGoogleViewerUrl = (pdfUrl: string): string => {
    return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  };

  // Strategy 4: Archive.org's own viewer (if the URL is from archive.org)
  const getArchiveViewerUrl = (pdfUrl: string): string | null => {
    const match = pdfUrl.match(/archive\.org\/download\/([^/]+)\//);
    if (match) {
      const itemId = match[1];
      return `https://archive.org/details/${itemId}?view=theater`;
    }
    return null;
  };

  // Get viewer URL by strategy
  const getViewerUrl = (pdfUrl: string, strategy: ViewerStrategy): string | null => {
    switch (strategy) {
      case 'direct':
        return getDirectViewerUrl(pdfUrl);
      case 'pdfjs-proxy':
        return getPdfJsViewerUrl(pdfUrl);
      case 'google':
        return getGoogleViewerUrl(pdfUrl);
      case 'archive':
        return getArchiveViewerUrl(pdfUrl);
      default:
        return null;
    }
  };

  // Handle read with embedded PDF viewer
  const handleRead = useCallback((volume: BookVolume, bookName?: string) => {
    const title = bookName ? `${bookName} - ${volume.title}` : volume.title;
    setPdfReaderTitle(title);
    setPdfReaderUrl(volume.pdfUrl);
    // ابدأ بالعرض المباشر (الأسرع)؛ إن فشل، يستطيع المستخدم التبديل
    setViewerStrategy('direct');
    setPdfLoading(true);
    setPdfError(false);

    // Set a timeout - if PDF doesn't load in 15s, show error (تقليص من 20s)
    if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
    pdfLoadTimerRef.current = setTimeout(() => {
      setPdfLoading(false);
    }, 15000);
  }, []);

  const handlePdfLoad = useCallback(() => {
    setPdfLoading(false);
    setPdfError(false);
    if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
  }, []);

  const handlePdfError = useCallback(() => {
    setPdfLoading(false);
    setPdfError(true);
    if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
  }, []);

  const closePdfReader = useCallback(() => {
    setPdfReaderUrl(null);
    setPdfReaderTitle('');
    setPdfLoading(true);
    setPdfError(false);
    if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (pdfLoadTimerRef.current) clearTimeout(pdfLoadTimerRef.current);
    };
  }, []);

  // Handle download - uses Cloudflare Worker proxy with real progress tracking
  const handleDownload = useCallback(async (volume: BookVolume, bookName: string) => {
    if (downloadingBooks[volume.id]) return;
    setDownloadingBooks(prev => ({ ...prev, [volume.id]: true }));
    setDownloadProgress(prev => ({ ...prev, [volume.id]: 0 }));

    const fileName = `${bookName} - ${volume.title}.pdf`.replace(/[\\/:*?"<>|]/g, '_');
    const toastId = `dl-${volume.id}`;

    try {
      toast.loading('جاري تحضير التنزيل...', { id: toastId });

      // تحميل فعلي عبر Worker مع progress
      const blob = await downloadWithProxy(volume.pdfUrl, (progress) => {
        setDownloadProgress(prev => ({ ...prev, [volume.id]: progress }));
        toast.loading(`جاري التحميل: ${progress}%`, { id: toastId });
      });

      // أنشئ رابط بلوب للتحميل
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // نظّف بعد لحظات
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);

      toast.success(`تم تنزيل "${fileName}" بنجاح`, { id: toastId });
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: افتح الرابط المباشر عبر البروكسي
      try {
        const proxied = getProxiedUrl(volume.pdfUrl);
        window.open(proxied, '_blank', 'noopener,noreferrer');
        toast.error('تعذر التحميل المباشر - تم فتحه في تبويب جديد', { id: toastId });
      } catch {
        toast.error('تعذر التحميل. حاول لاحقاً.', { id: toastId });
      }
    } finally {
      setTimeout(() => {
        setDownloadingBooks(prev => {
          const n = { ...prev };
          delete n[volume.id];
          return n;
        });
        setDownloadProgress(prev => {
          const n = { ...prev };
          delete n[volume.id];
          return n;
        });
      }, 1500);
    }
  }, [downloadingBooks]);

  // ============================================
  // PDF READER OVERLAY
  // ============================================

  const renderPdfReader = () => {
    if (!pdfReaderUrl) return null;

    const viewerUrl = getViewerUrl(pdfReaderUrl, viewerStrategy) || getPdfJsViewerUrl(pdfReaderUrl);
    const archiveUrl = getArchiveViewerUrl(pdfReaderUrl);

    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={closePdfReader}
              className="gap-1.5 flex-shrink-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">إغلاق</span>
            </Button>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <BookText className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {pdfReaderTitle}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* مبدل الاستراتيجية */}
            <div className="hidden md:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => { setViewerStrategy('direct'); setPdfError(false); setPdfLoading(true); }}
                title="عرض سريع مباشر"
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  viewerStrategy === 'direct' ? 'bg-emerald-500 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                سريع
              </button>
              <button
                onClick={() => { setViewerStrategy('pdfjs-proxy'); setPdfError(false); setPdfLoading(true); }}
                title="PDF.js"
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  viewerStrategy === 'pdfjs-proxy' ? 'bg-emerald-500 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                PDF.js
              </button>
              <button
                onClick={() => { setViewerStrategy('google'); setPdfError(false); setPdfLoading(true); }}
                title="Google Docs Viewer"
                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                  viewerStrategy === 'google' ? 'bg-emerald-500 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                Google
              </button>
            </div>
            {archiveUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(archiveUrl, '_blank', 'noopener,noreferrer')}
                className="gap-1.5 text-xs hidden lg:flex"
              >
                <Library className="w-3.5 h-3.5" />
                <span>Archive.org</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(getProxiedUrl(pdfReaderUrl), '_blank', 'noopener,noreferrer')}
              className="gap-1.5 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">فتح في تبويب</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleDownload({ id: 'reader', title: pdfReaderTitle, pdfUrl: pdfReaderUrl! }, pdfReaderTitle)}
              className="gap-1.5 text-xs bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تنزيل</span>
            </Button>
          </div>
        </div>

        {/* PDF Iframe */}
        <div className="flex-1 relative bg-slate-100 dark:bg-slate-900">
          {!pdfError && (
            <iframe
              ref={iframeRef}
              key={`${pdfReaderUrl}-${viewerStrategy}`}
              src={viewerUrl}
              className="w-full h-full border-0"
              title={pdfReaderTitle}
              allow="autoplay"
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={handlePdfLoad}
              onError={handlePdfError}
            />
          )}
          
          {/* Loading overlay */}
          {pdfLoading && !pdfError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">جاري تحميل الكتاب...</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">قد يستغرق بعض الوقت حسب حجم الملف</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {pdfError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900 overflow-auto p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col items-center gap-4 max-w-md w-full my-auto">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white text-center">
                  تعذر تحميل المعاينة
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  جرب قارئاً آخر أو افتح الكتاب في تبويب جديد
                </p>

                {/* Try different viewer */}
                <div className="w-full space-y-2">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">جرب قارئاً آخر:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button
                      variant={viewerStrategy === 'direct' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => { setViewerStrategy('direct'); setPdfError(false); setPdfLoading(true); }}
                      className="gap-1.5 text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      سريع
                    </Button>
                    <Button
                      variant={viewerStrategy === 'pdfjs-proxy' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => { setViewerStrategy('pdfjs-proxy'); setPdfError(false); setPdfLoading(true); }}
                      className="gap-1.5 text-xs"
                    >
                      <BookText className="w-3.5 h-3.5" />
                      PDF.js
                    </Button>
                    <Button
                      variant={viewerStrategy === 'google' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => { setViewerStrategy('google'); setPdfError(false); setPdfLoading(true); }}
                      className="gap-1.5 text-xs"
                    >
                      <Library className="w-3.5 h-3.5" />
                      Google
                    </Button>
                    {archiveUrl && (
                      <Button
                        variant={viewerStrategy === 'archive' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setViewerStrategy('archive'); setPdfError(false); setPdfLoading(true); }}
                        className="gap-1.5 text-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Archive
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    onClick={() => window.open(getProxiedUrl(pdfReaderUrl!), '_blank', 'noopener,noreferrer')}
                    className="flex-1 gap-2 bg-blue-500 hover:bg-blue-600"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح مباشرة
                  </Button>
                  <Button
                    onClick={() => handleDownload({ id: 'err', title: pdfReaderTitle, pdfUrl: pdfReaderUrl! }, pdfReaderTitle)}
                    variant="outline"
                    className="flex-1 gap-2"
                    size="sm"
                  >
                    <Download className="w-4 h-4" />
                    تنزيل
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================
  // VOLUME CARD
  // ============================================

  const renderVolumeCard = (volume: BookVolume, bookName: string) => {
    const isDownloading = downloadingBooks[volume.id];
    const progress = downloadProgress[volume.id] ?? 0;

    return (
      <div key={volume.id} className="relative flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-sm transition-all group overflow-hidden">
        {/* Progress bar background when downloading */}
        {isDownloading && (
          <div
            className="absolute inset-y-0 right-0 bg-blue-500/10 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        )}
        <div className="relative w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">
          {volume.volumeNumber || <FileText className="w-4 h-4" />}
        </div>
        <span className="relative flex-1 text-sm text-slate-700 dark:text-slate-300 truncate font-medium">
          {volume.title}
          {isDownloading && (
            <span className="mr-2 text-[10px] text-blue-600 dark:text-blue-400 font-normal">
              {progress}%
            </span>
          )}
        </span>
        <div className="relative flex items-center gap-1.5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleRead(volume, bookName)}
            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            title="قراءة"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </button>
          <button
            onClick={() => window.open(getProxiedUrl(volume.pdfUrl), '_blank', 'noopener,noreferrer')}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="فتح في تبويب جديد"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
          <button
            onClick={() => handleDownload(volume, bookName)}
            disabled={isDownloading}
            className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
            title="تنزيل"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    );
  };

  // ============================================
  // BOOK CARD
  // ============================================

  const renderBookCard = (collection: BookCollection) => {
    const isExpanded = expandedBooks[collection.id];
    const catInfo = CATEGORY_INFO[collection.category];
    const IconComponent = catInfo.icon;
    
    return (
      <Card key={collection.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="p-0">
          {/* Book Header */}
          <div 
            className={`p-4 ${!collection.isSingleVolume && collection.volumes.length > 1 ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80' : ''}`}
            onClick={() => !collection.isSingleVolume && collection.volumes.length > 1 && toggleBookExpansion(collection.id)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                <IconComponent className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight mb-1">
                  {collection.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {collection.author}
                </p>
                {collection.description && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {!collection.isSingleVolume && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0">
                      {collection.volumes.length} مجلد
                    </Badge>
                  )}
                </div>
              </div>

              {!collection.isSingleVolume && collection.volumes.length > 1 && (
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              )}
            </div>

            {/* Single volume actions */}
            {collection.isSingleVolume && (
              <div className="flex items-center gap-2 mt-3">
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleRead(collection.volumes[0], collection.name); }} 
                  variant="outline" 
                  className="flex-1 h-9 rounded-xl text-xs gap-1.5 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300"
                >
                  <Eye className="w-3.5 h-3.5" />
                  قراءة
                </Button>
                <Button 
                  onClick={(e) => { e.stopPropagation(); window.open(getProxiedUrl(collection.volumes[0].pdfUrl), '_blank', 'noopener,noreferrer'); }} 
                  variant="outline" 
                  className="h-9 rounded-xl text-xs px-3"
                  title="فتح في تبويب جديد"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleDownload(collection.volumes[0], collection.name); }} 
                  disabled={downloadingBooks[collection.volumes[0].id]}
                  className="flex-1 h-9 rounded-xl text-xs bg-blue-500 hover:bg-blue-600 text-white gap-1.5 relative overflow-hidden"
                >
                  {/* Progress fill */}
                  {downloadingBooks[collection.volumes[0].id] && (
                    <div
                      className="absolute inset-y-0 right-0 bg-blue-400/60 transition-all duration-200"
                      style={{ width: `${downloadProgress[collection.volumes[0].id] ?? 0}%` }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    {downloadingBooks[collection.volumes[0].id] ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {downloadProgress[collection.volumes[0].id] ?? 0}%
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        تنزيل PDF
                      </>
                    )}
                  </span>
                </Button>
              </div>
            )}
          </div>

          {/* Volumes List */}
          {!collection.isSingleVolume && isExpanded && (
            <div className="border-t border-slate-100 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {collection.volumes.map(volume => renderVolumeCard(volume, collection.name))}
              </div>
            </div>
          )}

          {/* Expand hint */}
          {!collection.isSingleVolume && !isExpanded && collection.volumes.length > 1 && (
            <div 
              className="border-t border-slate-100 dark:border-slate-700 py-2 px-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              onClick={() => toggleBookExpansion(collection.id)}
            >
              <span className="text-xs text-blue-500 dark:text-blue-400 flex items-center justify-center gap-1">
                <ChevronDown className="w-3 h-3" />
                عرض {collection.volumes.length} مجلد
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <>
      {/* PDF Reader Overlay */}
      {renderPdfReader()}

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-bl from-purple-500 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">المكتبة الإسلامية الشاملة</h2>
              <p className="text-purple-100 text-sm">كتب PDF إسلامية شاملة</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{booksCollections.length} كتاب</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{totalBooksCount} مجلد</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{categories.length} تصنيف</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="ابحث بالعنوان أو المؤلف أو الموضوع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-12 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className={`rounded-full px-4 py-1.5 h-auto text-sm ${
              selectedCategory === 'all' 
                ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            الكل ({booksCollections.length})
          </Button>
          {categories.map(cat => {
            const count = getCategoryCount(cat);
            if (count === 0) return null;
            return (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`rounded-full px-4 py-1.5 h-auto text-sm ${
                  selectedCategory === cat 
                    ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {cat} ({count})
              </Button>
            );
          })}
        </div>

        {/* Results Count */}
        {(searchQuery || selectedCategory !== 'all') && (
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            عرض {filteredCollections.length} كتاب
          </p>
        )}

        {/* Books by Category */}
        {selectedCategory === 'all' && !searchQuery ? (
          categories.map(category => {
            const categoryBooks = booksByCategory[category];
            if (!categoryBooks || categoryBooks.length === 0) return null;
            const catInfo = CATEGORY_INFO[category];
            const CatIcon = catInfo.icon;
            const visibleCount = getVisibleBooksCount(category);
            const visibleBooks = categoryBooks.slice(0, visibleCount);
            const hasMore = categoryBooks.length > visibleCount;

            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catInfo.bgColor} flex items-center justify-center text-white`}>
                    <CatIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{category}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{catInfo.description}</p>
                  </div>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <Badge variant="outline" className="text-xs">{categoryBooks.length} كتاب</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visibleBooks.map(book => renderBookCard(book))}
                </div>
                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showMoreBooksForCategory(category, categoryBooks.length)}
                      className="gap-2"
                    >
                      <ChevronDown className="w-4 h-4" />
                      عرض المزيد ({categoryBooks.length - visibleCount} متبقية)
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCollections.slice(0, visibleAllBooks).map(book => renderBookCard(book))}
            </div>
            {filteredCollections.length > visibleAllBooks && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVisibleAllBooks(v => v + LOAD_MORE_STEP_BOOKS)}
                  className="gap-2"
                >
                  <ChevronDown className="w-4 h-4" />
                  عرض المزيد ({filteredCollections.length - visibleAllBooks} متبقية)
                </Button>
              </div>
            )}
          </>
        )}

        {/* No results */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">لم يتم العثور على كتب مطابقة</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">جرب كلمات بحث مختلفة</p>
          </div>
        )}
      </div>
    </>
  );
}
