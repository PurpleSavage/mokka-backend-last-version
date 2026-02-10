import {  HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SharedBase} from "src/shared/infrastructure/schemas/base-shared-document.schema";

export type SharedInfluencerDocument = HydratedDocument<SharedInfluencer>
@Schema()
export class SharedInfluencer extends SharedBase{

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Influencer', required: true,unique: true })
    influencer: MongooseSchema.Types.ObjectId; 
}

export const SharedInfluencerSchema = SchemaFactory.createForClass(SharedInfluencer)

SharedInfluencerSchema.set('timestamps', true)