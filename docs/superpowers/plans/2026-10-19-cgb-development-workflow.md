# CGB Academy Development Workflow Implementation Plan

> **For agentic workers:** Execute this plan in the current repository as directed by the user. Keep changes focused on the shared development workflow and preserve all unrelated local files.

**Goal:** Establish one practical, traceable workflow for CGB Academy contributors and their coding assistants, from Jira need through branch, commits, review, merge, and approved baseline.

**Architecture:** Keep `docs/FLUJO_DE_TRABAJO.md` as the operational source of truth, with focused companion documents for configuration baselines and Definition of Done. Link those documents from the README, agent instructions, a reusable workflow skill, and a Pull Request template.

**Tech Stack:** Markdown, Git, GitHub, Jira CGB, npm.

---

### Task 1: Define the repository workflow

**Files:** Create `docs/FLUJO_DE_TRABAJO.md`, `docs/configuracion.md`, and `docs/definition-of-done.md`.

- [x] Set `main` as the only integration branch and define short-lived issue branches.
- [x] Document safe working-tree cleanup, branch naming, Conventional Commits, PR review, test evidence, board states, WIP limits, and post-merge branch cleanup.
- [x] Define the configuration inventory, approval and change-control records, and five observable DoD gates.

### Task 2: Align existing repository guidance

**Files:** Modify `README.md`, `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.gitattributes`, `.gitignore`, `docs/ESTADO_RAMAS.md`, the dated requirements gap analysis, and `informe/informe.md` plus `informe/informe.tex`; regenerate the tracked `informe/informe.pdf`.

- [x] Remove conflicting guidance that treats `edmil-saire` or `desarrollo` as permanent integration branches.
- [x] Make agent instructions route all repository work through the same workflow and preserve local changes.
- [x] Replace stale branch status claims with a dated, evidence-based snapshot.
- [x] Align the academic report's process claims with the repository and Jira evidence; compile and visually inspect the PDF.

### Task 3: Make the process reusable in tools

**Files:** Create `skills/cgb-academy-development-workflow/SKILL.md` and `.github/PULL_REQUEST_TEMPLATE.md`; update `skills/cgb-academy-requirements/SKILL.md`.

- [x] Give coding assistants concise entry instructions and link them to the shared policy.
- [x] Provide a PR checklist that captures Jira traceability, test evidence, review, and DoD.

### Task 4: Align the GitHub repository settings

**Files:** GitHub repository settings for `milith0kun/proyecto-ing-software`.

- [x] Set `main` as the repository default branch.
- [x] Protect `main` with one approval, resolved conversations, no force-push/deletion, squash-only merge, and automatic deletion of merged feature branches.
- [x] Remove the verified redundant `desarrollo` and `edmil-saire` branch references; retain contributor branches whose unique work has not yet been reviewed.

### Task 5: Review the result

**Files:** All files above.

- [x] Check Markdown links and cross-document branch/commit/DoD terminology for consistency.
- [x] Validate the new skill with the bundled skill validator.
- [x] Compile the LaTeX source, inspect the rendered pages, and keep the PDF in sync with the source.
- [x] Keep unrelated untracked package-manager and `Labos/Guia5/` files untouched; ignore temporary PDF renders so they cannot enter a commit accidentally.
