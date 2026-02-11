import { Injectable } from "@nestjs/common";
import { ListHistorySnapshotsDto } from "../dtos/list-history-snapshots.dto";
import { InfluencerPort } from "../ports/influencer.port";

@Injectable()
export class ListHistorySnapshotsUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:ListHistorySnapshotsDto){
        return this.influencerQueryService.historyInfluencerSnapshot(dto.userId)
    }
}