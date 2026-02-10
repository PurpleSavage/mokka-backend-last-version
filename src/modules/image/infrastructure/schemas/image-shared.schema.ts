import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SharedBase } from "src/shared/infrastructure/schemas/base-shared-document.schema";


export type SharedImageDocument = HydratedDocument<SharedImage>
@Schema()
export class SharedImage extends SharedBase{

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: true,unique: true })
    image: MongooseSchema.Types.ObjectId;
    
}

export const SharedImageSchema = SchemaFactory.createForClass(SharedImage)

SharedImageSchema.set('timestamps', true)
