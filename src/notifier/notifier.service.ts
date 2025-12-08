// shared/infrastructure/websockets/notification.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { NotifierGateway } from "./notifier.gateway";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { ImageEntity } from "src/modules/image/domain/entities/image.entity";
import { AudioEntity } from "src/modules/audio/domain/entities/audio.entity";
import { TextEntity } from "src/modules/text/domain/entities/text.entity";
import { RemixImageEntity } from "src/modules/image/domain/entities/remix-image.entity";
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
        type: 'image' | 'video' | 'audio' | 'text' | 'image-remix',
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
        type: 'image' | 'video' | 'audio' | 'text' | 'image-remix',
        data: ErrorNotification
    ) {
        this.gateway.emitToUser(userId, `${type}-error`, data);
    }

    // Métodos específicos para cada tipo (opcional, para mejor tipado)
    notifyImageReady(userId: string, data: { 
        jobId: string | number; 
        entity:ImageEntity; 
        status: StatusQueue; 
        message?: string 
    }) {
        this.notifyReady(userId, 'image', data);
    }

    notifyImageError(userId: string, data: ErrorNotification
    ) {
        this.notifyError(userId, 'image', data);
    }
    notifyImageRemixReady(userId: string, data: { 
        jobId: string | number; 
        entity:RemixImageEntity; 
        status: StatusQueue;
         message?: string 
    }) {
        this.notifyReady(userId, 'image-remix', data);
    }

    notifyImageRemixError(userId: string, data: ErrorNotification
    ) {
        this.notifyError(userId, 'image-remix', data);
    }

    notifyVideoReady(userId: string, data: { 
        jobId: string | number; 
        entity: any; status: StatusQueue; 
        message?: string 
    }) {
        this.notifyReady(userId, 'video', data);
    }

    notifyVideoError(userId: string, data:ErrorNotification
    ) {
        this.notifyError(userId, 'video', data);
    }

    notifyAudioReady(userId: string, data: { 
        jobId: string | number; 
        entity: AudioEntity; 
        status: StatusQueue;
         message?: string 
    }) {
        this.notifyReady(userId, 'audio', data);
    }

    notifyAudioError(userId: string, data: ErrorNotification
    ) {
        this.notifyError(userId, 'audio', data);
    }

    notifyTextReady(userId:string,data:{
        jobId:string | number,
        status: StatusQueue,
        entity:TextEntity, 
        message?: string
    }){
        this.notifyReady(userId, 'text', data);
    }
    notifyTextError(userId: string, data: ErrorNotification){
        this.notifyError(userId, 'text', data);
    }
}