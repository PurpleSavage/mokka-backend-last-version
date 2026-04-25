import { InjectQueue } from "@nestjs/bullmq"
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common"
import { Queue } from "bullmq"
import { RequiresCredits } from "src/decorators/requires-credits.decorator"
import { CreditsGuard } from "src/guards/credits/verify-credits.guard"
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard"
import { GenerateMusicDto } from "../../application/dtos/generate-music.dto"
import { Throttle } from "@nestjs/throttler"
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

@ApiTags('Music - Commands')
@Controller({
  path:'music/write',
  version:'1'
})
export class MusicCommandController{
  constructor(
    @InjectQueue('music-queue') private musicQueue: Queue,
  ){}

  @ApiOperation({ 
    summary: 'Generar música con IA', 
    description: 'Encola un proceso de creación musical. Requiere 30 créditos.' 
  })
  @ApiBody({ type: GenerateMusicDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Generación iniciada correctamente.',
    schema: {
      example: {
        jobId: 'music_job_99',
        status: 'processing',
        message: 'Music generation started'
      }
    }
  })
  @ApiResponse({ 
    status: 402, 
    description: 'Créditos insuficientes.',
    schema: {
      example: {
        message: 'Required: 30, Current: 12',
        errorType: 'MOKKA_ERROR',
        status: 402,
        timestamp: '2026-04-24T23:50:00Z',
        details: 'INSUFFICIENT_CREDITS'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token no válido o expirado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones (Rate Limit)' })

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