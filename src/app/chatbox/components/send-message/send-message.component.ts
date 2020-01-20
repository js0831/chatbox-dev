import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from '../conversation/conversation.service';
import { UserService } from 'src/app/landing/user.service';
import { ActionService } from 'src/app/shared/services/action.service';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { JkAlertService } from 'jk-alert';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, OnDestroy {

  message = '';
  currentUser: any;
  conversation: any;
  subs: Subscription[] = [];
  typing = '';
  typingTimer: any;
  typingViewTimer: any;

  constructor(
    private convoService: ConversationService,
    private userService: UserService,
    private action: ActionService,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private alertService: JkAlertService
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUser.info;
    this.conversation = this.convoService.conversation.value;

    this.subs = [
      this.watchUserTyping(),
      this.watchReceiveMessage()
    ];

  }

  private watchReceiveMessage() {
    return this.chatService.receiveMessage(this.conversation.id).subscribe((message: any) => {
        setTimeout( x => {
          this.typing = '';
        }, 200);
    });
  }

  private watchUserTyping() {
    return this.chatService.isTyping(this.conversation.id).subscribe((data: any) => {
        if (this.typingViewTimer) {
          clearTimeout(this.typingViewTimer);
        }
        this.typing = data;
        this.typingViewTimer = setTimeout( x => {
          this.typing = '';
        }, 2000);
    });
  }

  send() {
    if (this.message.length === 0) { return; }

    // save data on DB
    this.convoService.sendMessage({
      message: this.message,
      from: this.userService.currentUser.info.id
    }).toPromise();

    const messageData = {
        message: this.message,
        from: {
            _id: this.currentUser.id,
            firstname: this.currentUser.firstname,
            lastname: this.currentUser.lastname,
        },
        date: new Date()
    };

    // send data to conversation component to display message
    this.action.dispatch({
      name: 'MESSAGE_SEND',
      data: messageData,
    });

    // send message to web socket
    this.chatService.sendMessage({
      data: messageData,
      id: this.conversation.id
    });
    this.message = '';

    this.sendMessageNotif();
  }

  private sendMessageNotif() {
    this.notificationService.createMessageNotification({
      conversation: this.conversation.id,
      from: this.currentUser.id,
      members: this.conversation.members.filter( x => x !== this.currentUser.id)
    }).toPromise();
  }

  keypress(e) {
    if (e.which === 13) {
      this.send();
      e.preventDefault();
    }

    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    this.typingTimer = setTimeout( x => {
      this.chatService.typing(this.conversation.id, this.currentUser.firstname);
    }, 100);
  }

  soon() {
    this.alertService.info('AVAILABLE SOON!');
  }

  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe());
  }
}
