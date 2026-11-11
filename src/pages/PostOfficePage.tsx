import React, { useState } from 'react';
import { useUniverseData } from '../hooks/useUniverseData';
import { LetterItem } from '../types/universeData';
import { ArrowLeft, Mail, Lock, Unlock, X } from 'lucide-react';

interface PostOfficePageProps {
  onNavigateBack: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Open When You Miss Me': '💌',
  'Open When You Need Encouragement': '🌟',
  "Open When You Can't Sleep": '🌙',
  'Open When You Need a Reminder': '💝',
  'Special Occasions': '🎀',
  'Just Because': '✨',
};

function EnvelopeCard({ letter, onOpen }: { letter: LetterItem; onOpen: (l: LetterItem) => void }) {
  const isLocked = letter.is_locked && letter.unlock_date && new Date(letter.unlock_date) > new Date();
  const icon = CATEGORY_ICONS[letter.category] || '📮';

  return (
    <button
      onClick={() => !isLocked && onOpen(letter)}
      className={`group relative w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden ${
        isLocked
          ? 'bg-amber-50/80 border-amber-200/60 cursor-not-allowed opacity-70'
          : 'bg-white/90 border-[#F8D7E3] hover:border-[#D4607A] hover:shadow-lg cursor-pointer'
      }`}
    >
      {/* Envelope flap decoration */}
      <div
        className={`absolute top-0 left-0 right-0 h-16 ${isLocked ? 'bg-amber-100/60' : 'bg-[#FAD4E0]/40 group-hover:bg-[#FAD4E0]/70'} transition-colors`}
        style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}
      />

      <div className="relative p-5 pt-7">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="text-2xl">{icon}</div>
          {isLocked ? (
            <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          ) : (
            <Unlock className="w-4 h-4 text-[#D4607A] opacity-0 group-hover:opacity-100 mt-0.5 flex-shrink-0 transition-opacity" />
          )}
        </div>

        <span className="text-[11px] font-sans tracking-wider text-[#D4607A] uppercase font-medium">{letter.category}</span>
        <h3 className="font-serif text-[#4D2531] text-base mt-1 leading-snug">{letter.title}</h3>

        {isLocked && letter.unlock_date && (
          <p className="text-xs text-amber-700/70 mt-2 font-sans">
            Opens {new Date(letter.unlock_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}

        {!isLocked && (
          <p className="text-xs text-[#4D2531]/50 mt-2 font-serif italic line-clamp-2">
            {letter.content.substring(0, 80)}...
          </p>
        )}

        {!isLocked && (
          <div className="mt-3 inline-flex items-center space-x-1.5 text-xs text-[#D4607A] font-medium">
            <Mail className="w-3 h-3" />
            <span>Open letter</span>
          </div>
        )}
      </div>
    </button>
  );
}

function LetterModal({ letter, onClose }: { letter: LetterItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#FFF9F5] rounded-2xl max-w-lg w-full shadow-2xl border border-[#F8D7E3] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Letter header */}
        <div className="bg-gradient-to-r from-[#FAD4E0] to-[#F8E4EA] px-6 py-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/60 hover:bg-white text-[#4D2531] transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="text-2xl mb-2">{CATEGORY_ICONS[letter.category] || '📮'}</div>
          <span className="text-[11px] font-sans tracking-widest text-[#D4607A] uppercase">{letter.category}</span>
          <h2 className="font-serif text-[#4D2531] text-xl mt-1">{letter.title}</h2>
        </div>

        {/* Wax seal decoration */}
        <div className="flex justify-center -mt-5 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-[#D4607A] shadow-lg flex items-center justify-center text-white text-sm font-serif font-bold">❤</div>
        </div>

        {/* Letter body */}
        <div className="px-6 pb-8 max-h-96 overflow-y-auto">
          <div className="font-serif text-[#4D2531] text-sm leading-relaxed whitespace-pre-line" style={{ fontStyle: 'normal' }}>
            {letter.content}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#F8D7E3]/60 px-6 py-4 flex justify-between items-center">
          <span className="text-xs text-[#4D2531]/40 font-serif italic">With all my love,</span>
          <span className="text-xs text-[#4D2531]/40 font-serif italic">— Chidubem 💕</span>
        </div>
      </div>
    </div>
  );
}

export const PostOfficePage: React.FC<PostOfficePageProps> = ({ onNavigateBack }) => {
  const { letters } = useUniverseData();
  const [openLetter, setOpenLetter] = useState<LetterItem | null>(null);

  const publishedLetters = letters.filter((l) => l.is_published !== false);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFF0F5 0%, #FDE8EF 40%, #FAEDF5 100%)' }}>
      {/* Decorative top */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#FAD4E0]/30 blur-3xl" />
        <div className="absolute -top-10 right-10 w-48 h-48 rounded-full bg-[#E8D4F5]/30 blur-2xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <button onClick={onNavigateBack} className="flex items-center space-x-2 text-[#4D2531]/70 hover:text-[#4D2531] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans">Planet Uto</span>
        </button>
        <div className="flex items-center space-x-2 text-[#8E4D60]">
          <Mail className="w-4 h-4" />
          <span className="font-sans text-xs tracking-widest uppercase">The Post Office</span>
        </div>
        <div className="w-24" />
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/60 border border-[#F8D7E3] shadow-lg mb-6 mx-auto">
            <span className="text-4xl">📮</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4D2531] mb-3">The Post Office</h1>
          <p className="text-[#8E4D60] font-serif italic text-lg">Letters sealed with love, waiting just for you.</p>
        </div>

        {publishedLetters.length === 0 ? (
          <div className="text-center py-16 text-[#4D2531]/40">
            <Mail className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-serif italic">No letters yet. The curator is still writing...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {publishedLetters.map((letter) => (
              <EnvelopeCard key={letter.id} letter={letter} onOpen={setOpenLetter} />
            ))}
          </div>
        )}
      </div>

      {openLetter && <LetterModal letter={openLetter} onClose={() => setOpenLetter(null)} />}
    </div>
  );
};

