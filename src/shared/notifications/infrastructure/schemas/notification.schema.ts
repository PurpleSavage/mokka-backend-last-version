import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument} from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { JobsNotificationsType } from 'src/shared/notifications/domain/enums/jons-notifications-type';
import { ErrorPlatformMokka } from 'src/shared/common/infrastructure/enums/error-detail-types';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';

export type NotificationDocument = HydratedDocument<Notification>

@Schema()
export class Notification {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({required:true,type: String})
    title:string

    @Prop({required:true, enum:StatusQueue,type: String})
    status:StatusQueue

    @Prop({required:true, enum:JobsNotificationsType,type: String})
    notificationType:JobsNotificationsType

    @Prop({required:false,type: String})
    message?: string

    @Prop({required:false,type: String})
    details?: string

    @Prop({required:false, enum:ErrorPlatformMokka,type: String})
    errorType?: ErrorPlatformMokka

    @Prop({ type: Boolean, default: false, })
    isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.set('timestamps', true);