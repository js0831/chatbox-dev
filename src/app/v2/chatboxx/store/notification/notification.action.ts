import { Action } from '@ngrx/store';

export const NOTIFICATION_LIST_LOAD = '[Notification] list load';
export const NOTIFICATION_LIST_LOAD_FINISH = '[Notification] list load finish';
export const NOTIFICATION_LIVE_UPDATE = '[Notification] live update';
export const NOTIFICATION_DELETE = '[Notification] Delete';
export const NOTIFICATION_SEEN = '[Notification] Seen';

export class NotificationListLoad implements Action {
    readonly type = NOTIFICATION_LIST_LOAD;
    constructor(public payload?: any) {}
}

export class NotificationListLoadFinish implements Action {
    readonly type = NOTIFICATION_LIST_LOAD_FINISH;
    constructor(public payload?: any) {}
}

export class NotificationLiveUpdate implements Action {
  readonly type = NOTIFICATION_LIVE_UPDATE;
  constructor(public payload?: any) {}
}

export class NotificationDelete implements Action {
  readonly type = NOTIFICATION_DELETE;
  constructor(public payload?: any) {}
}

export class NotificationSeen implements Action {
  readonly type = NOTIFICATION_SEEN;
  constructor(public payload?: any) {}
}

export type Actions =
| NotificationListLoad
| NotificationListLoadFinish
| NotificationLiveUpdate
| NotificationDelete
| NotificationSeen;
