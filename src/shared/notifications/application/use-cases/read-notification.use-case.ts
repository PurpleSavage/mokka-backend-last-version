import { Injectable } from "@nestjs/common";
import { ReadNotificationResponseDto } from "src/shared/notifications/application/dtos/responses/read-notification-response.dto";
import { NotificationsRepository } from "src/shared/notifications/domain/repositories/notifications.repository";
import { ReadNotificationMapper } from "../mappers/read-notification.mapper";

@Injectable()
export class ReadNotificationUseClase{
    constructor(
        private readonly notificationCommandService:NotificationsRepository
    ){}
    async execute(notificationId:string):Promise<ReadNotificationResponseDto>{
        const response = await this.notificationCommandService.readNotification(notificationId)
        return ReadNotificationMapper.toReadDto(response)
    }
}