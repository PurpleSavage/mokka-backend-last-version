import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UpdateDownloadsSharedImageUseCase } from "./application/use-cases/update-downloads-shared-image.use-case";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { UpdateDownloadsSharedImageDto } from "./application/dtos/update-downloads-image.dto";
import { ShareImageUseCase } from "./application/use-cases/shared-image.use-case";
import { ShareImageDto } from "./application/dtos/share-image.dto";
import { CreateRemixImageDto } from "./application/dtos/create-remix-image.dto";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { GenerateImageDto } from "./application/dtos/generate-image.dto";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";

@Controller({
    path:'image/read',
    version:"1"
})
export class ImageCommandController{
    constructor(
        @InjectQueue('image-queue') private imageQueue: Queue,
        @InjectQueue('remix-image-queue') private remixImageQueue: Queue,
        private readonly updateDownloadsSharedImageUseCase:UpdateDownloadsSharedImageUseCase,
        private readonly shareImageUseCase:ShareImageUseCase,
    ){}
    
    @Patch('community-image/:sharedImage')
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
    @UseGuards(CreditsGuard)
    @RequiresCredits(20)
    @Post('remix/:imageSharedId')
    @HttpCode(HttpStatus.OK)
    async createRemix(
        @Body() createRemixImageDto:CreateRemixImageDto //falta ponerlo en la cola
    ){
        const job = await this.remixImageQueue.add('remix-image', 
            createRemixImageDto,
            {
                removeOnComplete: false, // o true si también quieres limpiar los completados
                removeOnFail: true,      // 🔹 elimina el job de Redis si falla
            },
        )
        return{
            jobId:job.id,
            status:StatusQueue.PROCESSING,
            message:'Image generation started'
        }
    }


    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @UseGuards(CreditsGuard)
    @RequiresCredits(30)
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
            status:StatusQueue.PROCESSING,
            message:'Image generation started'
        }
    }

}