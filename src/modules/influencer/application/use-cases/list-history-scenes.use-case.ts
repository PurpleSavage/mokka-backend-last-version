import { Injectable } from "@nestjs/common";
import { ListHistoryScenesDto } from "../dtos/list-history-scenes.dto";
import { InfluencerPort } from "../ports/influencer.port";

@Injectable()
export class ListHistoryScenesUseCase{
    constructor(
         private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:ListHistoryScenesDto){
        return this.influencerQueryService.historyInfluencerScenes(dto.userId)
    }
}