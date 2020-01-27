import { ActionState } from 'src/app/v2/shared/interfaces/action.state';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { PaginationInterface } from 'src/app/v2/shared/interfaces/pagination.interface';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';

export interface ConversationState {
    action: ActionState;
    conversation: {
        type: ConversationType,
        list: ConversationInterface[],
        selected?: ConversationInterface
    };
}
