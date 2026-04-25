import { HttpStatus } from "@nestjs/common";
import { ErrorPlatformMokka } from "../common/infrastructure/enums/error-detail-types";
import { AppBaseError } from "./base.error";

export class CreditBalanceError extends AppBaseError {
  constructor(message: string = 'Not enough credits for this action.', details?: string) {
    super(
      message,
      ErrorPlatformMokka.CREDITS_ERROR, 
      HttpStatus.PAYMENT_REQUIRED,
      details || 'INSUFFICIENT_CREDITS'
    );
  }
}