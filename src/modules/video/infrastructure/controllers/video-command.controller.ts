import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Queue } from "bullmq";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";

import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { GenerateVideoDto } from "../../application/dtos/generate-video.dto";


@Controller({
    path:'video/write',
    version:'1'
})
export class VideoCommandController{
    constructor(
        @InjectQueue('video-queue') private imageQueue: Queue,
        @InjectQueue('remix-video-queue') private remixVideoQueue: Queue,
    ){}
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @UseGuards(CreditsGuard)
    @RequiresCredits(30)
    @Post('generations')
    @HttpCode(HttpStatus.OK)
    async generateVideo(
        @Body() generateVideoDto:GenerateVideoDto
    ){
        const job = await this.imageQueue.add('generate-video', 
            generateVideoDto,
            {
                removeOnComplete: false, // o true si también quieres limpiar los completados
                removeOnFail: true,      // 🔹 elimina el job de Redis si falla
            },
        )
        return{
            jobId:job.id,
            status:StatusQueue.PROCESSING,
            message:'Video generation started'
        }
    }

}