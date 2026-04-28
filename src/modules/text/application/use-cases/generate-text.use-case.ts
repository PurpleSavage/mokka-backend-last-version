import { MdReaderPort } from "src/shared/common/application/ports/md-reader.port";
import { GenerateTextDto } from "../dtos/request/generate-text.dto";

import { Injectable } from "@nestjs/common";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";

@Injectable()
export class GenerateTextUseCase{
    constructor(
        private readonly multimediaService:MultimediaGeneratorPort,
       
        private readonly mdReaderService:MdReaderPort
    ){}
    async execute(dto:GenerateTextDto){
        const obj = {
            length:dto.textLength,
            tone:dto.toneType,
            promotionType:dto.promotionType,
            format:dto.textFormat,
            title:dto.title,
            context:dto.context
        }
        const pormptmd = await this.mdReaderService.loadPrompt('generator-text','text')
        const templateFill = this.mdReaderService.fillTemplate(pormptmd,obj)
        const response = await this.multimediaService.generateText(templateFill)
        return response
    }
}