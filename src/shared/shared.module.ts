import { Global, Module } from "@nestjs/common";
import { JwtPort } from "./application/ports/jwt.port";
import { JwtAuthService } from "./infrastructure/adapters/jwt.service";
import { MultimediaService } from "./infrastructure/adapters/multimedia.service";
import { MultimediaGeneratorPort } from "./application/ports/multimedia-generator.port";
import { SharedMdReaderService } from "./infrastructure/adapters/reader-md.service";
import { StorageService } from "./infrastructure/adapters/storage.service";
import { StorageRepository } from "./domain/repositories/storage.repository";
import { MdReaderPort } from "./application/ports/md-reader.port";


@Global() 
@Module({

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
        }
    ],
    exports:[
        MdReaderPort,
        JwtPort,
        MultimediaGeneratorPort,
        StorageRepository
    ]
})
export class SharedModule{}