import { Processor, WorkerHost } from '@nestjs/bullmq';
import { GenerateImageUseCase } from '../use-cases/generate-image.use-case';
import { GenerateImageDto } from '../dtos/generate-image.dto';
import { PinoLogger } from 'nestjs-pino';
import { AppBaseError } from 'src/shared/errors/base.error';
import { Job } from 'bullmq';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { NotificationsRepository } from 'src/shared/notifications/domain/repositories/notifications.repository';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/socket-error-response.dto';

@Processor('image-queue')
export class ImageProcessor extends WorkerHost {
  constructor(
    private readonly generateImageUseCase: GenerateImageUseCase,
    private readonly notifierService: NotifierService,
    private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationsCommandService: NotificationsRepository,
  ) {
    super();
  }
  async process(job: Job<GenerateImageDto>): Promise<void> {
    try {
      const generateImageDto = job.data;
      const result = await this.generateImageUseCase.execute(generateImageDto);

      this.eventEmitter.emit('image.processing.completed', {
        payload: generateImageDto,
        imageUr: result,
        jobId: job.id,
      });
    } catch (error) {
      const generateImageDto = job.data;
      this.logger.error(
        {
          jobId: job.id,
          userId: generateImageDto.user,
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
        'Error generating audio',
      );
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string);
      const voNotification = SavedNotificationVO.create({
        user: generateImageDto.user,
        title: 'Image Failed',
        status: StatusQueue.FAILED,
        notificationType: JobsNotificationsType.IMAGE,
        message: errorInfo.error,
        details: errorInfo.details,
        errorType: errorInfo.errorType,
      });
      const savedNotification = await this.notificationsCommandService.saveNotification(voNotification);
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
      throw error;
    }
  }
}
