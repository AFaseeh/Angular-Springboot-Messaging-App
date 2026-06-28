import { afterRenderEffect, Component, inject, input, Signal, signal, viewChild} from '@angular/core';
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
  
  scrollPanel = viewChild.required<ScrollPanel>('scrollPanel');
  shouldScrollToBottom = true;
  private isAutoScrolling = false; 
  
  constructor() {
    afterRenderEffect({
      write:() => {
        const messages = this.chatMessages?.();
        const panel = this.scrollPanel();
        const shouldScroll = this.shouldScrollToBottom;
        
        if (messages && panel && shouldScroll) {
          this.scrollToBottom();
        }
      }});
  }

  ngAfterViewInit() {
    const scrollElement = this.scrollPanel().contentViewChild!.nativeElement;

    if (scrollElement) {
      scrollElement.addEventListener('scroll', (event: Event) => {
        this.onScroll(event.target as HTMLElement);
      });
    }
  }
  
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
  
  scrollToBottom() {
    this.isAutoScrolling = true;
    const scrollElement : HTMLElement = this.scrollPanel().contentViewChild!.nativeElement;
    scrollElement?.scrollTo({ top: scrollElement.scrollHeight , behavior: 'smooth' });
  }

  onScroll(scrollElement: HTMLElement) {
    // Check if the user is at the bottom of the scroll panel
    // scrollTop: non rounded num, scrollHeight: rounded num, clientHeight: rounded num
    // docs: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
    const isAtBottom = Math.abs(scrollElement.scrollHeight - scrollElement.clientHeight - scrollElement.scrollTop) <= 1;

    if (this.isAutoScrolling) {
      if (isAtBottom) {
        this.isAutoScrolling = false;
      }
      return;
    }

    if (isAtBottom) {
      this.shouldScrollToBottom = true;
    } else {
      this.shouldScrollToBottom = false;
    }
  }
}
