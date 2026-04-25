import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AccesstokenGuard } from "src/guards/tokens/access-token.guard";
import { ListAudiosDto } from "../../application/dtos/list-audios.dto";
import { ListAudiosUseCase } from "../../application/use-cases/list-audios.use-case";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('Audios - Queries')
@ApiBearerAuth()
@Controller({
    path:'audio/read',
    version:'1'
})
export class AudioQueryController{
    constructor(
        private readonly listAudiosUseCase:ListAudiosUseCase
    ){}
    
    @ApiOperation({ 
        summary: 'Listar audios por usuario', 
        description: 'Obtiene una lista de todos los audios generados por un ID de usuario específico.' 
    })
    @ApiResponse({ status: 200, description: 'Lista devuelta con éxito.' })
    @ApiResponse({ status: 401, description: 'No autorizado (Token inválido o ausente).' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })

    
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseGuards(AccesstokenGuard)
    @Get('audios/:user')
    @HttpCode(HttpStatus.OK)
    async listAudios(
        @Param() listAudiosDto:ListAudiosDto
    ){
        return await this.listAudiosUseCase.execute(listAudiosDto)
    }
}