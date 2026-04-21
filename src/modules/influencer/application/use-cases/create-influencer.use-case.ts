import { Injectable } from "@nestjs/common";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { CreateInfluencerDto } from "../dtos/responses/create-influencer.dto";
import { MdReaderPort } from "src/shared/common/application/ports/md-reader.port";



@Injectable()
export class CreateInfluencerUseCase{
    constructor(
        public readonly multimediaService:MultimediaGeneratorPort,
        private readonly mdReaderService:MdReaderPort,
    ){}
    async execute(dto:CreateInfluencerDto){
        const defaultAspectRatio="1:1"
        const promptmd = await this.mdReaderService.loadPrompt('generator-influencer','influencer')
        const templateFill = this.mdReaderService.fillTemplate(promptmd,dto)
        const config={
            aspectRatio: defaultAspectRatio, 
            prompt: templateFill,
        }
        const imageUrl= await this.multimediaService.generateImage(config)
        return imageUrl
    }
}