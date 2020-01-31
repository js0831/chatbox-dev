import { Component, OnInit, OnDestroy } from '@angular/core';
import { JkAlertService } from 'jk-alert';
import { UserService } from 'src/app/landing/user.service';
import { DropdownActionInterface } from 'src/app/v2/shared/interfaces/dropdown-action.interface';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { CONVERSATION_SELECT } from '../../store/conversation/conversation.action';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';

@Component({
  selector: 'app-active-conversation',
  templateUrl: './active-conversation.component.html',
  styleUrls: ['./active-conversation.component.scss']
})
export class ActiveConversationComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  showActions = false;
  actions: DropdownActionInterface[] = [
    {
      label: 'Unfriend',
      value: 'unfriend',
      icon: 'user-delete'
    },
    {
      label: 'View profile',
      value: 'view-profile',
      icon: 'profile'
    }
  ];
  selectedConversation: ConversationInterface;
  friend: UserInterface;

  constructor(
    private action: ActionService,
    private alertService: JkAlertService,
    private userService: UserService,
    private conversationSV: ConversationService
  ) { }

  ngOnInit() {
    this.subs = [
      this.watchConversationState()
    ];
  }

  doAction(action: any) {
    alert(action.value);
  }

  hideActions() {
    setTimeout( x => {
      this.showActions = false;
    }, 200);
  }

  showMenu() {
    this.action.dispatch({
      action: 'MENU_SHOW'
    });
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case CONVERSATION_SELECT:
          this.selectedConversation = x.conversation.selected;
          this.friend = this.selectedConversation.members[0] as UserInterface;
          break;
        default:
          break;
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
