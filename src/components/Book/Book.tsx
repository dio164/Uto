import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { PageFlip } from 'page-flip';
import { Poem } from '../../types/poem';
import { CanonicalBookPage } from '../../types/bookPages';
import { buildCanonicalBookPages } from '../../utils/paginatePoems';
import { BOOK_CONFIG } from '../../config/book';
import { BookPage } from './BookPage';
import { PoemPage } from './PoemPage';
import { PageControls } from './PageControls';
import { VintageRoseEmblem, OrnamentalDivider } from '../Decorative/BotanicalCorners';
import { useSound } from '../../hooks/useSound';

interface BookProps {
  poems: Poem[];
  onCloseBook: () => void;
}

export const Book: React.FC<BookProps> = ({ poems, onCloseBook }) => {
  // hostRef → the visible container; page-flip attaches its canvas/DOM here
  const hostRef = useRef<HTMLDivElement>(null);
  // stagingRef → off-screen container; React renders BookPage components here (owns them)
  const stagingRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const { isMuted, toggleMute, playTurn } = useSound();

  // ─── Responsive dimensions ────────────────────────────────────────────────
  const [windowDimensions, setWindowDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
      }, 150);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, []);

  const isMobile = windowDimensions.width < 768;

  const dimensions = useMemo(() => {
    const availableW = windowDimensions.width - (isMobile ? 24 : 64);
    const availableH = windowDimensions.height - 200;
    const maxPageW = isMobile
      ? Math.min(availableW, 420)
      : Math.min(Math.floor(availableW / 2), 460);
    const pageH = Math.min(availableH, Math.floor(maxPageW * 1.38), 640);
    const pageW = Math.max(Math.floor(pageH / 1.38), 280);
    const spreadW = isMobile ? pageW : pageW * 2;
    return { pageW, pageH, spreadW };
  }, [windowDimensions, isMobile]);

  // ─── Canonical page list (drives both staging render + PageFlip) ──────────
  const bookPages = useMemo(() =>
    buildCanonicalBookPages(poems, dimensions, isMobile),
    [poems, dimensions, isMobile]
  );
  const totalPages = bookPages.length;

  // ─── Core: Initialize / re-initialize PageFlip ───────────────────────────
  // Strategy: React renders BookPage components into the off-screen stagingRef
  // container. We then CLONE each .page element's outerHTML into fresh divs
  // and hand those to page-flip. Page-flip owns its fresh divs; React owns
  // the staging divs. The two trees never conflict.
  useEffect(() => {
    const host = hostRef.current;
    const staging = stagingRef.current;
    if (!host || !staging) return;

    // Destroy previous instance first
    if (pageFlipRef.current) {
      try { pageFlipRef.current.destroy(); } catch { /* ignore */ }
      pageFlipRef.current = null;
    }
    setIsReady(false);
    setCurrentPage(0);

    // Wait for React to finish rendering pages into the staging container.
    // A 250ms timer is a pragmatic guard — React commits synchronously, so
    // by the next macrotask the DOM is fully up-to-date.
    const timer = setTimeout(() => {
      const stagedPages = staging.querySelectorAll<HTMLElement>('.page');
      if (stagedPages.length === 0) {
        console.warn('[Poetry Journal] Staging is empty — no .page elements found. Skipping init.');
        return;
      }

      // Build a fresh PageFlip mount container inside host
      host.innerHTML = '';
      const flipContainer = document.createElement('div');
      flipContainer.style.cssText = 'width:100%;height:100%;';
      host.appendChild(flipContainer);

      // Clone each staged page as a standalone HTML snapshot for page-flip
      stagedPages.forEach((staged) => {
        const fresh = document.createElement('div');
        // Copy className (all Tailwind classes) and data-density attribute
        fresh.className = staged.className;
        const density = staged.getAttribute('data-density');
        if (density) fresh.setAttribute('data-density', density);
        // innerHTML snapshot — Tailwind classes apply from global stylesheet,
        // inline SVGs are copied verbatim, no React reconciler conflict
        fresh.innerHTML = staged.innerHTML;
        flipContainer.appendChild(fresh);
      });

      try {
        const pageDivs = flipContainer.querySelectorAll<HTMLElement>('.page');

        const pageFlip = new PageFlip(flipContainer, {
          width: dimensions.pageW,
          height: dimensions.pageH,
          size: 'fixed',
          minWidth: dimensions.pageW,
          maxWidth: dimensions.pageW,
          minHeight: dimensions.pageH,
          maxHeight: dimensions.pageH,
          drawShadow: true,
          maxShadowOpacity: 0.4,
          showCover: false,
          usePortrait: isMobile,
          startZIndex: 20,
          flippingTime: 600,
          useMouseEvents: true,
          swipeDistance: 25,
          autoSize: false,
        });

        pageFlip.loadFromHTML(pageDivs as unknown as NodeListOf<HTMLElement>);
        pageFlipRef.current = pageFlip;

        pageFlip.on('flip', (e: { data: number }) => {
          const idx = typeof e.data === 'number' ? e.data : 0;
          setCurrentPage(idx);
          playTurn();
        });

        setCurrentPage(0);
        setIsReady(true);
      } catch (err) {
        console.error('[Poetry Journal] PageFlip initialization error:', err);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      if (pageFlipRef.current) {
        try { pageFlipRef.current.destroy(); } catch { /* ignore */ }
        pageFlipRef.current = null;
      }
    };
  // Re-run whenever the set of pages, dimensions, or layout mode changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookPages, dimensions.pageW, dimensions.pageH, isMobile]);

  // ─── Navigation ────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    const pf = pageFlipRef.current;
    if (!pf) return;
    const cur = pf.getCurrentPageIndex();
    const count = pf.getPageCount();
    const atEnd = isMobile ? cur >= count - 1 : cur >= count - 2;
    if (atEnd) return;
    if (pf.getState() === 'read') {
      try { pf.flipNext(); } catch { pf.turnToNextPage(); }
    } else {
      pf.turnToNextPage();
    }
  }, [isMobile]);

  const handlePrev = useCallback(() => {
    const pf = pageFlipRef.current;
    if (!pf) return;
    if (pf.getCurrentPageIndex() <= 0) return;
    if (pf.getState() === 'read') {
      try { pf.flipPrev(); } catch { pf.turnToPrevPage(); }
    } else {
      pf.turnToPrevPage();
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault(); handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault(); handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault(); onCloseBook();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleNext, handlePrev, onCloseBook]);

  // ─── Page Content Renderer ─────────────────────────────────────────────────
  const renderPageContent = (page: CanonicalBookPage) => {
    switch (page.type) {
      case 'cover-title':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full min-h-0 py-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8E4D60] font-sans font-medium mb-2">
              A poem collection
            </span>
            <VintageRoseEmblem size={44} color="#C98598" className="mb-2" />
            <h1 className="font-blackletter text-2xl text-[#4D2531] tracking-wide leading-tight">
              {BOOK_CONFIG.title}
            </h1>
            {BOOK_CONFIG.subtitle && (
              <p className="font-poem italic text-sm text-[#8B737C] mt-2 max-w-[200px]">
                {BOOK_CONFIG.subtitle}
              </p>
            )}
            <OrnamentalDivider className="my-3" color="#C98598" />
            <p className="font-poem text-base text-[#743F4D] font-light tracking-widest">
              {BOOK_CONFIG.author}
            </p>
            <p className="text-[10px] font-sans tracking-[0.2em] text-[#AF99A2] mt-1 shrink-0">
              {BOOK_CONFIG.year}
            </p>
          </div>
        );

      case 'dedication':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full min-h-0 py-2">
            <h2 className="font-blackletter text-xl text-[#743F4D] mb-2">
              {BOOK_CONFIG.dedication.heading}
            </h2>
            <OrnamentalDivider className="mb-3" color="#C98598" />
            <p className="font-poem italic text-sm text-[#392B30] whitespace-pre-wrap leading-relaxed tracking-wide font-light w-full max-w-[280px]">
              {BOOK_CONFIG.dedication.text}
            </p>
            {BOOK_CONFIG.dedication.signature && (
              <p className="font-script text-2xl text-[#8E4D60] mt-6">
                {BOOK_CONFIG.dedication.signature}
              </p>
            )}
          </div>
        );

      case 'poem-start':
      case 'poem-continuation':
        if (!page.poemSegment) return null;
        return <PoemPage segment={page.poemSegment} />;

      case 'closing':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full min-h-0">
            <VintageRoseEmblem size={48} color="#C98598" className="mb-4" />
            <h2 className="font-blackletter text-2xl text-[#743F4D] mb-3">
              {BOOK_CONFIG.closing.heading}
            </h2>
            <OrnamentalDivider className="mb-4" color="#C98598" />
            <p className="font-poem italic text-base text-[#392B30] whitespace-pre-wrap leading-relaxed tracking-wide font-light max-w-[260px]">
              {BOOK_CONFIG.closing.text}
            </p>
            {BOOK_CONFIG.closing.subtext && (
              <p className="font-poem text-xs text-[#8B737C] mt-5 tracking-wider">
                {BOOK_CONFIG.closing.subtext}
              </p>
            )}
          </div>
        );

      case 'blank':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full min-h-0">
            <span className="font-poem italic text-sm text-[#8B737C]">
              ~ Notes from the Margins ~
            </span>
            <OrnamentalDivider className="my-4" color="#C98598" />
            <p className="font-poem italic text-sm text-[#743F4D]/75 leading-relaxed">
              Some thoughts are left unwritten,<br />
              waiting for your ink.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-3 px-2 sm:px-4 w-full select-none">

      {/* ── Off-screen Staging Area ──────────────────────────────────────────
          React fully owns this container. Pages render here with correct
          Tailwind styles + SVGs. This is NOT visibility:hidden (which would
          break layout) — just translated off-screen.
          page-flip NEVER touches this container.
      ──────────────────────────────────────────────────────────────────── */}
      <div
        ref={stagingRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: `${dimensions.pageW}px`,
          height: `${dimensions.pageH}px`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        {bookPages.map((page) => (
          <BookPage
            key={page.id}
            pageNumber={page.pageNumber}
            totalPageCount={totalPages}
            headerTitle={page.headerTitle}
            side={page.side}
            dataDensity="soft"
          >
            {renderPageContent(page)}
          </BookPage>
        ))}
      </div>

      {/* ── Visible Book Spread ───────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center">
        {/* Ambient shadow */}
        <div
          className="absolute -bottom-6 left-6 right-6 h-10 bg-[#4D2531]/20 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Hardcover rim */}
        <div className="relative p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-[#8E4D60] via-[#B06B7E] to-[#743F4D] shadow-book-lg border border-[#DE9EB0]/40">
          {/* Spine ridge (desktop only) */}
          {!isMobile && (
            <div
              className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 z-30 pointer-events-none bg-gradient-to-r from-transparent via-[#2A131A]/25 to-transparent"
              aria-hidden="true"
            />
          )}

          {/* PageFlip host — page-flip mounts its DOM here */}
          <div
            ref={hostRef}
            style={{
              width: `${dimensions.spreadW}px`,
              height: `${dimensions.pageH}px`,
              opacity: isReady ? 1 : 0.01,
              transition: 'opacity 0.4s ease-in',
            }}
            className="relative rounded overflow-hidden"
          />
        </div>
      </div>

      {/* Navigation controls */}
      <PageControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
        onCloseBook={onCloseBook}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isMobile={isMobile}
      />
    </div>
  );
};
