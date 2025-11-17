import { ErrorPlatformMokka } from '../infrastructure/enums/error-detail-types';
import { AppBaseError } from './base.error';
import { HttpStatus } from '@nestjs/common';

export class AudioGeneratorError extends AppBaseError {
  constructor(config: {
    message: string
    details?: string
    status?: HttpStatus
  }) {
    super(
      config.message,
      ErrorPlatformMokka.ELEVENLABS_ERROR,
      config.status ?? HttpStatus.BAD_GATEWAY,
      config.details
    )
  }
}