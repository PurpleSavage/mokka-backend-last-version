import { Injectable } from "@nestjs/common";
import { NotificationsRepository } from "src/shared/notifications/domain/repositories/notifications.repository";

@Injectable()
export class SaveNotificationUseCase{
    constructor(private readonly notifierCommandService:NotificationsRepository){}
    execute(){
        
    }
}