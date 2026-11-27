# Core Domain Instructions (`src/core/`)

All code inside `src/core/` must remain strictly pure and deterministic:

- Allowed dependencies: `zod` (inside `src/core/schema/`) and pure internal modules within `src/core/`.
- Forbidden dependencies: `react`, `react-dom`, `next`, `@xyflow/*`, `zustand`, `zundo`, `elkjs`, `html-to-image`, `jspdf`, Node built-ins (`node:*`), browser DOM/Storage/Worker APIs, and any module in `src/application/`, `src/store/`, `src/adapters/`, `src/components/`, `src/workers/`, `src/i18n/`, or `src/app/`.
- Never call `Date.now()`, `new Date()`, `Math.random()`, or `crypto.randomUUID()` inside `src/core/`. Accept IDs, timestamps, seeds, and text measurements via command parameters or `src/core/ports/`.
- Validators in `src/core/validators/` emit stable rule IDs, severity, subject references, revision, message keys, and parameters — never Russian prose.
- Notation-invalid connections must remain structurally representable and serializable; distinguish structural corruption from semantic notation errors.

## Scoped Skills

Read the matching skill before modifying domain rules or layout algorithms:

- `src/core/.agents/skills/notation-idef0/SKILL.md`
- `src/core/.agents/skills/notation-dfd/SKILL.md`
- `src/core/.agents/skills/notation-idef3/SKILL.md`
- `src/core/.agents/skills/graph-layout-routing/SKILL.md`
