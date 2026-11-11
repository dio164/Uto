import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { ROTATING_MESSAGES } from '../../config/universe';
import { UniverseMessage } from '../../types/universe';

interface DailyMessageCardProps {
  customMessage?: UniverseMessage;
}

export const DailyMessageCard: React.FC<DailyMessageCardProps> = ({ customMessage }) => {
  const [index, setIndex] = useState(0);
  const activeMessages = customMessage ? [customMessage, ...ROTATING_MESSAGES] : ROTATING_MESSAGES;
  const current = activeMessages[index % activeMessages.length];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % activeMessages.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + activeMessages.length) % activeMessages.length);
  };

  return (
    <section className="relative z-10 py-8 px-4 max-w-2xl mx-auto">
      <motion.div
        className="relative paper-texture rounded-3xl p-7 sm:p-9 border border-[#DE9EB0]/80 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Soft Background Rosy Shimmer */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#FBCFE8]/30 blur-2xl pointer-events-none" />

        {/* Header Tag */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/50 text-xs font-sans text-[#743F4D]">
            <Heart className="w-3 h-3 text-[#B77973] fill-[#B77973]/30" />
            <span className="font-medium tracking-wider uppercase text-[10px]">
              {current.isSpecialOccasion ? 'Special Dedication' : 'Whisper from the Sky'}
            </span>
          </div>

          {current.dateContext && (
            <span className="text-[11px] font-sans italic text-[#8B737C]">
              {current.dateContext}
            </span>
          )}
        </div>

        {/* Message Content with AnimatePresence */}
        <div className="relative min-h-[90px] flex items-center justify-center my-2">
          <Quote className="absolute -top-2 left-0 w-8 h-8 text-[#DE9EB0]/30 -scale-x-100 pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.p
              key={current.id + index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="font-poem text-xl sm:text-2xl text-[#392B30] text-center leading-relaxed px-4 selection:bg-[#F3CCD7]"
            >
              "{current.text}"
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Author & Controls */}
        <div className="mt-5 pt-3 border-t border-[#DE9EB0]/30 flex items-center justify-between text-xs font-sans text-[#8B737C]">
          <div className="flex items-center space-x-1.5 font-poem italic text-base text-[#743F4D]">
            <Sparkles className="w-3.5 h-3.5 text-[#E2C27F]" />
            <span>— {current.author}</span>
          </div>

          {activeMessages.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-full hover:bg-[#FAF0F3] text-[#743F4D] transition-colors"
                aria-label="Previous note"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-[#B77973]">
                {index + 1}/{activeMessages.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-full hover:bg-[#FAF0F3] text-[#743F4D] transition-colors"
                aria-label="Next note"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

