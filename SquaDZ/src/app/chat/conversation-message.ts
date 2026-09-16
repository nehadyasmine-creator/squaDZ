export type MessageAuthor = 'student' | 'assistant';

export type MessageStatus = 'sent' | 'waiting' | 'answered' | 'error';

export interface ConversationMessage {
  id: string;
  author: MessageAuthor;
  text: string;
  status: MessageStatus;
}
