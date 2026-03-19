import { Injectable } from "@nestjs/common";
import { ListSharedImageDto } from "../dtos/request/list-shared-image.dto";
import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { SharedImageEntity } from "../../domain/entities/shared-image.entity";
import { ImagePort } from "../ports/image.port";
import { SharedImageMapper } from "../mappers/shared-image-mapper.mapper";

@Injectable()
export class ListSharedImageUseCase{
    private readonly CACHE_KEY = 'images:list'
    constructor(
        private readonly imageQueryService:ImagePort,
        private readonly cacheService: CacheManagerPort
    ){}
    async execute(listSharedImageDto:ListSharedImageDto){
        const cachedPage = await this.cacheService.read<SharedImageEntity>(this.CACHE_KEY, listSharedImageDto.page)
        if (cachedPage.length > 0) return cachedPage
        const listSharedImage = await this.imageQueryService.listSharedImage(listSharedImageDto.page)
        const responseDTOs = SharedImageMapper.toResponseList(listSharedImage);
        await this.cacheService.setMany(this.CACHE_KEY,responseDTOs)
        return responseDTOs
        
    }
}