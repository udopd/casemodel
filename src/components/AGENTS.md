# Workbench & Canvas Instructions (`src/components/`)

Code inside `src/components/` renders the Russian CASE workbench and projects domain state into React Flow and export views:

- **Russian UI**: All labels, tooltips, dialogs, accessibility names, and error messages must be in Russian via `src/i18n/`. Preserve user-authored model text verbatim.
- **Projection Only**: React Flow nodes/edges (`@xyflow/react`) are disposable visual projections derived from the canonical domain model, never the source of truth.
- **Design Tokens**: Canvas `#F8FAFC`, panels `#FFFFFF`, borders `#E2E8F0`, accent `#2563EB`, bundled Inter Cyrillic UI font (`13px` base), monospace for technical codes. Never rely on color alone for severity or focus states.
- **Layout Geometry**: `48px` top toolbar, collapsible `260px` explorer, flexible canvas, `280px` inspector, and persistent bottom model status bar that reduces canvas height rather than overlapping content. Narrow screens collapse side panels into drawers.
- **Boundary Rules**: Read from `src/store/` and domain read types; do not import `src/adapters/` directly or touch `localStorage` / file APIs from components.
- **Testability**: Maintain stable `data-testid` attributes for interactive workbench controls and E2E selectors.

## Scoped Skills

Read the matching skill before implementing canvas interactions or export rendering:

- `src/components/.agents/skills/react-flow-canvas/SKILL.md`
- `src/components/.agents/skills/export-and-reporting/SKILL.md`
