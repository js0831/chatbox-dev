import { Component, OnInit, OnDestroy } from '@angular/core';
import { DropdownActionInterface } from 'src/app/v2/shared/interfaces/dropdown-action.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { WebSocketService } from 'src/app/v2/shared/services/web-socket.service';
import { WebsocketEventType } from 'src/app/v2/shared/enums/websocket-event-type.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  currentUser: UserInterface;
  onlineUsers: UserInterface[];
  showAction = false;
  profilePicture: any;
  actions: DropdownActionInterface[] = [
    {
      label: 'Profile',
      value: 'PROFILE',
      icon: 'profile'
    },
    {
      label: 'Friends',
      value: 'FRIENDS',
      icon: 'users'
    },
    {
      label: 'Logout',
      value: 'LOGOUT',
      icon: 'off'
    }
  ];

  constructor(
    private actionSV: ActionService,
    private sessionSV: SessionService,
    private router: Router,
    private userSV: UserService,
    private websocketSV: WebSocketService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchAction(),
      this.watchOnlineUsers()
    ];

    this.profilePicture = this.userSV.getProfilePicture(this.currentUser._id);
  }

  private watchOnlineUsers() {
    return this.userSV.friendState.subscribe( x => {
      this.onlineUsers = x.users.onlines;
    });
  }

  private watchAction() {
    return this.actionSV.listen.subscribe( (x: any) => {
      switch (x.action) {
        case 'NOTIFICATION_OPEN':
          if (x.data.type === NotificationType.FRIEND_REQUEST) {
            this.action('FRIENDS');
          }
          break;
        case 'PROFILE_PICTURE_UPDATE':
          this.profilePicture = this.userSV.getProfilePicture(this.currentUser._id);
          break;
        default:
          break;
      }
    });
  }

  action(value: string) {
    switch (value) {
      case 'LOGOUT':
        this.websocketLogout();
        this.sessionSV.logout();
        this.router.navigate(['v2']);
        break;
      case 'FRIENDS':
        this.actionSV.dispatch({action: 'FRIENDS_SHOW', data: {
          value: true,
        }});
        break;
      default:
        break;
    }
  }

  private websocketLogout() {
    this.onlineUsers.forEach(u => {
      alert(u);
      this.websocketSV.dispatch({
        id: u._id,
        type: WebsocketEventType.OO_ONLINE_AKO,
        data: {
          user: this.currentUser,
          online: false
        }
      });
    });
  }

  updateProfilePicture() {
    this.actionSV.dispatch({
      action: 'SHOW_UPDATE_PROFILE_PICTURE',
      data: true
    });
  }

  hideAction() {
    setTimeout( x => {
      this.showAction = false;
    }, 200);
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
