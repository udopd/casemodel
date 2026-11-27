import type { ClockPort, IdGeneratorPort } from '@/core/ports/runtime';

/**
 * Browser clock implementation injected at the application boundary.
 */
export const browserClockPort: ClockPort = {
  nowIso(): string {
    return new Date().toISOString();
  },
};

/**
 * Deterministic-prefix browser ID generator using Web Crypto where available.
 */
export const browserIdGeneratorPort: IdGeneratorPort = {
  nextId(prefix: string): string {
    if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
      return `${prefix}_${globalThis.crypto.randomUUID()}`;
    }
    return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
  },
};
