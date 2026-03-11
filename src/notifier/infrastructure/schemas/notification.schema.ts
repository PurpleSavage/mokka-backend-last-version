import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument} from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { JobsNotificationsType } from 'src/notifier/domain/enums/jons-notifications-type';
import { ErrorPlatformMokka } from 'src/shared/infrastructure/enums/error-detail-types';
import { StatusQueue } from 'src/shared/infrastructure/enums/status-queue';

export type NotificationDocument = HydratedDocument<Notification>

@Schema()
export class Notification {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({required:true})
    title:string

    @Prop({required:true, enum:StatusQueue})
    status:StatusQueue

    @Prop({required:true, enum:JobsNotificationsType})
    notificationType:JobsNotificationsType

    @Prop({required:false})
    message?: string

    @Prop({required:false})
    details?: string

    @Prop({required:true, enum:ErrorPlatformMokka})
    errorType?: ErrorPlatformMokka
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.set('timestamps', true);