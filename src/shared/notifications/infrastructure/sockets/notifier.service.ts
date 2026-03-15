// shared/infrastructure/websockets/notification.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { NotifierGateway } from "../../../../shared/notifications/infrastructure/sockets/notifier.gateway";
import { SocketReadyResponseDto } from "../../application/dtos/socket-ready-response.dto";
import { SocketErrorResponseDto } from "../../application/dtos/socket-error-response.dto";
@Injectable()
export class NotifierService implements OnModuleInit {
    constructor(private readonly gateway: NotifierGateway) {}

    onModuleInit() {
        console.log('NotificationService initialized');
    }

    // Métodos genéricos
    notifyReady<T>(data: SocketReadyResponseDto<T>) {
    this.gateway.emitToUser(
        data.getNotification().user, 
        `${data.getNotificationType()}-ready`, 
        {
            jobId: data.getJobId(),
            notificationType: data.getNotificationType(),
            notification: data.getNotification(),
            entity: data.getEntity(),
            creditsUpdated: data.getCreditsUpdated()
        }
    );
}

    notifyError(data: SocketErrorResponseDto) {
    this.gateway.emitToUser(
        data.getNotification().user,
        `${data.getNotificationType()}-error`,
        {
            jobId: data.getJobId(),
            notificationType: data.getNotificationType(),
            notification: data.getNotification(),
            error: data.getError(),
            errorType: data.getErrorType()
        }
    );
}

   
    
}