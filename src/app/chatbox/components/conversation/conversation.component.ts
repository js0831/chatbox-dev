import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ConversationService } from './conversation.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/landing/user.service';
import { ActionService } from 'src/app/shared/services/action.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { JkAlertService } from 'jk-alert';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  messages: any[];
  currentUser: any;
  conversation: any;

  constructor(
    private convoService: ConversationService,
    private userService: UserService,
    private action: ActionService,
    private elRef: ElementRef,
    private chatService: ChatService,
    private alertService: JkAlertService
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUser;
    this.conversation = this.convoService.conversation.value;

    this.subs = [
      this.watchGetConversations(),
      this.watchAction(),
      this.watchReceiveMessage()
    ];
  }

  private watchGetConversations() {
    return this.convoService.getConversations(this.conversation.id).subscribe(z => {
      if (z.data) {
        this.messages = z.data.messages;
        this.moveScrollToBottom();
      } else {
        this.alertService.error('Conversation don\'t exist');
      }

    });
  }

  private watchAction() {
    return this.action.listen.subscribe( x => {
      if (x.name === 'MESSAGE_SEND') {
        this.messages.push(x.data);
        this.moveScrollToBottom();
      }
    });
  }

  private watchReceiveMessage() {
    return this.chatService.receiveMessage(this.conversation.id).subscribe((message: any) => {
        this.messages.push(message);
        this.moveScrollToBottom();
    });
  }

  private moveScrollToBottom() {
    setTimeout(() => {
      this.elRef.nativeElement.scrollTop = 999999;
    });
  }

  isYou(id: string) {
    return this.currentUser.info.id === id;
  }

  isToday(d) {
    const current = new Date().toDateString();
    const compare = new Date(d).toDateString();
    return current ===  compare;
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }

}
