import * as actions from './friends.action';
import { FriendState } from './friend.state';
import { FriendsType } from './friends-type.enum';

const initialState: FriendState = {
    action: {
        name: ''
    },
    users: {
        type: null,
        list: [],
        pagination: {
            page: 0,
            limit: 10,
            total: 0
        }
    }
};

export function friendReducer(state = initialState, action: actions.Actions) {
    const { payload, type }  = action;
    let returnState: FriendState = null;

    switch (type) {
        case actions.FRIEND_LOAD_USER_LIST:
            returnState = {
                ...state,
                action: {
                    name: type
                },
                users: {
                    ...state.users,
                    pagination: payload.pagination
                }
            };
            break;

        case actions.FRIEND_LOAD_USER_LIST_FINISH:
            returnState = {
                action: {
                    name: type
                },
                users: {
                    ...state.users,
                    type: payload.type,
                    list: payload.response.data.list,
                    pagination: {
                        ...state.users.pagination,
                        total: payload.response.data.total
                    }
                }
            };
            break;
        default:
            returnState = state;
            break;
    }

    return returnState;
}


