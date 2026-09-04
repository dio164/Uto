import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Repeat } from 'lucide-react';

interface MusicWidgetProps {
  isVisible: boolean;
  isPlaying: boolean;
  isLooping: boolean;
  currentTitle: string;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onToggleLoop: () => void;
  mountNode: (node: HTMLDivElement | null) => void;
}

export const MusicWidget: React.FC<MusicWidgetProps> = ({
  isVisible,
  isPlaying,
  isLooping,
  currentTitle,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onToggleLoop,
  mountNode,
}) => {
  return (
    <>
      {/* Invisible mount point for the YouTube Iframe */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <div ref={mountNode} />
      </div>

      {/* Floating Widget UI */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40"
          >
            <div className="flex items-center space-x-3 bg-[#FAF0F3]/90 backdrop-blur-md border border-[#DE9EB0]/40 rounded-full px-4 py-2 shadow-page">
              
              {/* Play/Pause Button */}
              <button 
                onClick={onTogglePlay}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#DE9EB0]/20 text-[#743F4D] hover:bg-[#DE9EB0]/40 hover:text-[#4D2531] transition-colors"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-[1px]" />}
              </button>

              {/* Previous Track Button */}
              <button 
                onClick={onPrevTrack}
                className="p-1.5 text-[#8B737C] hover:text-[#743F4D] transition-colors"
                aria-label="Previous track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Title & Info */}
              <div className="flex flex-col justify-center max-w-[120px] sm:max-w-[180px]">
                <span className="font-poem text-[11px] sm:text-xs text-[#8E4D60] uppercase tracking-widest leading-none mb-0.5 opacity-80">
                  Now Playing
                </span>
                <span className="font-sans text-xs sm:text-sm text-[#4D2531] truncate font-medium">
                  {currentTitle}
                </span>
              </div>

              {/* Next Track Button */}
              <button 
                onClick={onNextTrack}
                className="p-1.5 text-[#8B737C] hover:text-[#743F4D] transition-colors"
                aria-label="Next track"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Loop Button */}
              <button 
                onClick={onToggleLoop}
                className={`p-1.5 transition-colors ${isLooping ? 'text-[#743F4D]' : 'text-[#8B737C]/50 hover:text-[#8B737C]'}`}
                aria-label={isLooping ? "Disable loop" : "Enable loop"}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
