import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: BehaviorSubject<any>;

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) {
    const currentUserString = localStorage.getItem('user');
    if  (currentUserString) {
      this.setUser(JSON.parse(currentUserString));
    }
  }

  createUser(user: any) {
    return this.http.post('user', user).pipe(
      map( (x: any) => {
        const data = {
          id: x.data._id,
          accountId: x.data.accountId,
          firstname: x.data.firstname,
          lastname: x.data.lastname,
          email: x.data.email,
          username: x.data.username,
        };
        return {
          ...x,
          data
        };
      })
    );
  }

  inviteUser(by: string, who: string) {
    return this.http.post('user/invite', {
      by,
      who
    });
  }

  setUser(user: any) {
    if (!this.user) {
      this.user = new BehaviorSubject<any>(user);
    } else {
      this.user.next(user);
    }
  }

  getFriends(id: string, type: string) {
    return this.http.get(`user/${id}/${type}`).pipe(
      map((res: any) => {
        const friends = res.data.map( x => {
          return {
            id: x._id,
            firstname: x.firstname,
            lastname: x.lastname,
            email: x.email,
            username: x.username
          };
        });
        return {
          ...res,
          data: friends
        };
      })
    );
  }

  get currentUser(): any {
    return this.user ? this.user.value : null;
  }

  searchUser(userId: string, key: string) {
    return this.http.get(`user/${userId}/search/` + (key || '%20'), {
      headers: {
        loading: 'background',
      }
    });
  }

  getUserRequestCount(userId: string) {
    return this.http.get(`user/${userId}/request/count`);
  }

  cancelInvite(by: string, to: string) {
    return this.http.post('user/invite/cancel', {
      by,
      to
    });
  }

  respondToRequest(by: string, to: string, respond: string) {
    return this.http.post(`user/request/${respond}`, {
      by,
      to
    });
  }

  unfriend(conversation: string, who: string, by: string) {
    return this.http.post(`user/unfriend/`, {
      conversation,
      who,
      by
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.setUser(null);
  }

  sendRequestNotification({ type, to, by  }: any) {
    this.socket.emit(`request`, { type, to, by });
  }

  getRequestNotification(id: any) {
    return this.socket.fromEvent(`request-${id}`);
  }
}
