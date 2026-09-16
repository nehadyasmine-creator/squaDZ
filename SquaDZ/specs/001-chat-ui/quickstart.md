# Quickstart: EPF RAG Chat Interface

## Prerequisites

- Backend running locally: from the repo root, `pip install -r requirements.txt` then
  `uvicorn app:app --reload` (serves on `http://127.0.0.1:8000`, see [contracts/ask-endpoint.md](./contracts/ask-endpoint.md)
  for the CORS dependency).
- Frontend dependencies installed: from `SquaDZ/`, `npm install` (already done in this repo).

## Run

```bash
cd SquaDZ
npm start        # ng serve, http://localhost:4200
```

## Validate the feature end-to-end

1. Open `http://localhost:4200`.
2. Type a question (e.g. "Qu'est-ce que le RAG ?") in the input at the bottom and press Enter.
   - Expect: the question appears immediately in the conversation; a loading indicator shows.
3. Wait for the response.
   - Expect: the assistant's answer appears, visually distinct from the question; loading indicator
     clears. (Success Criteria SC-001)
4. Ask a second question.
   - Expect: both exchanges remain visible, in order. (User Story 3, SC-004)
5. Stop the backend (`Ctrl+C` on `uvicorn`) and submit another question.
   - Expect: a clear, non-technical error message appears in the conversation; input is usable
     again afterward. (User Story 2, SC-002)
6. Try submitting an empty question (just spaces).
   - Expect: nothing is submitted (FR-005).
7. Submit a question, then immediately try to submit another before the answer arrives.
   - Expect: the second submission is blocked until the first completes (FR-006).

## Automated tests

```bash
cd SquaDZ
npm test
```

Expect passing tests for `ChatService` (request shape, success/error mapping — see
[contracts/ask-endpoint.md](./contracts/ask-endpoint.md)) and `ChatComponent` (state transitions —
see [data-model.md](./data-model.md)).
