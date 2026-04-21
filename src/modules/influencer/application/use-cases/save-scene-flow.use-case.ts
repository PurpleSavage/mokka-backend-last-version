import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DownloadFilePort } from 'src/shared/common/application/ports/downlaod-file.port';
import { StorageRepository } from 'src/shared/common/domain/repositories/storage.repository';
import { InfluencerRepository } from '../../domain/repository/influencer.repository';
import { CreditLogicRepository } from 'src/shared/common/domain/repositories/credits-logic.repository';
import { PinoLogger } from 'nestjs-pino';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { AppBaseError } from 'src/shared/errors/base.error';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { CreateInfluencerSceneDto } from '../dtos/responses/create-influencer-scene.dto';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { PathStorage } from 'src/shared/common/domain/enums/path-storage';
import { SaveSceneInfluencerVo } from '../../domain/value-objects/save-scene.vo';
import { InfluencerSceneEntity } from '../../domain/entities/influencer-scene.entity';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/request/socket-error-response.dto';
import { SocketReadyResponseDto } from 'src/shared/notifications/application/dtos/request/socket-ready-response.dto';
import { SaveNotificationUseCase } from 'src/shared/notifications/application/use-cases/save-notification.use-cae';

@Injectable()
export class SaveSceneFlowUseCase {
  constructor(
    private readonly storageService: StorageRepository,
    private readonly downloadService: DownloadFilePort,
    private readonly influencerCommandService: InfluencerRepository,
    private readonly creditsService: CreditLogicRepository,
    private readonly logger: PinoLogger,
    private readonly notifierService: NotifierService,
    private readonly saveNotificationUseCase:SaveNotificationUseCase,
  ) {}
  @OnEvent('scene.processing.completed', { async: true })
  async execute(eventData: {
          payload: CreateInfluencerSceneDto;
          videoUrl:string;
          jobId: string;
    }) {
    const {payload,videoUrl,jobId}=eventData
    try {
        const buffer = await this.downloadService.downloadUrl(videoUrl)
        const storageresponse = await this.storageService.saveVideo(payload.user,buffer,PathStorage.PATH_INFLUENCERS_SCENES)
        const vo = SaveSceneInfluencerVo.create({
            urlScene:storageresponse.url,
            prompt:payload.prompt,
            influencer:payload.influencer,
            volume:payload.volume,
            user:payload.user,
            imageBaseUrls:payload.imageBaseUrls,
            aspectRatio:payload.aspectRatio
        })
        const scene = await this.influencerCommandService.saveSceneInfluencer(vo)
        const creditsUpdated = await this.creditsService.decreaseCredits(
            30,
            payload.user,
        )
        const voNotification = SavedNotificationVO.create({
            user: payload.user,
            title: 'Scene generated',
            status: StatusQueue.COMPLETED,
            notificationType: JobsNotificationsType.INFLUENCER_SCENE,
            message: 'Influencer scene generated successfully',
        })
        const savedNotification = await this.saveNotificationUseCase.execute(voNotification);
        const socketResponse = SocketReadyResponseDto.create<InfluencerSceneEntity>({
            jobId,
            notificationType: JobsNotificationsType.INFLUENCER_SCENE,
            notification: savedNotification,
            entity: scene,
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
        'Error generating influencer scene',
      );
      const errorInfo = ExtractErrorInfo.extract(error, jobId);

      const voNotification = SavedNotificationVO.create({
        user: payload.user,
        title: 'Influencer scene failed',
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
    }
  }
}
