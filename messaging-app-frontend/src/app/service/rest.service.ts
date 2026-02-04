import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/Message';
import { UserLoginInfo } from '../model/UserLoginDtos';
import { ChatRegisterResult } from '../model/ChatRegisterResult';

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

  createUser(userName: string, userLoginInfo: UserLoginInfo): Observable<ChatRegisterResult> {
    return this.httpClient.post<ChatRegisterResult>(`${this.BASEURL}/register/${userName}`, userLoginInfo);
  }

  getMessages(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.BASEURL}/chat/messages`);
  }
}
