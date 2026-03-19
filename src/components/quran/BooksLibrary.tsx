'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Download, Loader2, BookOpen, FileText } from 'lucide-react';

// Book categories
type BookCategory = 'التفسير' | 'علوم القرآن' | 'التدبر';

// Book interface
interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  pdfUrl: string;
  description?: string;
}

// Books data with verified Archive.org PDF links
const booksData: Book[] = [
  // Category 1: التفسير
  {
    id: 'tafsir-muyassar',
    title: 'التفسير الميسر',
    author: 'نخبة من العلماء',
    category: 'التفسير',
    pdfUrl: 'https://archive.org/download/AlTafsirAlMuyassar/AlTafsirAlMuyassar.pdf',
    description: 'تفسير ميسر للقرآن الكريم بأسلوب عصري واضح'
  },
  {
    id: 'tafseer-saadi',
    title: 'تفسير السعدي',
    author: 'الشيخ عبد الرحمن بن ناصر السعدي',
    category: 'التفسير',
    pdfUrl: 'https://archive.org/download/Tafseer_Sadi/Tafseer_Sadi.pdf',
    description: 'تفسير جامع سهل اللفظ وواضح المعنى'
  },
  {
    id: 'tafseer-ibn-kathir',
    title: 'تفسير ابن كثير',
    author: 'الإمام الحافظ ابن كثير',
    category: 'التفسير',
    pdfUrl: 'https://archive.org/download/TafseerIbnKathir/TafseerIbnKathir.pdf',
    description: 'أشهر التفاسير بالمأثور وأكثرها انتشاراً'
  },
  
  // Category 2: علوم القرآن
  {
    id: 'mabaheth-quran',
    title: 'مباحث في علوم القرآن',
    author: 'مناع القطان',
    category: 'علوم القرآن',
    pdfUrl: 'https://archive.org/download/MabahethFiOloomAlQuran/MabahethFiOloomAlQuran.pdf',
    description: 'دراسة شاملة لعلوم القرآن وأصوله'
  },
  {
    id: 'al-itqan',
    title: 'الإتقان في علوم القرآن',
    author: 'الإمام جلال الدين السيوطي',
    category: 'علوم القرآن',
    pdfUrl: 'https://archive.org/download/AlItqanFiOloomAlQuran_201608/AlItqanFiOloomAlQuran.pdf',
    description: 'موسوعة شاملة في علوم القرآن الكريم'
  },
  
  // Category 3: التدبر
  {
    id: 'almokhtasar',
    title: 'المختصر في تفسير القرآن الكريم',
    author: 'مركز تفسير للدراسات القرآنية',
    category: 'التدبر',
    pdfUrl: 'https://archive.org/download/AlMokhtasarFiTafseerAlQuran/AlMokhtasarFiTafseerAlQuran.pdf',
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

  // Handle PDF download with in-page execution
  const handleDownload = async (book: Book) => {
    // Prevent multiple downloads
    if (downloadingBooks[book.id]) return;

    setDownloadingBooks(prev => ({ ...prev, [book.id]: true }));

    try {
      // Fetch the PDF as a blob
      const response = await fetch(book.pdfUrl, {
        mode: 'cors',
        cache: 'no-cache',
      });

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
      console.error('Download error:', error);
      // Fallback: open in new tab if download fails
      window.open(book.pdfUrl, '_blank');
    } finally {
      setDownloadingBooks(prev => ({ ...prev, [book.id]: false }));
    }
  };

  // Handle read in new tab
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
                        {/* Read Button */}
                        <Button
                          onClick={() => handleRead(book)}
                          variant="outline"
                          className="flex-1 h-10 rounded-xl border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <ExternalLink className="w-4 h-4 ml-2" />
                          قراءة
                        </Button>

                        {/* Download Button */}
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
          جميع الكتب متاحة للتحميل المجاني من مصادر موثوقة
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          المصدر: Archive.org - المكتبة الرقمية العالمية
        </p>
      </div>
    </div>
  );
}
