import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { AspectRatioImage } from "../../../../shared/common/infrastructure/enums/image-aspect-ratio";


export type RemixImageDocument = HydratedDocument<RemixImage>;

@Schema()
export class RemixImage{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Image', required: true})
    imageBase:MongooseSchema.Types.ObjectId;

    @Prop({ required: true,type: String })
    prompt:string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({required:true})
    width:number;

    @Prop({required:true})
    height:number;

    @Prop({required:true,type: String})
    imageUrl:string;

    @Prop({required:true,type: String})
    prevImageUrl:string;

    @Prop({required:true,enum:AspectRatioImage,type: String})
    aspectRatio:AspectRatioImage

    @Prop({required:true,type: String})  //peso de la imagen
    size:string
}

export const RemixImageSchema = SchemaFactory.createForClass(RemixImage);
RemixImageSchema.set('timestamps', true);