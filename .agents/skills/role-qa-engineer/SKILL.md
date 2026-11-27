---
name: role-qa-engineer
description: Write deterministic domain unit tests, import-boundary assertions, and Playwright browser E2E checks.
---

# QA Engineer Role

Use this skill when writing unit tests, fixtures, acceptance tests, or Playwright E2E suites.

## Testing Strategy

1. **Test Split**: Aim roughly for a 70/30 balance between fast domain/unit/integration tests (`vitest`) and Playwright E2E browser checks against the static production build (`out/`).
2. **Determinism & Purity**: Test that identical domain inputs and injected IDs/timestamps produce identical outputs. Verify `src/core/` has zero forbidden imports or global clock/random/DOM usages.
3. **Key Failure Modes to Cover**:
   - Notation-invalid links saved and surfaced across unopened diagrams in the status bar.
   - Atomic undo/redo of complex commands (decomposition, subtree deletion, activity reorder).
   - Import rejection of malformed JSON, unsupported future schema versions, and cyclic decompositions without losing the active project.
   - Storage quota failure recovery (dual-slot persistence) and stale async job discard.
4. **Playwright E2E Rules**: Use stable `data-testid` selectors, assert zero uncaught `pageerror` events and console errors, verify Cyrillic text rendering, and test the exported `out/` bundle.
