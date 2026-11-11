import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Poem } from '../types/poem';
import { BookCover } from '../components/Book/BookCover';
import { Book } from '../components/Book/Book';
import { FloatingPetals } from '../components/Decorative/FloatingPetals';
import { AmbientDust } from '../components/Decorative/AmbientDust';
import { BOOK_CONFIG } from '../config/book';
import { Feather, RefreshCw, Key, Flower2, ArrowLeft } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { MusicWidget } from '../components/Audio/MusicWidget';

interface BookReaderPageProps {
  poems: Poem[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToJessica: () => void;
  onReturnToUniverse: () => void;
}

export const BookReaderPage: React.FC<BookReaderPageProps> = ({
  poems,
  loading,
  error,
  onRefetch,
  onNavigateToAdmin,
  onNavigateToJessica,
  onReturnToUniverse,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBook, setHasOpenedBook] = useState(false);
  const { playOpen, isMuted } = useSound();
  const ytPlayer = useYouTubePlayer("PLfyuOOAYg9T0");

  useEffect(() => {
    ytPlayer.setMuted(isMuted);
  }, [isMuted, ytPlayer]);

  const handleOpenBook = () => {
    playOpen();
    setIsOpen(true);
    setHasOpenedBook(true);
    if (!ytPlayer.isPlaying) {
      ytPlayer.play();
    }
  };

  const handleCloseBook = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#F8E4EA]">
      {/* Background Decorative Atmosphere */}
      <FloatingPetals />
      <AmbientDust />

      {/* Top Bar with Back to Planet Uto */}
      <header className="relative z-30 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onReturnToUniverse}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full paper-texture border border-[#DE9EB0]/60 text-xs font-sans text-[#743F4D] hover:text-[#4D2531] shadow-xs hover:shadow transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Planet Uto</span>
        </button>

        <span className="font-poem italic text-sm text-[#8B737C]">
          The Original Poetry Journal
        </span>
      </header>

      {/* Interactive Music Widget */}
      <MusicWidget
        isVisible={hasOpenedBook}
        isPlaying={ytPlayer.isPlaying}
        isLooping={ytPlayer.isLooping}
        currentTitle={ytPlayer.currentTitle}
        onTogglePlay={ytPlayer.togglePlay}
        onNextTrack={ytPlayer.nextTrack}
        onPrevTrack={ytPlayer.prevTrack}
        onToggleLoop={ytPlayer.toggleLoop}
        mountNode={ytPlayer.mountNode}
      />

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        <AnimatePresence mode="wait">
          {/* 1. Loading State */}
          {loading ? (
            <motion.div
              key="loading-state"
              className="flex flex-col items-center justify-center text-center p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-32 h-44 rounded-r-lg rounded-l-sm book-cover-texture shadow-book border border-[#DE9EB0]/40 flex items-center justify-center animate-pulse-faint">
                <Feather className="w-8 h-8 text-[#E2C27F] opacity-80" />
                <div className="absolute inset-2 border border-[#E2C27F]/40 rounded" />
              </div>
              <p className="font-poem italic text-2xl text-[#743F4D] mt-6 tracking-wide">
                gathering words...
              </p>
              <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C98598] mt-1">
                preparing the journal
              </p>
            </motion.div>
          ) : error ? (
            /* 2. Error State */
            <motion.div
              key="error-state"
              className="flex flex-col items-center justify-center text-center max-w-md paper-texture p-8 rounded-2xl border border-[#DE9EB0]/50 shadow-book"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-blackletter text-3xl text-[#743F4D]">A Blurred Memory</h2>
              <p className="font-poem italic text-lg text-[#392B30] mt-3 leading-relaxed">
                {error}
              </p>
              <p className="font-sans text-xs text-[#8B737C] mt-2">
                The offline collection will be presented while we reconnect.
              </p>
              <button
                onClick={onRefetch}
                className="mt-6 px-5 py-2 rounded-lg bg-[#FAF0F3] border border-[#DE9EB0] text-[#743F4D] hover:bg-[#F3CCD7]/50 font-poem text-base flex items-center space-x-2 transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </motion.div>
          ) : !isOpen ? (
            /* 3. Closed Book Landing State */
            <motion.div
              key="closed-book-state"
              className="w-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <BookCover onOpen={handleOpenBook} />
            </motion.div>
          ) : (
            /* 4. Interactive Book Reader */
            <motion.div
              key="open-book-state"
              className="w-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Book poems={poems} onCloseBook={handleCloseBook} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Discreet Footer with Uto Experience & Curator Access */}
      <footer className="relative z-20 py-4 px-6 flex items-center justify-between text-xs font-poem text-[#8B737C]">
        <button
          onClick={onNavigateToJessica}
          title="For Uto"
          className="group flex items-center space-x-1.5 text-[#AF99A2] hover:text-[#743F4D] transition-colors p-1"
          aria-label="For Uto"
        >
          <div className="w-5 h-5 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 flex items-center justify-center group-hover:border-[#C98598] transition-colors shadow-xs">
            <Flower2 className="w-2.5 h-2.5 text-[#C98598] group-hover:text-[#743F4D]" />
          </div>
          <span className="text-[10px] font-sans uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            uto
          </span>
        </button>

        <span className="italic tracking-widest text-[#B77973] text-center">
          &copy; {BOOK_CONFIG.year} {BOOK_CONFIG.title}
        </span>

        <button
          onClick={onNavigateToAdmin}
          title="Curator's desk (/admin)"
          className="group flex items-center space-x-1.5 text-[#AF99A2] hover:text-[#743F4D] transition-colors p-1"
          aria-label="Open Curator Desk"
        >
          <span className="text-[10px] font-sans uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            curator
          </span>
          <div className="w-5 h-5 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 flex items-center justify-center group-hover:border-[#C98598] transition-colors shadow-xs">
            <Key className="w-2.5 h-2.5 text-[#C98598] group-hover:text-[#743F4D]" />
          </div>
        </button>
      </footer>
    </div>
  );
};
