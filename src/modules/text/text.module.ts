import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { TextSchema } from "./infrastructure/schemas/text.schema";
import { TextCommandController } from "./text-command.controller";
import { TextQueryController } from "./text-query.controller";
import { TextCommandService } from "./infrastructure/adapters/text-command.service";
import { TextRepository } from "./domain/repositories/text.repository";
import { TextQueryService } from "./infrastructure/adapters/text-query.service";
import { TextPort } from "./application/ports/text.port";
import { TextGeneratorService } from "./infrastructure/adapters/text-generator.service";
import { TextGeneratorPort } from "./application/ports/text-generator.port";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([{ name: 'Text', schema: TextSchema}]),
        BullModule.registerQueue({  // registrar cola
            name: 'text-queue',
        }),         
    ],
    providers:[
        {
            useClass:TextCommandService,
            provide:TextRepository
        },
        {
            useClass:TextQueryService,
            provide:TextPort
        },
        {
            useClass:TextGeneratorService,
            provide:TextGeneratorPort
        }
    ],
    controllers:[
        TextCommandController,
        TextQueryController
    ],
    exports:[
        TextPort,
        TextRepository,
        TextGeneratorPort   
    ]
})
export class TextModule{}