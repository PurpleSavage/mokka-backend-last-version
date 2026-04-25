import { Body, Controller,Get,HttpCode,HttpStatus,Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { RefreshtokenGuard, RequestWithUser } from "src/guards/tokens/refresh-token.guard";
import { GetProfileUseCase } from "../../application/use-cases/get-profile.use-case";
import { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.use-case";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";


@ApiTags('Auth - Queries')
@ApiBearerAuth()
@Controller({
  path:'auth/read',
  version:'1'
})
export class AuthQueryController{
  constructor(
    private readonly getProfileUseCase:GetProfileUseCase,
    private readonly refreshTokenUseCase:RefreshTokenUseCase,
  ){}


  @ApiOperation({ 
    summary: 'Obtener perfil del usuario', 
    description: 'Retorna la información básica del usuario y su balance actual de créditos.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil obtenido exitosamente.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1Ni...',
        user: {
          email: 'jeanpaul@mokka.ai',
          id: 'uuid-1234-5678',
          credits: 150,
          createDate: '2026-04-25T00:00:00Z'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Token de refresco inválido o expirado.' })
  @UseGuards(RefreshtokenGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @Req() req: RequestWithUser
  ){
    const email = req.userEmail?.email;
    const session = await this.getProfileUseCase.execute(email!)
    const {access_token,user}=session
   
    return {
      access_token,
      user:{
        email: user.email,
        id: user.id,
        credits: user.credits,
        createDate: user.createDate

      }
    }
  }


  @ApiOperation({ 
    summary: 'Refrescar token de acceso', 
    description: 'Genera un nuevo access_token utilizando el refresh_token válido de la sesión actual.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refrescado exitosamente.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1Ni...'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Sesión expirada.',
    schema: {
      example: {
        message: 'Session expired, please login again',
        errorType: 'MOKKA_UNAUTHORIZED',
        statusCode: 401,
        renovate: false
      }
    }
  })
  @UseGuards(RefreshtokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get('refresh-token')
  getNewtoken(
    @Req() req: RequestWithUser
  ){
      const email = req.userEmail?.email;
      if (!email) {
        throw new  UnauthorizedException({
                message: 'Session expired, please login again',
                errorType: ErrorPlatformMokka.MOKKA_UNAUTHORIZED,  
                statusCode: 401,
                renovate: false, 
        });
      }
      return this.refreshTokenUseCase.execute(email)
    }
}