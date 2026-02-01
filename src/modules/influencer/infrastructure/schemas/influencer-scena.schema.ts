import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Schema as MongooseSchema } from 'mongoose';

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
    duration:number

}

export const InfluencerScenaSchema= SchemaFactory.createForClass(InfluencerScena)
InfluencerScenaSchema.set('timestamps',true)