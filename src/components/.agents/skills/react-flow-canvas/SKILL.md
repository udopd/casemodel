---
name: react-flow-canvas
description: "Use ONLY when the primary task changes React Flow projection, custom node/edge rendering, canvas interactions, dynamic handles, or the KIT-frame overlay. Exclude core notation rules, geometry algorithms, workbench styling/copy, test-only work, and exports."
---

# React Flow Canvas

Read root `AGENTS.md` and `docs/ARCHITECTURE.md` sections 4.3, 5 and 8-9. Paths are repository-relative.

## Implementation Rules

1. Project the canonical document into React Flow nodes/edges; never persist React Flow state, measured internals, callbacks or handles as domain entities.
2. Render only the active diagram. Use `React.memo` for custom nodes/edges, stable props and atomic Zustand selectors. Keep transient selection, dragging and viewport state outside document history.
3. Send mutations through store/application commands. Commit one final move per drag gesture; do not turn every pointer event into a history entry.
4. Render stable multi-handle ICOM attachments using the core's ordered port offsets. Refresh node internals when dimensions or attachment sets change. Do not duplicate the allocation algorithm in React.
5. Permit structurally valid connections even when side/direction or node-kind combinations violate notation. Do not use `isValidConnection` or source/target-only handles to silently enforce semantic restrictions. Highlight retained invalid links and connect them to model-wide diagnostics.
6. Render notation-specific symbols, branch/join vertices, directed link markers and tunnel parentheses from explicit domain data. Do not infer semantic joins from visual intersections.
7. Implement the toggleable IDEF0/GOST KIT-frame as a page overlay, not a business node. Include its header/footer metadata and extents in the scene. Localize captions in Russian and verify the chosen template before asserting compliance.
8. Localize tooltips, context menus, accessible names and errors in Russian. Use keyboard-accessible controls and stable `data-testid` identifiers. Let diagnostic selection open the correct diagram and focus its subject.

## Validation Evidence

Verify projection round trips do not leak UI objects, multiple handles stay separated after resizing, invalid connections remain editable, one drag produces one undo entry, diagnostics navigate across diagrams, and frame toggling does not alter topology. Test stale layout-result rejection at the integration boundary.
