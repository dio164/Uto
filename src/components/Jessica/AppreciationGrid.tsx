import React from 'react';
import { motion } from 'framer-motion';
import { JESSICA_CONTENT, AppreciationItem } from '../../config/jessicaContent';
import { OrnamentalDivider } from '../Decorative/BotanicalCorners';
import { Heart, Sparkles, Compass, BookOpen, Sun, Smile, Feather, LucideIcon } from 'lucide-react';

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

              {/* Optional Image */}
              {item.image && (
                <div className="mt-4 pt-4 border-t border-[#DE9EB0]/30">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-36 object-cover rounded-lg border border-[#DE9EB0]/40"
                  />
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
    </section>
  );
};

