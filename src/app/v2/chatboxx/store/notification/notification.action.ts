import { Action } from '@ngrx/store';

export const NOTIFICATION_LIST_LOAD = '[Notification] list load';
export const NOTIFICATION_LIST_LOAD_FINISH = '[Notification] list load finish';

export class NotificationListLoad implements Action {
    readonly type = NOTIFICATION_LIST_LOAD;
    constructor(public payload?: any) {}
}

export class NotificationListLoadFinish implements Action {
    readonly type = NOTIFICATION_LIST_LOAD_FINISH;
    constructor(public payload?: any) {}
}

export type Actions =
| NotificationListLoad
| NotificationListLoadFinish;
