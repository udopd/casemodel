# CASEMODEL Phase 1 contracts

This is the S2 design and S4 ownership agreement for the [architecture baseline](ARCHITECTURE.md), §§4–8 and 10–11. The signatures describe the contract to implement at bootstrap. Paths in the ownership table are reserved for future work.

## 1. Portable document

Version 1 uses JSON objects and ordered arrays. In the signatures, `XId` is a string branded by entity kind in TypeScript. New IDs are opaque, unique across the project, supplied at the application boundary and stable for the entity's lifetime. References resolve by ID. Array indices, names, coordinates, handle strings and displayed numbers have no identity semantics.

```ts
type ProjectDocument = {
  format: "casemodel.bpw"; schemaVersion: 1; appVersion: string
  id: ProjectId; revision: UInt; meta: { title: string; createdAt: ISODateTime; updatedAt: ISODateTime }
  models: ProcessModel[]; presentation: Presentation
}
type ProcessModel = {
  kind: "process"; id: ModelId; title: string; purpose: string; viewpoint: string; author: string
  root: DiagramId; diagrams: Diagram[]; decompositions: Decomposition[]; dictionary: Concept[]
}
type Diagram = {
  id: DiagramId; notation: "IDEF0" | "DFD" | "IDEF3"; title: string
  nodes: Node[]; relations: Relation[]; boundaries: Boundary[]; networks: ArrowNetwork[]
}
type Entry = { id: ConceptId; name: string; definition: string }
type ArrowConcept = Entry & { kind: "flow"; parts: ConceptId[] }
type Concept = ArrowConcept | (Entry & { kind: "external" | "store" })
type Node = { id: NodeId } & (
  | { kind: "activity" | "process"; name: string }
  | { kind: "external" | "store"; concept: ConceptId }
  | { kind: "uow"; name: string; context: string; elaboration: string }
  | { kind: "junction"; op: "andAsync" | "andSync" | "orAsync" | "orSync" | "xor"; intent: "in" | "out" }
  | { kind: "referent"; name: string; target: { node: NodeId } | { diagram: DiagramId } | { unresolved: string } })
type Side = "left" | "top" | "right" | "bottom"
type Endpoint = { node: NodeId; side: Side } | { boundary: BoundaryId } | { vertex: VertexId }
type End = { id: EndId; at: Endpoint; order: UInt; tunnelBelow?: true }
type Relation = { id: RelationId; from: End; to: End } & (
  | { kind: "segment"; network: NetworkId; concept: ConceptId }
  | { kind: "dataFlow"; concept: ConceptId }
  | { kind: "precedence" | "relational" | "objectFlow"; label: string })
type ArrowNetwork = { id: NetworkId; vertices: { id: VertexId; kind: "branch" | "join" }[] }
type Boundary = {
  id: BoundaryId; side: Side; order: UInt; concept: ConceptId
  origin: "generated" | "authored"; tunnelAbove?: true
}
```

Each array owns its records. V1 contains exactly one process model with one IDEF0 root, initially containing one activity. Every other diagram is reachable through exactly one incoming decomposition. Each node has at most one child. A diagram owns its ordered occurrences, relations and attachment targets. A relation owns two distinct end IDs even on a self-loop. Any vertex used by a segment belongs to that segment's diagram-local network. The model owns dictionary identities. Repeated store or external occurrences reference a concept of their own kind. Boundaries, segments and data flows reference flow concepts. Declared composition uses acyclic references to flow concepts in the same dictionary.

The vocabulary belongs to the diagram. IDEF0 owns activities, segments, networks and vertices. DFD owns processes, external/store occurrences and data flows. IDEF3 owns UOWs, junctions, referents and the three link kinds. IDEF0 and DFD can own flow boundaries. Within that vocabulary, either end can attach to any local attachment of the supported shape, including the wrong side or role. IDEF3 execution-degree checks count precedence and directed object flow between UOWs/junctions, once per distinct directed neighbor. Associations involving referents and relational links do not contribute.

**Identity example.** The context diagram displays `A-0`, its activity displays `A0` and that activity's child diagram displays `A0`. Reordering the child's activities can turn `A2` into `A3`. Its `NodeId`, decomposition and incident ends stay the same. Node array order determines local numbering within each notation. For IDEF0, group node ends by side (left/top/right/bottom → I/C/O/M), sort by `(order, EndId)` and number from one. An inherited ICOM code uses its parent incidence's rank. Moving a box or changing a visual offset has no effect on either numbering scheme.

**Branch example.** Splitting segment `r` from `a` to `b` retains `r` on the trunk, inserts a branch vertex and creates arms to `b` and `c`. The original outer end IDs at `a` and `b` survive, including the end transferred to the new arm. New incidences get new IDs. An independent IDEF0 connect starts a network. An explicit join of two networks keeps the destination network ID and transfers the other's vertices and segments with their IDs and concepts intact. Equal concept IDs share a dictionary name. Equal text or crossing polylines never creates a branch or merges concepts.

### Decomposition and reconciliation

```ts
type Decomposition = {
  id: DecompositionId; parentNode: NodeId; child: DiagramId
  policy: "icom" | "toDfd" | "toIdef3" | "balance" | "scenario"; bindings: BoundaryBinding[]
}
type Target = { boundary: BoundaryId } | { node: NodeId }
type BoundaryBinding = { id: BindingId; role: "I" | "C" | "O" | "M" | "in" | "out"; order: UInt } & (
  | { state: "bound"; parent: EndId; targets: Target[] }
  | { state: "pending"; parent: EndId; targets: Target[] }
  | { state: "excluded"; parent: EndId; reason: string }
  | { state: "orphan"; formerEnd: string; targets: Target[] })
```

A live parent end attaches to the decomposed node. All targets belong to its child. Each decomposition owns at most one live binding per parent end. Role and order mirror that end and refresh in the same transaction. An orphan retains their last values and an opaque provenance string. A pending decision may have zero targets. A bound decision has at least one. For DFD parents, role is relative to the process (`to` → in, `from` → out).

| Parent → child | Binding rule |
| --- | --- |
| IDEF0 activity → IDEF0 | `icom` creates one distinct child boundary per unsuppressed parent incidence, sharing its concept, side and order. A boundary can exist before the user connects it. |
| IDEF0 activity → DFD or IDEF3 | `toDfd` and `toIdef3` start with pending candidates. The user accepts child data boundaries or an explicit entity/store mapping for DFD, or child scenario nodes for IDEF3. An explicit exclusion records a reason. A mechanism alone cannot create a store. |
| DFD process → DFD | `balance` maps parent flow ends to child boundaries. A child flow from a boundary enters the child, a flow to it leaves. Any side is legal. Compare direction and concept IDs or the sets of atomic concepts in declared compositions. Hybrid balancing uses accepted data mappings. |
| IDEF3 UOW → IDEF3 | `scenario` links the decomposition by UOW identity. It creates no boundary projections. |

On a parent edit, reconcile descendants in hierarchy order inside the same command. Reuse matching end and binding IDs. Renames follow the shared concept. Role/order changes update generated defaults and labels. New eligible incidences create projections or candidates according to policy. A reconnect to a different owning node removes the old parent's incidence from reconciliation and adds it at the new owner. Reordering or splitting a segment never requires matching names. Changing a child's notation requires an explicit replacement operation.

A user connection to a generated boundary or an edit to its fields or presentation promotes it to `authored`. On loss of a parent end, remove an unused generated projection. Keep authored targets and their local work, converting the binding to `orphan`. For ICOM compare each of side, order and concept with its old parent value. A field that still matches follows the parent. A divergent field keeps the child's value and makes the binding `pending` if the new values disagree. A parent concept or role change reopens an accepted hybrid mapping for review. Clearing a target removes its live reference and reopens the decision. One undo restores the entire edit.

For example, if a child data flow already uses a mapped boundary when its parent end is deleted, keep both the boundary and flow. Replace the live end reference with `{state: "orphan", formerEnd: "end-7", …}`. The diagnostic selects that binding for repair. Pending and orphan states never trigger name-based relinking.

`tunnelBelow` on an IDEF0 activity end suppresses projection into its IDEF0 child. `tunnelAbove` on an IDEF0 child boundary declares that it intentionally has no parent counterpart. Render parentheses at the marked end. Enabling suppression removes an unused generated projection. If local work depends on it, keep the occurrence with a pending binding until the user detaches it as child-only or resolves the conflict. A child-only tunnel detaches its live mapping. A still-required parent end receives its own projection unless suppressed. Clearing a tunnel below reconciles by end ID. Clearing a tunnel above leaves an ordinary boundary whose missing counterpart can be diagnosed. Internal arrows acquire neither flag automatically.

### Persistence boundary

| State | Owner and representation |
| --- | --- |
| Semantic document | The owning records above include topology, attachment sides/order, hierarchy, dictionary and tunnel/mapping decisions. |
| Saved presentation | Sparse maps below hold user choices. Every committed node has bounds. Diagram entries hold page and frame configuration. Render node codes and inherited labels from semantics. Remove presentation keys with their owners. |
| Session and derived state | The store owns selection, active diagram, viewport, drafts, history, save status and derived diagnostics/routes/scenes. React Flow nodes, edges and handles project stable IDs and diagram coordinates. A drag commits one final command. The frame is a scene element. |

```ts
type Point = { x: number; y: number }
type Rect = Point & { width: number; height: number }
type Presentation = {
  nodes: By<NodeId, { bounds: Rect; pinned: boolean }>
  anchors: By<BoundaryId | VertexId, Point>; endOffsets: By<EndId, number>
  relations: By<RelationId, { waypoints: Point[]; labelAt?: Point }>
  styles: By<EntityId, { fill?: Color; stroke?: Color; lineWidth?: number; textSize?: number }>
  pages: By<DiagramId, { bounds: Rect; showFrame: boolean; frame: KitFields }>
}
```

`By<K,V>` is a JSON object keyed by a live ID of kind K. Coordinates are finite diagram units, sizes positive, offsets fractions along a side from left/top in [0,1], colors hex RGB. KIT fields are the authored fields in §6.1. The revision printed in the frame is independent of the document's concurrency counter.

Decode `unknown` by format and integer schema version, then the Zod shape and a structural reference pass. Require unique IDs, supported owning kinds, in-scope live references, finite values and a valid decomposition tree. An explicitly unresolved referent or orphan is a valid variant. A live reference to a missing object is corruption. Wrong-side segments, DFD store-to-store flows, incomplete junctions, bad degrees and incomplete box counts pass the structural gate and survive edit, save, reopen and export. Schema upgrades use successive pure migrations on a copy before checking the target shape. Version 1 has no legacy migration. A future or unsupported version fails before replacement. `appVersion` is informational.

## 2. Interaction contracts

`UInt` is a nonnegative safe integer. The store owns the only editable document. Application use cases coordinate pure core operations and injected ports. Commands carry concrete input values, including fresh IDs, time, seeds and any required measurements. Core returns codes and subject IDs. The presentation layer supplies Russian text.

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }
type Snapshot = { openId: OpenId; projectId: ProjectId; modelId: ModelId; revision: UInt }
type Job = Snapshot & { jobId: JobId; task: "check" | "place" | "route" | "scene" | "export"; diagramId?: DiagramId }
type JobReply<T, E> = { job: Job; result: Result<T, E> }
type DeleteTarget = { node: NodeId } | { relation: RelationId } | { boundary: BoundaryId }
  | { vertex: VertexId } | { decomposition: DecompositionId }
type Action =
  | { kind: "createNode"; diagram: DiagramId; node: Node; bounds: Rect; newConcepts: Concept[] }
  | { kind: "connect"; diagram: DiagramId; relation: Relation; newConcepts: Concept[]; newNetworks: ArrowNetwork[] }
  | { kind: "reconnect"; diagram: DiagramId; end: EndId; at: Endpoint; order: UInt }
  | { kind: "moveNodes"; diagram: DiagramId; bounds: By<NodeId, Rect> }
  | { kind: "decompose"; parentNode: NodeId; decomposition: DecompositionId; child: DiagramId
      title: string; policy: Decomposition["policy"] }
  | { kind: "deleteSelection"; diagram: DiagramId; targets: DeleteTarget[]; descendants: "restrict" | "cascade" }
  | { kind: "deleteConcept"; concept: ConceptId }
type ProjectionIds = { decomposition: DecompositionId; parentEnd: EndId; binding?: BindingId; boundary?: BoundaryId }
type Edit = { base: Snapshot; action: Action; issuedAt: ISODateTime; projections: ProjectionIds[] }
type EditError = { code: "stale" | "missing" | "conflict" | "invalidStructure" }
  | { code: "inUse"; concept: ConceptId; referrers: EntityId[] }
type Change = { next: ProjectDocument; touched: EntityId[]; diagrams: DiagramId[] }
apply(doc, edit: Edit): Result<Change | "unchanged", EditError>
undo(base: Snapshot, issuedAt) / redo(base: Snapshot, issuedAt): Result<Change, "stale" | "empty">
type Diagnostic = { ruleId: string; severity: "warning" | "error"; diagramId: DiagramId
  subject: EntityId; related: EntityId[]; messageKey: string; params: Record<string, string | number> }
check(job, frozenDoc): JobReply<{ coverage: "wholeModel"; issues: Diagnostic[] }, "cancelled" | "failed">
```

These are the closed S2 action variants. Further domain intents in architecture §5 require a typed variant from the integrator. New nodes start unpinned. Both manual moves and accepted placement use final bounds by node ID and preserve pin flags. Reconnect preserves the relation and end IDs. Decompose creates an empty child of the notation selected by the policy, then reconciles interfaces. For any action, supply one projection allocation per (decomposition, parent end) that needs fresh IDs. Supply only the IDs needed for new bindings/boundaries, reuse existing IDs, and pass empty arrays when no allocations or new records are needed. Missing, duplicate or surplus allocations fail with `invalidStructure`.

The store checks the open instance and base revision before publication. Failure/no-op publishes nothing. A successful action, including cascades, advances the revision once, invalidates model checks and affected geometry/scenes, queues autosave and adds one document-only history entry. Undo/redo restores content, stamps a fresh revision and update time, then uses the same invalidation/save path. New edits clear redo. Project replacement clears both stacks. The initial history target is 100 entries with a memory guard.

Every open gets a fresh `openId`, including reopening the same saved revision. The store tracks the latest job per task and scope. Accept an interactive result only when the open/project/model, revision, diagram (if scoped), input settings/measurements and latest job ID still match. Drop stale successes and failures. Edits immediately mark the model unchecked. Only a successful whole-model check at the current key with zero issues can show green. Pending/orphan bindings produce issues. Warnings, cancellation and failure cannot certify a revision. Stable subjects make unopened diagrams navigable.

### Deleting live objects

Resolve the entire selection against the base revision. Each target belongs to the specified diagram (for a decomposition, its parent node belongs there). Compute the deletion set and all surviving references before publishing one structurally valid change.

| Object or surviving reference | Required outcome |
| --- | --- |
| Node, boundary or branch/join vertex | Delete the selected record and every incident relation with both of its ends. Deleting a relation alone keeps both attachment targets. Remove presentation entries for all deleted IDs. |
| Decomposition or node with a child | With `restrict`, reject the whole selection with `conflict`. With `cascade`, remove the decomposition and its entire child subtree, including owned bindings and presentation. Selecting only the decomposition keeps its parent node. The model and root diagram are outside this action's target types. |
| Surviving referent to a deleted node or diagram | Keep the referent, its name and its surviving links. Replace its target with `{ unresolved: deletedId }`. The string records provenance. Whole-model validation reports the referent for repair. |
| Surviving boundary binding | For a deleted parent end, apply the orphan/generated rules above. For a deleted child target, remove that target and make a live mapping pending, retaining other targets. An orphan with no remaining targets is removed. |
| Dictionary concept | `deleteConcept` searches the entire model. A referencing node, relation, boundary or another concept's `parts` blocks deletion with `inUse` and the distinct IDs of all direct referrers. An unused concept and its style entry can be deleted. Deleting the last occurrence leaves its dictionary entry available for reuse. |

For example, deleting UOW `u7` leaves a referent on another diagram with `{ unresolved: "u7" }`. One undo restores the UOW, its incident links and the original typed target. Attempting to delete a flow concept used only as a component of a second concept returns `inUse` with that second concept's ID and leaves revision and history unchanged.

### Repository and file boundary

```ts
list() -> ProjectSummary[]                         // id, title, revision, updatedAt
load(id) / recover(id) -> { raw: unknown; storedRevision: UInt }
save(doc, expectedStoredRevision: UInt | null) -> { id: ProjectId; revision: UInt }
remove(id, expectedStoredRevision: UInt) -> void
// All repository calls are asynchronous Result values; errors as applicable:
// missing | conflict | readOnly | quota | unavailable | corrupt
openFile(boundedBytes) -> Result<ProjectDocument, "tooLarge" | "invalidJson" | "unsupportedFormat" | "unsupportedVersion" | "invalidStructure">
```

The application stages decode/migration, structure checks and a full diagnostic pass before explicit open. Diagnostic findings permit open. Publish only for the latest open request against its original working revision. A failed or superseded open keeps the current project.

Local autosave uses one writer and serializes saves per project. The expected revision is the last acknowledged storage revision (`null` requires absence). Compare under writer ownership, write the inactive slot, then switch the pointer. A conflicting writer gets an error. Explicit recovery checks the alternate slot with the same decoder before reactivating it under writer ownership. A save acknowledgement advances that writer's stored base even if editing continued. Only the acknowledged snapshot can show saved. A quota error preserves in-memory work and the prior committed slot. Import over an existing project ID requires an explicit conflict decision before writing. An approved replacement advances beyond the current stored revision.

### Geometry, scene and exports

```ts
type GeometryFault = { code: "unmeasured" | "noSpace" | "unroutable"; subjects: EntityId[] }
type GeometryError = GeometryFault | { code: "cancelled"; subjects: EntityId[] }
type RoutePaths = By<RelationId, Result<Point[], GeometryFault>>
place(job, mode: "initial" | "auto", diagram, currentBounds, measuredSizes, pins, settings, seed) -> Promise<JobReply<By<NodeId, Rect>, GeometryError>>
route(job, fixedBounds, endpointPairs, orderedAnchors, obstacles, waypoints, settings) -> Promise<JobReply<RoutePaths, GeometryError>>
buildScene(job, frozenDoc, diagramId, measurements, routes: RoutePaths, symbols) -> JobReply<DrawingScene, GeometryError>
type Color = string  // #RRGGBB
type FontKey = "inter-regular" | "inter-semibold" | "plex-mono-regular"
type ResolvedStyle = { fill: Color | null; stroke: Color | null; lineWidth: number; dash: number[]; textSize: number }
type DrawingScene = { diagramId: DiagramId; revision: UInt; bounds: Rect; items: Primitive[] }
type Primitive = { subject?: EntityId; layer: "diagram" | "frame"; style: ResolvedStyle } & (
  | { kind: "rect"; bounds: Rect; radius: number }
  | { kind: "path"; d: string }  // SVG path data in diagram units, including marker outlines
  | { kind: "text"; baseline: Point; text: string; font: FontKey; bounds: Rect })
type ExportRequest =
  | { format: "json"; scope: { kind: "project" } }
  | { format: "pdf"; scope: { kind: "model"; modelId: ModelId } }
  | { format: "png" | "svg"; scope: { kind: "diagram"; diagramId: DiagramId } }
type FileArtifact = { bytes: Uint8Array; filename: string
  mimeType: "application/json" | "application/pdf" | "image/png" | "image/svg+xml" }
type ExportError = { code: "geometry"; cause: GeometryFault }
  | { code: "invalidScope" | "checkFailed" | "renderFailed" | "io" | "cancelled" }
exportSnapshot(request: ExportRequest, frozenDoc, job) -> Promise<JobReply<FileArtifact, ExportError>>
```

Every `JobReply` echoes the **complete input job**, including cancellation and failure. Placement, routing and scene jobs carry the diagram ID and their respective task. Check the reply's job before reading or caching its result. For a completed route batch the outer success contains exactly one entry per requested relation, including individual failures. An interrupted or failed batch returns an outer error and publishes no partial routes. If route job B supersedes A in the same revision, a late success or error from A cannot overwrite B.

All geometry uses unzoomed diagram coordinates. Initial placement supplies saved bounds for new nodes. Explicit auto-layout preserves pins and applies accepted bounds through one command. Ordinary routing holds all bounds fixed. The geometry stream resolves boundaries and vertices and allocates distinct end-ID-keyed offsets before routing. If additional ports require a larger box, propose the resize in the edit or return `noSpace`. Successful routes are orthogonal polylines including anchors and respecting valid manual waypoints. Report failures by relation so the editor can still select an unroutable connection. Cache keys include geometry inputs, options and strategy version.

The pure scene builder resolves labels from the frozen hierarchy and dictionary and emits primitives in paint order. Its bounds include strokes, marker outlines, frame and full text. Null paint disables fill or stroke. Line width is nonnegative, dash lengths are positive (empty means solid) and text size is positive, all in diagram units. Text starts at the left baseline and uses the fill color. Measurement, display and export resolve each font key to the same bundled Cyrillic face (Inter Regular, Inter SemiBold or IBM Plex Mono Regular). Canvas hit targets, handles and selection are UI overlays.

For a diagram request, `job.diagramId` must equal the requested diagram in the frozen model. JSON and PDF omit that job field. The project must match `job.projectId`, and a PDF's requested model must match `job.modelId`. A missing target or mismatched scope yields `invalidScope`. JSON serializes the full document, including semantic drafts. PNG/SVG use one complete diagram scene. PDF consumes scenes in hierarchy order and a whole-model check of the same snapshot. `checkFailed` means the check could not finish. Reported issues belong in its appendix.

An artifact contains raw file bytes and a basename. The suffix and MIME type must match the requested format.

| Format | Suffix | MIME type |
| --- | --- | --- |
| JSON | `.bpw.json` | `application/json` |
| PDF | `.pdf` | `application/pdf` |
| PNG | `.png` | `image/png` |
| SVG | `.svg` | `image/svg+xml` |

JSON and SVG bytes use UTF-8. Missing measurements and failed routes preserve their geometry cause. Cancellation at any stage yields `cancelled`. A later edit leaves the export on its frozen revision. Cancelled or superseded jobs cannot deliver a file. Failures leave the document and viewport intact.

## 3. Ownership and integration

Directory entries include descendants. Each stream owns `tests/unit/<stream>/` and `tests/fixtures/<stream>/` under its name in the first column. The integrator owns the shared schemas in `src/core/schema/` and all public port types in `src/core/ports/`, including geometry and scene I/O. Streams implement those interfaces and route contract changes through the integrator.

| Stream | Exclusive paths and outcome | Contract and integration dependency | Acceptance |
| --- | --- | --- | --- |
| integrator | `src/core/schema/`, `src/core/ports/`, `src/core/validators/structure.ts`, `src/core/validators/check-model.ts`, `src/core/engine/dispatch.ts`, `src/app/`, `package.json`, `package-lock.json`, root tool configs, `tests/fixtures/shared/`, `tests/e2e/`. Own shared types, integrity checks, registries, shell and integration tests. | Publishes v1 document, action/result, repository, check, geometry and scene contracts. Wires concrete modules as they land. | Fixture round-trips with stable IDs and a semantic violation. Corrupt reference fails. All five baseline checks pass against the scaffold, including static-output E2E. |
| editing | `src/core/engine/commands/`, `src/application/commands/`, `src/application/persistence/`, `src/application/jobs/`, `src/store/`, `src/adapters/persistence/`. Publish atomic edits, history, validation scheduling and recoverable saves. | Uses Edit/Change, check and repository. Needs notation reconciliation for real cascades and aggregate validator for status. | One undo restores a subtree with local edits. Reopened/stale jobs cannot turn the status green. Quota, recovery and writer conflict preserve work. |
| notation | `src/core/engine/notation/`, `src/core/validators/notation/`, `docs/notation-rules/`. Own all three notation modules, inheritance, balancing and profile rules. | Uses the v1 graph, boundary binding and diagnostic types. Pure handlers run inside editing transactions and register through the integrator. | Cover both tunnels, stable outer ends on split, orphan preservation, hybrid mappings and a retained invalid connection for each notation. |
| geometry | `src/core/layout/`, `src/adapters/layout/`, `src/adapters/measurement/`, `src/workers/layout/`. Supply placement, measurement, fixed-bound routing and geometry checks. | Uses placement/routing ports and presentation. Needs real measurement and validated routes for final scene integration. | Fixed-position prototype preserves boxes, parallel end spacing and feedback routes. Invalid paths return affected IDs. Explicit auto-layout preserves pins. |
| editor | `src/components/workbench/`, `src/components/canvas/`, `src/i18n/`, `public/fonts/`. Deliver Russian editing surfaces and the React Flow projection. | Uses commands, store selectors, diagnostics and scenes. Real gestures need editing, issue navigation needs validators, routed display needs geometry and scenes. | One drag gives one undo. Invalid connections remain selectable. Every current issue is reachable and the frame is included in view bounds. |
| exports | `src/core/generators/`, `src/application/export/`, `src/application/import/`, `src/adapters/files/`, `src/adapters/export/`, `src/components/export/`. Own scene construction, portable files and report generation. | Uses shared decoder, drawing scene, measurement, geometry and check contracts. Import hands a staged document to editing for replacement. Display consumes the same scene builder. | Frozen full-diagram PNG/SVG and ordered Cyrillic PDF include the frame. JSON preserves invalid relations and manual layout. Failed import keeps the open document. |
| delivery | `.github/workflows/`, `deploy/`, `Dockerfile`, `.dockerignore`. Package and release the static build. | Uses the integrator's npm scripts and `out/`. Image verification needs a real production build. | Run the five gates, smoke-test the packaged static site and verify rollback to the previous image. |

**Handoff.** S1 supplies the buildable shell. S2 implementation supplies shared types/ports and a small fixture (one IDEF0 root, child, stable binding, wrong-side segment and manual bounds). S3 verifies these through the five required commands. Once that gate passes, all six feature streams can start against the shared fixture and port doubles. Real cross-stream acceptance follows the dependencies above. The fixed-position prototype gates routed canvas acceptance. Rule-source selection, IDEF3 marker and KIT frame reference fixtures, and storage headroom on a representative 20-diagram document remain qualification work at the gates in [the baseline](ARCHITECTURE.md#15-remaining-decisions-and-risks).
