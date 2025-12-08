import { Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { ListTextHistoryUseCase } from "./application/use-cases/list-history-text.use-case";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { Throttle } from "@nestjs/throttler";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
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
    @UseGuards(CreditsGuard)
    @RequiresCredits(20)
    @Post('history/:user')
    @HttpCode(HttpStatus.OK)
    listextHistory(
        @Param() listTextHistoryDto:ListHistoryTextDto
    ){
        return this.listTextHistoryUseCase.execute(listTextHistoryDto)
    }
}