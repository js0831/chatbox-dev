import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { Subscription } from 'rxjs';
import { CONVERSATION_LOAD_MESSAGES, CONVERSATION_SEND_MESSAGE } from '../../store/conversation/conversation.action';
import { MessageInterface } from 'src/app/v2/shared/interfaces/message.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { WebSocketService } from 'src/app/v2/shared/services/web-socket.service';
import { WebsocketEventType } from 'src/app/v2/shared/enums/websocket-event-type.enum';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy{

  subs: Subscription[] = [];
  messages: MessageInterface[];
  currentUser: UserInterface;
  currentConversation: ConversationInterface;

  constructor(
    private conversationSV: ConversationService,
    private sessionSV: SessionService,
    private elRef: ElementRef,
    private websocketSV: WebSocketService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState(),
      this.watchWebSocket()
    ];
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      this.currentConversation = x.conversation.selected;
      switch (x.action.name) {
        case CONVERSATION_LOAD_MESSAGES:
          this.messages = x.conversation.messages;
          this.moveScrollToBottom();
          break;
        case CONVERSATION_SEND_MESSAGE:
          const newMsg = x.conversation.messages[x.conversation.messages.length - 1];
          this.messages.push(newMsg);
          this.moveScrollToBottom();
          break;
        default:
          break;
      }
    });
  }

  private watchWebSocket() {
    return this.websocketSV.listen(
      WebsocketEventType.MESSAGE,
      this.currentConversation._id
    ).subscribe( x => {
      this.messages.push(x as MessageInterface);
      this.moveScrollToBottom();
    });
  }

  isYou(id: string) {
    return this.currentUser._id === id;
  }

  isToday(d) {
    const current = new Date().toDateString();
    const compare = new Date(d).toDateString();
    return current ===  compare;
  }

  private moveScrollToBottom() {
    setTimeout(() => {
      this.elRef.nativeElement.scrollTop = 999999;
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
