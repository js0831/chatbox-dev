import { Injectable } from '@angular/core';
import { NotificationInterface } from '../interfaces/notification.interface';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../../chatboxx/store/app.state';
import { NotificationListLoad } from '../../chatboxx/store/notification/notification.action';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) {}


  create(notif: NotificationInterface) {
    const url = 'notification';
    const {
      user,
      reference,
      type,
      message
    } = notif;
    return this.http.post(url, {
      user,
      reference,
      type,
      message
    }, {
      headers: {
        loading: 'background'
      }
    });
  }

  getList(id: string) {
    return this.http.get(`notification/${id}`);
  }

  get notificationState() {
    return this.store.select('notificationState');
  }

  stateLoadNotifications(id: string) {
    this.store.dispatch(new NotificationListLoad(id));
  }
}
