import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  UnauthorizedException, 
  InternalServerErrorException
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtPort } from 'src/shared/common/application/ports/jwt.port';
import { ErrorPlatformMokka } from 'src/shared/common/infrastructure/enums/error-detail-types';

export interface RequestWithUser extends FastifyRequest {
  userEmail?: {
    email: string;
  };
}
@Injectable()
export class RefreshtokenGuard implements CanActivate {
  constructor(private readonly jwtAuthService: JwtPort) {}
  
  private extractToken(request: RequestWithUser): string | null {
    const tokenFromCookie = request.cookies?.['refresh_token'];
    return tokenFromCookie || null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException({
        message: 'Session expired, please login again',
        errorType: ErrorPlatformMokka.MOKKA_UNAUTHORIZED,  // 👈 agrega esto
        statusCode: 401,
        renovate: false, 
      });
    }

    try {
      const payload = await this.jwtAuthService.validateToken<{ email: string }>(token);
      
      if (!payload) {
      
        throw new UnauthorizedException({
          message: 'Session expired, please login again',
          errorType: ErrorPlatformMokka.MOKKA_UNAUTHORIZED,  // 👈 agrega esto
          statusCode: 401,
          renovate: false, 
        });
      }

      // Agregar el payload al request
      request.userEmail = payload;
      
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // ← Preserva renovate: true
      }
      throw new InternalServerErrorException('Unexpected error');
    } 
  }
}