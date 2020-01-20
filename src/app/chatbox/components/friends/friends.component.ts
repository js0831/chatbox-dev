import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/landing/user.service';
import { Subscription } from 'rxjs';
import { ActionService } from 'src/app/shared/services/action.service';
import { JkAlertService } from 'jk-alert';
import { ConversationService } from '../conversation/conversation.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnDestroy {

  friends: any[] = [];
  people = {
    friends: [],
    invitations: [],
    confirmations: []
  };
  unfilteredPeople: any;

  subs: Subscription[] = [];
  activeTab = 'friends';
  user: any;
  conversations: any = {};
  searchKey = '';

  constructor(
    private userService: UserService,
    private action: ActionService,
    private jkAlert: JkAlertService,
    private convoService: ConversationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.user = this.userService.currentUser.info;
    this.getFriends(this.user.id, 'friends');

    this.subs = [
      this.watchEvents(),
      this.watchRequestNotif(),
      this.watchWebSocketEvents()
    ];
  }

  private watchEvents() {
    return this.action.listen.subscribe( (x: any) => {
      switch (x.name) {
        case 'SELECT_USER_TAB':
          this.updateFriendList(x.data);
          break;
        case 'USER_UNFRIEND':
          this.people.friends = this.people.friends.filter( z => {
            return z.id !== x.data;
          });
          break;
        case 'USER_SEARCH':
          this.searchKey = x.data;
          break;
        default:
          break;
      }
    });
  }

  private watchWebSocketEvents() {
    return this.action.watchSocketEvent(this.user.id).subscribe( (x: any) => {
      if (x.name === 'unfriend') {
        this.people.friends = this.people.friends.filter( z => {
          return z.id !== x.data;
        });
      }
    });
  }

  private watchRequestNotif() {
    return this.userService.getRequestNotification(this.user.id).subscribe( (x: any) => {
      switch (x.type) {
        case 'invite':
          this.people.confirmations.push(x.by);
          break;
        case 'cancel':
          this.people.confirmations = this.people.confirmations.filter( z => {
            return z.id !== x.by.id;
          });
          break;
        case 'reject':
          this.people.invitations = this.people.invitations.filter( z => {
            return z.id !== x.by.id;
          });
          break;
        case 'accept':
          this.people.invitations = this.people.invitations.filter( z => {
            return z.id !== x.by.id;
          });
          break;
        default:
          break;
      }
    });
  }

  private updateOwnRequestNotification(type: string) {
    this.action.dispatch({
      name: 'REQUEST_NOTIF_UPDATE',
      data: type
    });
  }

  private updateFriendList(data: any) {
    this.friends = [];
    const type = data.value;
    this.activeTab = type;
    if (type === 'request') {
      this.getFriends(this.user.id, 'invitations');
      this.getFriends(this.user.id, 'confirmations');
    } else {
      this.getFriends(this.user.id, 'friends');
    }
  }

  private getFriends(id: string, type: string) {
    this.userService.getFriends(id, type).subscribe( x => {
      this.people[type] = x.data;
    });
  }

  conversationLoaded(friendId, convo) {
    this.conversations[friendId] = convo;
  }

  selectFriend(friend: any, type: string) {

    switch (type) {
      case 'friends':
        this.viewConversation(friend);
        break;
      case 'invitations':
        this.jkAlert.confirm(`Cancel ${friend.firstname} invitation?`, ['Yes', 'No']).then( (ans: number) => {
          this.cancelInvite(ans, friend.id);
        });
        break;
      case 'confirmations':
        this.jkAlert.confirm(`Respond to ${friend.firstname}'s friend request`, ['Accept', 'Reject', 'Decide Later'])
        .then( (ans: number) => {
          if (ans !== 2) {
            this.respondToRequest(ans, friend.id);
          }
        });
        break;
      default:
        break;
    }
  }

  private viewConversation(friend: any) {

    if (this.conversations[friend.id].id) {
      this.convoService.conversation.next(this.conversations[friend.id]);

      this.action.dispatch({
        name: 'CONVERSATION_VIEW',
        data: {
          conversationId: this.conversations[friend.id].id,
          friend
        }
      });

      this.notificationService.clearMessageNotification({
        conversation: this.conversations[friend.id].id,
        from: friend.id,
        member: this.user.id
      }).toPromise();
    }
  }

  private cancelInvite(answer: number, id: string) {
    if (answer === 0) {
      this.userService.cancelInvite(this.user.id, id).subscribe( x => {
        this.people.invitations = this.people.invitations.filter(p => p.id !== id);
      });

      this.userService.sendRequestNotification({
        type: 'cancel',
        to: id,
        by: this.user
      });
      this.updateOwnRequestNotification('cancel');
    }
  }

  private respondToRequest(answer: number, id: string) {
    const respond = (answer === 0) ? 'accept' : 'reject';
    this.userService.respondToRequest(this.user.id, id, respond).subscribe( x => {
      this.people.confirmations = this.people.confirmations.filter(p => p.id !== id);
      if (respond === 'accept') {
        this.createInitialConversation([this.user.id, id]);
      }
    });

    this.userService.sendRequestNotification({
      type: respond,
      to: id,
      by: this.user
    });
    this.updateOwnRequestNotification(respond);
  }

  createInitialConversation(members: string[]) {
    this.convoService.initializeConversation(members).toPromise();
  }
  ngOnDestroy() {
    this.action.clear();
    this.subs.forEach(x => x.unsubscribe());
  }

}
