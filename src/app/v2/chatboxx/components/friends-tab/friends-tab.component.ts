import { Component, OnInit } from '@angular/core';
import { FriendsTabInterface } from './friends-tab.interface';
import { FriendsType } from '../../store/friends/friends-type.enum';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserService } from 'src/app/v2/shared/services/user.service';

@Component({
  selector: 'app-friends-tab',
  templateUrl: './friends-tab.component.html',
  styleUrls: ['./friends-tab.component.scss']
})
export class FriendsTabComponent implements OnInit {

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

  constructor(
    private userSV: UserService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.activeTab = this.tabs[1];

    this.userSV.stateGetFriends(this.sessionSV.data.user._id, this.activeTab.value, {
      page: 0,
      limit: 1
    });
  }

  selectTab(t: FriendsTabInterface) {
    this.activeTab = t;
    this.userSV.stateGetFriends(this.sessionSV.data.user._id, this.activeTab.value, {
      page: 0,
      limit: 1
    });
  }

}
