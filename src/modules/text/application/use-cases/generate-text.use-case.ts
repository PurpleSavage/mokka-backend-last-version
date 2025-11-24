import { MdReaderPort } from "src/shared/application/ports/md-reader.port";
import { TextRepository } from "../../domain/repositories/text.repository";
import { GenerateTextDto } from "../dtos/request/generate-text.dto";
import { TextGeneratorPort } from "../ports/text-generator.port";

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
        //alta l value object
    }
}