import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Book, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

interface PageControlsProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onCloseBook: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMobile?: boolean;
}

export const PageControls: React.FC<PageControlsProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onCloseBook,
  isMuted,
  onToggleMute,
  isMobile = false,
}) => {
  const canPrev = currentPage > 0;
  const canNext = isMobile 
    ? currentPage < totalPages - 1 
    : currentPage < totalPages - 2;

  // Formatted physical page number indicator
  const pageLabel = isMobile
    ? `p. ${currentPage + 1} of ${totalPages}`
    : `p. ${currentPage + 1}–${Math.min(currentPage + 2, totalPages)} of ${totalPages}`;

  return (
    <div className="relative z-30 mt-5 sm:mt-7 flex flex-col items-center select-none">
      {/* Main Navigation Bar */}
      <nav 
        className="flex items-center space-x-3 sm:space-x-5 bg-[#FAF0F3]/95 backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-full border border-[#DE9EB0]/40 shadow-page"
        aria-label="Book Navigation Controls"
      >
        {/* Return to Cover */}
        <button
          onClick={onCloseBook}
          title="Close book and return to cover"
          className="flex items-center space-x-1.5 text-[#8E4D60] hover:text-[#4D2531] p-1.5 rounded-full hover:bg-[#F3CCD7]/40 transition-colors cursor-pointer"
          aria-label="Return to cover"
        >
          <Book className="w-4 h-4" />
          <span className="hidden sm:inline font-poem italic text-sm">Cover</span>
        </button>

        <div className="h-4 w-[1px] bg-[#DE9EB0]/50" />

        {/* Previous Page Button */}
        <button
          onClick={onPrev}
          disabled={!canPrev}
          title="Previous page (Left Arrow)"
          className={`p-1.5 rounded-full transition-all ${
            canPrev 
              ? 'text-[#743F4D] hover:text-[#4D2531] hover:bg-[#F3CCD7]/50 active:scale-95 cursor-pointer' 
              : 'text-[#DE9EB0]/40 cursor-not-allowed opacity-40'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Counter Indicator */}
        <div className="font-poem text-sm sm:text-base text-[#743F4D] px-2 font-medium tracking-wide">
          {pageLabel}
        </div>

        {/* Next Page Button */}
        <button
          onClick={onNext}
          disabled={!canNext}
          title="Next page (Right Arrow)"
          className={`p-1.5 rounded-full transition-all ${
            canNext 
              ? 'text-[#743F4D] hover:text-[#4D2531] hover:bg-[#F3CCD7]/50 active:scale-95 cursor-pointer' 
              : 'text-[#DE9EB0]/40 cursor-not-allowed opacity-40'
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="h-4 w-[1px] bg-[#DE9EB0]/50" />

        {/* Sound Toggle Button */}
        <button
          onClick={onToggleMute}
          title={isMuted ? "Enable page turn rustle sound" : "Mute page turn sound"}
          className="text-[#8E4D60] hover:text-[#4D2531] p-1.5 rounded-full hover:bg-[#F3CCD7]/40 transition-colors cursor-pointer"
          aria-label={isMuted ? "Unmute page turn sound" : "Mute page turn sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 opacity-70" /> : <Volume2 className="w-4 h-4 text-[#B77973]" />}
        </button>
      </nav>

      {/* Subtle Keyboard hint */}
      <span className="text-[10px] font-sans tracking-widest text-[#C98598]/75 uppercase mt-2 hidden sm:inline">
        Use &larr; and &rarr; arrow keys or click corners to flip
      </span>
    </div>
  );
};
