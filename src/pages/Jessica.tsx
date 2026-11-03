import React, { useState, useEffect } from 'react';
import { Poem } from '../types/poem';
import { FloatingPetals } from '../components/Decorative/FloatingPetals';
import { AmbientDust } from '../components/Decorative/AmbientDust';
import { ProgressNav } from '../components/Jessica/ProgressNav';
import { WelcomeSection } from '../components/Jessica/WelcomeSection';
import { StoryTimeline } from '../components/Jessica/StoryTimeline';
import { AppreciationGrid } from '../components/Jessica/AppreciationGrid';
import { PoetryShowcase } from '../components/Jessica/PoetryShowcase';
import { CompositionDedication } from '../components/Jessica/CompositionDedication';
import { NextChapter } from '../components/Jessica/NextChapter';
import { MusicWidget } from '../components/Audio/MusicWidget';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { useSound } from '../hooks/useSound';
import { useJessicaContent } from '../hooks/useJessicaContent';
import { BOOK_CONFIG } from '../config/book';
import { JESSICA_CONTENT } from '../config/jessicaContent';
import { Key } from 'lucide-react';

interface JessicaPageProps {
  poems: Poem[];
  onNavigateToHome: () => void;
  onNavigateToAdmin?: () => void;
}

export const JessicaPage: React.FC<JessicaPageProps> = ({
  poems,
  onNavigateToHome,
  onNavigateToAdmin,
}) => {
  const [activeSection, setActiveSection] = useState<string>('welcome');

  // Dynamic Content (editable through Curator Desk)
  const { timeline, appreciations } = useJessicaContent();

  // Background Music system using Jessica's dedicated playlist
  const { isMuted } = useSound();
  const ytPlayer = useYouTubePlayer(JESSICA_CONTENT.music.playlistId || 'PLCOpQhumGeHc');

  useEffect(() => {
    ytPlayer.setMuted(isMuted);
  }, [isMuted, ytPlayer]);

  useEffect(() => {
    // Dynamic page title for Uto
    const originalTitle = document.title;
    document.title = 'For Uto — Uto Omega';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  useEffect(() => {
    const sectionIds = ['welcome', 'story', 'appreciations', 'poetry', 'composition', 'next-chapter'];

    const handleScroll = () => {
      const viewportHeight = window.innerHeight;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportHeight * 0.4) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBeginStory = () => {
    if (!ytPlayer.isPlaying) {
      ytPlayer.play();
    }
    const storyEl = document.getElementById('story');
    if (storyEl) {
      storyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-[#392B30]">
      {/* Decorative Atmosphere */}
      <FloatingPetals />
      <AmbientDust />

      {/* Floating Music Widget */}
      <MusicWidget
        isVisible={true}
        isPlaying={ytPlayer.isPlaying}
        isLooping={ytPlayer.isLooping}
        currentTitle={ytPlayer.currentTitle}
        onTogglePlay={ytPlayer.togglePlay}
        onNextTrack={ytPlayer.nextTrack}
        onPrevTrack={ytPlayer.prevTrack}
        onToggleLoop={ytPlayer.toggleLoop}
        mountNode={ytPlayer.mountNode}
      />

      {/* Floating Navigation & Reading Progress */}
      <ProgressNav
        activeSection={activeSection}
        onNavigateToHome={onNavigateToHome}
      />

      {/* Main Experience Stream */}
      <main className="relative z-20 flex-1 flex flex-col">
        {/* Section 1: Welcome */}
        <WelcomeSection onBeginStory={handleBeginStory} />

        {/* Section 2: Our Story (Dynamic Timeline) */}
        <StoryTimeline entries={timeline} />

        {/* Section 3: Things I Appreciate About You (Dynamic Appreciations) */}
        <AppreciationGrid items={appreciations} />

        {/* Section 4: Poetry from Uto Omega */}
        <PoetryShowcase poems={poems} />

        {/* Section 5: The Composition (Acoustic Guitar Dedication) */}
        <CompositionDedication />

        {/* Section 6: The Next Chapter */}
        <NextChapter onNavigateToHome={onNavigateToHome} />
      </main>

      {/* Discreet Keepsake Footer */}
      <footer className="relative z-20 py-8 px-6 text-xs font-poem text-[#8B737C] border-t border-[#DE9EB0]/30 mt-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="italic tracking-widest text-[#B77973]">
            &copy; {BOOK_CONFIG.year} {BOOK_CONFIG.title} &mdash; A Keepsake Dedicated to Uto
          </span>

          {onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              title="Curator's desk (/admin)"
              className="group flex items-center space-x-1.5 text-[#AF99A2] hover:text-[#743F4D] transition-colors p-1"
              aria-label="Open Curator Desk"
            >
              <span className="text-[10px] font-sans uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                curator
              </span>
              <div className="w-5 h-5 rounded-full bg-[#FAF0F3] border border-[#DE9EB0]/60 flex items-center justify-center group-hover:border-[#C98598] transition-colors shadow-xs">
                <Key className="w-2.5 h-2.5 text-[#C98598] group-hover:text-[#743F4D]" />
              </div>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
