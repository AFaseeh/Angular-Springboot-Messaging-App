import { RxStompConfig } from '@stomp/rx-stomp';
import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { UserLoginInfo } from '../model/UserLoginDto';

@Injectable({
  providedIn: 'root',
})
export class RxStompService extends RxStomp {
  constructor() {
    super();
  }

  public connectWithAuth(user: UserLoginInfo | undefined) {

    if (!user || !user.username || !user.password) return;

    const config: RxStompConfig = {
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Basic ${btoa(user.username + ':' + user.password)}`,
      },
      heartbeatIncoming: 0,
      heartbeatOutgoing: 2000000, // TODO: 20000
      reconnectDelay: 200,
      debug: (msg: string) => console.log(new Date(), msg),
    };

    this.deactivate();
    this.configure(config);
    this.activate();
  }
}
