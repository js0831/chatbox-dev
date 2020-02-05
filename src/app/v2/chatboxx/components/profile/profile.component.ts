import { Component, OnInit, OnDestroy } from '@angular/core';
import { DropdownActionInterface } from 'src/app/v2/shared/interfaces/dropdown-action.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
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
    this.subs = [
      this.watchAction()
    ];
  }

  private watchAction() {
    return this.actionSV.listen.subscribe( (x: any) => {
      if (x.action === 'NOTIFICATION_OPEN') {
          if (x.data.type === NotificationType.FRIEND_REQUEST) {
            this.action('FRIENDS');
          }
      }
    });
  }

  action(value: string) {
    switch (value) {
      case 'LOGOUT':
        this.sessionSV.logout();
        this.router.navigate(['v2']);
        break;
      case 'FRIENDS':
        this.actionSV.dispatch({action: 'FRIENDS_SHOW', data: {
          value: true,
        }});
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

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
