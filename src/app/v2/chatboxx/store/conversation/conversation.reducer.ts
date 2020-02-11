import * as actions from './conversation.action';
import { ConversationState } from './conversation.state';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';

const initialState: ConversationState = {
    action: {
        name: ''
    },
    conversation: {
        type: null,
        list: [],
        messages: []
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
            case actions.CONVERSATION_GROUP_ADD_MEMBER_FINISH:
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

            case actions.CONVERSATION_LOAD_PREVIOUS_MESSAGES:
                returnState = {
                  ...state,
                  action: {
                    name: type,
                  }
                };
                break;
            case actions.CONVERSATION_LOAD_PREVIOUS_MESSAGES_FINISH:
                const ids = state.conversation.messages.map( x => x._id);
                const removeDuplicates = payload.data.filter( x => {
                  return !(ids.indexOf(x._id) >= 0);
                });
                const isLastPage = removeDuplicates.length !== payload.data.length;
                returnState = {
                    action: {
                        name: type,
                        statusCode: payload.statusCode,
                        message: !isLastPage ? payload.message : 'last'
                    },
                    conversation: {
                        ...state.conversation,
                        messages: [...removeDuplicates, ...state.conversation.messages]
                    }
                };
                break;
            case actions.CONVERSATION_GROUP_USER_REMOVE_FINISH:
                returnState = {
                  action: {
                    name: type
                  },
                  conversation: {
                    ...state.conversation,
                    list: state.conversation.list.map( x => {
                      if (state.conversation.selected._id === x._id) {
                        x.members = (x.members as UserInterface[]).filter( m => m._id !== payload.user );
                      }
                      return x;
                    }),
                    selected: {
                      ...state.conversation.selected,
                      members: (state.conversation.selected.members as UserInterface[]).filter( x => x._id !== payload.user )
                    }
                  }
                };
                break;

            case actions.CONVERSATION_GROUP_RENAME:
                returnState = {
                  ...state,
                  action: {
                    name: type,
                  },
                  conversation: {
                    ...state.conversation,
                    list: state.conversation.list.map( x => {
                      if (state.conversation.selected._id === x._id) {
                        x.name = payload.name;
                      }
                      return x;
                    }),
                    selected: {
                      ...state.conversation.selected,
                      name: payload.name
                    }
                  }
                };
                break;
            case actions.CONVERSATION_MESSAGE_REACT:
              returnState = {
                ...state,
                action: {
                  name: type,
                }
              };
              break;

            case actions.CONVERSATION_MESSAGE_REACT_FINISH:
              returnState = {
                ...state,
                action: {
                  name: type,
                },
                conversation: {
                  ...state.conversation,
                  messages: state.conversation.messages.map( m => {
                    if (m._id === payload.messageId) {
                      if (!m.reactions) { m.reactions = []; }

                      let exist = false;
                      m.reactions.map( x => {
                        const { reaction } = payload;
                        if (x.by._id === reaction.by._id) {
                          x.reaction = reaction.reaction;
                          x.emoji = reaction.emoji;
                          exist = true;
                        }
                        return x;
                      });
                      if (!exist) {
                        m.reactions.push(payload.reaction);
                      }
                    }
                    return m;
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


