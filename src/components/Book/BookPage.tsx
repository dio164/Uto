import React, { forwardRef } from 'react';
import { BotanicalCorner } from '../Decorative/BotanicalCorners';

interface BookPageProps {
  pageNumber?: number;
  totalPageCount?: number;
  headerTitle?: string;
  side?: 'left' | 'right' | 'single';
  children: React.ReactNode;
  className?: string;
  dataDensity?: 'hard' | 'soft';
}

export const BookPage = forwardRef<HTMLDivElement, BookPageProps>((
  {
    pageNumber,
    headerTitle,
    side = 'single',
    children,
    className = '',
    dataDensity = 'soft',
  },
  ref
) => {
  const isLeft = side === 'left';
  const isRight = side === 'right';

  return (
    <div
      ref={ref}
      data-density={dataDensity}
      className={`page w-full h-full paper-texture relative flex flex-col overflow-hidden select-none ${
        isLeft ? 'book-spine-left' : isRight ? 'book-spine-right' : ''
      } ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* ── Ornamental Inner Border ───────────────────────────────────────
          Sits at inset-5 (20px). All content padding is set to keep
          text well inside this line at all times.
      ─────────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-5 border border-[#DE9EB0]/35 rounded pointer-events-none z-0"
        aria-hidden="true"
      >
        <div className="absolute inset-1 border border-[#EFE2D3]/60 rounded-sm" />
        <BotanicalCorner position="top-left"    size={26} color="#C98598" className="absolute top-0.5 left-0.5 opacity-60" />
        <BotanicalCorner position="top-right"   size={26} color="#C98598" className="absolute top-0.5 right-0.5 opacity-60" />
        <BotanicalCorner position="bottom-left" size={26} color="#C98598" className="absolute bottom-0.5 left-0.5 opacity-60" />
        <BotanicalCorner position="bottom-right" size={26} color="#C98598" className="absolute bottom-0.5 right-0.5 opacity-60" />
      </div>

      {/* ── Header ───────────────────────────────────────────────────────
          pt-8 keeps the text below the top border (inset-5 = 20px + border = ~21px).
          px-10 keeps it well inside the side borders.
      ─────────────────────────────────────────────────────────────────── */}
      <header className="relative z-10 pt-8 pb-1 px-10 flex items-center justify-between text-[10px] font-poem tracking-widest text-[#8B737C]/80 uppercase shrink-0">
        <span className="w-8 text-left">{isLeft && pageNumber ? `p. ${pageNumber}` : ''}</span>
        <span className="flex-1 truncate text-center italic tracking-wider px-2">
          {headerTitle || ''}
        </span>
        <span className="w-8 text-right">{isRight && pageNumber ? `p. ${pageNumber}` : ''}</span>
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────
          px-10 / py-3 gives ~10px clearance inside the ornamental border.
          overflow-hidden prevents ANY content from visually crossing the border.
      ─────────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 px-10 py-3 flex flex-col overflow-hidden min-h-0">
        {children}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────
          pb-8 keeps the page number above the bottom border.
      ─────────────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 pb-8 px-10 flex items-center justify-center shrink-0">
        {pageNumber && (
          <span className="font-poem italic tracking-widest text-xs text-[#743F4D]/65">
            ~ {pageNumber} ~
          </span>
        )}
      </footer>
    </div>
  );
});

BookPage.displayName = 'BookPage';
