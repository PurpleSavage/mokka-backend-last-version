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
import { CreateInFluencerSceneUseCase } from "./application/use-cases/create-influencer-scene.use-case";
import { CreateInfluencerSnapshotUseCase } from "./application/use-cases/create-influencer-snapshot.use-case";
import { InfluencerScenaSchema } from "./infrastructure/schemas/influencer-scena.schema";
import { InfluencerQueryService } from "./infrastructure/adapters/influencer-query.service";
import { InfluencerPort } from "./application/ports/influencer.port";
import { GetInfluencerByIdUseCase } from "./application/use-cases/get-influencer-by-id.use-case";
import { GetSnapshotByIdUseCase } from "./application/use-cases/get-snapshot-by-id.use-case";
import { ListHistoryScenesLastWeek } from "./application/use-cases/list-history-scenes-last-week.use-case";
import { ListHistoryScenesUseCase } from "./application/use-cases/list-history-scenes.use-case";
import { ListHistorySnapshotsUseCase } from "./application/use-cases/list-history-snapshots.use-case";
import { ListSnapshotLastWeekUseCase } from "./application/use-cases/list-snapshot-last-week.use-case";
import { InfluencerQueryController } from "./infrastructure/controllers/influencer-query.controller";
import { SharedSnapshotSchema } from "./infrastructure/schemas/snapshot-shared.schema";
import { SharedSceneSchema } from "./infrastructure/schemas/scene-shared.schema";
import { SharedInfluencerSchema } from "./infrastructure/schemas/influencer-shared.schema";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            { name: 'Influencer', schema: InfluencerSchema},
            { name: 'InfluencerSnapshot', schema: InfluencerSnapshotSchema},
            { name: 'InfluencerScene', schema: InfluencerScenaSchema},
            {name:'SharedSnapshot',schema:SharedSnapshotSchema},
            {name:'SharedScene',schema:SharedSceneSchema},
            {name:'SharedInfluencer',schema:SharedInfluencerSchema}
        ]),
        BullModule.registerQueue({  
            name: 'influencer-snapshot-queue',
                    
        }),
        BullModule.registerQueue({  
            name: 'influencer-scene-queue',
                    
        }),
        BullModule.registerQueue({  
            name: 'influencer-queue',
                    
        }),
        BullModule.registerQueue({
            name:'influencer-snapshot-queue'
        })
    ],
    providers:[
        CreateInfluencerUseCase,
        CreateInFluencerSceneUseCase,
        CreateInfluencerSnapshotUseCase,
        GetInfluencerByIdUseCase,
        GetSnapshotByIdUseCase,
        ListHistoryScenesLastWeek,
        ListHistoryScenesUseCase,
        ListHistorySnapshotsUseCase,
        ListSnapshotLastWeekUseCase,
        {
            useClass:InfluencerCommandService,
            provide:InfluencerRepository
        },
        {
            useClass:InfluencerQueryService,
            provide:InfluencerPort
        }
    ],
    controllers:[
        InfluencerCommandController,
        InfluencerQueryController
    ],
    exports:[
        InfluencerRepository,
        InfluencerPort
    ]
})
export class InfluencerModule {}