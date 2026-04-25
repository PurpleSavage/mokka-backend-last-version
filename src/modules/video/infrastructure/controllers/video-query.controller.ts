import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListVideosDto } from "../../application/dtos/response/list-videos.dto";
import { ListVideosUseCase } from "../../application/use-cases/list-video.use-case";
import { ListResourcesDto } from "src/shared/common/application/dtos/request/list-resources.dto";
import { ListSharedVideosUseCase } from "../../application/use-cases/list-shared-video.use-case";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('Videos - Queries')
@ApiBearerAuth()
@Controller({
    path:'video/read',
    version:'1'
})
export class VideoQueryController{
    constructor(
        private readonly listVideosUseCase:ListVideosUseCase,
        private readonly listSharedVideosUseCase:ListSharedVideosUseCase
    ){}

    @ApiOperation({ 
        summary: 'Listar galería de videos del usuario', 
        description: 'Recupera todos los videos generados por un usuario específico usando su ID de MongoDB.' 
    })
    @ApiParam({ 
        name: 'user', 
        description: 'ObjectID de MongoDB del usuario', 
        example: '65f1a2b3c4d5e6f7a8b9c0d1' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de videos obtenida correctamente.',
        schema: {
        example: [
            { 
            id: '6628aa67c7c7ed3765faf002', 
            url: 'https://cdn.mokka.ai/video1.mp4', 
            prompt: 'Futuristic city', 
            aspectRatio: '16:9' 
            }
        ]
        }
    })
    @ApiResponse({ status: 401, description: 'Token no válido o expirado.' })    
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard) 
    @Get('videos/:user')
    @HttpCode(HttpStatus.OK)
    listVideosByUserId(
        @Param() dto:ListVideosDto
    ){
        return this.listVideosUseCase.execute(dto.user)
    }


    @ApiOperation({ 
        summary: 'Listar videos de la comunidad', 
        description: 'Obtiene el feed global de videos compartidos con soporte para paginación.' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Feed de videos obtenido exitosamente.',
        // Scalar detectará automáticamente los campos de ListResourcesDto (page, limit)
    })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard) 
    @Get('shared-videos')
    @HttpCode(HttpStatus.OK)
    listSharedVideos(
        @Query() dto: ListResourcesDto
    ){
        return this.listSharedVideosUseCase.execute(dto)
    }   
}