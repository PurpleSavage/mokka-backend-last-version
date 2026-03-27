import { OnEvent } from '@nestjs/event-emitter';
import { GenerateTextDto } from '../dtos/request/generate-text.dto';
import { PinoLogger } from 'nestjs-pino';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { AppBaseError } from 'src/shared/errors/base.error';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { GenerateTextVO } from '../../domain/value-objects/generate-text.vo';
import { TextRepository } from '../../domain/repositories/text.repository';
import { CreditLogicRepository } from 'src/shared/common/domain/repositories/credits-logic.repository';
import { TextEntity } from '../../domain/entities/text.entity';
import { Injectable } from '@nestjs/common';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/request/socket-error-response.dto';
import { SocketReadyResponseDto } from 'src/shared/notifications/application/dtos/request/socket-ready-response.dto';
import { SaveNotificationUseCase } from 'src/shared/notifications/application/use-cases/save-notification.use-cae';

@Injectable()
export class SaveTextUseCase {
  constructor(
    private readonly notifierService: NotifierService,
    private readonly textCommandService:TextRepository,
    private readonly logger: PinoLogger,
    private readonly creditsService: CreditLogicRepository,
    private readonly saveNotificationUseCase:SaveNotificationUseCase,
  ) {}

  @OnEvent('text.processing.completed', { async: true })
  async execute(eventData: {
    payload: GenerateTextDto;
    text: string;
    jobId: string;
  }) {
    const { payload, jobId,text} = eventData;
    try {
        const vo = GenerateTextVO.create({
            user:payload.user,
            context:payload.context,
            promotionType: payload.promotionType,
            title: payload.title,
            toneType: payload.toneType,
            textLength: payload.textLength,
            textFormat: payload.textFormat,
            improvedContext:text
        })
        const savedText =await this.textCommandService.saveText(vo)
        const creditsUpdated = await this.creditsService.decreaseCredits(
            30,
            payload.user,
        )
        const voNotification = SavedNotificationVO.create({
            user: payload.user,
            title: 'Text Generated',
            status: StatusQueue.COMPLETED,
            notificationType: JobsNotificationsType.TEXT,
            message: 'Text generated successfully',
        })
        const savedNotification = await this.saveNotificationUseCase.execute(voNotification)
        const socketResponse = SocketReadyResponseDto.create<TextEntity>({
            jobId,
            notificationType: JobsNotificationsType.AUDIO,
            notification: savedNotification,
            entity: savedText,
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
        'Error generating text',
      );
      const errorInfo = ExtractErrorInfo.extract(error, jobId);

      const voNotification = SavedNotificationVO.create({
        user: payload.user,
        title: 'Text failed',
        status: StatusQueue.FAILED,
        notificationType: JobsNotificationsType.TEXT,
        message: errorInfo.error,
        details: errorInfo.details,
        errorType: errorInfo.errorType,
      });
      const savedNotification =
        await this.saveNotificationUseCase.execute(voNotification);

      const socketResponse = SocketErrorResponseDto.create({
        jobId: errorInfo.jobId,
        notificationType: JobsNotificationsType.TEXT,
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
