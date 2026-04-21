import { Injectable } from "@nestjs/common";
import { getSnapshotByIdDto } from "../dtos/responses/get-snapshot-by-id.dto";
import { InfluencerPort } from "../ports/influencer.port";

@Injectable()
export class GetSnapshotByIdUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:getSnapshotByIdDto){
        return this.influencerQueryService.getSnapshotById(dto.snapshotId)
    }
}








