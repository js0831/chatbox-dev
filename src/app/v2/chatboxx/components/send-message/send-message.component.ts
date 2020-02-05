import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { CONVERSATION_SELECT } from '../../store/conversation/conversation.action';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { WebSocketService } from 'src/app/v2/shared/services/web-socket.service';
import { WebsocketEventType } from 'src/app/v2/shared/enums/websocket-event-type.enum';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';

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

  @ViewChild('message', {static: true}) messageElement: ElementRef;

  constructor(
    private conversationSV: ConversationService,
    private formBuilder: FormBuilder,
    private sessionSV: SessionService,
    private websocketSV: WebSocketService,
    private notifService: NotificationService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState(),
      this.watchWebSocketTyping(),
      this.watchWebSocketMessage()
    ];
    this.buildForm();
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case CONVERSATION_SELECT:
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
      this.selectedConversation._id
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

    const message = this.form.value.message;
    const messageData = {
      from: this.currentUser,
      message,
      date: new Date().toString()
    };

    // send to websocket
    this.websocketSV.dispatch({
      id: this.selectedConversation._id,
      type: WebsocketEventType.MESSAGE,
      data: messageData
    });

    // append to msgs list
    this.conversationSV.stateSendMessage(messageData);

    // save on DB
    this.conversationSV.sendMessage(
      this.selectedConversation._id,
      {
        from: this.currentUser._id,
        message,
      }
    ).toPromise();

    this.createNotifications();
    this.form.get('message').patchValue('');
    this.messageElement.nativeElement.focus();
  }

  private createNotifications() {
    this.selectedConversation.members.forEach( x => {
      if (x._id !==  this.currentUser._id) {
        this.notifService.create({
          reference: this.selectedConversation._id,
          type: NotificationType.MESSAGE,
          user: x._id,
          message: `New Message from ${this.currentUser.firstname}`,
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
