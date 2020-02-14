import { Action } from '@ngrx/store';

export const FRIEND_LOAD_USER_LIST = '[Friend] load user list';
export const FRIEND_LOAD_USER_LIST_FINISH = '[Friend] load user list finish';
export const FRIEND_USER_ONLINE = '[Friend] User online';

export class FriendLoadUserList implements Action {
    readonly type = FRIEND_LOAD_USER_LIST;
    constructor(public payload?: any) {}
}

export class FriendLoadUserListFinish implements Action {
    readonly type = FRIEND_LOAD_USER_LIST_FINISH;
    constructor(public payload?: any) {}
}

export class FriendUserOnline implements Action {
  readonly type = FRIEND_USER_ONLINE;
  constructor(public payload?: any) {}
}

export type Actions =
| FriendLoadUserList
| FriendLoadUserListFinish
| FriendUserOnline;
