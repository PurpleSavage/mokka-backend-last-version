import { Controller, HttpCode, HttpStatus, Param, Patch, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ReadNotificationUseClase } from "src/shared/notifications/application/use-cases/read-notification.use-case";
import { ReadNotificationRequestDto } from "../../application/dtos/request/read-notification.dto";

@Controller({
    path:'notifications/write',
    version:'1'
})
export class NotificationsCommandController{
    constructor(
        private readonly readNotificationuseCase:ReadNotificationUseClase
    ){}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Patch('mark/:notificationId')
    @HttpCode(HttpStatus.OK)
    readNotification(
        @Param() dto:ReadNotificationRequestDto
    ){
        return this.readNotificationuseCase.execute(dto.notificationId)
    }  
}