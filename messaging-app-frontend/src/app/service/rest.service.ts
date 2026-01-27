import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/Message';
import { ChatUser } from '../model/ChatUser';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private BASEURL = 'http://localhost:8080/api';

  frontpage(): Observable<{text : string}> {
    return this.httpClient.get<{text : string}>(`${this.BASEURL}/test`);
  }

  createUser(userName: string): Observable<ChatUser> {
    return this.httpClient.post<ChatUser>(`${this.BASEURL}/users/add/${userName}`, null);
  }

  getMessages(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.BASEURL}/chat/messages`);
  }
}
