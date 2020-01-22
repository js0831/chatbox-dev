import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { FRIEND_LOAD_USER_LIST, FriendLoadUserList, FriendLoadUserListFinish } from './friends.action';
import { switchMap, map } from 'rxjs/operators';
import { FriendsType } from './friends-type.enum';


@Injectable()
export class FriendsEffects {

    constructor(
        private action$: Actions,
        private userSV: UserService
    ) { }

    @Effect() loadFriendList: Observable<Action> = this.action$.pipe(
        ofType(FRIEND_LOAD_USER_LIST),
        switchMap( (action: FriendLoadUserList) => {
            if (action.payload.type === FriendsType.INVITES) {
                return this.userSV.getUsers(action.payload.id).pipe(
                    map( result => {
                        return new FriendLoadUserListFinish({
                            type: action.payload.type,
                            response: result
                        });
                    })
                );
            }

        })
    );
}
