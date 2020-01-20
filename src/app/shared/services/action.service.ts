import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private action: BehaviorSubject<{
    name: string,
    data?: any
  }> = new BehaviorSubject({
    name: 'init'
  });

  constructor(
    private socket: Socket
  ) { }

  dispatch(action: {
    name: string,
    data?: any
  }) {
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
      name: ''
    });
  }

  sendSocketEvent(payload: any) {
    this.socket.emit('event', payload);
  }

  watchSocketEvent(id: any) {
    return this.socket.fromEvent(`event-${id}`);
  }

}
