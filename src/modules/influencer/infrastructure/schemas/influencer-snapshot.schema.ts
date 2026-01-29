import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument} from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Environment } from '../../domain/enums/valid-eviroments';
import { OutfitType } from '../../domain/enums/valid-outfits';




export type InfluencerSnapshotDocument = HydratedDocument<InfluencerSnapshot>


@Schema()
export class InfluencerSnapshot{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Influencer', required: true })
    influencer: MongooseSchema.Types.ObjectId;

    @Prop({required:true})
    snapshotUrl: string;
    
    @Prop({required:true})
    prompt:string

    @Prop({required:true, enum:Environment})
    enviroment:Environment

    @Prop({required:true,enum:OutfitType})
    outfitStyle:OutfitType

    @Prop({ default: Date.now })
    createdAt: Date;

}

export const InfluencerSnapshotSchema = SchemaFactory.createForClass(InfluencerSnapshot);
InfluencerSnapshotSchema.set('timestamps', true);