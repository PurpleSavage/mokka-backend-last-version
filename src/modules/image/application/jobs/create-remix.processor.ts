import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PinoLogger } from 'nestjs-pino';
import { AppBaseError } from 'src/shared/errors/base.error';
import { Job } from 'bullmq';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { CreateRemixImageUseCase } from '../use-cases/create-remix-image.use-case';
import { CreateRemixImageDto } from '../dtos/create-remix-image.dto';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import {  NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { NotificationsRepository } from 'src/shared/notifications/domain/repositories/notifications.repository';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/socket-error-response.dto';

@Processor('remix-image-queue')
export class RemixImageProcessor extends WorkerHost {
  constructor(
    private readonly createRemixImageUseCase: CreateRemixImageUseCase,
    private readonly notifierService: NotifierService,
    private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationsCommandService: NotificationsRepository,
  ) {
    super();
  }
  async process(job: Job<CreateRemixImageDto>) {
    try {
      const createRemixImageDto = job.data;
      const result = await this.createRemixImageUseCase.execute(createRemixImageDto)
      this.eventEmitter.emit('image-remix.processing.completed', {
        payload:createRemixImageDto,
        urlRemixImage: result,
        jobId: job.id,
      })
    } catch (error) {
      const createRemixImageDto = job.data;
      this.logger.error(
        {
          jobId: job.id,
          userId: createRemixImageDto.user,
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
        'Error generating remix',
      );
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string);
            const voNotification = SavedNotificationVO.create({
              user: createRemixImageDto.user,
              title: 'Image Failed',
              status: StatusQueue.FAILED,
              notificationType: JobsNotificationsType.IMAGE_REMIX,
              message: errorInfo.error,
              details: errorInfo.details,
              errorType: errorInfo.errorType,
            })
            const savedNotification = await this.notificationsCommandService.saveNotification(voNotification);
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
            throw error
    }
  }
}