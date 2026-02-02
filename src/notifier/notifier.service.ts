// shared/infrastructure/websockets/notification.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { NotifierGateway } from "./notifier.gateway";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { ErrorNotification } from "src/shared/infrastructure/helpers/ExtractErrorInfo";




@Injectable()
export class NotifierService implements OnModuleInit {
    constructor(private readonly gateway: NotifierGateway) {}

    onModuleInit() {
        console.log('NotificationService initialized');
    }

    // Métodos genéricos
    notifyReady<T>(
        userId: string, 
        type: 'image' | 'video' | 'audio' | 'text' | 'image-remix'|'influencer',
        data: {
            jobId: string | number,
            entity: T,
            status: StatusQueue,
            message?: string,
            
        }
    ) {
        this.gateway.emitToUser(userId, `${type}-ready`, data);
    }

    notifyError(
        userId: string,
        type: 'image' | 'video' | 'audio' | 'text' | 'image-remix'|'influencer',
        data: ErrorNotification
    ) {
        this.gateway.emitToUser(userId, `${type}-error`, data);
    }

   
    
}