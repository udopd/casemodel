---
name: devops-cicd
description: "Use ONLY when the primary task changes build tooling, static hosting, CI workflows, container configuration, or remote deployment/rollback. Exclude feature implementation, test-only authoring, notation rules, UI work, exports, and local commit naming/staging."
---

# Static Build and Deployment

Read root `AGENTS.md` and `docs/ARCHITECTURE.md` sections 10, 13 and 14. Paths are repository-relative.

## Required Design

1. Configure Next.js App Router with `output: 'export'`. Keep local project IDs client-side; do not introduce API routes, Server Actions or runtime server dependencies.
2. Build with Node.js 24 LTS and a pinned compatible dependency lockfile. Use a multi-stage image: Node builder produces `/out`; `nginx:alpine` serves only those static assets in production.
3. Set Compose `mem_limit: 128m` and `memswap_limit: 256m`. Measure actual resource use. Treat 2 GB host swap as provisioning, not application build logic.
4. Make GitHub Actions run `npm ci`, typecheck, lint, unit tests, build and an E2E gate against production static assets. Verify the artifact/image that will actually be released; do not publish a separately modified untested build.
5. Publish to GHCR with immutable commit tags/digests. A `latest` alias is optional and must not be the sole rollback reference. Keep credentials out of static bundles and Git.
6. Deploy serially over SSH: retain the previous digest/configuration, transfer Compose, pull the new image, update the service and perform a health check. On failure, restore the prior known-good image/configuration and verify it. Prune only after successful checks while preserving rollback assets.
7. Keep host configuration in `/opt/bpwin/.env` outside Git. Enable gzip, immutable caching for hashed assets, and HTML revalidation. Coordinate schema migration behavior with older open tabs.
8. Separate reviewable configuration work from authorized deployment actions. Do not deploy or change host provisioning merely because instructions/configuration were requested.

## Verification

Check static deep-link loading, asset/font availability, no server-runtime dependence, E2E success, container health, memory settings and rollback behavior. Report unexecuted host checks explicitly; do not promise fixed Nginx memory consumption.
