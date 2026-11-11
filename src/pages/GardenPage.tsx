import React, { useState } from 'react';
import { useUniverseData } from '../hooks/useUniverseData';
import { GardenFlowerItem } from '../types/universeData';
import { ArrowLeft, Flower2, X } from 'lucide-react';

interface GardenPageProps {
  onNavigateBack: () => void;
}

const FLOWER_EMOJI: Record<string, string> = {
  'Vintage Rose': '🌹',
  'Princess Peony': '🌸',
  'Celestial Lily': '💐',
  'Stardust Orchid': '🌺',
  'Sweet Hydrangea': '💮',
};

function FlowerBloom({ flower, onClick }: { flower: GardenFlowerItem; onClick: () => void }) {
  const emoji = FLOWER_EMOJI[flower.flower_type] || '🌸';
  const color = flower.color || '#F472B6';

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center space-y-2 p-5 rounded-2xl bg-white/80 border border-white/60 hover:border-pink-300/60 transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
      style={{ borderColor: color + '40' }}
    >
      {/* Flower head */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: color + '30', border: `3px solid ${color}60` }}
      >
        {emoji}
      </div>

      {/* Flower stem */}
      <div className="w-0.5 h-6 rounded-full" style={{ backgroundColor: '#86efac' }} />

      {/* Grass base */}
      <div className="flex space-x-0.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-0.5 rounded-full"
            style={{ height: 10 + i * 4, backgroundColor: '#4ade80', transform: `rotate(${(i - 1) * 15}deg)`, transformOrigin: 'bottom center' }}
          />
        ))}
      </div>

      <div className="text-center pt-1">
        <div className="text-[11px] font-sans tracking-wide" style={{ color }}>
          {flower.flower_name}
        </div>
        <div className="text-xs text-[#4D2531]/70 font-serif mt-0.5 line-clamp-2 leading-tight">{flower.milestone_title}</div>
        <div className="text-[11px] text-[#4D2531]/40 mt-1">{flower.bloom_date}</div>
      </div>
    </button>
  );
}

function FlowerModal({ flower, onClose }: { flower: GardenFlowerItem; onClose: () => void }) {
  const emoji = FLOWER_EMOJI[flower.flower_type] || '🌸';
  const color = flower.color || '#F472B6';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#FFF9F5] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#F8D7E3]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="relative p-6 text-center" style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/60 hover:bg-white text-[#4D2531]">
            <X className="w-4 h-4" />
          </button>
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-3 shadow-lg"
            style={{ backgroundColor: color + '30', border: `4px solid ${color}60` }}
          >
            {emoji}
          </div>
          <span className="text-[11px] font-sans tracking-widest uppercase" style={{ color }}>{flower.flower_type}</span>
          <h2 className="font-serif text-[#4D2531] text-xl mt-1">{flower.milestone_title}</h2>
          <p className="text-[#4D2531]/50 text-xs mt-1">{flower.flower_name} · {flower.bloom_date}</p>
        </div>

        {/* Story */}
        <div className="p-6">
          <p className="font-serif text-[#4D2531] text-sm leading-relaxed italic">{flower.story}</p>
        </div>
      </div>
    </div>
  );
}

export const GardenPage: React.FC<GardenPageProps> = ({ onNavigateBack }) => {
  const { flowers } = useUniverseData();
  const [selectedFlower, setSelectedFlower] = useState<GardenFlowerItem | null>(null);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #FFF0F5 0%, #FDE8EF 30%, #F0FFF4 70%, #ECFDF5 100%)' }}
    >
      {/* Sky */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-pink-200/20 blur-3xl" />
        <div className="absolute top-10 right-20 w-48 h-48 rounded-full bg-purple-200/20 blur-2xl" />
      </div>

      {/* Floating butterflies */}
      {['🦋', '🌟', '✨', '🦋'].map((b, i) => (
        <div
          key={i}
          className="absolute text-xl pointer-events-none opacity-40 animate-bounce"
          style={{ left: `${20 + i * 20}%`, top: `${15 + (i % 2) * 10}%`, animationDelay: `${i * 0.5}s`, animationDuration: '3s' }}
        >
          {b}
        </div>
      ))}

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <button onClick={onNavigateBack} className="flex items-center space-x-2 text-[#4D2531]/70 hover:text-[#4D2531] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans">Planet Uto</span>
        </button>
        <div className="flex items-center space-x-2 text-[#4D7A4D]">
          <Flower2 className="w-4 h-4" />
          <span className="font-sans text-xs tracking-widest uppercase">The Enchanted Garden</span>
        </div>
        <div className="w-24" />
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/60 border border-[#F8D7E3] shadow-lg mb-6 mx-auto">
            <span className="text-4xl">🌸</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4D2531] mb-3">The Enchanted Garden</h1>
          <p className="text-[#8E4D60] font-serif italic text-lg">Every bloom holds a memory. Every memory holds us.</p>
        </div>

        {flowers.length === 0 ? (
          <div className="text-center py-16 text-[#4D2531]/40">
            <Flower2 className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-serif italic">The garden is waiting to bloom. Add memories in the Admin → Universe Studio → Garden tab.</p>
          </div>
        ) : (
          <>
            {/* Flower grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-8">
              {flowers.map((flower) => (
                <FlowerBloom key={flower.id} flower={flower} onClick={() => setSelectedFlower(flower)} />
              ))}
            </div>

            {/* Ground / grass */}
            <div className="relative h-8 mt-4">
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-green-200/60 to-transparent rounded-full" />
            </div>

            <p className="text-center text-[#4D2531]/40 text-xs font-serif italic mt-4">
              Click any flower to read the memory it holds 🌸
            </p>
          </>
        )}
      </div>

      {selectedFlower && <FlowerModal flower={selectedFlower} onClose={() => setSelectedFlower(null)} />}
    </div>
  );
};

