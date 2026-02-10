import {  HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SharedBase} from "src/shared/infrastructure/schemas/base-shared-document.schema";

export type SharedSnapshotDocument = HydratedDocument<SharedSnapshot>
@Schema()
export class SharedSnapshot extends SharedBase{

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'InfluencerSnapshot', required: true,unique: true })
    snapshot: MongooseSchema.Types.ObjectId; 
}

export const SharedSnapshotSchema = SchemaFactory.createForClass(SharedSnapshot)

SharedSnapshotSchema.set('timestamps', true)