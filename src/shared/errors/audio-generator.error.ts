import { ErrorPlatformMokka } from '../infrastructure/enums/error-detail-types';
import { AppBaseError } from './base.error';
import { HttpStatus } from '@nestjs/common';

export class AudioGeneratorError extends AppBaseError {
  constructor(message: string, details?: string, status: HttpStatus = HttpStatus.BAD_GATEWAY) {
    super(message, ErrorPlatformMokka.ELEVENLABS_ERROR
      , status, details);
  }
}