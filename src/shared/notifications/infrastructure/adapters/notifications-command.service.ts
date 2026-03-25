import { HttpStatus, Injectable } from '@nestjs/common';

import { NotificationsRepository } from 'src/shared/notifications/domain/repositories/notifications.repository';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MokkaError } from 'src/shared/errors/mokka.error';
import { PinoLogger } from 'nestjs-pino';
import { ErrorPlatformMokka } from 'src/shared/common/infrastructure/enums/error-detail-types';

import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationDocument } from '../schemas/notification.schema';
import { SavedNotificationVO } from '../../domain/value-objects/saved-notification.vo';
import { normalizeId } from 'src/shared/common/application/helpers/normalized-obj';

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
            user:normalizeId(savedNotification.user),
            isRead:notification.isRead,
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
        'Failed to save notifications from database',
      );
      throw new MokkaError({
        message: 'Failed to save notifications from database',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to get notifications from database',
      });
    }
  }
  async readNotification(notificationId: string): Promise<NotificationEntity> {
    try {
      const notification = await this.notificationModel.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }  // retorna el documento actualizado
      )

      if (!notification) throw new MokkaError({
        message: 'Notification not found',
        errorType: ErrorPlatformMokka.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
        details: 'Notification not found',
      })
      return NotificationEntity.create({
        id: notification._id.toString(),
        user: normalizeId(notification.user),
        createdAt: notification.createdAt,
        isRead: notification.isRead,
        title: notification.title,
        status: notification.status,
        notificationType: notification.notificationType,
        message: notification.message,
        details: notification.details,
        errorType: notification.errorType,
      })
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'The notification could not be marked as read.',
        //   userId: user,
        },
        'Failed to marked notification from database',
      );
      throw new MokkaError({
        message: 'The notification could not be marked as read.',
        errorType: ErrorPlatformMokka.DATABASE_FAILED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        details: 'Failed to marked notification from database',
      });
    }
  }
}
