import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { GenerateAudioDto } from "./application/dtos/generate-audio.dto";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";

@Controller({
  path:'audio/write',
  version:'1'
})
export class AudioCommandController{
  constructor(
    @InjectQueue('audio-queue') private audioQueue: Queue,
  ){}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AccesstokenGuard)
  @UseGuards(CreditsGuard)
  @RequiresCredits(30)
  @Post('generations')
  @HttpCode(HttpStatus.OK)
  async audioGeneration(
    @Body() generateAudioDto:GenerateAudioDto
  ){
    const job = await this.audioQueue.add('generate-audio',
      generateAudioDto,
      {
        removeOnComplete: false, // o true si también quieres limpiar los completados
        removeOnFail: true,      // 🔹 elimina el job de Redis si falla
      },
    )
    return{
      jobId:job.id,
      status:StatusQueue.PROCESSING,
      message:'Audio generation started'
    }
  }
}