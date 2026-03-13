import { NotificationEntity } from "../entities/notification.entity";
import { SavedNotificationVO } from "../value-objects/saved-notification.vo";



export abstract class NotificationsRepository{
    abstract saveNotification(vo:SavedNotificationVO):Promise<NotificationEntity>
}