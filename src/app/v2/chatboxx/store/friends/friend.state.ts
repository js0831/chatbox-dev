import { ActionState } from 'src/app/v2/shared/interfaces/action.state';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { FriendsType } from './friends-type.enum';

export interface FriendState {
    action: ActionState;
    users: {
        type: FriendsType;
        list: UserInterface[],
    };
}
