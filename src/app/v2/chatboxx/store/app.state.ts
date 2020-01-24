import { FriendState } from './friends/friend.state';
import { ConversationState } from './conversation/conversation.state';

export interface AppState {
    friendState: FriendState;
    conversationState: ConversationState;
}
