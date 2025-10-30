import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config' 
import { JwtService } from '@nestjs/jwt'; 
import { ExpirationValue, JwtPort } from 'src/shared/application/ports/jwt.port';

@Injectable()
export class JwtAuthService implements JwtPort {
  seed:string
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ){
    this.seed= this.configService.get<string>('JWT_SECRET')!
  }

  async generateToken(payload: object, duration: ExpirationValue = '2h'): Promise<string | null> {
    const options = {
        secret: this.seed,
        expiresIn: duration
      };
    try {
      const token = await this.jwtService.signAsync(payload,options)
      return token;
    } catch (err) {
      console.log('Error generating token:', err);
      return null;
    }
  }

  async validateToken<T extends object>(token: string): Promise<T | null> {
    const options = {
      secret: this.seed
    };
    try {

      const decoded = await this.jwtService.verifyAsync<T>(token,options);
      return decoded;
    } catch (err) {
      console.log('Error validating token:', err);
      return null;
    }
  }
}
