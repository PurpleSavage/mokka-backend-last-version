import { Global, Module } from "@nestjs/common";
import { JwtPort } from "./common/application/ports/jwt.port";
import { JwtAuthService } from "./common/infrastructure/adapters/jwt.service";
import { MultimediaGeneratorPort } from "./common/application/ports/multimedia-generator.port";
import { SharedMdReaderService } from "./common/infrastructure/adapters/reader-md.service";
import { StorageService } from "./common/infrastructure/adapters/storage.service";
import { MdReaderPort } from "./common/application/ports/md-reader.port";
import { DownloadFilePort } from "./common/application/ports/downlaod-file.port";
import { ConfigService } from "@nestjs/config";
import Redis from 'ioredis';
import { CacheManagerService } from "./common/infrastructure/adapters/cache-manager.service";
import { CacheManagerPort } from "./common/application/ports/cache-manager.port";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./common/infrastructure/schemas/user.schema";
import { CreditLogicRepository } from "./common/domain/repositories/credits-logic.repository";
import { StorageRepository } from "./common/domain/repositories/storage.repository";
import { MultimediaService } from "./common/infrastructure/adapters/multimedia.service";
import { DownloadFileService } from "./common/infrastructure/adapters/download-file.service";
import { CreditLogicCommandService } from "./common/infrastructure/adapters/credits-logic.service";
import { NotificationsCommandService } from "./notifications/infrastructure/adapters/notifications-command.service";
import { NotificationsRepository } from "./notifications/domain/repositories/notifications.repository";
import { NotificationsQueryService } from "./notifications/infrastructure/adapters/notifications-query.service";
import { NotificationsPort } from "./notifications/application/ports/notifications.port";
import {  NotificationsQueryController } from "./notifications/infrastructure/controllers/notifications-query.controller";
import { NotifierService } from "./notifications/infrastructure/sockets/notifier.service";
import { NotifierGateway } from "./notifications/infrastructure/sockets/notifier.gateway";
import { ListNotificationsUseCase } from "./notifications/application/use-cases/list-notifications.use-case";
import { SaveNotificationUseCase } from "./notifications/application/use-cases/save-notification.use-cae";
import { NotificationSchema } from "./notifications/infrastructure/schemas/notification.schema";
import { NotificationsCommandController } from "./notifications/infrastructure/controllers/notifications-command.controller";
import { ReadNotificationUseClase } from "src/shared/notifications/application/use-cases/read-notification.use-case";
import { ValidateRawSignedContextUseCase } from "./common/application/use-cases/validate-raw-signed-context.use-case";
import { ReplicateValidateRawPort } from "./common/application/use-cases/validate-raw-signed-replicate.port";
import { ValidateReplicateRawService } from "./common/infrastructure/adapters/validate-replicate-raw.service";

@Global() 
@Module({
    imports: [
        JwtModule.register({
        secret: process.env.JWT_SECRET,
        }),
        HttpModule,
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
            { name: 'Notification', schema: NotificationSchema}
        ]),
    ],
    controllers:[
        NotificationsQueryController,
        NotificationsCommandController
    ],
    providers:[
        NotifierService,
        NotifierGateway,
        ListNotificationsUseCase,
        SaveNotificationUseCase,
        ReadNotificationUseClase,
        ValidateRawSignedContextUseCase,
        {
            useClass:SharedMdReaderService,
            provide:MdReaderPort
        },
        {
            useClass:JwtAuthService,
            provide:JwtPort
        },
        {
            useClass:MultimediaService,
            provide:MultimediaGeneratorPort
        },
        {
            useClass:StorageService,
            provide:StorageRepository
        },
        {
            useClass:DownloadFileService,
            provide:DownloadFilePort
        },
        {
            useClass:CacheManagerService,
            provide:CacheManagerPort
        },
        {
            useClass:CreditLogicCommandService,
            provide:CreditLogicRepository,
        },
        {
            useClass:NotificationsCommandService,
            provide:NotificationsRepository,
        },
        {
            useClass:NotificationsQueryService,
            provide:NotificationsPort
        },
        {
            useClass:ValidateReplicateRawService,
            provide:ReplicateValidateRawPort
        },
        {
            provide: 'REDIS_CLIENT',
            useFactory:(configService: ConfigService) => {
                const client = new Redis({
                host: configService.get('REDIS_URL', 'localhost'),
                port: 6379,
                });

                client.on('connect', () => {
                console.log('✅ Conectado a Redis');
                });

                client.on('error', (err) => {
                console.error('❌ Error en Redis:', err);
                });

                return client;
            },
            inject: [ConfigService]
        },
    ],
    exports:[
        MdReaderPort,
        JwtPort,
        MultimediaGeneratorPort,
        StorageRepository,
        DownloadFilePort,
        CacheManagerPort,
        'REDIS_CLIENT',
        CreditLogicRepository,
        NotifierService,
        NotificationsRepository,
        SaveNotificationUseCase,
        NotificationsPort,
        ValidateRawSignedContextUseCase,
        ReplicateValidateRawPort
    ]
})
export class SharedModule{}