import { Injectable } from "@nestjs/common";
import { Mockups3DPort } from "../ports/mockups-3d.port";
import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { Model3DEntity } from "../../domain/entities/model-3d-mockup.entity";

@Injectable()
export class List3DModelsUseCase{
    private readonly CACHE_KEY = 'models3d:list'
    constructor(
        private readonly mockups3dQueryService:Mockups3DPort,
         private readonly cacheService: CacheManagerPort
    ){}
    async execute(page:number,limit:number){
        const cachedPage = await this.cacheService.read<Model3DEntity>(this.CACHE_KEY,page,limit)
        if (cachedPage && cachedPage.length > 0) return cachedPage
        const listModels = await this.mockups3dQueryService.list3DMoclups(page,limit)
        await this.cacheService.setMany(this.CACHE_KEY,listModels)
        return listModels

    }
}