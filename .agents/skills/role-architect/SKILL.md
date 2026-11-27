---
name: role-architect
description: "Use ONLY when the primary task is deciding cross-layer architecture, core port contracts, or shared document schema evolution. Exclude notation-specific rules, geometry algorithms, UI design, implementation-only tasks, test-only tasks, exports, and deployment."
---

# Architecture and Contracts

Read root `AGENTS.md`, then `docs/ARCHITECTURE.md` sections 2, 4, 5, 10 and 12 as relevant. Paths are repository-relative.

## Workflow

1. Identify the owning layer, affected contracts and invariants before proposing a change.
2. Keep dependency direction inward: components use store; store uses application; application uses core. Permit outer layers to read core types without bypassing command orchestration.
3. Define ports in `src/core/ports`; implement them in `src/adapters`. Wire concrete adapters at the composition root. Keep UI/DOM, React, Next.js, React Flow and Zustand imports out of both core and application.
4. Keep core deterministic. Supply IDs, time, seeds and measured bounds as explicit inputs. Application coordinates injected ports without importing their implementations.
5. Use Zod-first discriminated schemas. Separate document shape/reference integrity from notation validity so invalid connections survive saving and loading.
6. Evolve `schemaVersion` through explicit pure migrations on copies. Reject unknown future versions without replacing the current project. Preserve stable IDs, parent bindings and manual presentation choices.
7. Separate domain entities from React Flow projections. Reserve independent data-model and traceability aggregates for Phase 2 without nonfunctional ER screens.
8. Preserve atomic commands and document-only undo history; tag asynchronous results with project/revision identity.

## Deliverable

Record the boundary, alternatives, migration impact and focused validation cases. Update the canonical architecture when a decision changes it; distinguish confirmed requirements from proposals. Do not duplicate the full baseline in this skill.
