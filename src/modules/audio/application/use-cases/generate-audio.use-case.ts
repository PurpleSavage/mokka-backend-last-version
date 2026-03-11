import { Injectable } from "@nestjs/common";
import { GenerateAudioDto } from "../dtos/generate-audio.dto";
import { AudioGeneratorPort } from "../ports/audio-generator.port";



@Injectable()
export class GenerateAudioUseCase{
    constructor(
        private readonly audioGeneratorService:AudioGeneratorPort
    ){}
    async execute(dto:GenerateAudioDto){
        const audioBuffer = await this.audioGeneratorService.generateVoice(dto)
        return audioBuffer
    }
}