import { Body, Controller, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { WebhookBodyResponseDto } from "src/shared/common/application/dtos/responses/webhook-body.dto";
import { HandleWebhookCreateInfluencerUseCase } from "../../application/use-cases/handle-webhook-create-influencer.use-case";
import { HandleWebhookCreateScenesUseCase } from "../../application/use-cases/handle-webhook-create-scenes.use-case";
import { HandleWebhookCreateSnapshotsUseCase } from "../../application/use-cases/handle-webhook-create-snapshots.use-case";



@Controller({
    version: '1',
    path: 'webhooks/replicate/influencers'
})
export class InfluencerWebhookController {
    constructor(
        private readonly handleWebhookInfluencerUseCase:HandleWebhookCreateInfluencerUseCase,
        private readonly handleWebhookCreateScenesUseCase:HandleWebhookCreateScenesUseCase,
        private readonly handleWebhookCreateSnapshotsUseCase:HandleWebhookCreateSnapshotsUseCase,
    ) {}


    @Post('snapshot')
    @HttpCode(HttpStatus.OK)
    async handleSnapshot(
         @Query('jobId') jobId: string,
        @Body() body: WebhookBodyResponseDto
    ) {
        
        return this.handleWebhookCreateSnapshotsUseCase.execute(body,jobId)
    }


    @Post('scene')
    @HttpCode(HttpStatus.OK)
    async handleScene(
        @Query('jobId') jobId: string,
        @Body() body: WebhookBodyResponseDto
    ) {
        return this.handleWebhookCreateScenesUseCase.execute(body,jobId)
    }


    @Post('influencer')
    @HttpCode(HttpStatus.OK)
    async handleInfluencer(
        @Query('jobId') jobId: string,
        @Body() body: WebhookBodyResponseDto
    ) {
  
        return this.handleWebhookInfluencerUseCase.execute(body,jobId)
    }
}