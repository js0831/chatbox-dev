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
        case actions.CONVERSATION_ACTION_RESET:
          returnState = {
            ...state,
            action: {
              name: ''
            }
          };
          break;
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
        case actions.CONVERSATION_LOAD_MESSAGES:
            returnState = {
                action: {
                    name: type,
                    message: payload.message,
                    statusCode: payload.statusCode
                },
                conversation: {
                    ...state.conversation,
                    messages: payload.data
                }
            };
            break;
        case actions.CONVERSATION_SEND_MESSAGE:
            returnState = {
                action: {
                    name: type
                },
                conversation: {
                    ...state.conversation,
                    messages: [
                        ...state.conversation.messages,
                        payload
                    ]
                }
            };
            break;
          case actions.CONVERSATION_ADD:
            returnState = {
                action: {
                    name: type
                },
                conversation: {
                  ...state.conversation,
                  list: [payload, ...state.conversation.list]
                }
            };
            break;
          case actions.CONVERSATION_REMOVE:
            returnState = {
                action: {
                    name: type
                },
                conversation: {
                  ...state.conversation,
                  list: state.conversation.list.filter(con => con._id !== payload)
                }
            };
            break;
          case actions.CONVERSATION_GROUP_CREATE:
            returnState = {
                ...state,
                action: {
                    name: type
                }
            };
            break;
          case actions.CONVERSATION_GROUP_CREATE_FINISH:
            returnState = {
                ...state,
                action: {
                    name: type
                },
                conversation: {
                  ...state.conversation,
                  list: [payload.data, ...state.conversation.list]
                }
            };
            break;
          case actions.CONVERSATION_GROUP_LEAVE:
            returnState = {
                ...state,
                action: {
                    name: type
                }
            };
            break;
          case actions.CONVERSATION_GROUP_LEAVE_FINISH:
              returnState = {
                  ...state,
                  action: {
                      name: type
                  },
                  conversation: {
                    ...state.conversation,
                    list: state.conversation.list.filter( c => c._id !== payload.conversation)
                  }
              };
              break;
          case actions.CONVERSATION_GROUP_DELETE:
            returnState = {
                ...state,
                action: {
                    name: type
                }
            };
            break;
          case actions.CONVERSATION_GROUP_DELETE_FINISH:
              returnState = {
                  ...state,
                  action: {
                      name: type
                  },
                  conversation: {
                    ...state.conversation,
                    list: state.conversation.list.filter( c => c._id !== payload)
                  }
              };
              break;
            case actions.CONVERSATION_GROUP_ADD_MEMBER:
              returnState = {
                  ...state,
                  action: {
                      name: type
                  }
              };
              break;
            case actions.CONVERSATION_GROUP_ADD_MEMBER_FINISH:
                console.log(payload);
                returnState = {
                    ...state,
                    action: {
                        name: type
                    },
                    conversation: {
                      ...state.conversation,
                      selected: {
                        ...state.conversation.selected,
                        members: [
                          ...state.conversation.selected.members,
                          payload
                        ]
                      },
                      list: state.conversation.list.map( c => {
                        if (c._id === state.conversation.selected._id) {
                          c.members.push(payload);
                        }
                        return c;
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


