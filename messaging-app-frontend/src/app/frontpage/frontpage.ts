import { Component, signal } from '@angular/core';
import { Chat } from '../chat/chat';
import { ChatUser } from '../model/ChatUser';
import { Register } from '../register/register';
import { Login } from "../login/login";

@Component({
  selector: 'app-frontpage',
  imports: [ Chat, Register, Login],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.css',
})
export class Frontpage {
  user = signal<ChatUser | undefined>(undefined);
  
  onRegister = signal(true);
  
  onAuthComplete(user: ChatUser) {
    this.user.set(user);
  }

  onRegisterToggle() {
    this.onRegister.set(!this.onRegister());
  }
}
