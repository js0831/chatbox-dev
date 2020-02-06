import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConversationType } from '../interfaces/conversation.type.enum';
import { ResponseInterface } from '../interfaces/reponse.interface';
import { ConversationInterface } from '../interfaces/conversation.interface';
import { AppState } from '../../chatboxx/store/app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConversationState } from '../../chatboxx/store/conversation/conversation.state';
import * as actions from '../../chatboxx/store/conversation/conversation.action';
import { PaginationInterface } from '../interfaces/pagination.interface';
import { MessageInterface } from '../interfaces/message.interface';
import { UserInterface } from '../interfaces/user.interface';
import { stringify } from 'querystring';


@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) { }

    /* HTTP REQUEST START  */
  getConversations(params: {
    id: string,
    type: ConversationType
  }): Observable<ResponseInterface<ConversationInterface>> {
    const { id, type } = params;
    const url = `conversation/${id}/type/${type}`;
    return this.http.get(url) as Observable<ResponseInterface<ConversationInterface>>;
  }

  stateLoadConversations(params: {
    id: string,
    type: ConversationType,
    pagination?: PaginationInterface,
    search?: string
  }) {
    const { id, type, pagination, search } = params;
    this.store.dispatch(new actions.ConversationListLoad({
      id,
      type,
      pagination,
      search
    }));
  }

  sendMessage(conversationId: string, data: MessageInterface | any) {
    const url = 'conversation/message';
    return this.http.post(url, {
      conversationId,
      from: data.from,
      message: data.message
    }, {
      headers: {
        loading: 'background'
      }
    });
  }

  getMessages(conversationId: string):
  Observable<ResponseInterface<MessageInterface[]>> {
    const url = `conversation/${conversationId}/messages`;
    return this.http.get(url) as Observable<ResponseInterface<MessageInterface[]>>;
  }

  createGroup(conversation: ConversationInterface) {
    return this.http.post('conversation', conversation);
  }

  leaveGroup(params: {
    conversation: string,
    user: string
  }) {
    return this.http.patch('conversation/leave', params);
  }

  deleteGroup(conversation: string) {
    return this.http.delete(`conversation/${conversation}`);
  }

  addMember(params: {
    conversation: string,
    user: string
  }) {
    return this.http.patch('conversation/member', params);
  }
  /* HTTP REQUEST END  */

  /* STORE  */
  get conversationState(): Observable<ConversationState> {
    return this.store.select('conversationState');
  }

  actionSelectConversation(con: ConversationInterface) {
    this.store.dispatch(new actions.ConversationSelect(con));
  }

  actionSendMessage(msg: any) {
    this.store.dispatch(new actions.ConversationSendMessage(msg));
  }

  actionActionReset() {
    this.store.dispatch(new actions.ConversationActionReset());
  }

  actionAddConversation(conversation: ConversationInterface) {
    this.store.dispatch(new actions.ConversationAdd(conversation));
  }

  actionRemoveConversation(conversationId: string) {
    this.store.dispatch(new actions.ConversationRemove(conversationId));
  }

  actionAddMember(params: {
    conversation: string,
    user: UserInterface
  }) {
    this.store.dispatch(new actions.ConversationGroupAddMember(params));
  }

  actionDeleteGroup(conversation: string) {
    this.store.dispatch(new actions.ConversationGroupDelete(conversation));
  }

  actionCreateGroup(conversation: ConversationInterface) {
    this.store.dispatch(new actions.ConversationGroupCreate(conversation));
  }

  actionLeaveGroup(params: {
    conversation: string,
    user: string
  }) {
    this.store.dispatch(new actions.ConversationGroupLeave(params));
  }

  getPreviousMessage(params: {id: string, pagination: PaginationInterface}) {
    return {
      http: (): Observable<ResponseInterface<MessageInterface[]>> => {
        const url = `conversation/${params.id}/messages/${params.pagination.page}/${params.pagination.limit}`;
        return this.http.get(url) as Observable<ResponseInterface<MessageInterface[]>>;
      },
      action: () => {
        this.store.dispatch(new actions.ConversationLoadPreviousMessages(params));
      }
    };
  }
}
