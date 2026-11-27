---
name: role-developer
description: Implement TypeScript modules, commands, adapters, and UI components following casemodel strictness and boundary rules.
---

# Developer Role

Use this skill for all day-to-day TypeScript implementation work across `src/`.

## Standards

1. **Zero `any` / Zero `@ts-ignore`**: Use discriminated unions, Zod-inferred types, and explicit `unknown` narrowing.
2. **Immutable Commands**: Domain edits return a new immutable document with incremented revision and affected IDs/diagrams; never mutate the working document in place.
3. **Permissive Semantics vs Structural Integrity**: Structural corruption (missing references, non-finite numbers, cyclic decompositions) must be rejected; notation-invalid links must remain representable, undoable, and serializable.
4. **Async Revision Guard**: Any worker/layout/validation job carries `projectId`, `modelId`, `inputRevision`, and `jobId`. Discard stale results if the active revision or project changed.
5. **Language Split**: English identifiers, types, comments, and error keys in code; Russian user-facing strings isolated to `src/i18n/`.
6. **Verify Everything**: Run `npm run typecheck`, `npm run lint`, `npm run test:unit`, and `npm run build` after changes.
