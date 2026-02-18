import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { AudioSchema } from "./infrastructura/schemas/audio.schema";
import { AudioCommandService } from "./infrastructura/adapters/audio-command.service";
import { AudioPort } from "./application/ports/audio.port";
import { AudioQueryService } from "./infrastructura/adapters/audio-query.service";
import { AudioRepository } from "./domain/repositories/audio.repository";
import { AudioGeneratorService } from "./infrastructura/adapters/audio-generator.service";
import { AudioGeneratorPort } from "./application/ports/audio-generator.port";
import { GenerateAudioUseCase } from "./application/use-cases/generate-audio.use-case";
import { ListAudiosUseCase } from "./application/use-cases/list-audios.use-case";
import { BullModule } from "@nestjs/bullmq";
import { NotifierModule } from "src/notifier/notifier.module";
import { AudioCommandController } from "./infrastructura/controllers/audio-command.controller";
import { AudioQueryController } from "./infrastructura/controllers/audio-query.controller";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([{ name: 'Audio', schema: AudioSchema}]),
        BullModule.registerQueue({  // registrar cola
            name: 'audio-queue',
        }),
        NotifierModule
    ],
    providers:[
        GenerateAudioUseCase,
        ListAudiosUseCase,
        {
            useClass:AudioCommandService,
            provide:AudioRepository
        },
        {
            useClass:AudioQueryService,
            provide:AudioPort
        },
        {
            useClass:AudioGeneratorService,
            provide:AudioGeneratorPort
        }
    ],
    controllers:[
        AudioCommandController,
        AudioQueryController,
    ],
    exports:[
        AudioPort,
        AudioRepository,
        AudioGeneratorPort
    ]
})
export class AudioModule{}