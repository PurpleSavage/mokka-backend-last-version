import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { JobsNotificationsType } from "../../../../shared/notifications/domain/enums/jons-notifications-type";
import { StatusReplicateType } from "src/shared/common/infrastructure/enums/status-replicate";


export class SavedNotificationVO{
    constructor(
        public readonly user: string,
        public readonly title: string,
        public readonly status: StatusQueue | StatusReplicateType,
        public readonly notificationType: JobsNotificationsType,
        public readonly message?: string,
        public readonly details?: string,
        public readonly errorType?: ErrorPlatformMokka
    ){}
    static create(
        data:{
            user: string;
            title: string;
            status: StatusQueue | StatusReplicateType;
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