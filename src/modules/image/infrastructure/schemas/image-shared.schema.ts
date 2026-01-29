import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  HydratedDocument, Schema as MongooseSchema } from "mongoose";


export type ImageSharedDocument = HydratedDocument<ImageShared>
@Schema()
export class ImageShared{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: true,unique: true })
    image: MongooseSchema.Types.ObjectId; // referencia a la imagen

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    sharedBy: MongooseSchema.Types.ObjectId; // referencia al usuario

    @Prop({ default: 0 })
    remixes: number;

    @Prop({default:0})
    downloads:number
}

export const ImageSharedSchema = SchemaFactory.createForClass(ImageShared)

ImageSharedSchema.set('timestamps', true)
