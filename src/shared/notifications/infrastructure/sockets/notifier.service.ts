// shared/infrastructure/websockets/notification.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { NotifierGateway } from "../../../../shared/notifications/infrastructure/sockets/notifier.gateway";
import { ErrorSendNotification } from "../errors/types/error-send-notification";




export enum JobsType {
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    TEXT = 'text',
    IMAGE_REMIX = 'image-remix',
    INFLUENCER = 'influencer',
    INFLUENCER_SNAPSHOT = 'influencer-snapshot',
    INFLUENCER_SCENE = 'influencer-scene'
}

@Injectable()
export class NotifierService implements OnModuleInit {
    constructor(private readonly gateway: NotifierGateway) {}

    onModuleInit() {
        console.log('NotificationService initialized');
    }

    // Métodos genéricos
    notifyReady<T,K>(
        userId: string, 
        type: JobsType,
        data: {
            jobId: string | number,
            entity: T,
            status: StatusQueue,
            message?: string,
            creditsUpdate:number,
            notification?:K
        }
    ) {
        this.gateway.emitToUser(userId, `${type}-ready`, data);
    }

    notifyError<T>(
        userId: string,
        type: JobsType,
        data: ErrorSendNotification<T>
    ) {
        this.gateway.emitToUser(userId, `${type}-error`, data);
    }

   
    
}