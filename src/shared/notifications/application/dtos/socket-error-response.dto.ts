import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types"
import { NotificationEntity } from "../../domain/entities/notification.entity"
import { JobsNotificationsType } from "../../domain/enums/jons-notifications-type"
import { HttpStatus } from "@nestjs/common"

export class SocketErrorResponseDto {
    private constructor(
        private readonly jobId: string,
        private readonly notificationType: JobsNotificationsType,
        private readonly notification: NotificationEntity,
        private readonly error: string,
        private readonly errorType: ErrorPlatformMokka,
        private readonly statusCode: HttpStatus | number, 
        private readonly details?: string                   
    ) {}

    static create(data: {
        jobId: string,
        notificationType: JobsNotificationsType,
        notification: NotificationEntity,
        error: string,
        errorType: ErrorPlatformMokka,
        statusCode: HttpStatus | number,  
        details?: string                   
    }): SocketErrorResponseDto {
        return new SocketErrorResponseDto(
            data.jobId,
            data.notificationType,
            data.notification,
            data.error,
            data.errorType,
            data.statusCode,
            data.details
        )
    }

    getJobId() { return this.jobId }
    getNotificationType() { return this.notificationType }
    getNotification() { return this.notification }
    getError() { return this.error }
    getErrorType() { return this.errorType }
    getStatusCode() { return this.statusCode }
    getDetails() { return this.details }
}