import { HttpStatus } from "@nestjs/common";
import { AppBaseError } from "src/shared/errors/base.error";
import { StatusQueue } from "../enums/status-queue";
import { ErrorPlatformMokka } from "../enums/error-detail-types";
import { ErrorNotification } from "src/shared/notifications/infrastructure/errors/types/error-notification";


export class ExtractErrorInfo{
    static extract(error: unknown, jobId: string):ErrorNotification{
        if (error instanceof AppBaseError) {
            return {
                jobId,
                status: StatusQueue.FAILED,
                error: error.message,
                statusCode: error.getStatus(),
                errorType: error.errorType,
                details: error.details
            };
        
        }
        if (error instanceof Error) {
            return {
                jobId,
                status: StatusQueue.FAILED,
                error: error.message,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errorType: ErrorPlatformMokka.MOKKA_ERROR,
                details: error.stack
            };
        }
        return {
            jobId,
            status: StatusQueue.FAILED,
            error: 'Unexpected error occurred to generate audio',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            errorType: ErrorPlatformMokka.UNKNOWN_ERROR,
            details: String(error)
        }
    }
}