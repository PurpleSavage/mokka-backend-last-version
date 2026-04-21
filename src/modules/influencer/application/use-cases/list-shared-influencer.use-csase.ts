import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { InfluencerPort } from "../ports/influencer.port";
import { SharedInfluencerEntity } from "../../domain/entities/shared-influencer.entity";
import { Injectable } from "@nestjs/common";
import { ListResourcesDto } from "src/shared/common/application/dtos/request/list-resources.dto";

@Injectable()
export class ListSharedInfluencerUseCase{
    private nameList = 'shared-influencers:list'
    constructor(
        private readonly influencerQueryService:InfluencerPort,
        private readonly cachemanager:CacheManagerPort
    ){}
    async execute(dto:ListResourcesDto){
        const cachedPage = await this.cachemanager.read<SharedInfluencerEntity>(this.nameList,dto.page,dto.limit)
        if(cachedPage && cachedPage.length>0){
            return cachedPage
        }
        const  list = await this.influencerQueryService.listSharedInfluencer(dto.page,dto.limit)
        await this.cachemanager.setMany(this.nameList,list) 
        return list
    }
}