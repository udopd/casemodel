---
name: role-architect
description: Maintain casemodel layer boundaries, canonical document contracts, ADRs, and delivery stage gates.
---

# Architect Role

Use this skill when proposing structural changes, schema evolutions, new dependencies, or stage-gate decisions.

## Core Principles

1. **Single Modular App**: Keep one statically exported Next.js application (`output: 'export'`). Do not introduce a backend, model server, API routes, Server Actions, or built-in AI calls.
2. **Strict Layering**:
   - `src/core/` owns schemas, pure commands, validators, layout geometry, scene generators, and ports.
   - `src/application/` orchestrates use cases over injected ports without React/Zustand.
   - `src/store/` manages document/editor slices and bounded `zundo` history (~100 commands).
   - `src/adapters/` implements browser/library ports (`LocalStorage`, `elkjs`, `html-to-image`, `jsPDF`, text measurement, workers).
   - `src/components/` renders Russian UI and React Flow projections.
3. **Canonical Document Model**: `.bpw.json` uses opaque stable IDs (`ProcessModel`, `Diagram`, `Node`, `Relation`, `Endpoint`, `ArrowConcept`, `ArrowNetwork`, `BoundaryBinding`, `Decomposition`, `Presentation`). Derived labels (`A0`, `I1`) are never keys.
4. **Stage Gates & ADRs**: Record confirmed departures from `docs/ARCHITECTURE.md` in `docs/decisions/`. Keep Phase 2 ERwin/SQL/CRUD namespaces reserved without nonfunctional placeholders.
