import { useState, useEffect } from 'react';
import { soundEffects } from '../lib/sound';

export function useSound() {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('poetry_journal_muted') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    soundEffects.setMuted(isMuted);
    try {
      localStorage.setItem('poetry_journal_muted', String(isMuted));
    } catch {
      // Ignore
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const playTurn = () => {
    soundEffects.playPageTurn();
  };

  const playOpen = () => {
    soundEffects.playBookOpen();
  };

  return {
    isMuted,
    toggleMute,
    playTurn,
    playOpen
  };
}
