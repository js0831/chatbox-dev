import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/services/session.service';
import { ActionService } from '../shared/services/action.service';

@Component({
  selector: 'app-chatboxx',
  templateUrl: './chatboxx.component.html',
  styleUrls: ['./chatboxx.component.scss']
})
export class ChatboxxComponent implements OnInit, OnDestroy {

  showFriends = false;
  subs: Subscription[];

  constructor(
    private actionSV: ActionService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.subs = [
      this.watchActions()
    ];
  }

  private watchActions() {
    return this.actionSV.listen.subscribe( x => {
      switch (x.action) {
        case 'FRIENDS_SHOW':
          this.showFriends = x.data.value;
          break;
        default:
          break;
      }
    });
  }

  ngOnDestroy(){
    this.subs.forEach(x => x.unsubscribe());
  }
}
