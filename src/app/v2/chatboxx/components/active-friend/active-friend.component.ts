import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionService } from 'src/app/shared/services/action.service';
import { JkAlertService } from 'jk-alert';
import { UserService } from 'src/app/landing/user.service'; 
import { DropdownActionInterface } from 'src/app/v2/shared/interfaces/dropdown-action.interface';

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
      icon: 'user-x'
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
}
