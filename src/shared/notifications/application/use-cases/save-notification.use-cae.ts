import { Injectable } from "@nestjs/common";
import { NotificationsRepository } from "src/shared/notifications/domain/repositories/notifications.repository";
import { SavedNotificationVO } from "../../domain/value-objects/saved-notification.vo";
import { NotificationEntity } from "../../domain/entities/notification.entity";

@Injectable()
export class SaveNotificationUseCase{
    constructor(
        private readonly notificationsCommandService: NotificationsRepository
    ){}
    async execute(vo:SavedNotificationVO):Promise<NotificationEntity>{
        const savedNotification = await this.notificationsCommandService.saveNotification(vo)
        return savedNotification
    }
}