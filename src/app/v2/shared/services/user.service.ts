import { Injectable } from '@angular/core';
import { SessionInterface } from '../interfaces/session.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../interfaces/user.interface';
import { ResponseInterface } from '../interfaces/reponse.interface';

import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../chatboxx/store/app.state';
import { FriendState } from '../../chatboxx/store/friends/friend.state';
import { FriendsType } from '../../chatboxx/store/friends/friends-type.enum';
import { FriendLoadUserList } from '../../chatboxx/store/friends/friends.action';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) {
  }

  createUser(user: UserInterface): Observable<ResponseInterface<UserInterface>> {
    return this.http.post('user', user).pipe(
      map( (x: any) => {
        const {
          _id,
          firstname,
          lastname,
          email,
          username,
        } = x.data;

        return {
          ...x,
          data: {
            _id,
            firstname,
            lastname,
            email,
            username,
          }
        };
      })
    );
  }

  getUsers(id: string): Observable<ResponseInterface<UserInterface[]>> {
    return this.http.get(`user/${id}`) as Observable<ResponseInterface<UserInterface[]>>;
  }

  get friendState(): Observable<FriendState> {
    return this.store.select('friendState');
  }

  getFriends(id: string, type: FriendsType) {
    this.store.dispatch(new FriendLoadUserList({id, type}));
  }
}
