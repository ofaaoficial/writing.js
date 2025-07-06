// Test setup configuration for Writing.js v2.0

import { beforeEach, afterEach, vi, expect } from 'vitest';

// Global test setup
beforeEach(() => {
  // Clear all mocks
  vi.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Mock performance.now for consistent timing in tests
  const mockPerformanceNow = vi.fn(() => Date.now());
  vi.stubGlobal('performance', { 
    now: mockPerformanceNow,
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000
    }
  });
  
  // Mock requestAnimationFrame and cancelAnimationFrame
  let frameId = 0;
  const mockRAF = vi.fn((callback: FrameRequestCallback) => {
    frameId++;
    setTimeout(() => callback(performance.now()), 16);
    return frameId;
  });
  const mockCAF = vi.fn((id: number) => {
    // Mock implementation
  });
  
  vi.stubGlobal('requestAnimationFrame', mockRAF);
  vi.stubGlobal('cancelAnimationFrame', mockCAF);
  
  // Mock IntersectionObserver
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.prototype.observe = vi.fn();
  mockIntersectionObserver.prototype.unobserve = vi.fn();
  mockIntersectionObserver.prototype.disconnect = vi.fn();
  vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);
  
  // Mock AudioContext
  const mockAudioContext = vi.fn(() => ({
    createOscillator: vi.fn(() => ({
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { value: 440 },
      type: 'sine'
    })),
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        value: 0.5
      }
    })),
    createBufferSource: vi.fn(() => ({
      connect: vi.fn(),
      start: vi.fn(),
      buffer: null,
      playbackRate: { value: 1 }
    })),
    decodeAudioData: vi.fn(() => Promise.resolve(new ArrayBuffer(1024))),
    destination: {},
    state: 'running',
    close: vi.fn(() => Promise.resolve())
  }));
  
  vi.stubGlobal('AudioContext', mockAudioContext);
  vi.stubGlobal('webkitAudioContext', mockAudioContext);
  
  // Mock fetch for audio loading
  global.fetch = vi.fn(() =>
    Promise.resolve({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
      ok: true,
      status: 200
    } as Response)
  );
});

afterEach(() => {
  // Cleanup after each test
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  
  // Clear DOM
  document.body.innerHTML = '';
  
  // Clear any remaining timers
  vi.clearAllTimers();
});

// Custom matchers and utilities
expect.extend({
  toBeValidElement(received: unknown) {
    const pass = received instanceof HTMLElement;
    return {
      message: () => `expected ${received} to be a valid HTMLElement`,
      pass
    };
  },
  
  toHaveTextContent(received: HTMLElement, expected: string) {
    const pass = received.textContent === expected;
    return {
      message: () => 
        `expected element to have text content "${expected}" but got "${received.textContent}"`,
      pass
    };
  },
  
  toBeAnimating(received: any) {
    const pass = received && typeof received.isAnimating === 'function' && received.isAnimating();
    return {
      message: () => `expected writing instance to be animating`,
      pass
    };
  }
});

// Test utilities
export const createTestElement = (id = 'test-element'): HTMLElement => {
  const element = document.createElement('div');
  element.id = id;
  document.body.appendChild(element);
  return element;
};

export const waitForNextTick = (): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const waitForAnimation = (duration = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

export const mockElement = (tag = 'div', attributes: Record<string, string> = {}): HTMLElement => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

// Extend global types
declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      toBeValidElement(): any;
      toHaveTextContent(expected: string): any;
      toBeAnimating(): any;
    }
  }
}