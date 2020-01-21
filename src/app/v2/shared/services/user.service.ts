import { Injectable } from '@angular/core';
import { SessionInterface } from '../interfaces/session.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../interfaces/user.interface';
import { ResponseInterface } from '../interfaces/reponse.interface';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) {
  }

  createUser(user: UserInterface): Observable<ResponseInterface<UserInterface>> {
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
}
