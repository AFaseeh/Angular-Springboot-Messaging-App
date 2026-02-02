import { Component, DestroyRef, inject, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat } from '../chat/chat';
import { ChatUser } from '../model/ChatUser';
import { ChatService } from '../service/chat.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../service/auth.service';
import { map } from 'rxjs';
import { ChatRegisterError } from '../model/ChatRegisterResult';
import { Register } from '../register/register';

@Component({
  selector: 'app-frontpage',
  imports: [FormsModule, Chat, Register],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.css',
})
export class Frontpage {
  user = signal<ChatUser | undefined>(undefined);

  onAuthComplete(user: ChatUser) {
    this.user.set(user);
  }
}
