import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/landing/user.service';
import { ActionService } from 'src/app/shared/services/action.service';
import { Subscription } from 'rxjs';
import { JkAlertService } from 'jk-alert';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.scss']
})
export class SideComponent implements OnInit, OnDestroy {

  user: any;
  tabs = [
    {
      label: 'Friends',
      value: 'friends'
    },
    {
      label: 'Request',
      value: 'request'
    },
    {
      label: 'Groups',
      value: 'groups'
    }
  ];
  activeTab = {
    label: 'Friends',
    value: 'friends'
  };
  userRequestCount = 0;
  subs: Subscription[] = [];
  searchKey = '';
  searchKeyTimer: any;

  constructor(
    private userService: UserService,
    private action: ActionService,
    private alertService: JkAlertService
  ) { }

  ngOnInit() {
    this.user = this.userService.currentUser.info;

    this.subs = [
      this.userService.getUserRequestCount(this.user.id).subscribe( (x: any) => {
        this.userRequestCount = x.data;
      }),
      this.userService.getRequestNotification(this.user.id).subscribe( (x: any) => {
        this.updateNotif(x.type);
      }),
      this.action.listen.subscribe( x => {
        if (x.name === 'REQUEST_NOTIF_UPDATE') {
          this.updateNotif(x.data);
          // alert(x.data);
        }
      })
    ];
  }

  searchChanged() {
    if (this.searchKeyTimer) {
      clearTimeout(this.searchKeyTimer);
    }
    this.searchKeyTimer = setTimeout( x => {
      this.action.dispatch({
        name: 'USER_SEARCH',
        data: this.searchKey
      });
    }, 500);
  }

  private updateNotif(type) {
    switch (type) {
      case 'invite':
        this.userRequestCount += 1;
        break;
      case 'cancel':
        this.userRequestCount -= 1;
        break;
      case 'reject':
        this.userRequestCount -= 1;
        break;
      case 'accept':
        this.userRequestCount -= 1;
        break;
      default:
        break;
    }
  }

  add() {
    this.action.dispatch({name: 'ADD_FRIEND', data: true});
  }

  selectTab(t: any) {
    if (t.value === 'groups') {
      this.alertService.info('AVAILABLE SOON!');
      return;
    }
    if (t.value === this.activeTab.value) {
      return;
    }
    this.activeTab = t;
    this.action.dispatch({name: 'SELECT_USER_TAB', data: t});
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
