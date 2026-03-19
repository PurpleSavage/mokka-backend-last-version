import { Injectable } from "@nestjs/common";
import { ListInfluencersDto } from "../dtos/list-influencers.dto";
import { InfluencerPort } from "../ports/influencer.port";


@Injectable()
export class ListInfluencersUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    async execute(dto:ListInfluencersDto){
        console.log('llegó el dto',dto)
        const influencers=await this.influencerQueryService.listInfluencers(dto.user)
        console.log('influencers',influencers)
        return influencers
    }
}