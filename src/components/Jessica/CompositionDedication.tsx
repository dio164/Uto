import React from 'react';
import { motion } from 'framer-motion';
import { JESSICA_CONTENT } from '../../config/jessicaContent';
import { OrnamentalDivider, VintageRoseEmblem, BotanicalCorner } from '../Decorative/BotanicalCorners';
import { Sparkles } from 'lucide-react';

export const CompositionDedication: React.FC = () => {
  const { composition } = JESSICA_CONTENT;

  return (
    <section id="composition" className="relative py-20 sm:py-28 px-4 max-w-3xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#8E4D60] font-semibold">
          Chapter IV
        </span>
        <h2 className="font-poem text-4xl sm:text-5xl text-[#4D2531] mt-2 mb-3">
          {composition.sectionLabel}
        </h2>
        <OrnamentalDivider className="mt-4" color="#DE9EB0" />
      </div>

      {/* Dedication Card: Minimal, Intimate & Literary */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="relative paper-texture rounded-3xl p-8 sm:p-14 shadow-book border border-[#DE9EB0]/60 text-center flex flex-col items-center"
      >
        {/* Botanical Flourishes */}
        <BotanicalCorner
          position="top-left"
          size={48}
          color="#B77973"
          className="absolute top-3 left-3 opacity-70"
        />
        <BotanicalCorner
          position="top-right"
          size={48}
          color="#B77973"
          className="absolute top-3 right-3 opacity-70"
        />
        <BotanicalCorner
          position="bottom-left"
          size={48}
          color="#B77973"
          className="absolute bottom-3 left-3 opacity-70"
        />
        <BotanicalCorner
          position="bottom-right"
          size={48}
          color="#B77973"
          className="absolute bottom-3 right-3 opacity-70"
        />

        {/* Vintage Rose Motif */}
        <div className="mb-4">
          <VintageRoseEmblem size={64} color="#DE9EB0" />
        </div>

        {/* Composition Title */}
        <h3 className="font-poem text-4xl sm:text-5xl md:text-6xl text-[#4D2531] tracking-tight mb-2">
          &ldquo;{composition.title}&rdquo;
        </h3>

        {/* Dedication Line */}
        <p className="font-poem italic text-base sm:text-lg text-[#B77973] font-medium tracking-wide mb-1">
          ~ {composition.dedication} ~
        </p>

        {/* Date stamp */}
        <p className="font-poem italic text-xs sm:text-sm text-[#8B737C] tracking-widest uppercase mb-4">
          {composition.date}
        </p>

        <OrnamentalDivider className="my-4" color="#DE9EB0" />

        {/* Composition Description */}
        <p className="font-poem text-lg sm:text-xl text-[#392B30] max-w-lg leading-relaxed mt-2">
          {composition.description}
        </p>

        {/* Performance Notice (Explicitly noting live guitar performance) */}
        <div className="mt-8 pt-6 border-t border-[#DE9EB0]/40 flex items-center space-x-2 text-xs font-sans text-[#8E4D60] tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#B77973]" />
          <span className="italic font-poem text-sm text-[#743F4D]">
            {composition.performanceNote}
          </span>
        </div>
      </motion.div>
    </section>
  );
};

