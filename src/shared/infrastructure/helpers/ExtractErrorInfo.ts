import { HttpStatus } from "@nestjs/common";
import { StatusQueue } from "../enums/status-queue";
import { AppBaseError } from "src/shared/errors/base.error";
import { ErrorPlatformMokka } from "../enums/error-detail-types";

export interface AudioErrorNotification {
    jobId: string;
    status: StatusQueue;
    error: string;
    statusCode: HttpStatus | number;
    errorType: ErrorPlatformMokka;
    timestamp: Date;
    details?: string;
}
export class ExtractErrorInfo{
    static extract(error: unknown, jobId: string):AudioErrorNotification{
        const timestamp = new Date()
        if (error instanceof AppBaseError) {
            return {
                jobId,
                status: StatusQueue.FAILED,
                error: error.message,
                statusCode: error.getStatus(),
                errorType: error.errorType,
                timestamp,
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
                timestamp,
                details: error.stack
            };
        }
        return {
            jobId,
            status: StatusQueue.FAILED,
            error: 'Unexpected error occurred to generate audio',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            errorType: ErrorPlatformMokka.UNKNOWN_ERROR,
            timestamp,
            details: String(error)
        }
    }
}