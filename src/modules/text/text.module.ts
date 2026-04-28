import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { TextSchema } from "./infrastructure/schemas/text.schema";
import { TextCommandService } from "./infrastructure/adapters/text-command.service";
import { TextRepository } from "./domain/repositories/text.repository";
import { TextQueryService } from "./infrastructure/adapters/text-query.service";
import { TextPort } from "./application/ports/text.port";
import { GenerateTextUseCase } from "./application/use-cases/generate-text.use-case";
import { ListTextHistoryUseCase } from "./application/use-cases/list-history-text.use-case";
import { SaveTextUseCase } from "./application/use-cases/save-text.use-case";
import { TextCommandController } from "./infrastructure/controllers/text-command.controller";
import { TextQueryController } from "./infrastructure/controllers/text-query.controller";
import { GenerateTextProcessor } from "./application/jobs/generate-text.processor";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([{ name: 'Text', schema: TextSchema}]),
        BullModule.registerQueue({  // registrar cola
            name: 'text-queue',
        }), 
    ],
    providers:[
        GenerateTextProcessor,
        GenerateTextUseCase,
        ListTextHistoryUseCase,
        SaveTextUseCase,
        {
            useClass:TextCommandService,
            provide:TextRepository
        },
        {
            useClass:TextQueryService,
            provide:TextPort
        },
        
    ],
    controllers:[
        TextCommandController,
        TextQueryController
    ],
    exports:[
        TextPort,
        TextRepository,
    ]
})
export class TextModule{}