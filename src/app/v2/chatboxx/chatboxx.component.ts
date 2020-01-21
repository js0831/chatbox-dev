import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionService } from 'src/app/shared/services/action.service';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/services/session.service';

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
      switch (x.name) {
        case 'FRIENDS_SHOW':
          this.showFriends = x.data;
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
