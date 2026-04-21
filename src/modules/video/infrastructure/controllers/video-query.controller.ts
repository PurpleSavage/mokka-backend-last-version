import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListVideosDto } from "../../application/dtos/response/list-videos.dto";
import { ListVideosUseCase } from "../../application/use-cases/list-video.use-case";
import { ListResourcesDto } from "src/shared/common/application/dtos/request/list-resources.dto";
import { ListSharedVideosUseCase } from "../../application/use-cases/list-shared-video.use-case";


@Controller({
    path:'video/read',
    version:'1'
})
export class VideoQueryController{
    constructor(
        private readonly listVideosUseCase:ListVideosUseCase,
        private readonly listSharedVideosUseCase:ListSharedVideosUseCase
    ){}
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard) 
    @Get('videos/:user')
    @HttpCode(HttpStatus.OK)
    listVideosByUserId(
        @Param() dto:ListVideosDto
    ){
        return this.listVideosUseCase.execute(dto.user)
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard) 
    @Get('shared-videos')
    @HttpCode(HttpStatus.OK)
    listSharedVideos(
        @Query() dto: ListResourcesDto
    ){
        return this.listSharedVideosUseCase.execute(dto)
    }   
}