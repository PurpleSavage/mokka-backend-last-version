import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Queue } from "bullmq";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { CreateInfluencerDto } from "../../application/dtos/responses/create-influencer.dto";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { CreateInfluencerSnapshotDto } from "../../application/dtos/responses/create-influencer-snapshot.dto";
import { CreateInfluencerSceneDto } from "../../application/dtos/responses/create-influencer-scene.dto";
import { ShareInfluencerDto } from "../../application/dtos/request/share-influencer.dto";
import { ShareInfluencerUseCase } from "../../application/use-cases/share-influencer.use-case";
import { ShareSceneDto } from "../../application/dtos/request/share-scene.dto";
import { ShareSceneUseCase } from "../../application/use-cases/share-scene.use-case";
import { ShareSnapshotUseCase } from "../../application/use-cases/share-snapshot.use-case";
import { ShareSnapshotDto } from "../../application/dtos/request/share-snapshot.dto";


@Controller({
     path:'influencer/write',
    version:'1'
})
export class InfluencerCommandController{
    constructor(
        @InjectQueue('influencer-queue') private influencerQueue: Queue,
        @InjectQueue('influencer-snapshot-queue') private influencerSnapshotQueue:Queue,
        @InjectQueue('influencer-scene-queue') private influencerSceneQueue: Queue,
        private readonly shareInfluencerUseCase:ShareInfluencerUseCase,
        private readonly shareSceneUseCase:ShareSceneUseCase,
        private readonly shareSnapshotUseCase:ShareSnapshotUseCase
    ){}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard, CreditsGuard)
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
    @UseGuards(AccesstokenGuard, CreditsGuard)
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
    @UseGuards(AccesstokenGuard, CreditsGuard)
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

    
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Post('share')
    @HttpCode(HttpStatus.OK)
    shareInfluencer(
        @Body() dto:ShareInfluencerDto
    ){
        return this.shareInfluencerUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Post('share/scene')
    @HttpCode(HttpStatus.OK)
    shareScene(
        @Body() dto:ShareSceneDto
    ){
        return this.shareSceneUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Post('share/snapshot')
    shareSnapshot(
        @Body() dto:ShareSnapshotDto
    ){
        return this.shareSnapshotUseCase.execute(dto)
    }

}