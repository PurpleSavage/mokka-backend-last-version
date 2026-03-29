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
import { AudioCommandController } from "./infrastructura/controllers/audio-command.controller";
import { AudioQueryController } from "./infrastructura/controllers/audio-query.controller";
import { AudioProcessor } from "./application/jobs/generate-audio.processor";
import { SaveAudioUseCase } from "./application/use-cases/save-audio.use-case";
import { MusicSchema } from "./infrastructura/schemas/music.schema";
import { SaveMusicUseCase } from "./application/use-cases/save-music.use-case";
import { MusicRepository } from "./domain/repositories/music.repository";
import { MusicCommandService } from "./infrastructura/adapters/music-command.service";
import { GenerateMusicUseCase } from "./application/use-cases/generate-music.use-case";
import { MusicProcessor } from "./application/jobs/generate-music.processor";
import { MusicCommandController } from "./infrastructura/controllers/music-command.controller";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            { name: 'Audio', schema: AudioSchema},
            { name: 'Music', schema: MusicSchema}
        ]),
        BullModule.registerQueue({  // registrar cola
            name: 'audio-queue',
        }),
        BullModule.registerQueue({  
            name: 'music-queue',
                            
        }),
    ],
    providers:[
        AudioProcessor,
        MusicProcessor,
        GenerateAudioUseCase,
        ListAudiosUseCase,
        SaveAudioUseCase,
        SaveMusicUseCase,
        GenerateMusicUseCase,
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
        },
        {
            useClass:MusicCommandService,
            provide:MusicRepository
        }
    ],
    controllers:[
        AudioCommandController,
        AudioQueryController,
        MusicCommandController
    ],
    exports:[
        AudioPort,
        AudioRepository,
        AudioGeneratorPort,
        MusicRepository
    ]
})
export class AudioModule{}