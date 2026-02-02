import { Injectable } from "@nestjs/common";
import { GenerateAudioDto } from "../dtos/generate-audio.dto";
import { AudioRepository } from "../../domain/repositories/audio.repository";
import { AudioGeneratorPort } from "../ports/audio-generator.port";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { GenerateAudioVO } from "../../domain/value-objects/generated-audio.vo";


@Injectable()
export class GenerateAudioUseCase{
    constructor(
        private readonly audioCommandService:AudioRepository,
        private readonly storageService:StorageRepository,
        private readonly audioGeneratorService:AudioGeneratorPort
    ){}
    async execute(dto:GenerateAudioDto){
        const audioBuffer = await this.audioGeneratorService.generateVoice(dto)
        const {url} = await this.storageService.saveAudio(dto.user,audioBuffer)
        const vo = GenerateAudioVO.create({
            prompt: dto.prompt,
            user: dto.user,
            idModel: dto.idModel,
            nameModelAudio: dto.nameModelAudio,
            urlAudio: url,
            speed: dto.speed,
            stability: dto.stability,
            similarity: dto.similarity,
            exaggeration: dto.exaggeration,
            useSpeakerBoost: dto.useSpeakerBoost
        })
        const audio = await this.audioCommandService.saveGeneratedAudio(vo)
        return audio
    }
}