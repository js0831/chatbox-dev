import { Injectable } from '@angular/core';
import { NotificationInterface } from '../interfaces/notification.interface';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../../chatboxx/store/app.state';
import {
  NotificationListLoad,
  NotificationLiveUpdate,
  NotificationDelete,
  NotificationSeen
} from '../../chatboxx/store/notification/notification.action';
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

  deleteByReference(params: {
    userid: string, reference: string
  }) {
    return this.http.delete(`notification/${params.userid}/${params.reference}`, {
      headers: {
        loading: 'background'
      }
    });
  }

  seenNotifications(userId: string) {
    return this.http.patch(`notification/${userId}`, {}, {
      headers: {
        loading: 'background'
      }
    });
  }

  get notificationState() {
    return this.store.select('notificationState');
  }

  stateLoadNotifications(id: string) {
    this.store.dispatch(new NotificationListLoad(id));
  }

  stateUpdateNotification(notif: NotificationInterface) {
    this.store.dispatch(new NotificationLiveUpdate(notif));
  }

  stateDeleteByReference(params: {
    userid: string, reference: string
  }) {
    this.store.dispatch(new NotificationDelete(params));
  }

  stateSeenNotifications(userId: string) {
    this.store.dispatch(new NotificationSeen(userId));
  }
}
