import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { Subscription } from 'rxjs';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { JkAlertService } from 'jk-alert';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  members: UserInterface[] = [];
  searchKey = '';
  searhTimer: any;
  isAdmin = false;
  selectedConversation: ConversationInterface;
  currentUser: UserInterface;

  constructor(
    private conversationSV: ConversationService,
    private actionSV: ActionService,
    private sessionSV: SessionService,
    private alertSV: JkAlertService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState()
    ];
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      this.selectedConversation = x.conversation.selected;
      this.members = this.selectedConversation.members as UserInterface[];
      this.isAdmin = this.currentUser._id === this.selectedConversation.createdBy;
    });
  }

  close() {
    this.actionSV.dispatch({
      action: 'SHOW_MEMBERS',
      data: false
    });
  }

  remove(m: UserInterface) {
    this.alertSV.confirm('Are you sure?', ['Yes', 'No']).then( x => {
      if (x === 0) {
        this.conversationSV.removeUserOnGroup({
          user: m._id,
          conversation: this.selectedConversation._id
        }).action();
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
