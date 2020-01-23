import { ActionState } from 'src/app/v2/shared/interfaces/action.state';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { FriendsType } from './friends-type.enum';
import { PaginationInterface } from 'src/app/v2/shared/interfaces/pagination.interface';

export interface FriendState {
    action: ActionState;
    users: {
        type: FriendsType;
        list: UserInterface[],
        pagination: PaginationInterface,
        search?: string;
    };
}
