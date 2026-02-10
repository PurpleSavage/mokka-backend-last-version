import {  HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SharedBase} from "src/shared/infrastructure/schemas/base-shared-document.schema";

export type SharedSceneDocument = HydratedDocument<SharedScene>
@Schema()
export class SharedScene extends SharedBase{

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'InfluencerScene', required: true,unique: true })
    scene: MongooseSchema.Types.ObjectId; 
}

export const SharedSceneSchema = SchemaFactory.createForClass(SharedScene)

SharedSceneSchema.set('timestamps', true)