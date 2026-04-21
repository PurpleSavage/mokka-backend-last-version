import { Injectable } from "@nestjs/common";
import { InfluencerRepository } from "../../domain/repository/influencer.repository";
import { ShareInfluencerDto } from "../dtos/request/share-influencer.dto";
import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { SharedInfluencerEntity } from "../../domain/entities/shared-influencer.entity";

@Injectable()
export class ShareInfluencerUseCase{
    private nameList = 'shared-influencers:list'
    constructor(
        private readonly influencerCommandService:InfluencerRepository,
        private readonly cacheService: CacheManagerPort,

    ){}
    async execute(dto:ShareInfluencerDto){
        const  response = await this.influencerCommandService.shareInfluencer(dto.influencerId,dto.sharedBy)
        const cacheLength = await this.cacheService.length(this.nameList)
        if (cacheLength > 0) {
            await this.cacheService.set<SharedInfluencerEntity>(this.nameList, response);
        }
        return response
    }
}