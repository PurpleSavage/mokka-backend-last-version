import { Body, Controller,Get,HttpCode,HttpStatus,Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { RefreshtokenGuard, RequestWithUser } from "src/guards/tokens/refresh-token.guard";
import { GetProfileUseCase } from "../../application/use-cases/get-profile.use-case";
import { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.use-case";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";


@Controller({
  path:'auth/read',
  version:'1'
})
export class AuthQueryController{
  constructor(
    private readonly getProfileUseCase:GetProfileUseCase,
    private readonly refreshTokenUseCase:RefreshTokenUseCase,
  ){}

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