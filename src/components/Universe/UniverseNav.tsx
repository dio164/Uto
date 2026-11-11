import React, { useState } from 'react';
import { Sparkles, BookOpen, Heart, Key, Menu, X, Music } from 'lucide-react';

interface UniverseNavProps {
  onNavigate: (path: string) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export const UniverseNav: React.FC<UniverseNavProps> = ({
  onNavigate,
  isPlayingMusic,
  onToggleMusic,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Planet Uto Brand */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center space-x-2 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F472B6] to-[#FDE047] p-[1.5px] shadow-[0_0_15px_rgba(244,114,182,0.5)]">
            <div className="w-full h-full rounded-full bg-[#2E1124] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FDE047] group-hover:rotate-45 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-poem text-xl sm:text-2xl font-medium tracking-tight text-[#FFF9F2] group-hover:text-[#FBCFE8] transition-colors leading-none block">
              Planet Uto
            </span>
            <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#FBCFE8]/70 block font-light">
              Universe for Jessica
            </span>
          </div>
        </button>

        {/* Desktop Nav Actions */}
        <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#FBCFE8]/30 shadow-md">
          <button
            onClick={() => onNavigate('/book')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-sans text-[#FFF9F2] hover:bg-white/15 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FDE047]" />
            <span>Poetry Journal</span>
          </button>

          <button
            onClick={() => onNavigate('/uto')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-sans text-[#FFF9F2] hover:bg-white/15 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-[#F472B6]" />
            <span>For Uto</span>
          </button>

          <div className="w-px h-4 bg-white/20 mx-1" />

          {/* Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all ${
              isPlayingMusic
                ? 'bg-[#F472B6] text-white shadow-[0_0_12px_rgba(244,114,182,0.6)] font-medium'
                : 'text-[#FBCFE8] hover:bg-white/10'
            }`}
            title={isPlayingMusic ? 'Mute Music' : 'Play Music'}
          >
            <Music className={`w-3.5 h-3.5 ${isPlayingMusic ? 'animate-bounce' : ''}`} />
            <span>{isPlayingMusic ? 'Music Playing' : 'Music Off'}</span>
          </button>

          <div className="w-px h-4 bg-white/20 mx-1" />

          {/* Curator Link */}
          <button
            onClick={() => onNavigate('/admin')}
            className="p-1.5 rounded-full text-[#FBCFE8]/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Curator Studio"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-full backdrop-blur-md border border-[#FBCFE8]/30 ${
              isPlayingMusic ? 'bg-[#F472B6] text-white' : 'bg-white/10 text-[#FBCFE8]'
            }`}
            aria-label="Toggle music"
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-[#FBCFE8]/30 text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-sm mx-auto paper-texture rounded-3xl p-5 border border-[#DE9EB0] shadow-2xl flex flex-col space-y-3">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('/book');
            }}
            className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-[#FAF0F3] text-left text-sm font-poem text-[#4D2531]"
          >
            <BookOpen className="w-4 h-4 text-[#C98598]" />
            <span className="text-base font-medium">The Poetry Journal</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('/uto');
            }}
            className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-[#FAF0F3] text-left text-sm font-poem text-[#4D2531]"
          >
            <Heart className="w-4 h-4 text-[#F472B6]" />
            <span className="text-base font-medium">Dedicated to Uto</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('/admin');
            }}
            className="flex items-center space-x-2.5 p-2.5 rounded-xl hover:bg-[#FAF0F3] text-left text-sm font-poem text-[#4D2531]"
          >
            <Key className="w-4 h-4 text-[#B77973]" />
            <span className="text-base font-medium">Curator Studio</span>
          </button>
        </div>
      )}
    </header>
  );
};

