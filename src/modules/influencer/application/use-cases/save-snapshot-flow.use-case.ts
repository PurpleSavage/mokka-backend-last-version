import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DownloadFilePort } from 'src/shared/common/application/ports/downlaod-file.port';
import { StorageRepository } from 'src/shared/common/domain/repositories/storage.repository';
import { InfluencerRepository } from '../../domain/repository/influencer.repository';
import { CreditLogicRepository } from 'src/shared/common/domain/repositories/credits-logic.repository';
import { PinoLogger } from 'nestjs-pino';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { NotificationsRepository } from 'src/shared/notifications/domain/repositories/notifications.repository';
import { CreateInfluencerSnapshotDto } from '../dtos/create-influencer-snapshot.dto';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { AppBaseError } from 'src/shared/errors/base.error';
import { SaveSnapshotVo } from '../../domain/value-objects/save-snapshot.vo';
import { PathStorage } from 'src/shared/common/domain/enums/path-storage';
import { InfluencerSnapshotEntity } from '../../domain/entities/influencer-snapshot.entity';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/request/socket-error-response.dto';
import { SocketReadyResponseDto } from 'src/shared/notifications/application/dtos/request/socket-ready-response.dto';

@Injectable()
export class SaveSnapshotUseCase {
  constructor(
    private readonly storageService: StorageRepository,
    private readonly downloadService: DownloadFilePort,
    private readonly influencerCommandService: InfluencerRepository,
    private readonly creditsService: CreditLogicRepository,
    private readonly logger: PinoLogger,
    private readonly notifierService: NotifierService,
    private readonly notificationsCommandService: NotificationsRepository,
  ) {}
  @OnEvent('snapshot.processing.completed', { async: true })
  async execute(eventData: {
    payload: CreateInfluencerSnapshotDto;
    imageUrl: string;
    jobId: string;
  }) {
    const { payload, jobId, imageUrl } = eventData;
    try {
        const buffer = await this.downloadService.downloadUrl(imageUrl)
        const responseStorage= await this.storageService.saveImage(buffer,payload.user,PathStorage.PATH_INFLUENCERS_SNPASHOTS)
        const vo = SaveSnapshotVo.create({
            user:payload.user,
            influencer:payload.influencer,
            snapshotUrl:responseStorage.url,
            prompt:payload.prompt,
            enviroment:payload.enviroment,
            outfitStyle:payload.outfitStyle,
            aspectRatio:payload.aspectRatio
        })
        const snapshot =  await this.influencerCommandService.saveSnapshotInfluencer(vo)
        const creditsUpdated = await this.creditsService.decreaseCredits(
            30,
            payload.user,
        )
        const voNotification = SavedNotificationVO.create({
                 user: payload.user,
                title: 'Scene generated',
                status: StatusQueue.COMPLETED,
                notificationType: JobsNotificationsType.INFLUENCER_SNAPSHOT,
                message: 'Influencer snapshot generated successfully',
        })
        const savedNotification = await this.notificationsCommandService.saveNotification(voNotification);
        const socketResponse = SocketReadyResponseDto.create<InfluencerSnapshotEntity>({
            jobId,
            notificationType: JobsNotificationsType.INFLUENCER_SNAPSHOT,
            notification: savedNotification,
            entity: snapshot,
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
        'Error generating influencer snapshot',
      );
      const errorInfo = ExtractErrorInfo.extract(error, jobId);

      const voNotification = SavedNotificationVO.create({
        user: payload.user,
        title: 'Influencer snapshot failed',
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
    }
  }
}
