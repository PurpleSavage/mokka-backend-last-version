import { NotificationEntity } from "src/shared/notifications/domain/entities/notification.entity"
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type"


export class SocketReadyResponseDto<T> {
    private constructor(
        private readonly jobId: string,
        private readonly notificationType: JobsNotificationsType,
        private readonly notification: NotificationEntity,
        private readonly entity: T,
        private readonly creditsUpdated: number
    ) {}

    static create<T>(data: {
        jobId: string,
        notificationType: JobsNotificationsType,
        notification: NotificationEntity,
        entity: T,
        creditsUpdated: number
    }): SocketReadyResponseDto<T> {
        return new SocketReadyResponseDto(
            data.jobId,
            data.notificationType,
            data.notification,
            data.entity,
            data.creditsUpdated
        )
    }

    getJobId() { return this.jobId }
    getNotificationType() { return this.notificationType }
    getNotification() { return this.notification }
    getEntity(): T { return this.entity }
    getCreditsUpdated() { return this.creditsUpdated }
}