import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { JkAlertService } from 'jk-alert';
import { DropdownActionInterface } from 'src/app/v2/shared/interfaces/dropdown-action.interface';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import * as actions from '../../store/conversation/conversation.action';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';

@Component({
  selector: 'app-active-conversation',
  templateUrl: './active-conversation.component.html',
  styleUrls: ['./active-conversation.component.scss']
})
export class ActiveConversationComponent implements OnInit, OnDestroy {

  @ViewChild('groupName', {static: false}) groupNameElement: ElementRef;

  subs: Subscription[] = [];
  showActions = false;
  actions = {
    GROUP: [
      {
        label: 'Add Member',
        value: 'add-member',
        icon: 'user-plus'
      },
      {
        label: 'Leave Group',
        value: 'leave-group',
        icon: 'exit'
      }
    ],
    PERSONAL: [
      {
        label: 'Unfriend',
        value: 'unfriend',
        icon: 'user-minus'
      },
    ]
  };

  selectedConversation: ConversationInterface;
  friend: UserInterface;
  currentUser: UserInterface;
  isAdmin = false;

  constructor(
    private actionSV: ActionService,
    private alertSV: JkAlertService,
    private userSV: UserService,
    private conversationSV: ConversationService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState()
    ];
    this.appendDeleteGroupAction();
  }

  private appendDeleteGroupAction() {
    if (this.selectedConversation.type === ConversationType.GROUP) {
      if (this.selectedConversation.createdBy === this.currentUser._id) {
        const action = {
          label: 'Delete Group',
          value: 'delete-group',
          icon: 'user-minus'
        };
        this.actions.GROUP[1] = action;
      }
    }
  }

  updateName() {
    this.conversationSV.renameGroup({
      id: this.selectedConversation._id,
      name: this.groupNameElement.nativeElement.textContent.trim()
    }).all();
  }

  doAction(action: any) {
    switch (action.value) {
      case 'unfriend':
        this.unfriendUser();
        break;
      case 'leave-group':
        this.leaveGroup();
        break;
      case 'delete-group':
        this.deleteGroup();
        break;
      case 'add-member':
        this.actionSV.dispatch({
          action: 'ADD_MEMBER',
          data: true
        });
        break;
      default:
        break;
    }
  }

  showMembers() {
    this.actionSV.dispatch({
      action: 'SHOW_MEMBERS',
      data: true
    });
  }

  hideActions() {
    setTimeout( x => {
      this.showActions = false;
    }, 200);
  }

  showMenu() {
    this.actionSV.dispatch({
      action: 'MENU_SHOW'
    });
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case actions.CONVERSATION_SELECT:
        case actions.CONVERSATION_GROUP_ADD_MEMBER_FINISH:
        case actions.CONVERSATION_GROUP_USER_REMOVE_FINISH:
          this.selectedConversation = x.conversation.selected;
          this.friend = this.selectedConversation.members[0] as UserInterface;
          this.isAdmin = this.currentUser._id === this.selectedConversation.createdBy;
          break;
        default:
          break;
      }
    });
  }

  private leaveGroup() {
    this.alertSV.confirm('Are you sure?', ['Yes', 'No']).then( x => {
      if (x === 0) {
        this.conversationSV.leaveGroup({
          user: this.currentUser._id,
          conversation: this.selectedConversation._id
        }).action();
      }
    });
  }

  private deleteGroup() {
    this.alertSV.confirm('Are you sure?', ['Yes', 'No']).then( x => {
      if (x === 0) {
        this.conversationSV.deleteGroup(this.selectedConversation._id).action();
      }
    });
  }

  private unfriendUser() {
    this.alertSV.confirm('Are you sure?', ['Yes', 'No']).then( x => {
      if (x === 0) {
        this.userSV.unfriend(this.friend._id, this.currentUser._id).subscribe( (res: any) => {
          this.conversationSV.actionRemoveConversation(res.data._id);
        });
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
  }
}
