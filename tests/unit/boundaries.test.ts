import { describe, expect, it } from 'vitest';
import { checkSourceTree } from '../../scripts/check-boundaries.mjs';

describe('architecture import boundaries and purity', () => {
  it('passes across all files in src/', () => {
    const violations = checkSourceTree();
    expect(violations).toEqual([]);
  });

  it('rejects React or adapter imports inside src/core/', () => {
    const violations = checkSourceTree({
      filesContent: {
        'core/engine/illegal.ts': `
          import React from 'react';
          import { browserClockPort } from '@/adapters/runtime/browser-ports';
          export const x = { React, browserClockPort };
        `,
      },
    });
    expect(violations.length).toBeGreaterThanOrEqual(2);
    expect(violations.some((msg) => msg.includes('react'))).toBe(true);
    expect(violations.some((msg) => msg.includes('adapters'))).toBe(true);
  });

  it('rejects ambient globals and random/clock calls in src/core/ while allowing local parameters named document', () => {
    const badViolations = checkSourceTree({
      filesContent: {
        'core/validators/impure.ts': `
          export function bad() {
            return window.location.href + String(Date.now()) + String(Math.random());
          }
        `,
      },
    });
    expect(badViolations.some((msg) => msg.includes('"window"'))).toBe(true);
    expect(badViolations.some((msg) => msg.includes('"Date"'))).toBe(true);
    expect(badViolations.some((msg) => msg.includes('Math.random()'))).toBe(true);

    const safeViolations = checkSourceTree({
      filesContent: {
        'core/validators/pure-param.ts': `
          export function inspectDocument(document: { readonly revision: number }): number {
            return document.revision;
          }
        `,
      },
    });
    expect(safeViolations).toEqual([]);
  });

  it('enforces core/schema -> core/engine isolation and outer layer rules', () => {
    const violations = checkSourceTree({
      filesContent: {
        'core/schema/process/bad.ts': `import { createBootstrapDocument } from '@/core/engine/shell'; export const y = createBootstrapDocument;`,
        'application/bad.ts': `import { create } from 'zustand'; export const z = create;`,
        'store/bad.ts': `import { browserClockPort } from '@/adapters/runtime/browser-ports'; export const c = browserClockPort;`,
        'components/bad.tsx': `import { browserClockPort } from '@/adapters/runtime/browser-ports'; export const c = browserClockPort;`,
        'workers/bad.ts': `import React from 'react'; export const r = React;`,
      },
    });
    expect(violations).toHaveLength(5);
  });

  it('forbids explicit any and @ts-ignore across src/', () => {
    const violations = checkSourceTree({
      filesContent: {
        'application/typed.ts': `
          // @ts-ignore
          export const badValue: any = 1;
        `,
      },
    });
    expect(violations.some((msg) => msg.includes('@ts-ignore'))).toBe(true);
    expect(violations.some((msg) => msg.includes('explicit any'))).toBe(true);
  });
});
