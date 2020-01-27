import { NotificationType } from '../enums/notification-type.enum';

export interface NotificationInterface {
    user: string;
    type: NotificationType;
    reference: string;
    message: string;
}
