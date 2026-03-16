import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { DownloadFilePort } from "src/shared/common/application/ports/downlaod-file.port";
import { StorageRepository } from "src/shared/common/domain/repositories/storage.repository";
import { InfluencerRepository } from "../../domain/repository/influencer.repository";
import { CreateInfluencerDto } from "../dtos/create-influencer.dto";
import { PathStorage } from "src/shared/common/domain/enums/path-storage";
import { SaveInfluencerVo } from "../../domain/value-objects/save-influencer.vo";
import { CreditLogicRepository } from "src/shared/common/domain/repositories/credits-logic.repository";
import { PinoLogger } from "nestjs-pino";
import { NotificationsRepository } from "src/shared/notifications/domain/repositories/notifications.repository";
import { NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { AppBaseError } from "src/shared/errors/base.error";
import { ExtractErrorInfo } from "src/shared/common/infrastructure/helpers/ExtractErrorInfo";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { SocketErrorResponseDto } from "src/shared/notifications/application/dtos/socket-error-response.dto";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { SocketReadyResponseDto } from "src/shared/notifications/application/dtos/socket-ready-response.dto";
import { InfluencerEntity } from "../../domain/entities/influecer.entity";

@Injectable()
export class SaveInfluencerFlowUseCase{
    constructor(
        private readonly storageService:StorageRepository,
        private readonly downloadService:DownloadFilePort,
        private readonly influencerCommandService:InfluencerRepository,
        private readonly creditsService: CreditLogicRepository,
        private readonly logger: PinoLogger,
        private readonly notifierService: NotifierService,
        private readonly notificationsCommandService: NotificationsRepository,
    ){}

    @OnEvent('influencer.processing.completed', { async: true })
    async execute(eventData: {
        payload: CreateInfluencerDto;
        imageUrl:string;
        jobId: string;
    }){
        const {payload,imageUrl,jobId}=eventData
        try {
            const buffer = await this.downloadService.downloadUrl(imageUrl)
            const response = await this.storageService.saveImage(buffer,payload.user,PathStorage.PATH_INFLUENCER)
            const vo =SaveInfluencerVo.create(
                {
                    user: payload.user,
                    name: payload.name,
                    ageRange: payload.ageRange,
                    gender: payload.gender,
                    bodyShape: payload.bodyShape,
                    skinColor: payload.skinColor, 
                    eyeColor: payload.eyeColor,
                    hairType: payload.hairType,
                    faceType: payload.faceType,
                    country: payload.country,
                    lipsType: payload.lipsType,
                    hairColor: payload.hairColor,
                    height: payload.height,
                    influencerUrlImage: response.url,
                    size:response.size
                }
            )
            const influencerGenerated = await this.influencerCommandService.saveInfluencerCreated(vo)
            const creditsUpdated = await this.creditsService.decreaseCredits(
                30,
                payload.user,
            )
            const voNotification = SavedNotificationVO.create({
                user: payload.user,
                title: 'Influencer generated',
                status: StatusQueue.COMPLETED,
                notificationType: JobsNotificationsType.INFLUENCER,
                message: 'Influencer generated successfully',
            });
            const savedNotification = await this.notificationsCommandService.saveNotification(voNotification);
            const socketResponse = SocketReadyResponseDto.create<InfluencerEntity>({
                jobId,
                notificationType: JobsNotificationsType.INFLUENCER,
                notification: savedNotification,
                entity: influencerGenerated,
                creditsUpdated,
            });
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
                    'Error generating influencer',
                  );
                  const errorInfo = ExtractErrorInfo.extract(error, jobId);
            
                  const voNotification = SavedNotificationVO.create({
                    user: payload.user,
                    title: 'Influencer failed',
                    status: StatusQueue.FAILED,
                    notificationType: JobsNotificationsType.INFLUENCER,
                    message: errorInfo.error,
                    details: errorInfo.details,
                    errorType: errorInfo.errorType,
                  })
                const savedNotification =await this.notificationsCommandService.saveNotification(voNotification);
            
                const socketResponse = SocketErrorResponseDto.create({
                    jobId: errorInfo.jobId,
                    notificationType: JobsNotificationsType.INFLUENCER,
                    notification: savedNotification,
                    error: errorInfo.error,
                    errorType: errorInfo.errorType,
                    statusCode: errorInfo.statusCode,
                    details: errorInfo.details,
                })
            
                this.notifierService.notifyError(socketResponse)
        }
    }
}