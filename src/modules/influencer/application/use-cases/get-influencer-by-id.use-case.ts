import { Injectable } from "@nestjs/common";
import { GetInfluencerByIdDto } from "../dtos/responses/get-influencer-by-id.dto";
import { InfluencerPort } from "../ports/influencer.port";


@Injectable()
export  class GetInfluencerByIdUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:GetInfluencerByIdDto){
        return this.influencerQueryService.getInfluencerById(dto.influencerId)
    }
}