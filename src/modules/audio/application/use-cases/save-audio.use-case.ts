import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AudioRepository } from '../../domain/repositories/audio.repository';
import { CreditLogicRepository } from 'src/shared/common/domain/repositories/credits-logic.repository';
import { GenerateAudioDto } from '../dtos/generate-audio.dto';
import { GenerateAudioVO } from '../../domain/value-objects/generated-audio.vo';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { StorageRepository } from 'src/shared/common/domain/repositories/storage.repository';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { NotificationsRepository } from 'src/shared/notifications/domain/repositories/notifications.repository';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { AudioEntity } from '../../domain/entities/audio.entity';

import { PinoLogger } from 'nestjs-pino';
import { AppBaseError } from 'src/shared/errors/base.error';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/request/socket-error-response.dto';
import { SocketReadyResponseDto } from 'src/shared/notifications/application/dtos/request/socket-ready-response.dto';

@Injectable()
export class SaveAudioUseCase {
  constructor(
    private readonly audioCommandService: AudioRepository,
    private readonly storageService: StorageRepository,
    private readonly creditsService: CreditLogicRepository,
    private readonly notifierService: NotifierService,
    private readonly notificationsCommandService: NotificationsRepository,
    private readonly logger: PinoLogger,
  ) {}

  @OnEvent('audio.processing.completed', { async: true })
  async execute(eventData: {
    payload: GenerateAudioDto;
    audioBuffer: Buffer<ArrayBuffer>;
    jobId: string;
  }) {
    const { payload, audioBuffer, jobId } = eventData;

    try {
      const { url } = await this.storageService.saveAudio(
        payload.user,
        audioBuffer,
      );

      const creditsUpdated = await this.creditsService.decreaseCredits(
        30,
        payload.user,
      );

      const vo = GenerateAudioVO.create({
        ...payload,
        urlAudio: url,
      });
      const audio = await this.audioCommandService.saveGeneratedAudio(vo);

      const voNotification = SavedNotificationVO.create({
        user: payload.user,
        title: 'Audio generated',
        status: StatusQueue.COMPLETED,
        notificationType: JobsNotificationsType.AUDIO,
        message: 'Audio generated successfully',
      });
      const savedNotification = await this.notificationsCommandService.saveNotification(voNotification);
      const socketResponse = SocketReadyResponseDto.create<AudioEntity>({
        jobId,
        notificationType: JobsNotificationsType.AUDIO,
        notification: savedNotification,
        entity: audio,
        creditsUpdated,
      });
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
        'Error generating audio',
      );
      const errorInfo = ExtractErrorInfo.extract(error, jobId);

      const voNotification = SavedNotificationVO.create({
        user: payload.user,
        title: 'Audio failed',
        status: StatusQueue.FAILED,
        notificationType: JobsNotificationsType.AUDIO,
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
