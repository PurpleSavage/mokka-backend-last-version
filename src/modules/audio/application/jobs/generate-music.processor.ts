import { Processor, WorkerHost } from "@nestjs/bullmq";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Job } from "bullmq";
import { PinoLogger } from "nestjs-pino";
import { SaveNotificationUseCase } from "src/shared/notifications/application/use-cases/save-notification.use-cae";
import { NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { GenerateMusicDto } from "../dtos/generate-music.dto";
import { AppBaseError } from "src/shared/errors/base.error";
import { GenerateMusicUseCase } from "../use-cases/generate-music.use-case";
import { ExtractErrorInfo } from "src/shared/common/infrastructure/helpers/ExtractErrorInfo";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { SocketErrorResponseDto } from "src/shared/notifications/application/dtos/request/socket-error-response.dto";

@Processor('music-queue')
export class MusicProcessor extends WorkerHost {
  constructor(
    private readonly generateMusicUseCase: GenerateMusicUseCase,
    private readonly notifierService: NotifierService,
    private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly saveNotificationUseCase:SaveNotificationUseCase
  ) {
    super();
  }
  async process(job: Job<GenerateMusicDto>) {
    try {
      const generateMusicDto = job.data;
      const result = await this.generateMusicUseCase.execute(generateMusicDto);
      this.eventEmitter.emit('music.processing.completed', {
        payload: generateMusicDto,
        audioBuffer: result,
        jobId: job.id,
      });
    } catch (error) {
      const generateMusicDto = job.data;
      this.logger.error(
        {
          jobId: job.id,
          userId: generateMusicDto.user,
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
        user: generateMusicDto.user,
        title: 'Audio Failed',
        status: StatusQueue.FAILED,
        notificationType: JobsNotificationsType.AUDIO,
        message: errorInfo.error,
        details: errorInfo.details,
        errorType: errorInfo.errorType,
      });
      const savedNotification =await this.saveNotificationUseCase.execute(voNotification);
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