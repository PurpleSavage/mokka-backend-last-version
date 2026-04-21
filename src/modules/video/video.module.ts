import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { VideoSchema } from "./infrastructure/schemas/video.schema";

import { VideoQueryController } from "./infrastructure/controllers/video-query.controller";
import { VideoRepository } from "./domain/repositories/video.repository";
import { VideoCommandService } from "./infrastructure/adapters/video-command.service";
import { VideoQueryService } from "./infrastructure/adapters/video-query.service";
import { VideoPort } from "./application/ports/video.port";
import { GenerateVideoUseCase } from "./application/use-cases/generate-video.use-case";
import { ListVideosUseCase } from "./application/use-cases/list-video.use-case";
import { VideoCommandController } from "./infrastructure/controllers/video-command.controller";
import { SaveVideoUseCase } from "./application/use-cases/save-video.use-case";
import { GenerateVideoProcessor } from "./application/jobs/generate-video.processor";
import { SharedVideoSchema } from "./infrastructure/schemas/video-shared.schema";
import { ShareVideoUseCase } from "./application/use-cases/share-video.use-case";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            { name: 'Video', schema: VideoSchema},
            {name:'SharedVideo', schema:SharedVideoSchema}
        ]),
        BullModule.registerQueue({              // ← Agrega esta cola
            name: 'remix-video-queue',
        }),
        BullModule.registerQueue({  // registrar cola
            name: 'video-queue',    
        }),
    ],
    providers:[
        GenerateVideoProcessor,
        GenerateVideoUseCase,
        ListVideosUseCase,
        SaveVideoUseCase,
        ShareVideoUseCase,
        {
            useClass:VideoCommandService,
            provide:VideoRepository
        },
        {
            useClass:VideoQueryService,
            provide:VideoPort
        }
    ],
    controllers:[
        VideoCommandController,
        VideoQueryController
    ],
    exports:[
       VideoRepository,
       VideoPort    
    ]
})
export class VideoModule{

}