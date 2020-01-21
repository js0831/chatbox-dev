import { Component, OnInit } from '@angular/core';
import { DropdownActionInterface } from 'src/app/v2/shared/interfaces/dropdown-action.interface';
import { ActionService } from 'src/app/shared/services/action.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  showAction = false;
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
    private actionSV: ActionService
  ) { }

  ngOnInit() {
  }

  action(value: string) {
    switch (value) {
      case 'LOGOUT':
        break;
      case 'FRIENDS':
        this.actionSV.dispatch({name: 'FRIENDS_SHOW', data: true});
        break;
      default:
        break;
    }
  }

  hideAction() {
    setTimeout( x => {
      this.showAction = false;
    }, 200);
  }
}
