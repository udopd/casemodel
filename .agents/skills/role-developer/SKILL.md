---
name: role-developer
description: "Use ONLY when the primary task is general application/store/persistence or non-canvas component implementation not assigned to another skill. Exclude architecture decisions, notation rules, geometry, UI design/copy, canvas behavior, exports, test-only work, deployment, and Git operations."
---

# General Implementation

Read root `AGENTS.md` and the relevant parts of `docs/ARCHITECTURE.md` sections 2, 4, 5 and 10. Paths are repository-relative.

## Workflow

1. Use TypeScript `strict: true` with zero explicit/implicit `any` and no `@ts-ignore`. Treat external input and caught errors as `unknown`; narrow through Zod or type guards.
2. Return discriminated result/error unions and handle variants exhaustively. Keep library exceptions behind adapters, domain diagnostics as codes, and user-visible error formatting in the Russian presentation layer.
3. Keep domain functions pure and deterministic with explicit IDs, timestamps, seeds and measurements. Do not call browser or random/time APIs from core.
4. Route changes through atomic commands. Keep UI session data and derived caches separate from the canonical document; group one gesture into one zundo history entry.
5. Subscribe to atomic Zustand selectors; avoid broad store subscriptions and unstable object selections. Keep callbacks/props stable. Use `React.memo` on custom nodes/edges if a general change touches their shared integration; route dedicated canvas work to its own skill.
6. Use injected ports for persistence and external work. Confirm writes before showing saved status, retain recovery data on failure, and discard asynchronous results for obsolete revisions/projects.
7. Preserve semantically invalid drafts. Do not tighten schemas or connection guards to erase notation-invalid content. Reject structural corruption separately.

## Completion

Keep changes within the owning layer, add meaningful regression checks with the implementation, and run the root verification commands when the app exists. Describe changed behavior, evidence and limitations; do not introduce scaffolding for instruction-only tasks.
