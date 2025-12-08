import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NotifierModule } from "src/notifier/notifier.module";
import { SharedModule } from "src/shared/shared.module";
import { VideoSchema } from "./infrastructure/schemas/video.schema";
import { VideoCommandController } from "./video-command.controller";
import { VideoQueryController } from "./video-query.controller";
import { VideoRepository } from "./domain/repositories/video.repository";
import { VideoCommandService } from "./infrastructure/adapters/video-command.service";


@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            { name: 'Video', schema: VideoSchema},

        ]),
        BullModule.registerQueue({  // registrar cola
            name: 'video-queue',    
        }),
        NotifierModule
    ],
    providers:[
        {
            useClass:VideoCommandService,
            provide:VideoRepository
        }
    ],
    controllers:[
        VideoCommandController,
        VideoQueryController
    ],
    exports:[
       VideoRepository    
    ]
})
export class VideoModule{

}