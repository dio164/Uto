import React, { useState } from 'react';
import { useUniverseData } from '../hooks/useUniverseData';
import { FutureMuseumItem } from '../types/universeData';
import { ArrowLeft, Compass, Star, CheckCircle2, Clock } from 'lucide-react';

interface FutureMuseumPageProps {
  onNavigateBack: () => void;
}

type StatusTab = 'all' | 'someday' | 'planned' | 'experienced';

const STATUS_CONFIG = {
  someday: { label: 'Someday Wishes', icon: '✨', color: '#C8A8E9', bg: '#F5F0FF' },
  planned: { label: 'In The Works', icon: '📍', color: '#98D8C8', bg: '#F0FFF9' },
  experienced: { label: 'Lived & Cherished', icon: '💝', color: '#FF9FB2', bg: '#FFF5F7' },
};

const CATEGORY_ICONS: Record<string, string> = {
  Adventures: '🧭',
  'Places to Visit': '🗺️',
  'Restaurants to Try': '🍽️',
  'Traditions to Begin': '🌅',
  'Things to Experience': '🎭',
};

function MuseumCard({ item }: { item: FutureMuseumItem }) {
  const statusCfg = STATUS_CONFIG[item.status];
  const catIcon = CATEGORY_ICONS[item.category] || '⭐';

  return (
    <div
      className="rounded-2xl border p-4 space-y-3 hover:shadow-md transition-all"
      style={{ backgroundColor: statusCfg.bg, borderColor: statusCfg.color + '44' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{catIcon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[11px] font-sans tracking-wide uppercase font-medium" style={{ color: statusCfg.color }}>
              {item.category}
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-sans font-medium"
              style={{ backgroundColor: statusCfg.color + '22', color: statusCfg.color }}
            >
              {statusCfg.icon} {statusCfg.label}
            </span>
          </div>
          <h3 className="font-serif text-[#4D2531] text-base leading-snug">{item.title}</h3>
        </div>
      </div>

      {item.target_location && (
        <p className="text-xs text-[#4D2531]/60 flex items-center space-x-1">
          <span>📍</span>
          <span>{item.target_location}</span>
        </p>
      )}

      {item.notes && (
        <p className="text-xs text-[#4D2531]/80 font-serif italic bg-white/60 p-2.5 rounded-xl">
          {item.notes}
        </p>
      )}

      {item.status === 'experienced' && item.reflection && (
        <div className="bg-white/80 rounded-xl p-3 border border-pink-200/40">
          <p className="text-xs text-[#4D2531]/70 font-sans font-medium mb-1">Looking back...</p>
          <p className="text-xs text-[#4D2531] font-serif italic">{item.reflection}</p>
        </div>
      )}
    </div>
  );
}

export const FutureMuseumPage: React.FC<FutureMuseumPageProps> = ({ onNavigateBack }) => {
  const { futureMuseum } = useUniverseData();
  const [activeTab, setActiveTab] = useState<StatusTab>('all');

  const filtered = activeTab === 'all' ? futureMuseum : futureMuseum.filter((fm) => fm.status === activeTab);

  const counts = {
    all: futureMuseum.length,
    someday: futureMuseum.filter((fm) => fm.status === 'someday').length,
    planned: futureMuseum.filter((fm) => fm.status === 'planned').length,
    experienced: futureMuseum.filter((fm) => fm.status === 'experienced').length,
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #F5F0FF 0%, #FFF0F5 40%, #FFF5EC 100%)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-purple-200/20 blur-3xl" />
        <div className="absolute top-20 left-20 w-48 h-48 rounded-full bg-pink-200/20 blur-2xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <button onClick={onNavigateBack} className="flex items-center space-x-2 text-[#4D2531]/70 hover:text-[#4D2531] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans">Planet Uto</span>
        </button>
        <div className="flex items-center space-x-2 text-[#8E4D60]">
          <Compass className="w-4 h-4" />
          <span className="font-sans text-xs tracking-widest uppercase">The Future Museum</span>
        </div>
        <div className="w-24" />
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/60 border border-[#F8D7E3] shadow-lg mb-6 mx-auto">
            <span className="text-4xl">🏛️</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4D2531] mb-3">The Future Museum</h1>
          <p className="text-[#8E4D60] font-serif italic text-lg">All the things we're going to do — and all the things we did.</p>
        </div>

        {/* Stats pills */}
        <div className="flex justify-center gap-4 mb-6">
          {(['someday', 'planned', 'experienced'] as const).map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div key={s} className="text-center">
                <div className="text-2xl font-serif font-bold" style={{ color: cfg.color }}>{counts[s]}</div>
                <div className="text-[11px] text-[#4D2531]/50">{cfg.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tab Filter */}
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {(['all', 'someday', 'planned', 'experienced'] as StatusTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                activeTab === tab
                  ? 'bg-[#D4607A] text-white border-[#D4607A] shadow-xs'
                  : 'bg-white/70 text-[#4D2531]/70 border-[#F8D7E3] hover:border-[#D4607A]/40'
              }`}
            >
              {tab === 'all' ? <Star className="w-3 h-3" /> : tab === 'experienced' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span>
                {tab === 'all'
                  ? `All (${counts.all})`
                  : tab === 'someday' ? `✨ Someday (${counts.someday})`
                  : tab === 'planned' ? `📍 Planned (${counts.planned})`
                  : `💝 Experienced (${counts.experienced})`}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#4D2531]/40">
            <Compass className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-serif italic">No items in this section yet. Add dreams in Admin → Universe Studio → Future Museum tab.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <MuseumCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
