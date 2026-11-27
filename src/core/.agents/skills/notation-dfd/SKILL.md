---
name: notation-dfd
description: "Use ONLY when the primary task changes DFD semantic schemas, flow diagnostics, balancing, or IDEF0-to-DFD mapping. Exclude IDEF0 inheritance, IDEF3 rules, generic schema-version policy, geometry, canvas rendering, test-only work, and exports."
---

# DFD Semantics

Read root `AGENTS.md` and `docs/ARCHITECTURE.md` sections 4 and 6.2-6.4. Paths are repository-relative.

## Implementation Rules

1. Create DFD through decomposition of IDEF0; keep further DFD decomposition inside that hierarchy. Do not introduce an independent DFD root.
2. Define `DfdProcess`, `ExternalEntity`, `DataStore` and directed `DataFlow` as discriminated domain types, separate from their visual occurrences.
3. Specify Gane & Sarson symbols for the renderer: rounded process with number header, external entity with offset shadow, and open-right store with left ID compartment such as `D1`. Allow flow attachment on any side.
4. Retain direct entity-to-entity, entity-to-store and store-to-store flows, in either direction, and produce diagnostics. Do not reject them during connection, serialization or semantic import validation.
5. Warn about a process with inputs but no outputs (black hole), outputs but no inputs (miracle), and stores missing a read/write counterpart. Keep warnings distinct from structural errors.
6. Map IDEF0 parent inputs/outputs explicitly to the child data interface. Interpret controls/mechanisms rather than silently turning them into data flows. A mechanism may suggest a store candidate; a person or machine is not automatically a store.
7. Persist accepted mappings, unresolved candidates and stable parent references. Balance by semantic identity/composition, never matching labels alone. Respect hybrid mappings when reconciling parent changes.
8. Keep repeated occurrences distinct while allowing shared entity/store dictionary identity. Return diagnostic codes and subject references for localized UI messages.

## Validation Evidence

Cover each forbidden non-process pairing in both directions, a valid process-mediated flow, black-hole/miracle warnings, balancing, ambiguous mechanism mapping, parent edits and invalid-flow save/load. Verify that structural corruption still fails safely.
