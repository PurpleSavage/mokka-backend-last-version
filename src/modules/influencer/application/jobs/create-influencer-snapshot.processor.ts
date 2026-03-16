import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PinoLogger } from 'nestjs-pino';
import { CreateInfluencerSnapshotUseCase } from '../use-cases/create-influencer-snapshot.use-case';
import { Job } from 'bullmq';
import { CreateInfluencerSnapshotDto } from '../dtos/create-influencer-snapshot.dto';
import { AppBaseError } from 'src/shared/errors/base.error';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/socket-error-response.dto';
import { NotificationsRepository } from 'src/shared/notifications/domain/repositories/notifications.repository';
@Processor('influencer-snapshot-queue')
export class CreateInfluencerSnapshotProcessor extends WorkerHost {
  constructor(
    private readonly createInfluencerSnapshotUseCase: CreateInfluencerSnapshotUseCase,
    private readonly notifierService: NotifierService,
    private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationsCommandService: NotificationsRepository,
  ) {
    super();
  }
  async process(job: Job<CreateInfluencerSnapshotDto>): Promise<void> {
    try {
      const createInfluencerSnapshotDto = job.data;
      const result = await this.createInfluencerSnapshotUseCase.execute(
        createInfluencerSnapshotDto,
      );
      this.eventEmitter.emit('snapshot.processing.completed', {
        payload: createInfluencerSnapshotDto,
        imageUrl: result,
        jobId: job.id,
      });
    } catch (error) {
      const createinfluencerDto = job.data;
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
        'Error generating infleuncer snapshot',
      );
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string);
      const voNotification = SavedNotificationVO.create({
        user: createinfluencerDto.user,
        title: 'Influencer scene Failed',
        status: StatusQueue.FAILED,
        notificationType: JobsNotificationsType.INFLUENCER_SNAPSHOT,
        message: errorInfo.error,
        details: errorInfo.details,
        errorType: errorInfo.errorType,
      });
      const savedNotification =await this.notificationsCommandService.saveNotification(voNotification);
      const socketResponse = SocketErrorResponseDto.create({
        jobId: errorInfo.jobId,
        notificationType: JobsNotificationsType.INFLUENCER_SNAPSHOT,
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
