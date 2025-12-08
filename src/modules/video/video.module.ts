import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NotifierModule } from "src/notifier/notifier.module";
import { SharedModule } from "src/shared/shared.module";
import { VideoSchema } from "./infrastructure/schemas/video.schema";
import { VideoCommandController } from "./video-command.controller";
import { VideoQueryController } from "./video-query.controller";


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
            
    ],
    controllers:[
        VideoCommandController,
        VideoQueryController
    ],
    exports:[
           
    ]
})
export class VideoModule{

}