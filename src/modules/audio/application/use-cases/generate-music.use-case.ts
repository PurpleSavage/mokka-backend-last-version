import { Injectable } from "@nestjs/common";
import { GenerateMusicDto } from "../dtos/generate-music.dto";
import { AudioGeneratorPort } from "../ports/audio-generator.port";
import { MdReaderPort } from "src/shared/common/application/ports/md-reader.port";
import {  DataGenerateMusicDto } from "../dtos/data-generate-music.dto";

@Injectable()
export class GenerateMusicUseCase{
    constructor(
        private readonly audioGeneratorService:AudioGeneratorPort,
         private readonly mdReaderService:MdReaderPort,
    ){}
    async execute(dto:GenerateMusicDto){
        const configPrompt = {
            prompt: dto.prompt,
            genre: dto.genre,
            bpm: dto.bpm,
        }
        const promptmd = await this.mdReaderService.loadPrompt('generator-music','audio')
        const templateFill = this.mdReaderService.fillTemplate(promptmd,configPrompt)
        const dataGenerateMusicDto = new DataGenerateMusicDto(
            templateFill,
            dto.user,
            dto.durationMs,
            dto.forceInstrumental
        )
        const buffer = await this.audioGeneratorService.generateMusic(dataGenerateMusicDto)
        return buffer

    }
}