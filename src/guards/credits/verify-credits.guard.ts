import { CanActivate, ExecutionContext, Injectable, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthPort } from 'src/modules/auth/application/ports/auth.port';
import { FastifyRequest } from 'fastify';
import { MokkaError } from 'src/shared/errors/mokka.error';
import { ErrorPlatformMokka } from 'src/shared/common/infrastructure/enums/error-detail-types';
import { CreditBalanceError } from 'src/shared/errors/credit-balance.error';

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
      throw new MokkaError({
        message: 'User information not found in request.',
        errorType: ErrorPlatformMokka.MOKKA_UNAUTHORIZED,
        status: HttpStatus.UNAUTHORIZED
      });
    }

    const userFromDb = await this.authQueryService.findUserByEmail(user.email);

    if (!userFromDb) {
      throw new MokkaError({
        message: 'User does not exist in our database.',
        errorType: ErrorPlatformMokka.NOT_FOUND,
        status: HttpStatus.NOT_FOUND
      });
    }

    if (userFromDb.credits < requiredCredits) {
      throw new CreditBalanceError(
        `Required: ${requiredCredits}, Current: ${userFromDb.credits}`,
        'INSUFFICIENT_CREDITS'
      );
    }

    return true;
  }
}