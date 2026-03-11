import { Injectable } from "@nestjs/common";
import { NotificationsRepository } from "src/modules/notifications/domain/repositories/notifications.repository";

@Injectable()
export class SaveNotificationUseCase{
    constructor(private readonly notifierCommandService:NotificationsRepository){}
    execute(){
        
    }
}