import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (global as any).jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: (global as any).jest.fn(),
    removeListener: (global as any).jest.fn(),
    addEventListener: (global as any).jest.fn(),
    removeEventListener: (global as any).jest.fn(),
    dispatchEvent: (global as any).jest.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = (global as any).jest.fn();