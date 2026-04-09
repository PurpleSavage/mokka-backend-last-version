import { Module } from "@nestjs/common";
import { List3DModelsUseCase } from "./application/use-cases/list-3d-models.use-case";
import { SharedModule } from "src/shared/shared.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Model3DSchema } from "./infrastructure/schemas/3d-model.schema";
import { Mockups3DQueryService } from "./infrastructure/adapters/mockups-3d-query.service";
import { Mockups3DPort } from "./application/ports/mockups-3d.port";
import { Mockups3DQueryController } from "./infrastructure/controllers/mockups-3d-query.controller";
import { BackgroundMockupSchema } from "./infrastructure/schemas/background-mockup.schema";
import { ListBackgroundsUseCase } from "./application/use-cases/list-backgrounds.use-case";


@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([
            { name: 'MODEL_3D_ENTITY', schema: Model3DSchema},
            {name:'background-mockup',schema:BackgroundMockupSchema}
            
        ]),
    ],
    controllers:[Mockups3DQueryController],
    providers:[
        List3DModelsUseCase,
        ListBackgroundsUseCase,
        {
            useClass:Mockups3DQueryService,
            provide:Mockups3DPort
        }
    ],
    exports:[
        Mockups3DPort
    ]
})
export class Mockups3DModule{}