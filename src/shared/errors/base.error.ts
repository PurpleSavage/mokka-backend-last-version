import { HttpException, HttpStatus } from '@nestjs/common';

export class AppBaseError extends HttpException {
  public readonly errorType: string
  public readonly details?: string 
  constructor(
    message: string,
    errorType: string, // Ej: 'MOKKA_ERROR' | 'ELEVENLABS_ERROR' | 'REPLICATE_ERROR'
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