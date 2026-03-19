'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Download, Loader2, BookOpen, FileText } from 'lucide-react';

// Book categories
type BookCategory = 'التفسير' | 'علوم القرآن' | 'التدبر';

// Book interface - single direct PDF URL for both read and download
interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  // Direct PDF URL - opens raw PDF in browser
  pdfUrl: string;
  description?: string;
}

// Books data with VERIFIED DIRECT PDF URLs
// All URLs tested and confirmed working (HTTP 302 redirect = file exists)
// Format: https://archive.org/download/[item_id]/[exact_filename].pdf
const booksData: Book[] = [
  // Category 1: التفسير
  {
    id: 'tafsir-muyassar',
    title: 'التفسير الميسر',
    author: 'نخبة من العلماء',
    category: 'التفسير',
    pdfUrl: 'https://archive.org/download/attafseer_almoyassar/ar_tafseer_meesr_b.pdf',
    description: 'تفسير ميسر للقرآن الكريم بأسلوب عصري واضح - مجمع الملك فهد'
  },
  {
    id: 'tafseer-saadi',
    title: 'تفسير السعدي',
    author: 'الشيخ عبد الرحمن بن ناصر السعدي',
    category: 'التفسير',
    pdfUrl: 'https://archive.org/download/ozkorallh_20181023_2048/100585.pdf',
    description: 'تيسير الكريم الرحمن في تفسير كلام المنان - تفسير جامع سهل اللفظ'
  },
  {
    id: 'tafseer-ibn-kathir',
    title: 'تفسير ابن كثير',
    author: 'الإمام الحافظ ابن كثير',
    category: 'التفسير',
    pdfUrl: 'https://archive.org/download/FP59518/tkather01.pdf',
    description: 'تفسير القرآن العظيم - أشهر التفاسير بالمأثور (المجلد الأول)'
  },
  
  // Category 2: علوم القرآن
  {
    id: 'mabaheth-quran',
    title: 'مباحث في علوم القرآن',
    author: 'مناع القطان',
    category: 'علوم القرآن',
    pdfUrl: 'https://archive.org/download/WAQmbolqumbolqu/mbolqu.pdf',
    description: 'دراسة شاملة لعلوم القرآن وأصوله - مكتبة المعارف'
  },
  {
    id: 'al-itqan',
    title: 'الإتقان في علوم القرآن',
    author: 'الإمام جلال الدين السيوطي',
    category: 'علوم القرآن',
    pdfUrl: 'https://archive.org/download/sa71mir_gmail_20160606/%D8%A7%D9%84%D8%A5%D8%AA%D9%82%D8%A7%D9%86%20%D9%81%D9%8A%20%D8%B9%D9%84%D9%88%D9%85%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D9%84%D9%84%D8%AD%D8%A7%D9%81%D8%B8%20%D8%AC%D9%84%D8%A7%D9%84%20%D8%A7%D9%84%D8%AF%D9%8A%D9%86%20%D8%A7%D9%84%D8%B3%D9%8A%D9%88%D8%B7%D9%8A.pdf',
    description: 'موسوعة شاملة في علوم القرآن الكريم - تحقيق محمد أبو الفضل إبراهيم'
  },
  
  // Category 3: التدبر
  {
    id: 'almokhtasar',
    title: 'المختصر في تفسير القرآن الكريم',
    author: 'مركز تفسير للدراسات القرآنية',
    category: 'التدبر',
    pdfUrl: 'https://archive.org/download/tafsirMukhtasar/TafsirMukhtasar.pdf',
    description: 'تفسير مختصر يُعنى بالمعنى الإجمالي للآيات'
  },
];

// Category badge colors
const categoryColors: Record<BookCategory, string> = {
  'التفسير': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  'علوم القرآن': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'التدبر': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
};

// Downloading state interface
interface DownloadState {
  [key: string]: boolean;
}

export function BooksLibrary() {
  const [downloadingBooks, setDownloadingBooks] = useState<DownloadState>({});

  // Handle PDF download with in-page execution and CORS fallback
  const handleDownload = async (book: Book) => {
    // Prevent multiple downloads
    if (downloadingBooks[book.id]) return;

    setDownloadingBooks(prev => ({ ...prev, [book.id]: true }));

    try {
      // Attempt to fetch PDF as blob for native download
      const response = await fetch(book.pdfUrl, {
        mode: 'cors',
        cache: 'no-cache',
      });

      // Check if fetch was successful
      if (!response.ok) {
        throw new Error('فشل في تحميل الملف');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Create a hidden anchor element to trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${book.title} - ${book.author}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error (CORS or network):', error);
      
      // FALLBACK: Open the direct PDF URL in a new tab
      // User can then use browser's download button (Ctrl+S or menu)
      window.open(book.pdfUrl, '_blank', 'noopener,noreferrer');
    } finally {
      // Always reset loading state whether success or fallback
      setDownloadingBooks(prev => ({ ...prev, [book.id]: false }));
    }
  };

  // Handle read - opens direct PDF URL in new tab
  // Modern browsers will render the PDF natively
  const handleRead = (book: Book) => {
    window.open(book.pdfUrl, '_blank', 'noopener,noreferrer');
  };

  // Group books by category
  const categories: BookCategory[] = ['التفسير', 'علوم القرآن', 'التدبر'];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-l from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-xl font-bold">مكتبة التفسير وعلوم القرآن</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          مجموعة مختارة من أهم الكتب في التفسير وعلوم القرآن والتدبر، متاحة للقراءة والتحميل مجاناً
        </p>
      </div>

      {/* Books by Category */}
      {categories.map(category => {
        const categoryBooks = booksData.filter(book => book.category === category);
        
        return (
          <div key={category} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <Badge className={`${categoryColors[category]} px-4 py-1.5 text-sm font-medium`}>
                {category}
              </Badge>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {categoryBooks.length} كتاب
              </span>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryBooks.map(book => {
                const isDownloading = downloadingBooks[book.id];

                return (
                  <Card
                    key={book.id}
                    className="group overflow-hidden transition-all duration-300 hover:shadow-xl bg-white dark:bg-slate-800"
                  >
                    <CardContent className="p-5">
                      {/* Book Icon & Title */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                          <FileText className="w-7 h-7 text-slate-500 dark:text-slate-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">
                            {book.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {book.author}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {book.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                          {book.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Read Button - Opens direct PDF in new tab */}
                        <Button
                          onClick={() => handleRead(book)}
                          variant="outline"
                          className="flex-1 h-10 rounded-xl border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <ExternalLink className="w-4 h-4 ml-2" />
                          قراءة
                        </Button>

                        {/* Download Button - Attempts blob download, falls back to direct URL */}
                        <Button
                          onClick={() => handleDownload(book)}
                          disabled={isDownloading}
                          className="flex-1 h-10 rounded-xl bg-gradient-to-l from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                              جاري التنزيل...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 ml-2" />
                              تنزيل
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Footer Note */}
      <div className="text-center py-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          جميع الكتب متاحة للقراءة والتحميل المجاني
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          اضغط "قراءة" لعرض الكتاب في المتصفح أو "تنزيل" للتحميل المباشر
        </p>
      </div>
    </div>
  );
}
