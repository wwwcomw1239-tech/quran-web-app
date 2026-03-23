'use client';

import { useAudioPlayer } from '@/lib/AudioPlayerContext';
import { AudioPlayerBar } from '@/components/quran/AudioPlayerBar';
import { useLanguage } from '@/lib/i18n';

export function GlobalAudioPlayer() {
  const {
    currentSurah,
    isPlaying,
    isLoading,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat,
    selectedReciter,
    reciterName,
    isCached,
    isCaching,
    cacheProgress,
    quality,
    playbackRate,
    cacheSupported,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    toggleMute,
    changeVolume,
    toggleRepeat,
    playRandom,
    closePlayer,
    toggleCache,
    seekForward,
    seekBackward,
    setPlaybackRate,
    saveCurrentBookmark,
  } = useAudioPlayer();

  const { isRTL } = useLanguage();

  if (!currentSurah) return null;

  return (
    <AudioPlayerBar
      currentSurah={currentSurah}
      isPlaying={isPlaying}
      isLoading={isLoading}
      progress={progress}
      currentTime={currentTime}
      duration={duration}
      volume={volume}
      isMuted={isMuted}
      isRepeat={isRepeat}
      reciterId={selectedReciter}
      reciterName={reciterName}
      isCached={isCached}
      isCaching={isCaching}
      cacheProgress={cacheProgress}
      quality={quality}
      onTogglePlay={togglePlay}
      onPrevious={isRTL ? playNext : playPrevious}
      onNext={isRTL ? playPrevious : playNext}
      onSeek={seekTo}
      onToggleMute={toggleMute}
      onVolumeChange={changeVolume}
      onToggleRepeat={toggleRepeat}
      onRandom={playRandom}
      onClose={closePlayer}
      onToggleCache={cacheSupported ? toggleCache : undefined}
      onSeekForward={seekForward}
      onSeekBackward={seekBackward}
      onPlaybackRateChange={setPlaybackRate}
      playbackRate={playbackRate}
    />
  );
}
