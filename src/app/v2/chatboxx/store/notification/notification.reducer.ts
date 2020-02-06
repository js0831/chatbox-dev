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

          case actions.NOTIFICATION_DELETE_BY_TYPE:
            returnState = {
                action: {
                    name: type
                },
                notification: {
                    ...state.notification,
                    list: state.notification.list.filter( n => n.type !== payload.type)
                }
            };
            break;

          case actions.NOTIFICATION_SEEN:
            returnState = {
                action: {
                    name: type
                },
                notification: {
                    ...state.notification,
                    list: state.notification.list.map( n => {
                      n.seen = true;
                      return n;
                    })
                }
            };
            break;
        default:
            returnState = state;
            break;
    }
    return returnState;
}


