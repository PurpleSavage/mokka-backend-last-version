import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { CreditsGuard } from "src/guards/credits/verify-credits.guard";
import { RequiresCredits } from "src/decorators/requires-credits.decorator";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { ShareImageUseCase } from "../../application/use-cases/shared-image.use-case";
import { UpdateDownloadsSharedImageUseCase } from "../../application/use-cases/update-downloads-shared-image.use-case";
import { UpdateDownloadsSharedImageDto } from "../../application/dtos/request/update-downloads-image.dto";
import { ShareImageDto } from "../../application/dtos/request/share-image.dto";
import { CreateRemixImageDto } from "../../application/dtos/request/create-remix-image.dto";
import { GenerateImageDto } from "../../application/dtos/request/generate-image.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Images - Commands')
@ApiBearerAuth()
@Controller({
    path:'image/write',
    version:"1"
})
export class ImageCommandController{
    constructor(
        @InjectQueue('image-queue') private imageQueue: Queue,
        @InjectQueue('remix-image-queue') private remixImageQueue: Queue,
        private readonly updateDownloadsSharedImageUseCase:UpdateDownloadsSharedImageUseCase,
        private readonly shareImageUseCase:ShareImageUseCase,
    ){}
    

    @ApiOperation({ 
        summary: 'Actualizar descargas de imagen comunitaria', 
        description: 'Incrementa el contador de descargas para una imagen específica de la comunidad.' 
    })
    @ApiParam({ name: 'sharedImage', description: 'ID de Mongo de la imagen compartida', example: '65f1a2b3c4d5e6f7a8b9c0d1' })
    @ApiResponse({ status: 200, description: 'Contador actualizado correctamente.' })
    @ApiResponse({ status: 401, description: 'Token no válido o expirado.' })
    @Patch('community-image/:sharedImage')
    @Throttle({ default: { limit: 400, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @HttpCode(HttpStatus.OK)
    udpateDownloadsSharedImage(
        @Param() updateDownloadsSharedImageDto:UpdateDownloadsSharedImageDto
    ){
        return this.updateDownloadsSharedImageUseCase.execute(updateDownloadsSharedImageDto)
    }



    @ApiOperation({ 
        summary: 'Compartir imagen en comunidad', 
        description: 'Hace que una imagen privada sea visible para todos los usuarios en el feed comunitario.' 
    })
    @ApiBody({ type: ShareImageDto })
    @ApiResponse({ status: 200, description: 'Imagen compartida exitosamente.' })
    @ApiResponse({ status: 404, description: 'Imagen no encontrada.' })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Post('share')
    @HttpCode(HttpStatus.OK)
    shareImage(
        @Body() shareImageDto:ShareImageDto
    ){
        return this.shareImageUseCase.execute(shareImageDto)
    }



    @ApiOperation({ 
        summary: 'Iniciar Remix de imagen', 
        description: 'Encola un trabajo para generar una nueva versión basada en una imagen existente. Requiere 20 créditos.' 
    })
    @ApiParam({ name: 'imageSharedId', description: 'ID de Mongo de la imagen original' })
    @ApiBody({ type: CreateRemixImageDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Trabajo de Remix encolado.',
        schema: {
        example: {
            jobId: 'remix-789',
            status: 'processing',
            message: 'Image generation started'
        }
        }
    })
    @ApiResponse({ 
        status: 402, 
        description: 'Créditos insuficientes.',
        schema: {
        example: {
            message: 'Required: 20, Current: 5',
            errorType: 'MOKKA_ERROR',
            status: 402,
            timestamp: '2026-04-25T12:00:00Z',
            details: 'INSUFFICIENT_CREDITS'
        }
        }
    })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard, CreditsGuard)
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



    @ApiOperation({ 
        summary: 'Iniciar generación de imagen', 
        description: 'Encola un trabajo de generación de imagen desde cero. Requiere 30 créditos.' 
    })
    @ApiBody({ type: GenerateImageDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Trabajo de generación encolado.',
        schema: {
        example: {
            jobId: 'gen-456',
            status: 'processing',
            message: 'Image generation started'
        }
        }
    })
    @ApiResponse({ 
        status: 402, 
        description: 'Créditos insuficientes.',
        schema: {
        example: {
            message: 'Required: 30, Current: 10',
            errorType: 'MOKKA_ERROR',
            status: 402,
            timestamp: '2026-04-25T12:05:00Z',
            details: 'INSUFFICIENT_CREDITS'
        }
        }
    })
    @ApiResponse({ status: 429, description: 'Demasiadas peticiones (Rate Limit)' })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard, CreditsGuard)
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