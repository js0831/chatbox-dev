import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  searchKey = '';
  isAddGroup = false;
  subs: Subscription[];

  constructor(
    private actionSV: ActionService
  ) { }

  ngOnInit() {
    this.subs = [
      this.watchAction()
    ];
  }

  private watchAction() {
    return this.actionSV.listen.subscribe( x => {
      if (x.action === 'ADD_GROUP') {
        this.isAddGroup = x.data;
      }
    });
  }

  addGroup() {
    this.isAddGroup = true;
  }
}
