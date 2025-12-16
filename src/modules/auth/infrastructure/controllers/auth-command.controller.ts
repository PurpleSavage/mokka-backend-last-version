import { Body, Controller, Post, Res } from "@nestjs/common";

import { FastifyReply } from 'fastify';
import { LoginWithCredentialsDto } from "../../application/dtos/login-with-credentials.dto";
import { CreateAccountWithCredentialsUseCase } from "../../application/use-cases/create-account-with-credemtails.use-case";


@Controller({
  path:'auth/write',
  version:'1'
})
export class AuthCommandController{
    constructor(
      private readonly createAccountWithCredentialsUseCase:CreateAccountWithCredentialsUseCase
    ){}

    @Post('user/new')
    async createAccountWithCredentials(
      @Body() createDto: LoginWithCredentialsDto,
      @Res({ passthrough: true }) res: FastifyReply
    ){
      const session = await this.createAccountWithCredentialsUseCase.execute(createDto)
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
}