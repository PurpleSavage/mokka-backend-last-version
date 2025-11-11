import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UpdateDownloadsSharedImageUseCase } from "./application/use-cases/update-downloads-shared-image.use-case";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { UpdateDownloadsSharedImageDto } from "./application/dtos/update-downloads-image.dto";
import { ShareImageUseCase } from "./application/use-cases/shared-image.use-case";
import { ShareImageDto } from "./application/dtos/share-image.dto";
import { CreateRemixImageUseCase } from "./application/use-cases/create-remix-image.use-case";
import { CreateRemixImageDto } from "./application/dtos/create-remix-image.dto";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { GenerateImageDto } from "./application/dtos/generate-image.dto";

@Controller({
    path:'image/read',
    version:"1"
})
export class ImageCommandController{
    constructor(
        @InjectQueue('image-queue') private imageQueue: Queue,
        private readonly updateDownloadsSharedImageUseCase:UpdateDownloadsSharedImageUseCase,
        private readonly shareImageUseCase:ShareImageUseCase,
        private readonly createRemixImageUseCase:CreateRemixImageUseCase
    ){}
    
    @Patch('community-image/:sharedImageId')
    @Throttle({ default: { limit: 400, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @HttpCode(HttpStatus.OK)
    udpateDownloadsSharedImage(
        @Param() updateDownloadsSharedImageDto:UpdateDownloadsSharedImageDto
    ){
        return this.updateDownloadsSharedImageUseCase.execute(updateDownloadsSharedImageDto)
    }


    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Post('share')
    @HttpCode(HttpStatus.OK)
    shareImage(
        @Body() shareImageDto:ShareImageDto
    ){
        return this.shareImageUseCase.execute(shareImageDto)
    }


    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('remix/:imageSharedId')
    @HttpCode(HttpStatus.OK)
    createRemix(
        @Param() createRemixImageDto:CreateRemixImageDto
    ){
        return this.createRemixImageUseCase.execute(createRemixImageDto)
    }


    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Post('generations')
    @HttpCode(HttpStatus.OK)
    async generateImage(
        @Body() generateImageDto:GenerateImageDto
    ){
        const job = await this.imageQueue.add('generate-image', 
            generateImageDto,
            {
                removeOnComplete: false, // o true si también quieres limpiar los completados
                removeOnFail: true,      // 🔹 elimina el job de Redis si falla
            },
        )
        return{
            jobId:job.id,
            status:'processing',
            message:'Image generation started'
        }
    }

}