import { DestroyRef, Injectable, Signal, signal } from '@angular/core';
import { RestService } from './rest.service';
import { WebSocketService } from './web-socket.service';
import { Message } from '../model/Message';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserLoginInfo } from '../model/UserLoginDtos';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  messages = signal<Message[]>([]);
  maxLen = 5;
  currentUserId?: number;

  constructor(
    private rest: RestService,
    private ws: WebSocketService,
    private destroyRef: DestroyRef,
  ) {
    this.ws
      .getLiveMessages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((msg) => {
        if (msg) {
          this.messages.update((msgs) => {
            const updatedMsgs = [...msgs, msg];
            if (updatedMsgs.length > this.maxLen) updatedMsgs.shift();
            return updatedMsgs;
          });
        }
      });
  }

  createUser(name: string, userLoginInfo: UserLoginInfo) {
    return this.rest.createUser(name, userLoginInfo);
  }

  sendMessage(msg: Message) {
    this.ws.sendMessage(msg);
  }

  initChat() {
    this.rest
      .getMessages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((msgs) => {
        this.messages.set(msgs.slice(-this.maxLen));
      });
  }

  getMessages(): Signal<Message[]> {
    return this.messages.asReadonly();
  }

  connectWsWithAuth() {
    this.ws.connectWsWithAuth();
  }
  
  disconnectWs()
  {
    this.ws.disconnectWs();
  }
}
