import { Action } from '@ngrx/store';
import { ReactionInterface } from 'src/app/v2/shared/interfaces/reaction.interface';

export const CONVERSATION_LIST_LOAD = '[Conversation] list load';
export const CONVERSATION_LIST_LOAD_FINISH = '[Conversation] list load finish';
export const CONVERSATION_SELECT = '[Conversation] SELECT';
export const CONVERSATION_LOAD_MESSAGES = '[Conversation] Load messages';
export const CONVERSATION_SEND_MESSAGE = '[Conversation] Send message';
export const CONVERSATION_ACTION_RESET = '[Conversation] Action reset';
export const CONVERSATION_ADD = '[Conversation] Add';
export const CONVERSATION_REMOVE = '[Conversation] Remove';
export const CONVERSATION_GROUP_CREATE = '[Conversation] Group create';
export const CONVERSATION_GROUP_CREATE_FINISH = '[Conversation] Group create finish';
export const CONVERSATION_GROUP_LEAVE = '[Conversation] Group Leave';
export const CONVERSATION_GROUP_LEAVE_FINISH = '[Conversation] Group Leave finish';
export const CONVERSATION_GROUP_DELETE = '[Conversation] Group delete';
export const CONVERSATION_GROUP_DELETE_FINISH = '[Conversation] Group delete finish';
export const CONVERSATION_GROUP_ADD_MEMBER = '[Conversation] Group add member';
export const CONVERSATION_GROUP_ADD_MEMBER_FINISH = '[Conversation] add member finish';
export const CONVERSATION_LOAD_PREVIOUS_MESSAGES = '[Conversation] Load previous messages';
export const CONVERSATION_LOAD_PREVIOUS_MESSAGES_FINISH = '[Conversation] Load previous messages finish';
export const CONVERSATION_GROUP_USER_REMOVE = '[Conversation] Group user remove';
export const CONVERSATION_GROUP_USER_REMOVE_FINISH = '[Conversation] Group user remove finish';
export const CONVERSATION_GROUP_RENAME = '[Conversation] group rename';
export const CONVERSATION_MESSAGE_REACT = '[Conversation] Message react';
export const CONVERSATION_MESSAGE_REACT_FINISH = '[Conversation] Message react finish';
export const CONVERSATION_MESSAGE_UPDATE_TEMPORARY_ID = '[Conversation] Message update temporary id';
export const CONVERSATION_MESSAGE_REPLY = '[Conversation] Message reply';

export class ConversationListLoad implements Action {
    readonly type = CONVERSATION_LIST_LOAD;
    constructor(public payload?: any) {}
}

export class ConversationListLoadFinish implements Action {
    readonly type = CONVERSATION_LIST_LOAD_FINISH;
    constructor(public payload?: any) {}
}

export class ConversationSelect implements Action {
    readonly type = CONVERSATION_SELECT;
    constructor(public payload?: any) {}
}

export class ConversationLoadMessages implements Action {
    readonly type = CONVERSATION_LOAD_MESSAGES;
    constructor(public payload?: any) {}
}

export class ConversationSendMessage implements Action {
    readonly type = CONVERSATION_SEND_MESSAGE;
    constructor(public payload?: any) {}
}

export class ConversationActionReset implements Action {
  readonly type = CONVERSATION_ACTION_RESET;
  constructor(public payload?: any) {}
}

export class ConversationAdd implements Action {
  readonly type = CONVERSATION_ADD;
  constructor(public payload?: any) {}
}

export class ConversationRemove implements Action {
  readonly type = CONVERSATION_REMOVE;
  constructor(public payload?: any) {}
}

export class ConversationGroupCreate implements Action {
  readonly type = CONVERSATION_GROUP_CREATE;
  constructor(public payload?: any) {}
}

export class ConversationGroupCreateFinish implements Action {
  readonly type = CONVERSATION_GROUP_CREATE_FINISH;
  constructor(public payload?: any) {}
}

export class ConversationGroupLeave implements Action {
  readonly type = CONVERSATION_GROUP_LEAVE;
  constructor(public payload?: any) {}
}

export class ConversationGroupLeaveFinish implements Action {
  readonly type = CONVERSATION_GROUP_LEAVE_FINISH;
  constructor(public payload?: any) {}
}

export class ConversationGroupUserRemove implements Action {
  readonly type = CONVERSATION_GROUP_USER_REMOVE;
  constructor(public payload?: any) {}
}

export class ConversationGroupUserRemoveFinish implements Action {
  readonly type = CONVERSATION_GROUP_USER_REMOVE_FINISH;
  constructor(public payload?: any) {}
}

export class ConversationGroupDelete implements Action {
  readonly type = CONVERSATION_GROUP_DELETE;
  constructor(public payload?: any) {}
}

export class ConversationGroupDeleteFinish implements Action {
  readonly type = CONVERSATION_GROUP_DELETE_FINISH;
  constructor(public payload?: any) {}
}

export class ConversationGroupAddMember implements Action {
  readonly type = CONVERSATION_GROUP_ADD_MEMBER;
  constructor(public payload?: any) {}
}

export class ConversationGroupAddMemberFinish implements Action {
  readonly type = CONVERSATION_GROUP_ADD_MEMBER_FINISH;
  constructor(public payload?: any) {}
}

export class ConversationLoadPreviousMessages implements Action {
  readonly type = CONVERSATION_LOAD_PREVIOUS_MESSAGES;
  constructor(public payload?: any) {}
}

export class ConversationLoadPreviousMessagesFinish implements Action {
  readonly type = CONVERSATION_LOAD_PREVIOUS_MESSAGES_FINISH;
  constructor(public payload?: any) {}
}

export class ConversationGroupRename implements Action {
  readonly type = CONVERSATION_GROUP_RENAME;
  constructor(public payload?: any) {}
}

export class ConversationMessageReact implements Action {
  readonly type = CONVERSATION_MESSAGE_REACT;
  constructor(public payload?: any) {}
}

export class ConversationMessageReactFinish implements Action {
  readonly type = CONVERSATION_MESSAGE_REACT_FINISH;
  constructor(public payload?: any) {}
}

export class ConversationMessageUpdateTemporaryId implements Action {
  readonly type = CONVERSATION_MESSAGE_UPDATE_TEMPORARY_ID;
  constructor(public payload?: any) {}
}

export class ConversationMessageReply implements Action {
  readonly type = CONVERSATION_MESSAGE_REPLY;
  constructor(public payload?: any) {}
}

export type Actions =
| ConversationListLoad
| ConversationListLoadFinish
| ConversationSelect
| ConversationLoadMessages
| ConversationSendMessage
| ConversationActionReset
| ConversationAdd
| ConversationRemove
| ConversationGroupCreate
| ConversationGroupCreateFinish
| ConversationGroupLeave
| ConversationGroupLeaveFinish
| ConversationGroupDelete
| ConversationGroupDeleteFinish
| ConversationGroupAddMember
| ConversationGroupAddMemberFinish
| ConversationLoadPreviousMessages
| ConversationLoadPreviousMessagesFinish
| ConversationGroupUserRemove
| ConversationGroupUserRemoveFinish
| ConversationGroupRename
| ConversationMessageReact
| ConversationMessageReactFinish
| ConversationMessageUpdateTemporaryId
| ConversationMessageReply;
