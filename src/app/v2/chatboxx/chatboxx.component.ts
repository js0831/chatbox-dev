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
  onlineUsers: string[] = [];

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
      this.userSV.actionUserOnline(data);
    });
  }

  private watchWebsocketOnlineKaba() {
    return this.websocketSV.listen(
      WebsocketEventType.ONLINE_KABA,
      this.currentUser._id
    ).subscribe( (id: any) => {
      this.userSV.actionUserOnline({
        id,
        online: true,
      });
      this.ooOnlineAko(id);
    });
  }

  ooOnlineAko(id) {
    if (id === this.currentUser._id) { return; }
    this.websocketSV.dispatch({
      id,
      type: WebsocketEventType.OO_ONLINE_AKO,
      data: {
        id: this.currentUser._id,
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
