import { Injectable } from "@nestjs/common";
import { ListResourcesDto } from "src/shared/common/application/dtos/request/list-resources.dto";
import { VideoPort } from "../ports/video.port";
import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { VideoSharedEntity } from "../../domain/entities/video-shared.entity";

@Injectable()
export class ListSharedVideosUseCase{
    private nameList = 'shared-videos:list'
    constructor(
        private readonly videoQueryService: VideoPort,
        private readonly cachemanager: CacheManagerPort,
    ){}
    async execute(dto:ListResourcesDto){
        const cachedPage  = await this.cachemanager.read<VideoSharedEntity>(
              this.nameList,
              dto.page,
              dto.limit
            );
        if (cachedPage && cachedPage .length > 0) {
            return cachedPage 
        }
        const list = await this.videoQueryService.listSharedVideos(
            dto.page,
            dto.limit
        );
        await this.cachemanager.setMany(this.nameList, list);
        return list;
    }
}