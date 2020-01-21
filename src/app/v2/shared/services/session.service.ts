import { Injectable } from '@angular/core';
import { SessionInterface } from '../interfaces/session.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private userSession: BehaviorSubject<SessionInterface>;

  constructor() {
    this.retrieve();
  }

  save(session: SessionInterface) {
    if (!this.userSession) {
      this.userSession = new BehaviorSubject<SessionInterface>(session);
    } else {
      this.userSession.next(session);
    }
    localStorage.setItem('session', JSON.stringify(this.userSession.value));
  }

  get data(): SessionInterface {
    return this.userSession ? this.userSession.value : null;
  }

  retrieve() {
    const currentUserSession = localStorage.getItem('session');
    if  (currentUserSession) {
      this.save(JSON.parse(currentUserSession));
    }
  }

  logout() {
    localStorage.removeItem('session');
    this.userSession.next(null);
  }
}
