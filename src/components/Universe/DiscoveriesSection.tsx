import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar, Video, Image as ImageIcon, Heart } from 'lucide-react';
import { TimelineEntry } from '../../config/jessicaContent';

interface DiscoveriesSectionProps {
  timeline: TimelineEntry[];
  onNavigateToDestination: (path: string) => void;
}

export const DiscoveriesSection: React.FC<DiscoveriesSectionProps> = ({
  timeline,
  onNavigateToDestination,
}) => {
  // Take actual real items from the user's memories / milestones
  const recentItems = timeline.slice(-3).reverse();

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#FBCFE8]/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#FBCFE8] font-semibold">
            Fresh Stardust
          </span>
        </div>
        <h3 className="font-poem text-3xl sm:text-4xl text-[#FFF9F2] font-normal">
          Something is waiting for you...
        </h3>
        <p className="font-poem italic text-base text-[#FBCFE8]/80 max-w-md mx-auto mt-1">
          Recent moments, recordings, and keepsakes kept safely in Planet Uto.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {recentItems.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => onNavigateToDestination('/uto')}
            className="group cursor-pointer paper-texture rounded-2xl p-5 border border-[#DE9EB0]/60 shadow-lg hover:shadow-2xl hover:border-[#C98598] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-sans text-[#B77973] mb-2">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span className="font-medium text-[11px]">{item.date}</span>
                </span>
                {item.video ? (
                  <span className="flex items-center space-x-1 text-[10px] bg-[#FAF0F3] px-2 py-0.5 rounded-full text-[#8E4D60] font-semibold">
                    <Video className="w-3 h-3" />
                    <span>Video Clip</span>
                  </span>
                ) : item.image ? (
                  <span className="flex items-center space-x-1 text-[10px] bg-[#FAF0F3] px-2 py-0.5 rounded-full text-[#743F4D]">
                    <ImageIcon className="w-3 h-3" />
                    <span>Photo</span>
                  </span>
                ) : (
                  <Heart className="w-3 h-3 text-[#DE9EB0]" />
                )}
              </div>

              <h4 className="font-poem text-xl text-[#4D2531] font-medium leading-snug group-hover:text-[#8E4D60] transition-colors mb-2">
                {item.title}
              </h4>

              <p className="font-poem text-xs text-[#654F57] line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#DE9EB0]/30 flex items-center justify-between text-[11px] font-sans text-[#743F4D] font-medium">
              <span>View in Keepsake</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
