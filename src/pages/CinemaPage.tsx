import React, { useState } from 'react';
import { useUniverseData } from '../hooks/useUniverseData';
import { CinemaMediaItem } from '../types/universeData';
import { ArrowLeft, Film, Play, X, Camera, Video } from 'lucide-react';

interface CinemaPageProps {
  onNavigateBack: () => void;
}

function MediaThumbnail({ item, onClick }: { item: CinemaMediaItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden bg-gray-900 aspect-video border border-white/10 hover:border-pink-300/50 transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
    >
      {/* Thumbnail image */}
      {item.thumbnail_url ? (
        <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4D2531] to-[#1a0a2e]">
          {item.media_type === 'video' ? (
            <Video className="w-10 h-10 text-pink-300/50" />
          ) : (
            <Camera className="w-10 h-10 text-pink-300/50" />
          )}
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Play button for video */}
      {item.media_type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Play className="w-5 h-5 text-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="text-[11px] text-pink-300/80 font-sans tracking-wide uppercase">
          {item.recap_month ? `${item.recap_month} ` : ''}{item.recap_year} · {item.media_type}
        </div>
        <h3 className="text-white font-serif text-sm leading-snug mt-0.5 line-clamp-1">{item.title}</h3>
      </div>
    </button>
  );
}

function LightboxModal({ item, onClose }: { item: CinemaMediaItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-10" onClick={onClose}>
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Media */}
        <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
          {item.media_type === 'video' ? (
            <video
              src={item.media_url}
              controls
              autoPlay
              className="w-full max-h-[70vh] object-contain bg-black"
            />
          ) : (
            <img
              src={item.media_url}
              alt={item.title}
              className="w-full max-h-[70vh] object-contain bg-black"
            />
          )}
        </div>

        {/* Caption */}
        <div className="mt-4 text-center space-y-1">
          <h2 className="text-white font-serif text-xl">{item.title}</h2>
          {item.caption && <p className="text-white/60 font-serif italic text-sm">{item.caption}</p>}
          <p className="text-white/40 text-xs">{item.recap_month ? `${item.recap_month} ` : ''}{item.recap_year}</p>
        </div>
      </div>
    </div>
  );
}

export const CinemaPage: React.FC<CinemaPageProps> = ({ onNavigateBack }) => {
  const { cinema } = useUniverseData();
  const [lightboxItem, setLightboxItem] = useState<CinemaMediaItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');

  const filtered = cinema.filter((item) => filter === 'all' || item.media_type === filter);

  // Group by year for the "Previously on Planet Uto" recap section
  const byYear = filtered.reduce<Record<string, CinemaMediaItem[]>>((acc, item) => {
    const year = item.recap_year || 'Archive';
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #1a0a1e 0%, #2d1a3d 50%, #1a0a2e 100%)' }}>
      {/* Stars */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/60 animate-pulse pointer-events-none"
          style={{ width: 1.5, height: 1.5, left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, animationDelay: `${Math.random() * 3}s` }}
        />
      ))}

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <button onClick={onNavigateBack} className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans">Planet Uto</span>
        </button>
        <div className="flex items-center space-x-2 text-pink-300/80">
          <Film className="w-4 h-4" />
          <span className="font-sans text-xs tracking-widest uppercase">Our Little Cinema</span>
        </div>
        <div className="w-24" />
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 mx-auto">
            <span className="text-4xl">🎬</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-3">Our Little Cinema</h1>
          <p className="text-pink-200/60 font-serif italic text-lg">Our favourite moments, captured in stills and reels.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(['all', 'photo', 'video'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                filter === f
                  ? 'bg-pink-500 text-white border-pink-500 shadow-xs shadow-pink-500/40'
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-pink-500/40'
              }`}
            >
              {f === 'all' ? `All (${cinema.length})` : f === 'photo' ? `📸 Photos` : `🎥 Videos`}
            </button>
          ))}
        </div>

        {cinema.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <Film className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-serif italic">The projection room is empty. Add clips in Admin → Universe Studio → Cinema tab.</p>
          </div>
        ) : (
          Object.entries(byYear)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([year, items]) => (
              <div key={year} className="mb-10">
                <h2 className="font-serif text-white/50 text-xs tracking-widest uppercase mb-4 flex items-center space-x-2">
                  <span className="inline-block w-8 h-px bg-white/20" />
                  <span>Previously on Planet Uto — {year}</span>
                  <span className="inline-block flex-1 h-px bg-white/20" />
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <MediaThumbnail key={item.id} item={item} onClick={() => setLightboxItem(item)} />
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

      {lightboxItem && <LightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />}
    </div>
  );
};
