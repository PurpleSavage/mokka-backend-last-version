import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Queue } from "bullmq";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { CreateInfluencerDto } from "../../application/dtos/create-influencer.dto";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { CreateInfluencerSnapshotDto } from "../../application/dtos/create-influencer-snapshot.dto";
import { CreateInfluencerSceneDto } from "../../application/dtos/create-influencer-scene.dto";


@Controller({
     path:'influencer/write',
    version:'1'
})
export class InfluencerCommandController{
    constructor(
        @InjectQueue('influencer-queue') private influencerQueue: Queue,
        @InjectQueue('influencer-snapshot-queue') private influencerSnapshotQueue:Queue,
        @InjectQueue('influencer-scene-queue') private influencerSceneQueue: Queue
    ){}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @UseGuards(CreditsGuard)
    @RequiresCredits(30)
    @Post('model')
    @HttpCode(HttpStatus.OK)
    async influencerGenerator(
        @Body() dto:CreateInfluencerDto
    ){
        const job = await this.influencerQueue.add('influencer-queue',
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

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @UseGuards(CreditsGuard)
    @RequiresCredits(30)
    @Post('snapshot')
    @HttpCode(HttpStatus.OK)
    async influencerSnapshotGenerator(
        @Body() dto:CreateInfluencerSnapshotDto
    ){
        const job = await this.influencerSnapshotQueue.add('influencer-snapshot-queue',
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

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @UseGuards(CreditsGuard)
    @RequiresCredits(30)
    @Post('scene')
    @HttpCode(HttpStatus.OK)
    async influencerSceneGenerator(
        @Body() dto:CreateInfluencerSceneDto
    ){
        const job = await this.influencerSceneQueue.add('influencer-scene-queue',
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