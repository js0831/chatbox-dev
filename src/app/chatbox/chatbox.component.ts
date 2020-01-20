import { Component, OnInit } from '@angular/core';
import { ActionService } from '../shared/services/action.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {

  isAddFriend = false;
  constructor(
    private action: ActionService
  ) { }

  ngOnInit() {
    this.action.listen.subscribe( x => {
      if (x.name === 'ADD_FRIEND') {
        this.isAddFriend = x.data;
      }
    });
  }

}
