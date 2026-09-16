import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../environments/environment';

export interface AskSuccess {
  ok: true;
  answer: string;
}

export interface AskFailure {
  ok: false;
  error: string;
}

export type AskResult = AskSuccess | AskFailure;

interface AskResponse {
  question: string;
  reponse: string;
}

const GENERIC_ERROR_MESSAGE =
  "Désolé, je n'ai pas pu obtenir de réponse pour le moment. Réessaie dans un instant.";

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  ask(question: string): Observable<AskResult> {
    return this.http.post<AskResponse>(`${environment.apiBaseUrl}/ask`, { question }).pipe(
      map((response): AskResult => ({ ok: true, answer: response.reponse })),
      catchError(() => of<AskResult>({ ok: false, error: GENERIC_ERROR_MESSAGE }))
    );
  }
}
