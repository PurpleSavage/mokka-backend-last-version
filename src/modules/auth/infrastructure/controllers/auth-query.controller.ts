import { Body, Controller,Get,HttpCode,HttpStatus, Param, Req, UseGuards } from "@nestjs/common";
import { RefreshtokenGuard, RequestWithUser } from "src/guards/tokens/refresh-token.guard";
import { GetProfileUseCase } from "../../application/use-cases/get-profile.use-case";
import { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.use-case";
import { RefreshTokenDto } from "../../application/dtos/refresh-token.dto";


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
    return await this.getProfileUseCase.execute(email!)
  }

  @UseGuards(RefreshtokenGuard)
    @HttpCode(HttpStatus.OK)
    @Get('refresh-token/:email')
    getNewtoken(
        @Param() refreshtokenDto:RefreshTokenDto
    ){
        return this.refreshTokenUseCase.execute(refreshtokenDto)
    }
}