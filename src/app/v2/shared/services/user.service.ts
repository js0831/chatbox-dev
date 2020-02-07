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
import * as actions from '../../chatboxx/store/friends/friends.action';
import { PaginationInterface } from '../interfaces/pagination.interface';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private domSanitizer: DomSanitizer,
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

  getUsers(params: {
    id: string,
    search?: string,
    pagination: PaginationInterface
  }): Observable<ResponseInterface<UserInterface[]>> {
    const {id, search, pagination } = params;
    const searchParam = search ? `${search}/` : '%20/';
    const url = `user/${id}/${searchParam}${pagination.page}/${pagination.limit}`;
    return this.http.get(url) as Observable<ResponseInterface<UserInterface[]>>;
  }

  inviteUser(userId: string, byUserId: string): Observable<ResponseInterface<UserInterface>> {
    return this.http.post('user/invite', {
      userId,
      byUserId
    }) as Observable<ResponseInterface<UserInterface>>;
  }

  cancelInvite(by: string, to: string) {
    return this.http.post('user/invite/cancel', {
      by,
      to
    });
  }

  respondToFriendRequest(by: string, to: string, respond: string) {
    return this.http.post(`user/friend/request/${respond}`, {
      by,
      to
    });
  }

  getFriendRequest(params: {
    id: string,
    search?: string,
    pagination: PaginationInterface
  }): Observable<ResponseInterface<UserInterface[]>> {
    const {id, search, pagination } = params;
    const searchParam = search ? `${search}/` : '%20/';
    const url = `user/${id}/friend/request/${searchParam}${pagination.page}/${pagination.limit}`;
    return this.http.get(url) as Observable<ResponseInterface<UserInterface[]>>;
  }

  getFriends(params: {
    id: string,
    search?: string,
    pagination: PaginationInterface
  }): Observable<ResponseInterface<UserInterface[]>> {
    const {id, search, pagination } = params;
    const searchParam = search ? `${search}/` : '%20/';
    const url = `user/${id}/friends/${searchParam}${pagination.page}/${pagination.limit}`;
    return this.http.get(url) as Observable<ResponseInterface<UserInterface[]>>;
  }

  unfriend(who: string, by: string) {
    return this.http.post(`user/unfriend`, {
      who,
      by
    });
  }

  /**
   * STATE START
   */
  get friendState(): Observable<FriendState> {
    return this.store.select('friendState');
  }

  stateGetFriends(params: {
    id: string,
    type: FriendsType,
    pagination: PaginationInterface,
    search?: string
  }) {
    const {id, type, pagination, search} = params;
    this.store.dispatch(new actions.FriendLoadUserList({id, type, pagination, search}));
  }

  updateProfilePicture(params: {
    id: string,
    file: FormData
  }) {
    const boundary = new Date().getTime();
    return this.http.post(`user/upload/${params.id}`, params.file);
  }

  getProfilePicture(userId: string) {
    const url = `${environment.apiURL}user/${userId}.jpg?t=${new Date().getTime()}`;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
