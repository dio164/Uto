import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Heart, Clock, Music, Feather, ArrowUp } from 'lucide-react';

interface ProgressNavProps {
  activeSection: string;
  onNavigateToHome: () => void;
}

const SECTIONS = [
  { id: 'welcome', label: 'Welcome', icon: Feather },
  { id: 'story', label: 'Our Story', icon: Clock },
  { id: 'appreciations', label: 'Appreciation', icon: Heart },
  { id: 'poetry', label: 'Poetry', icon: Sparkles },
  { id: 'composition', label: 'Composition', icon: Music },
  { id: 'next-chapter', label: 'Next Chapter', icon: Feather },
];

export const ProgressNav: React.FC<ProgressNavProps> = ({
  activeSection,
  onNavigateToHome,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF0F3]/90 backdrop-blur-md py-2.5 shadow-sm border-b border-[#DE9EB0]/30'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Journal back-link */}
        <button
          onClick={onNavigateToHome}
          className="group flex items-center space-x-2 text-xs font-sans text-[#743F4D] hover:text-[#4D2531] transition-colors"
          title="Return to Tales from Planet Uto"
        >
          <div className="w-7 h-7 rounded-full bg-[#FFF9F2] border border-[#DE9EB0]/60 flex items-center justify-center group-hover:border-[#C98598] transition-colors shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#B77973]" />
          </div>
          <span className="hidden sm:inline font-poem italic text-sm tracking-wide">
            Uto Omega
          </span>
        </button>

        {/* Center: Section navigation pills */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-[#FFF9F2]/80 backdrop-blur-xs p-1 rounded-full border border-[#DE9EB0]/40 shadow-xs">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-sans tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#8E4D60] text-[#FFF9F2] shadow-xs font-medium'
                    : 'text-[#743F4D] hover:text-[#4D2531] hover:bg-[#F8E4EA]/60'
                }`}
                title={section.label}
              >
                <span className="hidden md:inline">{section.label}</span>
                <span className="md:hidden">
                  <section.icon className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Quick back-to-top */}
        <button
          onClick={scrollToTop}
          className={`flex items-center space-x-1 text-xs text-[#8E4D60] hover:text-[#4D2531] p-1.5 rounded-full hover:bg-[#FAF0F3] transition-all ${
            scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          title="Return to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

