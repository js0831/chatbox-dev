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

  private watchFriendState() {
    return this.userSV.friendState.subscribe( x => {
      if (x.action.name === FRIEND_LOAD_USER_LIST_FINISH) {
        this.friendState = x;
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
          this.removeUserOnList(userId);
        });
        break;
      case 'cancel':
        this.cancelInvitation(userId);
        break;
      case 'unfriend':
        this.userSV.unfriend(userId, this.currentUser._id).subscribe( x => {
          this.removeUserOnList(userId);
        });
        break;
      default:
        this.respondToFriendRequest(userId, action);
        break;
    }
  }

  private respondToFriendRequest(userId: string, respond: string) {
    this.userSV.respondToFriendRequest(userId, this.currentUser._id, respond).subscribe( x => {
      console.log(x);
    });
  }

  private cancelInvitation(id: string) {
    this.alertSV.confirm('Are you sure?', ['Yes', 'No']).then( x => {
      if (x === 0) {
        this.userSV.cancelInvite(this.currentUser._id, id).subscribe( res => {
          this.removeUserOnList(id);
        });
      }
    });
  }

  private removeUserOnList(id: string) {
    this.friendState.users.list = this.friendState.users.list.filter( u => u._id !== id);
  }

  paginate(todo: number) {
    const currentPage = this.friendState.users.pagination.page;

    const pagination = this.friendState.users.pagination;
    const maxPage = Math.ceil(pagination.total / pagination.limit) - 1;
    if (
      (currentPage === 0 && todo === -1) ||
      (maxPage === currentPage && todo === 1)
    ) { return; }

    this.friendState.users.pagination.page = currentPage + todo;
    this.userSV.stateGetFriends(this.sessionSV.data.user._id, this.friendState.users.type, this.friendState.users.pagination);
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
