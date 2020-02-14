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
import { ActiveConversationComponent } from './components/active-conversation/active-conversation.component';
import { FriendsComponent } from './components/friends/friends.component';
import { FriendsTabComponent } from './components/friends-tab/friends-tab.component';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { ConversationFilterPipe } from '../shared/pipes/conversation-filter.pipe';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { GroupsComponent } from './components/groups/groups.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { MembersComponent } from './components/members/members.component';
import { UserFilterPipe } from '../shared/pipes/user-filter.pipe';
import { ProfilePictureUpdateComponent } from './components/profile-picture-update/profile-picture-update.component';
import { EmojiPickerComponent } from './components/emoji-picker/emoji-picker.component';
import { EmojiFilterPipe } from './components/emoji-picker/emoji-filter.pipe';
import { ReactComponent } from './components/react/react.component';
import { ReactionsComponent } from './components/reactions/reactions.component';
import { ReplyComponent } from './components/reply/reply.component';
import { GiphyComponent } from './components/giphy/giphy.component';
import { SendPhotoComponent } from './components/send-photo/send-photo.component';



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
    ActiveConversationComponent,
    FriendsComponent,
    FriendsTabComponent,
    PaginationComponent,
    ConversationFilterPipe,
    NotificationsComponent,
    GroupsComponent,
    AddGroupComponent,
    AddMemberComponent,
    MembersComponent,
    UserFilterPipe,
    ProfilePictureUpdateComponent,
    EmojiPickerComponent,
    EmojiFilterPipe,
    ReactComponent,
    ReactionsComponent,
    ReplyComponent,
    GiphyComponent,
    SendPhotoComponent
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
