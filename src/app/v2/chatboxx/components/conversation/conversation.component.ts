import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { Subscription } from 'rxjs';
import * as actions from '../../store/conversation/conversation.action';
import { MessageInterface } from 'src/app/v2/shared/interfaces/message.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { WebSocketService } from 'src/app/v2/shared/services/web-socket.service';
import { WebsocketEventType } from 'src/app/v2/shared/enums/websocket-event-type.enum';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { JkAlertService } from 'jk-alert';
import { ReactionInterface } from 'src/app/v2/shared/interfaces/reaction.interface';
import { ReactionService } from 'src/app/v2/shared/services/reaction.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  messages: MessageInterface[];
  currentUser: UserInterface;
  currentConversation: ConversationInterface;
  isLastPage = false;
  isLoadingPrevious = false;
  pagination = {
    page: 1,
    limit: 10
  };
  messageIdToReloadReactions = '';

  constructor(
    private conversationSV: ConversationService,
    private sessionSV: SessionService,
    private elRef: ElementRef,
    private websocketSV: WebSocketService,
    private jkAlert: JkAlertService,
    private reactionSV: ReactionService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState(),
      this.watchMessageWebSocket(),
      this.watchMessageReactWebSocket(),
      this.watchUpdateTempIdWebSocket()
    ];
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      this.currentConversation = x.conversation.selected;
      switch (x.action.name) {
        case actions.CONVERSATION_LOAD_PREVIOUS_MESSAGES:
          this.isLoadingPrevious = true;
          break;
        case actions.CONVERSATION_LOAD_PREVIOUS_MESSAGES_FINISH:
          this.messages = x.conversation.messages;
          this.isLastPage = x.action.message === 'last';
          this.elRef.nativeElement.scrollTop = this.isLastPage ? 0 : 120;
          this.isLoadingPrevious = false;
          break;
        case actions.CONVERSATION_LOAD_MESSAGES:
          if (x.action.statusCode !== 200) {
            this.jkAlert.error(x.action.message);
          } else {
            this.messages = x.conversation.messages;
            this.moveScrollToBottom();
          }
          break;
        case actions.CONVERSATION_SEND_MESSAGE:
          const newMsg = x.conversation.messages[x.conversation.messages.length - 1];
          this.messages.push(newMsg);
          this.moveScrollToBottom();
          break;

        case actions.CONVERSATION_MESSAGE_REACT_FINISH:
          this.messageIdToReloadReactions = null;
          break;
        default:
          break;
      }
    });
  }

  private sendReactionViaWebSocket(data) {
    this.currentConversation.members.forEach( (u: any) => {
      if (this.currentUser._id !== u._id) {
        this.websocketSV.dispatch({
          id: u._id,
          type: WebsocketEventType.REACT,
          data: {
            conversation: this.currentConversation,
            messageId: data.messageId,
            reaction: data.reaction
          }
        });
      }
    });
  }

  private watchMessageWebSocket() {
    return this.websocketSV.listen( WebsocketEventType.MESSAGE, this.currentUser._id )
    .subscribe( (x: {
      message: MessageInterface
    }) => {
      this.messages.push(x.message);
      this.moveScrollToBottom();
    });
  }

  private watchMessageReactWebSocket() {
    return this.websocketSV.listen( WebsocketEventType.REACT, this.currentUser._id ).subscribe( (x: {
      conversation: ConversationInterface,
      messageId: string,
      reaction: ReactionInterface
    }) => {
      if (x.conversation._id === this.currentConversation._id) {
        this.messageIdToReloadReactions = x.messageId;
        this.reactionSV.appendReactionFromWebSocket({
          messageId: x.messageId,
          reaction: x.reaction
        });
      }
    });
  }

  private watchUpdateTempIdWebSocket() {
    return this.websocketSV.listen( WebsocketEventType.UPDATE_TEMPORARY_ID, this.currentUser._id )
    .subscribe( (x: any) => {
      if (x.conversation._id === this.currentConversation._id) {
        this.conversationSV.actionUpdateTemporaryID(x.id);
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

  onReact(msgId: string, reaction: ReactionInterface) {
    this.messageIdToReloadReactions = msgId;
    const data = {
      messageId: msgId,
      reaction: {
        ...reaction,
        by: this.currentUser
      }
    };
    this.reactionSV.react(data).action();
    this.sendReactionViaWebSocket(data);
  }

  isTemporaryId(id: string) {
    return id.split('temp_').length > 1;
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
