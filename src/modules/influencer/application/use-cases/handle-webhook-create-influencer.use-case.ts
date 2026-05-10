import { HttpStatus, Injectable } from "@nestjs/common";
import { WebhookBodyResponseDto } from "src/shared/common/application/dtos/responses/webhook-body.dto";
import { GetInfluencerFromJobUseCase } from "./get-influncer-from-job.use-case";
import { SaveInfluencerFlowUseCase } from "./save-influencer-flow.use-case";
import { StatusReplicate } from "src/shared/common/infrastructure/enums/status-replicate";
import { PinoLogger } from "nestjs-pino";
import { SaveNotificationUseCase } from "src/shared/notifications/application/use-cases/save-notification.use-cae";
import { NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { SocketErrorResponseDto } from "src/shared/notifications/application/dtos/request/socket-error-response.dto";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";

@Injectable()
export class HandleWebhookCreateInfluencerUseCase{
    constructor(
        private readonly getInfluencerFromJobUseCase:GetInfluencerFromJobUseCase,
        private readonly saveInfluencerFlowUseCase: SaveInfluencerFlowUseCase,
        private readonly notifierService: NotifierService,
        private readonly saveNotificationUseCase:SaveNotificationUseCase,
        private readonly logger: PinoLogger,
    ){}
    async execute(webhook:WebhookBodyResponseDto,jobId:string){
        const job = await this.getInfluencerFromJobUseCase.execute(jobId)
        
        if (!job) {
            this.logger.error(`Job ${jobId} not found in queue`);
            return { received: true }; 
        }
        const payloadDto = job.data;

        if(webhook.status === StatusReplicate.SUCCEEDED && webhook.output){
            return await this.saveInfluencerFlowUseCase.execute({
                payload: payloadDto,
                imageUrl:webhook.output[0],
                jobId: jobId,
            })
        
        }
        const rawError = webhook.error || 'The AI model was unable to generate the image';
        const friendlyError = rawError.length > 200 ? 'Internal AI Engine error during generation' : rawError;
        const voNotification = SavedNotificationVO.create({
            user: payloadDto.user,
            title: 'Influencer failed',
            status: StatusReplicate.FAILED,
            notificationType: JobsNotificationsType.INFLUENCER,
            message:friendlyError,
        })
        const savedNotification =await this.saveNotificationUseCase.execute(voNotification);
        const socketResponse = SocketErrorResponseDto.create({
            jobId: jobId,
            notificationType: JobsNotificationsType.INFLUENCER,
            notification: savedNotification,
            error: 'Influencer failed',
            errorType:ErrorPlatformMokka.MULTIMEDIA_ERROR,
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            details:friendlyError,
        })
        this.notifierService.notifyError(socketResponse)
        return { received: true };
    }
}