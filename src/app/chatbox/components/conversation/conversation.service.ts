import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  conversation = new BehaviorSubject<{
    members?: string[],
    id?: string
  }>({});

  constructor(
      private http: HttpClient
  ) {
  }

  initializeConversation(members: string[]) {
    return this.http.post('conversation', {members});
  }

  getConversation(members: string[]) {
    return this.http.get(
      `conversation/id/${members[0]}/${members[1]}`,
      {
        headers: {
          loading: 'background'
        }
      }
    ).pipe(
      map((res: any) => {
        const data = res.data || {_id: null, members: []};
        return {
          ...res,
          data: {
            id: data._id,
            members: data.members
          }
        };
      })
    );
  }

  getConversations(id: string) {
    return this.http.get(`conversation/${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  sendMessage(data: any) {
    return this.http.post('conversation/message', {
      conversationId: this.conversation.value.id,
      message: data.message,
      from: data.from,
    }, {
      headers: {
        loading: 'background',
      }
    });
  }
}
