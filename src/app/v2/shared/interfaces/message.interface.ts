import { UserInterface } from './user.interface';

export interface MessageInterface {
    from: UserInterface;
    message: string;
    date?: string;
    // seen?: string[];
}
