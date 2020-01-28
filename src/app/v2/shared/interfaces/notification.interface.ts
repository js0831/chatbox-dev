import { NotificationType } from '../enums/notification-type.enum';

export interface NotificationInterface {
    _id?: string;
    user: string;
    type: NotificationType;
    reference: string;
    message: string;
    createdDate?: string;
}
