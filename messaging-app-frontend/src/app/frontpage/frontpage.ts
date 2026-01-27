import { Component, DestroyRef, inject, OnInit, Signal, signal } from '@angular/core';
import { RestService } from '../service/rest.service';
import { FormsModule } from '@angular/forms';
import { Chat } from '../chat/chat';
import { ChatUser } from '../model/ChatUser';
import { ChatService } from '../service/chat.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-frontpage',
  imports: [FormsModule, Chat],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.css',
})
export class Frontpage {
  private service = inject(ChatService);
  private destroyRef = inject(DestroyRef);
  user = signal<ChatUser | undefined>(undefined);
  UserName = signal('');

  onCreateUser() {
    const username = this.UserName().toLowerCase().trim();
    if (username.length != 0) {
      this.service
        .createUser(username)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((user) => {
          this.user.set(user);
        });
    }
  }
}
