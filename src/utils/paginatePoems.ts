import { Poem } from '../types/poem';
import { CanonicalBookPage, PoemPageSegment } from '../types/bookPages';
import { BOOK_CONFIG } from '../config/book';

interface PageDimensions {
  pageW: number;
  pageH: number;
}

/**
 * Estimate the visual pixel height of a poem line at text-sm (14px) with
 * leading-[1.85], accounting for long-line wrapping.
 *
 * Layout assumptions (matching BookPage.tsx + PoemPage.tsx):
 *   - Page main area padding: px-10 (40px each side) → column ≈ pageW - 80px
 *   - Font: Cormorant Garamond 14px, ~7.5px average char width
 *   - Line-height: 14 × 1.85 ≈ 26px per rendered row
 *   - Empty line (stanza break): 20px gap
 */
function estimateLineHeight(line: string, columnWidth: number): number {
  if (line.trim() === '') return 20; // stanza-break gap

  const charsPerRow = Math.max(Math.floor(columnWidth / 7.5), 20);
  const wrappedRows = Math.max(1, Math.ceil(line.length / charsPerRow));
  return wrappedRows * 26; // 14px × 1.85 ≈ 26px per visual row
}

/**
 * Paginate one poem across one or more physical pages.
 *
 * Available content height per page (matching new BookPage layout):
 *   pageH
 *   - header zone  : pt-8 (32) + text (~14px) + pb-1 (4)  ≈ 50px
 *   - footer zone  : pb-8 (32) + text (~12px)             ≈ 44px
 *   - main padding : py-3 top + py-3 bottom               ≈ 24px
 *   ─────────────────────────────────────────────────────────────
 *   usable for PoemPage content ≈ pageH - 118px
 *
 * First-page PoemPage header overhead (shrink-0 section):
 *   - Title (text-2xl ≈ 24px, leading-tight ≈ 30px)       ≈ 32px
 *   - Subtitle (text-xs ≈ 12px + mt-1)                    ≈ 16px
 *   - Dedication (text-xs ≈ 12px + mt-0.5)                ≈ 16px
 *   - OrnamentalDivider + mt-2 mb-0.5                     ≈ 24px
 *   - mb-2 outer wrapper                                   ≈  8px
 *
 * Continuation-page header overhead:
 *   - "— continued —" text + hairline                     ≈ 20px
 *   - mb-2 outer wrapper                                   ≈  8px
 */
export function paginatePoem(poem: Poem, dimensions: PageDimensions): PoemPageSegment[] {
  // Usable pixel budget for poem content (PoemPage flex-1 area)
  const pageContentH = Math.max(dimensions.pageH - 118, 280);
  const columnWidth  = Math.max(dimensions.pageW - 80, 180); // px-10 both sides

  // Header overheads (shrink-0 sections, never scroll)
  const firstHeaderH = 32                            // title
    + (poem.subtitle   ? 16 : 0)
    + (poem.dedication ? 16 : 0)
    + 24                                             // divider + margins
    + 8;                                             // mb-2

  const contHeaderH  = 28;                           // "continued" + mb-2

  // Body budgets (what remains for the flex-1 poem text area)
  const firstBodyBudget = Math.max(pageContentH - firstHeaderH - (poem.poem_date ? 18 : 0), 100);
  const contBodyBudget  = Math.max(pageContentH - contHeaderH  - (poem.poem_date ? 18 : 0), 100);

  // Split body into original lines
  const allLines = poem.body.split('\n');

  // Group consecutive non-empty lines into stanzas; empty lines are stanza separators
  const stanzas: string[][] = [];
  let current: string[] = [];
  for (const line of allLines) {
    if (line.trim() === '') {
      if (current.length > 0) { stanzas.push(current); current = []; }
      stanzas.push(['']); // empty-line placeholder
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) stanzas.push(current);

  // Walk stanzas, filling pages
  const segments: string[][] = [];
  let segLines: string[]   = [];
  let segH    : number     = 0;
  let isFirst  = true;

  const flush = () => {
    // trim trailing blank lines
    while (segLines.length > 0 && segLines[segLines.length - 1].trim() === '') segLines.pop();
    if (segLines.length > 0) segments.push(segLines);
    segLines = [];
    segH     = 0;
    isFirst  = false;
  };

  for (const stanza of stanzas) {
    const budget     = isFirst ? firstBodyBudget : contBodyBudget;
    const stanzaH    = stanza.reduce((acc, l) => acc + estimateLineHeight(l, columnWidth), 0);

    if (stanzaH <= budget - segH || segLines.length === 0) {
      // Fits on this page
      segLines.push(...stanza);
      segH += stanzaH;
    } else {
      // Doesn't fit — close current page, start fresh
      flush();
      const freshBudget = contBodyBudget;

      if (stanzaH <= freshBudget) {
        // Whole stanza fits on next page
        segLines.push(...stanza);
        segH += stanzaH;
      } else {
        // Stanza is huge: split line-by-line
        for (const line of stanza) {
          const lH = estimateLineHeight(line, columnWidth);
          if (segH + lH > freshBudget && segLines.length > 0) flush();
          segLines.push(line);
          segH += lH;
        }
      }
    }
  }
  flush();

  // Guarantee at least one segment even for empty poems
  if (segments.length === 0) segments.push(['']);

  const totalSegments = segments.length;
  return segments.map((lines, index) => ({
    poemId: poem.id,
    poem,
    segmentIndex: index,
    totalSegments,
    isFirstPage: index === 0,
    isLastPage:  index === totalSegments - 1,
    lines,
  }));
}

/**
 * Build the single canonical array of physical book pages.
 */
export function buildCanonicalBookPages(
  poems: Poem[],
  dimensions: PageDimensions,
  isMobile: boolean
): CanonicalBookPage[] {
  const pages: CanonicalBookPage[] = [];
  let pageNum = 1;

  // 1. Title / Frontispiece
  pages.push({
    id: 'page-title',
    pageNumber: pageNum++,
    type: 'cover-title',
    headerTitle: BOOK_CONFIG.title,
    side: 'left',
  });

  // 2. Dedication
  pages.push({
    id: 'page-dedication',
    pageNumber: pageNum++,
    type: 'dedication',
    headerTitle: BOOK_CONFIG.dedication.heading,
    side: 'right',
  });

  // Sort poems by order_index, then created_at
  const sorted = [...poems].sort((a, b) => {
    if (a.order_index !== b.order_index) return a.order_index - b.order_index;
    return (a.created_at || '').localeCompare(b.created_at || '');
  });

  // Graceful empty state
  const toRender = sorted.length > 0 ? sorted : [{
    id: 'empty-notice',
    title: 'Silence',
    subtitle: 'in the quiet room',
    body: 'The pages are waiting for words.\n\nCome write with me\nwhen the night falls.',
    dedication: 'For the unwritten',
    poem_date: 'Tonight',
    order_index: 0,
  }];

  // 3. Poem pages
  for (const poem of toRender) {
    const segs = paginatePoem(poem, dimensions);
    for (const seg of segs) {
      pages.push({
        id: `poem-${poem.id}-part-${seg.segmentIndex}`,
        pageNumber: pageNum,
        type: seg.isFirstPage ? 'poem-start' : 'poem-continuation',
        headerTitle: seg.isFirstPage ? poem.title : `${poem.title} — cont.`,
        side: pageNum % 2 === 1 ? 'left' : 'right',
        poemSegment: seg,
      });
      pageNum++;
    }
  }

  // 4. Closing / Epilogue
  pages.push({
    id: 'page-closing',
    pageNumber: pageNum,
    type: 'closing',
    headerTitle: BOOK_CONFIG.closing.heading,
    side: pageNum % 2 === 1 ? 'left' : 'right',
  });
  pageNum++;

  // 5. Balance to even page count for desktop two-page spread
  if (!isMobile && pages.length % 2 !== 0) {
    pages.push({
      id: 'page-blank-notes',
      pageNumber: pageNum,
      type: 'blank',
      headerTitle: 'Notes',
      side: 'right',
    });
  }

  return pages;
}
