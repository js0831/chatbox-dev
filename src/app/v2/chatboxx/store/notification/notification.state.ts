import { ActionState } from 'src/app/v2/shared/interfaces/action.state';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { PaginationInterface } from 'src/app/v2/shared/interfaces/pagination.interface';
import { ConversationType } from 'src/app/v2/shared/interfaces/conversation.type.enum';
import { MessageInterface } from 'src/app/v2/shared/interfaces/message.interface';
import { NotificationInterface } from 'src/app/v2/shared/interfaces/notification.interface';

export interface NotificationState {
    action: ActionState;
    notification: {
        list: NotificationInterface[],
    };
}
