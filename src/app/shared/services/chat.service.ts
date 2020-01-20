import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) {

  }


  sendMessage(payload: any) {
    this.socket.emit('chat', payload);
  }

  typing(id: string, who: string) {
    this.socket.emit('typing', {
      id,
      who
    });
  }

  isTyping(id: any) {
    return this.socket.fromEvent(`typing-${id}`);
  }

  receiveMessage(id: any) {
    return this.socket.fromEvent(`chat-${id}`);
  }

  getUsers() {
    return this.socket.fromEvent('users');
  }

}
