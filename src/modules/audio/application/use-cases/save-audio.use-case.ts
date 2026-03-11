import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AudioRepository } from "../../domain/repositories/audio.repository";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { CreditLogicRepository } from "src/shared/domain/repositories/credits-logic.repository";
import { GenerateAudioDto } from "../dtos/generate-audio.dto";
import { GenerateAudioVO } from "../../domain/value-objects/generated-audio.vo";
import { JobsType, NotifierService } from "src/modules/notifications/infrastructure/sockets/notifier.service";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { ExtractErrorInfo } from "src/shared/infrastructure/helpers/ExtractErrorInfo";


@Injectable()
export class SaveAudioUseCase{
    constructor(
        private readonly audioCommandService:AudioRepository,
        private readonly storageService:StorageRepository,
        private readonly creditsService: CreditLogicRepository,
        private readonly  notifierService: NotifierService,
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

        this.notifierService.notifyReady(payload.user, JobsType.AUDIO, {
            jobId: jobId,
            entity: audio,
            status: StatusQueue.COMPLETED,
            message: 'Audio generated',
            creditsUpdate: creditsUpdated
        });
        } catch (error) {
            const errorInfo = ExtractErrorInfo.extract(error, jobId)
            this.notifierService.notifyError( payload.user,JobsType.AUDIO,errorInfo)
        }
    }
}