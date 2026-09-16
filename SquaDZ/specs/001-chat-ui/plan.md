# Implementation Plan: EPF RAG Chat Interface

**Branch**: `001-chat-ui` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-chat-ui/spec.md`

## Summary

A single-conversation chat UI in the existing Angular app (`SquaDZ/`) that lets a student ask a
question, see it added to the conversation, wait through a visible loading state, and see the
assistant's answer or a clear error. All backend communication goes through one `ChatService`
that calls the existing FastAPI `POST /ask` endpoint, with the backend base URL resolved from
Angular environment files so dev and deployed builds differ only in configuration.

## Technical Context

**Language/Version**: TypeScript ~5.9 (Angular 21, standalone components, zoneless-style signals)

**Primary Dependencies**: `@angular/common/http` (`HttpClient`), `@angular/forms` (template-driven
input binding) — no new third-party dependency added, per constitution Tech Stack constraint.

**Storage**: N/A — no persistence; conversation lives only in in-memory component/service state
for the browser session (per spec Assumptions).

**Testing**: Vitest via `@angular/build:unit-test` (already configured, `npm test`).

**Target Platform**: Modern evergreen browsers (desktop + mobile web), served by the Angular dev
server locally and a static/CDN host (e.g. Vercel) when deployed.

**Project Type**: Web frontend only (consumes an existing, separately-owned backend service).

**Performance Goals**: No explicit throughput target; interaction should feel immediate — question
appears in under 100ms of submission (client-side render, not network-bound).

**Constraints**: Must never call the LLM/vector-store provider directly or embed any secret
(constitution Principle II). Base URL must be environment-configurable, not hardcoded (Tech Stack
constraint).

**Scale/Scope**: Single student, single conversation, single browser tab/session. One feature: the
chat interface itself.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. Deploy Early, Deploy Small | This feature is the smallest end-to-end slice (one chat, one endpoint) — no extra scope added. | PASS |
| II. Backend Is the Only Gateway to the LLM | Design routes all calls through `ChatService` → existing `POST /ask`; no direct provider call, no secret in frontend. | PASS |
| III. Justify Every Choice | Every dependency below is either already present or a native Angular API; none added speculatively. | PASS |
| IV. Spec-Driven Increments | This plan follows `/speckit-specify` → `/speckit-plan`, continuing to `/speckit-tasks` → `/speckit-implement`. | PASS |
| V. Test the Contract, Not the Framework | Tests planned for `ChatService` (request/response/error mapping) and `ChatComponent` state transitions, not Angular internals. | PASS |

No violations. Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-chat-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
SquaDZ/
├── src/
│   ├── app/
│   │   ├── app.ts                       # Root standalone component (hosts ChatComponent)
│   │   ├── app.html
│   │   ├── chat/
│   │   │   ├── chat.ts                  # ChatComponent (standalone): message list + input form
│   │   │   ├── chat.html
│   │   │   ├── chat.css
│   │   │   └── chat.spec.ts             # Component state-transition tests
│   │   └── services/
│   │       ├── chat.ts                  # ChatService: HttpClient calls to POST /ask
│   │       └── chat.spec.ts             # Service request/response/error tests
│   └── environments/
│       ├── environment.ts               # apiBaseUrl: http://localhost:8000
│       └── environment.prod.ts          # apiBaseUrl: deployed backend URL
```

**Structure Decision**: Single Angular project (already scaffolded at `SquaDZ/`) — this is a
frontend-only feature against an existing external backend, so the "Option 2: Web application"
split is not needed; only the `frontend/` side already exists as `SquaDZ/` itself. New code is
added under `src/app/chat/` (UI) and `src/app/services/` (HTTP), plus `src/environments/` for the
configurable base URL required by the Tech Stack constraint.

## Complexity Tracking

*No violations — table omitted.*
