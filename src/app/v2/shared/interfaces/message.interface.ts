import { UserInterface } from './user.interface';

export interface MessageInterface {
    from: UserInterface | string;
    message: string;
    date?: string;
    // seen?: string[];
}
