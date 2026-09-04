declare module 'page-flip' {
  export interface PageFlipOptions {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
  }

  export interface FlipEvent {
    data: number;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, options: PageFlipOptions);
    loadFromHTML(elements: NodeListOf<HTMLElement> | HTMLElement[]): void;
    destroy(): void;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(pageIndex: number, corner?: 'top' | 'bottom'): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    turnToPage(pageIndex: number): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getState(): 'read' | 'user_fold' | 'fold_corner' | 'flipping';
    update(): void;
    on(event: string, callback: (e: FlipEvent) => void): void;
    off(event: string, callback: (e: FlipEvent) => void): void;
  }
}
