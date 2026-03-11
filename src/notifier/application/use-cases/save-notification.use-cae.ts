import { Injectable } from "@nestjs/common";
import { NotificationsRepository } from "src/notifier/domain/repositories/notifications.repository";

@Injectable()
export class SaveNotificationUseCase{
    constructor(private readonly notifierCommandService:NotificationsRepository){}
    execute(){
        
    }
}