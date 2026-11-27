---
name: react-flow-canvas
description: Project canonical diagram state into React Flow nodes/edges, custom handles, and KIT frame overlays.
---

# React Flow Canvas Projection

Apply when building or modifying `src/components/canvas/` and custom React Flow nodes/edges.

## Rules

1. **Projection Only**: Convert canonical `Diagram` + `Presentation` + computed routes into memoized React Flow nodes/edges. Never store React Flow internals or JSX in `.bpw.json` or domain state.
2. **Permissive Handles**: Expose handles on all four sides (and dynamic port offsets) so users can draw notation-invalid connections; render invalid links with visual error emphasis plus icon/badge without blocking or mutating relation kind.
3. **Transient Drag vs Committed Edits**: Keep live drag coordinates transient in UI/component state; commit final coordinates once on drag stop as a single `zundo` history command. Enforce non-overlapping drop resolution or revert with Russian feedback.
4. **KIT Frame**: Render the standard frame overlay from frame metadata as part of diagram bounds and exportable area, not as a selectable business activity node.
5. **Performance**: Use atomic store selectors, memoized custom node/edge components, and stable `data-testid` hooks (`canvas-root`, node/edge test IDs).
