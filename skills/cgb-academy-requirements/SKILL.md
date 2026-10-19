---
name: cgb-academy-requirements
description: Apply the CGB Academy user-needs and requirements workflow for stakeholder analysis, elicitation, requirement validation, Jira backlog refinement, and the Ingeniería de Software I activity report.
---

# CGB Academy: necesidades y requisitos

Use this skill when work for CGB Academy involves users, stakeholders, requirements, acceptance criteria, Jira stories, backlog refinement, or the Ingeniería de Software I activity on validating real needs.

## Project sources

Start with the repository's current instructions and relevant evidence:

- `docs/ANALISIS_FALTANTES_ACTIVIDAD_INGENIERIA_REQUISITOS.md` is a dated assessment. Verify live Jira and current files before treating its status as current.
- `informe/informe.md` and `CGB_Academy_Requerimientos_Funcionales_y_No_Funcionales.pdf` describe the product scope, stories, and quality requirements.
- `Diapos/3.Gestion_de_configuracion.md` describes traceability, baselines, review, and Definition of Done.
- Jira project `CGB` is the current project with the CGB Academy backlog. A second project `KAN` exists; check with the user or project evidence if the intended Jira project is unclear.
- Inspect the relevant source code when a requirement concerns implemented behavior. Do not treat a Jira description or project report as proof that behavior exists.

## Evidence rules

- Distinguish **documented fact**, **user-reported evidence**, **observed behavior**, and **hypothesis pending validation**.
- Never invent interview answers, quotations, user counts, test outcomes, or stakeholder approval. Keep assumptions labeled until supported by evidence.
- Record interview date and stakeholder role. Anonymize names and omit personal data that is not needed for the activity.
- When sources conflict, record both references, state the conflict, and propose a question or decision for the responsible stakeholder.
- The project report currently says certificates are outside the MVP. Treat certificate work in a story as a scope conflict to resolve, not as an approved feature.

## Workflow

### 1. Inspect the current state

Read the relevant project specification, source files, existing reports, and Jira issues before proposing changes. For Jira, inspect the project, board, sprint, issue description, priority, status, tasks, and links. Report what is present separately from what is missing. Preserve unrelated working-tree changes.

### 2. Map and prioritize stakeholders

Identify at least four people or groups who affect or use the feature. For each, record role, interest, power, expectations, and evidence source. Place them in a power–interest matrix and justify priority. Existing stakeholder tables are a starting point; do not present inferred power or interest as interview findings.

Select one high-priority stakeholder for elicitation. For the CGB Academy onboarding flow, an internal collaborator is a reasonable starting candidate because the project report identifies that role and Jira contains onboarding stories; confirm the choice against the requested scope.

### 3. Elicit needs

Prepare five neutral, open interview questions about a recent real task, obstacles, workarounds, expected outcome, and trust/privacy concerns. Add one complementary technique such as observing the user complete a task, a short survey, a workshop, or reviewing existing documents. State what evidence will be recorded and how identities will be protected. Keep results as pending until the activity actually happens.

Build a persona from observed or reported evidence. If an interview has not happened, label the persona **hypothesis** and leave quotations and unobserved details blank.

### 4. Review and rewrite requirements

Review at least four existing requirements, including one functional requirement, one nonfunctional requirement, one business rule, and one constraint. For each, record the initial wording, type, ambiguity/gap/conflict, revised wording, and verification method.

Check that each rewrite has one meaning, defined conditions, measurable results where appropriate, consistency with the approved scope, and a test or inspection that can prove it. For performance requirements, specify the page or operation, test environment, data volume, measurement, and threshold. Treat rules such as public versus internal visibility as rules only after confirming the intended policy.

### 5. Validate user stories

For at least two stories, check clarity, consistency, feasibility, and verifiability. Write observable Given/When/Then criteria. Link every change to a stakeholder need and mark whether that need is evidenced or still a hypothesis.

When AG-C01 applies, make the impact explicit in the story's purpose and express ethical, legal, privacy, or social commitments as verifiable acceptance criteria. Do not assert legal compliance without an identified rule and evidence.

### 6. Refine Jira

Each of the two refined Jira stories should contain:

- `Como..., quiero..., para...`.
- Acceptance criteria that can be observed or tested.
- A priority justified by stakeholder value and project scope.
- Concrete technical tasks.
- A reference to the stakeholder need and its evidence status.
- Relevant ethical, legal, social, or economic impact and acceptance criteria when applicable.

Read the issue before editing it. Update Jira only when the user asks to modify the backlog or explicitly asks to complete that deliverable. After an authorized edit, read the issue back and confirm the saved criteria, priority, tasks, and need reference. Do not silently change sprint, assignee, or workflow state.

### 7. Deliver and close

Produce the requested brief report with a maximum of two pages when the assignment asks for it. Include the stakeholder matrix, persona evidence status, elicitation method, four revised requirement types, two validated stories, Jira links, traceability, unresolved assumptions, and a short reflection. Link to the actual backlog items rather than claiming updates that were not made.

The activity is complete only when real elicitation evidence is recorded, the matrix and persona are supported or explicitly labeled as hypotheses, all four requirement types are reviewed, at least two stories are validated and traceable, the two Jira stories are updated when authorized, and the brief report links to them.

## Sharing and Git

Keep this project skill in the tracked `skills/` directory. The repository ignores `.agents/` because it contains local MCP configuration and credentials. Do not add `.env`, local MCP configuration, tokens, or personal interview data to GitHub. Follow the user's requested branch and publication target; do not infer permission to publish from the presence of Git credentials.
