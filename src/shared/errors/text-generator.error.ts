import { HttpStatus } from "@nestjs/common";
import { AppBaseError } from "./base.error";
import { ErrorPlatformMokka, OpenAIErrorCode, OpenAIErrorTypes } from "../infrastructure/enums/error-detail-types";

export interface OpenAIErrorResponse {
  error: {
    message: string;
    type: string;
    param?: string | null;
    code?: string | null;
  };
}

export class TextGeneratorError extends AppBaseError {
  constructor(
    message: string,
    details: OpenAIErrorTypes,
    status: HttpStatus = HttpStatus.BAD_REQUEST
  ) {
    super(
      message,
      ErrorPlatformMokka.OPENAI_ERROR, // ✅ Usar la plataforma correcta
      status,
      details // ✅ Pasar el tipo de error como details
    );
  }

  static fromOpenAIResponse(errorData: OpenAIErrorResponse): TextGeneratorError {
    const { error } = errorData;
    const errorCode = error.code as OpenAIErrorCode;
    const errorMessage = error.message || 'OpenAI API error';
    const lowerMsg = errorMessage.toLowerCase();

    // 1. Detectar contenido inapropiado
    if (
      errorCode === OpenAIErrorCode.CONTENT_POLICY_VIOLATION ||
      lowerMsg.includes('safety system') ||
      lowerMsg.includes('content policy') ||
      lowerMsg.includes('inappropriate') ||
      lowerMsg.includes('not allowed by our safety system')
    ) {
      return new TextGeneratorError(
        errorMessage,
        OpenAIErrorTypes.NSFW,
        HttpStatus.BAD_REQUEST
      );
    }

    // 2. Mapear errores conocidos por código
    const errorMap: Partial<Record<OpenAIErrorCode, { type: OpenAIErrorTypes; status: HttpStatus }>> = {
      [OpenAIErrorCode.CONTEXT_LENGTH_EXCEEDED]: {
        type: OpenAIErrorTypes.CONTEXT_TOO_LONG,
        status: HttpStatus.BAD_REQUEST
      },
      [OpenAIErrorCode.RATE_LIMIT_EXCEEDED]: {
        type: OpenAIErrorTypes.RATE_LIMIT,
        status: HttpStatus.TOO_MANY_REQUESTS
      },
      [OpenAIErrorCode.INSUFFICIENT_QUOTA]: {
        type: OpenAIErrorTypes.QUOTA_EXCEEDED,
        status: HttpStatus.PAYMENT_REQUIRED
      },
      [OpenAIErrorCode.INVALID_API_KEY]: {
        type: OpenAIErrorTypes.INVALID_CREDENTIALS,
        status: HttpStatus.UNAUTHORIZED
      },
    };

    const mapped = errorMap[errorCode];

    if (mapped) {
      return new TextGeneratorError(
        errorMessage,
        mapped.type,
        mapped.status
      );
    }

    // 3. Detectar errores del servidor (500, 502, 503)
    if (
      error.type === 'server_error' ||
      errorCode === OpenAIErrorCode.SERVER_ERROR ||
      lowerMsg.includes('server error') ||
      lowerMsg.includes('bad gateway') ||
      lowerMsg.includes('service unavailable') ||
      lowerMsg.includes('internal server error')
    ) {
      return new TextGeneratorError(
        errorMessage,
        OpenAIErrorTypes.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // 4. Otros errores de request inválido
    if (error.type === 'invalid_request_error') {
      return new TextGeneratorError(
        errorMessage,
        OpenAIErrorTypes.INVALID_INPUT,
        HttpStatus.BAD_REQUEST
      );
    }

    // 5. Error desconocido
    return new TextGeneratorError(
      errorMessage,
      OpenAIErrorTypes.UNKNOWN_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}