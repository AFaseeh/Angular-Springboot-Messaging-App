import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Message } from '../model/Message';
import { RxStompService } from './RxStompService.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private stompService: RxStompService) {}

  sendMessage(message: Message) {
    console.log(JSON.stringify(message)); 
    this.stompService.publish({ destination: '/app/chat', body: JSON.stringify(message) });
  }

  getLiveMessages(): Observable<Message> {
    return this.stompService.watch('/topic/chat').pipe(
      map((message) => {
        console.log("recieved" + JSON.parse(message.body))
        return JSON.parse(message.body) as Message;
      }),
    );
  }
}
