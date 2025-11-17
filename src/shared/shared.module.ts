import { Global, Module } from "@nestjs/common";
import { JwtPort } from "./application/ports/jwt.port";
import { JwtAuthService } from "./infrastructure/adapters/jwt.service";
import { MultimediaService } from "./infrastructure/adapters/multimedia.service";
import { MultimediaGeneratorPort } from "./application/ports/multimedia-generator.port";
import { SharedMdReaderService } from "./infrastructure/adapters/reader-md.service";
import { StorageService } from "./infrastructure/adapters/storage.service";
import { StorageRepository } from "./domain/repositories/storage.repository";
import { MdReaderPort } from "./application/ports/md-reader.port";
import { DownloadFileService} from "./infrastructure/adapters/download-file.service";
import { DownloadFilePort } from "./application/ports/downlaod-file.port";
import { ConfigService } from "@nestjs/config";
import Redis from 'ioredis';
import { CacheManagerService } from "./infrastructure/adapters/cache-manager.service";
import { CacheManagerPort } from "./application/ports/cache-manager.port";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";

@Global() 
@Module({
    imports: [
        JwtModule.register({
        secret: process.env.JWT_SECRET,
        }),
        HttpModule,
    ],
    providers:[
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
        }
    ],
    exports:[
        MdReaderPort,
        JwtPort,
        MultimediaGeneratorPort,
        StorageRepository,
        DownloadFilePort,
        CacheManagerPort,
        'REDIS_CLIENT'
    ]
})
export class SharedModule{}