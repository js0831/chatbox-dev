import { Actions, Effect, ofType, act } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import {
  CONVERSATION_LIST_LOAD,
  ConversationListLoad,
  ConversationListLoadFinish,
  CONVERSATION_SELECT,
  ConversationSelect,
  ConversationLoadMessages,
  CONVERSATION_GROUP_CREATE,
  ConversationGroupCreate,
  ConversationGroupCreateFinish,
  CONVERSATION_GROUP_LEAVE,
  ConversationGroupLeave,
  ConversationGroupLeaveFinish,
  CONVERSATION_GROUP_DELETE,
  ConversationGroupDelete,
  ConversationGroupDeleteFinish,
  CONVERSATION_GROUP_ADD_MEMBER,
  ConversationGroupAddMember,
  ConversationGroupAddMemberFinish
} from './conversation.action';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';


@Injectable()
export class ConversationEffects {

    constructor(
        private action$: Actions,
        private convoSV: ConversationService
    ) { }

    @Effect() loadList: Observable<Action> = this.action$.pipe(
        ofType(CONVERSATION_LIST_LOAD),
        switchMap( (action: ConversationListLoad) => {
            const {id, type} = action.payload;
            return this.convoSV.getConversations({
              id,
              type
            }).pipe(
              map( res => {
                return new ConversationListLoadFinish(res);
              })
            );
        })
    );

    @Effect() loadConversationMessages: Observable<Action> = this.action$.pipe(
      ofType(CONVERSATION_SELECT),
      switchMap( (action: ConversationSelect) => {
          const {_id} = action.payload;
          return this.convoSV.getMessages(_id).pipe(
            map( res => {
              return new ConversationLoadMessages(res);
            })
          );
      })
    );

    @Effect() createGroup: Observable<Action> = this.action$.pipe(
      ofType(CONVERSATION_GROUP_CREATE),
      switchMap( (action: ConversationGroupCreate) => {
          return this.convoSV.createGroup(action.payload).pipe(
            map( res => {
              return new ConversationGroupCreateFinish(res);
            })
          );
      })
    );

    @Effect() leaveGroup: Observable<Action> = this.action$.pipe(
      ofType(CONVERSATION_GROUP_LEAVE),
      switchMap( (action: ConversationGroupLeave) => {
          return this.convoSV.leaveGroup(action.payload).pipe(
            map( res => {
              return new ConversationGroupLeaveFinish(action.payload);
            })
          );
      })
    );

    @Effect() deleteGroup: Observable<Action> = this.action$.pipe(
      ofType(CONVERSATION_GROUP_DELETE),
      switchMap( (action: ConversationGroupDelete) => {
          return this.convoSV.deleteGroup(action.payload).pipe(
            map( res => {
              return new ConversationGroupDeleteFinish(action.payload);
            })
          );
      })
    );

    @Effect() addMemberGroup: Observable<Action> = this.action$.pipe(
      ofType(CONVERSATION_GROUP_ADD_MEMBER),
      switchMap( (action: ConversationGroupAddMember) => {
          return this.convoSV.addMember({
            user: action.payload.user._id,
            conversation: action.payload.conversation,
          }).pipe(
            map( res => {
              return new ConversationGroupAddMemberFinish(action.payload.user);
            })
          );
      })
    );
}
