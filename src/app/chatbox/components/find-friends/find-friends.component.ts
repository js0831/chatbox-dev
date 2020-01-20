import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/landing/user.service';
import { ActionService } from 'src/app/shared/services/action.service';
import { JkAlertService } from 'jk-alert';

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.scss']
})
export class FindFriendsComponent implements OnInit {

  searchKey = '';
  searchTimer: any;
  results: any[];
  isLoading = false;
  currentUser: any;
  invited = [];

  constructor(
    private userService: UserService,
    private action: ActionService,
    private jkAlert: JkAlertService
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUser;
    this.search();
  }

  search() {
    this.isLoading = true;
    if ( this.searchTimer ) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout( x => {
      this.isLoading = true;
      this.userService.searchUser(this.currentUser.info.id, this.searchKey).subscribe( (res: any) => {
        this.results = res.data;
        this.isLoading = false;
      });
    }, 500);

  }

  close() {
    this.action.dispatch({
      name: 'ADD_FRIEND',
      data: false
    });
  }

  invite(user: any) {
    this.jkAlert.confirm(`Invite ${user.firstname} ${user.lastname}?`, ['Confirm', 'Cancel']).then( answer => {
      if (answer === 0) {
        this.userService.inviteUser(this.currentUser.info.id, user._id).subscribe( x => {
          this.invited.push(user._id);
        });

        this.userService.sendRequestNotification({
          type: 'invite',
          to: user._id,
          by: this.currentUser.info
        });
        this.action.dispatch({
          name: 'REQUEST_NOTIF_UPDATE',
          data: 'invite'
        });
      }
    });
  }
}
