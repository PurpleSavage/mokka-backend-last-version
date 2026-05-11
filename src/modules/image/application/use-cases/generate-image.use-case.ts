import { Injectable } from "@nestjs/common";
import { MdReaderPort } from "src/shared/common/application/ports/md-reader.port";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { GenerateImageDto } from "../dtos/request/generate-image.dto";
import { ConfigService } from "@nestjs/config";
import { buildUrlWebhook } from "src/modules/config/webhooks.config";

@Injectable()
export class GenerateImageUseCase{
    private webhookUrl:string
    constructor(
        private readonly mdReaderService:MdReaderPort,
        private readonly multimediaService:MultimediaGeneratorPort,
        private readonly configService:ConfigService,
    ){
        const url= this.configService.get<string>('WEBHOOK_BASE_URL');
        if (!url) {
            throw new Error('WEBHOOK_BASE_URL is not configured.');
        }
        this.webhookUrl=url
    }
    async execute(generateImageDto:GenerateImageDto,jobId:string){
        
        const pormptmd = await this.mdReaderService.loadPrompt('generator-image','image')
        const templateFill = this.mdReaderService.fillTemplate(pormptmd,generateImageDto)
        const config = {
            aspectRatio: generateImageDto.aspectRatio, 
            prompt: templateFill,
            webhookUrl: buildUrlWebhook(this.webhookUrl).INFLUENCERS.INFLUECER, //TODO: cambiar esto
            jobId: jobId,
        }
        const imageUrl = await this.multimediaService.generateImage(config)
        return imageUrl
    }
}