import { NotificationEntity } from "src/notifier/domain/entities/notification.entity";

export abstract class NotificationsPort{
    abstract listAllNotifications(user:string,page:number):Promise<NotificationEntity[]>
}