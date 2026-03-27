import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PinoLogger } from 'nestjs-pino';
import { CreateInFluencerSceneUseCase } from '../use-cases/create-influencer-scene.use-case';
import { Job } from 'bullmq';
import { CreateInfluencerSceneDto } from '../dtos/create-influencer-scene.dto';
import { AppBaseError } from 'src/shared/errors/base.error';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import {  NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/request/socket-error-response.dto';
import { SaveNotificationUseCase } from 'src/shared/notifications/application/use-cases/save-notification.use-cae';


@Processor('influencer-scene-queue')
export class CreateInfluencerSceneProcessor extends WorkerHost {
  constructor(
    private readonly createInfluencerSceneUseCase: CreateInFluencerSceneUseCase,
    private readonly notifierService: NotifierService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: PinoLogger,
    private readonly saveNotificationUseCase:SaveNotificationUseCase,
  ) {
    super();
  }
  async process(job: Job<CreateInfluencerSceneDto>): Promise<void> {
    try {
      const createInfluencerSceneDto = job.data;
      const result = await this.createInfluencerSceneUseCase.execute(
        createInfluencerSceneDto,
      )
      this.eventEmitter.emit('scene.processing.completed', {
        payload: createInfluencerSceneDto,
        videoUrl: result,
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
        'Error generating infleuncer scene',
      )
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string)

      const voNotification = SavedNotificationVO.create({
              user: createinfluencerDto.user,
              title: 'Influencer scene Failed',
              status: StatusQueue.FAILED,
              notificationType: JobsNotificationsType.INFLUENCER_SCENE,
              message: errorInfo.error,
              details: errorInfo.details,
              errorType: errorInfo.errorType,
            });
            const savedNotification =await this.saveNotificationUseCase.execute(voNotification);
            const socketResponse = SocketErrorResponseDto.create({
              jobId: errorInfo.jobId,
              notificationType: JobsNotificationsType.INFLUENCER_SCENE,
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
