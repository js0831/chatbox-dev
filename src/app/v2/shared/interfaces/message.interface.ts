import { UserInterface } from './user.interface';

export interface MessageInterface {
    _id?: string;
    from: UserInterface;
    message: string;
    date?: string;
    // seen?: string[];
}
