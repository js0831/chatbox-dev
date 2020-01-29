import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { FriendsType } from '../../store/friends/friends-type.enum';
import { Subscription } from 'rxjs';
import { FRIEND_LOAD_USER_LIST_FINISH } from '../../store/friends/friends.action';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { JkAlertService } from 'jk-alert';
import { FriendState } from '../../store/friends/friend.state';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { ResponseInterface } from 'src/app/v2/shared/interfaces/reponse.interface';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { WebSocketService } from 'src/app/v2/shared/services/web-socket.service';
import { WebsocketEventType } from 'src/app/v2/shared/enums/websocket-event-type.enum';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { ActionService } from 'src/app/v2/shared/services/action.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  friendType = FriendsType;
  currentUser: UserInterface;
  friendState: FriendState;
  searchKey = '';
  searhTimer: any;

  removeActionButton: string[] = [];

  constructor(
    private actionSV: ActionService,
    private userSV: UserService,
    private sessionSV: SessionService,
    private alertSV: JkAlertService,
    private notifSV: NotificationService,
    private conversationSV: ConversationService,
    private websocketSV: WebSocketService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchFriendState()
    ];
  }

  iSearch() {
    if (this.searhTimer) { clearTimeout(this.searhTimer); }
    this.searhTimer = setTimeout( x => {
      const params = {
        id: this.currentUser._id,
        type: this.friendState.users.type,
        pagination: {
          ...this.friendState.users.pagination,
          page: 0
        },
        search: this.searchKey
      };

      this.userSV.stateGetFriends(params);
    }, 1000);
  }

  private watchFriendState() {
    return this.userSV.friendState.subscribe( x => {
      if (x.action.name === FRIEND_LOAD_USER_LIST_FINISH) {
        this.friendState = x;
        this.searchKey = x.users.search;
        this.removeActionButton = [];
      }
    });
  }

  close() {
    this.actionSV.dispatch({action: 'FRIENDS_SHOW', data: {
      value: false
    }});
  }

  doFriendAction(action: string, user: UserInterface) {
    switch (action) {
      case 'invite':
        this.userSV.inviteUser(user._id, this.currentUser._id).subscribe( x => {
          this.disableActionButton(user._id);
          this.createFriendRequestNotifications(user._id);
        });
        break;
      case 'cancel':
        this.cancelInvitation(user._id);
        break;
      case 'unfriend':
        this.unfriendUser(user._id);
        break;
      default:
        this.respondToFriendRequest(user._id, action);
        break;
    }
  }

  private createFriendRequestNotifications(userId: string) {

    const notificationData: NotificationInterface = {
      reference: this.currentUser._id,
      type: NotificationType.FRIEND_REQUEST,
      user: userId,
      message: `${this.currentUser.firstname} sent you a friend request`,
    };

    // save on DB
    this.notifSV.create(notificationData).toPromise();

    // send friend notif via websocket
    this.websocketSV.dispatch({
      id: userId,
      type: WebsocketEventType.FRIEND_REQUEST,
      data: {
        ...notificationData,
        createdDate: new Date(),
        seen: false
      }
    });
  }

  private respondToFriendRequest(userId: string, respond: string) {
    this.userSV.respondToFriendRequest(userId, this.currentUser._id, respond)
    .subscribe( (x: ResponseInterface<ConversationInterface>) => {
      this.disableActionButton(userId);
      this.conversationSV.stateAddConversation(x.data);
    });
  }

  private unfriendUser(id: string) {
    this.alertSV.confirm('Are you sure?', ['Yes', 'No']).then( x => {
      if (x === 0) {
        this.userSV.unfriend(id, this.currentUser._id).subscribe( (res: any) => {
          this.disableActionButton(id);
          this.conversationSV.stateRemoveConversation(res.data._id);
        });
      }
    });
  }

  private cancelInvitation(id: string) {
    this.alertSV.confirm('Are you sure?', ['Yes', 'No']).then( x => {
      if (x === 0) {
        this.userSV.cancelInvite(this.currentUser._id, id).subscribe( res => {
          this.disableActionButton(id);
        });
      }
    });
  }

  private disableActionButton(id: string) {
    this.removeActionButton.push(id);
  }

  pageChanged(page: number) {
    const params = {
      id: this.currentUser._id,
      type: this.friendState.users.type,
      pagination: this.friendState.users.pagination,
      search: this.friendState.users.search
    };

    this.userSV.stateGetFriends(params);
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
