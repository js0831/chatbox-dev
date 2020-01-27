import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { Subscription } from 'rxjs';
import { CONVERSATION_LOAD_MESSAGES, CONVERSATION_SEND_MESSAGE } from '../../store/conversation/conversation.action';
import { MessageInterface } from 'src/app/v2/shared/interfaces/message.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy{

  subs: Subscription[] = [];
  messages: MessageInterface[];
  currentUser: UserInterface;

  constructor(
    private conversationSV: ConversationService,
    private sessionSV: SessionService,
    private elRef: ElementRef
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState()
    ];
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
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
