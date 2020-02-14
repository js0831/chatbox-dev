import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';
import { Subscription } from 'rxjs';
import * as conversastionActions from '../../store/conversation/conversation.action';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { WebSocketService } from 'src/app/v2/shared/services/web-socket.service';
import { WebsocketEventType } from 'src/app/v2/shared/enums/websocket-event-type.enum';

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
  profilePictures: any = [];
  onlineUsers: string[] = [];

  constructor(
    private conversationSV: ConversationService,
    private sessionSV: SessionService,
    private notificationSV: NotificationService,
    private actionSV: ActionService,
    private userSV: UserService,
    private websocketSV: WebSocketService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;

    this.subs = [
      this.watchConversationState(),
      this.watchNotificationState(),
      this.watchOnlineUsers()
    ];

    this.conversationSV.getConversations({
      id: this.currentUser._id,
      type: ConversationType.PERSONAL,
      search: '',
      pagination: {
        limit: 10,
        page: 0
      }
    }).action();
  }

  isOnline(id) {
    return this.onlineUsers.indexOf(id) >= 0;
  }

  private watchOnlineUsers() {
    return this.userSV.friendState.subscribe( x => {
      this.onlineUsers = x.users.onlines;
    });
  }

  private checkWhosOnline() {
    this.conversations.forEach( c => {
      c.members.forEach( (u: any) => {
        this.websocketSV.dispatch({
          id: u._id,
          type: WebsocketEventType.ONLINE_KABA,
          data: this.currentUser._id
        });
      });
    });
  }

  private getProfilePictures() {
    this.profilePictures = [];
    this.conversations.forEach( c => {
      const id = (c.members[0] as UserInterface)._id;
      this.profilePictures.push(this.userSV.getProfilePicture(id));
    });
  }

  private openConversationFromNotifaction() {
    if (this.actionSV.previousValue.action === 'NOTIFICATION_OPEN') {
      const ref = this.actionSV.previousValue.data.reference;
      const conversation = this.conversations.filter( c => c._id === ref);
      if (conversation.length > 0) {
        this.selectConversation(conversation[0]);
      }

    }
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
      this.notifications = x.notification.list;
    });
  }

  selectConversation(conversation: ConversationInterface) {
    this.selectedConversation = conversation;
    this.conversationSV.actionSelectConversation(conversation);

    const params = {
      userid: this.currentUser._id,
      reference: conversation._id
    };
    this.notificationSV.actionDeleteByReference(params);
    this.notificationSV.deleteByReference(params).toPromise();
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case conversastionActions.CONVERSATION_LIST_LOAD_FINISH:
          this.filterConversationMembers(x.conversation.list);
          this.openConversationFromNotifaction();
          this.getProfilePictures();
          this.checkWhosOnline();
          if (x.conversation.list.length > 0) {
            this.selectConversation(x.conversation.list[0]);
          }

          break;
        case conversastionActions.CONVERSATION_ADD:
        case conversastionActions.CONVERSATION_REMOVE:
          this.filterConversationMembers(x.conversation.list);
          this.openConversationFromNotifaction();
          this.getProfilePictures();
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
    this.conversationSV.actionActionReset();
  }
}
