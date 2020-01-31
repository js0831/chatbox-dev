import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { CONVERSATION_SELECT, CONVERSATION_REMOVE, CONVERSATION_GROUP_DELETE_FINISH, CONVERSATION_GROUP_LEAVE_FINISH } from '../../store/conversation/conversation.action';
import { ActionService } from 'src/app/v2/shared/services/action.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  selectedConversation: ConversationInterface;
  isAddMember = false;

  constructor(
    private conversationSV: ConversationService,
    private actionSV: ActionService
  ) { }

  ngOnInit() {
    this.subs = [
      this.watchConversationState(),
      this.watchAction()
    ];
  }

  private watchAction() {
    return this.actionSV.listen.subscribe( x => {
      switch (x.action) {
        case 'ADD_MEMBER':
          this.isAddMember = x.data;
          break;
        default:
          break;
      }
    });
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case CONVERSATION_SELECT:
          this.selectedConversation = null;
          setTimeout( () => {
            this.selectedConversation = x.conversation.selected;
          });
          break;

        case CONVERSATION_REMOVE:
        case CONVERSATION_GROUP_DELETE_FINISH:
          const convoIDs = x.conversation.list.map( c => {
            return c._id;
          });
          if (convoIDs.indexOf(this.selectedConversation._id) === -1) {
            this.selectedConversation = null;
          }
          break;
        case CONVERSATION_GROUP_LEAVE_FINISH:
          this.selectedConversation = null;
          break;
        default:
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach( x => x.unsubscribe());
  }
}
