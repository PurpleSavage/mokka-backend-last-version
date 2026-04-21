import {  HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SharedBase} from "src/shared/common/infrastructure/schemas/base-shared-document.schema";

export type SharedVideoDocument = HydratedDocument<SharedVideo>
@Schema()
export class SharedVideo extends SharedBase{

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Video', required: true,unique: true })
    video: MongooseSchema.Types.ObjectId; 
}

export const SharedVideoSchema = SchemaFactory.createForClass(SharedVideo)

SharedVideoSchema.set('timestamps', true)