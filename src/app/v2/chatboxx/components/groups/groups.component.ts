import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { Subscription } from 'rxjs';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';
import * as actions from '../../store/conversation/conversation.action';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';
import { NotificationService } from 'src/app/v2/shared/services/notification.service';
import { NotificationType } from 'src/app/v2/shared/enums/notification-type.enum';

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
  notifications: NotificationInterface[] = [];


  constructor(
    private actionSV: ActionService,
    private conversationSV: ConversationService,
    private sessionSV: SessionService,
    private notificationSV: NotificationService
  ) { }

  ngOnInit() {
    this.currentUser =  this.sessionSV.data.user;
    this.subs = [
      this.watchAction(),
      this.watchConversationState(),
      this.watchNotificationState()
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

  private openConversationFromNotifaction() {
    if (this.actionSV.previousValue.action === 'NOTIFICATION_OPEN') {
      const ref = this.actionSV.previousValue.data.reference;
      const conversation = this.conversations.filter( c => c._id === ref);
      if (conversation.length > 0) {
        this.selectConversation(conversation[0]);
      }

    }
  }

  private watchNotificationState() {
    return this.notificationSV.notificationState.subscribe( x => {
      this.notifications = x.notification.list;
    });
  }

  countNotification(reference: string) {
    return this.notifications.filter( x => {
      return x.user === this.currentUser._id &&
        NotificationType.MESSAGE === x.type &&
        reference === x.reference;
    }).length;
  }

  selectConversation(conversation: ConversationInterface) {
    this.selectedConversation = conversation;
    this.conversationSV.actionSelectConversation(conversation);

    const params = {
      userid: this.currentUser._id,
      reference: conversation._id
    };
    this.notificationSV.stateDeleteByReference(params);
    this.notificationSV.deleteByReference(params).toPromise();
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case actions.CONVERSATION_GROUP_CREATE_FINISH:
        case actions.CONVERSATION_LIST_LOAD_FINISH:
        case actions.CONVERSATION_GROUP_LEAVE_FINISH:
        case actions.CONVERSATION_GROUP_DELETE_FINISH:
        case actions.CONVERSATION_GROUP_ADD_MEMBER_FINISH:
          this.conversations = x.conversation.list;
          this.openConversationFromNotifaction();
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
