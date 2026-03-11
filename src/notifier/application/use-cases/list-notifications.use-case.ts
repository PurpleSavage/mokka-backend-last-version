import { Injectable } from "@nestjs/common";
import { NotificationsPort } from "../ports/notifications.port";
import { ListNotificationsDto } from "../dtos/list-notifications.dto";

@Injectable()
export class ListNotificationsUseCase{
    constructor(private readonly notifierQueryService:NotificationsPort){}
    execute(dto:ListNotificationsDto){
        return this.notifierQueryService.listAllNotifications(dto.user,dto.page)
    }
}