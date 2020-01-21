import { Component, OnInit } from '@angular/core';
import { DropdownActionInterface } from 'src/app/v2/shared/interfaces/dropdown-action.interface';

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
      label: 'Settings',
      value: 'SETTINGS',
      icon: 'settings'
    },
    {
      label: 'Friends',
      value: 'Friends',
      icon: 'users'
    },
    {
      label: 'Logout',
      value: 'LOGOUT',
      icon: 'off'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  action(value: string) {
    switch (value) {
      case 'LOGOUT':
        alert('A');
        break;
      default:
        alert('B');
        break;
    }
  }

  hideAction() {
    setTimeout( x => {
      this.showAction = false;
    }, 200);
  }
}
