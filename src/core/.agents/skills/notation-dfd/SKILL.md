---
name: notation-dfd
description: Implement Gane & Sarson DFD entities, balancing rules, and IDEF0-to-DFD hybrid decomposition mappings.
---

# DFD Domain Rules (Gane & Sarson)

Apply when working on DFD schema, validators, or IDEF0-to-DFD decomposition inside `src/core/`.

## Core Semantics

1. **Hierarchy Placement**: DFD cannot be an independent root model in Phase 1; it is created by decomposing an IDEF0 activity or recursively decomposing a DFD process.
2. **Entities & Occurrences**: Support Gane & Sarson processes, external entities, data stores, and data flows (any attachment side). Multiple visual occurrences of the same external entity or data store may share one semantic dictionary identity while retaining distinct occurrence IDs.
3. **Permissive Diagnostics**: Retain and diagnose direct external-entity↔external-entity, entity↔store, and store↔store flows. Emit black-hole warnings (processes with inputs only), miracle warnings (outputs only), and store read/write imbalance warnings with rule-catalog context.
4. **Hybrid Decomposition & Balancing**: Converting an IDEF0 activity to DFD proposes mappings for Inputs/Outputs and keeps Controls/Mechanisms as explicit candidates requiring semantic interpretation (never silently turn a person/machine mechanism into a data store). Balancing checks semantic identities and compositions, not raw label strings.
