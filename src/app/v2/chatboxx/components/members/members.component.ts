import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { Subscription } from 'rxjs';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { JkAlertService } from 'jk-alert';
import { UserService } from 'src/app/v2/shared/services/user.service';

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
  profilePictures: any = [];
  onlineUsers: UserInterface[] = [];

  constructor(
    private conversationSV: ConversationService,
    private actionSV: ActionService,
    private sessionSV: SessionService,
    private alertSV: JkAlertService,
    private userSV: UserService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState(),
      this.watchOnlineUsers()
    ];
  }

  private getProfilePictures() {
    this.profilePictures = this.members.map( m => {
      return this.userSV.getProfilePicture(m._id);
    });
  }

  isOnline(id) {
    return this.onlineUsers.filter( x => x._id === id).length > 0;
  }

  private watchOnlineUsers() {
    return this.userSV.friendState.subscribe( x => {
      this.onlineUsers = x.users.onlines;
    });
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      this.selectedConversation = x.conversation.selected;
      this.members = this.selectedConversation.members as UserInterface[];
      this.isAdmin = this.currentUser._id === this.selectedConversation.createdBy;
      this.getProfilePictures();
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
