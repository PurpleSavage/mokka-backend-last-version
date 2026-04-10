import { Injectable } from "@nestjs/common";
import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { SharedImageEntity } from "../../domain/entities/shared-image.entity";
import { ImagePort } from "../ports/image.port";
import { ListResourcesDto } from "src/shared/common/application/dtos/request/list-resources.dto";


@Injectable()
export class ListSharedImageUseCase{
    private readonly CACHE_KEY = 'images:list'
    constructor(
        private readonly imageQueryService:ImagePort,
        private readonly cacheService: CacheManagerPort
    ){}
    async execute(listSharedImageDto:ListResourcesDto){
        const cachedPage = await this.cacheService.read<SharedImageEntity>(this.CACHE_KEY, listSharedImageDto.page,listSharedImageDto.limit)
        if (cachedPage && cachedPage.length > 0) return cachedPage
        const listSharedImage = await this.imageQueryService.listSharedImage(listSharedImageDto.page,listSharedImageDto.limit)
        await this.cacheService.setMany(this.CACHE_KEY,listSharedImage )
        return listSharedImage 
        
    }
}