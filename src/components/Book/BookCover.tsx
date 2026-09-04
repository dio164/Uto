import React from 'react';
import { motion } from 'framer-motion';
import { BOOK_CONFIG } from '../../config/book';
import { BotanicalCorner, VintageRoseEmblem } from '../Decorative/BotanicalCorners';
import { Sparkles, BookOpen } from 'lucide-react';

interface BookCoverProps {
  onOpen: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({ onOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 select-none">
      {/* 3D Book Container */}
      <motion.div
        className="relative group cursor-pointer perspective-1000"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{
          y: -8,
          rotateX: 2,
          rotateY: -3,
          transition: { duration: 0.4, ease: 'easeOut' }
        }}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        aria-label={`Open book: ${BOOK_CONFIG.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        {/* Ambient shadow beneath the book */}
        <div 
          className="absolute -bottom-8 left-6 right-6 h-12 bg-[#4D2531]/25 rounded-full blur-2xl transform scale-y-50 group-hover:scale-105 group-hover:bg-[#4D2531]/35 transition-all duration-500"
          aria-hidden="true"
        />

        {/* Satin Ribbon Bookmark hanging out at the bottom */}
        <div 
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-7 h-16 pointer-events-none z-10 transition-transform duration-300 group-hover:translate-y-1"
          aria-hidden="true"
        >
          {/* Ribbon cloth */}
          <div className="w-full h-full bg-gradient-to-b from-[#8E4D60] via-[#C98598] to-[#B06B7E] shadow-md relative">
            {/* Ribbon V-notch cutout */}
            <div 
              className="absolute -bottom-1 left-0 right-0 h-4 bg-[#F8E4EA]"
              style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}
            />
            {/* Satin sheen highlight */}
            <div className="absolute inset-y-0 left-1/4 w-1/3 bg-white/20" />
          </div>
        </div>

        {/* Closed Hardcover Physical Body */}
        <div className="relative w-[320px] sm:w-[380px] md:w-[420px] h-[480px] sm:h-[540px] md:h-[580px] rounded-r-2xl rounded-l-md book-cover-texture p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-book-lg border-r border-t border-b border-[#DE9EB0]/30 transition-all duration-300">
          
          {/* Spine 3D indentation illusion on the left */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 via-black/10 to-transparent rounded-l-md pointer-events-none" />
          <div className="absolute left-7 top-0 bottom-0 w-[1.5px] bg-[#2A131A]/30 pointer-events-none" />
          <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none" />

          {/* Book edge paper pages illusion on right */}
          <div className="absolute -right-2 top-3 bottom-3 w-2 bg-gradient-to-r from-[#FFF9F2] to-[#FAF3E8] rounded-r-sm border-y border-r border-[#E2D0BE] shadow-sm pointer-events-none flex flex-col justify-evenly py-2 opacity-90">
            <div className="h-[1px] bg-[#E2D0BE]/60 w-full" />
            <div className="h-[1px] bg-[#E2D0BE]/60 w-full" />
            <div className="h-[1px] bg-[#E2D0BE]/60 w-full" />
            <div className="h-[1px] bg-[#E2D0BE]/60 w-full" />
          </div>

          {/* Embossed Ornate Gold & Rose Gold Border */}
          <div className="absolute inset-4 sm:inset-5 border border-[#C5A059]/50 rounded-xl pointer-events-none">
            <div className="absolute inset-1.5 border border-[#B77973]/40 rounded-lg" />
            {/* Subtle inner dotted border */}
            <div className="absolute inset-3 border border-dashed border-[#DE9EB0]/30 rounded-md" />
            
            {/* Victorian Corner Flourishes */}
            <BotanicalCorner position="top-left" size={40} color="#E2C27F" className="absolute top-1 left-1 opacity-80" />
            <BotanicalCorner position="top-right" size={40} color="#E2C27F" className="absolute top-1 right-1 opacity-80" />
            <BotanicalCorner position="bottom-left" size={40} color="#E2C27F" className="absolute bottom-1 left-1 opacity-80" />
            <BotanicalCorner position="bottom-right" size={40} color="#E2C27F" className="absolute bottom-1 right-1 opacity-80" />
          </div>

          {/* Top Header Flourish */}
          <div className="relative z-10 pt-4 flex flex-col items-center">
            <span className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#EAD49E] font-medium font-sans opacity-85">
              Poetry &bull; Journal
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#E2C27F]/70 to-transparent mt-2" />
          </div>

          {/* Central Book Title & Emblem */}
          <div className="relative z-10 my-auto flex flex-col items-center px-4">
            <VintageRoseEmblem size={74} color="#E2C27F" className="mb-4 drop-shadow" />
            
            {/* Main Title in Old English / Blackletter */}
            <h1 className="font-blackletter text-4xl sm:text-5xl md:text-6xl text-[#FFF9F2] tracking-wide gold-foil-text leading-tight drop-shadow-md">
              {BOOK_CONFIG.title}
            </h1>

            {/* Subtitle in Cormorant */}
            {BOOK_CONFIG.subtitle && (
              <p className="font-poem italic text-lg sm:text-xl text-[#F8E4EA]/90 mt-3 font-light tracking-wide">
                {BOOK_CONFIG.subtitle}
              </p>
            )}

            {/* Decorative divider */}
            <div className="flex items-center justify-center space-x-2 mt-5 text-[#E2C27F]/70">
              <span className="h-[1px] w-8 bg-[#E2C27F]/50" />
              <Sparkles className="w-3.5 h-3.5 text-[#EAD49E]" />
              <span className="h-[1px] w-8 bg-[#E2C27F]/50" />
            </div>
          </div>

          {/* Bottom Author & Year */}
          <div className="relative z-10 pb-2">
            <p className="font-poem italic text-base sm:text-lg text-[#FAF3E8]/85 tracking-widest">
              {BOOK_CONFIG.author}
            </p>
            <p className="text-[10px] tracking-[0.25em] text-[#DE9EB0]/80 font-sans mt-1">
              {BOOK_CONFIG.year}
            </p>
          </div>

          {/* Foil corner brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#E2C27F]/80 rounded-tl" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#E2C27F]/80 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#E2C27F]/80 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#E2C27F]/80 rounded-br" />
        </div>
      </motion.div>

      {/* Elegant Invitation instruction */}
      <motion.div
        className="mt-10 flex flex-col items-center text-center cursor-pointer group"
        onClick={onOpen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <div className="flex items-center space-x-2 text-[#8E4D60] group-hover:text-[#743F4D] transition-colors duration-300">
          <BookOpen className="w-4 h-4 animate-pulse-faint text-[#B77973]" />
          <span className="font-poem italic text-xl sm:text-2xl tracking-wide text-[#743F4D]">
            {BOOK_CONFIG.landingInstruction}
          </span>
        </div>
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#C98598] mt-1 group-hover:text-[#8E4D60] transition-colors">
          Click or press Enter to turn the pages
        </span>
      </motion.div>
    </div>
  );
};
