import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { ListTextHistoryUseCase } from "./application/use-cases/list-history-text.use-case";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListHistoryTextDto } from "./application/dtos/request/list-history-text.dto";


@Controller({
    path:'text/read',
    version:"1"
})
export class TextQueryController{
    constructor(
        private readonly listTextHistoryUseCase:ListTextHistoryUseCase
    ){}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('history/:user')
    @HttpCode(HttpStatus.OK)
    listextHistory(
        @Param() listTextHistoryDto:ListHistoryTextDto
    ){
        return this.listTextHistoryUseCase.execute(listTextHistoryDto)
    }
}