import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  notifications: NotificationInterface[] = [];
  currentUser: UserInterface;

  constructor(
    private notifSV: NotificationService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.currentUser =  this.sessionSV.data.user;
    this.subs = [
      this.watchNotificationState()
    ];

    this.notifSV.stateSeenNotifications(this.currentUser._id);
    this.notifSV.seenNotifications(this.currentUser._id).toPromise();
  }

  private watchNotificationState() {
    return this.notifSV.notificationState.subscribe( x => {
      this.notifications = x.notification.list;
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
    this.notifSV.stateSeenNotifications(this.currentUser._id);
    this.notifSV.seenNotifications(this.currentUser._id).toPromise();
  }
}
