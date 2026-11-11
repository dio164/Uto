import React, { useState, useEffect } from 'react';
import { useUniverseData } from '../hooks/useUniverseData';
import { ImportantDateItem } from '../types/universeData';
import { ArrowLeft, Telescope, Star, MapPin, Sparkles } from 'lucide-react';

interface ObservatoryPageProps {
  onNavigateBack: () => void;
}

function CountdownClock({ targetDate, title, category }: { targetDate: string; title: string; category: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: false });

  useEffect(() => {
    const compute = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        passed: false,
      });
    };
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const categoryColor: Record<string, string> = {
    Graduation: '#DDA0DD',
    Anniversary: '#FF9FB2',
    Birthday: '#FFB347',
    Meeting: '#98D8C8',
    Milestone: '#C8A8E9',
  };
  const color = categoryColor[category] || '#FF9FB2';

  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-5 space-y-4 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-sans tracking-widest uppercase" style={{ color }}>{category}</span>
          <h3 className="font-serif text-white text-lg leading-snug mt-0.5">{title}</h3>
          <p className="text-white/50 text-xs mt-1">
            {new Date(targetDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Star className="w-5 h-5 opacity-40" style={{ color }} />
      </div>

      {timeLeft.passed ? (
        <div className="text-center py-2">
          <span className="text-2xl">✨</span>
          <p className="text-white/80 font-serif italic text-sm mt-1">This beautiful day has arrived.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Mins', value: timeLeft.minutes },
            { label: 'Secs', value: timeLeft.seconds },
          ].map(({ label, value }) => (
            <div key={label} className="text-center rounded-xl bg-white/10 py-3">
              <div className="font-mono text-2xl font-bold text-white tabular-nums">{String(value).padStart(2, '0')}</div>
              <div className="text-[10px] tracking-widest text-white/50 uppercase mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FloatingStar({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full bg-white animate-pulse"
      style={{ width: 2, height: 2, ...style }}
    />
  );
}

export const ObservatoryPage: React.FC<ObservatoryPageProps> = ({ onNavigateBack }) => {
  const { dates } = useUniverseData();

  const stars = Array.from({ length: 60 }, (_) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.7 + 0.2,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${Math.random() * 2 + 1.5}s`,
  }));

  const sortedDates = [...dates].sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime());

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1245 30%, #4a1942 60%, #3d1a2e 100%)' }}>
      {/* Stars background */}
      {stars.map((s, i) => (
        <FloatingStar key={i} style={{ left: s.left, top: s.top, opacity: s.opacity, animationDelay: s.animationDelay, animationDuration: s.animationDuration }} />
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-pink-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <button
          onClick={onNavigateBack}
          className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans">Planet Uto</span>
        </button>
        <div className="flex items-center space-x-2 text-white/60">
          <Telescope className="w-4 h-4" />
          <span className="font-sans text-xs tracking-widest uppercase">The Observatory</span>
        </div>
        <div className="w-24" />
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 mx-auto">
            <Telescope className="w-10 h-10 text-pink-200" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-3">The Observatory</h1>
          <p className="text-white/60 font-serif italic text-lg">Looking forward — to all the moments we're counting down to.</p>
        </div>

        {/* Nigeria ↔ Romania Visual */}
        <div className="mb-10 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="text-center flex-1">
              <div className="text-3xl mb-1">🇳🇬</div>
              <div className="text-white font-serif text-sm">Lagos, Nigeria</div>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <MapPin className="w-3 h-3 text-pink-300" />
                <span className="text-pink-300 text-xs">6.5244° N</span>
              </div>
            </div>
            <div className="flex-1 relative h-px">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-pink-300 to-blue-400 opacity-60" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-pink-300/30 border border-pink-300/60 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-pink-200" />
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="text-3xl mb-1">🇷🇴</div>
              <div className="text-white font-serif text-sm">Bucharest, Romania</div>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <MapPin className="w-3 h-3 text-blue-300" />
                <span className="text-blue-300 text-xs">44.4268° N</span>
              </div>
            </div>
          </div>
          <p className="text-center text-white/40 text-xs font-sans tracking-wide mt-4">Two cities. One universe. One day, the same sky.</p>
        </div>

        {/* Countdown Clocks */}
        {sortedDates.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <Telescope className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-serif italic">No milestones yet. Add them in the Admin → Universe Studio → Observatory tab.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="font-serif text-white/70 text-sm tracking-wide uppercase flex items-center space-x-2">
              <Star className="w-3.5 h-3.5" />
              <span>Counting Down To</span>
            </h2>
            {sortedDates.map((dateItem: ImportantDateItem) => (
              <CountdownClock
                key={dateItem.id}
                targetDate={dateItem.target_date}
                title={dateItem.title}
                category={dateItem.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
