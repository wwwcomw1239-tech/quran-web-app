// Light-weight barrel - only include always-loaded components.
// Heavy components (BooksLibrary / QuranVideos / QuranShorts / KidsVideos) are
// loaded lazily via `next/dynamic` directly where needed. Keeping them out of
// this barrel prevents their data bundles from being pulled into the initial
// chunk when anything imports from '@/components/quran'.
export { Header } from './Header';
export { ReciterSelector } from './ReciterSelector';
export { SearchFilter } from './SearchFilter';
export { SurahList } from './SurahList';
export { AudioPlayerBar } from './AudioPlayerBar';
export { DownloadDialog } from './DownloadDialog';
export { Footer } from './Footer';
export { AnnouncementBanner } from './AnnouncementBanner';
export { FloatingScrollButtons } from './FloatingScrollButtons';
export type { Announcement } from './AnnouncementBanner';
