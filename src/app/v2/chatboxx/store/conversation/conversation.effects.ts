import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { ResponseInterface } from 'src/app/v2/shared/interfaces/reponse.interface';
import {
  CONVERSATION_LIST_LOAD,
  ConversationListLoad,
  ConversationListLoadFinish,
  CONVERSATION_SELECT,
  ConversationSelect,
  ConversationLoadMessages
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
}
