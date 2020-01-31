import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { Subscription } from 'rxjs';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';
import { CONVERSATION_GROUP_CREATE_FINISH, CONVERSATION_LIST_LOAD_FINISH } from '../../store/conversation/conversation.action';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {

  searchKey = '';
  isAddGroup = false;
  subs: Subscription[];
  conversations: ConversationInterface[] = [];
  currentUser: UserInterface;
  selectedConversation: ConversationInterface;


  constructor(
    private actionSV: ActionService,
    private conversationSV: ConversationService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.currentUser =  this.sessionSV.data.user;
    this.subs = [
      this.watchAction(),
      this.watchConversationState()
    ];

    this.conversationSV.stateLoadConversations({
      id: this.currentUser._id,
      type: ConversationType.GROUP,
      search: '',
      pagination: {
        limit: 10,
        page: 0
      }
    });
  }

  selectConversation(conversation: ConversationInterface) {
    this.selectedConversation = conversation;
    this.conversationSV.stateSelectConversation(conversation);

    // const params = {
    //   userid: this.currentUser._id,
    //   reference: conversation._id
    // };
    // this.notificationSV.stateDeleteByReference(params);
    // this.notificationSV.deleteByReference(params).toPromise();
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case CONVERSATION_GROUP_CREATE_FINISH:
        case CONVERSATION_LIST_LOAD_FINISH:
          this.conversations = x.conversation.list;
          break;
        default:
          break;
      }
    });
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

  ngOnDestroy() {
    this.subs.forEach( x => x.unsubscribe());
    this.conversations = [];
  }
}
