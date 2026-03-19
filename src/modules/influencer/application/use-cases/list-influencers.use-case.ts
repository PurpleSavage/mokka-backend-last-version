import { Injectable } from "@nestjs/common";
import { ListInfluencersDto } from "../dtos/list-influencers.dto";
import { InfluencerPort } from "../ports/influencer.port";
import { InfluencerMapper } from "../mappers/influencer.mapper";

@Injectable()
export class ListInfluencersUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    async execute(dto:ListInfluencersDto){
        const influencers=await this.influencerQueryService.listInfluencers(dto.userId)
        return InfluencerMapper.toResponseList(influencers);
    }
}