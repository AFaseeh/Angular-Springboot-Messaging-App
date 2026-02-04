import { RxStompConfig } from '@stomp/rx-stomp';
import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { UserAuthInfo } from '../model/UserLoginDtos';

@Injectable({
  providedIn: 'root',
})
export class RxStompService extends RxStomp {
  constructor() {
    super();
  }

  public connectWithAuth(user: UserAuthInfo | undefined) {

    if (!user || !user.username || !user.token) return;

    const config: RxStompConfig = {
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 200,
      debug: (msg: string) => console.log(new Date(), msg),
    };

    this.deactivate();
    this.configure(config);
    this.activate();
  }
}
