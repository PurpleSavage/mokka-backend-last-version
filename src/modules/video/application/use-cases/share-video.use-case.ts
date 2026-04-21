import { Injectable } from "@nestjs/common";
import { VideoRepository } from "../../domain/repositories/video.repository";
import { ShareVideoDto } from "../dtos/request/share-video.dto";
import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { VideoSharedEntity } from "../../domain/entities/video-shared.entity";

@Injectable()
export class ShareVideoUseCase{
    private nameList = 'shared-videos:list'
    constructor(
        private readonly videoCommandService:VideoRepository,
        private readonly cacheService: CacheManagerPort,
    ){}
    async execute(dto:ShareVideoDto){
        const response = await this.videoCommandService.shareVideo(dto.videoId,dto.sharedBy) 
        const cacheLength = await this.cacheService.length(this.nameList)
        if (cacheLength > 0) {
            await this.cacheService.set<VideoSharedEntity>(this.nameList, response);
        }
        return response
    }
}