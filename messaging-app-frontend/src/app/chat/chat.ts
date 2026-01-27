import { Component, computed, inject, input, signal } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { ChatUser } from '../model/ChatUser';
import { ChatMessage } from '../chat-message/chat-message';
import { FormsModule } from '@angular/forms';
import { Message } from '../model/Message';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, ChatMessage],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  private service = inject(ChatService);
  chatMessages = this.service.getMessages();
  user = input.required<ChatUser>();
  messageContent = signal('');

  onSendMessage() {
    this.service
      .sendMessage({
        user: this.user(),
        text: this.messageContent(),
      })
      this.messageContent.set('');
  }
}
