import { getSnapshotByIdDto } from "../dtos/get-snapshot-by-id.dto";
import { InfluencerPort } from "../ports/influencer.port";


export class GetSnapshotByIdUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:getSnapshotByIdDto){
        return this.influencerQueryService.getSnapshotById(dto.snapshotId)
    }
}