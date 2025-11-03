// shared/infrastructure/websockets/notification.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { NotifierGateway } from "./notifier.gateway";


@Injectable()
export class NotifierService implements OnModuleInit {
    constructor(private readonly gateway: NotifierGateway) {}

    onModuleInit() {
        console.log('NotificationService initialized');
    }

    // Métodos genéricos
    notifyReady<T>(
        userId: string, 
        type: 'image' | 'video' | 'audio',
        data: {
            jobId: string | number;
            entity: T;
            status: string;
            message?: string;
        }
    ) {
        this.gateway.emitToUser(userId, `${type}-ready`, data);
    }

    notifyError(
        userId: string,
        type: 'image' | 'video' | 'audio',
        data: {
            jobId: string | number;
            error: string;
            status: string;
        }
    ) {
        this.gateway.emitToUser(userId, `${type}-error`, data);
    }

    // Métodos específicos para cada tipo (opcional, para mejor tipado)
    notifyImageReady(userId: string, data: { jobId: string | number; entity: any; status: string; message?: string }) {
        this.notifyReady(userId, 'image', data);
    }

    notifyImageError(userId: string, data: { jobId: string | number; error: string; status: string }) {
        this.notifyError(userId, 'image', data);
    }

    notifyVideoReady(userId: string, data: { jobId: string | number; entity: any; status: string; message?: string }) {
        this.notifyReady(userId, 'video', data);
    }

    notifyVideoError(userId: string, data: { jobId: string | number; error: string; status: string }) {
        this.notifyError(userId, 'video', data);
    }

    notifyAudioReady(userId: string, data: { jobId: string | number; entity: any; status: string; message?: string }) {
        this.notifyReady(userId, 'audio', data);
    }

    notifyAudioError(userId: string, data: { jobId: string | number; error: string; status: string }) {
        this.notifyError(userId, 'audio', data);
    }
}