import React from 'react';
import { motion } from 'framer-motion';
import { BotanicalCorner, OrnamentalDivider, VintageRoseEmblem } from '../Decorative/BotanicalCorners';
import { JESSICA_CONTENT } from '../../config/jessicaContent';
import { ChevronDown, Heart } from 'lucide-react';

interface WelcomeSectionProps {
  onBeginStory: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onBeginStory }) => {
  const { welcome } = JESSICA_CONTENT;

  return (
    <section
      id="welcome"
      className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-16 sm:py-24"
    >
      {/* Decorative frame enclosure */}
      <div className="relative max-w-2xl w-full mx-auto paper-texture rounded-3xl p-8 sm:p-14 shadow-book border border-[#DE9EB0]/50 text-center flex flex-col items-center">
        {/* Four Botanical Corner Embellishments */}
        <BotanicalCorner
          position="top-left"
          size={52}
          color="#B77973"
          className="absolute top-3 left-3 opacity-75"
        />
        <BotanicalCorner
          position="top-right"
          size={52}
          color="#B77973"
          className="absolute top-3 right-3 opacity-75"
        />
        <BotanicalCorner
          position="bottom-left"
          size={52}
          color="#B77973"
          className="absolute bottom-3 left-3 opacity-75"
        />
        <BotanicalCorner
          position="bottom-right"
          size={52}
          color="#B77973"
          className="absolute bottom-3 right-3 opacity-75"
        />

        {/* Vintage Rose Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-4"
        >
          <VintageRoseEmblem size={72} color="#C98598" />
        </motion.div>

        {/* Delicate Sub-label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center space-x-2 text-[11px] font-sans uppercase tracking-[0.3em] text-[#8E4D60] mb-2"
        >
          <span className="w-6 h-px bg-[#DE9EB0]" />
          <span>{welcome.subheading}</span>
          <span className="w-6 h-px bg-[#DE9EB0]" />
        </motion.div>

        {/* Main Heading: "For Uto." */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-poem text-5xl sm:text-6xl md:text-7xl font-normal text-[#4D2531] tracking-tight leading-none mb-3"
        >
          {welcome.heading}
        </motion.h1>

        {/* Center Ornamental Divider */}
        <OrnamentalDivider className="my-3" color="#C98598" />

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="font-poem italic text-xl sm:text-2xl text-[#654F57] max-w-lg leading-relaxed mt-2"
        >
          &ldquo;{welcome.supportingText}&rdquo;
        </motion.p>

        {/* Call to Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 sm:mt-10"
        >
          <button
            onClick={onBeginStory}
            className="group relative inline-flex items-center space-x-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#8E4D60] to-[#743F4D] text-[#FFF9F2] font-poem text-lg sm:text-xl tracking-wide shadow-md hover:shadow-lg hover:from-[#743F4D] hover:to-[#4D2531] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Heart className="w-4 h-4 text-[#F3CCD7] group-hover:scale-110 transition-transform" />
            <span>{welcome.buttonText}</span>
            <ChevronDown className="w-4 h-4 text-[#F3CCD7] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Gentle Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-8 text-[#AF99A2] text-xs font-sans tracking-widest uppercase flex flex-col items-center space-y-1 opacity-70"
      >
        <span>Scroll to explore</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </motion.div>
    </section>
  );
};

