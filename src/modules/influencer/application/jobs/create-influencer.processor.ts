import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { CreateInfluencerUseCase } from '../use-cases/create-influencer.use-case';
import { AppBaseError } from 'src/shared/errors/base.error';
import { CreateInfluencerDto } from '../dtos/create-influencer.dto';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { NotificationsRepository } from 'src/shared/notifications/domain/repositories/notifications.repository';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/socket-error-response.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('influencer-queue')
export class CreateInfluencerProcessor extends WorkerHost {
  constructor(
    private readonly createInfluencerUseCase: CreateInfluencerUseCase,
    private readonly notifierService: NotifierService,
    private readonly logger: PinoLogger,
    private readonly notificationsCommandService: NotificationsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }
  async process(job: Job<CreateInfluencerDto>): Promise<void> {
    try {
      const createInfluencerDto = job.data
      const result = await this.createInfluencerUseCase.execute(createInfluencerDto)
      this.eventEmitter.emit('influencer.processing.completed', {
        payload: createInfluencerDto,
        audioBuffer: result,
        jobId: job.id,
      }); 
    } catch (error) {
      const createinfluencerDto = job.data
      this.logger.error(
        {
          jobId: job.id,
          userId: createinfluencerDto.user,
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
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string);
      const voNotification = SavedNotificationVO.create({
        user: createinfluencerDto.user,
        title: 'Influencer failed',
        status: StatusQueue.FAILED,
        notificationType: JobsNotificationsType.INFLUENCER,
        message: errorInfo.error,
        details: errorInfo.details,
        errorType: errorInfo.errorType,
      });
      const savedNotification =await this.notificationsCommandService.saveNotification(voNotification);
      const socketResponse = SocketErrorResponseDto.create({
        jobId: errorInfo.jobId,
        notificationType: JobsNotificationsType.INFLUENCER,
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
