import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { ActionService } from 'src/app/v2/shared/services/action.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  notifications: NotificationInterface[] = [];
  consolidated: NotificationInterface[] = [];
  allNotifs: NotificationInterface[] = [];

  currentUser: UserInterface;

  constructor(
    private notifSV: NotificationService,
    private sessionSV: SessionService,
    private actionSV: ActionService
  ) { }

  ngOnInit() {
    this.currentUser =  this.sessionSV.data.user;
    this.subs = [
      this.watchNotificationState()
    ];

    this.notifSV.actionSeenNotifications(this.currentUser._id);
    this.notifSV.seenNotifications(this.currentUser._id).toPromise();
  }

  private watchNotificationState() {
    return this.notifSV.notificationState.subscribe( x => {
      this.allNotifs = x.notification.list;
      this.notifications = this.consolidateNotifications(x.notification.list);
    });
  }

  private consolidateNotifications(list: NotificationInterface[]) {
    this.consolidated = [];
    list.forEach(n => {
      const notifs = this.consolidatedNotifications(n, this.consolidated);
      if (notifs.length === 0) {
        this.consolidated = [
          ...this.consolidated,
          n
        ];
      }
    });
    return this.consolidated;
  }

  countConsolidatedNotifs(n: NotificationInterface) {
    return this.consolidatedNotifications(n, this.allNotifs).length;
  }

  private consolidatedNotifications(notif: NotificationInterface, list) {
    const notifs = list.filter(n => {
      return n.message === notif.message && n.reference === notif.reference;
    });
    return notifs;
  }

  open(n: NotificationInterface) {
    this.actionSV.dispatch({
      action: 'NOTIFICATION_OPEN',
      data: n
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
    this.notifSV.actionSeenNotifications(this.currentUser._id);
    if ( this.sessionSV.data ) {
        this.notifSV.seenNotifications(this.currentUser._id).toPromise();
    }

  }
}
