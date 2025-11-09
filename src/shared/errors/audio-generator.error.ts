import { AppBaseError } from './base.error';
import { HttpStatus } from '@nestjs/common';

export class AudioGeneratorError extends AppBaseError {
  constructor(message: string, details?: string, status: HttpStatus = HttpStatus.BAD_GATEWAY) {
    super(message, 'ELEVENLABS_ERROR', status, details);
  }
}