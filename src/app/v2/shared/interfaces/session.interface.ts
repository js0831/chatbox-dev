import { UserInterface } from './user.interface';

export interface SessionInterface {
    user?: UserInterface;
    token: string;
}
