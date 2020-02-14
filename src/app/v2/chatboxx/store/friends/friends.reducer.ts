import * as actions from './friends.action';
import { FriendState } from './friend.state';

const initialState: FriendState = {
    action: {
        name: ''
    },
    users: {
        type: null,
        list: [],
        search: '',
        pagination: {
            page: 0,
            limit: 10,
            total: 0
        },
        onlines: []
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
                    pagination: payload.pagination,
                    search: payload.search
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
        case actions.FRIEND_USER_ONLINE:
          const online = [...state.users.onlines, payload.user];
          const offline = state.users.onlines.filter( x => x._id !== payload.user._id);
          const onlines = payload.online ? online : offline;
          returnState = {
              action: {
                  name: type
              },
              users: {
                  ...state.users,
                  onlines,
              }
          };
          break;
        default:
            returnState = state;
            break;
    }
    return returnState;
}


