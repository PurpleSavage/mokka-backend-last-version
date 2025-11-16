import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorPlatformMokka } from '../infrastructure/enums/error-detail-types';

export class AppBaseError extends HttpException {
  public readonly errorType: ErrorPlatformMokka
  public readonly details?: string 
  constructor(
    message: string,
    errorType: ErrorPlatformMokka, // Ej: 'MOKKA_ERROR' | 'ELEVENLABS_ERROR' | 'REPLICATE_ERROR'
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: string,
  ) {
    super(
      {
        message,
        errorType,
        status,
        timestamp: new Date().toISOString(),
        details,
      },
      status,
    )
    {
      this.errorType = errorType;
      this.details = details;
    }
  }
}