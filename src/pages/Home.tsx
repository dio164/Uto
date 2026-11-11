import React, { useEffect } from 'react';
import { Poem } from '../types/poem';
import { CelestialSky } from '../components/Universe/CelestialSky';
import { UniverseNav } from '../components/Universe/UniverseNav';
import { HeroPlanet } from '../components/Universe/HeroPlanet';
import { DailyMessageCard } from '../components/Universe/DailyMessageCard';
import { UniverseMap } from '../components/Universe/UniverseMap';
import { DiscoveriesSection } from '../components/Universe/DiscoveriesSection';
import { FloatingPetals } from '../components/Decorative/FloatingPetals';
import { AmbientDust } from '../components/Decorative/AmbientDust';
import { MusicWidget } from '../components/Audio/MusicWidget';
import { useSound } from '../hooks/useSound';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { useJessicaContent } from '../hooks/useJessicaContent';
import { UNIVERSE_CONFIG } from '../config/universe';
import { Flower2, Key, BookOpen, Heart } from 'lucide-react';

interface HomeProps {
  poems: Poem[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToJessica: () => void;
  onNavigateToDestination?: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigateToAdmin,
  onNavigateToJessica,
  onNavigateToDestination,
}) => {
  const { isMuted } = useSound();
  const ytPlayer = useYouTubePlayer(UNIVERSE_CONFIG.musicPlaylistId);
  const { timeline } = useJessicaContent();

  useEffect(() => {
    ytPlayer.setMuted(isMuted);
  }, [isMuted, ytPlayer]);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Planet Uto — A Little Universe for Jessica';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleNavigate = (path: string) => {
    if (onNavigateToDestination) {
      onNavigateToDestination(path);
    } else if (path === '/uto' || path === '/jessica') {
      onNavigateToJessica();
    } else if (path === '/admin') {
      onNavigateToAdmin();
    } else {
      window.location.href = path;
    }
  };

  const scrollToMap = () => {
    const mapElement = document.getElementById('universe-map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-[#FFF9F2] selection:bg-[#F472B6]/40 selection:text-white">
      {/* 1. Deep Celestial Pink Sky & Nebulas */}
      <CelestialSky />

      {/* 2. Floating Atmospheric Petals & Stardust */}
      <FloatingPetals />
      <AmbientDust />

      {/* 3. Universe Navigation Header */}
      <UniverseNav
        onNavigate={handleNavigate}
        isPlayingMusic={ytPlayer.isPlaying}
        onToggleMusic={ytPlayer.togglePlay}
      />

      {/* 4. Ambient Music Player Widget (Hidden Audio Driver + UI Controls in Nav) */}
      <MusicWidget
        isVisible={false}
        isPlaying={ytPlayer.isPlaying}
        isLooping={ytPlayer.isLooping}
        currentTitle={ytPlayer.currentTitle}
        onTogglePlay={ytPlayer.togglePlay}
        onNextTrack={ytPlayer.nextTrack}
        onPrevTrack={ytPlayer.prevTrack}
        onToggleLoop={ytPlayer.toggleLoop}
        mountNode={ytPlayer.mountNode}
      />

      {/* 5. Main Celestial Universe Content */}
      <main className="relative z-10 flex-1 flex flex-col pt-16">
        {/* Welcome Section with Illustrated Floating Planet */}
        <HeroPlanet
          onExploreClick={scrollToMap}
          onNavigateToBook={() => handleNavigate('/book')}
          onNavigateToJessica={() => handleNavigate('/uto')}
        />

        {/* Daily / Date-Aware Romantic Note */}
        <DailyMessageCard />

        {/* The Illustrated Universe Map */}
        <UniverseMap onSelectDestination={handleNavigate} />

        {/* Discoveries Section: "Something is waiting for you..." */}
        <DiscoveriesSection
          timeline={timeline}
          onNavigateToDestination={handleNavigate}
        />
      </main>

      {/* 6. Romantic Universe Footer */}
      <footer className="relative z-20 py-8 px-6 border-t border-[#FBCFE8]/20 bg-[#1F0B18]/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-xs font-poem text-[#FBCFE8]/80 gap-4">
        {/* Left: Quick Portal to Jessica Keepsake */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleNavigate('/uto')}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-[#F472B6]/40 text-[#FBCFE8] hover:text-white transition-colors"
          >
            <Flower2 className="w-3.5 h-3.5 text-[#F472B6]" />
            <span className="text-[11px] font-sans">For Uto Keepsake</span>
          </button>

          <button
            onClick={() => handleNavigate('/book')}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-[#E2C27F]/40 text-[#FDE047] hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#E2C27F]" />
            <span className="text-[11px] font-sans">The Poetry Journal</span>
          </button>
        </div>

        {/* Center: Dedicated to Jessica */}
        <div className="text-center font-poem italic text-sm text-[#FBCFE8]/90">
          <span className="flex items-center justify-center space-x-1">
            <span>Planet Uto</span>
            <Heart className="w-3 h-3 text-[#F472B6] fill-[#F472B6]" />
            <span>Dedicated with all my love to Jessica</span>
          </span>
        </div>

        {/* Right: Curator Desk Access */}
        <button
          onClick={() => handleNavigate('/admin')}
          title="Curator Studio"
          className="group flex items-center space-x-1.5 text-[#FBCFE8]/70 hover:text-white transition-colors"
        >
          <span className="text-[10px] font-sans uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            curator
          </span>
          <div className="w-7 h-7 rounded-full bg-white/10 border border-[#FBCFE8]/30 flex items-center justify-center group-hover:border-[#F472B6] transition-colors shadow-xs">
            <Key className="w-3.5 h-3.5 text-[#E2C27F] group-hover:text-white" />
          </div>
        </button>
      </footer>
    </div>
  );
};
