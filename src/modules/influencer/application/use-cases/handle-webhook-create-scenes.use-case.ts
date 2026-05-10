import { HttpStatus, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { WebhookBodyResponseDto } from 'src/shared/common/application/dtos/responses/webhook-body.dto';
import { SaveNotificationUseCase } from 'src/shared/notifications/application/use-cases/save-notification.use-cae';
import { NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';
import { GetInfluencerSceneFromJobUseCase } from './get-influencer-scene-from-job.use-case';
import { SaveSceneFlowUseCase } from './save-scene-flow.use-case';
import { ErrorPlatformMokka } from 'src/shared/common/infrastructure/enums/error-detail-types';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { SocketErrorResponseDto } from 'src/shared/notifications/application/dtos/request/socket-error-response.dto';
import { SavedNotificationVO } from 'src/shared/notifications/domain/value-objects/saved-notification.vo';
import { StatusReplicate } from 'src/shared/common/infrastructure/enums/status-replicate';

@Injectable()
export class HandleWebhookCreateScenesUseCase {
  constructor(
    private readonly getInfluencerSceneFromJobUseCase: GetInfluencerSceneFromJobUseCase,
    private readonly saveSceneFlowUseCase: SaveSceneFlowUseCase,
    private readonly notifierService: NotifierService,
    private readonly saveNotificationUseCase: SaveNotificationUseCase,
    private readonly logger: PinoLogger,
  ) {}
  async execute(webhook: WebhookBodyResponseDto, jobId: string) {
    const job = await this.getInfluencerSceneFromJobUseCase.execute(jobId);

    if (!job) {
      this.logger.error(
        { jobId },
        'Webhook received for Scene but Job not found in Redis',
      );
      return { received: true };
    }

    const payloadDto = job.data;

    if (
      webhook.status === StatusReplicate.SUCCEEDED &&
      webhook.output?.length
    ) {
      return await this.saveSceneFlowUseCase.execute({
        payload: payloadDto,
        videoUrl: webhook.output[0],
        jobId: jobId,
      });
    }


    const errorMessage =
      webhook.error || 'The AI model failed to generate the scene';
    this.logger.warn(
      { jobId, userId: payloadDto.user, replicateError: errorMessage },
      'Scene generation failed on Replicate',
    );


    const voNotification = SavedNotificationVO.create({
      user: payloadDto.user,
      title: 'Scene generation failed',
      status:StatusReplicate.FAILED,
      notificationType: JobsNotificationsType.INFLUENCER_SCENE,
      message:
        'We could not generate your scene. Please try a different prompt.',
      details: errorMessage,
    });

    const savedNotification =
      await this.saveNotificationUseCase.execute(voNotification);

    // Notificación inmediata vía Socket
    const socketResponse = SocketErrorResponseDto.create({
      jobId: jobId,
      notificationType: JobsNotificationsType.INFLUENCER_SCENE,
      notification: savedNotification,
      error: 'Scene failed',
      errorType: ErrorPlatformMokka.MULTIMEDIA_ERROR,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      details: errorMessage,
    });

    this.notifierService.notifyError(socketResponse);

    return { received: true };
  }
}
