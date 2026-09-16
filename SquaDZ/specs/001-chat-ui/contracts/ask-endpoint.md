# Contract: Backend `POST /ask` (consumed, not owned by this feature)

This frontend feature is a consumer of an existing endpoint owned by the backend part of the
project (`app.py` at the repo root). Documented here so `ChatService` and its tests have a single
source of truth for the shape it depends on.

## Request

```
POST {apiBaseUrl}/ask
Content-Type: application/json

{ "question": string }
```

## Success Response

```
200 OK
Content-Type: application/json

{ "question": string, "reponse": string }
```

`ChatService` uses only `reponse` as the assistant's answer text.

## Error Responses

- Any non-2xx status (backend currently raises `500` with `{"detail": string}` on internal errors).
- Network-level failure (backend unreachable, CORS blocked, timeout).

`ChatService` MUST map both cases to the same client-side error shape (spec FR-007 does not
distinguish error causes to the student) — a generic, friendly message, not the raw backend detail
or a network stack trace.

## Known integration requirement (not part of this frontend feature's scope)

For the Angular dev server (`http://localhost:4200`) to call the FastAPI backend
(`http://localhost:8000`) directly, the backend must allow CORS from the frontend's origin. This is
a backend-side change; flagged here as a dependency so `/speckit-implement` can apply the minimal
addition if it's still missing when implementation starts.
