'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

export type SoundType = 
  | 'jump'
  | 'coin'
  | 'obstacle'
  | 'complete'
  | 'quiz'
  | 'start'
  | 'button'
  | 'answerCorrect'
  | 'answerWrong';

// Map sound types to audio files
const soundFiles: Record<SoundType, string> = {
  jump: '/sounds/mixkit-player-jumping-in-a-video-game-2043.wav',
  coin: '/sounds/mixkit-winning-a-coin-video-game-2069.wav',
  obstacle: '/sounds/mixkit-player-losing-or-failing-2042.wav',
  complete: '/sounds/mixkit-game-level-completed-2059.wav',
  quiz: '/sounds/mixkit-casino-bling-achievement-2067.wav',
  start: '/sounds/mixkit-game-bonus-reached-2065.wav',
  button: '/sounds/mixkit-casino-bling-achievement-2067.wav',
  answerCorrect: '/sounds/mixkit-game-experience-level-increased-2062.wav',
  answerWrong: '/sounds/mixkit-player-losing-or-failing-2042.wav'
};

export function useGameSounds() {
  const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  // Initialize from localStorage - only music state is saved
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('musicEnabled');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });
  // Sound effects are always enabled
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    // Preload all sound effects
    Object.entries(soundFiles).forEach(([type, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      // Higher volume for sound effects so they're clearly heard over background music
      audio.volume = 0.7;
      audioCache.current.set(type as SoundType, audio);
    });

    return () => {
      // Cleanup: pause and remove all audio
      audioCache.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioCache.current.clear();
      
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.src = '';
      }
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    // Sound effects always play - no check needed
    try {
      const audio = audioCache.current.get(type);
      if (audio) {
        // Clone the audio to allow multiple simultaneous plays
        const soundClone = audio.cloneNode() as HTMLAudioElement;
        soundClone.volume = 0.7;
        soundClone.play().catch(err => {
          console.warn(`Error playing ${type} sound:`, err);
        });
      }
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }, []);  // No dependencies - always plays

  const startBackgroundMusic = useCallback(() => {
    if (!isMusicEnabled || bgMusicRef.current) return;

    try {
      // Use dedicated background music that plays throughout the game
      const bgMusic = new Audio('/sounds/mixkit-game-level-music-689.wav');
      bgMusic.loop = true;
      bgMusic.volume = 0.12; // Faint background volume so other sounds are clearly heard
      bgMusic.play().catch(err => {
        console.warn('Error playing background music:', err);
      });
      bgMusicRef.current = bgMusic;
    } catch (error) {
      console.warn('Error starting background music:', error);
    }
  }, [isMusicEnabled]);

  const stopBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current = null;
    }
  }, []);

  const toggleMusic = useCallback(() => {
    setIsMusicEnabled((prev: boolean) => {
      const newValue = !prev;
      if (!newValue && bgMusicRef.current) {
        bgMusicRef.current.pause();
      } else if (newValue && bgMusicRef.current) {
        bgMusicRef.current.play().catch(err => console.warn('Error resuming music:', err));
      }
      return newValue;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev: boolean) => !prev);
  }, []);

  const toggleAllAudio = useCallback(() => {
    const newValue = !isMusicEnabled;
    
    console.log('Toggling MUSIC ONLY from', isMusicEnabled, 'to', newValue);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('musicEnabled', JSON.stringify(newValue));
    }
    
    // Only toggle music, NOT sound effects
    setIsMusicEnabled(newValue);
    // Sound effects always stay enabled
    
    // Handle background music
    if (!newValue && bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.volume = 0;
    } else if (newValue && bgMusicRef.current) {
      bgMusicRef.current.volume = 0.12;
      bgMusicRef.current.play().catch(err => console.warn('Error resuming music:', err));
    } else if (newValue && !bgMusicRef.current) {
      // Start music if it wasn't started yet
      startBackgroundMusic();
    }
  }, [isMusicEnabled, startBackgroundMusic]);

  // UI state now only reflects music state
  const isAudioEnabled = isMusicEnabled;

  return { 
    playSound, 
    startBackgroundMusic, 
    stopBackgroundMusic,
    toggleMusic,
    toggleSound,
    toggleAllAudio,
    isMusicEnabled,
    isSoundEnabled,
    isAudioEnabled
  };
}
