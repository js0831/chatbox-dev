import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { FriendState } from '../../store/friends/friend.state';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { FriendsType } from '../../store/friends/friends-type.enum';
import * as actions from '../../store/friends/friends.action';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import * as conversationActions from '../../store/conversation/conversation.action';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { WebSocketService } from 'src/app/v2/shared/services/web-socket.service';
import { WebsocketEventType } from 'src/app/v2/shared/enums/websocket-event-type.enum';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  currentUser: UserInterface;
  friendState: FriendState;
  friends: UserInterface[] = [];
  searchKey = '';
  searhTimer: any;
  selectedConversation: ConversationInterface;
  members: any[] = [];
  lastAddedUser: UserInterface;
  profilePictures = [];

  constructor(
    private userSV: UserService,
    private sessionSV: SessionService,
    private conversationSV: ConversationService,
    private actionSV: ActionService,
    private notifSV: NotificationService,
    private websocketSV: WebSocketService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchFriendState(),
      this.watchConversationState()
    ];

    const params = {
      id: this.currentUser._id,
      pagination: {
        page: 0,
        limit: 10
      },
      type: FriendsType.FRIENDS,
      search: '',
    };
    this.userSV.stateGetFriends(params);
  }

  private getProfilePictures() {
    this.profilePictures = this.friends.map( x => {
      return this.userSV.getProfilePicture(x._id);
    });
  }

  add(user: UserInterface) {
    this.lastAddedUser = user;
    this.conversationSV.addMember({
      conversation: this.selectedConversation._id,
      user,
    }).action();
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      this.selectedConversation = x.conversation.selected;
      this.members = x.conversation.selected.members;

      if (x.action.name === conversationActions.CONVERSATION_GROUP_ADD_MEMBER_FINISH) {
        this.sendAddMemberNotification();
      }
    });
  }

  private sendAddMemberNotification() {
    const msg =  ` added you in ${this.selectedConversation.name} Chat Group`;
    const notificationData: NotificationInterface = {
      reference: this.selectedConversation._id,
      type: NotificationType.GROUP_MEMBER_ADD,
      user: this.lastAddedUser._id,
      message: this.currentUser.firstname + msg,
    };

    // save on DB
    this.notifSV.create(notificationData).toPromise();

    // send friend notif via websocket
    this.websocketSV.dispatch({
      id: this.lastAddedUser._id,
      type: WebsocketEventType.GROUP_MEMBER_ADD,
      data: {
        ...notificationData,
        createdDate: new Date(),
        seen: false
      }
    });
  }

  private watchFriendState() {
    return this.userSV.friendState.subscribe( x => {
      if (x.action.name === actions.FRIEND_LOAD_USER_LIST_FINISH) {
        this.friendState = x;
        this.searchKey = x.users.search;
        this.friends = x.users.list;
        this.getProfilePictures();
      }
    });
  }

  isMember(id: string) {
    return !this.selectedConversation ? false :
    this.members.filter( (con: any) => {
      return con._id === id;
    }).length > 0;
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

  close() {
    this.actionSV.dispatch({
      action: 'ADD_MEMBER',
      data: false
    });
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
