import { CacheManagerPort } from "src/shared/application/ports/cache-manager.port";
import { InfluencerPort } from "../ports/influencer.port";
import { ListSharedDto } from "../dtos/list-shared.dto";
import { SharedInfluencerEntity } from "../../domain/entities/shared-influencer.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ListSharedInfluencerUseCase{
    private nameList = 'SHARED_INFLUENCER_LIST'
    constructor(
        private readonly influencerQueryService:InfluencerPort,
        private readonly cachemanager:CacheManagerPort
    ){}
    async execute(dto:ListSharedDto){
        const cacheList = await this.cachemanager.read<SharedInfluencerEntity>(this.nameList,dto.page)
        if(cacheList.length>0){
            return cacheList
        }
        const  list = await this.influencerQueryService.listSharedInfluencer(dto.page)
        await this.cachemanager.setMany(this.nameList,list) 
        return list
    }
}