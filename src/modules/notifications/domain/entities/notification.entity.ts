import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types"
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { JobsNotificationsType } from "../enums/jons-notifications-type";



export class NotificationEntity{
    constructor(
        public readonly id: string,
        public readonly createdAt: Date,
        public readonly title: string,
        public readonly status: StatusQueue,
        public readonly notificationType: JobsNotificationsType,
        public readonly message?: string,
        public readonly details?: string,
        public readonly errorType?: ErrorPlatformMokka
    ){}
    /**
   * Método Factory para crear una instancia validada de la entidad.
   * Útil para mapear datos que vienen de una API o Base de Datos.
   */
  static create(data: {
    id: string;
    createdAt: Date;
    title: string;
    status: StatusQueue;
    notificationType: JobsNotificationsType;
    message?: string;
    details?: string;
    errorType?: ErrorPlatformMokka;
  }): NotificationEntity {
    
    return new NotificationEntity(
      data.id,
      data.createdAt,
      data.title,
      data.status,
      data.notificationType,
      data.message,
      data.details,
      data.errorType
    );
  }
}