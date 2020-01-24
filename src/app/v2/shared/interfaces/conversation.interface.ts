import { ConversationType } from './conversation.type.enum';
import { MessageInterface } from './message.interface';

export interface ConversationInterface {
    type: ConversationType;
    members: string[];
    messages: MessageInterface[];
}
