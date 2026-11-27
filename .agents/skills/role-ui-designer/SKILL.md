---
name: role-ui-designer
description: "Use ONLY when the primary task is workbench visual design, responsive panel layout, accessibility, or Russian UI wording/status presentation. Exclude canvas mechanics, geometry, notation semantics, exports, general business logic, test-only tasks, and deployment."
---

# Precision Engineering UI

Read root `AGENTS.md` and `docs/ARCHITECTURE.md` sections 7 and 9. Paths are repository-relative.

## Design Rules

1. Use a 48 px toolbar, collapsible 260 px model explorer, flexible center canvas and 280 px contextual inspector. Add a persistent bottom model status bar that reduces canvas height rather than covering it.
2. Use canvas `#F8FAFC`, panels `#FFFFFF`, 1 px borders `#E2E8F0` and technical accent `#2563EB`. Favor compact, clear engineering controls over decorative effects.
3. Bundle Inter with Cyrillic glyph coverage and font licensing; start at 13 px for UI text and monospace for codes/coordinates. Do not require a runtime font CDN.
4. Localize all app labels, tooltips, menu items, dialogs, validation text, accessible names and report captions in Russian. Preserve user text and notation tokens such as IDEF0 and A-0.
5. Show `Проверка модели…` for pending validation, `Ошибки: N` with violation entries for errors, and `Модель корректна` with a green check only after a complete current-revision check. Use amber `Предупреждения: N` for warnings and an explicit failure/retry state when validation fails.
6. Scope the bar to the entire model, including unopened descendants. Expand it into a scrollable full issue list; make each issue navigate to its diagram and affected object. Never show stale success or hide failures behind a count alone.
7. Collapse side panels into drawers at narrow widths while retaining access to status. Provide keyboard focus, accessible names and severity icons; never communicate validity through color alone.

## Review

Check dense and narrow layouts, long Russian labels, Cyrillic text, keyboard navigation, all status states and issue-list overflow. Keep domain validation and canvas interaction algorithms in their owning layers.
