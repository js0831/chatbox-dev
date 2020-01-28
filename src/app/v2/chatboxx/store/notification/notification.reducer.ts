import * as actions from './notification.action';
import { NotificationState } from './notification.state';

const initialState: NotificationState = {
    action: {
        name: ''
    },
    notification: {
        list: [],
    }
};

export function notificationReducer(state = initialState, action: actions.Actions) {
    const { payload, type }  = action;
    let returnState: NotificationState = null;

    switch (type) {
        case actions.NOTIFICATION_LIST_LOAD:
            returnState = {
                ...state,
                action: {
                    name: type
                }
            };
            break;

        case actions.NOTIFICATION_LIST_LOAD_FINISH:
            returnState = {
                action: {
                    name: type
                },
                notification: {
                    ...state.notification,
                    list: payload.data.reverse()
                }
            };
            break;
          case actions.NOTIFICATION_LIVE_UPDATE:
            returnState = {
                action: {
                    name: type
                },
                notification: {
                    ...state.notification,
                    list: [payload, ...state.notification.list]
                }
            };
            break;

          case actions.NOTIFICATION_DELETE:
            returnState = {
                action: {
                    name: type
                },
                notification: {
                    ...state.notification,
                    list: state.notification.list.filter( n => n._id !== payload.userid && payload.reference !== n.reference)
                }
            };
            break;
        default:
            returnState = state;
            break;
    }
    return returnState;
}


