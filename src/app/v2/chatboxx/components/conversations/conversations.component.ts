import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';
import { Subscription } from 'rxjs';
import { CONVERSATION_LIST_LOAD_FINISH } from '../../store/conversation/conversation.action';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { NOTIFICATION_LIST_LOAD_FINISH,
  NOTIFICATION_LIVE_UPDATE,
  NOTIFICATION_DELETE } from '../../store/notification/notification.action';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnDestroy {

  currentUser: UserInterface;
  subs: Subscription[] = [];
  conversations: ConversationInterface[] = [];
  selectedConversation: ConversationInterface;
  notifications: NotificationInterface[] = [];
  searchKey = '';

  constructor(
    private conversationSV: ConversationService,
    private sessionSV: SessionService,
    private notificationSV: NotificationService,
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;

    this.subs = [
      this.watchConversationState(),
      this.watchNotificationState()
    ];

    this.conversationSV.stateLoadConversations({
      id: this.currentUser._id,
      type: ConversationType.PERSONAL,
      search: '',
      pagination: {
        limit: 10,
        page: 0
      }
    });
  }

  countNotification(reference: string) {
    return this.notifications.filter( x => {
      return x.user === this.currentUser._id &&
        NotificationType.MESSAGE === x.type &&
        reference === x.reference;
    }).length;
  }

  private watchNotificationState() {
    return this.notificationSV.notificationState.subscribe( x => {
      // switch (x.action.name) {
      //   case NOTIFICATION_LIST_LOAD_FINISH:
      //   case NOTIFICATION_LIVE_UPDATE:
      //   case NOTIFICATION_DELETE:
      this.notifications = x.notification.list;
      //     break;
      //   default:
      //     break;
      // }
    });
  }

  selectConversation(conversation: ConversationInterface) {
    this.selectedConversation = conversation;
    this.conversationSV.stateSelectConversation(conversation);

    const params = {
      userid: this.currentUser._id,
      reference: conversation._id
    };
    this.notificationSV.stateDeleteByReference(params);
    this.notificationSV.deleteByReference(params).toPromise();
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case CONVERSATION_LIST_LOAD_FINISH:
          this.filterConversationMembers(x.conversation.list);
          break;
        default:
          break;
      }
    });
  }

  private filterConversationMembers(conversations: ConversationInterface[]) {
    this.conversations = conversations.map( con => {
      con.members = (con.members as UserInterface[]).filter((u: any) => {
        return u._id !== this.currentUser._id;
      });
      return con;
    });
  }

  ngOnDestroy() {
    this.conversations = [];
    this.subs.forEach( x => x.unsubscribe());
    this.conversationSV.stateActionReset();
  }
}
