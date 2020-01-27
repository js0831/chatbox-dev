import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SessionService } from './session.service';
import { WebsocketEventType } from '../enums/websocket-event-type.enum';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(
      private socket: Socket,
      private sessionSV: SessionService
    ) {

  }

  dispatch(payload: {
      id: string,
      type: WebsocketEventType,
      data?: any
  }) {
    this.socket.emit(`ws`, payload);
  }

  listen(eventType: WebsocketEventType, id?: string) {
    return this.socket.fromEvent(`ws/${eventType}/${id || this.currentUserID}`);
  }

  private get currentUserID() {
      return this.sessionSV.data.user._id;
  }

}
