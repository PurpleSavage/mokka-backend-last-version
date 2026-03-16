import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { CreateInfluencerSceneDto } from "../dtos/create-influencer-scene.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateInFluencerSceneUseCase{
    constructor(
        private readonly multimediaService:MultimediaGeneratorPort,
     
    ){}
    async execute(dto:CreateInfluencerSceneDto){
        const video = await this.multimediaService.createVideo(dto.aspectRatio,dto.prompt,dto.volume,dto.imageBaseUrls)
        return video
    }
}