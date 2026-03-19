import { HttpClient } from '@angular/common/http';
import { inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/Message';
import { UserLoginInfo } from '../model/UserLoginDtos';
import { ChatRegisterResult } from '../model/ChatRegisterResult';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private httpClient = inject(HttpClient);
  private BASEURL = '/api';
  
  frontpage(): Observable<{text : string}> {
    return this.httpClient.get<{text : string}>(`${this.BASEURL}/test`);
  }
  
  createUser(userName: string, userLoginInfo: UserLoginInfo): Observable<ChatRegisterResult> {
    console.log(`${this.BASEURL}/register/${userName}`)
    return this.httpClient.post<ChatRegisterResult>(`${this.BASEURL}/register/${userName}`, userLoginInfo);
  }
  
  getUser(userLoginInfo: UserLoginInfo) {
    return this.httpClient.post<ChatRegisterResult>(`${this.BASEURL}/login`, userLoginInfo);
  }

  getMessages(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.BASEURL}/chat/messages`);
  }
}
