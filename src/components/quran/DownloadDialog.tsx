'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Surah } from '@/data/surahs';
import { useLanguage } from '@/lib/i18n';

interface DownloadDialogProps {
  open: boolean;
  surah: Surah | null;
  reciterName: string;
  fileSize: number | null;
  isLoadingFileSize: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  onClose: () => void;
  onDownload: () => void;
}

export function DownloadDialog({
  open,
  surah,
  reciterName,
  fileSize,
  isLoadingFileSize,
  isDownloading,
  downloadProgress,
  onClose,
  onDownload,
}: DownloadDialogProps) {
  const { t, isRTL } = useLanguage();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get display name based on language
  const displayName = isRTL ? surah?.nameArabic : surah?.nameEnglish;
  const displaySubName = isRTL ? surah?.nameEnglish : surah?.nameArabic;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{t('downloadSurah')}</DialogTitle>
        </DialogHeader>

        {surah && (
          <div className="space-y-4">
            {/* Surah Info */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {displayName}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {displaySubName}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                {reciterName}
              </p>
            </div>

            {/* Quality Info */}
            <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isRTL ? 'الجودة' : 'Quality'}
                </span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                  {t('originalQuality')}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('fileSize')}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {isLoadingFileSize ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : fileSize ? (
                    formatFileSize(fileSize)
                  ) : (
                    isRTL ? 'غير معروف' : 'Unknown'
                  )}
                </span>
              </div>
            </div>

            {/* Download Button with Progress Fill */}
            <Button
              onClick={onDownload}
              disabled={isDownloading || isLoadingFileSize}
              className={`w-full h-14 rounded-xl relative overflow-hidden transition-all duration-300 ${
                isDownloading 
                  ? 'bg-emerald-600 cursor-wait' 
                  : 'bg-emerald-500 hover:bg-emerald-600'
              } text-white ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {/* Dynamic Progress Fill Background */}
              {isDownloading && (
                <div 
                  className="absolute inset-0 bg-emerald-400 transition-all duration-200 ease-out"
                  style={{ 
                    width: `${downloadProgress}%`,
                    [isRTL ? 'right' : 'left']: 0
                  }}
                />
              )}
              
              {/* Button Content */}
              <div className="relative z-10 flex items-center justify-center w-full gap-2">
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                    <span className="font-semibold text-lg">
                      {t('downloadingProgress')} {downloadProgress}%
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold">{t('download')}</span>
                  </>
                )}
              </div>
            </Button>

            {/* Note */}
            <p className="text-xs text-center text-slate-400 dark:text-slate-500">
              {isRTL
                ? 'ملاحظة: Mp3Quran يوفر جودة واحدة لكل قارئ (عادة 128kbps)'
                : 'Note: Mp3Quran provides one quality per reciter (usually 128kbps)'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
