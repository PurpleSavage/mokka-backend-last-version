import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { JobsNotificationsType } from "../enums/jons-notifications-type";


export class SavedNotificationVO{
    constructor(
        public readonly user: string,
        public readonly title: string,
        public readonly status: StatusQueue,
        public readonly notificationType: JobsNotificationsType,
        public readonly message?: string,
        public readonly details?: string,
        public readonly errorType?: ErrorPlatformMokka
    ){}
    static create(
        data:{
            user: string;
            title: string;
            status: StatusQueue;
            notificationType: JobsNotificationsType;
            message?: string;
            details?: string;
            errorType?: ErrorPlatformMokka;
        }
    ):SavedNotificationVO{
        return new SavedNotificationVO(
            data.user,
            data.title,
            data.status,
            data.notificationType,
            data.message,
            data.details,
            data.errorType
        )
    }
}