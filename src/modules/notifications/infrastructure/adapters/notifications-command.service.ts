import { HttpStatus, Injectable } from '@nestjs/common';

import { NotificationsRepository } from 'src/modules/notifications/domain/repositories/notifications.repository';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MokkaError } from 'src/shared/errors/mokka.error';
import { PinoLogger } from 'nestjs-pino';
import { ErrorPlatformMokka } from 'src/shared/infrastructure/enums/error-detail-types';

import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationDocument } from '../schemas/notification.schema';
import { SavedNotificationVO } from '../../domain/value-objects/saved-notification.vo';

@Injectable()
export class NotificationsCommandService implements NotificationsRepository {
  constructor(
    @InjectModel('Notification')private readonly notificationModel: Model<NotificationDocument>,
    private readonly logger: PinoLogger,
  ) {}
  async saveNotification(vo:SavedNotificationVO): Promise<NotificationEntity> {
    try {
        const notification = new this.notificationModel({
            user:vo.user,
            title: vo.title,
            status: vo.status,
            notificationType: vo.notificationType,
            message: vo.message,
            details: vo.details,
            errorType: vo.errorType,
        })
        const savedNotification = await notification.save()
        return NotificationEntity.create({
            id: savedNotification._id.toString(),
            createdAt: savedNotification.createdAt,
            title: savedNotification.title,
            status: savedNotification.status,
            notificationType: savedNotification.notificationType,
            message: savedNotification.message,
            details: savedNotification.details,
            errorType: savedNotification.errorType,
        })
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to save notifications from database',
        //   userId: user,
        },
        'Failed to get notifications from database',
      );
      throw new MokkaError({
        message: 'Failed to save notifications from database',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to get notifications from database',
      });
    }
  }
}
