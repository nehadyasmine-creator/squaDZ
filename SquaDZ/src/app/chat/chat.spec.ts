import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { ChatService, AskResult } from '../services/chat';
import { ChatComponent } from './chat';

describe('ChatComponent', () => {
  function setup() {
    const subjects: Subject<AskResult>[] = [];
    const ask = () => {
      const subject = new Subject<AskResult>();
      subjects.push(subject);
      return subject;
    };
    TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [{ provide: ChatService, useValue: { ask } }],
    });
    const fixture = TestBed.createComponent(ChatComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    function type(text: string) {
      component['questionDraft'].set(text);
    }
    function submit() {
      component['submit']();
    }
    function respond(index: number, result: AskResult) {
      subjects[index].next(result);
      subjects[index].complete();
    }

    return { fixture, component, type, submit, respond };
  }

  it('adds the student message immediately and shows a waiting state on submit', () => {
    const { component, type, submit } = setup();

    type("Qu'est-ce que le RAG ?");
    submit();

    const messages = component['messages']();
    expect(messages.length).toBe(2);
    expect(messages[0]).toEqual(
      expect.objectContaining({ author: 'student', text: "Qu'est-ce que le RAG ?", status: 'sent' })
    );
    expect(messages[1].status).toBe('waiting');
    expect(component['loading']()).toBe(true);
  });

  it('shows the assistant answer and clears loading on success', () => {
    const { component, type, submit, respond } = setup();

    type('question');
    submit();
    respond(0, { ok: true, answer: 'Une réponse.' });

    const messages = component['messages']();
    expect(messages[1]).toEqual(expect.objectContaining({ status: 'answered', text: 'Une réponse.' }));
    expect(component['loading']()).toBe(false);
  });

  it('does not submit an empty or whitespace-only question', () => {
    const { component, type, submit } = setup();

    type('   ');
    submit();

    expect(component['messages']().length).toBe(0);
  });

  it('blocks a new submission while a previous one is awaiting a response', () => {
    const { component, type, submit } = setup();

    type('first');
    submit();
    type('second');
    submit();

    const messages = component['messages']();
    expect(messages.length).toBe(2);
    expect(messages[0].text).toBe('first');
  });

  it('shows a friendly error message and clears loading on failure, allowing retry', () => {
    const { component, type, submit, respond } = setup();

    type('question');
    submit();
    respond(0, { ok: false, error: "Désolé, je n'ai pas pu répondre." });

    const messages = component['messages']();
    expect(messages[1]).toEqual(
      expect.objectContaining({ status: 'error', text: "Désolé, je n'ai pas pu répondre." })
    );
    expect(component['loading']()).toBe(false);

    type('retry');
    submit();
    expect(component['messages']().length).toBe(4);
  });

  it('keeps prior exchanges when a second question is submitted', () => {
    const { component, type, submit, respond } = setup();

    type('first question');
    submit();
    respond(0, { ok: true, answer: 'first answer' });

    type('second question');
    submit();
    respond(1, { ok: true, answer: 'second answer' });

    const messages = component['messages']();
    expect(messages.length).toBe(4);
    expect(messages.map((m) => m.text)).toEqual([
      'first question',
      'first answer',
      'second question',
      'second answer',
    ]);
  });
});
