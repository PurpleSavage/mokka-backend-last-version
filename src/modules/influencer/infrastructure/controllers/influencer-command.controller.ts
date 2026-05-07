
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { CreateInfluencerDto } from "../../application/dtos/responses/create-influencer.dto";
import { CreateInfluencerSnapshotDto } from "../../application/dtos/responses/create-influencer-snapshot.dto";
import { CreateInfluencerSceneDto } from "../../application/dtos/responses/create-influencer-scene.dto";
import { ShareInfluencerDto } from "../../application/dtos/request/share-influencer.dto";
import { ShareInfluencerUseCase } from "../../application/use-cases/share-influencer.use-case";
import { ShareSceneDto } from "../../application/dtos/request/share-scene.dto";
import { ShareSceneUseCase } from "../../application/use-cases/share-scene.use-case";
import { ShareSnapshotUseCase } from "../../application/use-cases/share-snapshot.use-case";
import { ShareSnapshotDto } from "../../application/dtos/request/share-snapshot.dto";
import { ApiTags } from "@nestjs/swagger";
import { EnqueueInfluencerUseCase } from "../../application/use-cases/enqueue-influencer.use-case";
import { EnqueueInfluencerSnapshotUseCase } from "../../application/use-cases/enqueue-influencer-snapshot.use-case";
import { EnqueueInfluencerSceneUseCase } from "../../application/use-cases/enqueue-influencer-scene.use-case";


@ApiTags('Influencers write  service')
@Controller({
     path:'influencer/write',
    version:'1'
})
export class InfluencerCommandController{
    constructor(
        private readonly shareInfluencerUseCase:ShareInfluencerUseCase,
        private readonly shareSceneUseCase:ShareSceneUseCase,
        private readonly shareSnapshotUseCase:ShareSnapshotUseCase,
        private readonly enqueueInfluencerUseCase:EnqueueInfluencerUseCase,
        private readonly enqueueInfluencerSnapshotUseCase:EnqueueInfluencerSnapshotUseCase,
        private readonly enqueueInfluencerSceneUseCase:EnqueueInfluencerSceneUseCase
    ){}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard, CreditsGuard)
    @RequiresCredits(30)
    @Post('model')
    @HttpCode(HttpStatus.OK)
   influencerGenerator(
        @Body() dto:CreateInfluencerDto
    ){
        return this.enqueueInfluencerUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard, CreditsGuard)
    @RequiresCredits(30)
    @Post('snapshot')
    @HttpCode(HttpStatus.OK)
    influencerSnapshotGenerator(
        @Body() dto:CreateInfluencerSnapshotDto
    ){
        return this.enqueueInfluencerSnapshotUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard, CreditsGuard)
    @RequiresCredits(30)
    @Post('scene')
    @HttpCode(HttpStatus.OK)
    influencerSceneGenerator(
        @Body() dto:CreateInfluencerSceneDto
    ){
        return this.enqueueInfluencerSceneUseCase.execute(dto)
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