---
name: git-conventions
description: "Use ONLY when the primary task is proposing/checking a commit message, obtaining commit approval, staging approved changes, or creating a local commit. Exclude code implementation, architecture, tests, UI, skill authoring itself, and remote CI/deployment."
---

# Git Conventions and Approval

Read root `AGENTS.md`. This project's explicit custom convention overrides Conventional Commits. Paths are repository-relative.

## Naming

- Format the subject exactly as `username__branch__commit-name__DDMM`.
- Use GitHub username `udopd` for this project unless the user changes it.
- Read the actual current branch; never assume `main`. If HEAD is detached, obtain the intended branch label before proposing a final name.
- Replace slashes in the branch label with hyphens in the message only. Do not rename the branch.
- Write a concise English kebab-case change name, such as `architecture-init` or `codex-skills-init`.
- Use double underscores between all four parts. Add no Conventional Commit prefix, colon, year or slash separator.
- Derive `DDMM` from the actual commit date in `Europe/Moscow`, with zero-padded day and month. Do not copy an outdated date from an example.
- Example: `udopd__main__architecture-init__2711`.

## Workflow

1. Inspect status, diff and existing staged changes. Summarize the reviewable result and verification, then propose a subject matching the approved scope.
2. Wait for explicit user approval before `git commit`. Requests to edit files, create skills or change commit rules are not commit approval. Do not infer approval from silence or task completion.
3. After approval, stage only the intended files. Inspect the staged diff and preserve unrelated user changes; do not use an indiscriminate `git add .`.
4. If scope or the proposed subject materially changes after approval, present the updated result before committing. Do not amend/rewrite history, force-push or push without explicit authorization.
5. After an approved commit, verify its subject, included files and remaining status, then report the actual hash. If a permission check blocks Git writes, report the action and reason instead of bypassing it.

Until approval, leave the working changes uncommitted and describe the subject as proposed, never as a completed commit.
