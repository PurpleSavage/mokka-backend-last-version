import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {  AspectRatioImage } from "../../domain/enums/image-aspect-ratio";
import { TypeStyle } from "../../domain/enums/image-styles";
import { TypeSubStyle } from "../../domain/enums/image-substyle";

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    prompt:string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({required:true})
    width:number;

    @Prop({required:true})
    height:number;

    @Prop({required:true})
    imageUrl:string;

    @Prop({required:true,enum:AspectRatioImage})
    aspectRatio:AspectRatioImage

    @Prop({required:true})  //peso de la imagen
    size:string

    @Prop({required:true,enum:TypeStyle})
    style:TypeStyle

    @Prop({required:true,enum:TypeSubStyle})
    subStyle:TypeSubStyle
}

export const ImageSchema = SchemaFactory.createForClass(Image);
ImageSchema.set('timestamps', true);