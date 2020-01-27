import * as actions from './conversation.action';
import { ConversationState } from './conversation.state';

const initialState: ConversationState = {
    action: {
        name: ''
    },
    conversation: {
        type: null,
        list: [],
    }
};

export function conversationReducer(state = initialState, action: actions.Actions) {
    const { payload, type }  = action;
    let returnState: ConversationState = null;

    switch (type) {
        case actions.CONVERSATION_LIST_LOAD:
            returnState = {
                ...state,
                action: {
                    name: type
                },
                conversation: {
                    ...state.conversation,
                    type: payload.type
                }
            };
            break;

        case actions.CONVERSATION_LIST_LOAD_FINISH:
            returnState = {
                action: {
                    name: type
                },
                conversation: {
                    ...state.conversation,
                    list: payload.data
                }
            };
            break;
        case actions.CONVERSATION_SELECT:
            returnState = {
                action: {
                    name: type
                },
                conversation: {
                    ...state.conversation,
                    selected: payload
                }
            };
            break;
        default:
            returnState = state;
            break;
    }
    return returnState;
}


