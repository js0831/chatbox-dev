export interface UserInterface {
    _id?: string;
    accountId: string;
    username: string;
    email: string;
    firstname: string;
    lastname?: string;
    invites?: UserInterface[];
    friendRequest?: UserInterface[];
}
