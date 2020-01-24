import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConversationType } from '../interfaces/conversation.type.enum';
import { ResponseInterface } from '../interfaces/reponse.interface';
import { ConversationInterface } from '../interfaces/conversation.interface';
import { AppState } from '../../chatboxx/store/app.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConversationState } from '../../chatboxx/store/conversation/conversation.state';
import { ConversationListLoad } from '../../chatboxx/store/conversation/conversation.action';
import { PaginationInterface } from '../interfaces/pagination.interface';


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

  conversationState(): Observable<ConversationState> {
    return this.store.select('conversationState');
  }
}
