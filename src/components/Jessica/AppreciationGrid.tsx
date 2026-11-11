import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JESSICA_CONTENT, AppreciationItem } from '../../config/jessicaContent';
import { OrnamentalDivider } from '../Decorative/BotanicalCorners';
import { Heart, Sparkles, Compass, BookOpen, Sun, Smile, Feather, LucideIcon, Play, X, ZoomIn } from 'lucide-react';
import { UniversalVideo, UniversalVideoThumbnail } from '../Common/UniversalVideo';

const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Sparkles,
  Compass,
  BookOpen,
  Sun,
  Smile,
  Feather,
};

interface AppreciationGridProps {
  items?: AppreciationItem[];
}

export const AppreciationGrid: React.FC<AppreciationGridProps> = ({ items }) => {
  const { appreciations } = JESSICA_CONTENT;
  const activeItems = items || appreciations.items;

  // Lightbox state for images & videos
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    src: string;
    caption?: string;
    type: 'image' | 'video';
  }>({
    isOpen: false,
    src: '',
    type: 'image',
  });

  const openLightbox = (src: string, type: 'image' | 'video', caption?: string) => {
    setLightbox({ isOpen: true, src, caption, type });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    if (lightbox.isOpen) {
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [lightbox.isOpen]);

  return (
    <section id="appreciations" className="relative py-20 sm:py-28 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#8E4D60] font-semibold">
          Chapter II
        </span>
        <h2 className="font-poem text-4xl sm:text-5xl text-[#4D2531] mt-2 mb-3">
          {appreciations.sectionTitle}
        </h2>
        <p className="font-poem italic text-lg sm:text-xl text-[#743F4D]/90 max-w-lg mx-auto">
          {appreciations.sectionSubtitle}
        </p>
        <OrnamentalDivider className="mt-4" color="#DE9EB0" />
      </div>

      {/* Grid of Appreciation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {activeItems.map((item: AppreciationItem, index: number) => {
          const IconComponent = item.iconName ? ICON_MAP[item.iconName] || Heart : Heart;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group relative paper-texture rounded-2xl p-7 border border-[#DE9EB0]/50 shadow-book hover:shadow-book-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Top Bar: Category badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-sans uppercase tracking-widest text-[#B77973] font-medium bg-[#FAF0F3] px-2.5 py-1 rounded-full border border-[#DE9EB0]/50">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 flex items-center justify-center text-[#8E4D60] group-hover:bg-[#8E4D60] group-hover:text-[#FFF9F2] transition-colors duration-300">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-poem text-2xl font-medium text-[#4D2531] mb-3 group-hover:text-[#8E4D60] transition-colors">
                  {item.title}
                </h3>

                {/* Card Description */}
                <p className="font-poem text-base text-[#392B30] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Optional Video (supports Google Drive, YouTube, files) */}
              {item.video && (
                <div className="mt-4 pt-4 border-t border-[#DE9EB0]/30">
                  <button
                    type="button"
                    onClick={() => openLightbox(item.video!, 'video', item.videoCaption || item.title)}
                    className="relative group/vid w-full h-40 rounded-xl overflow-hidden bg-[#1A0E12] border border-[#DE9EB0]/40 block focus:outline-none"
                    aria-label={`Play video for ${item.title}`}
                  >
                    <UniversalVideoThumbnail src={item.video} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#1A0E12]/30 group-hover/vid:bg-[#1A0E12]/50 transition-colors flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-[#FFF9F2]/90 flex items-center justify-center shadow-lg group-hover/vid:scale-110 transition-transform">
                        <Play className="w-4 h-4 text-[#8E4D60] translate-x-0.5" />
                      </div>
                    </div>
                  </button>
                  {item.videoCaption && (
                    <p className="text-[11px] font-sans italic text-[#8B737C] text-center mt-1">
                      {item.videoCaption}
                    </p>
                  )}
                </div>
              )}

              {/* Optional Image */}
              {item.image && !item.video && (
                <div className="mt-4 pt-4 border-t border-[#DE9EB0]/30">
                  <button
                    type="button"
                    onClick={() => openLightbox(item.image!, 'image', item.imageCaption || item.title)}
                    className="relative group/img w-full h-36 rounded-lg overflow-hidden border border-[#DE9EB0]/40 block focus:outline-none"
                    aria-label={`View photo for ${item.title}`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                      <div className="w-8 h-8 rounded-full bg-[#FFF9F2]/90 flex items-center justify-center shadow-md">
                        <ZoomIn className="w-4 h-4 text-[#8E4D60]" />
                      </div>
                    </div>
                  </button>
                  {item.imageCaption && (
                    <p className="text-[11px] font-sans italic text-[#8B737C] text-center mt-1">
                      {item.imageCaption}
                    </p>
                  )}
                </div>
              )}

              {/* Subtle bottom accent line on hover */}
              <div className="mt-5 pt-3 border-t border-[#DE9EB0]/30 flex items-center justify-between text-[11px] font-sans text-[#AF99A2]">
                <span className="italic font-poem text-xs text-[#8E4D60]/70">treasured quality</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C98598] opacity-60 group-hover:scale-125 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
            onClick={closeLightbox}
          >
            <div className="absolute inset-0 bg-[#1A0E12]/85 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                aria-label="Close"
                className="absolute -top-4 -right-4 z-20 w-9 h-9 rounded-full bg-[#FFF9F2] border border-[#DE9EB0]/60 flex items-center justify-center shadow-md hover:bg-[#FAF0F3] transition-colors"
              >
                <X className="w-4 h-4 text-[#743F4D]" />
              </button>

              <div className="rounded-2xl overflow-hidden border border-[#DE9EB0]/40 shadow-2xl bg-[#1A0E12]">
                {lightbox.type === 'video' ? (
                  <UniversalVideo
                    src={lightbox.src}
                    controls
                    autoPlay
                    className="w-full max-h-[75vh]"
                  />
                ) : (
                  <img
                    src={lightbox.src}
                    alt={lightbox.caption || 'Memory'}
                    className="w-full max-h-[75vh] object-contain"
                  />
                )}
                {lightbox.caption && (
                  <p className="text-[12px] font-sans italic text-[#8B737C] text-center py-2.5 bg-[#FFF9F2]/95 px-4">
                    {lightbox.caption}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
