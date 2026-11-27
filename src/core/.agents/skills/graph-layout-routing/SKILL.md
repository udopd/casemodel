---
name: graph-layout-routing
description: "Use ONLY when the primary task changes node placement, port-coordinate allocation, obstacle geometry, or path-routing algorithms and their layout adapter. Exclude notation semantics, React Flow interactions/rendering, UI styling, test-only work, and export delivery."
---

# Placement and Orthogonal Routing

Read root `AGENTS.md` and `docs/ARCHITECTURE.md` sections 5 and 8. Paths are repository-relative.

## Pipeline

1. Accept explicit node bounds, text measurements, stable IDs, ordered attachments and settings in diagram coordinates. Never measure the DOM inside core.
2. Separate placement, port allocation, routing and drawing. Use the classic top-left to bottom-right diagonal staircase for IDEF0; preserve manual positions unless auto-layout was requested.
3. Allocate distinct ordered offsets along each side with stable attachment identity. Grow bounds if required for spacing. Keep parallel arrows from collapsing onto one coordinate.
4. Define a layout port in core; implement elkjs execution/mapping in `src/adapters/layout`. Use ELK Layered for applicable automatic placement. Pin options/version, seed and ordering; normalize output coordinates. Do not import elkjs into core or application.
5. Route fixed-position graphs with a deterministic orthogonal visibility/grid strategy around inflated node bounding boxes and reserved frame space. Penalize bends, break ties stably, honor valid manual waypoints, and reserve exterior feedback channels.
6. Do not assume ELK Layered preserves arbitrary fixed coordinates, `elk.fixed` invents paths, or native libavoid is bundled with elkjs.
7. Validate axis-aligned segments, endpoint clearances and node-interior avoidance. Report unroutable/conflicting geometry explicitly. A crossing alone never creates a topology join; do not promise zero crossings for arbitrary graphs.
8. Tag asynchronous jobs with project/revision/job IDs; discard stale results. Cache computed routes separately from persisted manual intent. Apply explicit auto-layout as one command/history entry.

## Validation Evidence

Require reproducibility for identical inputs, distinct ports, obstacle avoidance, orthogonality, backward feedback, manual waypoints, no overlaps after completed auto-layout, and stale-result rejection. Pass the fixed-position routing prototype gate before claiming the canvas routing requirement is complete.
