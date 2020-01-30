import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';
import { Subscription } from 'rxjs';
import { CONVERSATION_GROUP_CREATE_FINISH } from '../../store/conversation/conversation.action';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit, OnDestroy {


  name = '';
  open = false;
  currentUser: UserInterface;
  subs: Subscription[];

  constructor(
    private actionSV: ActionService,
    private conversationSV: ConversationService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.currentUser =  this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState()
    ];
    setTimeout( x => {
      this.open = true;
    }, 100);
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      if (x.action.name === CONVERSATION_GROUP_CREATE_FINISH) {
        this.todo('cancel');
      }
    });
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
    } else {
      this.createGroup();
    }
  }

  private createGroup() {
    if (this.name.length === 0) { return; }
    const conversation: ConversationInterface = {
      createdBy: this.currentUser._id,
      members: [this.currentUser._id],
      name: this.name,
      type: ConversationType.GROUP,
      messages: []
    };
    this.conversationSV.stateCreateGroup(conversation);
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
    this.conversationSV.stateActionReset();
  }

}
