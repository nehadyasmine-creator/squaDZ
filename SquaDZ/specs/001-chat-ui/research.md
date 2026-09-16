# Phase 0 Research: EPF RAG Chat Interface

No open unknowns remained after `/speckit-specify` + the technical context provided at planning
time. This records the decisions taken and why, so they don't need re-litigating during
implementation.

## Decision: State management via Angular signals, no store library

- **Decision**: Conversation state (`messages`, `loading`, `error`) lives as signals on
  `ChatComponent`/`ChatService`, no NgRx or other state library.
- **Rationale**: Single component, single conversation, no cross-route sharing needed. Angular 21
  signals already used in the scaffold (`app.ts`). Matches constitution Principle III (no
  speculative abstraction).
- **Alternatives considered**: NgRx/Akita — rejected as unjustified complexity for one screen's
  local state.

## Decision: HTTP via a single injectable `ChatService`

- **Decision**: One `ChatService` (in `src/app/services/`) wraps `HttpClient` and exposes a single
  method to send a question and get an answer or a typed error.
- **Rationale**: Constitution Tech Stack constraint requires one source of truth for HTTP concerns;
  keeps components free of `HttpClient` usage.
- **Alternatives considered**: Calling `HttpClient` directly from the component — rejected, violates
  the constitution's single-service rule and makes the component harder to test in isolation.

## Decision: Backend base URL via Angular environment files

- **Decision**: `environment.ts` (dev) sets `apiBaseUrl: 'http://localhost:8000'`;
  `environment.prod.ts` sets it to the deployed backend URL (placeholder until the backend is
  deployed).
- **Rationale**: Required by the constitution ("backend base URL MUST be configurable per
  environment... never hardcoded"). Standard Angular CLI mechanism (`fileReplacements` in
  `angular.json`, already wired by the CLI scaffold for the `production` configuration).
- **Alternatives considered**: Runtime config fetched from a JSON file — rejected as unnecessary
  for a single backend URL with no runtime-switchable environments in scope.

## Decision: Error handling surfaces as a chat message, not a toast/modal

- **Decision**: On HTTP failure (network error or non-2xx), `ChatService` returns a typed error;
  `ChatComponent` renders it as a distinct "error" message inline in the conversation, per FR-007.
- **Rationale**: Spec explicitly requires the error to appear "in the conversation" (edge cases +
  acceptance scenarios), and this avoids adding a UI-library dependency for toasts.
- **Alternatives considered**: Browser `alert()` — rejected, poor UX and blocks the thread; a toast
  library — rejected, adds a dependency not justified by this feature's scope.

## Decision: One question in flight at a time, enforced client-side

- **Decision**: The input/submit is disabled while `loading` is true; no client-side queueing of
  multiple pending questions.
- **Rationale**: Directly required by FR-006 and the corresponding edge case; keeps the state
  machine (`idle → waiting → answered|error`) simple and matches constitution Principle III.
- **Alternatives considered**: Allowing concurrent requests with out-of-order response handling —
  rejected as unnecessary complexity for a v1 explicitly scoped to one-at-a-time in the spec.
