import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AudioRepository } from "../../domain/repositories/audio.repository";
import { CreditLogicRepository } from "src/shared/common/domain/repositories/credits-logic.repository";
import { GenerateAudioDto } from "../dtos/generate-audio.dto";
import { GenerateAudioVO } from "../../domain/value-objects/generated-audio.vo";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { ExtractErrorInfo } from "src/shared/common/infrastructure/helpers/ExtractErrorInfo";
import { StorageRepository } from "src/shared/common/domain/repositories/storage.repository";
import { JobsType, NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { NotificationsRepository } from "src/shared/notifications/domain/repositories/notifications.repository";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { ErrorSendNotification } from "src/shared/notifications/infrastructure/errors/types/error-send-notification";
import { NotificationEntity } from "src/shared/notifications/domain/entities/notification.entity";

@Injectable()
export class SaveAudioUseCase{
    constructor(
        private readonly audioCommandService:AudioRepository,
        private readonly storageService:StorageRepository,
        private readonly creditsService: CreditLogicRepository,
        private readonly  notifierService: NotifierService,
        private readonly notificationsCommandService:NotificationsRepository
    ){}

    @OnEvent('audio.processing.completed', { async: true })
    async execute(eventData: { payload: GenerateAudioDto, audioBuffer: Buffer<ArrayBuffer>, jobId: string }) {
        
        const { payload, audioBuffer, jobId } = eventData;

        try {
        
            const { url } = await this.storageService.saveAudio(payload.user, audioBuffer);

            const creditsUpdated = await this.creditsService.decreaseCredits(30, payload.user);

            const vo = GenerateAudioVO.create({
                ...payload, 
                urlAudio: url,
            })
            const audio = await this.audioCommandService.saveGeneratedAudio(vo);

            const voAudio = SavedNotificationVO.create({
                user: payload.user,
                title: 'Audio Generated',
                status: StatusQueue.COMPLETED,
                notificationType: JobsNotificationsType.AUDIO,
                message:'Audio generated succesfuly',
                
            })
            const savedNotification = await this.notificationsCommandService.saveNotification(voAudio)
            this.notifierService.notifyReady(payload.user, JobsType.AUDIO, {
                jobId: jobId,
                entity: audio,
                status: StatusQueue.COMPLETED,
                message: 'Audio generated succesfuly',
                creditsUpdate: creditsUpdated,
                notification:savedNotification
            })
        } catch (error) {
            const voAudio = SavedNotificationVO.create({
                user: payload.user,
                title: 'Audio Generated',
                status: StatusQueue.FAILED,
                notificationType: JobsNotificationsType.AUDIO,
                message:'Audio generated Succesfuly',
                
            })
            const savedNotification = await this.notificationsCommandService.saveNotification(voAudio)
            const errorInfo = ExtractErrorInfo.extract(error, jobId)
            const objeError:ErrorSendNotification<NotificationEntity> = {
                ...errorInfo,
                notification:savedNotification
            }
            this.notifierService.notifyError( payload.user,JobsType.AUDIO,objeError)
        }
    }
}