import { Poem } from './poem';

export type CanonicalPageType = 
  | 'cover-title'
  | 'dedication'
  | 'poem-start'
  | 'poem-continuation'
  | 'closing'
  | 'blank';

export interface PoemPageSegment {
  poemId: string;
  poem: Poem;
  segmentIndex: number;
  totalSegments: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  lines: string[];
}

export interface CanonicalBookPage {
  id: string; // Stable, unique key: e.g. 'page-title', 'page-dedication', 'poem-123-part-0'
  pageNumber: number; // 1-based sequential physical page number
  type: CanonicalPageType;
  headerTitle: string;
  side: 'left' | 'right';
  poemSegment?: PoemPageSegment;
}
