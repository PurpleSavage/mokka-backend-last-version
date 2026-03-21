import { Injectable } from "@nestjs/common";
import { InfluencerPort } from "../ports/influencer.port";

@Injectable()
export class ListScenesByInfluencerIdUseCase{
    constructor(
        private readonly influencerQueryService: InfluencerPort
    ){}
    execute(influencer:string){
        return this.influencerQueryService.getInfluencerSceneById(influencer)
    }
}