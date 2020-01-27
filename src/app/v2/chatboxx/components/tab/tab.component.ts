import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { NOTIFICATION_LIST_LOAD_FINISH } from '../../store/notification/notification.action';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  currentUser: UserInterface;
  totalNotifs = 0;

  constructor(
    private notificationSV: NotificationService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchnotificationState()
    ];

    this.notificationSV.stateLoadNotifications(this.currentUser._id);
  }

  private watchnotificationState() {
    return this.notificationSV.notificationState.subscribe( x => {
      switch (x.action.name) {
        case NOTIFICATION_LIST_LOAD_FINISH:
          this.totalNotifs = x.notification.list.length;
          break;
        default:
          break;
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
