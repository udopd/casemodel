---
name: notation-idef3
description: Implement IDEF3 process flow descriptions (UOW, junctions, referents, links) inside the IDEF0 hierarchy.
---

# IDEF3 Domain Rules (Process Flow)

Apply when working on IDEF3 schema, validators, or decompositions inside `src/core/`.

## Core Semantics

1. **Hierarchy Placement**: IDEF3 is created only via decomposition of an IDEF0 activity or recursively from an IDEF3 UOW, never as an independent root model or with fabricated ICOM ports.
2. **Elements**: Support UOW nodes (preserving context and elaboration fields separately from displayed UOW number), referents with typed targets, precedence links, relational links, object-flow links, and all 5 junction kinds (`async_and`, `sync_and`, `async_or`, `sync_or`, `xor`).
3. **Flow Degree Rules**: Direct execution-flow branching/merging at a UOW triggers a diagnostic under the BPwin-like profile. Valid fan-out junctions have 1 incoming and >=2 outgoing execution links; fan-in is the reverse. Incomplete junctions remain saved with diagnostics.
4. **Link Participation & Direction**: Relational links and referent links do not count toward execution fan-in/fan-out degree checks. Deduplicate identical incidences. Cyclic flow loops are allowed. Object flow remains strictly directed (even if styled with a forward doubled arrowhead marker).
