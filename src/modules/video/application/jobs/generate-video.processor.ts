import { Processor, WorkerHost } from "@nestjs/bullmq";
import { GenerateVideoUseCase } from "../use-cases/generate-video.use-case";
import { Job } from "bullmq";
import { GenerateVideoDto } from "../dtos/generate-video.dto";
import { PinoLogger } from "nestjs-pino";
import { AppBaseError } from "src/shared/errors/base.error";
import { ExtractErrorInfo } from "src/shared/common/infrastructure/helpers/ExtractErrorInfo";
import {  NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { NotificationsRepository } from "src/shared/notifications/domain/repositories/notifications.repository";
import { SocketErrorResponseDto } from "src/shared/notifications/application/dtos/request/socket-error-response.dto";

@Processor('video-queue')
export class GenerateVideoProcessor extends WorkerHost{
    constructor(
        private readonly generateVideoUseCase:GenerateVideoUseCase,
        private readonly notifierService: NotifierService,
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: PinoLogger,
        private readonly notificationsCommandService: NotificationsRepository,
    ){
        super()
    }
    async process(job: Job<GenerateVideoDto>): Promise<void> {
        try {
            const generateVideoDto = job.data
            const result =await this.generateVideoUseCase.execute(generateVideoDto )
            this.eventEmitter.emit('video.processing.completed', {
                payload: generateVideoDto,
                videoUrl: result,
                jobId: job.id,
            });
        } catch (error) {
            const generateVideoDto = job.data
            this.logger.error(
            {
                jobId: job.id,
                 userId: generateVideoDto.user,
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
            )
            const errorInfo = ExtractErrorInfo.extract(error, job.id as string)
            const voNotification = SavedNotificationVO.create({
                    user: generateVideoDto.user,
                    title: 'Video Failed',
                    status: StatusQueue.FAILED,
                    notificationType: JobsNotificationsType.AUDIO,
                    message: errorInfo.error,
                    details: errorInfo.details,
                    errorType: errorInfo.errorType,
                  });
                  const savedNotification =await this.notificationsCommandService.saveNotification(voNotification);
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
            throw error
        }
    }
}