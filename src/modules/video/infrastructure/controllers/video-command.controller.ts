import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { Queue } from "bullmq";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { GenerateVideoDto } from "../../application/dtos/request/generate-video.dto";
import { ShareVideoUseCase } from "../../application/use-cases/share-video.use-case";
import { ShareVideoDto } from "../../application/dtos/request/share-video.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('Videos - Commands')
@ApiBearerAuth()
@Controller({
    path:'video/write',
    version:'1'
})
export class VideoCommandController{
    constructor(
        @InjectQueue('video-queue') private imageQueue: Queue,
        private readonly shareVideoUseCase:ShareVideoUseCase
        //@InjectQueue('remix-video-queue') private remixVideoQueue: Queue,
    ){}

    @ApiOperation({ 
        summary: 'Iniciar generación de video', 
        description: 'Encola un trabajo de generación de video con IA (Veo/Replicate). Requiere 30 créditos.' 
    })
    @ApiBody({ type: GenerateVideoDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Trabajo de video encolado exitosamente.',
        schema: {
        example: {
            jobId: 'vid-123',
            status: 'processing',
            message: 'Video generation started'
        }
        }
    })
    @ApiResponse({ 
        status: 402, 
        description: 'Créditos insuficientes.',
        schema: {
        example: {
            message: 'Required: 30, Current: 15',
            errorType: 'MOKKA_ERROR',
            status: 402,
            timestamp: '2026-04-25T14:30:00Z',
            details: 'INSUFFICIENT_CREDITS'
        }
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard, CreditsGuard)
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


    @ApiOperation({ 
        summary: 'Compartir video en comunidad', 
        description: 'Publica un video generado en el feed global de Mokka AI.' 
    })
    @ApiBody({ type: ShareVideoDto })
    @ApiResponse({ status: 200, description: 'Video compartido correctamente.' })
    @ApiResponse({ status: 404, description: 'Video no encontrado.' })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @RequiresCredits(30)
    @Post('share')
    @HttpCode(HttpStatus.OK)
    shareVideo(
        @Body() dto:ShareVideoDto
    ){
        return this.shareVideoUseCase.execute(dto)
    }
}