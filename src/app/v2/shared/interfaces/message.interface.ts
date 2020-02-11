import { UserInterface } from './user.interface';
import { ReactionInterface } from './reaction.interface';

export interface MessageInterface {
    _id?: string;
    from: UserInterface;
    message: string;
    date?: string;
    reactions?: ReactionInterface[];
}
