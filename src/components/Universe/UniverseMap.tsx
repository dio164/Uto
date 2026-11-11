import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Headphones,
  Flower2,
  Film,
  HeartHandshake,
  Compass,
  BookOpen,
  ArrowRight,
  Star,
  CheckCircle2,
  X,
} from 'lucide-react';
import { UNIVERSE_DESTINATIONS } from '../../config/universe';
import { Destination } from '../../types/universe';

interface UniverseMapProps {
  onSelectDestination: (path: string) => void;
}

export const UniverseMap: React.FC<UniverseMapProps> = ({ onSelectDestination }) => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const getDestinationIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Mail':
        return <Mail className={className} />;
      case 'Headphones':
        return <Headphones className={className} />;
      case 'Flower2':
        return <Flower2 className={className} />;
      case 'Film':
        return <Film className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <section id="universe-map" className="relative z-10 py-16 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#FBCFE8]/30 mb-3">
          <Star className="w-3.5 h-3.5 text-[#FDE047]" />
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#FBCFE8] font-semibold">
            Interactive Universe Map
          </span>
        </div>
        <h2 className="font-poem text-4xl sm:text-6xl text-[#FFF9F2] font-normal tracking-tight">
          Destinations in Planet Uto
        </h2>
        <p className="font-poem italic text-lg sm:text-xl text-[#FBCFE8]/90 max-w-xl mx-auto mt-2">
          Click any floating island to step into its world.
        </p>
      </div>

      {/* Destinations Grid (Illustrated Floating Island Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {UNIVERSE_DESTINATIONS.map((dest, idx) => {
          return (
            <motion.div
              key={dest.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => onSelectDestination(dest.path)}
            >
              {/* Outer Radiant Glow on Hover */}
              <div
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
                style={{
                  background: `radial-gradient(circle, ${dest.islandStyle.glowColor} 0%, transparent 70%)`,
                }}
              />

              {/* Island Card Surface */}
              <div
                className="relative h-full flex flex-col justify-between p-6 rounded-3xl border backdrop-blur-md transition-all duration-300 shadow-xl overflow-hidden"
                style={{
                  backgroundColor: 'rgba(255, 249, 242, 0.92)',
                  borderColor: dest.accentColor,
                  boxShadow: `0 15px 35px -10px rgba(42, 19, 26, 0.4), 0 0 20px ${dest.islandStyle.borderGlow}`,
                }}
              >
                {/* Whimsical Fairytale Shimmer / Stardust Header */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/60 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  {/* Top Row: Icon Badge & Destination Type Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: dest.themeColor,
                        color: '#FFFFFF',
                      }}
                    >
                      {getDestinationIcon(dest.iconName, 'w-6 h-6')}
                    </div>

                    {dest.badge && (
                      <span className="text-[10px] font-sans uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 text-[#743F4D] font-semibold">
                        {dest.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-poem text-2xl font-semibold text-[#4D2531] mb-1 group-hover:text-[#8E4D60] transition-colors leading-snug">
                    {dest.name}
                  </h3>
                  <p className="font-poem italic text-sm text-[#8B737C] mb-3">
                    {dest.subtitle}
                  </p>

                  {/* Short Narrative Description */}
                  <p className="font-poem text-sm text-[#392B30] leading-relaxed line-clamp-3 mb-4">
                    {dest.description}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-[#DE9EB0]/30 flex items-center justify-between">
                  <span className="text-xs font-sans text-[#743F4D] font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform duration-300">
                    <span>Enter {dest.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B77973]" />
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDestination(dest);
                    }}
                    className="p-1.5 rounded-full hover:bg-[#FAF0F3] text-[#8B737C] hover:text-[#743F4D] transition-colors"
                    title="View details"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Destination Preview Modal */}
      <AnimatePresence>
        {selectedDestination && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-lg w-full paper-texture rounded-3xl p-7 sm:p-9 border border-[#DE9EB0] shadow-book-lg"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF0F3] text-[#743F4D] hover:text-[#4D2531] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon & Category */}
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: selectedDestination.themeColor }}
                >
                  {getDestinationIcon(selectedDestination.iconName, 'w-6 h-6')}
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#B77973] font-semibold">
                    {selectedDestination.badge}
                  </span>
                  <h3 className="font-poem text-3xl font-medium text-[#4D2531]">
                    {selectedDestination.name}
                  </h3>
                </div>
              </div>

              <p className="font-poem italic text-base text-[#743F4D] mb-4">
                "{selectedDestination.details.tagline}"
              </p>

              <p className="font-poem text-base text-[#392B30] leading-relaxed mb-6">
                {selectedDestination.description}
              </p>

              {/* Features List */}
              <div className="mb-6 space-y-2.5 bg-[#FAF0F3]/70 p-4 rounded-2xl border border-[#DE9EB0]/40">
                <span className="text-xs font-sans font-semibold text-[#743F4D] uppercase tracking-wider block mb-2">
                  What waits inside:
                </span>
                {selectedDestination.details.featureList.map((feat, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs font-sans text-[#4D2531]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B77973] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="px-4 py-2 text-xs font-sans text-[#8B737C] hover:text-[#4D2531]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const path = selectedDestination.path;
                    setSelectedDestination(null);
                    onSelectDestination(path);
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-sans font-medium text-white shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
                  style={{ backgroundColor: selectedDestination.themeColor }}
                >
                  <span>Enter This Location</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

