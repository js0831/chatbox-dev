import { Component, OnInit, OnDestroy } from '@angular/core';
import { FriendsTabInterface } from './friends-tab.interface';
import { FriendsType } from '../../store/friends/friends-type.enum';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';
import { Subscription } from 'rxjs';
import { ActionService } from 'src/app/v2/shared/services/action.service';

@Component({
  selector: 'app-friends-tab',
  templateUrl: './friends-tab.component.html',
  styleUrls: ['./friends-tab.component.scss']
})
export class FriendsTabComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  tabs: FriendsTabInterface[] = [
    {
      label: 'Friends',
      value: FriendsType.FRIENDS,
      count: 0
    },
    {
      label: 'Invite',
      value: FriendsType.INVITE
    },
    {
      label: 'Friend Request',
      value: FriendsType.FRIEND_REQUEST,
      count: 0
    }
  ];
  activeTab: FriendsTabInterface;
  currentUser: UserInterface;

  constructor(
    private userSV: UserService,
    private sessionSV: SessionService,
    private notificationSV: NotificationService,
    private actionSV: ActionService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.selectTab(this.tabs[this.getInitialActiveTab()]);
    this.userSV.stateGetFriends(this.params);

    this.subs = [
      this.watchnotificationState()
    ];
  }

  private getInitialActiveTab() {
    if (
      this.actionSV.previousValue.action === 'NOTIFICATION_OPEN' &&
      'FRIEND_REQUEST' === this.actionSV.previousValue.data.type
    ) {
      return 2;
    }
    return 0;
  }

  selectTab(t: FriendsTabInterface) {
    this.activeTab = t;
    this.userSV.stateGetFriends(this.params);

    if (t.value === FriendsType.FRIEND_REQUEST) {
      this.deleteFriendRequestNotifs();
    }
  }

  private deleteFriendRequestNotifs() {
    const params = {
      userid: this.currentUser._id,
      type: NotificationType.FRIEND_REQUEST
    };
    this.notificationSV.actionDeleteByType(params);
    this.notificationSV.deleteByType(params).toPromise();
  }

  private watchnotificationState() {
    return this.notificationSV.notificationState.subscribe( x => {
      this.tabs[2].count = x.notification.list.filter( n => {
        return n.type === NotificationType.FRIEND_REQUEST;
      }).length;
    });
  }

  private get params() {
    return {
      id: this.currentUser._id,
      pagination: {
        page: 0,
        limit: 10
      },
      type: this.activeTab.value,
      search: '',
    };
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
