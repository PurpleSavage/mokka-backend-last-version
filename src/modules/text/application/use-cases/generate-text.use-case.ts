import { MdReaderPort } from "src/shared/application/ports/md-reader.port";
import { TextRepository } from "../../domain/repositories/text.repository";
import { GenerateTextDto } from "../dtos/request/generate-text.dto";
import { TextGeneratorPort } from "../ports/text-generator.port";
import { GenerateTextVO } from "../../domain/value-objects/generate-text.vo";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GenerateTextUseCase{
    constructor(
        private readonly textCommandService:TextRepository,
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
        const vo = GenerateTextVO.create({
            user:dto.user,
            context:dto.context,
            promotionType: dto.promotionType,
            title: dto.title,
            toneType: dto.toneType,
            textLength: dto.textLength,
            textFormat: dto.textFormat,
            improvedContext:response.text
        })
        return this.textCommandService.saveText(vo)
    }
}