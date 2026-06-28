import { Component, input } from '@angular/core';
import { Message } from '../model/Message';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-chat-message',
  imports: [FormsModule, CardModule],
  templateUrl: './chat-message.html',
  styleUrl: './chat-message.css',
})
export class ChatMessage {
  message = input.required<Message>();
  currentUserId = input.required<number>();
}
