import { ErrorPlatformMokka } from '../infrastructure/enums/error-detail-types';
import { AppBaseError } from './base.error';
import { HttpStatus } from '@nestjs/common';

export class MokkaError extends AppBaseError {
  constructor(config: {
    message: string
    errorType?: ErrorPlatformMokka
    status?: HttpStatus
    details?: string
  }) {
    super(
      config.message,
      config.errorType ?? ErrorPlatformMokka.MOKKA_ERROR,
      config.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      config.details
    )
  }
}