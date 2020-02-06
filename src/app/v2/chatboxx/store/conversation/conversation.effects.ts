import { Actions, Effect, ofType, act } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import * as actions from './conversation.action';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';


@Injectable()
export class ConversationEffects {

    constructor(
        private action$: Actions,
        private convoSV: ConversationService
    ) { }

    @Effect() loadList: Observable<Action> = this.action$.pipe(
        ofType(actions.CONVERSATION_LIST_LOAD),
        switchMap( (action: actions.ConversationListLoad) => {
            const {id, type} = action.payload;
            return this.convoSV.getConversations({
              id,
              type
            }).http().pipe(
              map( res => {
                return new actions.ConversationListLoadFinish(res);
              })
            );
        })
    );

    @Effect() loadConversationMessages: Observable<Action> = this.action$.pipe(
      ofType(actions.CONVERSATION_SELECT),
      switchMap( (action: actions.ConversationSelect) => {
          const {_id} = action.payload;
          return this.convoSV.getMessages(_id).pipe(
            map( res => {
              return new actions.ConversationLoadMessages(res);
            })
          );
      })
    );

    @Effect() createGroup: Observable<Action> = this.action$.pipe(
      ofType(actions.CONVERSATION_GROUP_CREATE),
      switchMap( (action: actions.ConversationGroupCreate) => {
          return this.convoSV.createGroup(action.payload).http().pipe(
            map( res => {
              return new actions.ConversationGroupCreateFinish(res);
            })
          );
      })
    );

    @Effect() leaveGroup: Observable<Action> = this.action$.pipe(
      ofType(actions.CONVERSATION_GROUP_LEAVE),
      switchMap( (action: actions.ConversationGroupLeave) => {
          return this.convoSV.leaveGroup(action.payload).http().pipe(
            map( res => {
              return new actions.ConversationGroupLeaveFinish(action.payload);
            })
          );
      })
    );

    @Effect() removeUserOnGroup: Observable<Action> = this.action$.pipe(
      ofType(actions.CONVERSATION_GROUP_USER_REMOVE),
      switchMap( (action: actions.ConversationGroupUserRemove) => {
          return this.convoSV.leaveGroup(action.payload).http().pipe(
            map( res => {
              return new actions.ConversationGroupUserRemoveFinish(action.payload);
            })
          );
      })
    );

    @Effect() deleteGroup: Observable<Action> = this.action$.pipe(
      ofType(actions.CONVERSATION_GROUP_DELETE),
      switchMap( (action: actions.ConversationGroupDelete) => {
          return this.convoSV.deleteGroup(action.payload).http().pipe(
            map( res => {
              return new actions.ConversationGroupDeleteFinish(action.payload);
            })
          );
      })
    );

    @Effect() addMemberGroup: Observable<Action> = this.action$.pipe(
      ofType(actions.CONVERSATION_GROUP_ADD_MEMBER),
      switchMap( (action: actions.ConversationGroupAddMember) => {
          return this.convoSV.addMember({
            user: action.payload.user._id,
            conversation: action.payload.conversation,
          }).http().pipe(
            map( res => {
              return new actions.ConversationGroupAddMemberFinish(action.payload.user);
            })
          );
      })
    );

    @Effect() getPreviousMessage: Observable<Action> = this.action$.pipe(
      ofType(actions.CONVERSATION_LOAD_PREVIOUS_MESSAGES),
      switchMap( (action: actions.ConversationLoadPreviousMessages) => {
          return this.convoSV.getPreviousMessage({
            id: action.payload.id,
            pagination: action.payload.pagination,
          }).http().pipe(
            map( res => {
              return new actions.ConversationLoadPreviousMessagesFinish(res);
            })
          );
      })
    );
}
