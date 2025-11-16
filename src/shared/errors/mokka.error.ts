import { ErrorPlatformMokka } from '../infrastructure/enums/error-detail-types';
import { AppBaseError } from './base.error';
import { HttpStatus } from '@nestjs/common';

export class MokkaError extends AppBaseError {
  constructor(message: string, details?: string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, ErrorPlatformMokka.MOKKA_ERROR, status, details);
  }
}