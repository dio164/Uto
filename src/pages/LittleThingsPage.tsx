import React, { useState } from 'react';
import { useUniverseData } from '../hooks/useUniverseData';
import { LittleThingItem } from '../types/universeData';
import { ArrowLeft, Bookmark } from 'lucide-react';

interface LittleThingsPageProps {
  onNavigateBack: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Funny Things She Said': '😄',
  'Little Details I Remember': '🌿',
  'Favourite Conversations': '💬',
  'Things She Was Excited About': '✨',
  'Inside Jokes': '🤭',
  'Random Memories': '🎲',
  'Things I Never Want to Forget': '💝',
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Funny Things She Said': { bg: '#FFF9C4', text: '#B45309', border: '#FDE68A' },
  'Little Details I Remember': { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  'Favourite Conversations': { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  'Things She Was Excited About': { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
  'Inside Jokes': { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
  'Random Memories': { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Things I Never Want to Forget': { bg: '#FFF0F5', text: '#9D174D', border: '#FBCFE8' },
};

const DEFAULT_STYLE = { bg: '#FAD4E0', text: '#4D2531', border: '#F8D7E3' };

function ThingCard({ item }: { item: LittleThingItem }) {
  const [expanded, setExpanded] = useState(false);
  const icon = CATEGORY_ICONS[item.category] || '📌';
  const style = CATEGORY_COLORS[item.category] || DEFAULT_STYLE;

  return (
    <div
      className="rounded-2xl border p-4 space-y-2 hover:shadow-md transition-all cursor-pointer"
      style={{ backgroundColor: style.bg, borderColor: style.border }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-sans tracking-wide uppercase font-medium" style={{ color: style.text + 'aa' }}>{item.category}</div>
          <h3 className="font-serif text-sm font-medium mt-0.5" style={{ color: style.text }}>{item.title}</h3>
        </div>
      </div>

      <p className="font-serif italic text-sm leading-relaxed" style={{ color: style.text }}>
        "{item.quote_or_memory}"
      </p>

      {expanded && item.context && (
        <p className="text-xs pt-2 border-t" style={{ color: style.text + '99', borderColor: style.border }}>
          {item.context}
        </p>
      )}

      {item.date_noted && (
        <p className="text-[11px] text-right" style={{ color: style.text + '66' }}>{item.date_noted}</p>
      )}
    </div>
  );
}

export const LittleThingsPage: React.FC<LittleThingsPageProps> = ({ onNavigateBack }) => {
  const { littleThings } = useUniverseData();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(littleThings.map((lt) => lt.category)))];
  const filtered = activeCategory === 'All' ? littleThings : littleThings.filter((lt) => lt.category === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFFBF5 0%, #FFF5EC 40%, #FFF0F5 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-yellow-200/20 blur-3xl" />
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-pink-200/20 blur-2xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <button onClick={onNavigateBack} className="flex items-center space-x-2 text-[#4D2531]/70 hover:text-[#4D2531] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans">Planet Uto</span>
        </button>
        <div className="flex items-center space-x-2 text-[#8E4D60]">
          <Bookmark className="w-4 h-4" />
          <span className="font-sans text-xs tracking-widest uppercase">The Little Things</span>
        </div>
        <div className="w-24" />
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/60 border border-[#F8D7E3] shadow-lg mb-6 mx-auto">
            <span className="text-4xl">🗃️</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4D2531] mb-3">The Little Things</h1>
          <p className="text-[#8E4D60] font-serif italic text-lg">The quotes, quirks, and moments I never want to forget about you.</p>
        </div>

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#D4607A] text-white border-[#D4607A] shadow-xs'
                    : 'bg-white/70 text-[#4D2531]/70 border-[#F8D7E3] hover:border-[#D4607A]/40'
                }`}
              >
                {cat !== 'All' && <span>{CATEGORY_ICONS[cat] || '📌'}</span>}
                <span>{cat === 'All' ? `All (${littleThings.length})` : cat}</span>
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#4D2531]/40">
            <Bookmark className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-serif italic">Nothing archived here yet. Add little things in the Admin → Universe Studio → Little Things tab.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            {filtered.map((lt) => (
              <div key={lt.id} className="break-inside-avoid mb-4">
                <ThingCard item={lt} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
