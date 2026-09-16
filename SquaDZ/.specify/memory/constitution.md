<!--
Sync Impact Report
Version change: none (template) → 1.0.0
Modified principles: n/a (initial ratification)
Added sections: Core Principles (5), Tech Stack & Integration Constraints, Development Workflow, Governance
Removed sections: none
Deferred TODOs: none — all placeholders resolved from project brief and repo context
-->
# SquaDZ Frontend Constitution

## Core Principles

### I. Deploy Early, Deploy Small
A small deployed demo beats a large undeployed one. The frontend MUST have a working, publicly
reachable deployment (e.g. Vercel/Render free tier) as early as possible, even with a single
feature (chat input → answer). New features are added to the deployed app incrementally; nothing
is built for more than one iteration without being deployed and manually verified in a browser.

### II. Backend Is the Only Gateway to the LLM
The frontend MUST NOT call Z.AI (or any LLM/vector-store provider) directly, and MUST NOT embed
the shared Z.AI API key or any secret in frontend code, environment files committed to git, or
the compiled bundle. All generation and retrieval requests go through the team's FastAPI backend.
Rationale: the Z.AI key is a shared $200 budget across the whole team; a key embedded in a
client-side bundle is trivially extracted and could be drained or abused.

### III. Justify Every Choice
Every non-trivial line of code, dependency, or architectural choice MUST be explainable in plain
terms (why this approach, why this library) regardless of whether it was AI-generated or
hand-written. Prefer the simplest solution that satisfies the current spec; no speculative
abstractions, feature flags, or config for hypothetical future needs.

### IV. Spec-Driven Increments (NON-NEGOTIABLE)
No frontend feature is implemented without first going through the Spec Kit flow: `/speckit-specify`
→ `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`. Ad hoc "vibe coded" changes to
application behavior are not permitted; small copy/style fixes are exempt.

### V. Test the Contract, Not the Framework
Angular's own rendering behavior is not re-tested. Unit tests focus on code the team wrote:
the API service layer talking to the FastAPI backend (request shape, response parsing, error
handling) and any non-trivial UI state logic (e.g. chat history management). Given hackathon time
constraints, full TDD is not mandatory, but no PR merges with a broken `ng test` run.

## Tech Stack & Integration Constraints

- Frontend: Angular (as scaffolded in `SquaDZ/`), TypeScript strict mode as configured by the
  Angular CLI defaults.
- The backend base URL MUST be configurable per environment (Angular `environment.ts` /
  `environment.prod.ts`), never hardcoded inline in components or services.
- All calls to the backend go through a single injectable Angular service (one source of truth
  for HTTP concerns: base URL, headers, error handling), not scattered `HttpClient` calls in
  components.
- No other AI provider, analytics script, or third-party API is added to the frontend without
  updating this constitution first, since it may introduce new secrets or budget exposure.

## Development Workflow

- Work is tracked as Spec Kit features (spec → plan → tasks) under `SquaDZ/specs/`; each maps to
  what the team's agile board would call a ticket.
- Changes land via pull request against `main`, reviewed by at least one other team member before
  merge, per the project's agile/PR requirement.
- `/speckit-converge` is run before declaring a feature done, to catch drift between spec and
  implementation.

## Governance

This constitution supersedes ad hoc frontend practices. Amendments are made via
`/speckit-constitution`, must state the rationale for the change, and bump the version per
semantic versioning (MAJOR: principle removed/redefined incompatibly; MINOR: principle or section
added; PATCH: wording/clarification only). Every PR touching `SquaDZ/` is expected to be
compliant with these principles; a reviewer flags violations rather than silently waiving them.

**Version**: 1.0.0 | **Ratified**: 2026-09-16 | **Last Amended**: 2026-09-16
