import { Injectable } from "@nestjs/common";
import { ListInfluencersDto } from "../dtos/list-influencers.dto";
import { InfluencerPort } from "../ports/influencer.port";

@Injectable()
export class ListInfluencersUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:ListInfluencersDto){
        return this.influencerQueryService.listInfluencers(dto.userId)
    }
}