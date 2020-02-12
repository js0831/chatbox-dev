import { ActionState } from 'src/app/v2/shared/interfaces/action.state';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { PaginationInterface } from 'src/app/v2/shared/interfaces/pagination.interface';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';
import { MessageInterface } from 'src/app/v2/shared/interfaces/message.interface';

export interface ConversationState {
    action: ActionState;
    conversation: {
        type: ConversationType,
        list: ConversationInterface[],
        selected?: ConversationInterface,
        messages?: MessageInterface[],
        reply?: MessageInterface,
    };
}
