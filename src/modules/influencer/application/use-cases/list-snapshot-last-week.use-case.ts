import { ListSnpashotsLastWeekDto } from "../dtos/list-snapshots-last-week.dto";
import { InfluencerPort } from "../ports/influencer.port";

export class ListSnapshotLastWeekUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:ListSnpashotsLastWeekDto){
        return this.influencerQueryService.influencerScenesLastWeek(dto.userId)
    }
}