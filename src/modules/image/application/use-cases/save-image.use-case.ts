import { StorageRepository } from "src/shared/common/domain/repositories/storage.repository";
import { ImageRepository } from "../../domain/repositories/image.repository";
import { CreditLogicRepository } from "src/shared/common/domain/repositories/credits-logic.repository";
import { NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { NotificationsRepository } from "src/shared/notifications/domain/repositories/notifications.repository";
import { DownloadFilePort } from "src/shared/common/application/ports/downlaod-file.port";
import { OnEvent } from "@nestjs/event-emitter";

import { PathStorage } from "src/shared/common/domain/enums/path-storage";
import { SavedGenerateImageVO } from "../../domain/value-objects/saved-generate-image.vo";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { ImageEntity } from "../../domain/entities/image.entity";
import { PinoLogger } from "nestjs-pino";
import { AppBaseError } from "src/shared/errors/base.error";
import { ExtractErrorInfo } from "src/shared/common/infrastructure/helpers/ExtractErrorInfo";
import { Injectable } from "@nestjs/common";
import { GenerateImageDto } from "../dtos/request/generate-image.dto";
import { SocketErrorResponseDto } from "src/shared/notifications/application/dtos/request/socket-error-response.dto";
import { SocketReadyResponseDto } from "src/shared/notifications/application/dtos/request/socket-ready-response.dto";

@Injectable()
export class SaveImageUseCase{
    constructor(
        private readonly storageService:StorageRepository,
        private readonly imageCommandService:ImageRepository,
        private readonly creditsService: CreditLogicRepository,
        private readonly notifierService: NotifierService,
        private readonly notificationsCommandService: NotificationsRepository,
        private readonly downloadService:DownloadFilePort,
        private readonly logger: PinoLogger,
    ){}
    @OnEvent('image.processing.completed', { async: true })
    async execute(eventData: {
        payload: GenerateImageDto;
        imageUrl: string;
        jobId: string;
    }){
        const { payload, imageUrl, jobId } = eventData;
        try {
            
           const buffer = await this.downloadService.downloadUrl(imageUrl)
            const storageResponse = await this.storageService.saveImage(buffer,payload.user,PathStorage.PATH_IMAGE)
            const imageGenerated = SavedGenerateImageVO.create({
                user:  eventData.payload.user,
                prompt: eventData.payload.prompt,
                width:  eventData.payload.width,
                height:  eventData.payload.height,
                aspectRatio:  eventData.payload.aspectRatio,
                imageUrl: storageResponse.url,
                size: storageResponse.size,
                style:  eventData.payload.style,
                subStyle:  eventData.payload.subStyle,
            })
            const image =  await this.imageCommandService.savedGeneratedImage(imageGenerated) 
            const creditsUpdated = await this.creditsService.decreaseCredits(
                30,
                payload.user,
            )
            const voNotification = SavedNotificationVO.create({
                user: payload.user,
                title: 'Image Generated',
                status: StatusQueue.COMPLETED,
                notificationType: JobsNotificationsType.IMAGE,
                message: 'Image generated successfully',
            })
            const savedNotification = await this.notificationsCommandService.saveNotification(voNotification)
            const socketResponse = SocketReadyResponseDto.create<ImageEntity>({
                jobId,
                notificationType: JobsNotificationsType.AUDIO,
                notification: savedNotification,
                entity: image,
                creditsUpdated,
            })
            this.notifierService.notifyReady(socketResponse);
        } catch (error) {
            this.logger.error(
                   {
                     jobId: jobId,
                     userId: payload.user,
                     errorType:
                       error instanceof AppBaseError ? error.errorType : 'UNKNOWN_ERROR',
                     errorMessage:
                       error instanceof Error ? error.message : 'Unknown error',
                     errorDetails:
                       error instanceof AppBaseError ? error.details : undefined,
                     httpStatus:
                       error instanceof AppBaseError ? error.getStatus() : undefined,
                     stack: error instanceof Error ? error.stack : undefined,
                   },
                   'Error generating Image',
            )
            const errorInfo = ExtractErrorInfo.extract(error, jobId)
            const voNotification = SavedNotificationVO.create({
                user: payload.user,
                title: 'Image Failed',
                status: StatusQueue.FAILED,
                notificationType: JobsNotificationsType.IMAGE,
                message: errorInfo.error,
                details: errorInfo.details,
                errorType: errorInfo.errorType,
            })
            const savedNotification =await this.notificationsCommandService.saveNotification(voNotification)
            const socketResponse = SocketErrorResponseDto.create({
                jobId: errorInfo.jobId,
                notificationType: JobsNotificationsType.AUDIO,
                notification: savedNotification,
                error: errorInfo.error,
                errorType: errorInfo.errorType,
                statusCode: errorInfo.statusCode,
                details: errorInfo.details,
            });
            
            this.notifierService.notifyError(socketResponse);
        }
    }   
}