import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { EventInterface } from '../interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private prevValue: EventInterface<any>;

  private action: BehaviorSubject<EventInterface<any>> = new BehaviorSubject({
    action: 'init'
  });

  constructor(
  ) { }

  dispatch(action: EventInterface<any>) {
    this.prevValue = this.value;
    this.action.next(action);
  }

  get listen() {
    return this.action;
  }

  get value() {
    return this.action.value;
  }

  get previousValue() {
    return this.prevValue;
  }

  clear() {
    this.action.next({
      action: '',
      data: null
    });
  }

}
