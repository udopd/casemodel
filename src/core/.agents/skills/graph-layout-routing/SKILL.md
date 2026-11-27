---
name: graph-layout-routing
description: Build pure deterministic node placement, port allocation, orthogonal routing, and drawing scene validation.
---

# Graph Layout & Orthogonal Routing

Apply when working in `src/core/layout/`, `src/core/generators/`, or `src/adapters/layout/`.

## Pipeline Contract

All layout coordinates are zoom-independent diagram coordinates:

1. **Bounds & Text Measurement**: Resolve node bounds using text measurements injected via core ports (no DOM `canvas.measureText` inside `src/core/`).
2. **Node Placement**: Preserve manual pinned positions or apply auto-placement (`IDEF0` diagonal staircase; `DFD`/`IDEF3` via injected `elkjs` port with pinned version/seed and stable node order).
3. **Port Allocation**: Assign stable handle IDs and ordered offsets per side; grow node dimensions if port spacing requires it so parallel arrows never collapse onto a single point.
4. **Orthogonal Routing**:
   - Do not rely on `elk.fixed` to invent general fixed-position routes.
   - For manual moves and IDEF0 staircases, implement a pure deterministic orthogonal grid/visibility router with obstacle inflation, bend penalties, exterior feedback channels, and manual waypoint retention.
5. **Geometry Verification & Scene**: Verify axis-aligned segments, zero node interior intersections, endpoint clearances, and explicit route failure reporting. Emit a shared drawing scene for canvas projection and SVG/PNG/PDF exports.
