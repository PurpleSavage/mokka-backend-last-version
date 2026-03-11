import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { NotificationsPort } from 'src/notifier/application/ports/notifications.port';
import { NotificationEntity } from 'src/notifier/domain/entities/notification.entity';
import { NotificationDocument } from '../schemas/notification.schema';
import { ErrorPlatformMokka } from 'src/shared/infrastructure/enums/error-detail-types';
import { MokkaError } from 'src/shared/errors/mokka.error';

@Injectable()
export class NotificationsQueryService implements NotificationsPort {
  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<NotificationDocument>,
    private readonly logger: PinoLogger,
  ) {}
  async listAllNotifications(user:string,page:number): Promise<NotificationEntity[]> {
    try {
        const limit = 20;
        const skip = (page - 1) * limit
        const allNotifications =  await this.notificationModel.find({ user })
        .sort({ createAt: -1 }) 
        .skip(skip)
        .limit(limit)
        .exec();
        return allNotifications.map(doc => NotificationEntity.create({
            id: doc._id.toString(),
            createdAt: doc.createdAt,
            title: doc.title,
            status: doc.status,
            notificationType: doc.notificationType,
            message: doc.message,
            details: doc.details,
            errorType: doc.errorType,
        }));
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to get notifications from database',
          userId: user,
        },
        'Failed to get notifications from database',
      );
      throw new MokkaError({
        message: 'Failed to get notifications from database',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to get notifications from database',
      });
    }
  }
}
