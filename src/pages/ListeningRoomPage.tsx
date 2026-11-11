import React, { useState, useRef } from 'react';
import { useUniverseData } from '../hooks/useUniverseData';
import { RecordingItem } from '../types/universeData';
import { ArrowLeft, Radio, Play, Pause, Music } from 'lucide-react';

interface ListeningRoomPageProps {
  onNavigateBack: () => void;
}

const CATEGORIES = ['All', 'Spoken Letters', 'Little Voicenotes', 'Songs for You', 'For When You Miss Me', 'Special Occasions', 'Just Because'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  'Spoken Letters': '#FF9FB2',
  'Little Voicenotes': '#98D8C8',
  'Songs for You': '#DDA0DD',
  'For When You Miss Me': '#C8A8E9',
  'Special Occasions': '#FFD700',
  'Just Because': '#FAD4E0',
};

function AudioPlayer({ recording, isPlaying, onTogglePlay }: { recording: RecordingItem; isPlaying: boolean; onTogglePlay: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');

  const handleTimeUpdate = () => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
    const mins = Math.floor(el.currentTime / 60);
    const secs = Math.floor(el.currentTime % 60);
    setCurrentTime(`${mins}:${String(secs).padStart(2, '0')}`);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    el.currentTime = (Number(e.target.value) / 100) * el.duration;
  };

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.play().catch(() => {});
    else el.pause();
  }, [isPlaying]);

  const catColor = CATEGORY_COLORS[recording.category] || '#FF9FB2';

  return (
    <div className="p-5 rounded-2xl bg-white/80 border border-[#F8D7E3]/60 hover:border-[#D4607A]/40 transition-all shadow-xs space-y-4">
      <audio ref={audioRef} src={recording.audio_url} onTimeUpdate={handleTimeUpdate} onEnded={() => {}} preload="metadata" />

      <div className="flex items-start gap-4">
        {/* Artwork / placeholder */}
        <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center shadow-xs" style={{ backgroundColor: catColor + '33', border: `1px solid ${catColor}66` }}>
          {recording.artwork_url ? (
            <img src={recording.artwork_url} alt={recording.title} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <Music className="w-7 h-7" style={{ color: catColor }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-sans tracking-wider uppercase font-medium" style={{ color: catColor }}>{recording.category}</span>
          <h3 className="font-serif text-[#4D2531] text-base leading-snug mt-0.5 truncate">{recording.title}</h3>
          {recording.description && (
            <p className="text-xs text-[#4D2531]/60 font-serif italic mt-0.5 line-clamp-1">"{recording.description}"</p>
          )}
        </div>

        <button
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-xs transition-all flex-shrink-0"
          style={{ backgroundColor: catColor, color: 'white' }}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
      </div>

      {/* Seek bar */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: catColor, background: `linear-gradient(to right, ${catColor} ${progress}%, #F8D7E3 ${progress}%)` }}
        />
        <div className="flex justify-between text-[11px] text-[#4D2531]/40 font-mono">
          <span>{currentTime}</span>
          <span>{recording.duration || '—'}</span>
        </div>
      </div>

      {recording.date_recorded && (
        <p className="text-[11px] text-[#4D2531]/40 text-right">Recorded {recording.date_recorded}</p>
      )}
    </div>
  );
}

export const ListeningRoomPage: React.FC<ListeningRoomPageProps> = ({ onNavigateBack }) => {
  const { recordings } = useUniverseData();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const published = recordings.filter((r) => r.is_published !== false);
  const filtered = activeCategory === 'All' ? published : published.filter((r) => r.category === activeCategory);

  const togglePlay = (id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFF5FB 0%, #FDEAF5 50%, #F5EAF5 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#DDA0DD]/20 blur-3xl" />
        <div className="absolute top-10 right-20 w-48 h-48 rounded-full bg-[#FAD4E0]/30 blur-2xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <button onClick={onNavigateBack} className="flex items-center space-x-2 text-[#4D2531]/70 hover:text-[#4D2531] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans">Planet Uto</span>
        </button>
        <div className="flex items-center space-x-2 text-[#8E4D60]">
          <Radio className="w-4 h-4" />
          <span className="font-sans text-xs tracking-widest uppercase">The Listening Room</span>
        </div>
        <div className="w-24" />
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/60 border border-[#F8D7E3] shadow-lg mb-6 mx-auto">
            <span className="text-4xl">🎙️</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4D2531] mb-3">The Listening Room</h1>
          <p className="text-[#8E4D60] font-serif italic text-lg">Songs, voicenotes, and spoken words — all made for you.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-[#D4607A] text-white border-[#D4607A] shadow-xs'
                  : 'bg-white/70 text-[#4D2531]/70 border-[#F8D7E3] hover:border-[#D4607A]/40'
              }`}
            >
              {cat === 'All' ? `All (${published.length})` : cat}
            </button>
          ))}
        </div>

        {/* Track List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#4D2531]/40">
            <Music className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-serif italic">No recordings in this category yet.</p>
            <p className="text-xs mt-2">The curator is recording something special...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((rec) => (
              <AudioPlayer
                key={rec.id}
                recording={rec}
                isPlaying={playingId === rec.id}
                onTogglePlay={() => togglePlay(rec.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
