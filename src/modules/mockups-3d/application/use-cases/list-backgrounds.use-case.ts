import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { Mockups3DPort } from "../ports/mockups-3d.port";
import { Injectable } from "@nestjs/common";
import { BackgroundMockupEntity } from "../../domain/entities/background-mockup.entity";

@Injectable()
export class ListBackgroundsUseCase{
    private readonly CACHE_KEY = 'backgrounds:list'
    constructor(
        private readonly mockups3dQueryService:Mockups3DPort,
        private readonly cacheService: CacheManagerPort
    ){}
    async execute(page:number){
        const cachedPage = await this.cacheService.read<BackgroundMockupEntity>(this.CACHE_KEY,page)
        if (cachedPage && cachedPage.length > 0) return cachedPage
        const mockups = await this.mockups3dQueryService.listBackgroundsMockups(page)
        await this.cacheService.setMany(this.CACHE_KEY,mockups)
        return mockups
    }
}