import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { InfluencerSchema } from "./infrastructure/schemas/influencer.schema";
import { InfluencerCommandService } from "./infrastructure/adapters/influencer-command.service";
import { InfluencerRepository } from "./domain/repository/influencer.repository";
import { InfluencerSnapshotSchema } from "./infrastructure/schemas/influencer-snapshot.schema";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            { name: 'Influencer', schema: InfluencerSchema},
            { name: 'InfluencerSnapshot', schema: InfluencerSnapshotSchema},
        ]),
    ],
    providers:[
        {
            useClass:InfluencerCommandService,
            provide:InfluencerRepository
        }
    ],
    controllers:[],
    exports:[
        InfluencerRepository
    ]
})
export class InfluencerModule {}