import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionService } from 'src/app/shared/services/action.service';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { FriendsType } from '../../store/friends/friends-type.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];

  constructor(
    private actionSV: ActionService,
    private userSV: UserService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {

    this.subs = [
      this.watchFriendState()
    ];

    this.userSV.getFriends(this.sessionSV.data.user._id, FriendsType.INVITES);
  }

  private watchFriendState() {
    return this.userSV.friendState.subscribe( x => {
      console.log(x);
    });
  }

  close() {
    this.actionSV.dispatch({name: 'FRIENDS_SHOW', data: false});
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
