import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/v2/shared/services/action.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  name = 'test';
  open = false;
  constructor(
    private actionSV: ActionService
  ) { }

  ngOnInit() {
    setTimeout( x => {
      this.open = true;
    }, 100);
  }

  todo(action: string) {
    if (action === 'cancel') {
      this.open = false;
      setTimeout( x => {
        this.actionSV.dispatch({
          action: 'ADD_GROUP',
          data: false
        });
      }, 250);
    }
  }

}
