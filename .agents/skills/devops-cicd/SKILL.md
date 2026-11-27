---
name: devops-cicd
description: Maintain Node 24 toolchain pinning, GitHub Actions CI gates, Nginx static container, and safe deployment rules.
---

# DevOps & CI/CD Role

Use this skill for CI workflows, Dockerfile/Nginx static serving, and deployment scripts.

## Requirements

- **Runtime**: Pin Node.js 24 LTS (`.nvmrc` / `package.json` `engines`) and commit `package-lock.json`.
- **CI Gates (PRs and `main`)**: Every run must execute `npm ci`, `npm run typecheck`, `npm run lint` (including boundary checks), `npm run test:unit`, `npm run build`, and `npm run test:e2e` against the static `out/` build.
- **Static Production Container (Stage 6)**: Serve `/out` from a single `nginx:alpine` container. Node.js stays in build/CI stages only. Enable gzip, immutable caching for hashed assets, and revalidation for HTML.
- **Deploy Safety**: Publish images to GHCR with immutable commit tags/digests. Deploy serially over SSH, keep prior digest for rollback, run static health checks before pruning old images, and never commit `.env` secrets.
