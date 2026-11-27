---
name: export-and-reporting
description: Implement isolated export rendering and deterministic PNG, portable SVG, and Russian Cyrillic PDF generation.
---

# Export & Reporting

Apply when building `src/components/export/`, `src/core/generators/`, or `src/adapters/export/`.

## Standards

1. **Frozen Revision Snapshot**: Capture one frozen project revision at export start; ongoing UI edits must not leak into an export job, and export errors must never mutate the document or viewport.
2. **Full Diagram Bounds**: Export the full diagram (including offscreen nodes, labels, and frame), waiting for local bundled fonts, text measurement, and routing completion. Exclude editor chrome (grid, selection, handles, toolbars).
3. **Format Rules**:
   - `.bpw.json`: Canonical lossless envelope preserving IDs, tunnels, bindings, manual waypoints, and semantic errors.
   - **PNG**: Isolated off-screen export renderer via `html-to-image` (`pixelRatio: 2`), readable Cyrillic.
   - **SVG**: Pure `src/core/generators/` drawing-scene-to-SVG serializer (primitives, text, markers; XML-escaped user text; zero `foreignObject` or external URLs).
   - **PDF**: Pure report plan + `jsPDF` adapter (landscape A4, bundled Cyrillic font, hierarchical node tree -> `A-0` -> depth-first diagrams -> deduplicated arrow dictionary -> diagnostics appendix when issues exist). Render sequentially with progress/cancellation and resource cleanup.
