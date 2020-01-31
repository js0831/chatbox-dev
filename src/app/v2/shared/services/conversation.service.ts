import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConversationType } from '../interfaces/conversation.type.enum';
import { ResponseInterface } from '../interfaces/reponse.interface';
import { ConversationInterface } from '../interfaces/conversation.interface';
import { AppState } from '../../chatboxx/store/app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConversationState } from '../../chatboxx/store/conversation/conversation.state';
import {
  ConversationListLoad,
  ConversationSelect,
  ConversationSendMessage,
  ConversationActionReset,
  ConversationAdd,
  ConversationRemove,
  ConversationGroupCreate,
  ConversationGroupLeave,
  ConversationGroupDelete,
  ConversationGroupAddMember} from '../../chatboxx/store/conversation/conversation.action';
import { PaginationInterface } from '../interfaces/pagination.interface';
import { MessageInterface } from '../interfaces/message.interface';
import { UserInterface } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) { }

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
    this.store.dispatch(new ConversationListLoad({
      id,
      type,
      pagination,
      search
    }));
  }

  get conversationState(): Observable<ConversationState> {
    return this.store.select('conversationState');
  }

  stateSelectConversation(con: ConversationInterface) {
    this.store.dispatch(new ConversationSelect(con));
  }

  stateSendMessage(msg: any) {
    this.store.dispatch(new ConversationSendMessage(msg));
  }

  stateActionReset() {
    this.store.dispatch(new ConversationActionReset());
  }

  stateAddConversation(conversation: ConversationInterface) {
    this.store.dispatch(new ConversationAdd(conversation));
  }

  stateRemoveConversation(conversationId: string) {
    this.store.dispatch(new ConversationRemove(conversationId));
  }

  sendMessage(conversationId: string, data: MessageInterface) {
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

  stateAddMember(params: {
    conversation: string,
    user: UserInterface
  }) {
    this.store.dispatch(new ConversationGroupAddMember(params));
  }

  stateDeleteGroup(conversation: string) {
    this.store.dispatch(new ConversationGroupDelete(conversation));
  }

  stateCreateGroup(conversation: ConversationInterface) {
    this.store.dispatch(new ConversationGroupCreate(conversation));
  }

  stateLeaveGroup(params: {
    conversation: string,
    user: string
  }) {
    this.store.dispatch(new ConversationGroupLeave(params));
  }
}
