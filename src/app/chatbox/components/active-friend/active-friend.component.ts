import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionService } from 'src/app/shared/services/action.service';
import { JkAlertService } from 'jk-alert';
import { UserService } from 'src/app/landing/user.service';
import { ConversationService } from '../conversation/conversation.service';

@Component({
  selector: 'app-active-friend',
  templateUrl: './active-friend.component.html',
  styleUrls: ['./active-friend.component.scss']
})
export class ActiveFriendComponent implements OnInit {


  subs: Subscription[] = [];
  friend: any;
  showActions = false;
  actions = [
    {
      label: 'Unfriend',
      value: 'unfriend'
    },
    {
      label: 'View profile',
      value: 'view-profile'
    }
  ];

  constructor(
    private action: ActionService,
    private alertService: JkAlertService,
    private userService: UserService,
    private conversationService: ConversationService
  ) { }

  ngOnInit() {
    this.subs.push(this.action.listen.subscribe( x => {
      switch (x.name) {
        case 'CONVERSATION_VIEW':
          this.friend = x.data.friend;
          break;
        default:
          break;
      }
    }));
  }

  doAction(action: any) {
    switch (action.value) {
      case 'unfriend':
        this.alertService.confirm('Are you sure?', ['Yes', 'Cancel']).then( x => {
          if (x === 0) {
            this.userService.unfriend(
              this.conversationService.conversation.value.id,
              this.friend.id,
              this.userService.currentUser.info.id
            ).subscribe( y => {
              this.action.dispatch({
                name: 'USER_UNFRIEND',
                data: this.friend.id
              });

              this.action.sendSocketEvent({
                to: this.friend.id,
                data: {
                  name: 'unfriend',
                  data: this.userService.currentUser.info.id
                }
              });
            });
          }
        });
        break;
      default:
        this.alertService.info('AVAILABLE SOON!');
        break;
    }
  }

  hideActions() {
    setTimeout( x => {
      this.showActions = false;
    }, 200);
  }
}
