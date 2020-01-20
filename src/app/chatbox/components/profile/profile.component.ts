import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/landing/user.service';
import { Router } from '@angular/router';
import { JkAlertService } from 'jk-alert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any;
  showAction = false;
  actions = [
    {
      label: 'Profile',
      action: 'PROFILE'
    },
    {
      label: 'Logout',
      action: 'LOGOUT'
    }
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private alertService: JkAlertService,
  ) { }

  ngOnInit() {
    this.user = this.userService.currentUser.info;
  }

  action(action: string) {
    switch (action) {
      case 'LOGOUT':
        this.alertService.confirm('Confirm logout', ['Logout', 'Cancel']).then( x => {
          if (x === 0) {
            this.userService.logout();
            this.router.navigate(['']);
          }
        });
        break;
      default:
        this.alertService.info('AVAILABLE SOON!');
        break;
    }
  }

  hideAction() {
    setTimeout( x => {
      this.showAction = false;
    }, 200);
  }
}
