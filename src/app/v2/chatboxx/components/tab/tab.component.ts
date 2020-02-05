import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { NOTIFICATION_LIST_LOAD_FINISH, NOTIFICATION_LIVE_UPDATE, NOTIFICATION_DELETE } from '../../store/notification/notification.action';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { CONVERSATION_LIST_LOAD_FINISH, CONVERSATION_SELECT } from '../../store/conversation/conversation.action';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { WebSocketService } from 'src/app/v2/shared/services/web-socket.service';
import { WebsocketEventType } from 'src/app/v2/shared/enums/websocket-event-type.enum';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';
import { MessageInterface } from 'src/app/v2/shared/interfaces/message.interface';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  webSocketSubs: Subscription[] = [];
  currentUser: UserInterface;
  conversations: ConversationInterface[] = [];
  selectedConversation: ConversationInterface;
  totalNotifs = 0;
  tabs = [
    {
      id: 'messages',
      icon: 'message',
      count: 0
    },
    {
      id: 'groups',
      icon: 'grouppeople',
      count: 0
    },
    {
      id: 'notifications',
      icon: 'notifications',
      count: 0
    }
  ];
  activeTab: any;

  constructor(
    private notificationSV: NotificationService,
    private sessionSV: SessionService,
    private actionSV: ActionService,
    private conversationSV: ConversationService,
    private websocketSV: WebSocketService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchnotificationState(),
      this.watchConversationState(),
      this.watchAction()
    ];

    this.notificationSV.stateLoadNotifications(this.currentUser._id);
    this.selectTab(this.tabs[0]);
  }

  private watchAction() {
    return this.actionSV.listen.subscribe( x => {
      if (
          x.action === 'NOTIFICATION_OPEN' &&
          ( x.data.type === NotificationType.MESSAGE ||
          x.data.type === NotificationType.FRIEND_REQUEST_ACCEPT )
      ) {
        const tabIndex = x.data.message.indexOf('Group') >= 0 ? 1 : 0;
        this.selectTab(this.tabs[tabIndex]);
      }
    });
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case CONVERSATION_LIST_LOAD_FINISH:
          this.conversations = x.conversation.list;
          this.watchWebSocket();
          break;
        case CONVERSATION_SELECT:
          this.selectedConversation = x.conversation.selected;
          break;
        default:
          break;
      }
    });
  }

  private watchWebSocket() {
    this.webSocketSubs.forEach( x => x.unsubscribe());

    // listen to websocket message
    this.listenToMessageLiveNotification();

    // listen to friend request websocket
    this.webSocketSubs.push(
      this.websocketSV.listen(WebsocketEventType.FRIEND_REQUEST, this.currentUser._id)
      .subscribe(
        (x: NotificationInterface) => {
          this.notificationSV.stateUpdateNotification(x);
      })
    );

    // listen to friend request accept
    this.webSocketSubs.push(
      this.websocketSV.listen(WebsocketEventType.FRIEND_REQUEST_ACCEPT, this.currentUser._id)
      .subscribe(
        (x: NotificationInterface) => {
          this.notificationSV.stateUpdateNotification(x);
      })
    );
  }

  private listenToMessageLiveNotification() {
    this.webSocketSubs.push(
      this.websocketSV.listen(WebsocketEventType.MESSAGE, this.currentUser._id).subscribe( (ws: {
        conversation: ConversationInterface,
        message: any
      }) => {
          if (!this.selectedConversation || this.selectedConversation._id !== ws.conversation._id) {

            const notifMsg = ws.conversation.type === ConversationType.PERSONAL ? 'New message from' :
            'New Group message from';
            const liveNotif: NotificationInterface = {
              _id: new Date().getTime().toString(),
              user: this.currentUser._id,
              type: NotificationType.MESSAGE,
              reference: ws.conversation._id,
              message: `${notifMsg} ${ws.message.from.firstname}`,
              createdDate: ws.message.date
            };
            this.notificationSV.stateUpdateNotification(liveNotif);
          }
      })
    );
  }

  private watchnotificationState() {
    return this.notificationSV.notificationState.subscribe( x => {
      // switch (x.action.name) {
      //   case NOTIFICATION_LIST_LOAD_FINISH:
      //   case NOTIFICATION_LIVE_UPDATE:
      //   case NOTIFICATION_DELETE:
      this.tabs[2].count = x.notification.list.filter( n => {
        return !n.seen;
      }).length;
      //     break;
      //   default:
      //     break;
      // }
    });
  }

  selectTab(tab: any) {
    this.activeTab = tab;
    this.selectTabAction();
  }

  private selectTabAction() {
    this.actionSV.dispatch({
      action: 'TAB_SELECT',
      data: this.activeTab
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
    this.webSocketSubs.forEach( x => x.unsubscribe());
    this.conversationSV.stateActionReset();
  }
}
