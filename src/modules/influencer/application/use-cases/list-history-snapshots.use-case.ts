import { ListHistorySnapshotsDto } from "../dtos/list-history-snapshots.dto";
import { InfluencerPort } from "../ports/influencer.port";

export class ListHistorySnapshotsUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:ListHistorySnapshotsDto){
        return this.influencerQueryService.historyInfluencerSnapshot(dto.userId)
    }
}