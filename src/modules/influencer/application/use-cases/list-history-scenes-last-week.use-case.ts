import { Injectable } from "@nestjs/common";
import { ListScenesLastWeekDto } from "../dtos/list-scenes-last-week.dto";
import { InfluencerPort } from "../ports/influencer.port";

@Injectable()
export class ListHistoryScenesLastWeek{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(dto:ListScenesLastWeekDto){
        return this.influencerQueryService.influencerScenesLastWeek(dto.userId)
    }
}