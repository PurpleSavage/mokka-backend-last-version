import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { TextSchema } from "./infrastructure/schemas/text.schema";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([{ name: 'Audio', schema: TextSchema}]),
        BullModule.registerQueue({  // registrar cola
            name: 'audio-queue',
        }),         
    ],
    providers:[
            
    ],
    controllers:[
            
    ],
    exports:[
           
    ]
})
export class TextModule{}