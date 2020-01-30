import { ConversationType } from './conversation.type.enum';
import { MessageInterface } from './message.interface';
import { UserInterface } from './user.interface';

export interface ConversationInterface {
    _id?: string;
    name?: string;
    type: ConversationType;
    members: string[] | UserInterface[];
    messages: MessageInterface[];
    createdBy: UserInterface | string;
}
