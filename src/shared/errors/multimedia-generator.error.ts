import { HttpStatus } from "@nestjs/common";
import { AppBaseError } from "./base.error"
import { ErrorPlatformMokka, MultimediaErrorTypes, ReplicateErrorCode } from "../infrastructure/enums/error-detail-types";
import { MultimediaResponseDto } from "../infrastructure/dtos/multimedia-response.dt";


export class MultimediaGeneratorError extends AppBaseError { 
   
    constructor(
        message: string, 
        details: MultimediaErrorTypes, 
        status: HttpStatus = HttpStatus.BAD_REQUEST
    ) {
        super(message,ErrorPlatformMokka.REPLICATE_ERROR, status, details)
    }

    static fromReplicateResponse(errorData: MultimediaResponseDto): MultimediaGeneratorError {

        const rawError = errorData.error ?? "";

  
        const [codePart, messagePart] = rawError.split(':')

        const codeError = (codePart ?? '').trim() as ReplicateErrorCode
        const errorMessage = (messagePart ?? '').trim()

        const lowerMsg = rawError.toLowerCase();
        if (
            lowerMsg.includes("nsfw") ||
            lowerMsg.includes("inappropriate") ||
            lowerMsg.includes("sexual") ||
            lowerMsg.includes("unsafe content") ||
            lowerMsg.includes("content policy")
        ) {
            return new MultimediaGeneratorError(
                errorMessage || "Inappropriate content",
                MultimediaErrorTypes.NSFW,
                HttpStatus.BAD_REQUEST
            );
        }
        let mapped: MultimediaErrorTypes;

        switch(codeError){

            case ReplicateErrorCode.OUT_OF_MEMORY:
                mapped = MultimediaErrorTypes.OUT_OF_MEMORY;
                break;

            case ReplicateErrorCode.TIMEOUT_STARTING:
            case ReplicateErrorCode.STOPPED_NON_TERMINAL:
                mapped = MultimediaErrorTypes.TIMEOUT;
                break;

            case ReplicateErrorCode.UPLOAD_FAILED:
                mapped = MultimediaErrorTypes.FILE_UPLOAD_FAILED;
                break;

            case ReplicateErrorCode.WEBHOOK_URL_EMPTY:
                mapped = MultimediaErrorTypes.INVALID_INPUT;
                break;

            case ReplicateErrorCode.ERROR_STARTING:
            case ReplicateErrorCode.HEALTH_CHECK_FAILED:
            case ReplicateErrorCode.UNKNOWN_ERROR:
            default:
                mapped = MultimediaErrorTypes.PREDICTION_FAILED;
                break;
        }

        return new MultimediaGeneratorError(
            errorMessage || "Replicate error",
            mapped,
            HttpStatus.BAD_REQUEST
        )
        }
}
