---
name: export-and-reporting
description: "Use ONLY when the primary task changes project file serialization/import orchestration, frozen-snapshot image exports, portable SVG generation, or PDF reports. Exclude shared schema-version policy, notation semantics, layout algorithms, interactive canvas work, and test-only tasks."
---

# Files, Images and Reports

Read root `AGENTS.md` and `docs/ARCHITECTURE.md` sections 4, 7, 10 and 11. Paths are repository-relative.

## Pipeline

1. Freeze one document revision per export. Resolve fonts, measured bounds and routes for that snapshot; include all diagram nodes, labels and frame extents, not only the visible viewport.
2. Serialize `.bpw.json` from canonical domain state with `schemaVersion`. Validate with Zod, supported migrations and structural checks on import before replacing the working project. Preserve stable identities, bindings, tunnels and manual layout. Semantic errors remain saveable/importable and are diagnosed separately.
3. Keep schema-version policy in the architecture contract. Use injected repository/file ports for I/O, preserving the prior project on malformed input, unsupported versions or structural failure.
4. Capture PNG from an isolated export renderer through html-to-image with `pixelRatio: 2`. Exclude controls, grid, handles, selection and editor chrome. Wait for bundled Cyrillic fonts and bound large-canvas work.
5. Generate portable vector SVG from a pure shared drawing scene in core. Emit shapes, paths, text and markers; escape user text and exclude `foreignObject`, scripts and external asset URLs. Keep DOM and download APIs in adapters.
6. Build a pure report plan and render it with the jsPDF adapter as landscape A4. Order pages: paginated Node Tree, A-0, depth-first descendants in explicit node order, Arrow Dictionary, then diagnostics appendix when needed.
7. Embed a Cyrillic-capable font, paginate tables with repeated headers, and deduplicate dictionary entries by semantic ID rather than name. Include occurrences, inherited ICOM references and tunnel notes.
8. Render report pages sequentially with progress/cancellation and resource cleanup. Diagram images in PDF do not imply vector PDF output. Report readability/export failures in Russian without mutating the live model or viewport.

## Validation Evidence

Verify valid and semantically invalid JSON round trips, failed-import preservation, complete PNG bounds, SVG without `foreignObject`, escaped labels, Cyrillic PDF text, traversal order, dictionary identity and cancellation. Test snapshot consistency while the user continues editing.
