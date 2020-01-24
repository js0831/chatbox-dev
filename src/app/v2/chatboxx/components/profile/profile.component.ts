import { Component, OnInit } from '@angular/core';
import { DropdownActionInterface } from 'src/app/v2/shared/interfaces/dropdown-action.interface';
import { ActionService } from 'src/app/shared/services/action.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser: UserInterface;
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
    private actionSV: ActionService,
    private sessionSV: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
  }

  action(value: string) {
    switch (value) {
      case 'LOGOUT':
        this.sessionSV.logout();
        this.router.navigate(['v2']);
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
