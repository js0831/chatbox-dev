import { Component, OnInit } from '@angular/core';
import { JkAlertService } from 'jk-alert';
import { UserService } from 'src/app/landing/user.service';
import { DropdownActionInterface } from 'src/app/v2/shared/interfaces/dropdown-action.interface';
import { ActionService } from 'src/app/v2/shared/services/action.service';

@Component({
  selector: 'app-active-friend',
  templateUrl: './active-friend.component.html',
  styleUrls: ['./active-friend.component.scss']
})
export class ActiveFriendComponent implements OnInit {


  showActions = false;
  actions: DropdownActionInterface[] = [
    {
      label: 'Unfriend',
      value: 'unfriend',
      icon: 'user-delete'
    },
    {
      label: 'View profile',
      value: 'view-profile',
      icon: 'profile'
    }
  ];

  constructor(
    private action: ActionService,
    private alertService: JkAlertService,
    private userService: UserService
  ) { }

  ngOnInit() {

  }

  doAction(action: any) {
    alert(action.value);
  }

  hideActions() {
    setTimeout( x => {
      this.showActions = false;
    }, 200);
  }

  showMenu() {
    this.action.dispatch({
      action: 'MENU_SHOW'
    });
  }
}
