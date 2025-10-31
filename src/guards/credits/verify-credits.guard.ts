import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthPort } from 'src/modules/auth/application/ports/auth.port';
import { FastifyRequest } from 'fastify';

interface RequestWithUser extends FastifyRequest {
  userEmail?: {
    email: string;
  };
}

@Injectable()
export class CreditsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authQueryService: AuthPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredCredits = this.reflector.get<number>('credits', context.getHandler());
    if (!requiredCredits) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.userEmail

    if (!user || !user.email) {
      throw new HttpException(
        { error: 'INVALID_USER', message: 'User information not found in request.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userFromDb = await this.authQueryService.findUserByEmail(user.email);

    if (!userFromDb) {
      throw new HttpException(
        { error: 'USER_NOT_FOUND', message: 'User does not exist.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (userFromDb.credits < requiredCredits) {
      throw new HttpException(
        { error: 'INSUFFICIENT_CREDITS', message: 'Not enough credits for this action.' },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return true;
  }
}