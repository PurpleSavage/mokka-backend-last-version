// shared/infrastructure/websockets/notification.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { NotifierGateway } from "./notifier.gateway";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { ErrorNotification } from "src/shared/infrastructure/helpers/ExtractErrorInfo";



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
    notifyReady<T>(
        userId: string, 
        type: JobsType,
        data: {
            jobId: string | number,
            entity: T,
            status: StatusQueue,
            message?: string,
            creditsUpdate:number
        }
    ) {
        this.gateway.emitToUser(userId, `${type}-ready`, data);
    }

    notifyError(
        userId: string,
        type: JobsType,
        data: ErrorNotification
    ) {
        this.gateway.emitToUser(userId, `${type}-error`, data);
    }

   
    
}