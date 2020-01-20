import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxComponent } from './chatbox.component';
import { SideComponent } from './components/side/side.component';
import { ContentComponent } from './components/content/content.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FriendsComponent } from './components/friends/friends.component';
import { FindFriendsComponent } from './components/find-friends/find-friends.component';
import { FormsModule } from '@angular/forms';
import { ConversationComponent } from './components/conversation/conversation.component';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { ActiveFriendComponent } from './components/active-friend/active-friend.component';
import { MessageNotificationComponent } from './components/message-notification/message-notification.component';
import { UserFilterPipe } from '../shared/pipes/user-filter.pipe';



@NgModule({
  declarations: [
    ChatboxComponent,
    SideComponent,
    ContentComponent,
    ProfileComponent,
    FriendsComponent,
    FindFriendsComponent,
    ConversationComponent,
    SendMessageComponent,
    ActiveFriendComponent,
    MessageNotificationComponent,
    UserFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ChatboxModule { }
