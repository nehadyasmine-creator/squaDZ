# Phase 1 Data Model: EPF RAG Chat Interface

This feature has no persisted storage. The "data model" is purely client-side, in-memory state for
the duration of a browser session.

## ConversationMessage

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Client-generated (e.g. `crypto.randomUUID()`), used as Angular `@for` track key. |
| `author` | `'student' \| 'assistant'` | Who the message belongs to. |
| `text` | `string` | Message content. For the assistant, this is the backend's `reponse` field. |
| `status` | `'sent' \| 'waiting' \| 'answered' \| 'error'` | Drives rendering (spinner vs. text vs. error styling). A student message starts `sent`; its paired assistant placeholder starts `waiting` and transitions to `answered` or `error`. |

**Validation rules** (from spec FR-005, FR-006):
- A message MUST NOT be created from empty or whitespace-only input.
- A new student message MUST NOT be created while any message has `status: 'waiting'`.

## Conversation

| Field | Type | Notes |
|---|---|---|
| `messages` | `ConversationMessage[]` | Ordered, oldest first. Never reordered or truncated (FR-008). |

**State transitions** (per exchange):

```
idle -> [submit question] -> student message (sent) + assistant placeholder (waiting)
waiting -> [backend 2xx] -> assistant message (answered)
waiting -> [backend error / unreachable] -> assistant message (error)
```

No entity is persisted beyond the in-memory `Conversation` held by `ChatService`/`ChatComponent`;
reloading the page discards it, matching the spec's Assumptions.
