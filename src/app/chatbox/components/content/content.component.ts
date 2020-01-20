import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from '../conversation/conversation.service';
import { Subscription } from 'rxjs';
import { ActionService } from 'src/app/shared/services/action.service';
import { UserService } from 'src/app/landing/user.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {

  convoId: string;
  subs: Subscription[] = [];

  constructor(
    private action: ActionService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.subs = [
      this.watchEvents(),
      this.watchWebSocketEvents()
    ];
  }

  private watchEvents() {
    return this.action.listen.subscribe( x => {
      switch (x.name) {
        case 'CONVERSATION_VIEW':
          this.convoId = null;
          setTimeout( z => {
            this.convoId = x.data.conversationId;
          }, 100);
          break;
        case 'USER_UNFRIEND':
          this.convoId = null;
          break;
        default:
          break;
      }
    });
  }
  private watchWebSocketEvents() {
    return this.action.watchSocketEvent(this.userService.currentUser.info.id).subscribe( (x: any) => {
      if (x.name === 'unfriend') {
        this.convoId = null;
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }

}
