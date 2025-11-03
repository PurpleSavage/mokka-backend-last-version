import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { ListAudiosUseCase } from "./application/use-cases/list-audios.use-case";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListAudiosDto } from "./application/dtos/list-audios.dto";

@Controller({
    path:'audio/read',
    version:'1'
})
export class AudioQueryController{
    constructor(
        private readonly listAudiosUseCase:ListAudiosUseCase
    ){}
 
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('audios/:idUser')
    @HttpCode(HttpStatus.OK)
    async listAudios(
        @Param() listAudiosDto:ListAudiosDto
    ){
        return await this.listAudiosUseCase.execute(listAudiosDto)
    }
}