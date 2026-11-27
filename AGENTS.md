# Project Context

This repository is part of casemodel, a local-first web CASE platform. See `docs/ARCHITECTURE.md` for the architecture baseline and product requirements.

## Scope Rules

- **Phase 1**: Process modeling (`IDEF0`, Gane & Sarson `DFD`, `IDEF3` process flow descriptions) with target qualification up to 20 diagrams.
- **Root Restriction**: Every process model starts with `IDEF0` (`A-0` context diagram and `A0` activity). `DFD` and `IDEF3` are only created via decomposition inside the `IDEF0` hierarchy, never as independent root models.
- **Permissive Editing**: Users may create notation-invalid connections. Retain and serialize them; report diagnostics in the persistent model status bar instead of blocking the gesture.
- **Local-First Boundary**: No built-in AI, LLM calls, model server, account backend, API routes, Server Actions, or collaborative editing service. Static output is served from `/out`.
- **Phase 2 Discipline**: Reserve `src/core/schema/data/` and `src/core/schema/traceability/` namespaces only. Do not ship nonfunctional ERwin, SQL, or CRUD placeholders in Phase 1.

## Architecture Boundaries

Use one statically exported Next.js App Router application (`output: 'export'`) with a modular, pure domain core:

- `src/core/` (`schema/`, `engine/`, `validators/`, `layout/`, `generators/`, `ports/`): Pure TypeScript and Zod only. **Forbidden**: `react`, `react-dom`, `next`, `@xyflow/*`, `zustand`, `zundo`, `elkjs`, `html-to-image`, `jspdf`, DOM/Storage/Worker/network/filesystem APIs, global clocks (`Date.now()`, `new Date()`), random IDs (`crypto`, `Math.random()`), and translated Russian UI strings. Inject IDs, timestamps, seeds, and text measurements via ports.
- `src/application/`: Orchestrates commands, validation scheduling, and import/export via core and injected ports. **Forbidden**: `react`, `react-dom`, `next`, `@xyflow/*`, `zustand`, `zundo`, `@/store/*`, `@/adapters/*`, `@/components/*`.
- `src/store/`: Zustand + zundo editor state and bounded command history. **Forbidden**: direct storage/file/DOM APIs or importing `@/adapters/*` and `@/components/*`.
- `src/adapters/`: Browser/library adapters (`LocalStorage`, File APIs, `elkjs`, `html-to-image`, `jsPDF`, text measurement, worker transport). Implements `src/core/ports/`. Never imported by `src/core/`.
- `src/workers/`: Web worker entry points (`core` + relevant adapters). **Forbidden**: `react`, `react-dom`, `document`, `window`, `@/components/*`.
- `src/i18n/`: Russian UI message catalog and diagnostic formatting. No domain mutation.
- `src/components/`: Russian workbench UI, inspectors, export views, and React Flow projection (`@xyflow/react` nodes/edges are projections, never the persisted model).
- `src/app/`: Outermost Next.js composition root wiring adapters, application use cases, store, and UI.

## Language & Typing Rules

- **Russian**: All user-facing interface labels, tooltips, dialogs, validation diagnostics, and reports.
- **English**: Source identifiers, code comments, engineering docs (`docs/`), agent instructions, and commit messages. User-authored model content is preserved verbatim.
- **Strict TypeScript**: Explicit or implicit `any` and `@ts-ignore` / `@ts-nocheck` are forbidden across maintained code. Domain objects must never contain JSX, React Flow handles, callbacks, DOM nodes, or HTML.

## Verification Commands

Run all mandatory checks before proposing completion:

- `npm run typecheck` — strict TypeScript check (`tsc --noEmit`)
- `npm run lint` — ESLint (including strict typing and import-boundary rules) plus pure boundary verification (`npm run check:boundaries`)
- `npm run test:unit` — Vitest unit and domain/boundary tests
- `npm run build` — Next.js static export to `out/`
- `npm run test:e2e` — Playwright browser verification against the production static output

## Agent Instructions & Skill Index

Skills remain canonical in one location without duplicated copies:

- Root role & delivery skills in `.agents/skills/` (`.claude/skills` is a relative symlink to `../.agents/skills`; on Windows without Developer Mode / `core.symlinks=true`, Git checks it out as a pointer file while Linux/CI resolves the symlink):
  - `role-architect` (`.agents/skills/role-architect/SKILL.md`)
  - `role-developer` (`.agents/skills/role-developer/SKILL.md`)
  - `role-ui-designer` (`.agents/skills/role-ui-designer/SKILL.md`)
  - `role-qa-engineer` (`.agents/skills/role-qa-engineer/SKILL.md`)
  - `devops-cicd` (`.agents/skills/devops-cicd/SKILL.md`)
- Domain core & notation skills in `src/core/.agents/skills/` (indexed by `src/core/AGENTS.md`):
  - `notation-idef0` (`src/core/.agents/skills/notation-idef0/SKILL.md`)
  - `notation-dfd` (`src/core/.agents/skills/notation-dfd/SKILL.md`)
  - `notation-idef3` (`src/core/.agents/skills/notation-idef3/SKILL.md`)
  - `graph-layout-routing` (`src/core/.agents/skills/graph-layout-routing/SKILL.md`)
- Presentation & export skills in `src/components/.agents/skills/` (indexed by `src/components/AGENTS.md`):
  - `react-flow-canvas` (`src/components/.agents/skills/react-flow-canvas/SKILL.md`)
  - `export-and-reporting` (`src/components/.agents/skills/export-and-reporting/SKILL.md`)

## Git Conventions

- Use the custom commit message format `username__branch__commit-name__DDMM` instead of Conventional Commits.
- Separate the four parts with double underscores. Use a concise English kebab-case commit name.
- Use the GitHub username (`udopd` for this project) and the current branch name. Replace slashes in branch names with hyphens in the commit message.
- Format the commit date as two-digit day followed by two-digit month, without a year, using the user's timezone (Europe/Moscow).
- Example: `udopd__main__architecture-init__2711`.
- After completing work, summarize the changes and propose a commit message.
- Create a commit only after the user explicitly approves it. Completion of the work or a general request to make changes does not constitute approval to commit.
- Until approval is received, leave the changes uncommitted.
