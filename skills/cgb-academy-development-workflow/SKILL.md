---
name: cgb-academy-development-workflow
description: Follow CGB Academy's Git, Jira, review, documentation, and Definition of Done process when changing this repository.
---

# CGB Academy: flujo de desarrollo

Use this skill for repository changes in CGB Academy, including code, tests, documentation, configuration, Git branches, commits, Pull Requests, and release preparation.

## Canonical project rules

Before changing files, read:

- `AGENTS.md` for repository-wide and Next.js-specific instructions.
- `docs/FLUJO_DE_TRABAJO.md` for the end-to-end team process.
- `docs/definition-of-done.md` when finishing a story or deciding whether work is complete.
- `docs/configuracion.md` for dependencies, environment, change control, or approved baselines.
- `docs/ESTADO_RAMAS.md` only as a dated branch snapshot; inspect current GitHub state before branch cleanup.

Jira project `CGB` is the work-item record; GitHub `main` is the single integration branch. New work uses a short-lived branch named `<type>/<CGB-ID>-<slug>` and a reviewed Pull Request to `main`. Do not start new work from personal branches or `desarrollo`.

## Safe work rules

1. Inspect `git status --short --branch`, `git diff`, and `git diff --cached` before switching branches or editing. Keep unrelated modified and untracked files intact.
2. Never use mass-cleanup or destructive restore commands to make the tree appear clean. Do not delete a branch until its unique commits and PR status are checked with its owner.
3. Stage only paths for the current task; inspect the staged diff. Never commit secrets, `.env`, credentials, generated output, `node_modules/`, or `.next/`.
4. Use npm and the tracked `package-lock.json`. Do not add or remove another package-manager lockfile without a team decision.
5. Write one-purpose Conventional Commits with an accurate description and the Jira key. Do not claim a test, review, user validation, or approval that did not happen.
6. For code behavior, follow the project's TDD/BDD practice where applicable. Record actual verification commands and outcomes in the PR; apply the five shared DoD gates before Jira is moved to Done.
7. Preserve user instructions about whether to commit or publish. A request to change files alone does not imply permission to push or merge; when publishing is requested, target `main` through the documented review flow.

## Closeout

Before reporting completion, identify the changed files, current branch/PR or commit if published, checks actually run, and any unresolved decision. For requirements or user research work, also apply `skills/cgb-academy-requirements/SKILL.md` and keep hypotheses distinct from evidence.
