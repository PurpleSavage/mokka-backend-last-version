import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Queue } from "bullmq";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { CreateInfluencerDto } from "../../application/dtos/create-influencer.dto";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";


@Controller({
     path:'influencer/write',
    version:'1'
})
export class InfluencerCommandController{
    constructor(
        @InjectQueue('influencer-queue') private audioQueue: Queue,
    ){}
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @UseGuards(CreditsGuard)
    @RequiresCredits(30)
    @Post('generations')
    @HttpCode(HttpStatus.OK)
    async influencerGenerator(
        @Body() dto:CreateInfluencerDto
    ){
        const job = await this.audioQueue.add('influencer-queue',
            dto,
            {
                removeOnComplete: false, 
                removeOnFail: true,      
            },
        )
         return{
            jobId:job.id,
            status:StatusQueue.PROCESSING,
            message:'Influencer generation started'
        }
    }
}