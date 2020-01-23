import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { FRIEND_LOAD_USER_LIST, FriendLoadUserList, FriendLoadUserListFinish } from './friends.action';
import { switchMap, map } from 'rxjs/operators';
import { FriendsType } from './friends-type.enum';
import { ResponseInterface } from 'src/app/v2/shared/interfaces/reponse.interface';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';


@Injectable()
export class FriendsEffects {

    constructor(
        private action$: Actions,
        private userSV: UserService
    ) { }

    @Effect() loadFriendList: Observable<Action> = this.action$.pipe(
        ofType(FRIEND_LOAD_USER_LIST),
        switchMap( (action: FriendLoadUserList) => {
            let req: Observable<ResponseInterface<UserInterface[]>>;
            const payload = action.payload;
            switch (action.payload.type) {
                case FriendsType.INVITE:
                    const {id, pagination, search} = payload;
                    req = this.userSV.getUsers({id, search, pagination});
                    break;
                case FriendsType.FRIEND_REQUEST:
                    req = this.userSV.getFriendRequest(payload.id);
                    break;
                case FriendsType.FRIENDS:
                    req = this.userSV.getFriends(payload.id);
                    break;
                default:
                    break;
            }
            return req.pipe(
                    map( result => {
                        return new FriendLoadUserListFinish({
                            type: payload.type,
                            response: result
                        });
                    })
            );
        })
    );
}
