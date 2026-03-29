import { InjectQueue } from "@nestjs/bullmq"
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common"
import { Queue } from "bullmq"
import { RequiresCredits } from "src/decorators/requires-credits.decorator"
import { CreditsGuard } from "src/guards/credits/verify-credits.guard"
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard"
import { GenerateMusicDto } from "../../application/dtos/generate-music.dto"
import { Throttle } from "@nestjs/throttler"
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue"

@Controller({
  path:'music/write',
  version:'1'
})
export class MusicCommandController{
  constructor(
    @InjectQueue('music-queue') private musicQueue: Queue,
  ){}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AccesstokenGuard, CreditsGuard)
  @RequiresCredits(30)
  @Post('generations')
  @HttpCode(HttpStatus.OK)
  async musicGeneration(
    @Body() generateMusicDto:GenerateMusicDto
  ){
    const job = await this.musicQueue.add('music-queue',
      generateMusicDto,
      {
        removeOnComplete: false, // o true si también quieres limpiar los completados
        removeOnFail: true,      // 🔹 elimina el job de Redis si falla
      },
    )
    return{
      jobId:job.id,
      status:StatusQueue.PROCESSING,
      message:'Music generation started'
    }
  }
}