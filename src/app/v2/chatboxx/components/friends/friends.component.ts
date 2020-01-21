import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/shared/services/action.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  constructor(
    private actionSV: ActionService
  ) { }

  ngOnInit() {
  }

  close() {
    this.actionSV.dispatch({name: 'FRIENDS_SHOW', data: false});
  }
}
