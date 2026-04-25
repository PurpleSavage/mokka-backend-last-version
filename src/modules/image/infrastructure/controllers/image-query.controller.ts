import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";

import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListSharedImageUseCase } from "../../application/use-cases/list-shared-image.use-case";
import { ListImagesUseCase } from "../../application/use-cases/list-images.use-case";
import { ListImagesDto } from "../../application/dtos/request/list-images.dto";
import { ListImagesLastWeekUseCase } from "../../application/use-cases/list-images-last-week.use-case";
import { ListResourcesDto } from "src/shared/common/application/dtos/request/list-resources.dto";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Images - Queries')
@ApiBearerAuth()
@Controller({
    path:'image/read',
    version:"1"
})
export class ImageQueryController{
    constructor(
        private readonly listSharedImageUseCase:ListSharedImageUseCase,
        private readonly listImagesUseCase:ListImagesUseCase,
        private readonly listImagesLastWeekUseCase: ListImagesLastWeekUseCase
    ){}


    @ApiOperation({ 
        summary: 'Listar galería privada del usuario', 
        description: 'Recupera todas las imágenes generadas por un usuario específico.' 
    })
    @ApiParam({ 
        name: 'user', 
        description: 'ID de MongoDB del usuario', 
        example: '65f1a2b3c4d5e6f7a8b9c0d1' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Galería recuperada exitosamente.',
        schema: {
        example: [
            { id: '6628aa...', url: 'https://...', prompt: 'Space cat', createdAt: '2026-04-25' }
        ]
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado - Token faltante o inválido.' })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('images/:user')
    @HttpCode(HttpStatus.OK)
    listImages(
        @Param() listImagesDto:ListImagesDto
    ){
        return this.listImagesUseCase.execute(listImagesDto)
    }





    @ApiOperation({ 
        summary: 'Listar imágenes de la comunidad', 
        description: 'Obtiene el feed global de imágenes compartidas con soporte para paginación.' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Feed de la comunidad obtenido.',
        // Aquí Scalar usará automáticamente el ListResourcesDto para mostrar los Query Params (?page=1)
    })
    @Throttle({ default: { limit: 400, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('shared')
    @HttpCode(HttpStatus.OK)
    listSharedImages(
        @Query() listSharedImageDto:ListResourcesDto
    ){
        return this.listSharedImageUseCase.execute(listSharedImageDto)  
    }



    @ApiOperation({ 
        summary: 'Listar actividad reciente (Última semana)', 
        description: 'Filtra las imágenes del usuario generadas únicamente en los últimos 7 días.' 
    })
    @ApiParam({ 
        name: 'user', 
        description: 'ID de MongoDB del usuario', 
        example: '65f1a2b3c4d5e6f7a8b9c0d1' 
    })
    @ApiResponse({ status: 200, description: 'Imágenes recientes obtenidas correctamente.' })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('last-images/:user')
    @HttpCode(HttpStatus.OK)
    listImagesLastWeek(
        @Param() listImagesDto:ListImagesDto
    ){
        return this.listImagesLastWeekUseCase.execute(listImagesDto.user)
    }

}