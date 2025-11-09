import { Module } from "@nestjs/common";
import { ImageQueryController } from "./image-query.controller";
import { ImageCommandController } from "./image-command.controller";
import { SharedModule } from "src/shared/shared.module";
import { MongooseModule } from "@nestjs/mongoose";
import { BullModule } from "@nestjs/bullmq";
import { NotifierModule } from "src/notifier/notifier.module";
import { ImageSchema } from "./infrastructure/schemas/image.schema";
import { ImageSharedSchema } from "./infrastructure/schemas/image-shared.schema";
import { ImageQueryService } from "./infrastructure/adapters/image-query.service";
import { ImagePort } from "./application/ports/image.port";
import { ListSharedImageUseCase } from "./application/use-cases/list-shared-image.use-case";
import { ListImagesUseCase } from "./application/use-cases/list-images.use-case";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            { name: 'Image', schema: ImageSchema},
            {name:'ImageShared',schema:ImageSharedSchema}
        ]),
        BullModule.registerQueue({  // registrar cola
            name: 'image-queue',
        }),
        NotifierModule
    ],
    providers:[
        ListSharedImageUseCase,
        ListImagesUseCase,
        {
            useClass:ImageQueryService,
            provide:ImagePort
        }
    ],
    controllers:[
        ImageQueryController,
        ImageCommandController
    ],
    exports:[

    ]
})
export class ImageModule{}