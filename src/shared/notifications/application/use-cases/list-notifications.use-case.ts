import { Injectable } from "@nestjs/common";
import { ListNotificationsDto } from "../dtos/list-notifications.dto";
import { NotificationsPort } from "../ports/notifications.port";


@Injectable()
export class ListNotificationsUseCase{
    constructor(private readonly notifierQueryService:NotificationsPort){}
    execute(dto:ListNotificationsDto){
        return this.notifierQueryService.listAllNotifications(dto.user,dto.page)
    }
}