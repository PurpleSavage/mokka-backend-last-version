import { HttpStatus } from "@nestjs/common";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";

export interface ErrorNotification{
    jobId: string;
    status: StatusQueue;
    error: string;
    statusCode: HttpStatus | number;
    errorType: ErrorPlatformMokka;
    timestamp: Date;
    details?: string;
}