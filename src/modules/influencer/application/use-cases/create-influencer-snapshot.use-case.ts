import { Injectable } from "@nestjs/common";
import { MdReaderPort } from "src/shared/common/application/ports/md-reader.port";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { CreateInfluencerSnapshotDto } from "../dtos/responses/create-influencer-snapshot.dto";
import { ConfigService } from "@nestjs/config";
import { buildUrlWebhook } from "src/modules/config/webhooks.config";

@Injectable()
export class CreateInfluencerSnapshotUseCase{
    private webhookUrl:string
    constructor(
        private readonly multimediaService:MultimediaGeneratorPort,
        private readonly mdReaderService:MdReaderPort,
        private readonly configService:ConfigService,
    ){
        const url= this.configService.get<string>('WEBHOOK_BASE_URL');
        if (!url) {
            throw new Error('WEBHOOK_BASE_URL is not configured.');
        }
        this.webhookUrl=url
    }
    async execute(dto:CreateInfluencerSnapshotDto,jobId:string){
        const promptmd = await this.mdReaderService.loadPrompt('snapshot-influencer','influencer')
        const templateFill = this.mdReaderService.fillTemplate(promptmd,dto)
        const config = {
            aspectRatio: dto.aspectRatio, 
            prompt:templateFill,
            urls:dto.url,
            webhookUrl: buildUrlWebhook(this.webhookUrl).INFLUENCERS.INFLUECER,
            jobId: jobId,
        }
         
        const predictionId = await this.multimediaService.generateImage(config)
        return predictionId
    }
}