import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, BookOpen, Heart } from 'lucide-react';
import { UNIVERSE_CONFIG } from '../../config/universe';

interface HeroPlanetProps {
  onExploreClick: () => void;
  onNavigateToBook: () => void;
  onNavigateToJessica: () => void;
}

export const HeroPlanet: React.FC<HeroPlanetProps> = ({
  onExploreClick,
  onNavigateToBook,
  onNavigateToJessica,
}) => {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 max-w-4xl mx-auto">
      {/* 1. Floating Celestial Island / Planet Illustration */}
      <motion.div
        className="relative w-48 h-48 sm:w-64 sm:h-64 mb-8 flex items-center justify-center"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 1.5, 0, -1.5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Soft Multi-Layer Pink Aura Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F472B6]/40 via-[#FBCFE8]/30 to-[#DDD6FE]/30 blur-2xl animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-[#EC4899]/20 blur-xl" />

        {/* Golden Orbital Ring */}
        <div 
          className="absolute inset-[-14px] sm:inset-[-20px] rounded-full border-2 border-dashed border-[#F6E05E]/40"
          style={{
            transform: 'rotateX(72deg) rotateZ(-24deg)',
          }}
        />
        <div 
          className="absolute inset-[-24px] sm:inset-[-32px] rounded-full border border-[#FBCFE8]/40"
          style={{
            transform: 'rotateX(68deg) rotateZ(-20deg)',
          }}
        />

        {/* Central Planet Sphere (Pink Princess Marble) */}
        <div 
          className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl border border-[#FBCFE8]/60"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #FDF2F8 0%, #FBCFE8 35%, #F472B6 70%, #9D174D 100%)',
            boxShadow: '0 0 50px rgba(244, 114, 182, 0.45), inset -10px -10px 30px rgba(77, 37, 49, 0.6), inset 10px 10px 25px rgba(255, 255, 255, 0.8)',
          }}
        >
          {/* Surface Atmosphere & Continents */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div 
            className="absolute top-6 left-6 w-16 h-8 rounded-full bg-white/30 blur-xs"
            style={{ transform: 'rotate(-15deg)' }}
          />
          <div 
            className="absolute bottom-8 right-6 w-20 h-10 rounded-full bg-[#FCE7F3]/40 blur-xs"
            style={{ transform: 'rotate(25deg)' }}
          />

          {/* Whimsical Fairytale Spire Silhouette */}
          <div className="absolute inset-x-0 bottom-0 h-24 flex items-end justify-center opacity-70">
            <svg viewBox="0 0 100 60" className="w-full h-full fill-[#4D2531]/60">
              <polygon points="50,5 44,35 56,35" />
              <polygon points="32,15 28,45 36,45" />
              <polygon points="68,18 64,45 72,45" />
              <rect x="25" y="42" width="50" height="20" rx="3" />
              <circle cx="50" cy="5" r="2.5" fill="#F6E05E" />
            </svg>
          </div>
        </div>

        {/* Orbiting Little Stars & Fairy Dust */}
        <motion.div
          className="absolute -top-2 right-4 text-[#FDE047]"
          animate={{ scale: [1, 1.4, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-6 h-6 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
        </motion.div>
        <motion.div
          className="absolute bottom-2 -left-2 text-[#F472B6]"
          animate={{ scale: [1.2, 0.9, 1.2], rotate: [0, -45, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Sparkles className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
        </motion.div>
      </motion.div>

      {/* 2. Welcome Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#FBCFE8]/40 mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#F6E05E]" />
          <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#FDF2F8] font-medium">
            {UNIVERSE_CONFIG.tagline}
          </span>
        </div>

        <h1 className="font-poem text-5xl sm:text-7xl font-normal text-[#FFF9F2] tracking-tight leading-none drop-shadow-md mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE047] via-[#FBCFE8] to-[#F472B6] font-medium">Planet Uto</span>
        </h1>

        <p className="font-poem italic text-xl sm:text-2xl text-[#FBCFE8] max-w-2xl mx-auto leading-relaxed drop-shadow-xs mb-3">
          "{UNIVERSE_CONFIG.welcomeIntro}"
        </p>

        <p className="font-sans text-xs sm:text-sm text-[#E9D5FF]/85 max-w-lg mx-auto tracking-wide mb-8 font-light">
          {UNIVERSE_CONFIG.heroSubtext}
        </p>
      </motion.div>

      {/* 3. Action Buttons / Quick Portals */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <button
          onClick={onExploreClick}
          className="group relative px-6 py-3 rounded-full bg-gradient-to-r from-[#F472B6] via-[#EC4899] to-[#DB2777] text-white font-sans text-sm tracking-wider font-medium shadow-lg hover:shadow-[0_0_25px_rgba(244,114,182,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
        >
          <Compass className="w-4 h-4 text-[#FDE047] group-hover:rotate-45 transition-transform duration-300" />
          <span>Explore The Universe</span>
        </button>

        <button
          onClick={onNavigateToBook}
          className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-[#FBCFE8]/50 text-[#FFF9F2] font-sans text-sm tracking-wider transition-all duration-300 flex items-center space-x-2 shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-[#FDE047]" />
          <span>The Poetry Journal</span>
        </button>

        <button
          onClick={onNavigateToJessica}
          className="px-5 py-3 rounded-full bg-[#FAF0F3]/15 hover:bg-[#FAF0F3]/25 backdrop-blur-md border border-[#F472B6]/40 text-[#FBCFE8] hover:text-white font-sans text-sm tracking-wider transition-all duration-300 flex items-center space-x-2 shadow-sm"
        >
          <Heart className="w-4 h-4 text-[#F472B6] fill-[#F472B6]/40" />
          <span>Dedicated to Uto</span>
        </button>
      </motion.div>
    </section>
  );
};

