import { Component, inject, input, Signal, signal } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { ChatUser } from '../model/ChatUser';
import { ChatMessage } from '../chat-message/chat-message';
import { FormsModule } from '@angular/forms';
import { Message } from '../model/Message';

import { SplitterModule } from 'primeng/splitter';
import { ScrollPanel, ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, ChatMessage, SplitterModule, ScrollPanelModule, ButtonModule, InputTextModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  private service = inject(ChatService);
  chatMessages!: Signal<Message[]>;
  user = input.required<ChatUser>();
  messageContent = signal('');

  ngOnInit() {
    this.service.connectWsWithAuth();
    this.service.initChat();
    this.chatMessages = this.service.getMessages();
  }

  ngOnDestroy() {
    this.service.disconnectWs();
  }

  onSendMessage() {
    this.service.sendMessage({
      user: this.user(),
      text: this.messageContent(),
    });
    this.messageContent.set('');
  }
}
