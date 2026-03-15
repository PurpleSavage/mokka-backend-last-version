import { MdReaderPort } from "src/shared/common/application/ports/md-reader.port";
import { GenerateTextDto } from "../dtos/request/generate-text.dto";
import { TextGeneratorPort } from "../ports/text-generator.port";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GenerateTextUseCase{
    constructor(
        private readonly textGeneratorService:TextGeneratorPort,
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
        const pormptmd = await this.mdReaderService.loadPrompt('generator_text','text')
        const templateFill = this.mdReaderService.fillTemplate(pormptmd,obj)
        const response = await this.textGeneratorService.createText(templateFill)
        return response
    }
}