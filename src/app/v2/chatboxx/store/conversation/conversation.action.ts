import { Action } from '@ngrx/store';

export const CONVERSATION_LIST_LOAD = '[Conversation] list load';
export const CONVERSATION_LIST_LOAD_FINISH = '[Conversation] list load finish';

export class ConversationListLoad implements Action {
    readonly type = CONVERSATION_LIST_LOAD;
    constructor(public payload?: any) {}
}

export class ConversationListLoadFinish implements Action {
    readonly type = CONVERSATION_LIST_LOAD_FINISH;
    constructor(public payload?: any) {}
}

export type Actions =
| ConversationListLoad
| ConversationListLoadFinish;
