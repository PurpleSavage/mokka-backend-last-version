import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { AspectRatioImage } from "../../../../shared/infrastructure/enums/image-aspect-ratio";


export type RemixImageDocument = HydratedDocument<RemixImage>;

@Schema()
export class RemixImage{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Image', required: true})
    imageBase:MongooseSchema.Types.ObjectId;

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

    @Prop({required:true})
    prevImageUrl:string;

    @Prop({required:true,enum:AspectRatioImage})
    aspectRatio:AspectRatioImage

    @Prop({required:true})  //peso de la imagen
    size:string
}

export const RemixImageSchema = SchemaFactory.createForClass(RemixImage);
RemixImageSchema.set('timestamps', true);