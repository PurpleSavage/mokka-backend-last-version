import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import { StorageRepository } from 'src/shared/common/domain/repositories/storage.repository';
import { ImageRepository } from '../../domain/repositories/image.repository';
import { CreditLogicRepository } from 'src/shared/common/domain/repositories/credits-logic.repository';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { DownloadFilePort } from 'src/shared/common/application/ports/downlaod-file.port';
import { CreateRemixImageDto } from '../dtos/request/create-remix-image.dto';
import { AppBaseError } from 'src/shared/errors/base.error';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { PathStorage } from 'src/shared/common/domain/enums/path-storage';
import { RemixImageVo } from '../../domain/value-objects/remix-image.vo';
import { RemixImageEntity } from '../../domain/entities/remix-image.entity';
import { Injectable } from '@nestjs/common';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/request/socket-error-response.dto';
import { SocketReadyResponseDto } from 'src/shared/notifications/application/dtos/request/socket-ready-response.dto';
import { SaveNotificationUseCase } from 'src/shared/notifications/application/use-cases/save-notification.use-cae';

@Injectable()
export class SaveRemixImageUseCase {
  constructor(
    private readonly storageService: StorageRepository,
    private readonly imageCommandService: ImageRepository,
    private readonly creditsService: CreditLogicRepository,
    private readonly notifierService: NotifierService,
    private readonly saveNotificationUseCase:SaveNotificationUseCase,
    private readonly downloadService: DownloadFilePort,
    private readonly logger: PinoLogger,
  ) {}

  @OnEvent('image-remix.processing.completed', { async: true })
  async execute(eventData: {
    payload: CreateRemixImageDto;
    urlRemixImage: string;
    jobId: string;
  }) {
    const { payload, urlRemixImage, jobId } = eventData

    try {
        const imagebuffer = await this.downloadService.downloadUrl(urlRemixImage)
        const imageUrlStorage = await this.storageService.saveImage(imagebuffer,payload.user,PathStorage.PATH_IMAGE_REMIXES)
        const imageSharedId =await this.imageCommandService.updateRemixes(payload.imageShared)
        const vo = RemixImageVo.create({
            user:payload.user,
            prompt: payload.prompt,
            width: payload.width,
            height: payload.height,
            imageUrl:imageUrlStorage.url,
            aspectRatio:payload.aspectRatio,
            imageBase:imageSharedId,
            size:imageUrlStorage.size,
            prevImageUrl:payload.prevImageUrl
        })
        const remixImage = await this.imageCommandService.saveRemixImage(vo)
         const creditsUpdated = await this.creditsService.decreaseCredits(
                30,
                payload.user,
        )
        const voNotification = SavedNotificationVO.create({
            user: payload.user,
            title: 'Image remix Generated',
            status: StatusQueue.COMPLETED,
            notificationType: JobsNotificationsType.IMAGE,
            message: 'Image remix generated successfully',
        })
        const savedNotification = await this.saveNotificationUseCase.execute(voNotification)
        const socketResponse = SocketReadyResponseDto.create<RemixImageEntity>({
            jobId,
            notificationType: JobsNotificationsType.AUDIO,
            notification: savedNotification,
            entity: remixImage ,
            creditsUpdated,
        })
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
        'Error generating Image',
      );
      const errorInfo = ExtractErrorInfo.extract(error, jobId);
      const voNotification = SavedNotificationVO.create({
        user: payload.user,
        title: 'Image Failed',
        status: StatusQueue.FAILED,
        notificationType: JobsNotificationsType.IMAGE_REMIX,
        message: errorInfo.error,
        details: errorInfo.details,
        errorType: errorInfo.errorType,
      });
      const savedNotification = await this.saveNotificationUseCase.execute(voNotification);
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
    }
  }
}
