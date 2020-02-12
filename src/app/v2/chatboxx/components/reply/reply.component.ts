import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { Subscription } from 'rxjs';
import * as actions from '../../store/conversation/conversation.action';
import { MessageInterface } from 'src/app/v2/shared/interfaces/message.interface';
import { ConversationState } from '../../store/conversation/conversation.state';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  replyTo: MessageInterface;

  constructor(
    private convoSV: ConversationService
  ) { }

  ngOnInit() {
    this.subs = [
      this.watchConversationState()
    ];
  }

  private watchConversationState() {
    return this.convoSV.conversationState.subscribe( (x: ConversationState) => {
      switch (x.action.name) {
        case actions.CONVERSATION_MESSAGE_REPLY:
          this.replyTo = x.conversation.reply;
          break;
        default:
          break;
      }
    });
  }

  cancel() {
    this.convoSV.actionMessageReply(null);
  }
  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
