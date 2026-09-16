import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../services/chat';
import { ConversationMessage } from './conversation-message';

let nextId = 0;
function createId(): string {
  nextId += 1;
  return `msg-${nextId}`;
}

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class ChatComponent {
  private readonly chatService = inject(ChatService);

  protected readonly messages = signal<ConversationMessage[]>([]);
  protected readonly questionDraft = signal('');
  protected readonly loading = computed(() => {
    const list = this.messages();
    return list.length > 0 && list[list.length - 1].status === 'waiting';
  });

  protected submit(): void {
    const question = this.questionDraft().trim();
    if (!question || this.loading()) {
      return;
    }

    this.questionDraft.set('');
    const assistantMessageId = createId();
    this.messages.update((list) => [
      ...list,
      { id: createId(), author: 'student', text: question, status: 'sent' },
      { id: assistantMessageId, author: 'assistant', text: '', status: 'waiting' },
    ]);

    this.chatService.ask(question).subscribe((result) => {
      this.messages.update((list) =>
        list.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                status: result.ok ? 'answered' : 'error',
                text: result.ok ? result.answer : result.error,
              }
            : message
        )
      );
    });
  }
}
