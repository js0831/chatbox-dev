import { FriendsType } from '../../store/friends/friends-type.enum';

export interface FriendsTabInterface {
    label: string;
    value: FriendsType;
    count?: number;
}
