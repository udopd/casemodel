# TASKLIST: Start Parallel Development

Design and rules are in [the architecture baseline](docs/ARCHITECTURE.md), [the Phase 1 contracts](docs/CONTRACTS.md) and [AGENTS.md](AGENTS.md).

## Minimum Shared Preparation

- [x] S0 — Architecture, AGENTS.md and 12 scoped skills are in place.
- [ ] S1 — Bootstrap Next.js/React, strict TypeScript, static export, dependencies and layer directories; enforce import boundaries and Russian UI conventions.
- [x] S2 design — Agree v1 identity, ownership, document shape, command/history, check, repository, geometry and scene contracts in `docs/CONTRACTS.md`.
- [ ] S2 implementation — Encode the agreed Zod schemas, structural checks, TypeScript contracts and ports. Add the small shared v1 fixture described in the contract handoff.
- [ ] S3 — Run typecheck, lint, build, a focused contract unit test and a static-page E2E smoke test through the five required npm commands. No complete modeling workflow is required yet.
- [x] S4 design — Reserve disjoint paths, outcomes, dependencies and acceptance criteria in the [ownership table](docs/CONTRACTS.md#3-ownership-and-integration). The integrator owns common schemas, ports, dependencies and wiring.
- [ ] S4 parallel-work gate — Confirm S1, executable S2 and S3 on the actual checkout before releasing the streams.

Do not wait for working persistence, Undo/Redo, decomposition, the router, a complete editor, exports or CI/CD before splitting feature work. Develop them against the agreed interfaces. Keep the full quality gates for integrated features and releases.

## Resume

- S2 design and S4 ownership are documented. The S2 review fixed the action and export types, job replies and deletion policy. The checkout contains documentation and instructions only.
- Next task for the executing model is S1. Create a buildable static Next.js/React shell with strict TypeScript, layer boundaries, Russian UI conventions and the five verification scripts. Then use the v1 contract for S2 implementation.
- Verification covers instruction paths, skill frontmatter, document links and the documentation diff. Application checks await the package manifest and scaffold.
- The parallel gate awaits S1, S2 implementation and S3. No feature workers are active.
- Git changes require review and explicit commit approval. Recheck status on resume.

Update checked items and these five resume lines after each work session. Mark only verified work complete. Do not expand this file into a full implementation backlog; detailed requirements stay in the architecture and scoped skills. Starting parallel agents requires the user's instruction.
