import { Injectable } from "@nestjs/common";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { GenerateVideoDto } from "../dtos/generate-video.dto";


@Injectable()
export class GenerateVideoUseCase{
    constructor(
        private readonly multimediaService:MultimediaGeneratorPort,
    ){}
    async execute(dto:GenerateVideoDto){
        const video = await this.multimediaService.createVideo(dto.aspectRatio,dto.prompt,dto.audio)
        return video
    }
}
