---
name: notation-idef0
description: "Use ONLY when the primary task changes IDEF0 semantic schemas, validation, decomposition inheritance, tunnels, or branch/join topology. Exclude generic schema-version policy, DFD/IDEF3 semantics, geometry algorithms, canvas rendering, test-only work, and exports."
---

# IDEF0 Semantics

Read root `AGENTS.md` and `docs/ARCHITECTURE.md` sections 4, 5 and 6.1. Paths are repository-relative.

## Implementation Rules

1. Distinguish context diagram `A-0`, its single activity `A0`, child diagram `A0`, and child activities `A1..An`. Validate 3-6 blocks on non-context diagrams while retaining incomplete drafts.
2. Keep IDs stable; derive node numbers and ICOM codes from hierarchy and explicit ordering. Moving a block must not silently renumber it.
3. Expect Input on left, Control on top, Output on right and Mechanism on bottom. Valid block sources leave through Output; valid targets use Input, Control or Mechanism. Retain wrong-side connections and diagnose them; never encode notation restrictions as structural schema rejection.
4. Project applicable parent incidences onto child boundaries with stable `BoundaryBinding` references. Derive ordered `I1/C1/O1/M1` labels; reconcile parent changes atomically through descendants without erasing user-authored child content.
5. Represent tunneling `(...)` as explicit endpoint/interface metadata: distinguish suppression into a child from a child interface absent at its parent. Render parentheses at the affected endpoint, not literal ellipses in labels. Ordinary internal child arrows are not tunnels.
6. Model branch/join topology vertices explicitly, with segment-level concepts. Keep them distinct from activities and IDEF3 junctions. A geometric crossing is not a semantic join.
7. Permit feedback with valid ICOM endpoints; expose feedback intent to routing for exterior channels. Keep geometry algorithms outside notation validation.
8. Return diagnostic codes, parameters and stable subjects for the Russian UI. Reject broken references and hierarchy cycles separately from notation mistakes.

## Validation Evidence

Cover context counts, invalid-side retention/save/load, stable renumbering, parent-child reconciliation, both tunnel directions, branch/join identity and atomic undo. Include a valid feedback case. Reference the selected notation source or product profile for each new rule; do not invent blanket standards conformance.
