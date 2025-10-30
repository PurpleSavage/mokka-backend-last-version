import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  UnauthorizedException, 
  InternalServerErrorException
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtPort } from 'src/shared/application/ports/jwt.port';

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
        message:'No token provided or invalid bearer token',
        statusCode:401,
        credentials:false
      });
    }

    try {
      const payload = await this.jwtAuthService.validateToken<{ email: string }>(token);
      
      if (!payload) {
        throw new UnauthorizedException({
          message:'Invalid or expired token',
          statusCode:401,
          renovate: false,
        });
      }

      // Agregar el payload al request
      request.userEmail = payload;
       console.log('guard del refresh-token',request.userEmail)
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // ← Preserva renovate: true
      }
      throw new InternalServerErrorException('Unexpected error');
    } 
  }
}