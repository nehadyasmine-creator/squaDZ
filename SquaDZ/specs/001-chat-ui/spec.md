# Feature Specification: EPF RAG Chat Interface

**Feature Branch**: `001-chat-ui`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Interface de chat pour l'assistant RAG EPF : un étudiant ouvre le front Angular, voit une zone de conversation, tape une question dans un champ de saisie en bas, l'envoie (bouton ou touche Entrée), voit sa question apparaître dans l'historique, puis voit apparaître la réponse de l'assistant une fois reçue (avec un état de chargement pendant l'attente). Le front appelle le backend FastAPI existant via un service unique et une URL de base configurable par environnement. Gestion d'erreur simple si le backend répond une erreur ou est injoignable. Pas d'authentification, pas d'historique persistant entre sessions pour cette première itération."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask a question and get an answer (Priority: P1)

A student opens the chat page, types a question about their EPF courses, and submits it. After a
short wait, the assistant's answer appears in the conversation.

**Why this priority**: This is the entire value of the product — without it there is nothing to
demo or use.

**Independent Test**: Can be fully tested by opening the app, typing a question, submitting it,
and observing an answer appear. Delivers the core value on its own.

**Acceptance Scenarios**:

1. **Given** an empty conversation, **When** the student types a question and submits it (button
   or Enter key), **Then** the question appears immediately in the conversation history and a
   loading indicator is shown while waiting for the answer.
2. **Given** a question has been submitted and is awaiting a response, **When** the assistant's
   answer arrives, **Then** it appears in the conversation history, visually distinguished from
   the student's question, and the loading indicator disappears.

---

### User Story 2 - See a clear message when the assistant can't answer (Priority: P2)

If the backend is unreachable or returns an error, the student sees a clear, understandable
message instead of a broken or silent interface, and can try again.

**Why this priority**: Silent or confusing failures during a live demo or real usage destroy
trust in the tool; this is required for the product to be usable outside a perfect-network demo.

**Independent Test**: Can be fully tested by making the backend unreachable (or forcing an error
response) and submitting a question, then observing a clear in-conversation error message.

**Acceptance Scenarios**:

1. **Given** the backend service is unreachable, **When** the student submits a question, **Then**
   an error message appears in the conversation explaining the assistant could not respond, and
   the input remains usable to try again.
2. **Given** the backend responds with an error, **When** that response is received, **Then** a
   similarly clear error message is shown in the conversation in place of an answer.

---

### User Story 3 - Hold a back-and-forth conversation (Priority: P3)

A student asks more than one question in the same visit, and all prior questions and answers
remain visible as the conversation grows.

**Why this priority**: Realistic use is a sequence of questions, not a single one; this confirms
the interface scales to an actual study session without losing context.

**Independent Test**: Can be fully tested by submitting a question, waiting for the answer,
submitting a second question, and confirming both exchanges are visible in order.

**Acceptance Scenarios**:

1. **Given** at least one question/answer pair is already displayed, **When** the student submits
   a new question, **Then** it is appended below the existing conversation without altering or
   removing prior messages.

---

### Edge Cases

- What happens when the student submits an empty or whitespace-only question? The system MUST NOT
  submit it.
- What happens if the student tries to submit a new question while a previous one is still
  awaiting a response? The system MUST prevent it until the current exchange completes.
- How does the system handle a very long question or a very long answer? The conversation MUST
  remain readable (wrapping/scrolling), with no content silently truncated or hidden.
- What happens if the page is reloaded mid-conversation? The conversation is lost and a new, empty
  one starts (no persistence in this iteration; see Assumptions).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST let a student enter a free-text question and submit it, both via an
  explicit submit action and via pressing Enter.
- **FR-002**: The system MUST display the student's submitted question in the conversation history
  immediately upon submission.
- **FR-003**: The system MUST show a visible loading/waiting indicator between question submission
  and the assistant's answer arriving.
- **FR-004**: The system MUST display the assistant's answer in the conversation history once
  received, visually distinguished from the student's questions.
- **FR-005**: The system MUST prevent submission of an empty or whitespace-only question.
- **FR-006**: The system MUST prevent submitting a new question while a previous one is still
  awaiting a response.
- **FR-007**: The system MUST display a clear, non-technical error message in the conversation
  when the assistant fails to respond (service unreachable or error response), and MUST leave the
  student able to try again afterward.
- **FR-008**: The system MUST keep the full conversation (all question/answer pairs) visible in
  order for the duration of the browser session.
- **FR-009**: The system MUST NOT require the student to sign in or provide identifying
  information to use the chat.

### Key Entities

- **Conversation Message**: A single entry in the chat history. Has an author (student or
  assistant), text content, and a status (sent, waiting, answered, or error).
- **Conversation**: The ordered list of Conversation Messages for the current browser session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time student can ask a question and read an answer with no instructions, in
  under 30 seconds from opening the page.
- **SC-002**: 100% of submitted questions result in either a visible answer or a visible,
  understandable error — no silent failures.
- **SC-003**: The conversation remains fully readable (no overlapping or cut-off text) for
  questions and answers up to 500 words.
- **SC-004**: A student can hold a back-and-forth exchange of at least 10 question/answer pairs
  without losing any prior messages from view.

## Assumptions

- The frontend consumes an existing question-answering backend service, reachable over HTTP, that
  accepts a question and returns an answer or an error. That service is built and owned elsewhere
  in the project; this feature does not build or modify it.
- No user authentication exists or is required for this iteration; the chat is open to anyone who
  loads the page.
- No conversation history is persisted beyond the current browser session/tab.
- Only one question is in flight at a time; concurrent questions from the same student are out of
  scope for this iteration.
- The correctness/quality of the assistant's answers is outside this feature's scope — this
  feature covers the conversational interface, not answer quality.
