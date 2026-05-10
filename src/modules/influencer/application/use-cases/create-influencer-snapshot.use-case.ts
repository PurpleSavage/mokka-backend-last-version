import { Injectable } from "@nestjs/common";
import { MdReaderPort } from "src/shared/common/application/ports/md-reader.port";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { CreateInfluencerSnapshotDto } from "../dtos/responses/create-influencer-snapshot.dto";

@Injectable()
export class CreateInfluencerSnapshotUseCase{
    constructor(
        private readonly multimediaService:MultimediaGeneratorPort,
        private readonly mdReaderService:MdReaderPort,
    ){}
    async execute(dto:CreateInfluencerSnapshotDto,jobId:string){
        const promptmd = await this.mdReaderService.loadPrompt('snapshot-influencer','influencer')
        const templateFill = this.mdReaderService.fillTemplate(promptmd,dto)
        const config = {
            aspectRatio: dto.aspectRatio, 
            prompt:templateFill,
            urls:dto.url,
            webhookUrl: 'https://tu-api.com/v1/webhooks/replicate/influencers/influencer',
            jobId: jobId,
        }
         
        const predictionId = await this.multimediaService.generateImage(config)
        return predictionId
    }
}