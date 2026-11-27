# TASKLIST: Start Parallel Development

Design: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Rules: [AGENTS.md](AGENTS.md).

## Minimum Shared Preparation

- [x] S0 — Architecture, AGENTS.md and 12 scoped skills are in place.
- [ ] S1 — Bootstrap Next.js/React, strict TypeScript, static export, dependencies and layer directories; enforce import boundaries and Russian UI conventions.
- [ ] S2 — Agree minimal shared types: versioned project, diagram, node, relation, endpoint, diagnostic, command/result; define storage/layout/export ports and a drawing-scene contract. Add a small shared fixture. Implementations can follow in parallel.
- [ ] S3 — Run typecheck, lint, build, a focused contract unit test and a static-page E2E smoke test through the five required npm commands. No complete modeling workflow is required yet.
- [ ] S4 — Assign disjoint paths and acceptance criteria to feature streams; appoint one owner for shared contracts, dependencies and integration. The parallel-work gate is ready after S1-S4.

Do not wait for working persistence, Undo/Redo, decomposition, the router, a complete editor, exports or CI/CD before splitting feature work. Develop them against the agreed interfaces. Keep the full quality gates for integrated features and releases.

## Parallel Work

| Stream | Owned implementation |
| --- | --- |
| Commands, state and persistence | Core command handlers, application use cases, Zustand/zundo, storage adapters |
| Notation semantics | IDEF0, DFD and IDEF3 engines/validators; split further by notation if useful |
| Geometry | Placement, port allocation, orthogonal router and ELK adapter |
| Editor UI | Workbench, React Flow nodes/edges, inspector, Russian messages and model status bar |
| Exports | JSON file orchestration, PNG/SVG/PDF generators and adapters |
| Delivery | CI, Docker/Nginx and deployment configuration |

Before assigning work, replace broad ownership above with exact paths. One integrator owns shared schemas/ports, package/lock files and composition wiring. Coordinate contract changes through that owner. Each stream can use typed fixtures to develop independently; verify real integrations as dependencies become available. Routing acceptance still requires the fixed-position prototype; unrelated canvas work can proceed meanwhile.

## Resume

- Current: documentation and skills ready; no application scaffold.
- Next: S1, bootstrap the shared skeleton when implementation is requested.
- Checks: documentation only; npm checks are unavailable until S1.
- Blockers / active workers: none; parallel gate not ready.
- Git: inspect current status; commits require explicit user approval.

Update checked items and these five resume lines after each work session. Mark only verified work complete. Do not expand this file into a full implementation backlog; detailed requirements stay in the architecture and scoped skills. Starting parallel agents requires the user's instruction.
