import { HttpStatus, Injectable } from "@nestjs/common";
import { WebhookBodyResponseDto } from "src/shared/common/application/dtos/responses/webhook-body.dto";
import { GetInfluencerSnapshotFromJobUseCase } from "./get-influencer-snapshot-from-job.use-case";
import { SaveSnapshotUseCase } from "./save-snapshot-flow.use-case";
import { PinoLogger } from "nestjs-pino";
import { SaveNotificationUseCase } from "src/shared/notifications/application/use-cases/save-notification.use-cae";
import { NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { StatusReplicate } from "src/shared/common/infrastructure/enums/status-replicate";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { SocketErrorResponseDto } from "src/shared/notifications/application/dtos/request/socket-error-response.dto";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";

@Injectable()
export class HandleWebhookCreateSnapshotsUseCase{
    constructor(
        private readonly getInfluencerSnapshotFromJobUseCase:GetInfluencerSnapshotFromJobUseCase,
        private readonly saveSnapshotFlowUseCase:SaveSnapshotUseCase,
        private readonly notifierService: NotifierService,
        private readonly saveNotificationUseCase:SaveNotificationUseCase,
        private readonly logger: PinoLogger,
    ){}
    async execute(webhook: WebhookBodyResponseDto, jobId: string) {
        const job = await this.getInfluencerSnapshotFromJobUseCase.execute(jobId);

        if (!job) {
        this.logger.error({ jobId }, 'Webhook received for Snapshot but Job not found in Redis');
        return { received: true };
        }

        const payloadDto = job.data;

        
        if (webhook.status === StatusReplicate.SUCCEEDED && webhook.output?.length) {
            return await this.saveSnapshotFlowUseCase.execute({
                payload: payloadDto,
                imageUrl: webhook.output[0],
                jobId: jobId,
            });
        }

  
        const errorMessage = webhook.error || 'The AI model failed to generate the snapshot';
        this.logger.warn({ jobId, userId: payloadDto.user, replicateError: errorMessage }, 'Snapshot generation failed on Replicate');

 
        const voNotification = SavedNotificationVO.create({
            user: payloadDto.user,
            title: 'Snapshot failed',
            status: StatusReplicate.FAILED,
            notificationType: JobsNotificationsType.INFLUENCER_SNAPSHOT,
            message: 'We could not generate your snapshot. Please try again.',
            details: errorMessage,
        });

        const savedNotification = await this.saveNotificationUseCase.execute(voNotification);


        const socketResponse = SocketErrorResponseDto.create({
            jobId: jobId,
            notificationType: JobsNotificationsType.INFLUENCER_SNAPSHOT,
            notification: savedNotification,
            error: 'Snapshot failed',
            errorType: ErrorPlatformMokka.MULTIMEDIA_ERROR,
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            details: errorMessage,
        });

        this.notifierService.notifyError(socketResponse);

        return { received: true };
    }
}