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
        const {url} = await this.storageService.saveAudio(dto.idUser,audioBuffer)
        const vo = new GenerateAudioVO()
            .setPrompt(dto.prompt)
            .setUser(dto.idUser)
            .setIdModel(dto.idModel)
            .setNameModelAudio(dto.nameModelAudio)
            .setUrlAudio(url)
            .setSpeed(dto.speed)
            .setStability(dto.stability)
            .setSimilarity(dto.similarity)
            .setExaggeration(dto.exaggeration)
            .setUseSpeakerBoost(dto.useSpeakerBoost)
            .build();
        const audio = await this.audioCommandService.saveGeneratedAudio(vo)
        return audio
    }
}