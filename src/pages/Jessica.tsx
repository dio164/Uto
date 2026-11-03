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
import { BOOK_CONFIG } from '../config/book';

interface JessicaPageProps {
  poems: Poem[];
  onNavigateToHome: () => void;
}

export const JessicaPage: React.FC<JessicaPageProps> = ({
  poems,
  onNavigateToHome,
}) => {
  const [activeSection, setActiveSection] = useState<string>('welcome');

  useEffect(() => {
    // Dynamic page title for Jessica
    const originalTitle = document.title;
    document.title = 'For Jessica — Uto Omega';
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
          // If the element's top is within the upper half of the viewport
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

      {/* Floating Navigation & Reading Progress */}
      <ProgressNav
        activeSection={activeSection}
        onNavigateToHome={onNavigateToHome}
      />

      {/* Main Experience Stream */}
      <main className="relative z-20 flex-1 flex flex-col">
        {/* Section 1: Welcome */}
        <WelcomeSection onBeginStory={handleBeginStory} />

        {/* Section 2: Our Story (Timeline) */}
        <StoryTimeline />

        {/* Section 3: Things I Appreciate About You */}
        <AppreciationGrid />

        {/* Section 4: Poetry from Uto Omega */}
        <PoetryShowcase poems={poems} />

        {/* Section 5: The Composition (Visual & Literary Dedication only) */}
        <CompositionDedication />

        {/* Section 6: The Next Chapter (No proposal, no letter) */}
        <NextChapter onNavigateToHome={onNavigateToHome} />
      </main>

      {/* Discreet Keepsake Footer */}
      <footer className="relative z-20 py-8 px-6 text-center text-xs font-poem text-[#8B737C] border-t border-[#DE9EB0]/30 mt-12">
        <p className="italic tracking-widest text-[#B77973]">
          &copy; {BOOK_CONFIG.year} {BOOK_CONFIG.title} &mdash; A Keepsake Dedicated to Jessica
        </p>
      </footer>
    </div>
  );
};
