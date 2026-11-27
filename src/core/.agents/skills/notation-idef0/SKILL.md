---
name: notation-idef0
description: Implement IDEF0 semantics, ICOM rules, decomposition reconciliation, tunnels, branches/joins, and KIT frame metadata.
---

# IDEF0 Domain Rules

Apply when working on IDEF0 schema, commands, validators, or decomposition reconciliation inside `src/core/`.

## Core Semantics

1. **Root & Hierarchy**: Every process model begins with context diagram `A-0` containing one `A0` activity. Decomposing `A0` creates child diagram `A0` with activities `A1`..`An`. Validation flags non-context diagrams outside 3–6 boxes while keeping them editable.
2. **ICOM Attachment Sides**: Expected target sides are Input (left), Control (top), Output (right), Mechanism (bottom). Departure from expected source/target sides (e.g., leaving left side) is a diagnostic, never a schema rejection.
3. **Numbering & Order**: Visual position never silently renumbers blocks. Explicit activity order derives `A1`..`An` and default diagonal staircase placement; child links bind to opaque activity IDs.
4. **Decomposition & Reconciliation**: `BoundaryBinding` stores stable parent incidence, ICOM role, order, and child occurrence ID (`I1`/`C1`/`O1`/`M1` are derived display codes). Parent edits propagate concept renames and recompute roles/order; ambiguous changes remain explicit unresolved bindings with diagnostics instead of deleting child user work.
5. **Tunnels, Branches/Joins, Frame**:
   - Tunnels are explicit endpoint/boundary flags rendered with parentheses, not label ellipses.
   - Branches and joins are topology vertices in `ArrowNetwork` with segment-level `ArrowConcept` references; crossings without joins have no semantic merge.
   - Frame metadata (`usedAt`, `author`, `date`, `revision`, `lifecycleStatus`, `notes`, `node`, `title`, `number`) is separate from topology and validation status.
