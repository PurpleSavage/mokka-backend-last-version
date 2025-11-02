import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { AudioSchema } from "./infrastructura/schemas/audio.schema";
import { AudioCommandController } from "./audio-command.controller";
import { AudioQueryController } from "./audio-query.controller";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([{ name: 'Audio', schema: AudioSchema}]),

    ],
    providers:[],
    controllers:[
        AudioCommandController,
        AudioQueryController
    ],
    exports:[]
})
export class AudioModule{}