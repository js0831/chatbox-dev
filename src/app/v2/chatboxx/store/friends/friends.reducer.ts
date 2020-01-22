import * as actions from './friends.action';
import { FriendState } from './friend.state';
import { FriendsType } from './friends-type.enum';

const initialState: FriendState = {
    action: {
        name: ''
    },
    users: {
        type: null,
        list: []
    }
};

export function friendReducer(state = initialState, action: actions.Actions) {
    const { payload, type }  = action;
    let returnState: FriendState = null;

    switch (type) {
        case actions.FRIEND_LOAD_USER_LIST:
            returnState = {
                action: {
                    name: type
                },
                users: {
                    type: FriendsType.FRIENDS,
                    list: []
                }
            };
            break;

        case actions.FRIEND_LOAD_USER_LIST_FINISH:
            returnState = {
                action: {
                    name: type
                },
                users: {
                    type: payload.type,
                    list: payload.response.data
                }
            };
            break;
        default:
            returnState = state;
            break;
    }

    return returnState;
}


