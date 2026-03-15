import { Processor, WorkerHost } from '@nestjs/bullmq';
import { GenerateAudioUseCase } from '../use-cases/generate-audio.use-case';
import { GenerateAudioDto } from '../dtos/generate-audio.dto';
import { Job } from 'bullmq';
import { AppBaseError } from 'src/shared/errors/base.error';
import { PinoLogger } from 'nestjs-pino';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { NotificationsRepository } from 'src/shared/notifications/domain/repositories/notifications.repository';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/socket-error-response.dto';

@Processor('audio-queue')
export class AudioProcessor extends WorkerHost {
  constructor(
    private readonly generateAudioUseCase: GenerateAudioUseCase,
    private readonly notifierService: NotifierService,
    private readonly notificationsCommandService: NotificationsRepository,
    private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }
  async process(job: Job<GenerateAudioDto>) {
    try {
      const generateAudioDto = job.data;
      const result = await this.generateAudioUseCase.execute(generateAudioDto);
      this.eventEmitter.emit('video.processing.completed', {
        payload: generateAudioDto,
        audioBuffer: result,
        jobId: job.id,
      });
    } catch (error) {
      const generateAudioDto = job.data;
      this.logger.error(
        {
          jobId: job.id,
          userId: generateAudioDto.user,
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
        user: generateAudioDto.user,
        title: 'Audio Failed',
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
      throw error;
    }
  }
}
