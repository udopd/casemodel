---
name: role-qa-engineer
description: "Use ONLY when the primary task is test planning, test-only implementation, verification, or regression diagnosis without a production-code change. Exclude implementation tasks with their own accompanying tests, architecture decisions, visual design, deployment, and Git operations."
---

# Verification and Regression Testing

Read root `AGENTS.md` and `docs/ARCHITECTURE.md` section 14; consult the relevant rule section only for the scenario under test. Paths are repository-relative.

## Strategy

1. Allocate roughly 70% of test effort to Vitest unit/integration checks and 30% to Playwright workflows. Treat this as a balance, not a line-coverage threshold or quota of test counts.
2. Test happy paths and permissive violations: wrong ICOM sides, direct DFD non-process flows and direct IDEF3 UOW branches remain stored and produce diagnostics. Distinguish these from structural corruption that must fail safely.
3. Cover stable IDs, decomposition/tunnels, atomic undo, migration/round trips, storage failure recovery and stale asynchronous result rejection. Use deterministic fixtures and focused invariant assertions rather than mirroring implementation details.
4. Use `data-testid` selectors only for locating app elements in Playwright (`getByTestId` or equivalent test-ID lookup). Do not couple locators to CSS, XPath, text, roles or generated class names. Assertions may still verify visible Russian text and accessibility attributes.
5. Install `page.on('pageerror')` guards before navigation for each page/popup, collect uncaught errors and fail the test on any occurrence. Do not swallow errors or use arbitrary sleeps as synchronization.
6. Test production static output, not only the development server. Check issue navigation across hidden diagrams, green-status freshness, full-diagram exports, Cyrillic, keyboard workflows and the representative 20-diagram fixture.
7. Record exact commands, outcomes and missing prerequisites. Run all five root verification commands once implementation exists. For instruction-only work without package.json, validate files/frontmatter/diffs instead and mark app checks unavailable.

## Deliverable

Report reproducible failures, relevant fixtures and acceptance gaps. Keep suggestions separate from verified results. Do not change production behavior under a test-only task without adjusting the task scope.
