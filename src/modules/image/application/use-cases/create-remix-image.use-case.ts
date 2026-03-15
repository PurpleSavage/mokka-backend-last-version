import { Injectable } from "@nestjs/common";
import { CreateRemixImageDto } from "../dtos/create-remix-image.dto";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { MdReaderPort } from "src/shared/common/application/ports/md-reader.port";



@Injectable()
export class CreateRemixImageUseCase{
    constructor(
        public readonly multimediaService:MultimediaGeneratorPort,
        private readonly mdReaderService:MdReaderPort,
    ){}
    async execute(createRemixImageDto:CreateRemixImageDto){
        const pormptmd = await this.mdReaderService.loadPrompt('generator-remix-image','image')
        const configPrompt={
            prompt:createRemixImageDto.prompt
        }
        const templateFill = this.mdReaderService.fillTemplate(pormptmd,configPrompt)
        const config = {
            aspectRatio: createRemixImageDto.aspectRatio, 
            prompt: templateFill,
            urls:[createRemixImageDto.prevImageUrl],
        }
        const urlRemixImage= await this.multimediaService.generateImage(config)
        return urlRemixImage
    }
}