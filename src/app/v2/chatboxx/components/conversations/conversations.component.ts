import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';
import { Subscription } from 'rxjs';
import { CONVERSATION_LIST_LOAD_FINISH } from '../../store/conversation/conversation.action';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnDestroy {

  currentUser: UserInterface;
  subs: Subscription[] = [];
  conversations: any[] = [];

  constructor(
    private conversationSV: ConversationService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;

    this.subs = [
      this.watchConversationState(),
    ];

    this.conversationSV.stateLoadConversations({
      id: this.currentUser._id,
      type: ConversationType.PERSONAL,
      search: '',
      pagination: {
        limit: 10,
        page: 0
      }
    });
  }

  private watchConversationState() {
    return this.conversationSV.conversationState().subscribe( x => {
      if (x.action.name === CONVERSATION_LIST_LOAD_FINISH) {
        this.conversations = x.conversation.list.map( con => {
          con.members = con.members.filter((u: any) => {
            return u._id !== this.currentUser._id;
          });
          return con;
        });
      }
    });
  }

  ngOnDestroy() {
    this.conversations = [];
    this.subs.forEach( x => x.unsubscribe());
  }
}
