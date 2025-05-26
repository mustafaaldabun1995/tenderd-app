import '@testing-library/jest-dom'

if (!globalThis.IntersectionObserver) {
  ;(globalThis as any).IntersectionObserver = class {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }
}

if (!globalThis.ResizeObserver) {
  ;(globalThis as any).ResizeObserver = class {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }
}

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  })
} 