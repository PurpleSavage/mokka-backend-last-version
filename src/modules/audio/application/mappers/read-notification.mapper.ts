import { ReadNotificationResponseDto } from "src/shared/notifications/application/dtos/responses/read-notification-response.dto";
import { NotificationEntity } from "src/shared/notifications/domain/entities/notification.entity";

export class ReadNotificationMapper{
    static toReadDto(entity:NotificationEntity):ReadNotificationResponseDto{
        return {
            id:entity.id,
            title:entity.title,
            message:'Read notification'
        }
    }
}