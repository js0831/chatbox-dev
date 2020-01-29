import { Action } from '@ngrx/store';

export const CONVERSATION_LIST_LOAD = '[Conversation] list load';
export const CONVERSATION_LIST_LOAD_FINISH = '[Conversation] list load finish';
export const CONVERSATION_SELECT = '[Conversation] SELECT';
export const CONVERSATION_LOAD_MESSAGES = '[Conversation] Load messages';
export const CONVERSATION_SEND_MESSAGE = '[Conversation] Send message';
export const CONVERSATION_ACTION_RESET = '[Conversation] Action reset';
export const CONVERSATION_ADD = '[Conversation] Add';
export const CONVERSATION_REMOVE = '[Conversation] Remove';

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

export type Actions =
| ConversationListLoad
| ConversationListLoadFinish
| ConversationSelect
| ConversationLoadMessages
| ConversationSendMessage
| ConversationActionReset
| ConversationAdd
| ConversationRemove;
