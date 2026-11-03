import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JESSICA_CONTENT, TimelineEntry } from '../../config/jessicaContent';
import { OrnamentalDivider } from '../Decorative/BotanicalCorners';
import { Calendar, Sparkles, Image as ImageIcon, X, ZoomIn, Play } from 'lucide-react';

// ─── Lightbox ────────────────────────────────────────────────────────────────
interface LightboxProps {
  src: string;
  caption?: string;
  type: 'image' | 'video';
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ src, caption, type, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#1A0E12]/85 backdrop-blur-sm" />

        {/* Panel */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-4 -right-4 z-20 w-9 h-9 rounded-full bg-[#FFF9F2] border border-[#DE9EB0]/60 flex items-center justify-center shadow-md hover:bg-[#FAF0F3] transition-colors"
          >
            <X className="w-4 h-4 text-[#743F4D]" />
          </button>

          {/* Media */}
          <div className="rounded-2xl overflow-hidden border border-[#DE9EB0]/40 shadow-2xl bg-[#1A0E12]">
            {type === 'video' ? (
              <video
                src={src}
                controls
                autoPlay
                className="w-full max-h-[75vh] object-contain"
              />
            ) : (
              <img
                src={src}
                alt={caption || 'Memory'}
                className="w-full max-h-[75vh] object-contain"
              />
            )}
            {caption && (
              <p className="text-[12px] font-sans italic text-[#8B737C] text-center py-2.5 bg-[#FFF9F2]/95 px-4">
                {caption}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── StoryTimeline ───────────────────────────────────────────────────────────
interface StoryTimelineProps {
  entries?: TimelineEntry[];
}

export const StoryTimeline: React.FC<StoryTimelineProps> = ({ entries }) => {
  const { timeline } = JESSICA_CONTENT;
  const activeEntries = entries || timeline.entries;

  const [lightbox, setLightbox] = useState<{ src: string; caption?: string; type: 'image' | 'video' } | null>(null);
  const openLightbox = useCallback((src: string, type: 'image' | 'video', caption?: string) => setLightbox({ src, caption, type }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <section id="story" className="relative py-20 sm:py-28 px-4 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#8E4D60] font-semibold">
          Chapter I
        </span>
        <h2 className="font-poem text-4xl sm:text-5xl text-[#4D2531] mt-2 mb-3">
          {timeline.sectionTitle}
        </h2>
        <p className="font-poem italic text-lg sm:text-xl text-[#743F4D]/90 max-w-md mx-auto">
          {timeline.sectionSubtitle}
        </p>
        <OrnamentalDivider className="mt-4" color="#DE9EB0" />
      </div>

      {/* Timeline Spine & Nodes */}
      <div className="relative">
        {/* Continuous central connecting line */}
        <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-[#DE9EB0]/30 via-[#C98598]/60 to-[#DE9EB0]/30 -translate-x-1/2 hidden sm:block" />
        <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-[#DE9EB0]/30 via-[#C98598]/60 to-[#DE9EB0]/30 sm:hidden" />

        <div className="space-y-12 sm:space-y-16">
          {activeEntries.map((entry: TimelineEntry, index: number) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Center Node Badge */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-xs transition-transform ${
                      entry.isMilestone
                        ? 'bg-[#8E4D60] border-[#EAD49E] text-[#FFF9F2] ring-4 ring-[#DE9EB0]/40 scale-110'
                        : 'bg-[#FFF9F2] border-[#C98598] text-[#8E4D60]'
                    }`}
                  >
                    {entry.isMilestone ? (
                      <Sparkles className="w-4 h-4 text-[#EAD49E]" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C98598]" />
                    )}
                  </div>
                </div>

                {/* Content Card Container */}
                <div
                  className={`w-full sm:w-[calc(50%-2.5rem)] pl-14 sm:pl-0 ${
                    isEven ? 'sm:text-right sm:pr-8' : 'sm:pl-8'
                  }`}
                >
                  <div
                    className={`paper-texture rounded-2xl p-6 sm:p-7 border shadow-book transition-all hover:shadow-book-lg ${
                      entry.isMilestone
                        ? 'border-[#C98598] ring-1 ring-[#DE9EB0]/50 bg-gradient-to-br from-[#FFF9F2] to-[#FAF0F3]'
                        : 'border-[#DE9EB0]/50'
                    }`}
                  >
                    {/* Date Tag */}
                    <div
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-sans tracking-wider uppercase mb-3 ${
                        entry.isMilestone
                          ? 'bg-[#8E4D60] text-[#FFF9F2] font-semibold'
                          : 'bg-[#FAF0F3] text-[#743F4D] border border-[#DE9EB0]/60'
                      }`}
                    >
                      <Calendar className="w-3 h-3 text-[#B77973]" />
                      <span>{entry.date}</span>
                    </div>

                    {/* Entry Title */}
                    <h3 className="font-poem text-2xl sm:text-3xl font-medium text-[#4D2531] mb-2 leading-snug">
                      {entry.title}
                    </h3>

                    {/* Entry Description */}
                    <p className="font-poem text-base sm:text-lg text-[#392B30] leading-relaxed">
                      {entry.description}
                    </p>

                    {/* Optional Image or Image Placeholder */}
                    {entry.image ? (
                      <div className="mt-4 overflow-hidden rounded-xl border border-[#DE9EB0]/40 shadow-xs">
                        <button
                          type="button"
                          className="relative group w-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E4D60]"
                          onClick={() => openLightbox(entry.image!, 'image', entry.imageCaption)}
                          aria-label="View larger image"
                        >
                          <img
                            src={entry.image}
                            alt={entry.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Hover overlay hint */}
                          <div className="absolute inset-0 bg-[#1A0E12]/0 group-hover:bg-[#1A0E12]/25 transition-colors duration-300 flex items-center justify-center">
                            <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" />
                          </div>
                        </button>
                        {entry.imageCaption && (
                          <p className="text-[11px] font-sans italic text-[#8B737C] text-center py-1.5 bg-[#FAF0F3]/60">
                            {entry.imageCaption}
                          </p>
                        )}
                      </div>
                    ) : entry.imageCaption ? (
                      <div className="mt-3 pt-3 border-t border-[#DE9EB0]/30 flex items-center space-x-1.5 text-xs font-sans italic text-[#8B737C]">
                        <ImageIcon className="w-3 h-3 text-[#C98598]" />
                        <span>{entry.imageCaption}</span>
                      </div>
                    ) : null}

                    {/* Optional Video */}
                    {entry.video && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-[#DE9EB0]/40 shadow-xs">
                        <button
                          type="button"
                          className="relative group w-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E4D60]"
                          onClick={() => openLightbox(entry.video!, 'video', entry.videoCaption)}
                          aria-label="Play video"
                        >
                          {/* Video preview thumbnail */}
                          <video
                            src={entry.video}
                            className="w-full h-48 object-cover pointer-events-none"
                            muted
                            playsInline
                            preload="metadata"
                          />
                          {/* Play button overlay */}
                          <div className="absolute inset-0 bg-[#1A0E12]/30 group-hover:bg-[#1A0E12]/50 transition-colors duration-300 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#FFF9F2]/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Play className="w-5 h-5 text-[#8E4D60] translate-x-0.5" />
                            </div>
                          </div>
                        </button>
                        {entry.videoCaption && (
                          <p className="text-[11px] font-sans italic text-[#8B737C] text-center py-1.5 bg-[#FAF0F3]/60">
                            {entry.videoCaption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox src={lightbox.src} caption={lightbox.caption} type={lightbox.type} onClose={closeLightbox} />
      )}
    </section>
  );
};

