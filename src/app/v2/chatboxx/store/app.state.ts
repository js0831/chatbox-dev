import { FriendState } from './friends/friend.state';
import { ConversationState } from './conversation/conversation.state';
import { NotificationState } from './notification/notification.state';

export interface AppState {
    friendState: FriendState;
    conversationState: ConversationState;
    notificationState: NotificationState;
}
