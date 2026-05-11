import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Query, RawBody, UnauthorizedException } from "@nestjs/common";
import { WebhookBodyResponseDto } from "src/shared/common/application/dtos/responses/webhook-body.dto";
import { HandleWebhookCreateInfluencerUseCase } from "../../application/use-cases/handle-webhook-create-influencer.use-case";
import { HandleWebhookCreateScenesUseCase } from "../../application/use-cases/handle-webhook-create-scenes.use-case";
import { HandleWebhookCreateSnapshotsUseCase } from "../../application/use-cases/handle-webhook-create-snapshots.use-case";
import { ValidateRawSignedContextUseCase } from "src/shared/common/application/use-cases/validate-raw-signed-context.use-case";
import { ReplicateValidateRawPort } from "src/shared/common/application/use-cases/validate-raw-signed-replicate.port";
import { ConfigService } from "@nestjs/config";




@Controller({
    version: '1',
    path: 'webhooks/replicate/influencers'
})
export class InfluencerWebhookController {
    private webhook_signed:string =''
    constructor(
        private readonly handleWebhookInfluencerUseCase:HandleWebhookCreateInfluencerUseCase,
        private readonly handleWebhookCreateScenesUseCase:HandleWebhookCreateScenesUseCase,
        private readonly handleWebhookCreateSnapshotsUseCase:HandleWebhookCreateSnapshotsUseCase,
        private readonly validateRawuseCase: ValidateRawSignedContextUseCase,
        private readonly replicateValidateRawPort :ReplicateValidateRawPort,
        private readonly configService:ConfigService
        ,
    ) {
        const token = this.configService.get<string>('REPLICATE_WEBHOOK_SECRET');
        if (!token) {
            throw new Error('REPLICATE_API_TOKEN is not configured.');
        }
        this.webhook_signed= token
    }


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
    handleInfluencer(
        @Query('jobId') jobId: string,
        @Body() body: WebhookBodyResponseDto,
        @Headers() headers: Record<string, unknown>,
        @RawBody() rawBody: Buffer
    ) {
        this.validateRawuseCase.setStrategy(this.replicateValidateRawPort)
        const isValid =this.validateRawuseCase.validateRaw(
            rawBody, 
            headers,
            this.webhook_signed
        )

        if (!isValid) {
            throw new UnauthorizedException('Invalid replicate signature');
        }
        return this.handleWebhookInfluencerUseCase.execute(body,jobId)
    }
}