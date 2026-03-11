import { Global, Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";
import { NotifierService } from "./infrastructure/sockets/notifier.service";
import { NotificationSchema } from "./infrastructure/schemas/notification.schema";
import { ListNotificationsUseCase } from "./application/use-cases/list-notifications.use-case";
import { NotifierGateway } from "./infrastructure/sockets/notifier.gateway";
import { SaveNotificationUseCase } from "./application/use-cases/save-notification.use-cae";
import { NotificationsPort } from "./application/ports/notifications.port";
import { NotificationsQueryService } from "./infrastructure/adapters/notifications-query.service";
import { NotificationsRepository } from "./domain/repositories/notifications.repository";
import { NotificationsCommandService } from "./infrastructure/adapters/notifications-command.service";
import { NotifierQueryController } from "./infrastructure/controllers/notifier-query.controller";


@Global()
@Module({
    imports:[
        MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema}]),
    ],
    providers:[
        NotifierService,
        NotifierGateway,
        ListNotificationsUseCase,
        SaveNotificationUseCase,
        {
            provide:NotificationsPort,
            useClass:NotificationsQueryService
        },
        {
            provide:NotificationsRepository,
            useClass:NotificationsCommandService
        }
    ],
    controllers:[
        NotifierQueryController
    ],
    exports: [
        NotifierService,
        NotificationsPort,
        NotificationsRepository,
        SaveNotificationUseCase
    ] 
})
export class NotifierModule{}