import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/landing/user.service';
import { ConversationService } from '../conversation/conversation.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Subscription } from 'rxjs';
import { ActionService } from 'src/app/shared/services/action.service';

@Component({
  selector: 'app-message-notification',
  templateUrl: './message-notification.component.html',
  styleUrls: ['./message-notification.component.scss']
})
export class MessageNotificationComponent implements OnInit, OnDestroy {

  @Input() user: string;
  @Output() conversation?: EventEmitter<{
    id: string,
    members: string[]
  }> = new EventEmitter<{
    id: string,
    members: string[]
  }>();
  currentUser: any;
  count = 0;
  subs: Subscription[] = [];
  convoId: string;

  constructor(
    private userService: UserService,
    private convoService: ConversationService,
    private notifService: NotificationService,
    private chatService: ChatService,
    private action: ActionService
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUser.info;

    this.subs = [
      this.getConversation()
    ];
  }

  private getConversation() {
    return this.convoService.getConversation([
      this.currentUser.id,
      this.user,
    ]).subscribe( z => {
      this.convoId = z.data.id;
      this.conversation.emit({
        id: this.convoId,
        members: z.data.members
      });
      this.watchReceiveMessage();
      this.watchAction();


      if (this.convoId) {
        this.notifService.getMessageNotification(this.convoId, this.user, this.currentUser.id).subscribe( (x: any) => {
          this.count = x.data.length;
        });
      }

    });
  }

  private watchAction() {

    this.subs.push(this.action.listen.subscribe( x => {
      if (x.name === 'CONVERSATION_VIEW' && this.convoId === x.data.conversationId) {
        this.count = 0;
      }
    }));
  }

  private watchReceiveMessage() {
    /**
     * TODO:
     * Dont create notification when friend is active
     */
    this.subs.push(this.chatService.receiveMessage(this.convoId).subscribe((message: any) => {
      if (this.convoId !== this.convoService.conversation.value.id) {
        this.count += 1;
      }

    }));
  }

  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe());
  }

}
