import { Body, Controller, Post, Res } from '@nestjs/common';

import { FastifyReply } from 'fastify';
import { LoginWithCredentialsDto } from '../../application/dtos/login-with-credentials.dto';
import { CreateAccountWithCredentialsUseCase } from '../../application/use-cases/create-account-with-credemtails.use-case';
import { LoginWithGoogleDto } from '../../application/dtos/login-with-google.dto';
import { LoginWithGoogleUseCase } from '../../application/use-cases/login-with-google.use-case';
import { LoginWithCredentialsUseCase } from '../../application/use-cases/login-crendetials.use-case';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth - Commands')
@Controller({
  path: 'auth/write',
  version: '1',
})
export class AuthCommandController {
  constructor(
    private readonly createAccountWithCredentialsUseCase: CreateAccountWithCredentialsUseCase,
    private readonly loginWithCrentialsUseCase: LoginWithCredentialsUseCase,
    private readonly loginWithGoogleUseCase: LoginWithGoogleUseCase,
  ) {}



  @ApiOperation({ 
    summary: 'Registrar nueva cuenta', 
    description: 'Crea un usuario y establece una sesión. Devuelve el access_token y guarda el refresh_token en una cookie HTTPOnly.' 
  })
  @ApiBody({ type: LoginWithCredentialsDto })
  @ApiResponse({ status: 201, description: 'Cuenta creada y sesión iniciada.' })
  @ApiResponse({ status: 400, description: 'El correo ya está registrado o datos inválidos.' })
  @Post('user/new')
  async createAccountWithCredentials(
    @Body() createDto: LoginWithCredentialsDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const session =
      await this.createAccountWithCredentialsUseCase.execute(createDto);
    const { access_token, user } = session;
    const { refresh_token, ...userWithOutRefreshToken } = user;
    res.setCookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 48,
    });
    return {
      access_token,
      user: userWithOutRefreshToken,
    };
  }



  @ApiOperation({ 
    summary: 'Login con credenciales tradicionales', 
    description: 'Valida email/password y devuelve tokens de acceso.' 
  })
  @ApiBody({ type: LoginWithCredentialsDto })
  @ApiResponse({ status: 200, description: 'Login exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
  @Post('login/credentials')
  async loginWithCredentials(
    @Body() loginDto: LoginWithCredentialsDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const session = await this.loginWithCrentialsUseCase.execute(loginDto);
    const { access_token, user } = session;
    const { refresh_token, ...userWithOutRefreshToken } = user;
    res.setCookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 48,
    });
    return {
      access_token,
      user: userWithOutRefreshToken,
    };
  }



  @ApiOperation({ 
    summary: 'Login con Google', 
    description: 'Autentica al usuario mediante el idToken de Google.' 
  })
  @ApiBody({ type: LoginWithGoogleDto })
  @ApiResponse({ status: 200, description: 'Login con Google exitoso.' })
  @Post('login/google')
  async loginWithGoogle(
    @Body() loginGoogleDto: LoginWithGoogleDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const session = await this.loginWithGoogleUseCase.execute(loginGoogleDto);
    const { access_token, user } = session;
    const { refresh_token, ...userWithOutRefreshToken } = user;
    res.setCookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production'
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 48,
    });
    return {
      access_token,
      user: userWithOutRefreshToken,
    };
  }
}
