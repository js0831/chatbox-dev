import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/services/session.service';
import { ActionService } from '../shared/services/action.service';
import { WebSocketService } from '../shared/services/web-socket.service';
import { WebsocketEventType } from '../shared/enums/websocket-event-type.enum';
import { UserInterface } from '../shared/interfaces/user.interface';
import { UserService } from '../shared/services/user.service';
import * as actions from '../chatboxx/store/friends/friends.action';

@Component({
  selector: 'app-chatboxx',
  templateUrl: './chatboxx.component.html',
  styleUrls: ['./chatboxx.component.scss']
})
export class ChatboxxComponent implements OnInit, OnDestroy {

  showFriends = false;
  subs: Subscription[];
  currentUser: UserInterface;
  onlineUsers: UserInterface[] = [];

  constructor(
    private actionSV: ActionService,
    private sessionSV: SessionService,
    private websocketSV: WebSocketService,
    private userSV: UserService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchActions(),
      this.watchWebsocketOnlineKaba(),
      this.watchWebsocketOoOnlineAko(),
      this.watchOnlineUsers()
    ];
  }

  private watchActions() {
    return this.actionSV.listen.subscribe( x => {
      switch (x.action) {
        case 'FRIENDS_SHOW':
          this.showFriends = x.data.value;
          break;
        default:
          break;
      }
    });
  }

  private watchWebsocketOoOnlineAko() {
    return this.websocketSV.listen(
      WebsocketEventType.OO_ONLINE_AKO,
      this.currentUser._id
    ).subscribe( (data: any) => {
      this.appendNewUserOnline(data);
    });
  }

  private watchWebsocketOnlineKaba() {
    return this.websocketSV.listen(
      WebsocketEventType.ONLINE_KABA,
      this.currentUser._id
    ).subscribe( (user: UserInterface) => {

      this.appendNewUserOnline({
        user,
        online: true,
      });

      this.ooOnlineAko(user);
    });
  }

  private appendNewUserOnline(data) {
    // avoid duplicate
    if (data.online) {
      if (this.onlineUsers.filter(u => u._id === data.user._id).length > 0) {
        return;
      }
    }

    this.userSV.actionUserOnline(data);
  }

  ooOnlineAko(user: UserInterface) {
    if (user._id === this.currentUser._id) { return; }
    this.websocketSV.dispatch({
      id: user._id,
      type: WebsocketEventType.OO_ONLINE_AKO,
      data: {
        user: this.currentUser,
        online: true
      }
    });
  }

  private watchOnlineUsers() {
    return this.userSV.friendState.subscribe( x => {
      if (x.action.name === actions.FRIEND_USER_ONLINE) {
        this.onlineUsers = x.users.onlines;
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe());
  }
}
