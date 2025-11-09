import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { ListSharedImageUseCase } from "./application/use-cases/list-shared-image.use-case";
import { ListImagesUseCase } from "./application/use-cases/list-images.use-case";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListImagesDto } from "./application/dtos/list-images.dto";
import { ListSharedImageDto } from "./application/dtos/list-shared-image.dto";

@Controller({
    path:'image/write',
    version:"1"
})
export class ImageQueryController{
    constructor(
        private readonly listSharedImageUseCase:ListSharedImageUseCase,
        private readonly listImagesUseCase:ListImagesUseCase
    ){}

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('images/:idUser')
    @HttpCode(HttpStatus.OK)
    listImages(
        @Param() listImagesDto:ListImagesDto
    ){
        return this.listImagesUseCase.execute(listImagesDto)
    }


    @Throttle({ default: { limit: 400, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('share')
    @HttpCode(HttpStatus.OK)
    listSharedImages(
        @Query() listSharedImageDto:ListSharedImageDto
    ){
        return this.listSharedImageUseCase.execute(listSharedImageDto)  
    }
}