import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { EventInterface } from '../interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private action: BehaviorSubject<EventInterface<any>> = new BehaviorSubject({
    action: 'init'
  });

  constructor(
  ) { }

  dispatch(action: EventInterface<any>) {
    this.action.next(action);
  }

  get listen() {
    return this.action;
  }

  get value() {
    return this.action.value;
  }

  clear() {
    this.action.next({
      action: '',
      data: null
    });
  }

}
