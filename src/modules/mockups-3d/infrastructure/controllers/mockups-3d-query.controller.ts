import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { List3DModelsUseCase } from "../../application/use-cases/list-3d-models.use-case";
import { ListResourcesDto } from "../../application/dtos/requests/list-resources.dto";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListBackgroundsUseCase } from "../../application/use-cases/list-backgrounds.use-case";


@Controller({
    version:'1',
    path:'3d/read',
})
export class Mockups3DQueryController{
    constructor(
        private readonly list3dModelsUseCase:List3DModelsUseCase,
        private readonly listBackgroundsMockups:ListBackgroundsUseCase
    ){}
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('all')
    @HttpCode(HttpStatus.OK)
    getModels(
        @Query() dto:ListResourcesDto
    ){
        return this.list3dModelsUseCase.execute(dto.page)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('backgrounds')
    @HttpCode(HttpStatus.OK)
    getBackgroundModels(
        @Query() dto:ListResourcesDto
    ){
        return this.listBackgroundsMockups.execute(dto.page)
    }

}