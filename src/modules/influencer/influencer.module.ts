import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { InfluencerSchema } from "./infrastructure/schemas/influencer.schema";
import { InfluencerCommandService } from "./infrastructure/adapters/influencer-command.service";
import { InfluencerRepository } from "./domain/repository/influencer.repository";
import { InfluencerSnapshotSchema } from "./infrastructure/schemas/influencer-snapshot.schema";
import { BullModule } from "@nestjs/bullmq";
import { CreateInfluencerUseCase } from "./application/use-cases/create-influencer.use-case";
import { InfluencerCommandController } from "./infrastructure/controllers/influencer-command.controller";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            { name: 'Influencer', schema: InfluencerSchema},
            { name: 'InfluencerSnapshot', schema: InfluencerSnapshotSchema},
        ]),
        BullModule.registerQueue({  
            name: 'influencer-snapshot-queue',
                    
        }),
        BullModule.registerQueue({  
            name: 'influencer-scene-queue',
                    
        }),
        BullModule.registerQueue({  
            name: 'influencer-queue',
                    
        })
    ],
    providers:[
        CreateInfluencerUseCase,
        {
            useClass:InfluencerCommandService,
            provide:InfluencerRepository
        }
    ],
    controllers:[
        InfluencerCommandController
    ],
    exports:[
        InfluencerRepository
    ]
})
export class InfluencerModule {}