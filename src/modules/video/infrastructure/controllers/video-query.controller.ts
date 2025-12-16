import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListVideosDto } from "../../application/dtos/list-videos.dto";
import { ListVideosUseCase } from "../../application/use-cases/list-video.use-case";


@Controller({
    path:'video/read',
    version:'1'
})
export class VideoQueryController{
    constructor(
        private readonly listVideosUseCase:ListVideosUseCase
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
}