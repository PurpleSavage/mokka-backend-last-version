import { OnEvent } from "@nestjs/event-emitter";
import { GenerateVideoDto } from "../dtos/generate-video.dto";
import { SocketErrorResponseDto } from "src/shared/notifications/application/dtos/socket-error-response.dto";
import { PinoLogger } from "nestjs-pino";
import { NotificationsRepository } from "src/shared/notifications/domain/repositories/notifications.repository";
import { NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { AppBaseError } from "src/shared/errors/base.error";
import { DownloadFilePort } from "src/shared/common/application/ports/downlaod-file.port";
import { StorageRepository } from "src/shared/common/domain/repositories/storage.repository";
import { PathStorage } from "src/shared/common/domain/enums/path-storage";
import { GeneratedVideoVO } from "../../domain/value-objects/generated-video.vo";
import { VideoRepository } from "../../domain/repositories/video.repository";
import { CreditLogicRepository } from "src/shared/common/domain/repositories/credits-logic.repository";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { SocketReadyResponseDto } from "src/shared/notifications/application/dtos/socket-ready-response.dto";
import { VideoEntity } from "../../domain/entities/video.entity";
import { ExtractErrorInfo } from "src/shared/common/infrastructure/helpers/ExtractErrorInfo";

export class SaveVideoUseCase{
    constructor(
        private readonly notifierService: NotifierService,
        private readonly notificationsCommandService: NotificationsRepository,
        private readonly logger: PinoLogger,
        private readonly downloadService:DownloadFilePort,
        private readonly storageService:StorageRepository,
        private readonly videoCommandService:VideoRepository,
        private readonly creditsService: CreditLogicRepository,
    ){}

    @OnEvent('video.processing.completed', { async: true })
    async execute(eventData: {
        payload: GenerateVideoDto;
        videoUrl: string;
        jobId: string;
    }){
         const { payload, videoUrl, jobId } = eventData;
        try {
            const buffer = await this.downloadService.downloadUrl(videoUrl)
            const urlStorage = await this.storageService.saveVideo(payload.user,buffer,PathStorage.PATH_VIDEOS)
            const vo = GeneratedVideoVO.create({
                user: payload.user,
                prompt: payload.prompt,
                videoUrl:urlStorage.url,
                aspectRatio:payload.aspectRatio,
                audio:payload.audio,
            })
            const video =await this.videoCommandService.saveGeneratedVideo(vo)
            const creditsUpdated = await this.creditsService.decreaseCredits(
                30,
                payload.user,
            )
            const voNotification = SavedNotificationVO.create({
                user: payload.user,
                title: 'Video Generated',
                status: StatusQueue.COMPLETED,
                notificationType: JobsNotificationsType.VIDEO,
                message: 'Video generated successfully',
            });
            const savedNotification = await this.notificationsCommandService.saveNotification(voNotification);
            const socketResponse = SocketReadyResponseDto.create<VideoEntity>({
                jobId,
                notificationType: JobsNotificationsType.AUDIO,
                notification: savedNotification,
                entity: video,
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
                    'Error generating video',
                  );
                  const errorInfo = ExtractErrorInfo.extract(error, jobId);
            
                  const voNotification = SavedNotificationVO.create({
                    user: payload.user,
                    title: 'Video failed',
                    status: StatusQueue.FAILED,
                    notificationType: JobsNotificationsType.VIDEO,
                    message: errorInfo.error,
                    details: errorInfo.details,
                    errorType: errorInfo.errorType,
                  })
                  const savedNotification =await this.notificationsCommandService.saveNotification(voNotification);
            
                  const socketResponse = SocketErrorResponseDto.create({
                    jobId: errorInfo.jobId,
                    notificationType: JobsNotificationsType.AUDIO,
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