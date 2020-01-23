import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionService } from 'src/app/shared/services/action.service';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { FriendsType } from '../../store/friends/friends-type.enum';
import { Subscription } from 'rxjs';
import { FRIEND_LOAD_USER_LIST_FINISH } from '../../store/friends/friends.action';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { JkAlertService } from 'jk-alert';
import { FriendState } from '../../store/friends/friend.state'; 
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
    this.actionSV.dispatch({name: 'FRIENDS_SHOW', data: false});
  }

  doFriendAction(action: string, userId: string) {
    switch (action) {
      case 'invite':
        this.userSV.inviteUser(userId, this.currentUser._id).subscribe( x => {
          this.disableActionButton(userId);
        });
        break;
      case 'cancel':
        this.cancelInvitation(userId);
        break;
      case 'unfriend':
        this.userSV.unfriend(userId, this.currentUser._id).subscribe( x => {
          this.disableActionButton(userId);
        });
        break;
      default:
        this.respondToFriendRequest(userId, action);
        break;
    }
  }

  private respondToFriendRequest(userId: string, respond: string) {
    this.userSV.respondToFriendRequest(userId, this.currentUser._id, respond).subscribe( x => {
      this.disableActionButton(userId);
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
