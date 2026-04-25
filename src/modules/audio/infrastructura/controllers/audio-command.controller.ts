import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";

import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { GenerateAudioDto } from "../../application/dtos/generate-audio.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Audios - Commands')
@Controller({
  path:'audio/write',
  version:'1'
})
export class AudioCommandController{
  constructor(
    @InjectQueue('audio-queue') private audioQueue: Queue,
  ){}

  @ApiOperation({ 
    summary: 'Iniciar generación de audio',
    description: 'Encola un trabajo de generación. Requiere 30 créditos en la cuenta del usuario.'
  })
  @ApiBody({ type: GenerateAudioDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Trabajo encolado exitosamente',
    schema: {
      example: {
        jobId: '123',
        status: 'processing',
        message: 'Audio generation started'
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