import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxxComponent } from './chatboxx.component';
import { MainComponent } from './components/main/main.component';
import { SideComponent } from './components/side/side.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ConversationsComponent } from './components/conversations/conversations.component';
import { TabComponent } from './components/tab/tab.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActiveFriendComponent } from './components/active-friend/active-friend.component';
import { FriendsComponent } from './components/friends/friends.component';
import { FriendsTabComponent } from './components/friends-tab/friends-tab.component';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { ConversationFilterPipe } from '../shared/pipes/conversation-filter.pipe';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { GroupsComponent } from './components/groups/groups.component';
import { AddGroupComponent } from './components/add-group/add-group.component';



@NgModule({
  declarations: [
    ChatboxxComponent,
    MainComponent,
    SideComponent,
    ProfileComponent,
    ConversationsComponent,
    TabComponent,
    ConversationComponent,
    SendMessageComponent,
    ActiveFriendComponent,
    FriendsComponent,
    FriendsTabComponent,
    PaginationComponent,
    ConversationFilterPipe,
    NotificationsComponent,
    GroupsComponent,
    AddGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class ChatboxxModule { }
