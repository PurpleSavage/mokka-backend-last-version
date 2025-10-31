import { Body, Controller,Get,HttpCode,HttpStatus,Post, Req, Res, UseGuards } from "@nestjs/common";
import { LoginWithCredentialsUseCase } from "./application/use-cases/login-crendetials.use-case";
import { LoginWithGoogleUseCase } from "./application/use-cases/login-with-google.use-case";
import { LoginWithCredentialsDto } from "./application/dtos/login-with-credentials.dto";
import { FastifyReply } from 'fastify';
import { LoginWithGoogleDto } from "./application/dtos/login-with-google.dto";
import { RefreshTokenUseCase } from "./application/use-cases/refresh-token.use-case";
import { RefreshtokenGuard, RequestWithUser } from "src/guards/tokens/refresh-token.guard";
import { RefreshTokenDto } from "./application/dtos/refresh-token.dto";
import { GetProfileUseCase } from "./application/use-cases/get-profile.use-case";
@Controller({
  path:'auth/read',
  version:'1'
})
export class AuthQueryController{
  constructor(
    private readonly loginWithCrentialsUseCase:LoginWithCredentialsUseCase,
    private readonly loginWithGoogleUseCase:LoginWithGoogleUseCase,
    private readonly refreshTokenUseCase:RefreshTokenUseCase,
    private readonly getProfileUseCase:GetProfileUseCase
  ){}

  @Post('login/credentials')
  async loginWithCredentials(
    @Body() loginDto: LoginWithCredentialsDto,
    @Res({ passthrough: true }) res: FastifyReply
  ){
    const session = await this.loginWithCrentialsUseCase.execute(loginDto)
    const {access_token,user}=session
    const {refresh_token,...userWithOutRefreshToken}= user
    res.setCookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,  //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 48,
    })
    return {
      access_token,
      user:userWithOutRefreshToken
    }
  }
  @Post('login/google')
  async loginWithGoogle(
    @Body() loginGoogleDto: LoginWithGoogleDto,
    @Res({ passthrough: true }) res: FastifyReply
  ){
    const session = await this.loginWithGoogleUseCase.execute(loginGoogleDto)
    const {access_token,user}=session
    const {refresh_token,...userWithOutRefreshToken}= user
    res.setCookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,  //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 48,
    })
    return {
      access_token,
      user:userWithOutRefreshToken
    }
  }



  @UseGuards(RefreshtokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  getNewtoken(
    @Body() refreshtokenDto:RefreshTokenDto
  ){
    return this.refreshTokenUseCase.execute(refreshtokenDto)
  }

  @UseGuards(RefreshtokenGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @Req() req: RequestWithUser
  ){
    const email = req.userEmail?.email;
    return await this.getProfileUseCase.execute(email!)
  }
}