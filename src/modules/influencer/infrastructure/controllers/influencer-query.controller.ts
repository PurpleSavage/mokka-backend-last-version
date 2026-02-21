import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { GetInfluencerByIdUseCase } from "../../application/use-cases/get-influencer-by-id.use-case";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { GetInfluencerByIdDto } from "../../application/dtos/get-influencer-by-id.dto";
import { GetSnapshotByIdUseCase } from "../../application/use-cases/get-snapshot-by-id.use-case";
import { getSnapshotByIdDto } from "../../application/dtos/get-snapshot-by-id.dto";
import { ListHistoryScenesLastWeek } from "../../application/use-cases/list-history-scenes-last-week.use-case";
import { ListScenesLastWeekDto } from "../../application/dtos/list-scenes-last-week.dto";
import { ListHistoryScenesDto } from "../../application/dtos/list-history-scenes.dto";
import { ListHistoryScenesUseCase } from "../../application/use-cases/list-history-scenes.use-case";
import { ListHistorySnapshotsUseCase } from "../../application/use-cases/list-history-snapshots.use-case";
import { ListSnapshotLastWeekUseCase } from "../../application/use-cases/list-snapshot-last-week.use-case";
import { ListHistorySnapshotsDto } from "../../application/dtos/list-history-snapshots.dto";
import { ListSnpashotsLastWeekDto } from "../../application/dtos/list-snapshots-last-week.dto";
import { ListInfluencersUseCase } from "../../application/use-cases/list-influencers.use-case";
import { ListInfluencersDto } from "../../application/dtos/list-influencers.dto";
import { ListSharedDto } from "../../application/dtos/list-shared.dto";
import { ListSharedInfluencerUseCase } from "../../application/use-cases/list-shared-influencer.use-csase";
import { ListSharedSnapshotsUseCase } from "../../application/use-cases/list-shared-snapshots.use-case";
import { ListSharedScenesUseCase } from "../../application/use-cases/list-shared-scenes.use-case";

@Controller({
    path:'influencer/read',
    version:'1'
})
export class InfluencerQueryController{
    constructor(
        private readonly getInfluencerByIdUseCase:GetInfluencerByIdUseCase,
        private readonly getSnapshotByIdUseCase:GetSnapshotByIdUseCase,
        private readonly listHistoryScenesLastWeekUseCase:ListHistoryScenesLastWeek,
        private readonly listHistoryScenesUseCase:ListHistoryScenesUseCase,
        private readonly listHistorySnapshotsUseCase:ListHistorySnapshotsUseCase,
        private readonly listHistorySnapshotsLastWeekUseCase:ListSnapshotLastWeekUseCase,
        private readonly listInfluencersUseCase:ListInfluencersUseCase,
        private readonly listSharedInfluencersUseCase:ListSharedInfluencerUseCase,
        private readonly listSharedSnapshotsUseCase:ListSharedSnapshotsUseCase,
        private readonly listSharedScenesUseCase:ListSharedScenesUseCase
    ){}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('models/:userId')
    @HttpCode(HttpStatus.OK)
    listInfluencers(
        @Param() dto:ListInfluencersDto
    ){
        return this.listInfluencersUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('model/:influencerId')
    @HttpCode(HttpStatus.OK)
    getInfluencer(
        @Param() dto:GetInfluencerByIdDto
    ){
        return this.getInfluencerByIdUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('snapshot/:snapshotId')
    @HttpCode(HttpStatus.OK)
    getSnapshot(
        @Param() dto:getSnapshotByIdDto
    ){
        return this.getSnapshotByIdUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('last-scenes/:userId')
    @HttpCode(HttpStatus.OK)
    historySceneslastWeek(
        @Param() dto:ListScenesLastWeekDto
    ){
        return this.listHistoryScenesLastWeekUseCase.execute(dto)
    }


    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('scenes')
    @HttpCode(HttpStatus.OK)
    historyScenes(
        @Query() dto:ListHistoryScenesDto
    ){
        return this.listHistoryScenesUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('snapshots')
    @HttpCode(HttpStatus.OK)
    historySnapshots(
        @Query() dto:ListHistorySnapshotsDto
    ){
        return this.listHistorySnapshotsUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @UseGuards(CreditsGuard)
    @Get('last-snapshots/:userId')
    @HttpCode(HttpStatus.OK)
    historySnapshotslastWeek(
        @Param() dto:ListSnpashotsLastWeekDto
    ){
        return this.listHistorySnapshotsLastWeekUseCase.execute(dto)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('shared-influencers')
    @HttpCode(HttpStatus.OK)
    listSharedInfluencer(
        @Query() dto:ListSharedDto
    ){
        return this.listSharedInfluencersUseCase.execute(dto)
    }


    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('shared-snapshots')
    @HttpCode(HttpStatus.OK)
    listSharedSnapshots(
        @Query() dto:ListSharedDto
    ){
        return this.listSharedSnapshotsUseCase.execute(dto)
    }


    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('shared-scenes')
    @HttpCode(HttpStatus.OK)
    listSharedScenes(
        @Query() dto:ListSharedDto
    ){
        return this.listSharedScenesUseCase.execute(dto)
    }
}