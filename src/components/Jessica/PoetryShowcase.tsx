import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Poem } from '../../types/poem';
import { JESSICA_CONTENT } from '../../config/jessicaContent';
import { OrnamentalDivider, BotanicalCorner } from '../Decorative/BotanicalCorners';
import { Feather, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface PoetryShowcaseProps {
  poems: Poem[];
}

export const PoetryShowcase: React.FC<PoetryShowcaseProps> = ({ poems }) => {
  const { poetry } = JESSICA_CONTENT;
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter poems according to configured featured titles.
  // If featuredPoemTitles is empty, ALL poems in the collection are shown.
  // Otherwise only poems whose title (or id) matches an entry in the list are shown.
  const featuredPoems: Poem[] = useMemo(() => {
    if (!poems || poems.length === 0) return [];

    // Empty list = show everything
    if (!poetry.featuredPoemTitles || poetry.featuredPoemTitles.length === 0) {
      return poems;
    }

    const matches = poems.filter((poem) =>
      poetry.featuredPoemTitles.some(
        (target) =>
          poem.title.toLowerCase().trim() === target.toLowerCase().trim() ||
          poem.id === target
      )
    );

    // If none of the featured titles matched (e.g. placeholder titles), show all poems
    if (matches.length === 0) return poems;
    return matches;
  }, [poems, poetry.featuredPoemTitles]);

  const currentPoem = featuredPoems[selectedIndex] || featuredPoems[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % featuredPoems.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + featuredPoems.length) % featuredPoems.length);
  };

  return (
    <section id="poetry" className="relative py-20 sm:py-28 px-4 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#8E4D60] font-semibold">
          Chapter III
        </span>
        <h2 className="font-poem text-4xl sm:text-5xl text-[#4D2531] mt-2 mb-3">
          {poetry.sectionTitle}
        </h2>
        <p className="font-poem italic text-lg sm:text-xl text-[#743F4D]/90 max-w-md mx-auto">
          {poetry.sectionSubtitle}
        </p>
        <OrnamentalDivider className="mt-4" color="#DE9EB0" />

        <p className="font-poem text-base sm:text-lg text-[#654F57] max-w-xl mx-auto mt-4 leading-relaxed">
          {poetry.introText}
        </p>
      </div>

      {featuredPoems.length === 0 ? (
        <div className="paper-texture rounded-2xl p-10 text-center border border-[#DE9EB0]/40 max-w-md mx-auto">
          <Feather className="w-8 h-8 text-[#DE9EB0] mx-auto mb-3 animate-pulse" />
          <p className="font-poem italic text-xl text-[#743F4D]">Opening the poetry archives...</p>
        </div>
      ) : (
        <div>
          {/* Poem Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {featuredPoems.map((poem, index) => {
              const isActive = index === selectedIndex;
              return (
                <button
                  key={poem.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`px-4 py-2 rounded-full font-poem text-base sm:text-lg transition-all duration-300 border ${
                    isActive
                      ? 'bg-[#8E4D60] text-[#FFF9F2] border-[#8E4D60] shadow-md -translate-y-0.5'
                      : 'paper-texture text-[#743F4D] border-[#DE9EB0]/60 hover:border-[#C98598] hover:bg-[#FAF0F3]'
                  }`}
                >
                  <span>{poem.title}</span>
                </button>
              );
            })}
          </div>

          {/* Reading Card Frame */}
          <div className="relative paper-texture rounded-3xl p-8 sm:p-14 shadow-book-lg border border-[#DE9EB0]/60 max-w-2xl mx-auto">
            {/* Corner flourishes */}
            <BotanicalCorner
              position="top-left"
              size={44}
              color="#DE9EB0"
              className="absolute top-3 left-3 opacity-60"
            />
            <BotanicalCorner
              position="top-right"
              size={44}
              color="#DE9EB0"
              className="absolute top-3 right-3 opacity-60"
            />
            <BotanicalCorner
              position="bottom-left"
              size={44}
              color="#DE9EB0"
              className="absolute bottom-3 left-3 opacity-60"
            />
            <BotanicalCorner
              position="bottom-right"
              size={44}
              color="#DE9EB0"
              className="absolute bottom-3 right-3 opacity-60"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPoem.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="flex flex-col items-center text-center"
              >
                {/* Poem Header */}
                <h3 className="font-poem text-3xl sm:text-4xl md:text-5xl font-medium text-[#4D2531] tracking-tight leading-tight mb-2">
                  {currentPoem.title}
                </h3>

                {currentPoem.subtitle && (
                  <p className="font-poem italic text-sm sm:text-base text-[#8B737C] tracking-wide mb-1">
                    {currentPoem.subtitle}
                  </p>
                )}

                {currentPoem.dedication && (
                  <p className="font-poem italic text-xs sm:text-sm text-[#B77973] font-medium tracking-wide mb-2">
                    ~ {currentPoem.dedication} ~
                  </p>
                )}

                <OrnamentalDivider className="my-4" color="#C98598" />

                {/* Poem Stanzas Body */}
                <div className="my-6 max-w-md mx-auto">
                  <p className="font-poem text-lg sm:text-xl leading-[2.1] text-[#392B30] tracking-wide whitespace-pre-wrap selection:bg-[#F3CCD7] selection:text-[#743F4D]">
                    {currentPoem.body}
                  </p>
                </div>

                {/* Poem Date / Archive Note */}
                {currentPoem.poem_date && (
                  <div className="mt-4 pt-4 border-t border-[#DE9EB0]/30 w-full flex items-center justify-between text-xs font-poem text-[#8B737C]">
                    <span className="italic flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#B77973]" />
                      <span>Uto Omega Collection</span>
                    </span>
                    <span className="italic tracking-widest">{currentPoem.poem_date}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls across featured poems */}
            {featuredPoems.length > 1 && (
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#DE9EB0]/40">
                <button
                  onClick={handlePrev}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans text-[#743F4D] hover:text-[#4D2531] hover:bg-[#FAF0F3] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Poem</span>
                </button>

                <div className="text-xs font-sans text-[#8B737C]">
                  {selectedIndex + 1} of {featuredPoems.length}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans text-[#743F4D] hover:text-[#4D2531] hover:bg-[#FAF0F3] transition-colors"
                >
                  <span>Next Poem</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

