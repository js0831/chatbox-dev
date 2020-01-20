import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {

  }


  createMessageNotification({conversation, from, members}: any) {
    return this.http.post('message-notification', {
      conversation,
      from,
      members
    }, {
      headers: {
        loading: 'background'
      }
    });
  }

  getMessageNotification(conversation: string, fromUserId: string, member: string) {
    return this.http.get(`message-notification/${conversation}/${fromUserId}/${member}`);
  }

  clearMessageNotification({conversation, from, member}: any) {
    return this.http.post(
      `message-notification/clear`,
      {conversation, from, member},
      {
        headers: {
          loading: 'background'
        }
      }
    );
  }
}
