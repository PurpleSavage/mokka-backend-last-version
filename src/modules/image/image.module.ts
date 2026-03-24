import { Module } from "@nestjs/common";
import { SharedModule } from "src/shared/shared.module";
import { MongooseModule } from "@nestjs/mongoose";
import { BullModule } from "@nestjs/bullmq";
import { ImageSchema } from "./infrastructure/schemas/image.schema";
import { ImageQueryService } from "./infrastructure/adapters/image-query.service";
import { ImagePort } from "./application/ports/image.port";
import { ListSharedImageUseCase } from "./application/use-cases/list-shared-image.use-case";
import { ListImagesUseCase } from "./application/use-cases/list-images.use-case";
import { ImageCommandService } from "./infrastructure/adapters/image-command.service";
import { ImageRepository } from "./domain/repositories/image.repository";
import { UpdateDownloadsSharedImageUseCase } from "./application/use-cases/update-downloads-shared-image.use-case";
import { ShareImageUseCase } from "./application/use-cases/shared-image.use-case";
import { CreateRemixImageUseCase } from "./application/use-cases/create-remix-image.use-case";
import { RemixImageSchema } from "./infrastructure/schemas/remix-image.schema";
import { GenerateImageUseCase } from "./application/use-cases/generate-image.use-case";
import { ImageCommandController } from "./infrastructure/controllers/image-command.controller";
import { ImageQueryController } from "./infrastructure/controllers/image-query.controller";
import { SharedImageSchema } from "./infrastructure/schemas/image-shared.schema";
import { SaveImageUseCase } from "./application/use-cases/save-image.use-case";
import { SaveRemixImageUseCase } from "./application/use-cases/save-remix-image.use-case";
import { RemixImageProcessor } from "./application/jobs/create-remix.processor";
import { ImageProcessor } from "./application/jobs/generate-image.processor";
import { ListImagesLastWeekUseCase } from "./application/use-cases/list-images-last-week.use-case";


@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            { name: 'Image', schema: ImageSchema},
            {name:'ImageShared',schema:SharedImageSchema}, 
            {name:'RemixImage',schema:RemixImageSchema}
        ]),
        BullModule.registerQueue({  // registrar cola
            name: 'image-queue',
            
        }),
        BullModule.registerQueue({              // ← Agrega esta cola
            name: 'remix-image-queue',
        }),

    ],
    providers:[
        RemixImageProcessor,
        ImageProcessor,
        ListSharedImageUseCase,
        ListImagesLastWeekUseCase,
        ListImagesUseCase,
        UpdateDownloadsSharedImageUseCase,
        ShareImageUseCase,
        GenerateImageUseCase,
        CreateRemixImageUseCase,
        SaveImageUseCase,
        SaveRemixImageUseCase,
        {
            useClass:ImageQueryService,
            provide:ImagePort
        },
        {
            useClass:ImageCommandService,
            provide:ImageRepository
        }
    ],
    controllers:[
        ImageQueryController,
        ImageCommandController
    ],
    exports:[
        ImageRepository,
        ImagePort
    ]
})
export class ImageModule{}