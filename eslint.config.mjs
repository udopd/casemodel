import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const CORE_FORBIDDEN_IMPORTS = [
  { name: 'react', message: 'src/core must stay framework-free (no React).' },
  { name: 'react-dom', message: 'src/core must stay framework-free (no React DOM).' },
  { name: 'next', message: 'src/core must stay framework-free (no Next.js).' },
  { name: 'zustand', message: 'src/core must stay state-library-free (no Zustand).' },
  { name: 'zundo', message: 'src/core must stay state-library-free (no Zundo).' },
  { name: 'elkjs', message: 'src/core must inject layout execution via ports (no elkjs import).' },
  { name: 'html-to-image', message: 'src/core must stay DOM/export-library-free.' },
  { name: 'jspdf', message: 'src/core must stay export-library-free (no jsPDF).' },
  { name: 'lucide-react', message: 'src/core must stay UI-library-free.' },
];

const CORE_FORBIDDEN_PATTERNS = [
  { group: ['next/*'], message: 'src/core must not import Next.js modules.' },
  { group: ['@xyflow/*'], message: 'src/core must not import React Flow.' },
  { group: ['node:*'], message: 'src/core must not import Node built-in modules.' },
  {
    group: [
      '@/application/*',
      '@/store/*',
      '@/adapters/*',
      '@/components/*',
      '@/workers/*',
      '@/i18n/*',
      '@/app/*',
    ],
    message: 'src/core cannot depend on outer application, store, adapter, UI, i18n, or app layers.',
  },
];

const CORE_FORBIDDEN_GLOBALS = [
  { name: 'window', message: 'src/core must not access DOM window.' },
  { name: 'document', message: 'src/core must not access DOM document.' },
  { name: 'globalThis', message: 'src/core must not access global environment state.' },
  { name: 'navigator', message: 'src/core must not access browser navigator.' },
  { name: 'localStorage', message: 'src/core must not access browser storage.' },
  { name: 'sessionStorage', message: 'src/core must not access browser storage.' },
  { name: 'indexedDB', message: 'src/core must not access IndexedDB.' },
  { name: 'fetch', message: 'src/core must not perform network I/O.' },
  { name: 'XMLHttpRequest', message: 'src/core must not perform network I/O.' },
  { name: 'WebSocket', message: 'src/core must not perform network I/O.' },
  { name: 'Worker', message: 'src/core must not spawn Workers directly.' },
  { name: 'crypto', message: 'src/core must receive generated IDs via ports.' },
  { name: 'Date', message: 'src/core must receive timestamps via ClockPort.' },
  { name: 'performance', message: 'src/core must not read ambient clocks.' },
  { name: 'setTimeout', message: 'src/core must not schedule timers.' },
  { name: 'setInterval', message: 'src/core must not schedule timers.' },
  { name: 'requestAnimationFrame', message: 'src/core must not access animation frames.' },
  { name: 'process', message: 'src/core must not access process environment.' },
];

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'coverage/**', 'playwright-report/**', 'test-results/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-expect-error': 'allow-with-description',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: CORE_FORBIDDEN_IMPORTS,
          patterns: CORE_FORBIDDEN_PATTERNS,
        },
      ],
      'no-restricted-globals': ['error', ...CORE_FORBIDDEN_GLOBALS],
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'src/core must be deterministic; pass seeds or IDs via ports.',
        },
        {
          object: 'Date',
          property: 'now',
          message: 'src/core must receive timestamps via ClockPort.',
        },
      ],
    },
  },
  {
    files: ['src/core/schema/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: CORE_FORBIDDEN_IMPORTS,
          patterns: [
            ...CORE_FORBIDDEN_PATTERNS,
            {
              group: ['@/core/engine/*', '@/core/validators/*', '@/core/layout/*', '@/core/generators/*', '@/core/ports/*'],
              message: 'src/core/schema may only depend on zod and src/core/schema/*.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/core/ports/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [...CORE_FORBIDDEN_IMPORTS, { name: 'zod', message: 'src/core/ports should depend on core types only.' }],
          patterns: [
            ...CORE_FORBIDDEN_PATTERNS,
            {
              group: ['@/core/engine/*', '@/core/validators/*', '@/core/layout/*', '@/core/generators/*'],
              message: 'src/core/ports may only depend on core schema/common types.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'src/application must not import React.' },
            { name: 'react-dom', message: 'src/application must not import React DOM.' },
            { name: 'next', message: 'src/application must not import Next.js.' },
            { name: 'zustand', message: 'src/application must not import Zustand.' },
            { name: 'zundo', message: 'src/application must not import Zundo.' },
          ],
          patterns: [
            { group: ['next/*'], message: 'src/application must not import Next.js.' },
            { group: ['@xyflow/*'], message: 'src/application must not import React Flow.' },
            {
              group: ['@/store/*', '@/adapters/*', '@/components/*', '@/workers/*', '@/app/*'],
              message: 'src/application may only depend on src/core and injected ports.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/store/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/adapters/*', '@/components/*', '@/app/*'],
              message: 'src/store must not import adapters, UI components, or app composition.',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: 'src/store must not access storage directly.' },
        { name: 'sessionStorage', message: 'src/store must not access storage directly.' },
        { name: 'indexedDB', message: 'src/store must not access IndexedDB directly.' },
        { name: 'document', message: 'src/store must not access DOM directly.' },
      ],
    },
  },
  {
    files: ['src/adapters/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/store/*', '@/components/*', '@/app/*'],
              message: 'src/adapters implements core ports and must not depend on store, components, or app.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/workers/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'src/workers must not import React.' },
            { name: 'react-dom', message: 'src/workers must not import React DOM.' },
            { name: 'next', message: 'src/workers must not import Next.js.' },
          ],
          patterns: [
            { group: ['@/components/*', '@/app/*', '@/store/*'], message: 'src/workers cannot import UI or store.' },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'document', message: 'src/workers must not access DOM document.' },
        { name: 'window', message: 'src/workers must not access DOM window.' },
      ],
    },
  },
  {
    files: ['src/i18n/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/core/engine/*', '@/application/*', '@/store/*', '@/adapters/*', '@/components/*', '@/workers/*', '@/app/*'],
              message: 'src/i18n must stay pure formatting/catalog without domain mutation.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/adapters/*', '@/app/*', '@/application/*', '@/core/engine/*'],
              message:
                'src/components must read state/actions from src/store and domain read types, not adapters, application, or engine.',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: 'Components must not access storage directly.' },
        { name: 'sessionStorage', message: 'Components must not access storage directly.' },
        { name: 'indexedDB', message: 'Components must not access IndexedDB directly.' },
      ],
    },
  },
];

export default eslintConfig;
