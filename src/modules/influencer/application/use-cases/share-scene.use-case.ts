import { Injectable } from "@nestjs/common";
import { ShareSceneDto } from "../dtos/request/share-scene.dto";
import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { InfluencerRepository } from "../../domain/repository/influencer.repository";
import { SharedSceneEntity } from "../../domain/entities/shared-scene.entity";

@Injectable()
export class ShareSceneUseCase{
    private nameList = 'shared-scenes:list';
    constructor(
        private readonly influencerCommandService:InfluencerRepository,
        private readonly cacheService: CacheManagerPort,
    ){}
    async execute(dto:ShareSceneDto){
        const  response = await this.influencerCommandService.shareScene(dto.sceneId,dto.sharedBy)
        const cacheLength = await this.cacheService.length(this.nameList)
        if (cacheLength > 0) {
            await this.cacheService.set<SharedSceneEntity>(this.nameList, response);
        }
        return response
    }
}