import { Injectable } from "@nestjs/common";
import { ListSnpashotsLastWeekDto } from "../dtos/responses/list-snapshots-last-week.dto";
import { InfluencerPort } from "../ports/influencer.port";

@Injectable()
export class ListSnapshotLastWeekUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:ListSnpashotsLastWeekDto){
        return this.influencerQueryService.influencersSnapshotLastWeek(dto.userId)
    }
}