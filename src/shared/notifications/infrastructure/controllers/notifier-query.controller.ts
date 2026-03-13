import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListNotificationsDto } from "src/shared/notifications/application/dtos/list-notifications.dto";
import { ListNotificationsUseCase } from "../../../../shared/notifications/application/use-cases/list-notifications.use-case";


@Controller({
    path:'notifications/read',
    version:'1'
})
export class NotifierQueryController{
    constructor(
        private readonly listNotificationsUSeCase:ListNotificationsUseCase
    ){}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('all')
    @HttpCode(HttpStatus.OK)
    listNotifications(
        @Query() dto:ListNotificationsDto
    ){
        return this.listNotificationsUSeCase.execute(dto)
    }   
}