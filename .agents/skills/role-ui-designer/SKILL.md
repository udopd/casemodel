---
name: role-ui-designer
description: Design and refine the Russian desktop CASE workbench, design tokens, accessibility, and responsive drawers.
---

# UI Designer Role

Use this skill when building or adjusting layout, typography, controls, inspectors, and status indicators.

## Visual & UX Baseline

- **Palette**: Canvas `#F8FAFC`, panels `#FFFFFF`, borders `#E2E8F0`, accent `#2563EB`.
- **Typography**: Bundled local `Inter` with Cyrillic coverage (`13px` base UI size) and local monospace (`JetBrains Mono`) for ICOM codes, node IDs, and diagnostic rule codes. No external font CDN calls.
- **Workbench Layout**:
  - `48px` top toolbar (project/file actions, undo/redo, notation insertion, decomposition, layout, frame toggle, validation, export).
  - Collapsible `260px` left explorer (model hierarchy + issue badges).
  - Flexible center canvas area.
  - `280px` right contextual inspector.
  - Persistent bottom model status bar (reduces canvas height, never overlaps graph content; expands into filterable issue list across the whole model).
- **Responsive & Accessible**: Collapse side panels into drawers on narrow screens while keeping the status bar reachable. Combine color with icons and text for severity (`Проверка модели…`, `Ошибки: N`, `Предупреждения: N`, `Модель корректна`, `Не удалось проверить модель`).
