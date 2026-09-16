# Tasks: EPF RAG Chat Interface

**Input**: Design documents from `specs/001-chat-ui/`
**Prerequisites**: [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ask-endpoint.md](./contracts/ask-endpoint.md), [quickstart.md](./quickstart.md)

All frontend paths are relative to `SquaDZ/` (the Angular project root). `app.py` is at the repo root, outside `SquaDZ/`.

## Phase 1: Setup

- [X] T001 Add `src/environments/environment.ts` (`apiBaseUrl: 'http://localhost:8000'`) and `src/environments/environment.prod.ts` (`apiBaseUrl` placeholder for the deployed backend), and wire `fileReplacements` for the `production` configuration in `angular.json` if not already present.
- [X] T002 [P] Add CORS middleware to the FastAPI backend (`app.py` at repo root) allowing the Angular dev origin (`http://localhost:4200`), so the frontend can call `POST /ask` cross-origin locally — minimal, additive change per [contracts/ask-endpoint.md](./contracts/ask-endpoint.md).

## Phase 2: Foundational (blocking prerequisites)

- [X] T003 [P] Define the `ConversationMessage` type in `src/app/chat/conversation-message.ts` per data-model.md: `id: string`, `author: 'student' | 'assistant'`, `text: string`, `status: 'sent' | 'waiting' | 'answered' | 'error'`.
- [X] T004 Implement `ChatService` in `src/app/services/chat.ts`: injectable, uses `HttpClient` to POST `{ question: string }` to `${environment.apiBaseUrl}/ask`, returns the `reponse` string on success, and maps any non-2xx response or network error to the same generic error result (never the raw backend `detail`), per [contracts/ask-endpoint.md](./contracts/ask-endpoint.md).
- [X] T005 Write `ChatService` tests in `src/app/services/chat.spec.ts` using `HttpClientTestingModule`/`HttpTestingController`: request body is exactly `{ question }`; success path extracts `reponse`; a non-2xx response and a network error both map to the same generic error result.

**Checkpoint**: `ChatService` is fully implemented and tested before any UI work begins.

## Phase 3: User Story 1 - Ask a question and get an answer (Priority: P1) 🎯 MVP

**Goal**: Student types a question, sees it appear, sees a loading state, then sees the answer.
**Independent Test**: Open the app, type and submit a question, observe the answer appear.

- [X] T006 [US1] Create standalone `ChatComponent` in `src/app/chat/chat.ts` with signals: `messages: ConversationMessage[]`, `questionDraft: string`, and a derived `loading` signal (true when the last message has `status: 'waiting'`).
- [X] T007 [US1] Implement the submit handler on `ChatComponent`: reject empty/whitespace-only input per FR-005 ("System MUST prevent submission of an empty or whitespace-only question"); reject submission while `loading` is true per FR-006 ("System MUST prevent submitting a new question while a previous one is still awaiting a response"); otherwise append a `sent` student message and a `waiting` assistant placeholder, then call `ChatService`.
- [X] T008 [US1] Create `src/app/chat/chat.html`: conversation list via `@for` over `messages` (track by `id`) with distinct styling for student vs. assistant messages, an input field bound to `questionDraft`, a submit button, and Enter-key submission; show a loading indicator while `loading()` is true.
- [X] T009 [P] [US1] Create `src/app/chat/chat.css` with simple, readable styling (message bubbles, input pinned at the bottom) — no UI library dependency added, per constitution Tech Stack constraint.
- [X] T010 [US1] Wire `ChatComponent` into `src/app/app.html` and `src/app/app.ts`, replacing the default Angular CLI placeholder template.
- [X] T011 [US1] Write `ChatComponent` tests in `src/app/chat/chat.spec.ts`: submitting a question adds a student message immediately and shows loading (FR-002, FR-003); a successful `ChatService` response adds an assistant message and clears loading (FR-004); empty/whitespace submission is a no-op (FR-005); submitting while loading is blocked (FR-006).

**Checkpoint**: User Story 1 is independently testable and deployable — this is the MVP slice.

## Phase 4: User Story 2 - See a clear message when the assistant can't answer (Priority: P2)

**Goal**: Backend failure produces a visible, friendly in-conversation message, and the student can retry.
**Independent Test**: Force the backend to be unreachable or return an error, submit a question, observe the error message, then confirm the input is usable again.

- [X] T012 [US2] Extend the `ChatComponent` submit handler to handle a `ChatService` error result: update the pending assistant placeholder to `status: 'error'` with a friendly message per FR-007 ("System MUST display a clear, non-technical error message... and MUST leave the student able to try again"), and clear `loading`.
- [X] T013 [P] [US2] Extend `chat.css`/`chat.html` to visually distinguish error messages from normal assistant answers.
- [X] T014 [US2] Write a `ChatComponent` test: on a `ChatService` error result, an error message appears in `messages` and `loading` returns to `false`, allowing a new submission.

**Checkpoint**: User Stories 1 and 2 both independently testable — failures no longer look silent or broken.

## Phase 5: User Story 3 - Hold a back-and-forth conversation (Priority: P3)

**Goal**: Multiple question/answer exchanges accumulate without losing prior messages.
**Independent Test**: Submit a question, get an answer, submit a second question, confirm both exchanges remain visible in order.

- [X] T015 [US3] Verify (and adjust if needed) that the `ChatComponent` submit handler always appends to `messages` and never replaces or clears it, satisfying FR-008 ("System MUST keep the full conversation... visible in order for the duration of the browser session").
- [X] T016 [P] [US3] Write a `ChatComponent` test: after one completed exchange, submitting a second question results in both exchanges present in `messages`, in order.

**Checkpoint**: All three user stories independently testable.

## Phase 6: Polish & Cross-Cutting

- [X] T017 Run `npm test` in `SquaDZ/` and fix any failures surfaced by the tasks above.
- [ ] T018 Manually run through [quickstart.md](./quickstart.md) steps 1-7 end-to-end against the local backend, per constitution Principle I (verify in a browser before calling the feature done).
- [ ] T019 [P] Update `SquaDZ/README.md` "3. Partie Frontend & Déploiement Cloud" section with instructions to run the chat UI locally (currently empty).

## Dependencies

- **Setup (T001-T002)**: no dependencies; can start immediately.
- **Foundational (T003-T005)**: depends on Setup (T004 needs `environment.ts`'s `apiBaseUrl` from T001).
- **User Story 1 (T006-T011)**: depends on Foundational (needs `ChatService` and `ConversationMessage`).
- **User Story 2 (T012-T014)**: depends on User Story 1 (extends the same component/submit handler).
- **User Story 3 (T015-T016)**: depends on User Story 1; independent of User Story 2.
- **Polish (T017-T019)**: depends on all prior phases.

## Parallel Example

Within Foundational, T003 (`ConversationMessage` type) can be done in parallel with T004 (`ChatService`) — different files, no shared dependency. Within User Story 1, T009 (CSS) can be done in parallel with T006-T008/T010 (component logic/template) — different file.

## Implementation Strategy

**MVP first**: Complete Phase 1 → Phase 2 → Phase 3 (User Story 1) only, then run T017-T018. That alone is a deployable, demoable slice per constitution Principle I ("Deploy Early, Deploy Small"). Add User Story 2, then User Story 3, as incremental deployments — each phase leaves the app in a working, demoable state.
