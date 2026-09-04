import React from 'react';
import { Poem } from '../../types/poem';
import { PoemPageSegment } from '../../types/bookPages';
import { OrnamentalDivider } from '../Decorative/BotanicalCorners';

interface PoemPageProps {
  segment?: PoemPageSegment;
  poem?: Poem;
}

export const PoemPage: React.FC<PoemPageProps> = ({ segment, poem }) => {
  const activeSegment: PoemPageSegment = segment || {
    poemId: poem?.id || 'preview',
    poem: poem || {
      id: 'preview',
      title: 'Untitled',
      body: '',
      order_index: 0,
    },
    segmentIndex: 0,
    totalSegments: 1,
    isFirstPage: true,
    isLastPage: true,
    lines: (poem?.body || '').split('\n'),
  };

  const { poem: currentPoem, isFirstPage, isLastPage, lines } = activeSegment;
  const bodyText = lines.join('\n');

  return (
    // h-full fills the BookPage <main> area (which is flex-1 with overflow:hidden)
    // flex-col lets us stack header → body → footer cleanly
    <div className="flex flex-col h-full w-full text-center">

      {/* ── Poem Header ────────────────────────────────────────────────── */}
      <div className="shrink-0 flex flex-col items-center mb-2">
        {isFirstPage ? (
          <>
            <h2 className="font-blackletter text-2xl text-[#4D2531] tracking-wide leading-tight drop-shadow-sm w-full px-1 break-words">
              {currentPoem.title}
            </h2>
            {currentPoem.subtitle && (
              <p className="font-poem italic text-xs text-[#8B737C] mt-1 font-light tracking-wider w-full break-words">
                {currentPoem.subtitle}
              </p>
            )}
            {currentPoem.dedication && (
              <p className="font-poem italic text-xs text-[#B77973] mt-0.5 font-medium tracking-wide w-full break-words">
                ~ {currentPoem.dedication} ~
              </p>
            )}
            <OrnamentalDivider className="mt-2 mb-0.5" color="#C98598" />
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2 text-[10px] font-poem italic tracking-widest text-[#8E4D60]/85 uppercase">
              <span>—</span><span>continued</span><span>—</span>
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#C98598]/40 to-transparent mt-1" />
          </>
        )}
      </div>

      {/* ── Poem Body ──────────────────────────────────────────────────── */}
      {/* flex-1 + overflow-hidden ensures body never leaks outside the page area */}
      <div className="flex-1 flex flex-col justify-center items-center overflow-hidden min-h-0">
        <p
          className="font-poem text-sm leading-[1.85] tracking-wide text-[#392B30] whitespace-pre-wrap break-words overflow-wrap-anywhere w-full selection:bg-[#F3CCD7] selection:text-[#743F4D]"
          style={{ overflowWrap: 'anywhere' }}
        >
          {bodyText}
        </p>
      </div>

      {/* ── Poem Footer (date) ─────────────────────────────────────────── */}
      {isLastPage && currentPoem.poem_date && (
        <div className="shrink-0 pt-2 flex justify-center">
          <p className="font-poem italic text-[10px] text-[#8B737C]/85 tracking-widest">
            {currentPoem.poem_date}
          </p>
        </div>
      )}
    </div>
  );
};
