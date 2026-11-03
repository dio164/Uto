import React from 'react';
import { motion } from 'framer-motion';
import { JESSICA_CONTENT } from '../../config/jessicaContent';
import { OrnamentalDivider, VintageRoseEmblem } from '../Decorative/BotanicalCorners';
import { Heart, BookOpen } from 'lucide-react';

interface NextChapterProps {
  onNavigateToHome: () => void;
}

export const NextChapter: React.FC<NextChapterProps> = ({ onNavigateToHome }) => {
  const { closing } = JESSICA_CONTENT;

  return (
    <section id="next-chapter" className="relative py-24 sm:py-32 px-4 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="paper-texture rounded-3xl p-8 sm:p-14 shadow-book-lg border border-[#DE9EB0]/60 flex flex-col items-center"
      >
        {/* Emblem flourish */}
        <div className="mb-4">
          <VintageRoseEmblem size={72} color="#C98598" />
        </div>

        {/* Section Heading: "To be continued..." */}
        <h2 className="font-poem text-4xl sm:text-5xl md:text-6xl text-[#4D2531] tracking-tight mb-4">
          {closing.heading}
        </h2>

        <OrnamentalDivider className="my-3" color="#DE9EB0" />

        {/* Supporting message */}
        <p className="font-poem italic text-xl sm:text-2xl text-[#654F57] max-w-xl leading-relaxed mt-3">
          &ldquo;{closing.message}&rdquo;
        </p>

        {/* Wax seal inspired date stamp */}
        <div className="mt-8 pt-6 border-t border-[#DE9EB0]/40 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#8E4D60] border-2 border-[#EAD49E] flex items-center justify-center text-[#FFF9F2] shadow-sm mb-2">
            <Heart className="w-5 h-5 text-[#F3CCD7] fill-[#F3CCD7]" />
          </div>
          <p className="font-sans text-xs tracking-widest uppercase text-[#8E4D60] font-medium">
            {closing.subtext}
          </p>
        </div>

        {/* Tasteful Return to Uto Omega Link */}
        <div className="mt-8">
          <button
            onClick={onNavigateToHome}
            className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-[#8E4D60] hover:text-[#4D2531] transition-colors py-2 px-4 rounded-full hover:bg-[#FAF0F3] border border-transparent hover:border-[#DE9EB0]/40"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B77973]" />
            <span>Return to Tales from Planet Uto</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};

