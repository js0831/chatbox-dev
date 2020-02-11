import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import * as actions from '../../store/conversation/conversation.action';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { WebSocketService } from 'src/app/v2/shared/services/web-socket.service';
import { WebsocketEventType } from 'src/app/v2/shared/enums/websocket-event-type.enum';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';
import { EmojiService } from '../emoji-picker/emoji-picker.service';
import { EmojiInterface } from '../emoji-picker/emoji.interface';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, OnDestroy {


  subs: Subscription[] = [];
  selectedConversation: ConversationInterface;
  form: FormGroup;
  currentUser: UserInterface;
  typing = '';
  typingTimerView: any;
  typingTimer: any;
  caret: {
    start: number,
    end: number
  };

  @ViewChild('message', {static: true}) messageElement: ElementRef;

  constructor(
    private conversationSV: ConversationService,
    private formBuilder: FormBuilder,
    private sessionSV: SessionService,
    private websocketSV: WebSocketService,
    private notifService: NotificationService,
    private emoji: EmojiService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState(),
      this.watchWebSocketTyping(),
      this.watchWebSocketMessage()
    ];
    this.buildForm();

    this.emoji.onEmojiSelect('message', (emoji) => {
      this.appendEmoji(emoji);
    });
  }

  onBlur(e: any) {
    this.caret = {
      start: e.target.selectionStart,
      end: e.target.selectionEnd
    };
  }

  private appendEmoji(emoji: EmojiInterface) {
    const newValue = this.emoji.newValue(this.form.value.message, emoji.code, this.caret);
    this.form.get('message').patchValue(newValue);
    this.messageElement.nativeElement.focus();

    setTimeout( x => {
      this.messageElement.nativeElement.setSelectionRange(
        this.caret.start + 2,
        this.caret.start + 2,
        'none'
      );
    }, 0);
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case actions.CONVERSATION_SELECT:
          this.selectedConversation = x.conversation.selected;
          this.messageElement.nativeElement.focus();
          break;
        default:
          break;
      }
    });
  }

  private watchWebSocketTyping() {
    return this.websocketSV.listen(
      WebsocketEventType.TYPING,
      this.selectedConversation._id
    ).subscribe( (data: any) => {
      if (this.typingTimerView) {
        clearTimeout(this.typingTimerView);
      }
      this.typing = data;
      this.typingTimerView = setTimeout( z => {
        this.typing = '';
      }, 2000);
    });
  }

  private watchWebSocketMessage() {
    return this.websocketSV.listen(
      WebsocketEventType.MESSAGE,
      this.currentUser._id
    ).subscribe( x => {
      this.typing = '';
    });
  }

  sendMessage() {
    if (
      this.form.value.message.trim().length === 0 ||
      this.form.invalid ||
      !this.selectedConversation
    ) { return; }

    const tempMessageId = `temp_${new Date().getTime().toString()}`;
    const message = this.form.value.message;
    const messageData = {
      from: this.currentUser,
      message,
      date: new Date().toString()
    };

    // send to websocket
    this.selectedConversation.members.forEach( (u: any) => {
      if (this.currentUser._id !== u._id) {
        this.websocketSV.dispatch({
          id: u._id,
          type: WebsocketEventType.MESSAGE,
          data: {
            conversation: this.selectedConversation,
            message: {
              ...messageData,
              _id: tempMessageId
            }
          }
        });
      }
    });


    // append to msgs list
    this.conversationSV.actionSendMessage({
      ...messageData,
      _id: tempMessageId
    });

    // save on DB
    this.conversationSV.sendMessage(
      this.selectedConversation._id,
      {
        from: this.currentUser._id,
        message,
      }
    ).subscribe( (x: any) => {
        this.updateTemporaryID({
          temporary: tempMessageId,
          permanent: x.data
        });
    });

    this.createNotifications();
    this.form.get('message').patchValue('');
    this.messageElement.nativeElement.focus();
  }

  private updateTemporaryID(params) {
    this.conversationSV.actionUpdateTemporaryID(params);
    this.selectedConversation.members.forEach( (u: any) => {
      if (this.currentUser._id !== u._id) {
        this.websocketSV.dispatch({
          id: u._id,
          type: WebsocketEventType.UPDATE_TEMPORARY_ID,
          data: {
            conversation: this.selectedConversation,
            id: params
          }
        });
      }
    });
  }

  private createNotifications() {
    this.selectedConversation.members.forEach( x => {
      if (x._id !==  this.currentUser._id) {
        const notifMsg = this.selectedConversation.type === ConversationType.PERSONAL ? 'New message from' :
            'New Group message from';

        this.notifService.create({
          reference: this.selectedConversation._id,
          type: NotificationType.MESSAGE,
          user: x._id,
          message: `${notifMsg} ${this.currentUser.firstname}`,
        }).toPromise();
      }
    });
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      message: ['', [Validators.required]]
    });
  }

  userIsTyping(e) {
    if (e.which === 13) {
      e.preventDefault();
      this.sendMessage();
      return;
    }

    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    this.typingTimer = setTimeout( x => {
      this.websocketSV.dispatch({
        id: this.selectedConversation._id,
        type: WebsocketEventType.TYPING,
        data: this.currentUser.firstname
      });
    }, 100);
  }

  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe());
  }
}
