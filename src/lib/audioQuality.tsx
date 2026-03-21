'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Audio quality types
export type AudioQuality = 'high' | 'low';

// Quality labels for UI
export const qualityLabels = {
  high: {
    ar: 'جودة عالية',
    en: 'High Quality',
  },
  low: {
    ar: 'توفير البيانات',
    en: 'Data Saver',
  },
};

// Context type
interface AudioQualityContextType {
  quality: AudioQuality;
  setQuality: (quality: AudioQuality) => void;
  toggleQuality: () => void;
  qualityLabel: string;
}

// Create context with default values
const AudioQualityContext = createContext<AudioQualityContextType | undefined>(undefined);

// Local storage key
const STORAGE_KEY = 'quran-audio-quality';

// Provider component
export function AudioQualityProvider({ children }: { children: ReactNode }) {
  const [quality, setQualityState] = useState<AudioQuality>('high');
  const [mounted, setMounted] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'high' || saved === 'low') {
      setQualityState(saved);
    }
  }, []);

  // Set quality and save to localStorage
  const setQuality = (newQuality: AudioQuality) => {
    setQualityState(newQuality);
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, newQuality);
    }
  };

  // Toggle between high and low
  const toggleQuality = () => {
    setQuality(quality === 'high' ? 'low' : 'high');
  };

  // Get localized label (default to Arabic)
  const qualityLabel = qualityLabels[quality].ar;

  return (
    <AudioQualityContext.Provider value={{ quality, setQuality, toggleQuality, qualityLabel }}>
      {children}
    </AudioQualityContext.Provider>
  );
}

// Custom hook to use the context
export function useAudioQuality() {
  const context = useContext(AudioQualityContext);
  if (context === undefined) {
    throw new Error('useAudioQuality must be used within an AudioQualityProvider');
  }
  return context;
}
