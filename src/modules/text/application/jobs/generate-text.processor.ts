import { Processor, WorkerHost } from "@nestjs/bullmq";
import { GenerateTextUseCase } from "../use-cases/generate-text.use-case";
import { PinoLogger } from "nestjs-pino";
import { AppBaseError } from "src/shared/errors/base.error";
import { GenerateTextDto } from "../dtos/request/generate-text.dto";
import { Job } from "bullmq";
import { ExtractErrorInfo } from "src/shared/common/infrastructure/helpers/ExtractErrorInfo";
import { NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { NotificationsRepository } from "src/shared/notifications/domain/repositories/notifications.repository";
import { SocketErrorResponseDto } from "src/shared/notifications/application/dtos/request/socket-error-response.dto";



@Processor('text-queue')
export class GenerateTextProcessor extends WorkerHost{
    constructor(
      private readonly generateTextUseCase:GenerateTextUseCase,
      private readonly notifierService: NotifierService,
      private readonly logger: PinoLogger,
      private readonly eventEmitter: EventEmitter2,
      private readonly notificationsCommandService: NotificationsRepository,
    ){
        super()
    }
    async process(job: Job<GenerateTextDto>) {
      const generateTextDto = job.data;
        try {
          const result = await this.generateTextUseCase.execute(generateTextDto)
          this.eventEmitter.emit('text.processing.completed', {
            payload: generateTextDto,
            text: result.text,
            jobId: job.id,
          })
        } catch (error) {
          const textDto = job.data;
          this.logger.error(
            {
              jobId: job.id,
              userId: textDto.user,
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
            'Error generating text',
          );
          const errorInfo = ExtractErrorInfo.extract(error, job.id as string)
          const voNotification = SavedNotificationVO.create({
            user: generateTextDto.user,
            title: 'Text Failed',
            status: StatusQueue.FAILED,
            notificationType: JobsNotificationsType.TEXT,
            message: errorInfo.error,
            details: errorInfo.details,
            errorType: errorInfo.errorType,
          });
          const savedNotification =await this.notificationsCommandService.saveNotification(voNotification);
          const socketResponse = SocketErrorResponseDto.create({
            jobId: errorInfo.jobId,
            notificationType: JobsNotificationsType.TEXT,
            notification: savedNotification,
            error: errorInfo.error,
            errorType: errorInfo.errorType,
            statusCode: errorInfo.statusCode,
            details: errorInfo.details,
          });
          this.notifierService.notifyError(socketResponse);
          throw error;
        }
    }
}