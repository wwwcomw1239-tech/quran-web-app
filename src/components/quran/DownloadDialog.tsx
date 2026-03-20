'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

            {/* Download Progress */}
            {isDownloading && (
              <div className="space-y-2">
                <Progress value={downloadProgress} className="h-2" />
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  {t('downloading')} {downloadProgress}%
                </p>
              </div>
            )}

            {/* Download Button */}
            <Button
              onClick={onDownload}
              disabled={isDownloading || isLoadingFileSize}
              className={`w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'} animate-spin`} />
                  {t('downloading')}
                </>
              ) : (
                <>
                  <Download className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  {t('download')}
                </>
              )}
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
