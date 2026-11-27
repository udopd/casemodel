---
name: notation-idef3
description: "Use ONLY when the primary task changes IDEF3 semantic schemas, referent resolution, execution-link classification, or junction validation. Exclude IDEF0/DFD semantics, generic schema-version policy, geometry, canvas rendering, test-only work, and exports."
---

# IDEF3 Semantics

Read root `AGENTS.md` and `docs/ARCHITECTURE.md` sections 4 and 6.3-6.4. Paths are repository-relative.

## Implementation Rules

1. Create IDEF3 through IDEF0 decomposition; retain the hierarchy during recursive UOW decomposition. Do not create an independent IDEF3 root.
2. Model `UowNode`, `JunctionNode` and `ReferentNode` as discriminated types. Keep UOW ID/context/elaboration separate; specify the bottom ID/context split and referent double-left-border symbol for rendering.
3. Support five junction kinds: `&` asynchronous/synchronous AND, `O` asynchronous/synchronous OR, and `X` XOR. Do not invent a synchronous XOR subtype.
4. Keep `Precedence`, `Relational` and `ObjectFlow` distinct. Specify solid precedence and dashed relational links. Object flow remains directed; a doubled forward arrowhead is not bidirectional flow. Verify its marker against the selected reference before rendering it.
5. Diagnose direct execution branching/merging at a UOW; retain the offending links. Valid fan-out has one incoming and at least two outgoing incidences; valid fan-in has at least two incoming and one outgoing incidence. Save incomplete junctions with diagnostics.
6. Explicitly classify which link kinds count toward execution-flow degrees. Do not count relational/referent associations or duplicate incidences as extra execution branches.
7. Resolve referents through typed stable references. Report unresolved targets; do not infer semantic identity from labels. Permit loops rather than rejecting every graph cycle.
8. Return codes, parameters and object references for Russian diagnostics. Keep the scope to the requested process-flow profile; object-state networks and alternative decompositions are separate parity items.

## Validation Evidence

Cover all five junction kinds, valid fan-in/fan-out, incomplete and mixed-degree junctions, direct UOW branching, relational-link exclusion, duplicate links, referent resolution, directed object flow, loops and invalid-diagram round trips.
