import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { ChatService, AskResult } from './chat';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends the question as the exact request body', () => {
    service.ask('Qu\'est-ce que le RAG ?').subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/ask`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ question: 'Qu\'est-ce que le RAG ?' });

    req.flush({ question: 'Qu\'est-ce que le RAG ?', reponse: 'Une réponse.' });
  });

  it('extracts the answer text on success', async () => {
    const resultPromise = new Promise<AskResult>((resolve) => {
      service.ask('question').subscribe((result) => resolve(result));
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/ask`);
    req.flush({ question: 'question', reponse: 'Une réponse.' });

    const result = await resultPromise;
    expect(result).toEqual({ ok: true, answer: 'Une réponse.' });
  });

  it('maps a non-2xx response to a generic error result', async () => {
    const resultPromise = new Promise<AskResult>((resolve) => {
      service.ask('question').subscribe((result) => resolve(result));
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/ask`);
    req.flush({ detail: 'Erreur interne : boom' }, { status: 500, statusText: 'Server Error' });

    const result = await resultPromise;
    expect(result.ok).toBe(false);
    expect((result as { error: string }).error).not.toContain('boom');
  });

  it('maps a network error to the same generic error result', async () => {
    const resultPromise = new Promise<AskResult>((resolve) => {
      service.ask('question').subscribe((result) => resolve(result));
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/ask`);
    req.error(new ProgressEvent('error'));

    const result = await resultPromise;
    expect(result.ok).toBe(false);
  });
});
