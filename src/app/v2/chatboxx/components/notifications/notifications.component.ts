import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  notifications: NotificationInterface[] = [];

  constructor(
    private notifSV: NotificationService
  ) { }

  ngOnInit() {
    this.subs = [
      this.watchNotificationState()
    ];
  }

  private watchNotificationState() {
    return this.notifSV.notificationState.subscribe( x => {
      this.notifications = x.notification.list;
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
