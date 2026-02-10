import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Schema as MongooseSchema } from 'mongoose';
import { VideoAspectRatio } from "src/shared/domain/enums/video-aspectratio";

export type InfluencerScenaDocument = HydratedDocument<InfluencerScena>
@Schema()
export class InfluencerScena{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({required:true})
    urlScene:string

    @Prop({required:true})
    prompt:string
  
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Influencer', required: true })
    influencer: MongooseSchema.Types.ObjectId;

    @Prop({required:true, default:false})
    volume:boolean

    @Prop({required:true})
    imageBaseUrls:string[]

    @Prop({required:true,enum:VideoAspectRatio})
    aspectRatio:VideoAspectRatio

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const InfluencerScenaSchema= SchemaFactory.createForClass(InfluencerScena)
InfluencerScenaSchema.set('timestamps',true)