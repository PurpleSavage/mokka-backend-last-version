import { Injectable } from "@nestjs/common";

import { MdReaderPort } from "src/shared/common/application/ports/md-reader.port";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { GenerateImageDto } from "../dtos/request/generate-image.dto";

@Injectable()
export class GenerateImageUseCase{
    constructor(
        private readonly mdReaderService:MdReaderPort,
        private readonly multimediaService:MultimediaGeneratorPort
    ){}
    async execute(generateImageDto:GenerateImageDto){
        
        const pormptmd = await this.mdReaderService.loadPrompt('generator-image','image')
        const templateFill = this.mdReaderService.fillTemplate(pormptmd,generateImageDto)
        const config = {
            aspectRatio: generateImageDto.aspectRatio, 
            prompt: templateFill,
        }
        const imageUrl = await this.multimediaService.generateImage(config)
        return imageUrl
    }
}